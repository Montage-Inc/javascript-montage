import expect from 'expect.js';
import {Field} from '../src/index';

describe('Field', () => {
	let field;

	beforeEach(function() {
		field = new Field('x');
	});

	describe('#eq()', () => {
		it('should equal a filter with a value of $eq', () => {
			let expectedFilter = ['x', ['$eq', 'y']];
			expect(field.eq('y')).to.eql(expectedFilter);
		});
	});

	describe('#ieq()', () => {
		it('should equal a filter with a value of $ieq', () => {
			let expectedFilter = ['x', ['$ieq', 'y']];
			expect(field.ieq('y')).to.eql(expectedFilter);
		});
	});

	describe('#ne()', () => {
		it('should equal a filter with a value of $ne', () => {
			let expectedFilter = ['x', ['$ne', 'y']];
			expect(field.ne('y')).to.eql(expectedFilter);
		});
	});

	describe('#lt()', () => {
		it('should equal a filter with a value of $lt', () => {
			let expectedFilter = ['x', ['$lt', 'y']];
			expect(field.lt('y')).to.eql(expectedFilter);
		});
	});

	describe('#le()', () => {
		it('should equal a filter with a value of $le', () => {
			let expectedFilter = ['x', ['$le', 'y']];
			expect(field.le('y')).to.eql(expectedFilter);
		});
	});

	describe('#gt()', () => {
		it('should equal a filter with a value of $gt', () => {
			let expectedFilter = ['x', ['$gt', 'y']];
			expect(field.gt('y')).to.eql(expectedFilter);
		});
	});

	describe('#ge()', () => {
		it('should equal a filter with a value of $ge', () => {
			let expectedFilter = ['x', ['$ge', 'y']];
			expect(field.ge('y')).to.eql(expectedFilter);
		});
	});

	describe('#in()', () => {
		it('should equal a filter with a value of $in', () => {
			let expectedFilter = ['x', ['$in', 'y']];
			expect(field.in('y')).to.eql(expectedFilter);
		});
	});

	describe('#match()', () => {
		it('should equal a filter with a value of $match', () => {
			let expectedFilter = ['x', ['$match', 'y']];
			expect(field.match('y')).to.eql(expectedFilter);
		});
	});

	describe('#starts()', () => {
		it('should equal a filter with a value of $starts', () => {
			let expectedFilter = ['x', ['$starts', 'y']];
			expect(field.starts('y')).to.eql(expectedFilter);
		});
	});

	describe('#istarts()', () => {
		it('should equal a filter with a value of $istarts', () => {
			let expectedFilter = ['x', ['$istarts', 'y']];
			expect(field.istarts('y')).to.eql(expectedFilter);
		});
	});

	describe('#ends()', () => {
		it('should equal a filter with a value of $ends', () => {
			let expectedFilter = ['x', ['$ends', 'y']];
			expect(field.ends('y')).to.eql(expectedFilter);
		});
	});

	describe('#iends()', () => {
		it('should equal a filter with a value of $iends', () => {
			let expectedFilter = ['x', ['$iends', 'y']];
			expect(field.iends('y')).to.eql(expectedFilter);
		});
	});

	describe('#intersects()', () => {
		it('should equal a filter with a value of $intersects', () => {
			let expectedFilter = ['x', ['$intersects', 'y']];
			expect(field.intersects('y')).to.eql(expectedFilter);
		});
	});

	describe('#includes()', () => {
		it('should equal a filter with a value of $includes', () => {
			let expectedFilter = ['x', ['$includes', 'y']];
			expect(field.includes('y')).to.eql(expectedFilter);
		});
	});
});
