export default class DocumentAPI {
	constructor(client) {
		this.client = client;
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
