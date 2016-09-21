import _ from 'lodash';

export default class Query {
	constructor(schema) {
		if (!schema) throw 'A schema name is required';

		this.schema = schema;
		this.terms = [];
	}

	toJS() {
		return {
			$type: 'query',
			$schema: this.schema,
			$query: this.terms
		};
	}

	// Selecting Data

	get(id) {
		this.terms.push(['$get', {id}]);
		return this;
	}

	getAll(ids, index = 'id') {
		this.terms.push(['$get_all', {index, ids}]);
		return this;
	}

	filter() {
		var params = {};
		if (arguments[arguments.length - 1] instanceof Array) {
			params.predicate = arguments;
		} else {
			params.predicate = Array.prototype.slice.call(arguments, 0, arguments.length - 1);
			params.default = arguments[arguments.length - 1].default;
		}
		this.terms.push(['$filter', params]);
		return this;
	}

	between(options) {
		const defaults = {
			lowerKey : '$minval',
			upperKey : '$maxval'
		};
		const params = _.assign(defaults, options);
		this.terms.push(['$between', params]);
		return this;
	}

	// Transformations

	hasFields(...fields) {
		this.terms.push(['$has_fields', {fields}]);
		return this;
	}

	withFields(...fields) {
		this.terms.push(['$with_fields', {fields}]);
		return this;
	}

	orderBy({key, index, ordering}) {
		ordering = (ordering === undefined) ? '$asc' : ordering;
		if(['asc', 'desc'].indexOf(ordering) !== -1) {
			console.warn('asc/desc parameters deprecated. Please use $asc/$desc.');
			ordering = '$' + ordering;
		}

		if(['$asc', '$desc'].indexOf(ordering) === -1) {
			throw new Error('ordering must be $desc or $asc');
		}

		var params = { ordering };

		if(key !== undefined) {
			params.key = key;
		}

		if(index !== undefined) {
			params.index = index;
		}

		this.terms.push(['$order_by', params]);
		return this;
	}

	skip(n) {
		this.terms.push(['$skip', {n}]);
		return this;
	}

	limit(n) {
		this.terms.push(['$limit', {n}]);
		return this;
	}

	slice(startOffset, endOffset) {
		this.terms.push(['$slice', {startOffset, endOffset}]);
		return this;
	}

	nth(n) {
		this.terms.push(['$nth', {n}]);
		return this;
	}

	sample(n) {
		this.terms.push(['$sample', {n}]);
		return this;
	}

	// Manipulation

	pluck(...fields) {
		this.terms.push(['$pluck', {fields}]);
		return this;
	}

	without(...fields) {
		this.terms.push(['$without', {fields}]);
		return this;
	}

	// Aggregation

	group(field) {
		this.terms.push(['$group', {field}]);
		return this;
	}

	count() {
		this.terms.push(['$count']);
		return this;
	}

	sum(field) {
		this.terms.push(['$sum', {field}]);
		return this;
	}

	avg(field) {
		this.terms.push(['$avg', {field}]);
		return this;
	}

	min(field) {
		this.terms.push(['$min', {field}]);
		return this;
	}

	max(field) {
		this.terms.push(['$max', {field}]);
		return this;
	}

	// Geospatial

	getIntersecting(geometry, index) {
		this.terms.push(['$get_intersecting', {index, geometry}]);
		return this;
	}

	getNearest(geometry, index) {
		this.terms.push(['$get_nearest', {index, geometry}]);
		return this;
	}

	// Delete

	delete(durability = 'hard', return_changes = false) {
		this.terms.push(['$delete', {durability, return_changes}]);
		return this;
	}
}
