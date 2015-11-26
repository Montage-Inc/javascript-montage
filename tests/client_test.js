import expect from 'expect.js';
import querystring from 'querystring';
import {Client, Query} from '../src/index';
import _ from 'lodash';
import FormData from 'form-data';
import {EventEmitter} from 'events';

var emitter = new EventEmitter();


function mockedRequest(url, options) {
  var self = {};
  self.method = options.method;
  self.headers = options.headers;
  self.body = options.body;
  self.url = url;
  self.getParams = null;
  if (_.indexOf(url, '?') !== -1) {
    self.getParams = querystring.parse(url.split('?')[1]);
    self.url = url.split('?')[0];
  }
  self.callback = null;

  var promise = new Promise(function(resolve, reject) {
    self.callback = function(err, success) {
      if (err) {
        reject(err);
      } else {
        resolve({
          ok: success.ok,
          status: success.status || 200,
          json: function() {
            return Promise.resolve(success.body);
          },
          text: function() {
            return Promise.resolve(success.body);
          }
        });
      }
    }
  });

  emitter.emit('request', self);
  return promise;
}

class MockedClient extends Client {
  _agent(...args) {
    return mockedRequest(...args);
  }
}

describe('Client', () => {
  let client;

  beforeEach(() => {
    client = new MockedClient();
  });

  describe('initialize', () => {
    context('when the api version is not specified', () => {
      it('should set a default api version of 1', () => {
        var client = new Client();
        expect(client.params.api_version).to.be(1);
      });
    });

    context('when the api version is specified', () => {
      it('should set the version', () => {
        var client = new Client({api_version: 4});
        expect(client.params.api_version).to.be(4);
      });
    });

    context('when a url param is passed in', () => {
      it('should set the url prefix to the url', () => {
        var client = new Client({url: 'https://www.foo.com'});
        expect(client.url_prefix).to.be('https://www.foo.com');
      });
    });

    context('when a url param is not passed in', () => {
      it('should set the url to the montage production site', () => {
        var client = new Client({domain: 'foo'});
        expect(client.url_prefix).to.be('https://foo.mntge.com/api/v1/');
      });
    });

    context('when the dev param is set to true', () => {
      it('should use the dev montage domain', () => {
        var client = new Client({dev: true, domain: 'foo'});
        expect(client.url_prefix).to.be('http://foo.dev.montagehot.club/api/v1/');
      });
    });
  });

  describe('request', () => {
    it('rejects validation errors and attempts to return JSON', () => {
      emitter.once('request', (request) => {
        request.callback(null, {
          ok: true,
          status: 403,
          body: JSON.stringify({errors: ['something went wrong']}),
        });

      });
      return client.request('#').then(response => {
        expect.fail();
      }, error => {
        //console.log(error);
        expect(error).to.be.eql({errors: ['something went wrong']});
      });
    });

    it('rejects validation errors from status 200 and attempts to return JSON', () => {
      emitter.once('request', (request) => {
        request.callback(null, {
          ok: true,
          status: 200,
          body: {errors: ['something went wrong']},
        });

      });
      return client.request('#').then(response => {
        expect.fail();
      }, error => {
        //console.log(error);
        expect(error).to.be.eql(['something went wrong']);
      });
    });

    it('rejects bad responses with body text', () => {
      emitter.once('request', (request) => {
        request.callback(null, {
          ok: false,
          body: 'something went wrong',
        });

      });
      return client.request('#').then(response => {
        expect.fail();
      }, error => {
        //console.log(error);
        return error.text().then(text => {
          expect(text).to.be.eql('something went wrong');
        });
      });
    });
  });

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
        expect(_.last(request.url.split('/v1/'))).to.be('query/');
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

    //it('sends query params as get params', () => {
    //  emitter.once('request', (request) => {
    //    expect(_.last(request.url.split('/v1/'))).to.be('schemas/movies/query/');
    //    //ow nested JSON serializeation
    //    expect(JSON.parse(request.body).filter).to.eql({
    //      rating__gt: 5
    //    });
    //    expect(request.method).to.be('POST');
    //    request.callback(null, {
    //      ok: true,
    //      body: 'movie instances FTW',
    //    });
    //  });
    //  var query = new Query('foo').filter({rating__gt: 5})
    //  return client.documents('movies', query).then((response) => {
    //    expect(response).to.be('movie instances FTW')
    //  });
    //});
  });

  describe('document', () => {
    it('returns promise from document endpoint', () => {
      emitter.once('request', (request) => {
        expect(_.last(request.url.split('/v1/'))).to.be('query/');
        expect(request.method).to.be('POST');
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

  describe('files', () => {
    it('returns promise from create file endpoint with post data', () => {
      emitter.once('request', (request) => {
        expect(_.last(request.url.split('/v1/'))).to.be('files/');
        expect(request.method).to.be('POST');
        //expect(request.body).to.be.eql(JSON.stringify([{title: 'Star Wars'}]));
        request.callback(null, {
          ok: true,
          body: {id: 'aww yeah'},
        });
      });
      var formData = new FormData();
      formData.append('my_buffer', new Buffer(10));
      return client.files(formData).then((response) => {
        expect(response).to.be.eql({id: 'aww yeah'})
      });
    });
  });

  //describe('paginated documents', () => {
  //  it('returns a generator that yields response promises', () => {
  //    function firstPage(request) {
  //      expect(_.last(request.url.split('/v1/'))).to.be('schemas/movies/query/');
  //      expect(request.method).to.be('POST');
  //      request.callback(null, {
  //        ok: true,
  //        body: {
  //          data: ['aww yeah'],
  //          cursors: {
  //            next: 'DEADBEAF',
  //          }
  //        },
  //      });
  //    }

  //    function lastPage(request) {
  //      expect(_.last(request.url.split('/v1/'))).to.be('schemas/movies/');
  //      expect(request.method).to.be('GET');
  //      expect(request.getParams['cursor']).to.be('DEADBEAF');
  //      request.callback(null, {
  //        ok: true,
  //        body: {
  //          data: ['last one alive lock the door'],
  //        },
  //      });
  //    }

  //    emitter.once('request', firstPage);
  //    var generator = client.paginated_documents('movies');
  //    var g1 = generator.next()
  //    expect(g1.done).to.be(false);
  //    var response = g1.value;
  //    return response.then(objects => {
  //      emitter.once('request', lastPage);
  //      expect(objects).to.be.eql(['aww yeah']);
  //      var g2 = generator.next();
  //      expect(g2.done).to.be(false);
  //      expect(g2.value).to.be.ok();
  //      return g2.value.then(objects => {
  //        expect(objects).to.be.eql(['last one alive lock the door']);
  //        var g3 = generator.next();
  //        expect(g3.done).to.be(true);
  //      });
  //    });
  //  });
  //});
});
