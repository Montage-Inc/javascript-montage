export default class SchemaAPI {
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
