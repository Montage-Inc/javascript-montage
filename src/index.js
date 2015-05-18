import Superagent from 'superagent';
import _ from 'lodash';
import 'babel/polyfill';

export class Client {
  constructor(params = {}) {
    params.api_version = params.api_version || 1;
    this.params = params;
    if(params.domain.match(/http/)) this.url_prefix = `${params.domain}/api/v${params.api_version}/`
    else this.url_prefix = `http://${params.domain}.dev.montagehot.club/api/v${params.api_version}/`
  }
  schemas() {
    return this.request(`schemas/`);
  }
  schema(name) {
    return this.request(`schemas/${name}/`);
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
  request(url, method, data) {
    return new Promise((resolve, reject) => {
      url = this.url_prefix + url;
      method = method && method.toUpperCase() || "GET";
      var headers = {
        accept: 'application/json',
        'Content-Type': 'application/json'
      }
      if (this.params.token) {
        headers.Authorization = `Token ${this.params.token}`;
      }
      var req = this._agent(method, url).set(headers);

      //send our cookies if we have them
      if (req.withCredentials) {
        req = req.withCredentials();
      }

      if (data) {
        if (method === "GET" || method === "HEAD" || method === "OPTIONS") {
          req.query(data);
        } else {
          req.send(JSON.stringify(data));
        }
      }

      req.end(function(error, res) {
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
  _agent(...args) {
    return Superagent(...args);
  }
  //TODO files api
}

export class Query {
  constructor(state) {
    state = state || {
      limit: null,
      offset: null,
      order_by: null,
      direction: null,
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
  order(order_by, direction) {
    return this._merge({
      order_by: order_by,
      direction: direction < 0 ? "desc" : "asc",
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
