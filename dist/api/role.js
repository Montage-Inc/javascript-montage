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

var RoleAPI = function () {
	function RoleAPI(client) {
		(0, _classCallCheck3.default)(this, RoleAPI);

		this.client = client;
	}

	(0, _createClass3.default)(RoleAPI, [{
		key: 'create',
		value: function create(name) {
			var add_users = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

			var payload = { name: name, add_users: add_users };
			return this.client.request('roles/', 'POST', payload);
		}
	}, {
		key: 'list',
		value: function list() {
			return this.client.request('roles/');
		}
	}, {
		key: 'get',
		value: function get(role) {
			return this.client.request('roles/' + role + '/');
		}
	}, {
		key: 'update',
		value: function update(role, name, add_users, remove_users) {
			var payload = {};

			if (name) {
				payload.name = name;
			}

			if (add_users) {
				payload.add_users = add_users;
			}

			if (remove_users) {
				payload.remove_users = remove_users;
			}

			if ((0, _keys2.default)(payload).length) {
				return this.client.request('roles/' + role + '/', 'PATCH', payload);
			}
		}
	}, {
		key: 'remove',
		value: function remove(role) {
			return this.client.request('roles/' + role + '/', 'DELETE');
		}
	}]);
	return RoleAPI;
}();

exports.default = RoleAPI;