'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PolicyAPI = function () {
	function PolicyAPI(client) {
		(0, _classCallCheck3.default)(this, PolicyAPI);

		this.client = client;
	}

	(0, _createClass3.default)(PolicyAPI, [{
		key: 'create',
		value: function create(description, policy) {
			var payload = {
				description: description,
				policy: policy
			};

			return this.client.request('policy/', 'POST', payload);
		}
	}, {
		key: 'list',
		value: function list() {
			return this.client.request('policy/');
		}
	}, {
		key: 'get',
		value: function get(policy_id) {
			return this.client.request('policy/' + policy_id + '/');
		}
	}, {
		key: 'update',
		value: function update(policy_id, description, policy) {
			if (!description && !policy) {
				throw new Error('Must provide a `description` or `policy`');
			}

			var payload = {};

			if (description) {
				payload.description = description;
			}

			if (policy) {
				payload.policy = policy;
			}

			if (payload) {
				return this.client.request('policy/' + policy_id + '/', 'PATCH', payload);
			}
		}
	}, {
		key: 'remove',
		value: function remove(policy_id) {
			return this.client.request('policy/' + policy_id + '/', 'DELETE');
		}
	}, {
		key: 'checkPermission',
		value: function checkPermission(action, resource) {
			var payload = {
				action: action,
				resource: resource
			};

			return this.client.request('policy/check/', 'GET', payload);
		}
	}]);
	return PolicyAPI;
}();

exports.default = PolicyAPI;