export default class RoleAPI {
	constructor(client) {
		this.client = client;
	}

	create(name, add_users = []) {
		const payload = { name, add_users };
		return this.client.request(`roles/`, 'POST', payload);
	}

	list() {
		return this.client.request(`roles/`);
	}

	get(role) {
		return this.client.request(`roles/${role}/`);
	}

	update(role, name, add_users, remove_users) {
		var payload = {};

		if (name) {
			payload.name = name;
		}

		if (add_users) {
			payload.add_users = add_users;
		}

		if (remove_users) {
			payload.remove_users = remove_users;
		}

		if (Object.keys(payload).length) {
			return this.client.request(`roles/${role}/`, 'PATCH', payload);
		}
	}

	delete(role) {
		return this.client.request(`roles/${role}/`, 'DELETE');
	}

	remove(role) {
		console.warn("The function remove() is deprecated, use delete().");

		return this.delete(role);
	}
}
