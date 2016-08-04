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

	get(id) {
		this.terms.push(['$get', id]);
		return this;
	}

	getAll(ids, index = 'id') {
		this.terms.push(['$get_all', [index, ids]]);
		return this;
	}

	filter(...filters) {
		var filterSet = filters.reduce((filterSet, currentFilter) => {
			return filterSet.concat(currentFilter.toJS());
		}, []);

		this.terms.push(['$filter', filterSet]);
		return this;
	}

	hasFields(...fields) {
		this.terms.push(['$has_fields', fields])
		return this;
	}

	withFields(...fields) {
		this.terms.push(['$with_fields', fields])
		return this;
	}

	orderBy(field, ordering = 'asc') {
		if(ordering !== 'asc' && ordering !== 'desc') {
			throw new Error('ordering must be desc or asc');
		}

		ordering = '$' + ordering;
		this.terms.push(['$order_by', field, ordering])
		return this;
	}

	skip(num) {
		this.terms.push(['$skip', num]);
		return this;
	}

	limit(num) {
		this.terms.push(['$limit', num]);
		return this;
	}

	slice(start, end) {
		this.terms.push(['$slice', [start, end]]);
		return this;
	}

	nth(num) {
		this.terms.push(['$nth', num]);
		return this;
	}

	sample(num) {
		this.terms.push(['$sample', num]);
		return this;
	}

	pluck(...fields) {
		this.terms.push(['$pluck', fields]);
		return this;
	}

	without(...fields) {
		this.terms.push(['$without', fields]);
		return this;
	}

	group(field) {
		this.terms.push(['$group', field]);
		return this;
	}

	count() {
		this.terms.push(['$count']);
		return this;
	}

	sum(field) {
		this.terms.push(['$sum', field]);
		return this;
	}

	avg(field) {
		this.terms.push(['$avg', field]);
		return this;
	}

	min(field) {
		this.terms.push(['$min', field]);
		return this;
	}

	max(field) {
		this.terms.push(['$max', field]);
		return this;
	}

	between(start, end, index) {
		var value = index ? [start, end, index] : [start, end];
		this.terms.push(['$between', value]);
		return this;
	}

	getIntersecting(geometry, index) {
		this.terms.push(['$get_intersecting', [index, geometry]]);
		return this;
	}

	getNearest(geometry, index) {
		this.terms.push(['$get_nearest', [index, geometry]]);
		return this;
	}
}
