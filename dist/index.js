'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$defineProperty = require('babel-runtime/core-js/object/define-property')['default'];

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

_Object$defineProperty(exports, '__esModule', {
  value: true
});

var _isomorphicFetch = require('isomorphic-fetch');

var _isomorphicFetch2 = _interopRequireDefault(_isomorphicFetch);

var _querystring = require('querystring');

var _querystring2 = _interopRequireDefault(_querystring);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var Client = (function () {
  function Client() {
    var params = arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Client);

    params.api_version = params.api_version || 1;
    this.params = params;
    if (this.params.url) {
      this.url_prefix = this.params.url;
    } else {
      this.url_prefix = 'http://' + params.domain + '.dev.montagehot.club/api/v' + params.api_version + '/';
    }
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
    key: 'files',
    value: function files(formData) {
      return this.request('files/', 'POST', formData);
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
    value: _regeneratorRuntime.mark(function chunked_document_cursor(schema, cursor) {
      return _regeneratorRuntime.wrap(function chunked_document_cursor$(context$2$0) {
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
    value: function request(url, method, data, contentType) {
      var options = {
        method: method && method.toUpperCase() || 'GET',
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest' }
      };
      if (data) {
        if (options.method === 'GET') {
          url += '?' + _querystring2['default'].stringify(data);
        } else {
          options.body = JSON.stringify(data);
        }
      }
      if (this.params.token) {
        options.headers.Authorization = 'Token ' + this.params.token;
      }
      var reqUrl = '' + this.url_prefix + '' + url;
      return this._agent(reqUrl, options).then(function (response) {
        //TODO raise client response errors here
        return response.json();
      });
    }
  }, {
    key: '_agent',
    value: function _agent() {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _isomorphicFetch2['default'].apply(undefined, args);
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
      ordering: null,
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
    value: function order(order_by, ordering) {
      var parsedOrder;
      if (_lodash2['default'].isString(ordering)) {
        parsedOrder = ordering;
      } else {
        parsedOrder = ordering < 0 ? 'desc' : 'asc';
      }

      return this._merge({
        order_by: order_by,
        ordering: parsedOrder });
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