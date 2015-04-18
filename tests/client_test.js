import expect from 'expect.js';
import {Client} from '../src/index';
import _ from 'lodash';
import {EventEmitter} from 'events';

var emitter = new EventEmitter();


class MockedAgent {
  constructor(method, url) {
    this.method = method;
    this.url = url;
  }
  set(headers) {
    this.headers = headers;
    return this;
  }
  send(data) {
    this.body = data;
    return this;
  }
  query(data) {
    this.getParams = data;
    return this;
  }
  end(callback) {
    this.callback = callback;
    emitter.emit('request', this);
    return this;
  }
}

class MockedClient extends Client {
  _agent(...args) {
    return new MockedAgent(...args);
  }
}

describe('Client', () => {
  describe('schemas', () => {
    it('returns promisde from schemas endpoint', () => {
      emitter.once('request', function(request) {
        request.callback(null, {
          ok: true,
          body: 'schemas',
        });
      });
      var client = new MockedClient();
      var promise = client.schemas();
      return promise.then(function(response) {
        expect(response).to.be('schemas')
      });
    });
  });
});
