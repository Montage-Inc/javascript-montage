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

	delete(file_id) {
		const endpoint = `/files/${file_id}/`;
		return this.client.request(endpoint, 'DELETE');
	}

	remove(file_id) {
		console.warn("The function remove() is deprecated, use delete().");

		return this.delete(file_id);
	}

	save(formData) {
		return this.client.request('files/', 'POST', formData, true);
	}
}
