import expect from 'expect.js';
import {Query} from '../src/index';
import _ from 'lodash';


describe('Query', () => {
  describe('limit', () => {
    it('sets limit', () => {
      var query = new Query();
      var params = query.limit(5).toJS();
      expect(params.limit).to.be(5);
    });
  });

  describe('offset', () => {
    it('sets offset', () => {
      var query = new Query();
      var params = query.offset(5).toJS();
      expect(params.offset).to.be(5);
    });
  });

  describe('order', () => {
    it('sets order_by', () => {
      var query = new Query();
      var params = query.order('rating').toJS();
      expect(params.order_by).to.be('rating');
    });

    it('sets order_by and direction', () => {
      var query = new Query();
      var params = query.order('rating', -1).toJS();
      expect(params.ordering).to.be('desc');

      params = query.order('rating', 1).toJS();
      expect(params.ordering).to.be('asc');
    });

    it('sets order_by and direction by string', () => {
      var query = new Query();
      var params = query.order('rating', 'desc').toJS();
      expect(params.ordering).to.be('desc');

      params = query.order('rating', 'asc').toJS();
      expect(params.ordering).to.be('asc');
    });
  });

  describe('filter', () => {
    it('sets filter params', () => {
      var query = new Query();
      var params = query.filter({rating__gt: 5}).toJS();
      expect(params.filter).to.be.eql({rating__gt: 5});
    });

    it('merges filter params', () => {
      var query = new Query();
      var params = query.filter({rating__gt: 5})
        .filter({author: 'speilberg'})
        .toJS();
      expect(params.filter).to.be.eql({
        rating__gt: 5,
        author: 'speilberg',
      });
    });
  });

  describe('pluck', () => {
    it('sets pluck params', () => {
      var query = new Query();
      var params = query.pluck(['rating', 'id']).toJS();
      expect(params.pluck).to.be.eql(['rating', 'id']);
    });
  });

  describe('without', () => {
    it('sets without params', () => {
      var query = new Query();
      var params = query.without(['blob']).toJS();
      expect(params.without).to.be.eql(['blob']);
    });
  });

  describe('pageSize', () => {
    it('sets batch_size params', () => {
      var query = new Query();
      var params = query.pageSize(20).toJS();
      expect(params.batch_size).to.be.eql(20);
    });
  });

  describe('index', () => {
    it('sets index params', () => {
      var query = new Query();
      var params = query.index('fullText').toJS();
      expect(params.index).to.be.eql('fullText');
    });
  });
});
