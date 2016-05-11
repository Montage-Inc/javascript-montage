'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Query = function () {
	function Query(schema) {
		(0, _classCallCheck3.default)(this, Query);

		if (!schema) throw 'A schema name is required';

		this.schema = schema;
		this.terms = [];
	}

	(0, _createClass3.default)(Query, [{
		key: 'toJS',
		value: function toJS() {
			return {
				$schema: this.schema,
				$query: this.terms
			};
		}
	}, {
		key: 'get',
		value: function get(id) {
			this.terms.push(['$get', id]);
			return this;
		}
	}, {
		key: 'getAll',
		value: function getAll(ids) {
			var index = arguments.length <= 1 || arguments[1] === undefined ? 'id' : arguments[1];

			this.terms.push(['$get_all', [index, ids]]);
			return this;
		}
	}, {
		key: 'filter',
		value: function filter() {
			for (var _len = arguments.length, filters = Array(_len), _key = 0; _key < _len; _key++) {
				filters[_key] = arguments[_key];
			}

			var filterSet = filters.reduce(function (filterSet, currentFilter) {
				return filterSet.concat(currentFilter.toJS());
			}, []);

			this.terms.push(['$filter', filterSet]);
			return this;
		}
	}, {
		key: 'hasFields',
		value: function hasFields() {
			for (var _len2 = arguments.length, fields = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
				fields[_key2] = arguments[_key2];
			}

			this.terms.push(['$has_fields', fields]);
			return this;
		}
	}, {
		key: 'withFields',
		value: function withFields() {
			for (var _len3 = arguments.length, fields = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
				fields[_key3] = arguments[_key3];
			}

			this.terms.push(['$with_fields', fields]);
			return this;
		}
	}, {
		key: 'orderBy',
		value: function orderBy(field) {
			var ordering = arguments.length <= 1 || arguments[1] === undefined ? 'asc' : arguments[1];

			if (ordering !== 'asc' && ordering !== 'desc') {
				throw new Error('ordering must be desc or asc');
			}

			ordering = '$' + ordering;
			this.terms.push(['$order_by', field, ordering]);
			return this;
		}
	}, {
		key: 'skip',
		value: function skip(num) {
			this.terms.push(['$skip', num]);
			return this;
		}
	}, {
		key: 'limit',
		value: function limit(num) {
			this.terms.push(['$limit', num]);
			return this;
		}
	}, {
		key: 'slice',
		value: function slice(start, end) {
			this.terms.push(['$slice', [start, end]]);
			return this;
		}
	}, {
		key: 'nth',
		value: function nth(num) {
			this.terms.push(['$nth', num]);
			return this;
		}
	}, {
		key: 'sample',
		value: function sample(num) {
			this.terms.push(['$sample', num]);
			return this;
		}
	}, {
		key: 'pluck',
		value: function pluck() {
			for (var _len4 = arguments.length, fields = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
				fields[_key4] = arguments[_key4];
			}

			this.terms.push(['$pluck', fields]);
			return this;
		}
	}, {
		key: 'without',
		value: function without() {
			for (var _len5 = arguments.length, fields = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
				fields[_key5] = arguments[_key5];
			}

			this.terms.push(['$without', fields]);
			return this;
		}
	}, {
		key: 'group',
		value: function group(field) {
			this.terms.push(['$group', field]);
			return this;
		}
	}, {
		key: 'count',
		value: function count() {
			this.terms.push(['$count']);
			return this;
		}
	}, {
		key: 'sum',
		value: function sum(field) {
			this.terms.push(['$sum', field]);
			return this;
		}
	}, {
		key: 'avg',
		value: function avg(field) {
			this.terms.push(['$avg', field]);
			return this;
		}
	}, {
		key: 'min',
		value: function min(field) {
			this.terms.push(['$min', field]);
			return this;
		}
	}, {
		key: 'max',
		value: function max(field) {
			this.terms.push(['$max', field]);
			return this;
		}
	}, {
		key: 'between',
		value: function between(start, end, index) {
			var value = index ? [start, end, index] : [start, end];
			this.terms.push(['$between', value]);
			return this;
		}
	}, {
		key: 'getIntersecting',
		value: function getIntersecting(geometry, index) {
			this.terms.push(['$get_intersecting', [index, geometry]]);
			return this;
		}
	}, {
		key: 'getNearest',
		value: function getNearest(geometry, index) {
			this.terms.push(['$get_nearest', [index, geometry]]);
			return this;
		}
	}]);
	return Query;
}();

exports.default = Query;