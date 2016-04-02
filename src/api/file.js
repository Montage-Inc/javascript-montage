export default class FileAPI {
	constructor(client) {
		this.client = client;
	}

	list() {
		return this.client.request('files/');
	}

	get(file_id) {
		return this.client.request(`files/${file_id}/`);
	}

	remove(file_id) {
		const endpoint = `files/${file_id}/`;
		return this.client.request(endpoint, 'DELETE');
	}

	save(formData) {
		return this.client.request('files/', 'POST', formData, true);
	}
}
