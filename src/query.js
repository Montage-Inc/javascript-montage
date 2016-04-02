import _ from 'lodash';

export default class Query {
	constructor(schemaName, state) {
		if (!schemaName) throw "Schema name is required";

		this.schemaName = schemaName;

		state = state || {
				'$schema': schemaName,
				'$query': [
					['$filter', []]
				]
			}
		this._state = state;
	}

	_merge(delta) {
		var state = _.merge({}, this._state, delta);
		return new Query(this.schemaName, state);
	}

	_mergeArray(delta, prepend = false) {
		var index = _.findIndex(this._state['$query'], (item) => {
			return item[0] === delta[0];
		});

		if (index !== -1) {
			this._state['$query'][index] = delta;
		} else {
			if (prepend) {
				this._state['$query'].unshift(delta);
			} else {
				this._state['$query'].push(delta);
			}
		}

		return new Query(this.schemaName, this._state);
	}

	limit(num) {
		return this._mergeArray(['$limit', num]);
	}

	offset(num) {
		return this._mergeArray(['$offset', num]);
	}

	order(order_by, ordering) {
		var parsedOrder;
		if(_.isString(ordering)) {
			parsedOrder = `$${ordering}`;
		} else {
			parsedOrder = ordering < 0 ? "$desc" : "$asc";
		}

		return this._mergeArray(['$order_by', [parsedOrder, order_by]]);
	}

	pluck(fields) {
		return this._mergeArray(['$pluck', fields]);
	}

	without(fields) {
		return this._mergeArray(['$without', fields]);
	}

	pageSize(size) {
		return this._mergeArray(['$limit', size]);
	}

	index(indexName) {
		return this._mergeArray(['$index', indexName]);
	}

	filter(params) {
		var filterIndex = _.findIndex(this._state['$query'], (item) => {
			return item[0] === '$filter';
		});
		var filters = this._state['$query'][filterIndex];

		Object.keys(params).forEach((key) => {
			var [field, operator] = key.split("__");
			var queryField = operator ? [`$${operator}`, params[key]] : params[key];

			filters[1].push([field, queryField]);
		})

		return this._mergeArray(filters);
	}

	where(params) {
		//alias
		return this.filter(params);
	}

	between(params) {
		if (params && params.from && params.to) {
			return this._mergeArray(['$between', [params.from, params.to, params.index]], true)
		}
		return this;
	}

	toJS() {
		return this._state;
	}
}
