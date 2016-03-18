export class DocumentsAPI {
	constructor(client) {
		this.client = client;
	}

	list(schema) {
		const endpoint = `schemas/${schema}/documents/`;
		return this.client.request(endpoint);
	}

	save(schema, documents) {
		const endpoint = `schemas/${schema}/documents/`;
		return this.client.request(endpoint, 'POST', documents);
	}

	get(schema, document_id) {
		const endpoint = `schemas/${schema}/documents/${document_id}/`;
		return this.client.request(endpoint);
	}

	replace(schema, document) {
		const endpoint = `schemas/${schema}/documents/${document.id}/`;
		return this.client.request(endpoint, 'PUT', document);
	}

	update(schema, document) {
		const endpoint = `schemas/${schema}/documents/${document.id}/`;
		return this.client.request(endpoint, 'PATCH', document);
	}

	remove(schema, document_id) {
		const endpoint = `schemas/${schema}/documents/${document_id}/`;
		return this.client.request(endpoint, 'DELETE');
	}
}

export class SchemaAPI {
	constructor(client) {
		this.client = client;
	}

	create(name, fields = []) {
		const payload = { name, fields };
		return this.client.request('schemas/', 'POST', payload);
	}

	list() {
		return this.client.request('schemas/');
	}

	get(schema) {
		return this.client.request(`schemas/${schema}/`);
	}

	update(schema, name, fields) {
		var payload = {};

		if (name) {
			payload.name = name;
		}

		if (fields) {
			payload.fields = fields;
		}

		if (Object.keys(payload).length) {
			return this.client.request(`schemas/${schema}/`, 'PATCH', payload);
		}
	}

	remove(schema) {
		return this.client.request(`schemas/${schema}/`, 'DELETE');
	}
}
