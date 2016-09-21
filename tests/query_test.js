import expect from 'expect.js';
import {Query} from '../src/index';

var query;

describe('Query', () => {
	beforeEach(function() {
		query = new Query('testSchema');
	});

	describe('initialization', () => {
		it('should require a schema name', () => {
			expect(query.schema).to.be('testSchema');
		});
	});

	describe('#toJS()', () => {
		it('should return a query object', () => {
			expect(query.toJS()).to.eql({
				$type: 'query',
				$schema: 'testSchema',
				$query: []
			});
		});
	});

	describe('#get()', () => {
		it('sets get', () => {
			query.get('1234');
			expect(query.terms).to.eql([['$get', {'id': '1234'}]]);
		});
	});

	describe('#getAll()', () => {
		it('sets getAll', () => {
			query.getAll(['1234', 'abcd']);
			expect(query.terms).to.eql([['$get_all', {'ids': ['1234', 'abcd'], 'index': 'id'}]]);
		});
	});

	describe('#hasFields()', () => {
		it('sets hasFields', () => {
			query.hasFields('title', 'rating');
			expect(query.terms).to.eql([['$has_fields', {fields: ['title', 'rating']}]]);
		});
	});

	describe('#withFields()', () => {
		it('sets withFields', () => {
			query.withFields('title', 'rating');
			expect(query.terms).to.eql([['$with_fields', {fields: ['title', 'rating']}]]);
		});
	});

	describe('#orderBy()', () => {
		context('when no direction supplied', () => {
			it('sets order_by and default direction', () => {
				query.orderBy({key: 'rating'});
				expect(query.terms).to.eql([['$order_by', {key: 'rating', ordering: '$asc'}]]);
			});
		});

		context('when direction is ascending', () => {
			it('sets order_by and ascending direction', () => {
				query.orderBy({key: 'rating', ordering: '$asc'});
				expect(query.terms).to.eql([['$order_by', {key: 'rating', ordering: '$asc'}]]);
			});
		});

		context('when direction is descending', () => {
			it('sets order_by and descending direction', () => {
				query.orderBy({key: 'rating', ordering: '$desc'});
				expect(query.terms).to.eql([['$order_by', {key: 'rating', ordering: '$desc'}]]);
			});
		});

		context('when direction is invalid', () => {
			it('should throw an exception', () => {
				expect(query.orderBy).withArgs('rating', -1).to.throwException();
			});
		});
	});

	describe('#skip()', () => {
		it('sets skip', () => {
			query.skip(10);
			expect(query.terms).to.eql([['$skip', {'n': 10}]]);
		});
	});

	describe('#limit()', () => {
		it('sets limit', () => {
			query.limit(10);
			expect(query.terms).to.eql([['$limit', {'n': 10}]]);
		});
	});

	describe('#slice()', () => {
		it('sets slice', () => {
			query.slice(10, 20);
			expect(query.terms).to.eql([['$slice', {'startOffset': 10, 'endOffset': 20}]]);
		});
	});

	describe('#nth()', () => {
		it('sets nth', () => {
			query.nth(5);
			expect(query.terms).to.eql([['$nth', {'n': 5}]]);
		});
	});

	describe('#sample()', () => {
		it('sets sample', () => {
			query.sample(20);
			expect(query.terms).to.eql([['$sample', {'n': 20}]]);
		});
	});

	describe('#pluck()', () => {
		it('sets pluck', () => {
			query.pluck('name', 'rank', 'rating');
			expect(query.terms).to.eql([['$pluck', {'fields': ['name', 'rank', 'rating']}]]);
		});
	});

	describe('#without()', () => {
		it('sets without', () => {
			query.without('votes', 'rank');
			expect(query.terms).to.eql([['$without', {'fields': ['votes', 'rank']}]]);
		});
	});

	describe('#group()', () => {
		it('sets group', () => {
			query.group('rank');
			expect(query.terms).to.eql([['$group', {'field': 'rank'}]]);
		});
	});

	describe('#count()', () => {
		it('sets count', () => {
			query.count();
			expect(query.terms).to.eql([['$count']]);
		});
	});

	describe('#sum()', () => {
		it('sets sum', () => {
			query.sum('rank');
			expect(query.terms).to.eql([['$sum', {'field': 'rank'}]]);
		});
	});

	describe('#avg()', () => {
		it('sets avg', () => {
			query.avg('rank');
			expect(query.terms).to.eql([['$avg', {'field': 'rank'}]]);
		});
	});

	describe('#min()', () => {
		it('sets min', () => {
			query.min('rating');
			expect(query.terms).to.eql([['$min', {'field': 'rating'}]]);
		});
	});

	describe('#max()', () => {
		it('sets max', () => {
			query.max('rating');
			expect(query.terms).to.eql([['$max', {'field': 'rating'}]]);
		});
	});

	describe('#between()', () => {
		it('sets between', () => {
			var params = {
				lowerKey: 0,
				upperKey: 10,
				index: 'rank',
			};
			query.between(params);
			expect(query.terms).to.eql([['$between', params]]);
		});
	});

	describe('#getIntersecting()', () => {
		it('sets get_intersecting', () => {
			var point = {
				'coordinates': [-120.34589052200315, 36.12704320788633],
				'type': 'Point'
			};
			query.getIntersecting(point, 'location');
			expect(query.terms).to.eql([['$get_intersecting', {index: 'location', geometry: point}]]);
		});
	});

	describe('#getNearest()', () => {
		it('sets get_nearest', () => {
			var point = {
	            'type': 'Point',
	            'coordinates': [-120.34589052200315, 36.12704320788633]
	        };
			query.getNearest(point, 'location');
			expect(query.terms).to.eql([['$get_nearest', {index: 'location', geometry: point}]]);
		});
	});

	describe('#delete()', () => {
		it('sets delete', () => {
			query.delete('hard', false);
			expect(query.terms).to.eql([['$delete', {durability: 'hard', return_changes: false}]]);
		});
	});
});
