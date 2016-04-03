import expect from 'expect.js';
import {Query} from '../src/index';
import _ from 'lodash';


describe('Query', () => {
	describe('initialize', () => {
		it('should require a schema name', () => {
			var query = new Query("foo");
			expect(query.schemaName).to.be("foo");
		});

		it('should setup the default query object', () => {
			var query = new Query("foo");
			var expected = {
				'$schema': 'foo',
				'$query': [['$filter', []]]
			};

			expect(query.toJS()).to.eql(expected);
		});

		it('should not overwrite default state', () => {
			var query = new Query("foo", {bar: "baz"})
			expect(query.toJS()).to.eql({bar: "baz"})
		})
	});

	describe('_mergeArray', () => {
		context('when the item exists already', () => {
			it('should overwrite it with the new item', () => {
				var state = {
					'$schema': 'foo',
					'$query': [
						['$filter', []],
						['$limit', 5]
					]
				};
				var expected = {
					'$schema': 'foo',
					'$query': [
						['$filter', []],
						['$limit', 6]
					]
				};
				var query = new Query('foo', state);
				expect(query._mergeArray(['$limit', 6]).toJS()).to.eql(expected);
			})
		})

		context('when the item does not exist already', () => {
			it('should add the new item', () => {
				var state = {
					'$schema': 'foo',
					'$query': [
						['$filter', []],
						['$limit', 6]
					]
				};
				var query = new Query('foo');
				expect(query._mergeArray(['$limit', 6]).toJS()).to.eql(state);
			})
		})

		context('when the prepend option is true', () => {
			it('should prepend the query', () => {
				var state = {
					'$schema': 'foo',
					'$query': [
						['$between', 'foo'],
						['$filter', []]
					]
				};
				var query = new Query('foo');
				expect(query._mergeArray(['$between', 'foo'], true).toJS()).to.eql(state);
			})
		})
	})

	describe('limit', () => {
		it('sets limit', () => {
			var query = new Query('foo');
			var params = query.limit(5).toJS();
			var expected = [['$filter', []], ['$limit', 5]];

			expect(params['$query']).to.eql(expected);
		});
	});

	describe('offset', () => {
		it('sets offset', () => {
			var query = new Query('foo');
			var params = query.offset(5).toJS();
			var expected = [['$filter', []], ['$offset', 5]];
			expect(params['$query']).to.eql(expected);
		});
	});

	describe('order', () => {
		it('sets order_by and direction', () => {
			var query = new Query('foo');
			var params = query.order('rating', -1).toJS();
			var expected = [['$filter', []], ['$order_by', ['$desc', 'rating']]];
			expect(params['$query']).to.eql(expected);

			expected = [['$filter', []], ['$order_by', ['$asc', 'rating']]];
			params = query.order('rating', 1).toJS();
			expect(params['$query']).to.eql(expected);
		});

		it('sets order_by and direction by string', () => {
			var query = new Query('foo');
			var params = query.order('rating', 'desc').toJS();
			var expected = [['$filter', []], ['$order_by', ['$desc', 'rating']]];
			expect(params['$query']).to.eql(expected);

			expected = [['$filter', []], ['$order_by', ['$asc', 'rating']]];
			params = query.order('rating', 'asc').toJS();
			expect(params['$query']).to.eql(expected);
		});
	});

	describe('filter', () => {
		it('sets filter params', () => {
			var query = new Query('foo');
			var params = query.filter({rating__gt: 5}).toJS();
			var expected = [['$filter', [['rating', ['$gt', 5]]]]];
			expect(params['$query']).to.eql(expected);
		});

		it('merges filter params', () => {
			var query = new Query('foo');
			var params = query.filter({rating__gt: 5})
				.filter({author: 'speilberg'})
				.toJS();
			var expected = [
				['$filter', [
					['rating', ['$gt', 5]],
					['author', 'speilberg']
				]]
			];
			expect(params['$query']).to.eql(expected);
		});
	});

	describe('pluck', () => {
		it('sets pluck params', () => {
			var query = new Query('foo');
			var params = query.pluck(['rating', 'id']).toJS();
			var expected = [['$filter', []], ['$pluck', ['rating', 'id']]];
			expect(params['$query']).to.be.eql(expected);
		});
	});

	describe('without', () => {
		it('sets without params', () => {
			var query = new Query('foo');
			var params = query.without(['blob']).toJS();
			var expected = [['$filter', []], ['$without', ['blob']]];
			expect(params['$query']).to.be.eql(expected);
		});
	});

	describe('pageSize', () => {
		it('sets batch_size params', () => {
			var query = new Query('foo');
			var params = query.pageSize(20).toJS();
			var expected = [['$filter', []], ['$limit', 20]];
			expect(params['$query']).to.be.eql(expected);
		});
	});

	describe('index', () => {
		it('sets index params', () => {
			var query = new Query('foo');
			var params = query.index('fullText').toJS();
			var expected = [['$filter', []], ['$index', 'fullText']];
			expect(params['$query']).to.be.eql(expected);
		});
	});

	describe('between', () => {
		it('should require a from and a to', () => {
			var query = new Query('foo');
			var params = query.between().toJS();
			var expected = [['$filter', []]];
			expect(params['$query']).to.be.eql(expected);
		});

		it('should prepend the between operator', () => {
			var query = new Query('foo');
			var params = query.between({from: 1, to: 10, index: 'rank'}).toJS();
			var expected = [['$between', [1, 10, 'rank']], ['$filter', []]];
			expect(params['$query']).to.be.eql(expected);
		});
	});
});
