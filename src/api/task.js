export default class TaskAPI {
	constructor(client) {
		this.client = client;
	}

	run(command, { image, token, timeLimit }) {
		const payload = { command };

		if (image) {
			payload.image = image;
		}
		if (token) {
			payload.token = token;
		}
		if (timeLimit) {
			payload.time_limit = timeLimit;
		}

		return this.client.request(`tasks/`, 'POST', payload);
	}

	get(task_id) {
		return this.client.request(`tasks/${task_id}/`);
	}
}
