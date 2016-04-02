import fetch from 'isomorphic-fetch';
import querystring from 'querystring';
import _ from 'lodash';

import DocumentsAPI from './api/documents';
import FileAPI from './api/file';
import RoleAPI from './api/role';
import SchemaAPI from './api/schema';
import UserAPI from './api/user';

export default class Client {
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
		this.files = new FileAPI(this);
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
			if(response.status === 204) {
				return;
			}
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
