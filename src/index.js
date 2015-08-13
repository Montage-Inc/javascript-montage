import fetch from 'isomorphic-fetch';
import querystring from 'querystring';
import _ from 'lodash';


/**
 * Count bytes in a string's UTF-8 representation.
 *
 * @param   string
 * @return  int
 */
export function getByteLen(normal_val) {
    // Force string type
    normal_val = String(normal_val);

    var byteLen = 0;
    for (var i = 0; i < normal_val.length; i++) {
        var c = normal_val.charCodeAt(i);
        byteLen += c < (1 <<  7) ? 1 :
                   c < (1 << 11) ? 2 :
                   c < (1 << 16) ? 3 :
                   c < (1 << 21) ? 4 :
                   c < (1 << 26) ? 5 :
                   c < (1 << 31) ? 6 : Number.NaN;
    }
    return byteLen;
}

export class Client {
  constructor(params = {}) {
    params.api_version = params.api_version || 1;
    this.params = params;
    if (this.params.url) {
      this.url_prefix = this.params.url;
    } else {
      this.url_prefix = `https://${params.domain}.mntge.com/api/v${params.api_version}/`;
    }
  }
  schemas() {
    return this.request(`schemas/`);
  }
  schema(name) {
    return this.request(`schemas/${name}/`);
  }
  files(formData) {
    return this.request(`files/`,'POST',formData,true);
  }
  documents(schema, query) {
    var params = query ? query.toJS() : {};
    return this.request(`schemas/${schema}/query/`, "POST", params);
  }
  document(schema, document_uuid) {
    return this.request(`schemas/${schema}/${document_uuid}/`);
  }
  document_cursor(schema, cursor) {
    var params = {cursor};
    return this.request(`schemas/${schema}/`, "GET", params);
  }
  *chunked_document_cursor(schema, cursor) {
    while (cursor) {
      yield this.raw_document_cursor(schema, cursor).then(payload => {
        try {
          cursor = payload.cursors.next;
        } catch (e) {
          cursor = null;
        }
        return payload;
      });
    }
  }
  create_document(schema, document) {
    return this.create_documents(schema, [document]);
  }
  create_documents(schema, documents) {
    return this.request(`schemas/${schema}/save/`, "POST", documents);
  }
  update_document(schema, document_uuid, document) {
    return this.request(`schemas/${schema}/${document_uuid}/`, "POST", document);
  }
  delete_document(schema, document_uuid) {
    return this.request(`schemas/${schema}/${document_uuid}/`, "DELETE");
  }
  auth() {
    return this.request("auth/", "POST", {
      username: this.params.username,
      password: this.params.password,
    });
  }
  request(url, method, data, file) {
    if(file){
      var options = {
        method: method && method.toUpperCase() || "GET",
        headers: {
          accept: 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        }
      }
    }
    else{
      var options = {
        method: method && method.toUpperCase() || "GET",
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        }
      }
    }
    if (data) {
      if (options.method === "GET") {
        url += '?' + querystring.stringify(data);
      } else {
        if(file) options.body = data
        else options.body = JSON.stringify(data);
      }
    }
    if (this.params.token) {
      options.headers.Authorization = `Token ${this.params.token}`;
    }
    if (options.body) {
      //Varnish and heroku require a content length!
      options.headers['Content-Length'] = getByteLen(options.body);
    }
    var reqUrl = `${this.url_prefix}${url}`
    return this._agent(reqUrl, options).then(function(response) {
      //TODO raise client response errors here
      return response.json();
    });
  }
  _agent(...args) {
    return fetch(...args);
  }
  //TODO files api
}

export class Query {
  constructor(state) {
    state = state || {
      pluck: null,
      limit: null,
      offset: null,
      order_by: null,
      ordering: null,
      filter: {},
      without: [],
      batch_size: 1000,
      index: null,
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
  order(order_by, ordering) {
    var parsedOrder;
    if(_.isString(ordering)) {
      parsedOrder = ordering;
    } else {
      parsedOrder = ordering < 0 ? "desc" : "asc";
    }

    return this._merge({
      order_by: order_by,
      ordering: parsedOrder,
    });
  }
  pluck(fields) {
    return this._merge({pluck: fields});
  }
  without(fields) {
    return this._merge({without: fields});
  }
  pageSize(size) {
    return this._merge({batch_size: size});
  }
  index(indexName) {
    return this._merge({index: indexName});
  }
  filter(params) {
    return this._merge({filter: params});
  }
  where(params) {
    //alias
    return this.filter(params);
  }
  toJS() {
    return this._state;
  }
}
