'use strict';

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Script = function () {
	function Script(name) {
		(0, _classCallCheck3.default)(this, Script);

		this.name = name;
	}

	(0, _createClass3.default)(Script, [{
		key: 'toJS',
		value: function toJS() {
			return {
				$type: 'script',
				$name: this.name
			};
		}
	}]);
	return Script;
}();

var RunLua = function () {
	function RunLua(code) {
		(0, _classCallCheck3.default)(this, RunLua);

		this.code = code;
	}

	(0, _createClass3.default)(RunLua, [{
		key: 'toJS',
		value: function toJS() {
			return {
				$type: 'lua',
				$code: this.code
			};
		}
	}]);
	return RunLua;
}();