'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _isomorphicFetch = require('isomorphic-fetch');

var _isomorphicFetch2 = _interopRequireDefault(_isomorphicFetch);

var _querystring = require('querystring');

var _querystring2 = _interopRequireDefault(_querystring);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

require('babel-polyfill');

var _document = require('./api/document');

var _document2 = _interopRequireDefault(_document);

var _file = require('./api/file');

var _file2 = _interopRequireDefault(_file);

var _role = require('./api/role');

var _role2 = _interopRequireDefault(_role);

var _schema = require('./api/schema');

var _schema2 = _interopRequireDefault(_schema);

var _user = require('./api/user');

var _user2 = _interopRequireDefault(_user);

var _policy = require('./api/policy');

var _policy2 = _interopRequireDefault(_policy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Client = function () {
	function Client(project, token) {
		(0, _classCallCheck3.default)(this, Client);

		this.protocol = 'https';
		this.host = 'mntge.com';
		this.project = project;
		this.token = token;

		this.documents = new _document2.default(this);
		this.schemas = new _schema2.default(this);
		this.users = new _user2.default(this);
		this.roles = new _role2.default(this);
		this.files = new _file2.default(this);
		this.policy = new _policy2.default(this);
	}

	(0, _createClass3.default)(Client, [{
		key: 'url',
		value: function url(endpoint) {
			return this.protocol + '://' + this.project + '.' + this.host + '/api/v1/' + endpoint;
		}
	}, {
		key: 'authenticate',
		value: function authenticate(email, password) {
			var _this = this;

			return this.request('user/', 'POST', {
				username: email,
				password: password
			}).then(function (response) {
				_this.token = response.data.token;
				return response;
			});
		}
	}, {
		key: 'user',
		value: function user() {
			if (this.token) {
				return this.request('user/');
			}

			return _promise2.default.reject('The current user is not authenticated.');
		}
	}, {
		key: 'execute',
		value: function execute(queries) {
			var querySet = {};

			for (var key in queries) {
				if (queries.hasOwnProperty(key)) {
					querySet[key] = queries[key].toJS();
				}
			}

			return this.request('execute/', 'POST', querySet);
		}
	}, {
		key: 'request',
		value: function request(endpoint, method, data, file) {
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
					requestUrl += '?' + _querystring2.default.stringify(data);
				} else {
					if (file) options.body = data;else options.body = (0, _stringify2.default)(data);
				}
			}
			if (this.token) {
				options.headers.Authorization = 'Token ' + this.token;
			}
			if (options.body) {
				//Varnish and heroku require a content length!
				options.headers['Content-Length'] = getByteLen(options.body);
			}

			return this._agent(requestUrl, options).then(function (response) {
				if (response.status === 204) {
					return;
				}
				if (!response.ok) {
					response.request = _lodash2.default.merge({
						url: requestUrl
					}, options);
					return _promise2.default.reject(response);
				}
				if (response.status >= 400) {
					return response.text().then(function (body) {
						var errorMessage = body || response.statusText;
						try {
							errorMessage = JSON.parse(body);
						} catch (e) {}
						return _promise2.default.reject(errorMessage);
					});
				}
				return response.json();
			}).then(function (payload) {
				if (payload && payload.errors) {
					return _promise2.default.reject(payload.errors);
				}
				return payload;
			});
		}
	}, {
		key: '_agent',
		value: function _agent() {
			return _isomorphicFetch2.default.apply(undefined, arguments);
		}
	}]);
	return Client;
}();

/**
 * Count bytes in a string's UTF-8 representation.
 *
 * [Reference]{@link http://codereview.stackexchange.com/a/37552}
 *
 * @param {string} normal_val
 * @return {int}
 */


exports.default = Client;
function getByteLen(normal_val) {
	// Force string type
	normal_val = String(normal_val);

	var byteLen = 0;
	for (var i = 0; i < normal_val.length; i++) {
		var c = normal_val.charCodeAt(i);
		byteLen += c < 1 << 7 ? 1 : c < 1 << 11 ? 2 : c < 1 << 16 ? 3 : c < 1 << 21 ? 4 : c < 1 << 26 ? 5 : c < 1 << 31 ? 6 : Number.NaN;
	}
	return byteLen;
}