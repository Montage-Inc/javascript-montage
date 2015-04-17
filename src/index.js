import Superagent from 'superagent';
import _ from 'lodash';

export class Client {
  constructor(params) {
    this.params = params;
  }
}

export class Query {
  constructor(state) {
    state = state || {
      limit: null,
      offset: null,
      order_by: null,
      direction: null,
      filter: {},
    };
    this._state = state;
  }
  _merge(delta) {
    var state = _.merge({}, this._state, delta);
    return new Query(state);
  }
  limit(num) {
    return this._merge({limit: num});
  }
  offset(num) {
    return this._merge({offset: num});
  }
  order(order_by, direction) {
    return this._merge({
      order_by: order_by,
      direction: direction < 0 ? "desc" : "asc",
    });
  }
  filter(params) {
    return this._merge({filter: params});
  }
  toJS() {
    return this._state;
  }
}
