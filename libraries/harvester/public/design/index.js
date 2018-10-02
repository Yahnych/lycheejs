
(function(global) {

	const _CACHE = {
		wraps:    [],
		elements: []
	};

	const Wrap = function(element) {

		let check = _CACHE.elements.indexOf(element);
		if (check !== -1) {
			return _CACHE.wraps[check];
		}


		this.chunk   = element.innerHTML || '';
		this.element = element;
		this.type    = element.tagName.toLowerCase();

		if (_CACHE.elements.includes(element) === false) {
			_CACHE.elements.push(element);
			_CACHE.wraps.push(this);
		}

	};

	Wrap.prototype = {

		appendTo: function(other) {

			if (other.element !== null) {
				other.element.appendChild(this.element);
			} else {
				other.appendChild(this.element);
			}

			return this;

		},

		clear: function() {

			if (this.element.parentNode !== null) {
				this.element.parentNode.removeChild(this.element);
			}

			return this;

		},

		html: function(html) {

			this.chunk             = html;
			this.element.innerHTML = html || '';

			return this;

		},

		onclick: function(callback) {

			this.element.onclick = function() {
				callback();
				return false;
			};

			return this;

		},

		query: function(query) {

			let element = this.element.querySelector(query);
			if (element !== null) {
				return $(element);
			}

			return null;

		},

		get: function(o) {

			let data = null;

			if (this.element[o] !== undefined) {
				data = this.element[o];
			}

			return data;

		},

		set: function(options) {

			for (let o in options) {

				if (typeof this[o] === 'function') {
					this[o](options[o]);
				} else {
					this.element.setAttribute(o, options[o]);
				}

			}

			return this;

		},

		state: function(state) {

			this.element.className = state;

			return this;

		}

	};



	const $ = function(name) {

		if (name instanceof Element) {

			return new Wrap(name);

		} else if (typeof name === 'string') {

			if (name.startsWith('#') || name.startsWith('.')) {

				let elements = Array.from(global.document.querySelectorAll(name));
				if (elements.length > 1) {
					return elements.map(element => new Wrap(element));
				} else if (elements.length === 1) {
					return new Wrap(elements[0]);
				}

			} else {

				let tmp  = name.split(/\.|\[|\]/g).filter(v => v !== '');
				let type = tmp[0] || '';
				if (type !== '') {

					let element = global.document.createElement(type);
					let state   = tmp[1] || '';
					if (state !== '') {
						element.className = state;
					}

					return new Wrap(element);

				}

			}

		}


		return null;

	};


	global.$ = $;

})(typeof window !== 'undefined' ? window : this);

