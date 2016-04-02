export class FileAPI {
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

export class UserAPI {
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

	update(user_id, full_name, email, password) {
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

	remove(user_id) {
		return this.client.request(`users/${user_id}/`, 'DELETE');
	}
}

export class RoleAPI {
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

	remove(role) {
		return this.client.request(`roles/${role}/`, 'DELETE');
	}
}
