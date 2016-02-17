'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _slicedToArray = require('babel-runtime/helpers/sliced-to-array')['default'];

var _Promise = require('babel-runtime/core-js/promise')['default'];

var _Object$keys = require('babel-runtime/core-js/object/keys')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
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
    } else if (this.params.dev) {
      this.url_prefix = 'http://' + params.domain + '.dev.montagehot.club/api/v' + params.api_version + '/';
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
    value: function documents(queries) {
      return this.request('query/', 'POST', queries);
    }
  }, {
    key: 'document',
    value: function document(schema, document_uuid) {
      var documentQuery = {
        '$schema': schema,
        '$query': [['$get', document_uuid]]
      };

      return this.request('query/', 'POST', { query: documentQuery });
    }
  }, {
    key: 'document_cursor',
    value: function document_cursor(schema, cursor) {
      var params = { cursor: cursor };
      return this.request('schemas/' + schema + '/', 'GET', params);
    }
  }, {
    key: 'create_document',

    //*paginated_documents(schema, query) {
    //  //yields promises

    //  var cursor;

    //  function onResponse(response) {
    //    cursor = response.cursors ? response.cursors.next : null;
    //    return response.data;
    //  }

    //  yield this.documents(schema, query).then(onResponse);

    //  while (cursor) {
    //    yield this.document_cursor(schema, cursor).then(onResponse);
    //  }
    //}
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
      var _this = this;

      return this.request('auth/', 'POST', {
        username: this.params.username,
        password: this.params.password
      }).then(function (response) {
        _this.params.token = response.data.token;
        return response;
      });
    }
  }, {
    key: 'request',
    value: function request(url, method, data, file) {
      var options = {
        method: method && method.toUpperCase() || 'GET',
        headers: {
          accept: 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }
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
      var reqUrl = '' + this.url_prefix + url;
      return this._agent(reqUrl, options).then(function (response) {
        if (!response.ok) {
          response.request = _lodash2['default'].merge({
            url: reqUrl
          }, options);
          return _Promise.reject(response);
        }
        if (response.status >= 400) {
          return response.text().then(function (body) {
            var errorMessage = body || response.statusText;
            try {
              errorMessage = JSON.parse(body);
            } catch (e) {}
            return _Promise.reject(errorMessage);
          });
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
      return _isomorphicFetch2['default'].apply(undefined, arguments);
    }
    // TODO files api

  }]);

  return Client;
})();

exports.Client = Client;

var Query = (function () {
  function Query(schemaName, state) {
    _classCallCheck(this, Query);

    if (!schemaName) throw 'Schema name is required';

    this.schemaName = schemaName;

    state = state || {
      '$schema': schemaName,
      '$query': [['$filter', []]]
    };
    this._state = state;
  }

  _createClass(Query, [{
    key: '_merge',
    value: function _merge(delta) {
      var state = _lodash2['default'].merge({}, this._state, delta);
      return new Query(this.schemaName, state);
    }
  }, {
    key: '_mergeArray',
    value: function _mergeArray(delta) {
      var index = _lodash2['default'].findIndex(this._state['$query'], function (item) {
        return item[0] === delta[0];
      });

      if (index !== -1) {
        this._state['$query'][index] = delta;
      } else {
        this._state['$query'].push(delta);
      }

      return new Query(this.schemaName, this._state);
    }
  }, {
    key: 'limit',
    value: function limit(num) {
      return this._mergeArray(['$limit', num]);
    }
  }, {
    key: 'offset',
    value: function offset(num) {
      return this._mergeArray(['$offset', num]);
    }
  }, {
    key: 'order',
    value: function order(order_by, ordering) {
      var parsedOrder;
      if (_lodash2['default'].isString(ordering)) {
        parsedOrder = '$' + ordering;
      } else {
        parsedOrder = ordering < 0 ? '$desc' : '$asc';
      }

      return this._mergeArray(['$order_by', [parsedOrder, order_by]]);
    }
  }, {
    key: 'pluck',
    value: function pluck(fields) {
      return this._mergeArray(['$pluck', fields]);
    }
  }, {
    key: 'without',
    value: function without(fields) {
      return this._mergeArray(['$without', fields]);
    }
  }, {
    key: 'pageSize',
    value: function pageSize(size) {
      return this._mergeArray(['$limit', size]);
    }
  }, {
    key: 'index',
    value: function index(indexName) {
      return this._mergeArray(['$index', indexName]);
    }
  }, {
    key: 'filter',
    value: function filter(params) {
      var filterIndex = _lodash2['default'].findIndex(this._state['$query'], function (item) {
        return item[0] === '$filter';
      });
      var filters = this._state['$query'][filterIndex];

      _Object$keys(params).forEach(function (key) {
        var _key$split = key.split('__');

        var _key$split2 = _slicedToArray(_key$split, 2);

        var field = _key$split2[0];
        var operator = _key$split2[1];

        var queryField = operator ? ['$' + operator, params[key]] : params[key];

        filters[1].push([field, queryField]);
      });

      return this._mergeArray(filters);
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