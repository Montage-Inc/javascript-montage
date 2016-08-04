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
			expect(query.terms).to.eql([['$get', '1234']]);
		});
	});

	describe('#getAll()', () => {
		it('sets getAll', () => {
			query.getAll(['1234', 'abcd']);
			expect(query.terms).to.eql([['$get_all', ['id', ['1234', 'abcd']]]]);
		});
	});

	describe('#hasFields()', () => {
		it('sets hasFields', () => {
			query.hasFields('title', 'rating');
			expect(query.terms).to.eql([['$has_fields', ['title', 'rating']]]);
		});
	});

	describe('#withFields()', () => {
		it('sets withFields', () => {
			query.withFields('title', 'rating');
			expect(query.terms).to.eql([['$with_fields', ['title', 'rating']]]);
		});
	});

	describe('#orderBy()', () => {
		context('when no direction supplied', () => {
			it('sets order_by and default direction', () => {
				query.orderBy('rating');
				expect(query.terms).to.eql([['$order_by', 'rating', '$asc']]);
			});
		});

		context('when direction is ascending', () => {
			it('sets order_by and ascending direction', () => {
				query.orderBy('rating', 'asc');
				expect(query.terms).to.eql([['$order_by', 'rating', '$asc']]);
			});
		});

		context('when direction is descending', () => {
			it('sets order_by and descending direction', () => {
				query.orderBy('rating', 'desc');
				expect(query.terms).to.eql([['$order_by', 'rating', '$desc']]);
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
			expect(query.terms).to.eql([['$skip', 10]]);
		});
	});

	describe('#limit()', () => {
		it('sets limit', () => {
			query.limit(10);
			expect(query.terms).to.eql([['$limit', 10]]);
		});
	});

	describe('#slice()', () => {
		it('sets slice', () => {
			query.slice(10, 20);
			expect(query.terms).to.eql([['$slice', [10, 20]]]);
		});
	});

	describe('#nth()', () => {
		it('sets nth', () => {
			query.nth(5);
			expect(query.terms).to.eql([['$nth', 5]]);
		});
	});

	describe('#sample()', () => {
		it('sets sample', () => {
			query.sample(20);
			expect(query.terms).to.eql([['$sample', 20]]);
		});
	});

	describe('#pluck()', () => {
		it('sets pluck', () => {
			query.pluck('name', 'rank', 'rating');
			expect(query.terms).to.eql([['$pluck', ['name', 'rank', 'rating']]]);
		});
	});

	describe('#without()', () => {
		it('sets without', () => {
			query.without('votes', 'rank');
			expect(query.terms).to.eql([['$without', ['votes', 'rank']]]);
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
			expect(query.terms).to.eql([['$sum', 'rank']]);
		});
	});

	describe('#avg()', () => {
		it('sets avg', () => {
			query.avg('rank');
			expect(query.terms).to.eql([['$avg', 'rank']]);
		});
	});

	describe('#min()', () => {
		it('sets min', () => {
			query.min('rating');
			expect(query.terms).to.eql([['$min', 'rating']]);
		});
	});

	describe('#max()', () => {
		it('sets max', () => {
			query.max('rating');
			expect(query.terms).to.eql([['$max', 'rating']]);
		});
	});

	describe('#between()', () => {
		it('sets between', () => {
			query.between(0, 10, 'rank');
			expect(query.terms).to.eql([['$between', [0, 10, 'rank']]]);
		});
	});

	describe('#getIntersecting()', () => {
		it('sets get_intersecting', () => {
			var point = {
	            'type': 'Point',
	            'coordinates': [-120.34589052200315, 36.12704320788633]
	        };
			query.getIntersecting(point, 'location');
			expect(query.terms).to.eql([['$get_intersecting', ['location', point]]]);
		});
	});

	describe('#getNearest()', () => {
		it('sets get_nearest', () => {
			var point = {
	            'type': 'Point',
	            'coordinates': [-120.34589052200315, 36.12704320788633]
	        };
			query.getNearest(point, 'location');
			expect(query.terms).to.eql([['$get_nearest', ['location', point]]]);
		});
	});
});
