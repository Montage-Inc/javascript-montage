class Script {
	constructor(name) {
		this.name = name
	}
	
	toJS() {
		return {
			$type: 'script',
			$name: this.name
		};
	}

}

class RunLua {
	constructor(code) {
		this.code = code;
	}

	toJS() {
		return {
			$type: 'lua',
			$code: this.code
		};
	}
}

