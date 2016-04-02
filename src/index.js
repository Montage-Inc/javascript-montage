import fetch from 'isomorphic-fetch';
import querystring from 'querystring';
import _ from 'lodash';
import { DocumentsAPI, SchemaAPI, UserAPI, RoleAPI } from './api';


/**
 * Count bytes in a string's UTF-8 representation.
 *
 * [Reference]{@link http://codereview.stackexchange.com/a/37552}
 *
 * @param {string} normal_val
 * @return {int}
 */
function getByteLen(normal_val) {
	// Force string type
	normal_val = String(normal_val);

	var byteLen = 0;
	for (var i = 0; i < normal_val.length; i++) {
		var c = normal_val.charCodeAt(i);
		byteLen += c < (1 <<  7) ? 1 :
		           c < (1 << 11) ? 2 :
		           c < (1 << 16) ? 3 :
		           c < (1 << 21) ? 4 :
		           c < (1 << 26) ? 5 :
		           c < (1 << 31) ? 6 : Number.NaN;
	}
	return byteLen;
}

export class Client {
	constructor(params = {}) {
		params.api_version = params.api_version || 1;
		this.params = params;
		if (this.params.url) {
			this.url_prefix = this.params.url;
		} else if (this.params.dev) {
			this.url_prefix = `http://${params.domain}.dev.montagehot.club/api/v${params.api_version}/`;
		} else {
			this.url_prefix = `https://${params.domain}.mntge.com/api/v${params.api_version}/`;
		}

		this.documents = new DocumentsAPI(this);
		this.schemas = new SchemaAPI(this);
		this.users = new UserAPI(this);
		this.roles = new RoleAPI(this);
	}

	files(formData) {
		return this.request(`files/`,'POST', formData, true);
	}

	auth() {
		return this.request("auth/", "POST", {
			username: this.params.username,
			password: this.params.password,
		}).then(response => {
			this.params.token = response.data.token;
			return response;
		});
	}

	request(url, method, data, file) {
		var options = {
			method: method && method.toUpperCase() || "GET",
			headers: {
				accept: 'application/json',
				'X-Requested-With': 'XMLHttpRequest',
			}
		}
		if (!file) {
			options.headers['Content-Type'] = 'application/json';
		}
		if (data) {
			if (options.method === "GET") {
				url += '?' + querystring.stringify(data);
			} else {
				if(file) options.body = data
				else options.body = JSON.stringify(data);
			}
		}
		if (this.params.token) {
			options.headers.Authorization = `Token ${this.params.token}`;
		}
		if (options.body) {
			//Varnish and heroku require a content length!
			options.headers['Content-Length'] = getByteLen(options.body);
		}
		var reqUrl = `${this.url_prefix}${url}`
		return this._agent(reqUrl, options).then(function(response) {
			if (!response.ok) {
				response.request = _.merge({
					url: reqUrl,
				}, options);
				return Promise.reject(response);
			}
			if (response.status >= 400) {
				return response.text().then(body => {
					var errorMessage = body || response.statusText;
					try {
						errorMessage = JSON.parse(body);
					} catch (e) {}
					return Promise.reject(errorMessage);
				});
			}
			return response.json();
		}).then(function(payload) {
			if (payload && payload.errors) {
				return Promise.reject(payload.errors);
			}
			return payload;
		});
	}

	_agent(...args) {
		return fetch(...args);
	}

	// TODO files api
}

export class Query {
	constructor(schemaName, state) {
		if (!schemaName) throw "Schema name is required";

		this.schemaName = schemaName;

		state = state || {
				'$schema': schemaName,
				'$query': [
					['$filter', []]
				]
			}
		this._state = state;
	}

	_merge(delta) {
		var state = _.merge({}, this._state, delta);
		return new Query(this.schemaName, state);
	}

	_mergeArray(delta, prepend = false) {
		var index = _.findIndex(this._state['$query'], (item) => {
			return item[0] === delta[0];
		});

		if (index !== -1) {
			this._state['$query'][index] = delta;
		} else {
			if (prepend) {
				this._state['$query'].unshift(delta);
			} else {
				this._state['$query'].push(delta);
			}
		}

		return new Query(this.schemaName, this._state);
	}

	limit(num) {
		return this._mergeArray(['$limit', num]);
	}

	offset(num) {
		return this._mergeArray(['$offset', num]);
	}

	order(order_by, ordering) {
		var parsedOrder;
		if(_.isString(ordering)) {
			parsedOrder = `$${ordering}`;
		} else {
			parsedOrder = ordering < 0 ? "$desc" : "$asc";
		}

		return this._mergeArray(['$order_by', [parsedOrder, order_by]]);
	}

	pluck(fields) {
		return this._mergeArray(['$pluck', fields]);
	}

	without(fields) {
		return this._mergeArray(['$without', fields]);
	}

	pageSize(size) {
		return this._mergeArray(['$limit', size]);
	}

	index(indexName) {
		return this._mergeArray(['$index', indexName]);
	}

	filter(params) {
		var filterIndex = _.findIndex(this._state['$query'], (item) => {
			return item[0] === '$filter';
		});
		var filters = this._state['$query'][filterIndex];

		Object.keys(params).forEach((key) => {
			var [field, operator] = key.split("__");
			var queryField = operator ? [`$${operator}`, params[key]] : params[key];

			filters[1].push([field, queryField]);
		})

		return this._mergeArray(filters);
	}

	where(params) {
		//alias
		return this.filter(params);
	}

	between(params) {
		if (params && params.from && params.to) {
			return this._mergeArray(['$between', [params.from, params.to, params.index]], true)
		}
		return this;
	}

	toJS() {
		return this._state;
	}
}
