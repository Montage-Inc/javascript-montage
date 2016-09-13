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

var SchemaAPI = function () {
	function SchemaAPI(client) {
		(0, _classCallCheck3.default)(this, SchemaAPI);

		this.client = client;
	}

	(0, _createClass3.default)(SchemaAPI, [{
		key: 'create',
		value: function create(name) {
			var fields = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

			var payload = { name: name, fields: fields };
			return this.client.request('schemas/', 'POST', payload);
		}
	}, {
		key: 'list',
		value: function list() {
			return this.client.request('schemas/');
		}
	}, {
		key: 'get',
		value: function get(schema) {
			return this.client.request('schemas/' + schema + '/');
		}
	}, {
		key: 'update',
		value: function update(schema, name, fields) {
			var payload = {};

			if (name) {
				payload.name = name;
			}

			if (fields) {
				payload.fields = fields;
			}

			if ((0, _keys2.default)(payload).length) {
				return this.client.request('schemas/' + schema + '/', 'PATCH', payload);
			}
		}
	}, {
		key: 'remove',
		value: function remove(schema) {
			return this.client.request('schemas/' + schema + '/', 'DELETE');
		}
	}]);
	return SchemaAPI;
}();

exports.default = SchemaAPI;