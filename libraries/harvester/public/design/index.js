
(function(global) {

	const Wrap = function(element) {
		this.chunk   = element.innerHTML || '';
		this.element = element;
		this.type    = element.tagName.toLowerCase();
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

		let element = null;

		if (name instanceof Element) {

			element = name;

		} else if (typeof name === 'string') {

			if (name.startsWith('#')) {
				element = global.document.querySelector(name);
			} else {

				let tmp = name.split(/\.|\[|\]/g).filter(function(v) {
					return v !== '';
				});

				element = global.document.createElement(tmp[0]);
				tmp[1] && (element.className = tmp[1]);

			}

		}


		if (element !== null) {
			return new Wrap(element);
		}


		return null;

	};


	global.$ = $;

})(typeof window !== 'undefined' ? window : this);
