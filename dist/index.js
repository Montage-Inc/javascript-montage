'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$defineProperty = require('babel-runtime/core-js/object/define-property')['default'];

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _Promise = require('babel-runtime/core-js/promise')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

_Object$defineProperty(exports, '__esModule', {
  value: true
});

exports.getByteLen = getByteLen;

var _isomorphicFetch = require('isomorphic-fetch');

var _isomorphicFetch2 = _interopRequireDefault(_isomorphicFetch);

var _querystring = require('querystring');

var _querystring2 = _interopRequireDefault(_querystring);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

/**
 * Count bytes in a string's UTF-8 representation.
 *
 * @param   string
 * @return  int
 */

function getByteLen(normal_val) {
  // Force string type
  normal_val = String(normal_val);

  var byteLen = 0;
  for (var i = 0; i < normal_val.length; i++) {
    var c = normal_val.charCodeAt(i);
    byteLen += c < 1 << 7 ? 1 : c < 1 << 11 ? 2 : c < 1 << 16 ? 3 : c < 1 << 21 ? 4 : c < 1 << 26 ? 5 : c < 1 << 31 ? 6 : Number.NaN;
  }
  return byteLen;
}

var Client = (function () {
  function Client() {
    var params = arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Client);

    params.api_version = params.api_version || 1;
    this.params = params;
    if (this.params.url) {
      this.url_prefix = this.params.url;
    } else {
      this.url_prefix = 'https://' + params.domain + '.mntge.com/api/v' + params.api_version + '/';
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
      return this.request('files/', 'POST', formData, true);
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
    key: 'paginated_documents',
    value: _regeneratorRuntime.mark(function paginated_documents(schema, query) {
      var cursor, onResponse;
      return _regeneratorRuntime.wrap(function paginated_documents$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            onResponse = function onResponse(response) {
              cursor = response.cursors ? response.cursors.next : null;
              return response.data;
            };

            context$2$0.next = 3;
            return this.documents(schema, query).then(onResponse);

          case 3:
            if (!cursor) {
              context$2$0.next = 8;
              break;
            }

            context$2$0.next = 6;
            return this.document_cursor(schema, cursor).then(onResponse);

          case 6:
            context$2$0.next = 3;
            break;

          case 8:
          case 'end':
            return context$2$0.stop();
        }
      }, paginated_documents, this);
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
    value: function request(url, method, data, file) {
      var options = {
        method: method && method.toUpperCase() || 'GET',
        headers: {
          accept: 'application/json',
          'X-Requested-With': 'XMLHttpRequest' }
      };
      if (!file) {
        options.headers['Content-Type'] = 'application/json';
      }
      if (data) {
        if (options.method === 'GET') {
          url += '?' + _querystring2['default'].stringify(data);
        } else {
          if (file) options.body = data;else options.body = JSON.stringify(data);
        }
      }
      if (this.params.token) {
        options.headers.Authorization = 'Token ' + this.params.token;
      }
      if (options.body) {
        //Varnish and heroku require a content length!
        options.headers['Content-Length'] = getByteLen(options.body);
      }
      var reqUrl = '' + this.url_prefix + '' + url;
      return this._agent(reqUrl, options).then(function (response) {
        if (!response.ok) {
          return _Promise.reject(response);
        }
        if (response.statusCode >= 400) {
          var body = response.text();
          //console.error(body);
          var errorMessage = body || response.statusText;
          try {
            errorMessage = JSON.parse(body);
          } catch (e) {}
          return _Promise.reject(errorMessage);
        }
        return response.json();
      }).then(function (payload) {
        if (payload && payload.errors) {
          return _Promise.reject(payload.errors);
        }
        return payload;
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
      pluck: null,
      limit: null,
      offset: null,
      order_by: null,
      ordering: null,
      filter: {},
      without: [],
      batch_size: 1000,
      index: null };
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
    key: 'pluck',
    value: function pluck(fields) {
      return this._merge({ pluck: fields });
    }
  }, {
    key: 'without',
    value: function without(fields) {
      return this._merge({ without: fields });
    }
  }, {
    key: 'pageSize',
    value: function pageSize(size) {
      return this._merge({ batch_size: size });
    }
  }, {
    key: 'index',
    value: function index(indexName) {
      return this._merge({ index: indexName });
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

//yields promises