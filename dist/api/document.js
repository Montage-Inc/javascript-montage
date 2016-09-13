'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DocumentAPI = function () {
	function DocumentAPI(client) {
		(0, _classCallCheck3.default)(this, DocumentAPI);

		this.client = client;
	}

	(0, _createClass3.default)(DocumentAPI, [{
		key: 'list',
		value: function list(schema) {
			var endpoint = 'schemas/' + schema + '/documents/';
			return this.client.request(endpoint);
		}
	}, {
		key: 'save',
		value: function save(schema, documents) {
			var endpoint = 'schemas/' + schema + '/documents/';
			return this.client.request(endpoint, 'POST', documents);
		}
	}, {
		key: 'get',
		value: function get(schema, document_id) {
			var endpoint = 'schemas/' + schema + '/documents/' + document_id + '/';
			return this.client.request(endpoint);
		}
	}, {
		key: 'replace',
		value: function replace(schema, document) {
			var endpoint = 'schemas/' + schema + '/documents/' + document.id + '/';
			return this.client.request(endpoint, 'PUT', document);
		}
	}, {
		key: 'update',
		value: function update(schema, document) {
			var endpoint = 'schemas/' + schema + '/documents/' + document.id + '/';
			return this.client.request(endpoint, 'PATCH', document);
		}
	}, {
		key: 'remove',
		value: function remove(schema, document_id) {
			var endpoint = 'schemas/' + schema + '/documents/' + document_id + '/';
			return this.client.request(endpoint, 'DELETE');
		}
	}]);
	return DocumentAPI;
}();

exports.default = DocumentAPI;