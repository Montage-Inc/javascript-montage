"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Field = function () {
	function Field(field) {
		(0, _classCallCheck3.default)(this, Field);

		this.field = field;
		this.filters = [];
	}

	(0, _createClass3.default)(Field, [{
		key: "toJS",
		value: function toJS() {
			var _this = this;

			return this.filters.map(function (filter) {
				return [_this.field, filter];
			});
		}
	}, {
		key: "eq",
		value: function eq(value) {
			this.filters.push(["$eq", value]);
			return this;
		}
	}, {
		key: "ieq",
		value: function ieq(value) {
			this.filters.push(["$ieq", value]);
			return this;
		}
	}, {
		key: "ne",
		value: function ne(value) {
			this.filters.push(["$ne", value]);
			return this;
		}
	}, {
		key: "lt",
		value: function lt(value) {
			this.filters.push(["$lt", value]);
			return this;
		}
	}, {
		key: "le",
		value: function le(value) {
			this.filters.push(["$le", value]);
			return this;
		}
	}, {
		key: "gt",
		value: function gt(value) {
			this.filters.push(["$gt", value]);
			return this;
		}
	}, {
		key: "ge",
		value: function ge(value) {
			this.filters.push(["$ge", value]);
			return this;
		}
	}, {
		key: "inSet",
		value: function inSet() {
			for (var _len = arguments.length, values = Array(_len), _key = 0; _key < _len; _key++) {
				values[_key] = arguments[_key];
			}

			this.filters.push(["$in", values]);
			return this;
		}
	}, {
		key: "contains",
		value: function contains(value) {
			this.filters.push(["$contains", value]);
			return this;
		}
	}, {
		key: "regex",
		value: function regex(expression) {
			this.filters.push(["$regex", expression]);
			return this;
		}
	}, {
		key: "starts",
		value: function starts(value) {
			this.filters.push(["$starts", value]);
			return this;
		}
	}, {
		key: "istarts",
		value: function istarts(value) {
			this.filters.push(["$istarts", value]);
			return this;
		}
	}, {
		key: "ends",
		value: function ends(value) {
			this.filters.push(["$ends", value]);
			return this;
		}
	}, {
		key: "iends",
		value: function iends(value) {
			this.filters.push(["$iends", value]);
			return this;
		}
	}, {
		key: "intersects",
		value: function intersects(value) {
			this.filters.push(["$intersects", value]);
			return this;
		}
	}, {
		key: "includes",
		value: function includes(value) {
			this.filters.push(["$includes", value]);
			return this;
		}
	}]);
	return Field;
}();

exports.default = Field;