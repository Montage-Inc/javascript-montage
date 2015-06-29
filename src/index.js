import fetch from 'isomorphic-fetch';
import querystring from 'querystring';
import _ from 'lodash';


export class Client {
  constructor(params = {}) {
    params.api_version = params.api_version || 1;
    this.params = params;
    if (this.params.url) {
      this.url_prefix = this.params.url;
    } else {
      this.url_prefix = `http://${params.domain}.dev.montagehot.club/api/v${params.api_version}/`;
    }
  }
  schemas() {
    return this.request(`schemas/`);
  }
  schema(name) {
    return this.request(`schemas/${name}/`);
  }
  files(formData) {
    return this.request(`files/`,'POST',formData);
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
  request(url, method, data, contentType) {
    var options = {
      method: method && method.toUpperCase() || "GET",
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      }
    }
    if (data) {
      if (options.method === "GET") {
        url += '?' + querystring.stringify(data);
      } else {
        options.body = JSON.stringify(data);
      }
    }
    if (this.params.token) {
      options.headers.Authorization = `Token ${this.params.token}`;
    }
    var reqUrl = `${this.url_prefix}${url}`
    return this._agent(reqUrl, options).then(function(response) {
      //TODO raise client response errors here
      return response.json();
    })
    .then(function(json){
      return json.data;
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
      limit: null,
      offset: null,
      order_by: null,
      ordering: null,
      filter: {},
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
