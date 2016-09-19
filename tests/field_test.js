import expect from 'expect.js';
import {Field} from '../src/index';

describe('Field', () => {
	let field;

	beforeEach(function() {
		field = new Field('x');
	});

	describe('#toJS()', () => {
		it('should equal a value of $eq', () => {
			expect(field.toJS()).to.eql([]);
			expect(field.eq('y').toJS()).to.eql([['x', ['$eq', 'y']]]);
		});
	});

	describe('#eq()', () => {
		it('should equal a filter with a value of $eq', () => {
			let expectedFilter = [['$eq', 'y']];
			expect(field.eq('y').filters).to.eql(expectedFilter);
		});
	});

	describe('#ieq()', () => {
		it('should equal a filter with a value of $ieq', () => {
			let expectedFilter = [['$ieq', 'y']];
			expect(field.ieq('y').filters).to.eql(expectedFilter);
		});
	});

	describe('#ne()', () => {
		it('should equal a filter with a value of $ne', () => {
			let expectedFilter = [['$ne', 'y']];
			expect(field.ne('y').filters).to.eql(expectedFilter);
		});
	});

	describe('#lt()', () => {
		it('should equal a filter with a value of $lt', () => {
			let expectedFilter = [['$lt', 'y']];
			expect(field.lt('y').filters).to.eql(expectedFilter);
		});
	});

	describe('#le()', () => {
		it('should equal a filter with a value of $le', () => {
			let expectedFilter = [['$le', 'y']];
			expect(field.le('y').filters).to.eql(expectedFilter);
		});
	});

	describe('#gt()', () => {
		it('should equal a filter with a value of $gt', () => {
			let expectedFilter = [['$gt', 'y']];
			expect(field.gt('y').filters).to.eql(expectedFilter);
		});
	});

	describe('#ge()', () => {
		it('should equal a filter with a value of $ge', () => {
			let expectedFilter = [['$ge', 'y']];
			expect(field.ge('y').filters).to.eql(expectedFilter);
		});
	});

	describe('#in()', () => {
		it('should equal a filter with a value of $in', () => {
			let expectedFilter = [['$in', 'y']];
			expect(field.in('y').filters).to.eql(expectedFilter);
		});
	});

	describe('#match()', () => {
		it('should equal a filter with a value of $match', () => {
			let expectedFilter = [['$match', 'y']];
			expect(field.match('y').filters).to.eql(expectedFilter);
		});
	});

	describe('#starts()', () => {
		it('should equal a filter with a value of $starts', () => {
			let expectedFilter = [['$starts', 'y']];
			expect(field.starts('y').filters).to.eql(expectedFilter);
		});
	});

	describe('#istarts()', () => {
		it('should equal a filter with a value of $istarts', () => {
			let expectedFilter = [['$istarts', 'y']];
			expect(field.istarts('y').filters).to.eql(expectedFilter);
		});
	});

	describe('#ends()', () => {
		it('should equal a filter with a value of $ends', () => {
			let expectedFilter = [['$ends', 'y']];
			expect(field.ends('y').filters).to.eql(expectedFilter);
		});
	});

	describe('#iends()', () => {
		it('should equal a filter with a value of $iends', () => {
			let expectedFilter = [['$iends', 'y']];
			expect(field.iends('y').filters).to.eql(expectedFilter);
		});
	});

	describe('#intersects()', () => {
		it('should equal a filter with a value of $intersects', () => {
			let expectedFilter = [['$intersects', 'y']];
			expect(field.intersects('y').filters).to.eql(expectedFilter);
		});
	});

	describe('#includes()', () => {
		it('should equal a filter with a value of $includes', () => {
			let expectedFilter = [['$includes', 'y']];
			expect(field.includes('y').filters).to.eql(expectedFilter);
		});
	});
});
