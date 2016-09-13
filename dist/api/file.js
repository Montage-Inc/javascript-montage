'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FileAPI = function () {
	function FileAPI(client) {
		(0, _classCallCheck3.default)(this, FileAPI);

		this.client = client;
	}

	(0, _createClass3.default)(FileAPI, [{
		key: 'list',
		value: function list() {
			return this.client.request('files/');
		}
	}, {
		key: 'get',
		value: function get(file_id) {
			return this.client.request('files/' + file_id + '/');
		}
	}, {
		key: 'remove',
		value: function remove(file_id) {
			var endpoint = 'files/' + file_id + '/';
			return this.client.request(endpoint, 'DELETE');
		}
	}, {
		key: 'save',
		value: function save(formData) {
			return this.client.request('files/', 'POST', formData, true);
		}
	}]);
	return FileAPI;
}();

exports.default = FileAPI;