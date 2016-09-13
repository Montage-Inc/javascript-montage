'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var UserAPI = function () {
	function UserAPI(client) {
		(0, _classCallCheck3.default)(this, UserAPI);

		this.client = client;
	}

	(0, _createClass3.default)(UserAPI, [{
		key: 'list',
		value: function list() {
			return this.client.request('users/');
		}
	}, {
		key: 'create',
		value: function create(full_name, email, password) {
			var payload = { full_name: full_name, email: email, password: password };
			return this.client.request('users/', 'POST', payload);
		}
	}, {
		key: 'get',
		value: function get(user_id) {
			return this.client.request('users/' + user_id + '/');
		}
	}, {
		key: 'update',
		value: function update(user_id, full_name, email, password) {
			var payload = {};

			if (full_name) {
				payload.full_name = full_name;
			}

			if (email) {
				payload.email = email;
			}

			if (password) {
				payload.password = password;
			}

			if ((0, _keys2.default)(payload).length) {
				return this.client.request('users/' + user_id + '/', 'PATCH', payload);
			}
		}
	}, {
		key: 'remove',
		value: function remove(user_id) {
			return this.client.request('users/' + user_id + '/', 'DELETE');
		}
	}]);
	return UserAPI;
}();

exports.default = UserAPI;