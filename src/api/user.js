export default class UserAPI {
	constructor(client) {
		this.client = client
	}

	list() {
		return this.client.request('users/');
	}

	create(full_name, email, password) {
		const payload = { full_name, email, password };
		return this.client.request('users/', 'POST', payload)
	}

	get(user_id) {
		return this.client.request(`users/${user_id}/`);
	}

	update(user_id, { full_name, email, password }) {
		var payload = {};

		if (full_name) {
			payload.full_name = full_name;
		}

		if (email) {
			payload.email = email;
		}

		if (password) {
			payload.password = password;
		}

		if (Object.keys(payload).length) {
			return this.client.request(`users/${user_id}/`, 'PATCH', payload);
		}
	}

	delete(user_id) {
		return this.client.request(`users/${user_id}/`, 'DELETE');
	}

	remove(user_id) {
		console.warn("The function remove() is deprecated, use delete().");

		return this.delete(user_id);
	}
}
