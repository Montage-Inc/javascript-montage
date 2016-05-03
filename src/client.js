import fetch from 'isomorphic-fetch';
import querystring from 'querystring';
import _ from 'lodash';

import DocumentAPI from './api/document';
import FileAPI from './api/file';
import RoleAPI from './api/role';
import SchemaAPI from './api/schema';
import UserAPI from './api/user';
import PolicyAPI from './api/policy';

export default class Client {
	constructor(subdomain, token) {
		this.host = 'mntge.com';
		this.subdomain = subdomain;
		this.token = token;

		this.documents = new DocumentAPI(this);
		this.schemas = new SchemaAPI(this);
		this.users = new UserAPI(this);
		this.roles = new RoleAPI(this);
		this.files = new FileAPI(this);
		this.policy = new PolicyAPI(this);
	}

	url(endpoint) {
		return `https://${this.subdomain}.${this.host}/api/v1/${endpoint}`;
	}

	authenticate(email, password) {
		return this.request('user/', 'POST', {
			username: email,
			password: password
		}).then(response => {
			this.token = response.data.token;
			return response;
		});
	}

	user() {
		if(this.token) {
			return this.request('user/');
		}

		return Promise.reject('The current user is not authenticated.')
	}

	execute(queries) {
		var querySet = {};

		for(var key in queries) {
			if(queries.hasOwnProperty(key)) {
				querySet[key] = queries[key].toJS();
			}
		}

		return this.request('execute/', 'POST', querySet);
	}

	request(endpoint, method, data, file) {
		var requestUrl = this.url(endpoint);

		var options = {
			method: method && method.toUpperCase() || "GET",
			headers: {
				accept: 'application/json',
				'X-Requested-With': 'XMLHttpRequest'
			}
		};
		if (!file) {
			options.headers['Content-Type'] = 'application/json';
		}
		if (data) {
			if (options.method === "GET") {
				requestUrl += '?' + querystring.stringify(data);
			} else {
				if(file) options.body = data;
				else options.body = JSON.stringify(data);
			}
		}
		if (this.token) {
			options.headers.Authorization = `Token ${this.token}`;
		}
		if (options.body) {
			//Varnish and heroku require a content length!
			options.headers['Content-Length'] = getByteLen(options.body);
		}

		return this._agent(requestUrl, options).then(function(response) {
			if(response.status === 204) {
				return;
			}
			if (!response.ok) {
				response.request = _.merge({
					url: requestUrl
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
}

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
