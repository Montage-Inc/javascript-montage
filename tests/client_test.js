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

	var promise = new Promise(function (resolve, reject) {
		self.callback = function (err, success) {
			if (err) {
				reject(err);
			} else {
				resolve({
					ok: success.ok,
					status: success.status || 200,
					json: function () {
						return Promise.resolve(success.body);
					},
					text: function () {
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
					body: {data: {token: 'FOO'}},
				});
			});
			client.params.username = 'johnsmith';
			client.params.password = 'secret';
			return client.auth().then((response) => {
				expect(response).to.be.eql({data: {token: 'FOO'}})
			});
			expect(client.params.token).to.be.eql('FOO');
		});
	});
});
