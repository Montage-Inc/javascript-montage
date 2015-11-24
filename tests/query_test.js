import expect from 'expect.js';
import {Query} from '../src/index';
import _ from 'lodash';


describe('Query', () => {
  describe('initialize', () => {
    it('should require a table name', () => {
      var query = new Query("foo");
      expect(query.tableName).to.be("foo");
    });

    it('should setup the default query object', () => {
      var query = new Query("foo");
      var expected = {
        '$table': 'foo',
        '$query': []
      };

      expect(query.toJS()).to.eql(expected);
    });

    it('should not overwrite default state', () => {
      var query = new Query("foo", { bar: "baz" })
      expect(query.toJS()).to.eql({ bar: "baz" })
    })
  });

  describe('_mergeArray', () => {
    context('when the item exists already', () => {
      it('should overwrite it with the new item', () => {
        var state = {
          '$table': 'foo',
          '$query': [
            ['$limit', 5]
          ]
        };
        var expected = {
          '$table': 'foo',
          '$query': [
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
          '$table': 'foo',
          '$query': [
            ['$limit', 6]
          ]
        };
        var query = new Query('foo');
        expect(query._mergeArray(['$limit', 6]).toJS()).to.eql(state);
      })
    })
  })

  describe('limit', () => {
    it('sets limit', () => {
      var query = new Query('foo');
      var params = query.limit(5).toJS();
      var expected = {
        '$table': 'foo',
        '$query': [
          ['$limit', 5]
        ]
      }

      expect(params).to.eql(expected);
    });
  });

  describe('offset', () => {
    it('sets offset', () => {
      var query = new Query('foo');
      var params = query.offset(5).toJS();
      var expected = {
        '$table': 'foo',
        '$query': [
          ['$offset', 5]
        ]
      };
      expect(params).to.eql(expected);
    });
  });

  describe('order', () => {
    it('sets order_by and direction', () => {
      var query = new Query('foo');
      var params = query.order('rating', -1).toJS();
      var expected = {
        '$table': 'foo',
        '$query': [
          ['$order_by', ['$desc', 'rating']]
        ]
      }
      expect(params).to.eql(expected);

      expected = {
        '$table': 'foo',
        '$query': [
          ['$order_by', ['$asc', 'rating']]
        ]
      }
      params = query.order('rating', 1).toJS();
      expect(params).to.eql(expected);
    });

    it('sets order_by and direction by string', () => {
      var query = new Query('foo');
      var params = query.order('rating', 'desc').toJS();
      var expected = {
        '$table': 'foo',
        '$query': [
          ['$order_by', ['$desc', 'rating']]
        ]
      }
      expect(params).to.eql(expected);

      expected = {
        '$table': 'foo',
        '$query': [
          ['$order_by', ['$asc', 'rating']]
        ]
      }
      params = query.order('rating', 'asc').toJS();
      expect(params).to.eql(expected);
    });
  });

  //describe('filter', () => {
  //  it('sets filter params', () => {
  //    var query = new Query('foo');
  //    var params = query.filter({rating__gt: 5}).toJS();
  //    expect(params.filter).to.be.eql({rating__gt: 5});
  //  });

  //  it('merges filter params', () => {
  //    var query = new Query('foo');
  //    var params = query.filter({rating__gt: 5})
  //      .filter({author: 'speilberg'})
  //      .toJS();
  //    expect(params.filter).to.be.eql({
  //      rating__gt: 5,
  //      author: 'speilberg',
  //    });
  //  });
  //});

  //describe('pluck', () => {
  //  it('sets pluck params', () => {
  //    var query = new Query('foo');
  //    var params = query.pluck(['rating', 'id']).toJS();
  //    expect(params.pluck).to.be.eql(['rating', 'id']);
  //  });
  //});

  //describe('without', () => {
  //  it('sets without params', () => {
  //    var query = new Query('foo');
  //    var params = query.without(['blob']).toJS();
  //    expect(params.without).to.be.eql(['blob']);
  //  });
  //});

  //describe('pageSize', () => {
  //  it('sets batch_size params', () => {
  //    var query = new Query('foo');
  //    var params = query.pageSize(20).toJS();
  //    expect(params.batch_size).to.be.eql(20);
  //  });
  //});

  //describe('index', () => {
  //  it('sets index params', () => {
  //    var query = new Query('foo');
  //    var params = query.index('fullText').toJS();
  //    expect(params.index).to.be.eql('fullText');
  //  });
  //});
});
