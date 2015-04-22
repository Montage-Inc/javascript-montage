import expect from 'expect.js';
import {Client, Query} from '../src/index';
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
  let client;

  beforeEach(() => {
    client = new MockedClient();
  })

  describe('schemas', () => {
    it('returns promise from schemas endpoint', () => {
      emitter.once('request', (request) => {
        expect(_.last(request.url.split('/v1/'))).to.be('schemas/');
        expect(request.method).to.be('GET');
        request.callback(null, {
          ok: true,
          body: 'schemas FTW',
        });
      });
      return client.schemas().then((response) => {
        expect(response).to.be('schemas FTW')
      });
    });
  });

  describe('schema', () => {
    it('returns promise from schema endpoint', () => {
      emitter.once('request', (request) => {
        expect(_.last(request.url.split('/v1/'))).to.be('schemas/movies/');
        expect(request.method).to.be('GET');
        request.callback(null, {
          ok: true,
          body: 'movies FTW',
        });
      });
      return client.schema('movies').then((response) => {
        expect(response).to.be('movies FTW')
      });
    });
  });

  describe('documents', () => {
    it('returns promise from documents endpoint', () => {
      emitter.once('request', (request) => {
        expect(_.last(request.url.split('/v1/'))).to.be('schemas/movies/query/');
        expect(request.method).to.be('POST');
        request.callback(null, {
          ok: true,
          body: 'movie instances FTW',
        });
      });
      return client.documents('movies').then((response) => {
        expect(response).to.be('movie instances FTW')
      });
    });

    it('sends query params as get params', () => {
      emitter.once('request', (request) => {
        expect(_.last(request.url.split('/v1/'))).to.be('schemas/movies/query/');
        expect(JSON.parse(request.body).filter).to.eql({
          rating__gt: 5
        });
        expect(request.method).to.be('POST');
        request.callback(null, {
          ok: true,
          body: 'movie instances FTW',
        });
      });
      var query = new Query().filter({rating__gt: 5})
      return client.documents('movies', query).then((response) => {
        expect(response).to.be('movie instances FTW')
      });
    });
  });

  describe('document', () => {
    it('returns promise from document endpoint', () => {
      emitter.once('request', (request) => {
        expect(_.last(request.url.split('/v1/'))).to.be('schemas/movies/foobar/');
        expect(request.method).to.be('GET');
        request.callback(null, {
          ok: true,
          body: 'foobar movie',
        });
      });
      return client.document('movies', 'foobar').then((response) => {
        expect(response).to.be('foobar movie')
      });
    });
  });

  describe('document cursor', () => {
    it('returns promise from documents endpoint with a cursor param', () => {
      emitter.once('request', (request) => {
        expect(_.last(request.url.split('/v1/'))).to.be('schemas/movies/');
        expect(request.method).to.be('GET');
        expect(request.getParams).to.be.eql({cursor: 'DEADBEAF'});
        request.callback(null, {
          ok: true,
          body: 'yeilding movies',
        });
      });
      return client.document_cursor('movies', 'DEADBEAF').then((response) => {
        expect(response).to.be('yeilding movies')
      });
    });
  });

  describe('create document', () => {
    it('returns promise from create document endpoint with post data', () => {
      emitter.once('request', (request) => {
        expect(_.last(request.url.split('/v1/'))).to.be('schemas/movies/save/');
        expect(request.method).to.be('POST');
        expect(request.body).to.be.eql(JSON.stringify([{title: 'Star Wars'}]));
        request.callback(null, {
          ok: true,
          body: {id: 'aww yeah'},
        });
      });
      return client.create_document('movies', {title: 'Star Wars'}).then((response) => {
        expect(response).to.be.eql({id: 'aww yeah'})
      });
    });
  });

  describe('update document', () => {
    it('returns promise from update document endpoint with post data', () => {
      emitter.once('request', (request) => {
        expect(_.last(request.url.split('/v1/'))).to.be('schemas/movies/foobar/');
        expect(request.method).to.be('POST');
        expect(request.body).to.be.eql(JSON.stringify({title: 'Star Wars'}));
        request.callback(null, {
          ok: true,
          body: {id: 'aww yeah'},
        });
      });
      return client.update_document('movies', 'foobar', {title: 'Star Wars'}).then((response) => {
        expect(response).to.be.eql({id: 'aww yeah'})
      });
    });
  });

  describe('delete document', () => {
    it('returns promise from delete document endpoint', () => {
      emitter.once('request', (request) => {
        expect(_.last(request.url.split('/v1/'))).to.be('schemas/movies/foobar/');
        expect(request.method).to.be('DELETE');
        request.callback(null, {
          ok: true,
          body: null,
        });
      });
      return client.delete_document('movies', 'foobar').then((response) => {
        expect(response).to.be.eql(null)
      });
    });
  });

  describe('auth', () => {
    it('returns promise from auth endpoint and sends login info', () => {
      emitter.once('request', (request) => {
        expect(_.last(request.url.split('/v1/'))).to.be('auth/');
        expect(request.method).to.be('POST');
        expect(request.body).to.be.eql(JSON.stringify({
          username: 'johnsmith',
          password: 'secret',
        }));
        request.callback(null, {
          ok: true,
          body: {token: 'FOO'},
        });
      });
      client.params.username = 'johnsmith';
      client.params.password = 'secret';
      return client.auth().then((response) => {
        expect(response).to.be.eql({token: 'FOO'})
      });
    });
  });
});
