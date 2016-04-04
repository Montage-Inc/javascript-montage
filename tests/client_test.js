import expect from 'expect.js';
import querystring from 'querystring';
import {Client, Query} from '../src/index';
import {EventEmitter} from 'events';

var emitter = new EventEmitter();

function mockedRequest(url, options) {
	var self = {};
	self.method = options.method;
	self.headers = options.headers;
	self.body = options.body;
	self.url = url;
	self.getParams = null;
	if (url.indexOf('?') !== -1) {
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
		client = new MockedClient('testco');
	});

	describe('initialization', () => {
		context('when a url argument is not supplied', () => {
			it('should set the hostname to the Montage production site', () => {
				var client = new MockedClient('testco');
				expect(client.hostname).to.be('testco.mntge.com');
			});
		});

		context('when a url argument is supplied', () => {
			it('should set the hostname to the supplied url', () => {
				var client = new MockedClient('testco', null, 'not-mntge.com');
				expect(client.hostname).to.be('testco.not-mntge.com');
			});
		});
	});

	describe('#url()', () => {
		it('should return a url to the specified endpoint', () => {
			expect(client.url('user/')).to.be('https://testco.mntge.com/api/v1/user/');
		});
	});

	describe('#authenticate()', (done) => {
		it('should set the user token when the credentials are valid', () => {
			var endpoint = 'https://testco.mntge.com/api/v1/user/';

			expect(client.token).to.be(undefined);

			emitter.once('request', (request) => {
				expect(request.url).to.be(endpoint);
				expect(request.method).to.be('POST');
				expect(request.body).to.eql(JSON.stringify({
					username: 'test@example.com',
					password: 'letmein'
				}));
				request.callback(null, {
					ok: true,
					body: {data: {token: 'USER_TOKEN'}},
				});
			});

			client.authenticate('test@example.com', 'letmein').then((response) => {
				expect(response).to.be.eql({data: {token: 'USER_TOKEN'}});
				expect(client.token).to.eql('USER_TOKEN');
				done();
			});
		});

		it('should not set a token when the credentials are invalid', (done) => {
			var endpoint = 'https://testco.mntge.com/api/v1/user/';
			expect(client.token).to.be(undefined);

			emitter.once('request', (request) => {
				expect(request.url).to.be(endpoint);
				expect(request.method).to.be('POST');
				expect(request.body).to.be('{"username":"fake@example.com","password":"invalid"}');
				request.callback(null, {
					ok: true,
					status: 401,
					body: JSON.stringify([{'detail': 'Incorrect authentication credentials.'}]),
				});
			});

			client.authenticate('fake@example.com', 'invalid').then(response => {
				expect().fail();
			}, error => {
				expect(error).to.eql([{'detail': 'Incorrect authentication credentials.'}])
				expect(client.token).to.be(undefined);
				done();
			});
		});
	});

	describe('#user()', (done) => {
		it('should reject the promise when the user is unauthenticated', () => {
			client.user().then(
				function resolved() {
					expect().fail();
				},
				function rejected() {
					done();
				}
			);
		});

		it('should resolve the promise when the user is authenticated', (done) => {
			var client = new MockedClient('testco', 'USER_TOKEN');
			var endpoint = 'https://testco.mntge.com/api/v1/user/';

			emitter.once('request', (request) => {
				expect(request.url).to.be(endpoint);
				expect(request.method).to.be('GET');
				expect(request.body).to.be(undefined);
				request.callback(null, {
					ok: true,
					body: 'resolved promise',
				});
			});

			client.user().then(response => {
				expect(response).to.be('resolved promise');
				done();
			});
		});
	});

	describe('#request()', () => {
		it('rejects validation errors and attempts to return JSON', (done) => {
			emitter.once('request', (request) => {
				request.callback(null, {
					ok: true,
					status: 403,
					body: JSON.stringify({errors: ['something went wrong']})
				});
			});
			return client.request('#').then(response => {
				expect().fail();
			}, error => {
				expect(error).to.be.eql({errors: ['something went wrong']});
				done();
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
				return error.text().then(text => {
					expect(text).to.be.eql('something went wrong');
				});
			});
		});
	});
});
