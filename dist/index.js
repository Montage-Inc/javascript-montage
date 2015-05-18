'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

require('babel/polyfill');

var Client = (function () {
  function Client() {
    var params = arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Client);

    params.api_version = params.api_version || 1;
    this.params = params;
    if (params.domain.match(/http/)) this.url_prefix = '' + params.domain + '/api/v' + params.api_version + '/';else this.url_prefix = 'http://' + params.domain + '.dev.montagehot.club/api/v' + params.api_version + '/';
  }

  _createClass(Client, [{
    key: 'schemas',
    value: function schemas() {
      return this.request('schemas/');
    }
  }, {
    key: 'schema',
    value: function schema(name) {
      return this.request('schemas/' + name + '/');
    }
  }, {
    key: 'documents',
    value: function documents(schema, query) {
      var params = query ? query.toJS() : {};
      return this.request('schemas/' + schema + '/query/', 'POST', params);
    }
  }, {
    key: 'document',
    value: function document(schema, document_uuid) {
      return this.request('schemas/' + schema + '/' + document_uuid + '/');
    }
  }, {
    key: 'document_cursor',
    value: function document_cursor(schema, cursor) {
      var params = { cursor: cursor };
      return this.request('schemas/' + schema + '/', 'GET', params);
    }
  }, {
    key: 'chunked_document_cursor',
    value: regeneratorRuntime.mark(function chunked_document_cursor(schema, cursor) {
      return regeneratorRuntime.wrap(function chunked_document_cursor$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            if (!cursor) {
              context$2$0.next = 5;
              break;
            }

            context$2$0.next = 3;
            return this.raw_document_cursor(schema, cursor).then(function (payload) {
              try {
                cursor = payload.cursors.next;
              } catch (e) {
                cursor = null;
              }
              return payload;
            });

          case 3:
            context$2$0.next = 0;
            break;

          case 5:
          case 'end':
            return context$2$0.stop();
        }
      }, chunked_document_cursor, this);
    })
  }, {
    key: 'create_document',
    value: function create_document(schema, document) {
      return this.create_documents(schema, [document]);
    }
  }, {
    key: 'create_documents',
    value: function create_documents(schema, documents) {
      return this.request('schemas/' + schema + '/save/', 'POST', documents);
    }
  }, {
    key: 'update_document',
    value: function update_document(schema, document_uuid, document) {
      return this.request('schemas/' + schema + '/' + document_uuid + '/', 'POST', document);
    }
  }, {
    key: 'delete_document',
    value: function delete_document(schema, document_uuid) {
      return this.request('schemas/' + schema + '/' + document_uuid + '/', 'DELETE');
    }
  }, {
    key: 'auth',
    value: function auth() {
      return this.request('auth/', 'POST', {
        username: this.params.username,
        password: this.params.password });
    }
  }, {
    key: 'request',
    value: function request(url, method, data) {
      var _this = this;

      return new Promise(function (resolve, reject) {
        url = _this.url_prefix + url;
        method = method && method.toUpperCase() || 'GET';
        var headers = {
          accept: 'application/json',
          'Content-Type': 'application/json'
        };
        if (_this.params.token) {
          headers.Authorization = 'Token ' + _this.params.token;
        }
        var req = _this._agent(method, url).set(headers);

        //send our cookies if we have them
        if (req.withCredentials) {
          req = req.withCredentials();
        }

        if (data) {
          if (method === 'GET' || method === 'HEAD' || method === 'OPTIONS') {
            req.query(data);
          } else {
            req.send(JSON.stringify(data));
          }
        }

        req.end(function (error, res) {
          if (error) {
            reject(error);
          } else if (res.ok) {
            resolve(res.body);
          } else {
            reject(res.error);
          }
        });
      });
    }
  }, {
    key: '_agent',
    value: function _agent() {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _superagent2['default'].apply(undefined, args);
    }
    //TODO files api

  }]);

  return Client;
})();

exports.Client = Client;

var Query = (function () {
  function Query(state) {
    _classCallCheck(this, Query);

    state = state || {
      limit: null,
      offset: null,
      order_by: null,
      direction: null,
      filter: {} };
    this._state = state;
  }

  _createClass(Query, [{
    key: '_merge',
    value: function _merge(delta) {
      var state = _lodash2['default'].merge({}, this._state, delta);
      return new Query(state);
    }
  }, {
    key: 'limit',
    value: function limit(num) {
      return this._merge({ limit: num });
    }
  }, {
    key: 'offset',
    value: function offset(num) {
      return this._merge({ offset: num });
    }
  }, {
    key: 'order',
    value: function order(order_by, direction) {
      return this._merge({
        order_by: order_by,
        direction: direction < 0 ? 'desc' : 'asc' });
    }
  }, {
    key: 'filter',
    value: function filter(params) {
      return this._merge({ filter: params });
    }
  }, {
    key: 'where',
    value: function where(params) {
      //alias
      return this.filter(params);
    }
  }, {
    key: 'toJS',
    value: function toJS() {
      return this._state;
    }
  }]);

  return Query;
})();

exports.Query = Query;