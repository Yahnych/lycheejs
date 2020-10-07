
lychee = (function(global) {

	if (typeof lychee !== 'undefined') {
		return lychee;
	}



	const _BLOBOF_CACHE      = {};
	const _INTERFACEOF_CACHE = {};



	/*
	 * POLYFILLS
	 */

	if (typeof Array.from !== 'function') {

		Array.from = function(alike/*, predicate, thisArg */) {

			if (alike === null || alike === undefined) {
				throw new TypeError('Array.from requires an array-like object - not null or undefined');
			}


			let construct = this;
			let list      = Object(alike);
			let predicate = arguments.length > 1 ? arguments[1] : void 0;
			let thisArg   = arguments.length > 2 ? arguments[2] : void 0;

			if (typeof predicate !== 'undefined') {

				if (typeof predicate !== 'function') {
					throw new TypeError('Array.from: when provided, the second argument must be a function');
				}

			}

			let length = list.length >>> 0;
			let array  = typeof construct === 'function' ? Object(new construct(length)) : new Array(length);

			for (let i = 0; i < length; i++) {

				let value = list[i];

				if (predicate !== undefined) {

					if (thisArg === undefined) {
						array[i] = predicate(value, i);
					} else {
						array[i] = predicate.call(thisArg, value, i);
					}

				} else {
					array[i] = value;
				}

			}

			array.length = length;

			return array;

		};

	}

	if (typeof Array.prototype.find !== 'function') {

		Array.prototype.find = function(predicate/*, thisArg */) {

			if (this === null || this === undefined) {
				throw new TypeError('Array.prototype.find called on null or undefined');
			}

			if (typeof predicate !== 'function') {
				throw new TypeError('predicate must be a function');
			}


			let list    = Object(this);
			let length  = list.length >>> 0;
			let thisArg = arguments.length >= 2 ? arguments[1] : void 0;
			let value;

			for (let i = 0; i < length; i++) {

				if (i in list) {

					value = list[i];

					if (predicate.call(thisArg, value, i, list)) {
						return value;
					}

				}

			}


			return undefined;

		};

	}

	if (typeof Array.prototype.includes !== 'function') {

		Array.prototype.includes = function(search/*, from */) {

			if (this === null || this === undefined) {
				throw new TypeError('Array.prototype.includes called on null or undefined');
			}


			let list   = Object(this);
			let length = list.length >>> 0;
			let from   = arguments.length >= 2 ? arguments[1] : 0;
			let value;


			if (length === 0 || from >= length) {
				return false;
			}


			let start = Math.max(from >= 0 ? from : (length - Math.abs(from)), 0);

			for (let i = start; i < length; i++) {

				if (i in list) {

					value = list[i];

					if (value === search || (isNaN(value) && isNaN(search))) {
						return true;
					}

				}

			}


			return false;

		};

	}

	if (typeof Array.prototype.unique !== 'function') {

		Array.prototype.unique = function() {

			if (this === null || this === undefined) {
				throw new TypeError('Array.prototype.unique called on null or undefined');
			}


			let clone  = [];
			let list   = Object(this);
			let length = this.length >>> 0;
			let value;

			for (let i = 0; i < length; i++) {

				value = list[i];

				if (clone.indexOf(value) === -1) {
					clone.push(value);
				}
			}

			return clone;

		};

	}

	if (typeof Boolean.prototype.toJSON !== 'function') {

		Boolean.prototype.toJSON = function() {
			return this.valueOf();
		};

	}

	if (typeof Date.prototype.toJSON !== 'function') {

		let _format_date = function(n) {
			return n < 10 ? '0' + n : '' + n;
		};

		Date.prototype.toJSON = function() {

			if (isFinite(this.valueOf()) === true) {

				let str = '';

				str += this.getUTCFullYear()                + '-';
				str += _format_date(this.getUTCMonth() + 1) + '-';
				str += _format_date(this.getUTCDate())      + 'T';
				str += _format_date(this.getUTCHours())     + ':';
				str += _format_date(this.getUTCMinutes())   + ':';
				str += _format_date(this.getUTCSeconds())   + 'Z';

				return str;

			}


			return null;

		};

	}

	if (typeof Number.prototype.toJSON !== 'function') {

		Number.prototype.toJSON = function() {
			return this.valueOf();
		};

	}

	if (typeof Object.assign !== 'function') {

		Object.assign = function(object /*, ... sources */) {

			if (object !== Object(object)) {
				throw new TypeError('Object.assign called on a non-object');
			}


			for (let a = 1, al = arguments.length; a < al; a++) {

				let source = arguments[a];
				if (source !== undefined && source !== null) {

					for (let key in source) {

						if (Object.prototype.hasOwnProperty.call(source, key) === true) {
							object[key] = source[key];
						}

					}

				}

			}


			return object;

		};

	}

	if (typeof Object.entries !== 'function') {

		Object.entries = function(object) {

			if (object !== Object(object)) {
				throw new TypeError('Object.entries called on a non-object');
			}


			let values = [];

			for (let prop in object) {

				if (Object.prototype.hasOwnProperty.call(object, prop)) {
					values.push([ prop, object[prop] ]);
				}

			}

			return values;

		};

	}

	if (typeof Object.filter !== 'function') {

		Object.filter = function(object, predicate/*, thisArg */) {

			if (object !== Object(object)) {
				throw new TypeError('Object.filter called on a non-object');
			}

			if (typeof predicate !== 'function') {
				throw new TypeError('predicate must be a function');
			}


			let props   = [];
			let values  = [];
			let thisArg = arguments.length >= 3 ? arguments[2] : void 0;

			for (let prop in object) {

				let value = object[prop];

				if (Object.prototype.hasOwnProperty.call(object, prop)) {

					if (predicate.call(thisArg, value, prop, object)) {
						props.push(prop);
						values.push(value);
					}

				}

			}


			let filtered = {};

			for (let i = 0; i < props.length; i++) {
				filtered[props[i]] = values[i];
			}

			return filtered;

		};

	}

	if (typeof Object.find !== 'function') {

		Object.find = function(object, predicate/*, thisArg */) {

			if (object !== Object(object)) {
				throw new TypeError('Object.find called on a non-object');
			}

			if (typeof predicate !== 'function') {
				throw new TypeError('predicate must be a function');
			}


			let thisArg = arguments.length >= 3 ? arguments[2] : void 0;

			for (let prop in object) {

				let value = object[prop];

				if (Object.prototype.hasOwnProperty.call(object, prop)) {

					if (predicate.call(thisArg, value, prop, object)) {
						return value;
					}

				}

			}

			return undefined;

		};

	}

	if (typeof Object.map !== 'function') {

		Object.map = function(object, predicate/*, thisArg */) {

			if (object !== Object(object)) {
				throw new TypeError('Object.map called on a non-object');
			}

			if (typeof predicate !== 'function') {
				throw new TypeError('predicate must be a function');
			}


			let clone   = {};
			let keys    = Object.keys(object).sort();
			let length  = keys.length >>> 0;
			let thisArg = arguments.length >= 3 ? arguments[2] : void 0;
			let key;
			let value;
			let tmp;


			for (let k = 0; k < length; k++) {

				key   = keys[k];
				value = object[key];
				tmp   = predicate.call(thisArg, value, key);

				if (tmp !== undefined) {
					clone[key] = tmp;
				}

			}


			return clone;

		};

	}

	if (typeof Object.sort !== 'function') {

		Object.sort = function(object) {

			if (object !== Object(object)) {
				throw new TypeError('Object.sort called on a non-object');
			}


			let clone  = {};
			let keys   = Object.keys(object).sort();
			let length = keys.length >>> 0;
			let key;
			let value;

			for (let k = 0; k < length; k++) {

				key   = keys[k];
				value = object[key];

				if (value instanceof Array) {

					clone[key] = value.map(element => {

						if (element instanceof Array) {
							return element;
						} else if (element instanceof Object) {
							return Object.sort(element);
						} else {
							return element;
						}

					});

				} else if (value instanceof Object) {

					clone[key] = Object.sort(value);

				} else {

					clone[key] = value;

				}

			}

			return clone;

		};

	}

	if (typeof Object.values !== 'function') {

		Object.values = function(object) {

			if (object !== Object(object)) {
				throw new TypeError('Object.values called on a non-object');
			}


			let values = [];

			for (let prop in object) {

				if (Object.prototype.hasOwnProperty.call(object, prop)) {
					values.push(object[prop]);
				}

			}

			return values;

		};

	}

	if (typeof String.prototype.endsWith !== 'function') {

		String.prototype.endsWith = function(search/*, from */) {

			if (this === null || this === undefined) {
				throw new TypeError('String.prototype.endsWith called on null or undefined');
			}


			let value  = (this).toString();
			let from   = arguments.length >= 2 ? (arguments[1] | 0) : value.length;
			let tmp    = String(search);
			let length = tmp.length >>> 0;


			let chunk = value.substr(from - length);
			if (chunk === tmp) {
				return true;
			}


			return false;

		};

	}

	if (typeof String.prototype.includes !== 'function') {

		String.prototype.includes = function(search/*, from */) {

			if (this === null || this === undefined) {
				throw new TypeError('String.prototype.includes called on null or undefined');
			}


			let value  = String(this);
			let from   = arguments.length >= 2 ? (arguments[1] | 0) : 0;
			let tmp    = String(search);
			let length = tmp.length >>> 0;

			if (from + length > value.length) {
				return false;
			}


			return value.indexOf(search, from) !== -1;

		};

	}

	if (typeof String.prototype.replaceObject !== 'function') {

		String.prototype.replaceObject = function(object) {

			if (object !== Object(object)) {
				throw new TypeError('String.prototype.replaceObject called on a non-object');
			}


			let clone  = '' + this;
			let keys   = Object.keys(object);
			let values = Object.values(object);


			for (let k = 0, kl = keys.length; k < kl; k++) {

				let key   = keys[k];
				let value = values[k];

				if (value instanceof Array) {
					value = JSON.stringify(value, null, '\t');
				} else if (value instanceof Object) {
					value = JSON.stringify(value, null, '\t');
				} else if (typeof value !== 'string') {
					value = '' + value;
				}


				let pointers = [];
				let pointer  = clone.indexOf('${' + key + '}');

				while (pointer !== -1) {
					pointers.push(pointer);
					pointer = clone.indexOf('${' + key + '}', pointer + 1);
				}


				let offset = 0;

				for (let p = 0, pl = pointers.length; p < pl; p++) {

					let index = pointers[p];

					clone   = clone.substr(0, index + offset) + value + clone.substr(index + offset + key.length + 3);
					offset += (value.length - (key.length + 3));

				}

			}


			return clone;

		};

	}

	if (typeof String.prototype.startsWith !== 'function') {

		String.prototype.startsWith = function(search/*, from */) {

			if (this === null || this === undefined) {
				throw new TypeError('String.prototype.startsWith called on null or undefined');
			}


			let value  = (this).toString();
			let from   = arguments.length >= 2 ? (arguments[1] | 0) : 0;
			let tmp    = String(search);
			let length = tmp.length >>> 0;


			let chunk = value.substr(from, length);
			if (chunk === tmp) {
				return true;
			}


			return false;

		};

	}

	if (typeof String.prototype.toJSON !== 'function') {

		String.prototype.toJSON = function() {
			return this.valueOf();
		};

	}



	/*
	 * HELPERS
	 */

	let _environment = null;
	let _simulation  = null;

	const _bootstrap_environment = function() {

		if (_environment === null) {

			_environment = new lychee.Environment({
				debug: false
			});

		}


		if (this.environment === null) {
			this.setEnvironment(_environment);
		}

	};

	const _bootstrap_simulation = function() {

		_bootstrap_environment.call(this);


		if (_simulation === null) {

			_simulation = new lychee.Simulation({
				environment: this.environment
			});

		}


		if (this.simulation === null) {
			this.setSimulation(_simulation);
		}

	};

	const _validate_environment = function(environment) {

		if (environment instanceof lychee.Environment) {
			return true;
		} else if (environment instanceof lychee.Simulation) {
			return true;
		}


		return false;

	};

	const _resolve_reference = function(identifier) {

		let pointer = this;

		let ns = identifier.split('.');
		for (let n = 0, l = ns.length; n < l; n++) {

			let name = ns[n];

			if (pointer[name] !== undefined) {
				pointer = pointer[name];
			} else {
				pointer = null;
				break;
			}

		}

		return pointer;

	};

	const _decycle = function(target, object, path) {

		let check = this.has(object);
		if (check === false) {

			this.set(object, path);

			for (let prop in object) {

				if (object.hasOwnProperty(prop) === true) {

					let ovalue = object[prop];
					if (ovalue instanceof Array) {

						target[prop] = [];

						let ref = _decycle.call(this, target[prop], object[prop], path + '.' + prop);
						if (ref !== null) {
							target[prop] = ref;
						}

					} else if (ovalue instanceof Object) {

						target[prop] = {};

						let ref = _decycle.call(this, target[prop], object[prop], path + '.' + prop);
						if (ref !== null) {
							target[prop] = ref;
						}

					} else {

						target[prop] = object[prop];

					}

				}

			}

			return null;

		} else {

			return {
				'reference': this.get(object),
				'arguments': []
			};

		}

	};



	/*
	 * IMPLEMENTATION
	 */

	const Module = {

		debug: true,

		environment: _environment,
		simulation:  _simulation,

		ENVIRONMENTS: {},
		FEATURES:     {},
		FILENAME:     null,
		PLATFORMS:    [],
		SIMULATIONS:  {},

		ROOT: {
			lychee:  '/opt/lycheejs',
			project: null
		},

		VERSION: '2018-Q3',



		/*
		 * LIBRARY API
		 */

		assignsafe: function(target) {

			target = target instanceof Object ? target : {};


			for (let a = 1, al = arguments.length; a < al; a++) {

				let object = arguments[a];
				if (object) {

					for (let prop in object) {

						if (object.hasOwnProperty(prop) === true) {

							let tvalue = target[prop];
							let ovalue = object[prop];
							if (tvalue instanceof Array && ovalue instanceof Array) {

								Module.assignsafe(target[prop], object[prop]);

							} else if (tvalue instanceof Object && ovalue instanceof Object) {

								Module.assignsafe(target[prop], object[prop]);

							} else if (tvalue === null && ovalue !== null) {

								target[prop] = object[prop];

							} else if (typeof tvalue === typeof ovalue) {

								target[prop] = object[prop];

							}

						}

					}

				}

			}


			return target;

		},

		assignunlink: function(target) {

			target = target instanceof Object ? target : {};


			for (let a = 1, al = arguments.length; a < al; a++) {

				let object = arguments[a];
				if (object) {

					for (let prop in object) {

						if (object.hasOwnProperty(prop) === true) {

							let ovalue = object[prop];
							if (ovalue instanceof Array) {

								target[prop] = [];
								Module.assignunlink(target[prop], object[prop]);

							} else if (ovalue instanceof Object) {

								target[prop] = {};
								Module.assignunlink(target[prop], object[prop]);

							} else {

								target[prop] = object[prop];

							}

						}

					}

				}

			}


			return target;

		},

		blobof: function(template, blob) {

			template = template !== undefined ? template : null;
			blob     = blob instanceof Object ? blob     : null;


			if (template !== null && blob !== null) {

				let tname    = template.displayName;
				let bname    = blob.reference || blob.constructor || null;
				let hashable = typeof tname === 'string' && typeof bname === 'string';
				let hashmap  = _BLOBOF_CACHE;


				// 0. Quick validation for identical constructors
				if (hashable === true) {

					if (hashmap[tname] !== undefined && hashmap[tname][bname] !== undefined) {

						return hashmap[tname][bname];

					} else if (tname === bname) {

						if (hashmap[tname] === undefined) {
							hashmap[tname] = {};
						}

						hashmap[tname][bname] = true;

						return hashmap[tname][bname];

					} else if (tname !== bname) {

						let instance = lychee.deserialize(blob);
						if (lychee.interfaceof(template, instance) === true) {

							if (hashmap[tname] === undefined) {
								hashmap[tname] = {};
							}

							hashmap[tname][bname] = true;

							return hashmap[tname][bname];

						}

					}

				}

			}


			return false;

		},

		decycle: function(target, object, path) {

			target = target instanceof Object ? target : {};
			object = object instanceof Object ? object : null;
			path   = typeof path === 'string' ? path   : '';


			if (object !== null) {
				_decycle.call(new WeakMap(), target, object, path);
			}

			return target;

		},

		diff: function(aobject, bobject) {

			aobject = aobject !== undefined ? aobject : undefined;
			bobject = bobject !== undefined ? bobject : undefined;


			if (aobject === bobject) {

				return false;

			} else if (aobject instanceof Array && bobject instanceof Array) {

				for (let a = 0, al = aobject.length; a < al; a++) {

					if (bobject[a] !== undefined) {

						if (aobject[a] !== null && bobject[a] !== null) {

							if (aobject[a] instanceof Object && bobject[a] instanceof Object) {

								if (Module.diff(aobject[a], bobject[a]) === true) {

									// Allows aobject[a].builds = {} and bobject[a].builds = { stuff: {}}
									if (Object.keys(aobject[a]).length > 0) {
										return true;
									}

								}

							} else if (typeof aobject[a] !== typeof bobject[a]) {
								return true;
							} else if (aobject[a] !== bobject[a]) {
								return true;
							}

						}

					} else {
						return true;
					}

				}

			} else if (aobject instanceof Date && bobject instanceof Date) {

				let astr = aobject.toString();
				let bstr = bobject.toString();

				if (astr !== bstr) {
					return true;
				}

			} else if (aobject instanceof RegExp && bobject instanceof RegExp) {

				let astr = aobject.toString();
				let bstr = bobject.toString();

				if (astr !== bstr) {
					return true;
				}

			} else if (aobject instanceof Object && bobject instanceof Object) {

				let akeys = Object.keys(aobject);
				let bkeys = Object.keys(bobject);

				if (akeys.length !== bkeys.length) {
					return true;
				}


				for (let a = 0, al = akeys.length; a < al; a++) {

					let key = akeys[a];

					if (bobject[key] !== undefined) {

						if (aobject[key] !== null && bobject[key] !== null) {

							if (aobject[key] instanceof Object && bobject[key] instanceof Object) {

								if (Module.diff(aobject[key], bobject[key]) === true) {

									// Allows aobject[key].builds = {} and bobject[key].builds = { stuff: {}}
									if (Object.keys(aobject[key]).length > 0) {
										return true;
									}

								}

							} else if (typeof aobject[key] !== typeof bobject[key]) {
								return true;
							} else if (aobject[key] !== bobject[key]) {
								return true;
							}

						}

					} else {
						return true;
					}

				}

			} else if (aobject !== bobject) {

				return true;

			}


			return false;

		},

		enumof: function(template, value) {

			template = template instanceof Object ? template : null;
			value    = typeof value === 'number'  ? value    : null;


			if (template !== null && value !== null) {

				let valid = false;

				for (let val in template) {

					if (value === template[val]) {
						valid = true;
						break;
					}

				}

				return valid;

			}


			return false;

		},

		interfaceof: function(template, instance) {

			template = template !== undefined ? template : null;
			instance = instance !== undefined ? instance : null;


			if (template !== null && instance !== null) {

				let tname    = template.displayName;
				let iname    = instance.displayName;
				let hashable = typeof tname === 'string' && typeof iname === 'string';
				let hashmap  = _INTERFACEOF_CACHE;
				let valid    = false;


				// 0. Quick validation for identical constructors
				if (hashable === true) {

					if (hashmap[tname] !== undefined && hashmap[tname][iname] !== undefined) {

						return hashmap[tname][iname];

					} else if (tname === iname) {

						if (hashmap[tname] === undefined) {
							hashmap[tname] = {};
						}

						hashmap[tname][iname] = true;

						return hashmap[tname][iname];

					}

				}


				// 1. Interface validation on Template
				if (template instanceof Function && template.prototype instanceof Object && instance instanceof Function && instance.prototype instanceof Object) {

					valid = true;

					for (let method in template.prototype) {

						if (typeof template.prototype[method] !== typeof instance.prototype[method]) {
							valid = false;
							break;
						}

					}


				// 2. Interface validation on Instance
				} else if (template instanceof Function && template.prototype instanceof Object && instance instanceof Object) {

					valid = true;

					for (let method in template.prototype) {

						if (typeof template.prototype[method] !== typeof instance[method]) {
							valid = false;
							break;
						}

					}


				// 3. Interface validation on Struct
				} else if (template instanceof Object && instance instanceof Object) {

					valid = true;

					for (let property in template) {

						if (template.hasOwnProperty(property) && instance.hasOwnProperty(property)) {

							if (typeof template[property] !== typeof instance[property]) {
								valid = false;
								break;
							}

						}

					}

				}


				if (hashable === true) {

					if (hashmap[tname] === undefined) {
						hashmap[tname] = {};
					}

					hashmap[tname][iname] = valid;

				}


				return valid;

			}


			return false;

		},



		/*
		 * ENTITY API
		 */

		deserialize: function(data) {

			data = data instanceof Object ? data : null;


			try {
				data = JSON.parse(JSON.stringify(data));
			} catch (err) {
				data = null;
			}


			if (data !== null) {

				let instance = null;
				let scope    = (this.environment !== null ? this.environment.global : global);


				if (typeof data.reference === 'string') {

					let resolved_module = _resolve_reference.call(scope, data.reference);
					if (typeof resolved_module === 'object') {
						instance = resolved_module;
					}

				} else if (typeof data.constructor === 'string' && data.arguments instanceof Array) {

					let resolved_composite = _resolve_reference.call(scope, data.constructor);
					if (typeof resolved_composite === 'function') {

						let bindargs = Array.from(data.arguments).map(value => {

							if (typeof value === 'string' && value.charAt(0) === '#') {

								if (lychee.debug === true) {
									console.log('lychee.deserialize: Injecting "' + value + '" from global');
								}

								let resolved = _resolve_reference.call(scope, value.substr(1));
								if (resolved !== null) {
									value = resolved;
								}

							}

							return value;

						});


						bindargs.reverse();
						bindargs.push(resolved_composite);
						bindargs.reverse();


						instance = new (
							resolved_composite.bind.apply(
								resolved_composite,
								bindargs
							)
						)();

					}

				} else if (data instanceof Object) {

					instance = data;

				}


				if (instance !== null) {

					// High-Level ENTITY API
					if (typeof instance.deserialize === 'function') {

						let blob = data.blob || null;
						if (blob !== null) {
							instance.deserialize(blob);
						}

					// Low-Level ASSET API
					} else if (typeof instance.load === 'function') {
						instance.load();
					}


					return instance;

				} else {

					console.info('lychee.deserialize: Require ' + (data.reference || data.constructor) + ' to deserialize it.');

				}

			}


			return null;

		},

		serialize: function(definition) {

			definition = definition !== undefined ? definition : null;


			let data = null;

			if (definition !== null) {

				if (typeof definition === 'object') {

					if (typeof definition.serialize === 'function') {

						data = definition.serialize();

					} else if (typeof definition.displayName !== 'undefined') {

						if (definition.prototype instanceof Object) {
							console.info('lychee.serialize: Define ' + (definition.displayName) + '.prototype.serialize() to serialize it.');
						} else {
							console.info('lychee.serialize: Define ' + (definition.displayName) + '.serialize() to serialize it.');
						}

					} else {

						try {
							data = JSON.parse(JSON.stringify(definition));
						} catch (err) {
							data = null;
						}

					}

				} else if (typeof definition === 'function') {

					data = definition.toString();

				}

			}


			return data;

		},



		/*
		 * CUSTOM API
		 */

		assimilate: function(target) {

			target = typeof target === 'string' ? target : null;


			if (target !== null) {

				_bootstrap_environment.call(this);


				let asset = new lychee.Asset(target, null, false);
				if (asset !== null) {
					asset.load();
				}


				return asset;

			} else {

				console.warn('lychee.assimilate: Invalid target.');
				console.info('lychee.assimilate: Use lychee.assimilate(target).');
				console.info('lychee.assimilate: target is a URL to an Asset.');

			}


			return null;

		},

		define: function(identifier) {

			identifier = typeof identifier === 'string' ? identifier : null;


			if (identifier !== null) {

				_bootstrap_environment.call(this);


				let definition = new lychee.Definition({
					id:  identifier,
					url: lychee.FILENAME || null
				});


				let count   = 0;
				let sandbox = this;

				while (count < 64 && sandbox.environment.sandbox === true) {
					sandbox = sandbox.environment.global.lychee;
					count++;
				}

				definition.exports = function(callback) {
					lychee.Definition.prototype.exports.call(this, callback);
					sandbox.environment.define(this, false);
				};


				return definition;

			} else {

				console.warn('lychee.define: Invalid identifier.');
				console.info('lychee.define: Use lychee.define(id).exports(function(lychee, global, attachments) {}).');
				console.info('lychee.define: identifier is a dot-separated notation, e.g. "app.entity.Example".');
				console.info('lychee.define: The "lycheejs-breeder init <identifier>" command may help you.');

			}


			return null;

		},

		export: function(reference, sandbox) {

			reference = typeof reference === 'string' ? reference : null;
			sandbox   = sandbox !== undefined         ? sandbox   : global;


			if (reference !== null && sandbox !== null) {

				_bootstrap_environment.call(this);


				let definition = this.environment.definitions[reference] || null;
				if (definition !== null) {

					let result = definition.export(sandbox);
					if (result === true) {

						let instance = _resolve_reference.call(sandbox, reference);
						if (instance !== null) {
							return instance;
						}

					}

				}

			} else {

				console.warn('lychee.export: Invalid reference.');
				console.info('lychee.export: Use lychee.export(reference, sandbox).');
				console.info('lychee.export: reference is a Definition identifier.');

			}


			return null;

		},

		import: function(reference) {

			reference = typeof reference === 'string' ? reference : null;


			if (reference !== null) {

				_bootstrap_environment.call(this);


				let count    = 0;
				let instance = null;
				let sandbox  = this;

				while (count < 64 && sandbox.environment.sandbox === true) {
					sandbox = sandbox.environment.global.lychee;
					count++;
				}

				let resolved_module = _resolve_reference.call(sandbox.environment.global, reference);
				if (resolved_module !== null) {
					instance = resolved_module;
				}


				if (instance === null) {
					console.info('lychee.import: Require "' + reference + '" to import it.');
				}


				return instance;

			} else {

				console.warn('lychee.import: Invalid reference.');
				console.info('lychee.import: Use lychee.import(reference).');
				console.info('lychee.import: reference is a Definition identifier.');

			}


			return null;

		},

		init: function(environment, settings, callback) {

			let message = environment !== null;

			environment = _validate_environment(environment) === true ? environment : null;
			settings    = settings instanceof Object                  ? settings    : null;
			callback    = callback instanceof Function                ? callback    : null;


			_bootstrap_environment.call(this);
			_bootstrap_simulation.call(this);


			if (environment !== null && settings !== null) {

				if (_environment !== null) {

					if (environment instanceof lychee.Environment) {

						Object.values(_environment.definitions).forEach(definition => {
							environment.define(definition, true);
						});

					} else if (environment instanceof lychee.Simulation) {

						Object.values(_environment.definitions).forEach(definition => {
							environment.environment.define(definition, true);
						});

					}

				}


				if (environment.id.startsWith('lychee-Environment-')) {
					environment.setId((lychee.ROOT.project || '').substr((lychee.ROOT.lychee || '').length) + '/custom');
				}

				for (let id in settings) {

					let method = 'set' + id.charAt(0).toUpperCase() + id.substr(1);
					if (typeof environment[method] === 'function') {
						environment[method](settings[id]);
					}

				}


				if (environment instanceof lychee.Environment) {

					if (callback === null) {

						let code    = '';
						let profile = settings.profile || {};

						code += '\n\n';
						code += 'if (sandbox === null) {\n';
						code += '\tconsole.error(\'lychee: environment.init() failed.\');\n';
						code += '\treturn;\n';
						code += '}\n';
						code += '\n\n';
						code += 'let lychee = sandbox.lychee;\n';

						let packages = environment.packages;
						if (packages instanceof Object && Array.isArray(packages) === false) {

							for (let pid in packages) {

								if (pid !== 'lychee' && /$([a-z]+)/g.test(pid)) {
									code += 'let ' + pid + ' = sandbox.' + pid + ';\n';
								}

							}

						}

						code += '\n\n';
						code += 'sandbox.MAIN = new ' + environment.target + '(' + JSON.stringify(profile) + ');\n';
						code += '\n\n';
						code += 'if (typeof sandbox.MAIN.init === \'function\') {\n';
						code += '\tsandbox.MAIN.init();\n';
						code += '}\n';

						callback = new Function('sandbox', code);

					}


					lychee.setEnvironment(environment);
					environment.init(callback);

				} else if (environment instanceof lychee.Simulation) {

					let simulation = environment;

					environment = simulation.environment;


					if (callback === null) {

						let code = '';

						code += '\n\n';
						code += 'if (sandbox_sim === null) {\n';
						code += '\tconsole.error(\'lychee: simulation.init() failed.\');\n';
						code += '\treturn;\n';
						code += '}\n';
						code += '\n\n';
						code += 'console.info(\'lychee: simulation.init() succeeded.\');\n';

						callback = new Function('sandbox_sim', code);

					}


					lychee.setEnvironment(environment);

					environment.init(sandbox => {

						if (sandbox === null) {
							console.error('lychee: environment.init() failed.');
							return;
						}


						console.info('lychee: environment.init() succeeded.');

						lychee.setSimulation(simulation);
						simulation.init(callback);

					});

				}


				return true;

			} else if (message === true) {

				console.warn('lychee.init: Invalid environment.');
				console.info('lychee.init: Use lychee.init(environment, settings, callback).');
				console.info('lychee.init: environment is either a lychee.Environment or lychee.Simulation instance.');

			}


			return false;

		},

		inject: function(environment) {

			let message = environment !== null;

			environment = environment instanceof lychee.Environment ? environment : null;


			_bootstrap_environment.call(this);


			if (environment !== null) {

				if (this.environment !== null) {

					Object.values(environment.definitions).forEach(definition => {
						this.environment.define(definition, true);
					});

					let build_old = this.environment.definitions[this.environment.target] || null;
					let build_new = environment.definitions[environment.target]           || null;

					if (build_old === null && build_new !== null) {
						this.environment.target = environment.target;
						this.environment.type   = environment.type;
					}


					return true;

				} else {

					console.warn('lychee.inject: Invalid default environment for injection.');
					console.info('lychee.inject: Use lychee.setEnvironment(environment) before using lychee.inject(other).');

				}

			} else if (message === true) {

				console.warn('lychee.inject: Invalid environment.');
				console.info('lychee.inject: Use lychee.inject(environment).');
				console.info('lychee.inject: environment is a lychee.Environment instance.');

			}


			return false;

		},

		pkg: function(type, id, callback) {

			type     = typeof type === 'string'     ? type       : null;
			id       = typeof id === 'string'       ? id         : null;
			callback = callback instanceof Function ? callback   : null;


			if (id !== null && type !== null && callback !== null) {

				if (/^(build|review|source)$/g.test(type)) {

					let config = new Config('./lychee.pkg');

					config.onload = function() {

						let buffer = this.buffer || null;
						if (buffer instanceof Object) {

							let settings = buffer[type].environments[id] || null;
							if (settings instanceof Object) {

								let environment = null;
								let profile     = settings.profile || null;

								if (profile !== null) {
									delete settings.profile;
								}

								if (type === 'build' || type === 'source') {
									environment = new lychee.Environment(JSON.parse(JSON.stringify(settings)));
								} else if (type === 'review') {
									environment = new lychee.Simulation(JSON.parse(JSON.stringify(settings)));
								}

								callback(environment, profile);

							} else {

								console.warn('lychee.pkg: Invalid Settings for "' + id + '" in "' + this.url + '".');
								console.info('lychee.pkg: Verify Settings at "/' + type + '/environments/' + id + '" in lychee.pkg.');

								callback(null, null);

							}

						} else {

							console.warn('lychee.pkg: Invalid Package at "' + this.url + '".');
							console.info('lychee.pkg: Replace lychee.pkg with the one from "/projects/boilerplate".');
							console.info('lychee.pkg: The "lycheejs-harvester start" command may help you.');

							callback(null, null);

						}

					};

					config.load();

					return true;

				}

			}


			return false;

		},

		specify: function(identifier) {

			identifier = typeof identifier === 'string' ? identifier : null;


			if (identifier !== null) {

				_bootstrap_simulation.call(this);


				let sandbox       = this;
				let specification = new lychee.Specification({
					id:  identifier,
					url: lychee.FILENAME || null
				});

				specification.exports = function(callback) {
					lychee.Specification.prototype.exports.call(this, callback);
					sandbox.simulation.specify(this, false);
				};


				return specification;

			} else {

				console.warn('lychee.specify: Invalid identifier.');
				console.info('lychee.specify: Use lychee.specify(id).exports(function(lychee, sandbox) {}).');
				console.info('lychee.specify: identifier is a dot-separated notation, e.g. "app.entity.Example".');
				console.info('lychee.specify: The "lycheejs-breeder init <identifier>" command may help you.');

			}


			return null;

		},

		setEnvironment: function(environment) {

			environment = environment instanceof lychee.Environment ? environment : null;


			if (environment !== null) {

				this.environment = environment;
				this.debug       = this.environment.debug;

				return true;

			} else {

				this.environment = _environment;
				this.debug       = this.environment.debug;

			}


			return false;

		},

		setSimulation: function(simulation) {

			simulation = simulation instanceof lychee.Simulation ? simulation : null;


			if (simulation !== null) {

				this.simulation = simulation;

				return true;

			} else {

				this.simulation = _simulation;

			}


			return false;

		}

	};


	if (typeof lychee === 'undefined') {
		lychee = global.lychee = Object.assign({}, Module);
	}


	return Module;

})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));


lychee.Asset = typeof lychee.Asset !== 'undefined' ? lychee.Asset : (function(global) {

	/*
	 * HELPERS
	 */

	const _resolve_constructor = function(type) {

		let construct = null;


		if (type === 'fnt')   construct = global.Font;
		if (type === 'json')  construct = global.Config;
		if (type === 'msc')   construct = global.Music;
		if (type === 'pkg')   construct = global.Config;
		if (type === 'png')   construct = global.Texture;
		if (type === 'snd')   construct = global.Sound;
		if (type === 'store') construct = global.Config;


		if (construct === null) {
			construct = global.Stuff || null;
		}


		return construct;

	};



	/*
	 * IMPLEMENTATION
	 */

	const Callback = function(url, type, ignore) {

		url    = typeof url === 'string'  ? url  : null;
		type   = typeof type === 'string' ? type : null;
		ignore = ignore === true;


		let asset = null;

		if (url !== null) {

			if (type === null) {

				if (url.startsWith('data:')) {
					type = url.split(';')[0].split('/').pop();
				} else {
					type = url.split('/').pop().split('.').pop();
				}

			}


			let construct = _resolve_constructor(type);
			if (construct !== null) {

				if (url.startsWith('data:')) {

					asset = new construct('/tmp/Asset.' + type, ignore);
					asset.deserialize({
						buffer: url
					});

				} else {

					asset = new construct(url, ignore);

				}

			}

		}


		return asset;

	};


	Callback.displayName = 'lychee.Asset';


	return Callback;

})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));


lychee.Debugger = typeof lychee.Debugger !== 'undefined' ? lychee.Debugger : (function(global) {

	/*
	 * HELPERS
	 */

	let _client      = null;
	let _environment = null;
	let _error_trace = Error.prepareStackTrace;


	const _bootstrap_environment = function() {

		if (_environment === null) {

			let currentenv = lychee.environment;
			lychee.setEnvironment(null);

			let defaultenv = lychee.environment;
			lychee.setEnvironment(currentenv);

			_environment = defaultenv;

		}

	};

	const _diff_environment = function(environment) {

		let cache1 = {};
		let cache2 = {};

		let global1 = _environment.global;
		let global2 = environment.global;

		for (let prop1 in global1) {

			if (global1[prop1] === global2[prop1]) continue;

			if (typeof global1[prop1] !== typeof global2[prop1]) {
				cache1[prop1] = global1[prop1];
			}

		}

		for (let prop2 in global2) {

			if (global2[prop2] === global1[prop2]) continue;

			if (typeof global2[prop2] !== typeof global1[prop2]) {
				cache2[prop2] = global2[prop2];
			}

		}


		let diff = Object.assign({}, cache1, cache2);
		if (Object.keys(diff).length > 0) {
			return diff;
		}


		return null;

	};

	const _report_error = function(environment, data) {

		let info1 = 'Report from ' + data.file + '#L' + data.line + ' in ' + data.method;
		let info2 = data.message.trim();
		let info3 = data.stacktrace.map(callsite => callsite.file + '#L' + callsite.line + ' in ' + callsite.method).join('\n');


		let main = environment.global.MAIN || null;
		if (main !== null) {

			let client = main.client || null;
			if (client !== null) {

				let service = client.getService('debugger');
				if (service !== null) {
					service.report('lychee.Debugger: ' + info1, data);
				}

			}

		}


		console.error('lychee.Debugger: ' + info1);

		if (info2.length > 0) {
			console.error('lychee.Debugger: ' + info2);
		}

		if (info3.length > 0) {

			info3.split('\n').forEach(line => {
				console.error('lychee.Debugger: ' + line);
			});

		}
	};



	/*
	 * IMPLEMENTATION
	 */

	const Module = {

		// deserialize: function(blob) {},

		serialize: function() {

			return {
				'reference': 'lychee.Debugger',
				'blob':      null
			};

		},

		expose: function(environment) {

			environment = environment instanceof lychee.Environment ? environment : lychee.environment;


			_bootstrap_environment();


			if (environment !== null && environment !== _environment) {

				let project = environment.id;
				if (project !== null) {

					if (lychee.diff(environment.global, _environment.global) === true) {

						let diff = _diff_environment(environment);
						if (diff !== null) {
							return diff;
						}

					}

				}

			}


			return null;

		},

		report: function(environment, error, referer) {

			_bootstrap_environment();


			environment = environment instanceof lychee.Environment ? environment : null;
			error       = error instanceof Error                    ? error       : null;
			referer     = referer instanceof Object                 ? referer     : null;


			if (environment !== null && error !== null) {

				let definition = null;

				if (referer !== null) {

					if (referer instanceof Stuff) {
						definition = referer.url;
					} else if (referer instanceof lychee.Definition) {
						definition = referer.id;
					}

				}


				let data = {
					project:     environment.id,
					definition:  definition,
					environment: environment.serialize(),
					file:        null,
					line:        null,
					method:      null,
					type:        null,
					message:     error.message || '',
					stacktrace:  []
				};


				if (typeof error.stack === 'string') {

					let header = error.stack.trim().split('\n')[0].trim();
					let check1 = header.split(':')[0].trim();
					let check2 = header.split(':').slice(1).join(':').trim();

					if (/^(ReferenceError|SyntaxError)$/g.test(check1)) {
						data.type    = check1;
						data.message = check2;
					}


					let stacktrace = error.stack.trim().split('\n').map(raw => {

						let file   = null;
						let line   = null;
						let method = null;

						let chunk = raw.trim();
						if (chunk.startsWith('at')) {

							let tmp1 = chunk.substr(2).trim().split(' ');
							if (tmp1.length === 2) {

								method = tmp1[0].trim();

								if (tmp1[1].startsWith('(')) tmp1[1] = tmp1[1].substr(1).trim();
								if (tmp1[1].endsWith(')'))   tmp1[1] = tmp1[1].substr(0, tmp1[1].length - 1).trim();

								let check = tmp1[1];
								if (check.startsWith('http://') || check.startsWith('https://')) {
									tmp1[1] = '/' + check.split('/').slice(3).join('/');
								} else if (check.startsWith('file://')) {
									tmp1[1] = tmp1[1].substr(7);
								}


								let tmp2 = tmp1[1].split(':');
								if (tmp2.length === 3) {
									file = tmp2[0];
									line = tmp2[1];
								} else if (tmp2.length === 2) {
									file = tmp2[0];
									line = tmp2[1];
								} else if (tmp2.length === 1) {
									file = tmp2[0];
								}

							}

						} else if (chunk.includes('@')) {

							let tmp1 = chunk.split('@');
							if (tmp1.length === 2) {

								if (tmp1[0] !== '') {
									method = tmp1[0];
								}

								let check = tmp1[1];
								if (check.startsWith('http://') || check.startsWith('https://')) {
									tmp1[1] = '/' + check.split('/').slice(3).join('/');
								} else if (check.startsWith('file://')) {
									tmp1[1] = tmp1[1].substr(7);
								}


								let tmp2 = tmp1[1].split(':');
								if (tmp2.length === 3) {
									file = tmp2[0];
									line = tmp2[1];
								} else if (tmp2.length === 2) {
									file = tmp2[0];
									line = tmp2[1];
								} else if (tmp2.length === 1) {
									file = tmp2[0];
								}

							}

						}


						if (file !== null) {

							if (file.startsWith('/opt/lycheejs')) {
								file = file.substr(13);
							}

						}

						if (line !== null) {

							let num = parseInt(line, 10);
							if (!isNaN(num)) {
								line = num;
							}

						}


						return {
							method: method,
							file:   file,
							line:   line
						};

					}).filter(callsite => {

						if (
							callsite.method === null
							&& callsite.file === null
							&& callsite.line === null
						) {
							return false;
						}

						return true;

					});


					if (stacktrace.length > 0) {

						let callsite = stacktrace[0];

						data.method     = callsite.method;
						data.file       = callsite.file;
						data.line       = callsite.line;
						data.stacktrace = stacktrace;

					}

				} else if (typeof Error.captureStackTrace === 'function') {

					Error.prepareStackTrace = function(err, stack) {
						return stack;
					};
					Error.captureStackTrace(error);
					Error.prepareStackTrace = _error_trace;


					let stacktrace = Array.from(error.stack).map(frame => {

						let file   = frame.getFileName()     || null;
						let line   = frame.getLineNumber()   || null;
						let method = frame.getFunctionName() || frame.getMethodName() || null;

						if (method !== null) {

							let type = frame.getTypeName() || null;
							if (type !== null) {
								method = type + '.' + method;
							}

						}

						if (file !== null && file.startsWith('/opt/lycheejs')) {
							file = file.substr(13);
						}


						return {
							file:   file,
							line:   line,
							method: method
						};

					}).filter(callsite => {

						if (
							callsite.method === null
							&& callsite.file === null
							&& callsite.line === null
						) {
							return false;
						}

						return true;

					});


					if (stacktrace.length > 0) {

						let callsite = stacktrace[0];

						data.file       = callsite.file;
						data.line       = callsite.line;
						data.method     = callsite.method;
						data.stacktrace = stacktrace;

					}

				}


				_report_error(environment, data);


				return true;

			} else if (error !== null) {

				console.error(error);

			}


			return false;

		}

	};


	Module.displayName = 'lychee.Debugger';


	return Module;

})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));


lychee.Definition = typeof lychee.Definition !== 'undefined' ? lychee.Definition : (function(global) {

	const lychee = global.lychee;



	/*
	 * HELPERS
	 */

	const _DETECTOR_CACHE = {};
	const _WARNING_CACHE  = {};

	const _create_detector = function(platform) {

		platform = typeof platform === 'string' ? platform : null;


		if (platform !== null) {

			let sandbox = _DETECTOR_CACHE[platform] || null;
			if (sandbox === null) {

				if (platform.includes('-') === true) {

					let major = platform.split('-')[0];
					let minor = platform.split('-')[1];
					let clone = Object.assign({}, lychee.FEATURES[major], lychee.FEATURES[major + '-' + minor]);
					let proxy = _create_proxy(clone);
					if (proxy !== null) {
						sandbox = proxy;
					}

				} else {

					let clone = lychee.FEATURES[platform] || null;
					let proxy = _create_proxy(clone);
					if (proxy !== null) {
						sandbox = proxy;
					}

				}


				_DETECTOR_CACHE[platform] = sandbox;

			}


			return sandbox;

		}


		return null;

	};

	const _create_proxy = function(source, path) {

		path = typeof path === 'string' ? path : 'global';


		if (source === null) {
			return source;
		}


		if (typeof Proxy !== 'undefined') {

			let clone = {};
			let proxy = new Proxy(clone, {

				get: function(target, name) {

					// XXX: Remove this and console will crash the program
					if (name === 'splice') return undefined;


					if (target[name] === undefined) {

						let type = typeof source[name];
						if (/boolean|number|string|function/g.test(type)) {
							target[name] = source[name];
						} else if (/object/g.test(type)) {
							target[name] = _create_proxy(source[name], path + '.' + name);
						} else if (/undefined/g.test(type)) {
							target[name] = undefined;
						}


						if (target[name] === undefined) {

							let warned = _WARNING_CACHE[path + '.' + name] || false;
							if (warned === false) {
								_WARNING_CACHE[path + '.' + name] = true;
								console.warn('lychee.Definition: Unknown feature (data type) "' + path + '.' + name + '" in FEATURES.js');
							}

						}

					}


					return target[name];

				}

			});


			proxy.toJSON = function() {

				let data = {};

				Object.keys(clone).forEach(key => {

					if (/toJSON/g.test(key) === false) {

						let type = typeof clone[key];
						if (/boolean|number|string|function/g.test(type)) {
							data[key] = type;
						} else if (/object/g.test(type)) {
							data[key] = clone[key];
						}

					}

				});

				return data;

			};


			return proxy;

		}


		return source;

	};

	const _fuzz_asset = function(type) {

		let asset = {
			url:       '/tmp/Dummy.' + type,
			_is_dummy: true,
			serialize: function() {
				return null;
			}
		};


		let url = this.url;
		if (url !== null) {
			asset.url = url.split('.').slice(0, -1).join('.') + '.' + type;
		}


		Object.defineProperty(asset, 'buffer', {
			get: function() {
				return null;
			},
			set: function() {
				return false;
			},
			enumerable:   true,
			configurable: false
		});


		return asset;

	};

	const _fuzz_id = function() {

		let found = null;

		if (this.url !== null) {

			let namespace = null;

			for (let pid in lychee.environment.packages) {

				let pkg  = lychee.environment.packages[pid];
				let base = pkg.url.split('/').slice(0, -1).join('/');

				if (this.url.startsWith(base)) {
					namespace = pkg.id;
				}

			}


			if (namespace !== null) {

				let id    = '';
				let ns    = this.url.split('/');
				let tmp_i = ns.indexOf('source');
				let tmp_s = ns[ns.length - 1];

				if (/\.js$/g.test(tmp_s)) {
					ns[ns.length - 1] = tmp_s.split('.').slice(0, -1).join('.');
				}

				if (tmp_i !== -1 && ns[tmp_i + 1] === 'core') {

					if (ns[tmp_i + 2] === 'lychee') {
						ns.splice(tmp_i + 1, 2);
					} else {
						ns.splice(tmp_i + 1, 1);
					}

				}

				if (tmp_i !== -1) {
					id = ns.slice(tmp_i + 1).join('.');
				}

				if (id !== '') {
					found = namespace + '.' + id;
				} else {
					found = namespace;
				}

			}

		}

		return found;

	};

	const _resolve = function(identifier) {

		let pointer   = this;
		let namespace = identifier.split('.');
		let id        = namespace.pop();

		for (let n = 0, nl = namespace.length; n < nl; n++) {

			let name = namespace[n];

			if (pointer[name] === undefined) {
				pointer[name] = {};
			}

			pointer = pointer[name];

		}


		let check = id.toLowerCase();
		if (check === id) {

			if (pointer[id] === undefined) {
				pointer[id] = {};
			}

			return pointer[id];

		} else {

			if (pointer[id] !== undefined) {
				return pointer[id];
			}

		}


		return null;

	};



	/*
	 * IMPLEMENTATION
	 */

	const Composite = function(data) {

		let states = Object.assign({}, data);


		this.id  = '';
		this.url = lychee.FILENAME || null;

		this._attaches = {
			'json':  _fuzz_asset.call(this, 'json'),
			'fnt':   _fuzz_asset.call(this, 'fnt'),
			'msc':   _fuzz_asset.call(this, 'msc'),
			'pkg':   _fuzz_asset.call(this, 'pkg'),
			'png':   _fuzz_asset.call(this, 'png'),
			'snd':   _fuzz_asset.call(this, 'snd'),
			'store': _fuzz_asset.call(this, 'store')
		};
		this._tags     = {};
		this._requires = [];
		this._includes = [];
		this._exports  = null;
		this._supports = null;


		// XXX: url has to be set first for fuzzing
		this.setUrl(states.url);
		this.setId(states.id);


		this.tags(states.tags);
		this.requires(states.requires);
		this.includes(states.includes);
		this.supports(states.supports);
		this.exports(states.exports);


		states = null;

	};


	Composite.prototype = {

		/*
		 * ENTITY API
		 */

		deserialize: function(blob) {

			if (blob.attaches instanceof Object) {

				let attachesmap = {};

				for (let aid in blob.attaches) {
					attachesmap[aid] = lychee.deserialize(blob.attaches[aid]);
				}

				this.attaches(attachesmap);

			}

			if (blob.tags instanceof Object) {
				this.tags(blob.tags);
			}

			if (blob.requires instanceof Array) {
				this.requires(blob.requires);
			}

			if (blob.includes instanceof Array) {
				this.includes(blob.includes);
			}


			if (typeof blob.supports === 'string') {

				// Function head
				let tmp = blob.exports.split('{')[0].trim();
				if (tmp.startsWith('function')) {
					tmp = tmp.substr('function'.length).trim();
				}

				if (tmp.startsWith('anonymous')) tmp = tmp.substr('anonymous'.length).trim();
				if (tmp.startsWith('('))         tmp = tmp.substr(1).trim();
				if (tmp.endsWith(')'))           tmp = tmp.substr(0, tmp.length - 1).trim();

				let bindargs = tmp.split(',').map(name => name.trim());
				let check    = bindargs[bindargs.length - 1];
				if (check.includes('\n')) {
					bindargs[bindargs.length - 1] = check.split('\n')[0];
				}


				// Function body
				let i1 = blob.supports.indexOf('{') + 1;
				let i2 = blob.supports.lastIndexOf('}') - 1;
				bindargs.push(blob.supports.substr(i1, i2 - i1));

				this.supports(Function.apply(Function, bindargs));

			}

			if (typeof blob.exports === 'string') {

				// Function head
				let tmp = blob.exports.split('{')[0].trim();
				if (tmp.startsWith('function')) {
					tmp = tmp.substr('function'.length).trim();
				}

				if (tmp.startsWith('anonymous')) tmp = tmp.substr('anonymous'.length).trim();
				if (tmp.startsWith('('))         tmp = tmp.substr(1).trim();
				if (tmp.endsWith(')'))           tmp = tmp.substr(0, tmp.length - 1).trim();

				let bindargs = tmp.split(',').map(name => name.trim());
				let check    = bindargs[bindargs.length - 1];
				if (check.includes('\n')) {
					bindargs[bindargs.length - 1] = check.split('\n')[0];
				}


				// Function body
				let i1 = blob.exports.indexOf('{') + 1;
				let i2 = blob.exports.lastIndexOf('}') - 1;
				bindargs.push(blob.exports.substr(i1, i2 - i1));

				this.exports(Function.apply(Function, bindargs));

			}

		},

		serialize: function() {

			let states = {};
			let blob   = {};


			if (this.id !== '')  states.id  = this.id;
			if (this.url !== '') states.url = this.url;


			if (Object.keys(this._attaches).length > 0) {

				blob.attaches = {};

				for (let aid in this._attaches) {

					let asset = this._attaches[aid];
					if (asset.url.startsWith('/tmp/Dummy') === false) {

						let data = lychee.serialize(asset);
						if (data !== null) {
							blob.attaches[aid] = data;
						}

					}

				}

			}

			if (Object.keys(this._tags).length > 0) {

				blob.tags = {};

				for (let tid in this._tags) {
					blob.tags[tid] = this._tags[tid];
				}

			}

			if (this._requires.length > 0)          blob.requires = this._requires.slice(0);
			if (this._includes.length > 0)          blob.includes = this._includes.slice(0);
			if (this._supports instanceof Function) blob.supports = this._supports.toString();
			if (this._exports instanceof Function)  blob.exports  = this._exports.toString();


			return {
				'constructor': 'lychee.Definition',
				'arguments':   [ states ],
				'blob':        Object.keys(blob).length > 0 ? blob : null
			};

		},



		/*
		 * CUSTOM API
		 */

		setId: function(id) {

			id = typeof id === 'string' ? id : null;


			if (id !== null) {

				if (id.includes('.') && /^([A-Za-z0-9-.]+)$/g.test(id)) {

					this.id = id;

					return true;

				} else {

					let fuzzed = _fuzz_id.call(this);
					if (fuzzed !== null) {

						this.id = fuzzed;

						console.warn('lychee.Definition: Injecting Identifier "' + fuzzed + '" ("' + this.url + '").');

						return true;

					} else {

						console.error('lychee.Definition: Invalid Identifier "' + id + '" ("' + this.url + '").');

					}

				}

			}


			return false;

		},

		setUrl: function(url) {

			url = typeof url === 'string' ? url : null;


			if (url !== null) {

				this.url = url;

				return true;

			}


			return false;

		},

		attaches: function(map) {

			map = map instanceof Object ? map : null;


			if (map !== null) {

				for (let id in map) {

					let value = map[id];
					if (value !== undefined) {
						this._attaches[id] = map[id];
					}

				}

			}


			return this;

		},

		check: function(target) {

			target = target instanceof Object ? target : {};


			let features  = null;
			let supported = true;
			let tagged    = true;


			for (let key in this._tags) {

				let tag = this._tags[key];
				let val = target[key] || null;
				if (val instanceof Array) {

					if (val.includes(tag) === false) {
						tagged = false;
						break;
					}

				} else if (typeof val === 'string') {

					if (val !== tag) {
						tagged = false;
						break;
					}

				}

			}


			if (this._supports !== null) {

				supported = false;


				let platform = this._tags.platform || null;
				if (platform !== null) {

					let detector = _create_detector(platform);
					if (detector !== null) {
						supported = this._supports.call(detector, lychee, detector);
						features  = JSON.parse(JSON.stringify(detector));
						detector  = null;
					} else {
						supported = this._supports.call(global, lychee, global);
					}

				} else {

					supported = this._supports.call(global, lychee, global);

				}

			}


			return {
				features:  features,
				supported: supported,
				tagged:    tagged
			};

		},

		export: function(sandbox) {

			sandbox = sandbox !== undefined ? sandbox : global;


			let check = _resolve.call(sandbox, this.id);
			if (check === null) {

				let console   = sandbox.console || global.console;
				let id        = this.id;
				let namespace = _resolve.call(sandbox, id.split('.').slice(0, -1).join('.'));
				let name      = id.split('.').pop();

				if (this._exports !== null) {

					let includes = this._includes.map(id => _resolve.call(sandbox, id));
					let requires = this._requires.map(id => _resolve.call(sandbox, id));

					if (includes.includes(null) === false && requires.includes(null) === false) {

						let template = null;

						try {

							template = this._exports.call(
								this._exports,
								sandbox.lychee,
								sandbox,
								this._attaches
							) || null;

						} catch (err) {
							lychee.Debugger.report(lychee.environment, err, this);
						}


						if (template !== null) {

							if (includes.length > 0) {

								let own_enums   = null;
								let own_methods = null;
								let own_keys    = Object.keys(template);
								let own_proto   = template.prototype;


								if (own_keys.length > 0) {

									own_enums = {};

									for (let ok = 0, okl = own_keys.length; ok < okl; ok++) {

										let own_key = own_keys[ok];
										if (own_key === own_key.toUpperCase()) {
											own_enums[own_key] = template[own_key];
										}

									}

									if (Object.keys(own_enums).length === 0) {
										own_enums = null;
									}

								}


								if (own_proto instanceof Object) {

									own_methods = {};

									for (let own_method in own_proto) {
										own_methods[own_method] = own_proto[own_method];
									}

									if (Object.keys(own_methods).length === 0) {
										own_methods = null;
									}

								}


								Object.defineProperty(namespace, name, {
									value:        template,
									writable:     false,
									enumerable:   true,
									configurable: false
								});

								namespace[name].displayName = id;
								namespace[name].prototype   = {};


								let tpl_enums   = {};
								let tpl_methods = [ namespace[name].prototype ];


								for (let i = 0, il = includes.length; i < il; i++) {

									let include  = includes[i];
									let inc_keys = Object.keys(include);
									if (inc_keys.length > 0) {

										for (let ik = 0, ikl = inc_keys.length; ik < ikl; ik++) {

											let inc_key = inc_keys[ik];
											if (inc_key === inc_key.toUpperCase()) {
												tpl_enums[inc_key] = include[inc_key];
											}

										}

									}

									tpl_methods.push(include.prototype);

								}


								if (own_enums !== null) {

									for (let e in own_enums) {
										tpl_enums[e] = own_enums[e];
									}

								}

								if (own_methods !== null) {
									tpl_methods.push(own_methods);
								}

								for (let e in tpl_enums) {
									namespace[name][e] = tpl_enums[e];
								}


								Object.assign.apply(lychee, tpl_methods);
								namespace[name].prototype.displayName = id;

								Object.freeze(namespace[name].prototype);


								return true;

							} else {

								namespace[name]             = template;
								namespace[name].displayName = id;


								if (template instanceof Object) {
									Object.freeze(namespace[name]);
								}

								if (namespace[name].prototype instanceof Object) {
									namespace[name].prototype.displayName = id;
									Object.freeze(namespace[name].prototype);
								}


								return true;

							}

						} else {

							namespace[name]                       = function() {
								console.warn('Dummy Composite: Replace me with a real Definition!');
							};
							namespace[name].displayName           = id;
							namespace[name].prototype             = {};
							namespace[name].prototype.displayName = id;

							Object.freeze(namespace[name].prototype);

							console.warn('lychee.Definition ("' + id + '"): Invalid Definition, replaced with Dummy Composite.');


							return true;

						}

					} else {

						let invalid_includes = this._includes.filter((id, i) => includes[i] === null);
						if (invalid_includes.length > 0) {

							for (let i = 0, il = invalid_includes.length; i < il; i++) {
								let tmp = invalid_includes[i];
								console.error('lychee.Definition ("' + id + '"): Invalid Inclusion of "' + tmp + '".');
							}

						}


						let invalid_requires = this._requires.filter((id, r) => requires[r] === null);
						if (invalid_requires.length > 0) {

							for (let i = 0, il = invalid_requires.length; i < il; i++) {
								let tmp = invalid_requires[i];
								console.error('lychee.Definition ("' + id + '"): Invalid Requirement of "' + tmp + '".');
							}

						}

					}

				}


				return false;

			}


			return true;

		},

		exports: function(callback) {

			callback = callback instanceof Function ? callback : null;


			if (callback !== null) {

				let check = (callback).toString().split('{')[0];
				if (check.includes('\n')) {
					check = check.split('\n').join('');
				}

				if (check.includes('(lychee, global, attachments)') || check.includes('(lychee,global,attachments)')) {
					this._exports = callback;
				} else {
					console.error('lychee.Definition ("' + this.id + '"): Invalid exports callback.');
					console.info('lychee.Definition ("' + this.id + '"): Use lychee.define(id).exports(function(lychee, global, attachments) {}).');
				}

			}


			return this;

		},

		includes: function(definitions) {

			definitions = definitions instanceof Array ? definitions : null;


			if (definitions !== null) {

				for (let d = 0, dl = definitions.length; d < dl; d++) {

					let definition = definitions[d];
					if (typeof definition === 'string') {

						let is_definition = definition.includes('.');
						if (is_definition === true) {

							if (this._includes.includes(definition) === false) {
								this._includes.push(definition);
							}

						}

					} else {
						console.warn('lychee.Definition ("' + this.id + '"): Invalid Inclusion #' + d + '.');
					}

				}

			}


			return this;

		},

		requires: function(definitions) {

			definitions = definitions instanceof Array ? definitions : null;


			if (definitions !== null) {

				for (let d = 0, dl = definitions.length; d < dl; d++) {

					let definition = definitions[d];
					if (typeof definition === 'string') {

						let is_definition = definition.includes('.');
						if (is_definition === true) {

							if (this._requires.includes(definition) === false) {
								this._requires.push(definition);
							}

						}

					} else {
						console.warn('lychee.Definition ("' + this.id + '"): Invalid Requirement #' + d + '.');
					}

				}

			}


			return this;

		},

		supports: function(callback) {

			callback = callback instanceof Function ? callback : null;


			if (callback !== null) {

				let check = (callback).toString().split('{')[0];
				if (check.includes('\n')) {
					check = check.split('\n').join('');
				}

				if (check.includes('(lychee, global)') || check.includes('(lychee,global')) {
					this._supports = callback;
				} else {
					console.error('lychee.Definition ("' + this.id + '"): Invalid supports callback.');
					console.info('lychee.Definition ("' + this.id + '"): Use lychee.specify(id).supports(function(lychee, global) {}).');
				}

			}


			return this;

		},

		tags: function(map) {

			map = map instanceof Object ? map : null;


			if (map !== null) {

				for (let tag in map) {

					let val = map[tag];
					if (typeof val === 'string') {
						this._tags[tag] = val;
					} else {
						console.warn('lychee.Definition ("' + this.id + '"): Invalid Tag "' + tag + '".');
					}

				}

			}


			return this;

		}

	};


	Composite.displayName           = 'lychee.Definition';
	Composite.prototype.displayName = 'lychee.Definition';


	return Composite;

})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));


lychee.Environment = typeof lychee.Environment !== 'undefined' ? lychee.Environment : (function(global) {

	let   _id      = 0;
	const _console = global.console;
	const _lychee  = global.lychee;



	/*
	 * EVENTS
	 */

	const _build_loop = function(cache) {

		let load        = cache.load;
		let required_by = cache.required_by;
		let trace       = cache.trace;


		for (let l = 0, ll = load.length; l < ll; l++) {

			let identifier = load[l];
			let definition = this.definitions[identifier] || null;
			if (definition !== null) {

				if (trace.indexOf(identifier) === -1) {
					trace.push(identifier);
				}

				required_by.splice(l, 1);
				load.splice(l, 1);

				ll--;
				l--;

			}

		}


		for (let t = 0, tl = trace.length; t < tl; t++) {

			let identifier = trace[t];
			let definition = this.definitions[identifier] || null;
			if (definition !== null) {

				let dependencies = _resolve_dependencies.call(this, definition);
				if (dependencies.length > 0) {

					for (let d = 0, dl = dependencies.length; d < dl; d++) {

						let dependency = dependencies[d];
						if (load.indexOf(dependency) === -1 && trace.indexOf(dependency) === -1) {

							let result = this.load(dependency);
							if (result === true) {
								required_by.push(identifier);
								load.push(dependency);
							}

						}

					}

				} else {

					definition.export(this.global);

					trace.splice(t, 1);
					tl--;
					t--;

				}

			}

		}


		if (load.length === 0 && trace.length === 0) {

			cache.active = false;

		} else {

			if (Date.now() > cache.timeout) {
				cache.active = false;
			}

		}

	};

	const _on_build_success = function(cache, callback) {

		if (this.debug === true) {
			this.global.console.info('lychee.Environment ("' + this.id + '"): BUILD END (' + (cache.end - cache.start) + 'ms).');
		}


		try {
			callback.call(this.global, this.global);
		} catch (err) {
			_lychee.Debugger.report(this, err, null);
		}

	};

	const _on_build_timeout = function(cache, callback) {

		if (this.debug === true) {
			this.global.console.warn('lychee.Environment ("' + this.id + '"): BUILD TIMEOUT (' + (cache.end - cache.start) + 'ms).');
		}


		// XXX: Always show Dependency Errors
		if (cache.load.length > 0) {

			let variant = this.variant;
			if (variant === 'library') {

				this.global.console.warn('lychee.Environment ("' + this.id + '"): Invalid Dependencies\n' + cache.load.map((dependency, index) => {

					let requiree = cache.required_by[index] || null;
					if (requiree === null) {
						requiree = this.target;
					}

					return '\t - ' + dependency + ' (required by ' + requiree + ')';

				}).join('\n'));

				cache.load.forEach((dependency, index) => {

					let requiree = cache.required_by[index] || null;
					if (requiree === null) {
						requiree = this.target;
					}

					let definition = this.definitions[requiree] || null;
					if (definition !== null) {

						let i0 = definition._includes.indexOf(dependency);
						let i1 = definition._requires.indexOf(dependency);

						if (i0 !== -1 || i1 !== -1) {
							this.global.console.warn('lychee.Environment ("' + this.id + '"): -> Removing "' + dependency + '" from "' + definition.id + '".');
						}

						if (i0 !== -1) {
							definition._includes.splice(i0, 1);
						}

						if (i1 !== -1) {
							definition._requires.splice(i1, 1);
						}

					}


					let target = this.definitions[this.target] || null;
					if (target !== null) {

						let i0 = target._includes.indexOf(dependency);
						let i1 = target._requires.indexOf(dependency);

						if (i0 !== -1 || i1 !== -1) {
							this.global.console.warn('lychee.Environment ("' + this.id + '"): -> Removing "' + dependency + '" from "' + target.id + '".');
						}

						if (i0 !== -1) {
							target._includes.splice(i0, 1);
						}

						if (i1 !== -1) {
							target._requires.splice(i1, 1);
						}

					}

				});

			} else {

				this.global.console.error('lychee.Environment ("' + this.id + '"): Invalid Dependencies\n' + cache.load.map((dependency, index) => {

					let requiree = cache.required_by[index] || null;
					if (requiree === null) {
						requiree = this.target;
					}

					return '\t - ' + dependency + ' (required by ' + requiree + ')';

				}).join('\n'));

			}

		}


		// XXX: Always show Cyclic Dependencies
		if (cache.trace.length > 0) {

			let cyclic_dependencies = {};

			cache.trace.forEach(id => {

				let definition = this.definitions[id] || null;
				if (definition !== null) {

					for (let i = 0, il = definition._requires.length; i < il; i++) {

						let require = definition._requires[i];
						if (cache.trace.includes(require)) {

							let entry = cyclic_dependencies[id] || null;
							if (entry === null) {
								entry = cyclic_dependencies[id] = [];
							}

							entry.push(require);

						}

					}

					for (let i = 0, il = definition._includes.length; i < il; i++) {

						let include = definition._includes[i];
						if (cache.trace.includes(include)) {

							let entry = cyclic_dependencies[id] || null;
							if (entry === null) {
								entry = cyclic_dependencies[id] = [];
							}

							entry.push(include);

						}

					}

				}

			});


			for (let id in cyclic_dependencies) {

				let entry = cyclic_dependencies[id];

				for (let e = 0, el = entry.length; e < el; e++) {

					let other = cyclic_dependencies[entry[e]] || [];
					if (other.includes(id) === false) {
						delete cyclic_dependencies[id];
						break;
					}

				}

			}


			let entries = Object.values(cyclic_dependencies);
			if (entries.length > 0) {

				let requirees = Object.keys(cyclic_dependencies);

				this.global.console.error('lychee.Environment ("' + this.id + '"): Invalid Dependencies\n' + entries.map((dependencies, index) => {
					return dependencies.map(dependency => '\t - ' + dependency + ' (required by ' + requirees[index] + ')').join('\n');
				}).join('\n'));

			}

		}


		try {
			callback.call(this.global, null);
		} catch (err) {
			_lychee.Debugger.report(this, err, null);
		}

	};



	/*
	 * HELPERS
	 */

	const _inject_features = function(source, features) {

		Object.keys(features).forEach(key => {

			let type = features[key];
			if (/boolean|number|string|function/g.test(type)) {

				this[key] = source[key];

			} else if (typeof type === 'object') {

				if (typeof source[key] === 'object') {

					this[key] = source[key];

					_inject_features.call(this[key], source[key], type);

				}

			}

		});

	};

	const _validate_definition = function(definition) {

		if (definition instanceof _lychee.Definition) {

			let check = definition.check(this.tags);
			let type  = this.type;


			if (check.features !== null) {

				if (type === 'source' || type === 'export') {
					this.__features = _lychee.assignunlink(this.__features, check.features);
				}

				let sandbox = this.sandbox;
				if (sandbox === true) {
					_inject_features.call(this.global, global, check.features);
				}

			}


			if (type === 'build') {

				if (check.tagged === false) {
					let info = Object.keys(this.tags).length > 0 ? (' (missing tags(' + JSON.stringify(this.tags) + ')).') : '.';
					this.global.console.warn('lychee.Environment ("' + this.id + '"): Untagged Definition "' + definition.id + '"' + info);
				}

				return check.tagged;

			} else if (type === 'export') {

				if (check.tagged === false) {
					let info = Object.keys(this.tags).length > 0 ? (' (missing tags(' + JSON.stringify(this.tags) + ')).') : '.';
					this.global.console.warn('lychee.Environment ("' + this.id + '"): Untagged Definition "' + definition.id + '"' + info);
				}

				return check.tagged;

			} else if (type === 'source') {

				if (check.supported === false) {

					let platforms = this.tags.platform || [];
					if (platforms.length > 0) {
						let info = platforms.map(val => 'lychee.FEATURES[\'' + val + '\']').join(' or ');
						this.global.console.warn('lychee.Environment ("' + this.id + '"): Unsupported Definition "' + definition.id + '" (missing ' + info + ' entry).');
					}

				}

				if (check.tagged === false) {
					let info = Object.keys(this.tags).length > 0 ? (' (missing tags(' + JSON.stringify(this.tags) + ')).') : '.';
					this.global.console.warn('lychee.Environment ("' + this.id + '"): Untagged Definition "' + definition.id + '"' + info);
				}

				return check.supported && check.tagged;

			}

		}


		return false;

	};

	const _resolve = function(identifier) {

		let pointer = this;
		let path    = identifier.split('.');

		for (let p = 0, pl = path.length; p < pl; p++) {

			let name = path[p];

			if (pointer[name] !== undefined) {
				pointer = pointer[name];
			} else if (pointer[name] === undefined) {
				pointer = null;
				break;
			}

		}

		return pointer;

	};

	const _resolve_dependencies = function(definition) {

		let dependencies = [];

		if (definition instanceof _lychee.Definition) {

			for (let i = 0, il = definition._includes.length; i < il; i++) {

				let inc   = definition._includes[i];
				let check = _resolve.call(this.global, inc);
				if (check === null) {
					dependencies.push(inc);
				}

			}

			for (let r = 0, rl = definition._requires.length; r < rl; r++) {

				let req   = definition._requires[r];
				let check = _resolve.call(this.global, req);
				if (check === null) {
					dependencies.push(req);
				}

			}

		}

		return dependencies;

	};



	/*
	 * STRUCTS
	 */

	const _CRUX_CORE = [
		'assignsafe',
		'assignunlink',
		'blobof',
		'diff',
		'enumof',
		'interfaceof',
		'deserialize',
		'serialize',
		'assimilate',
		'define',
		'export',
		'import',
		'init',
		'inject',
		'pkg',
		'specify',
		'setEnvironment',
		'setSimulation'
	];

	const _CRUX_DEFINITIONS = [
		'Asset',
		'Debugger',
		'Definition',
		'Environment',
		'Package',
		'Simulation',
		'Specification'
	];

	const _Sandbox = function(settings, platforms) {

		settings  = settings instanceof Object ? settings  : null;
		platforms = platforms instanceof Array ? platforms : [];


		let _std_err = '';
		let _std_out = '';


		this.console = {};
		this.console.log = function() {

			let str = '\n';

			for (let a = 0, al = arguments.length; a < al; a++) {

				let arg = arguments[a];
				if (arg instanceof Object) {
					str += JSON.stringify(arg, null, '\t');
				} else if (typeof arg.toString === 'function') {
					str += arg.toString();
				} else {
					str += arg;
				}

				if (a < al - 1) {
					str += '\t';
				}

			}


			if (str.startsWith('\n(E)\t')) {
				_std_err += str;
			} else {
				_std_out += str;
			}

		};

		this.console.info = function() {

			let args = [ '(I)\t' ];

			for (let a = 0, al = arguments.length; a < al; a++) {
				args.push(arguments[a]);
			}

			this.log.apply(this, args);

		};

		this.console.warn = function() {

			let args = [ '(W)\t' ];

			for (let a = 0, al = arguments.length; a < al; a++) {
				args.push(arguments[a]);
			}

			this.log.apply(this, args);

		};

		this.console.error = function() {

			let args = [ '(E)\t' ];

			for (let a = 0, al = arguments.length; a < al; a++) {
				args.push(arguments[a]);
			}

			this.log.apply(this, args);

		};

		this.console.deserialize = function(blob) {

			if (typeof blob.stdout === 'string') {
				_std_out = blob.stdout;
			}

			if (typeof blob.stderr === 'string') {
				_std_err = blob.stderr;
			}

		};

		this.console.serialize = function() {

			let blob = {};


			if (_std_out.length > 0) blob.stdout = _std_out;
			if (_std_err.length > 0) blob.stderr = _std_err;


			return {
				'reference': 'console',
				'blob':      Object.keys(blob).length > 0 ? blob : null
			};

		};


		this.Buffer  = global.Buffer;
		this.Config  = global.Config;
		this.Font    = global.Font;
		this.Music   = global.Music;
		this.Sound   = global.Sound;
		this.Texture = global.Texture;


		this.lychee              = {};
		this.lychee.debug        = global.lychee.debug;
		this.lychee.environment  = null;
		this.lychee.simulation   = null;
		this.lychee.ENVIRONMENTS = global.lychee.ENVIRONMENTS;
		this.lychee.FEATURES     = global.lychee.FEATURES;
		this.lychee.FILENAME     = global.lychee.FILENAME;
		this.lychee.PLATFORMS    = global.lychee.PLATFORMS;
		this.lychee.SIMULATIONS  = global.lychee.SIMULATIONS;
		this.lychee.ROOT         = {};
		this.lychee.ROOT.lychee  = global.lychee.ROOT.lychee;
		this.lychee.ROOT.project = global.lychee.ROOT.project;
		this.lychee.VERSION      = global.lychee.VERSION;


		_CRUX_CORE.forEach(identifier => {
			this.lychee[identifier] = _lychee[identifier];
		});

		_CRUX_DEFINITIONS.forEach(identifier => {
			this.lychee[identifier] = _lychee[identifier];
		});


		this.require = function(path) {
			return global.require(path);
		};

		this.setTimeout = function(callback, timeout) {
			global.setTimeout(callback, timeout);
		};

		this.setInterval = function(callback, interval) {
			global.setInterval(callback, interval);
		};



		/*
		 * GLOBAL INJECTION
		 */

		if (settings instanceof Object) {

			Object.keys(settings).forEach(key => {

				let instance = _lychee.deserialize(settings[key]);
				if (instance !== null) {
					this[key] = instance;
				}

			});

		}

		/*
		 * FEATURE INJECTION
		 */

		if (platforms.length > 0) {

			platforms.reverse().forEach(platform => {

				let features = _lychee.FEATURES[platform] || null;
				if (features instanceof Object) {

					for (let gid in features) {

						if (this[gid] === undefined) {

							let reference = global[gid];
							if (reference instanceof Object) {

								this[gid] = reference;

							} else if (typeof reference === 'function') {

								this[gid] = function() {
									return global[gid].apply(global, arguments);
								};

							} else {

								this[gid] = reference;

							}

						}

					}

				}

			});

		}

	};

	_Sandbox.prototype = {

		displayName: '_Sandbox',

		deserialize: function(blob) {

			if (blob.console instanceof Object) {
				this.console.deserialize(blob.console.blob);
			}

		},

		serialize: function() {

			let states = {};
			let blob   = {};


			Object.keys(this).filter(key => key.charAt(0) !== '_' && key === key.toUpperCase()).forEach(key => {
				states[key] = _lychee.serialize(this[key]);
			});


			blob.lychee          = {};
			blob.lychee.debug    = this.lychee.debug;
			blob.lychee.FILENAME = this.lychee.FILENAME;
			blob.lychee.VERSION  = this.lychee.VERSION;
			blob.lychee.ROOT     = this.lychee.ROOT;


			let data = this.console.serialize();
			if (data.blob !== null) {
				blob.console = data;
			}


			return {
				'constructor': '_Sandbox',
				'arguments':   [ states ],
				'blob':        Object.keys(blob).length > 0 ? blob : null
			};

		}

	};



	/*
	 * IMPLEMENTATION
	 */

	const Composite = function(data) {

		let states = Object.assign({}, data);


		this.id          = 'lychee-Environment-' + _id++;
		this.debug       = true;
		this.definitions = {};
		this.global      = global !== undefined ? global : {};
		this.packages    = {};
		this.sandbox     = false;
		this.tags        = {};
		this.target      = 'app.Main';
		this.timeout     = 10000;
		this.type        = 'source';
		this.variant     = 'application';

		this.__cache    = {
			active:        false,
			assimilations: [],
			start:         0,
			end:           0,
			retries:       0,
			timeout:       0,
			load:          [],
			trace:         [],
			required_by:   []
		};
		this.__features = {};


		// Alternative API for lychee.pkg

		if (states.packages instanceof Array) {

			this.global.console.error('lychee.Environment ("' + this.id + '"): Invalid Packages.');
			delete states.packages;

		} else if (states.packages instanceof Object) {

			for (let pid in states.packages) {

				let value = states.packages[pid];
				if (typeof value === 'string') {

					states.packages[pid] = new _lychee.Package({
						id:          pid,
						url:         value,
						type:        'source',
						environment: this
					});

				}

			}

		}


		this.setSandbox(states.sandbox);
		this.setDebug(states.debug);

		this.setDefinitions(states.definitions);
		this.setId(states.id);
		this.setPackages(states.packages);
		this.setTags(states.tags);
		this.setTimeout(states.timeout);
		this.setVariant(states.variant);

		// Needs this.packages to be ready
		this.setType(states.type);

		// Needs this.type to be ready
		this.setTarget(states.target);


		states = null;

	};


	Composite.prototype = {

		/*
		 * ENTITY API
		 */

		deserialize: function(blob) {

			if (blob.definitions instanceof Object) {

				for (let did in blob.definitions) {
					this.definitions[did] = _lychee.deserialize(blob.definitions[did]);
				}

			}

			let features = _lychee.deserialize(blob.features);
			if (features !== null) {
				this.__features = features;
			}

			if (blob.global instanceof Object) {

				this.global = new _Sandbox(blob.global.arguments[0], this.tags.platform || null);

				if (blob.global.blob !== null) {
					this.global.deserialize(blob.global.blob);
				}

			}

		},

		serialize: function() {

			let states = {};
			let blob   = {};


			if (this.id !== '')                 states.id      = this.id;
			if (this.debug !== true)            states.debug   = this.debug;
			if (this.sandbox !== false)         states.sandbox = this.sandbox;
			if (this.timeout !== 10000)         states.timeout = this.timeout;
			if (this.target !== 'app.Main')     states.target  = this.target;
			if (this.type !== 'source')         states.type    = this.type;
			if (this.variant !== 'application') states.variant = this.variant;


			if (Object.keys(this.packages).length > 0) {

				states.packages = {};

				for (let pid in this.packages) {
					states.packages[pid] = this.packages[pid].url;
				}

			}

			if (Object.keys(this.tags).length > 0) {

				states.tags = {};

				for (let tagid in this.tags) {
					states.tags[tagid] = this.tags[tagid];
				}

			}


			if (Object.keys(this.definitions).length > 0) {

				blob.definitions = {};

				for (let did in this.definitions) {
					blob.definitions[did] = _lychee.serialize(this.definitions[did]);
				}

			}

			if (Object.keys(this.__features).length > 0) blob.features = _lychee.serialize(this.__features);

			if (this.sandbox === true) {
				blob.global = this.global.serialize();
			}


			return {
				'constructor': 'lychee.Environment',
				'arguments':   [ states ],
				'blob':        Object.keys(blob).length > 0 ? blob : null
			};

		},



		/*
		 * CUSTOM API
		 */

		load: function(identifier) {

			identifier = typeof identifier === 'string' ? identifier : null;


			if (identifier !== null) {

				let tmp    = identifier.split('.');
				let pkg_id = tmp[0];
				let def_id = tmp.slice(1).join('.');


				let definition = this.definitions[identifier] || null;
				if (definition !== null) {

					return true;

				} else if (pkg_id === 'lychee' && _CRUX_DEFINITIONS.includes(def_id) === true) {

					return true;

				} else {

					let pkg = this.packages[pkg_id] || null;
					if (pkg !== null && pkg.config !== null) {

						let result = pkg.load(def_id, this.tags);
						if (result === true) {

							if (this.debug === true) {
								this.global.console.log('lychee.Environment ("' + this.id + '"): Loading "' + identifier + '" from Package "' + pkg.id + '".');
							}

						}

						return result;

					}

				}

			}


			return false;

		},

		define: function(definition, inject) {

			definition = definition instanceof _lychee.Definition ? definition : null;
			inject     = inject === true;


			if (definition !== null) {

				let url = definition.url || null;
				if (url !== null && inject === false) {

					let assimilation = true;
					let new_pkg_id   = null;
					let old_pkg_id   = definition.id.split('.')[0];
					let packages     = this.packages;

					for (let pid in packages) {

						let pkg = packages[pid];

						if (url.startsWith(pkg.root)) {
							new_pkg_id = pkg.id;
						}

						if (pid === old_pkg_id || pid === new_pkg_id) {
							assimilation = false;
						}

					}


					if (assimilation === true) {

						if (this.debug === true) {
							this.global.console.log('lychee.Environment ("' + this.id + '"): Assimilating Definition "' + definition.id + '".');
						}


						this.__cache.assimilations.push(definition.id);

					} else if (new_pkg_id !== null && new_pkg_id !== old_pkg_id) {

						if (this.debug === true) {
							this.global.console.log('lychee.Environment ("' + this.id + '"): Injecting Definition "' + definition.id + '" into Package "' + new_pkg_id + '".');
						}


						definition.id = new_pkg_id + '.' + definition.id.split('.').slice(1).join('.');

						for (let i = 0, il = definition._includes.length; i < il; i++) {

							let inc = definition._includes[i];
							if (inc.startsWith(old_pkg_id)) {
								definition._includes[i] = new_pkg_id + inc.substr(old_pkg_id.length);
							}

						}

						for (let r = 0, rl = definition._requires.length; r < rl; r++) {

							let req = definition._requires[r];
							if (req.startsWith(old_pkg_id)) {
								definition._requires[r] = new_pkg_id + req.substr(old_pkg_id.length);
							}

						}

					}

				} else {

					// XXX: Direct injection has no auto-mapping

				}


				if (_validate_definition.call(this, definition) === true) {

					if (this.debug === true) {
						let info = Object.keys(definition._tags).length > 0 ? (' (' + JSON.stringify(definition._tags) + ')') : '.';
						this.global.console.log('lychee.Environment ("' + this.id + '"): Mapping Definition "' + definition.id + '"' + info);
					}

					this.definitions[definition.id] = definition;


					return true;

				}

			}


			let info = Object.keys(definition._tags).length > 0 ? (' (' + JSON.stringify(definition._tags) + ').') : '.';
			this.global.console.error('lychee.Environment ("' + this.id + '"): Invalid Definition "' + definition.id + '"' + info);


			return false;

		},

		init: function(callback) {

			callback = callback instanceof Function ? callback : function() {};


			if (this.debug === true) {
				this.global.lychee.ENVIRONMENTS[this.id] = this;
			}


			let cache  = this.__cache;
			let target = this.target;

			if (target !== null && cache.active === false) {

				let result = this.load(target);
				if (result === true) {

					if (this.debug === true) {
						this.global.console.info('lychee.Environment ("' + this.id + '"): BUILD START ("' + target + '").');
					}


					cache.start       = Date.now();
					cache.timeout     = Date.now() + this.timeout;
					cache.load        = [ target ];
					cache.trace       = [];
					cache.required_by = [];
					cache.active      = true;


					let interval = setInterval(_ => {

						let cache = this.__cache;
						if (cache.active === true) {

							_build_loop.call(this, cache);

						} else if (cache.active === false) {

							if (interval !== null) {
								clearInterval(interval);
								interval = null;
							}


							let assimilations = cache.assimilations;
							if (assimilations.length > 0) {

								for (let a = 0, al = assimilations.length; a < al; a++) {

									let identifier = assimilations[a];
									let definition = this.definitions[identifier] || null;
									if (definition !== null) {
										definition.export(this.global);
									}

								}

							}


							cache.end = Date.now();


							if (cache.end > cache.timeout) {
								_on_build_timeout.call(this, cache, callback);
							} else {
								_on_build_success.call(this, cache, callback);
							}

						}

					}, (1000 / 60) | 0);

				} else {

					cache.retries++;


					if (cache.retries < 10) {

						if (this.debug === true) {
							this.global.console.warn('lychee.Environment ("' + this.id + '"): Unready Package "' + target + '" (retrying in 100ms ...).');
						}

						setTimeout(_ => this.init(callback), 100);

					} else {

						this.global.console.error('lychee.Environment ("' + this.id + '"): Invalid Dependencies\n\t - ' + target + ' (target).');


						try {
							callback.call(this.global, null);
						} catch (err) {
							_lychee.Debugger.report(this, err, null);
						}

					}

				}


				return true;

			}


			try {
				callback.call(this.global, null);
			} catch (err) {
				_lychee.Debugger.report(this, err, null);
			}


			return false;

		},

		resolve: function(path) {

			path = typeof path === 'string' ? path : '';


			let proto = path.split(':')[0] || '';
			if (/^http|https/g.test(proto) === false) {

				if (path.startsWith('/tmp') === false && path.startsWith(_lychee.ROOT.lychee) === false) {

					if (path.startsWith('/')) {
						path = _lychee.ROOT.lychee + path;
					} else {
						path = _lychee.ROOT.project + '/' + path;
					}

				}

			}


			let tmp = path.split('/');

			for (let t = 0, tl = tmp.length; t < tl; t++) {

				if (tmp[t] === '.') {
					tmp.splice(t, 1);
					tl--;
					t--;
				} else if (tmp[t] === '..') {
					tmp.splice(t - 1, 2);
					tl -= 2;
					t  -= 2;
				}

			}

			return tmp.join('/');

		},

		setDebug: function(debug) {

			debug = typeof debug === 'boolean' ? debug : null;


			if (debug !== null) {

				this.debug = debug;

				if (this.sandbox === true) {
					this.global.lychee.debug = debug;
				}

				return true;

			}


			return false;

		},

		setDefinitions: function(definitions) {

			definitions = definitions instanceof Object ? definitions : null;


			if (definitions !== null) {

				for (let identifier in definitions) {

					let definition = definitions[identifier];
					if (definition instanceof _lychee.Definition) {
						this.definitions[identifier] = definition;
					}

				}


				return true;

			}


			return false;

		},

		setId: function(id) {

			id = typeof id === 'string' ? id : null;


			if (id !== null) {

				this.id = id;

				return true;

			}


			return false;

		},

		setPackages: function(packages) {

			packages = packages instanceof Object ? packages : null;


			if (packages !== null) {

				for (let pid in this.packages) {

					if (pid !== 'lychee') {
						this.packages[pid].setEnvironment(null);
						delete this.packages[pid];
					}

				}


				for (let pid in packages) {

					let pkg = packages[pid];
					if (pkg instanceof _lychee.Package) {

						if (this.debug === true) {
							this.global.console.log('lychee.Environment ("' + this.id + '"): Adding Package "' + pkg.id + '".');
						}

						pkg.setEnvironment(this);
						this.packages[pid] = pkg;

					}

				}


				let type = this.type;
				if (/^(export|source)$/g.test(type)) {

					let lychee_pkg = this.packages['lychee'] || null;
					if (lychee_pkg === null) {

						lychee_pkg = new _lychee.Package({
							id:          'lychee',
							url:         '/libraries/lychee/lychee.pkg',
							environment: this
						});

						if (this.debug === true) {
							this.global.console.log('lychee.Environment ("' + this.id + '"): Injecting Package "lychee".');
						}

						this.packages['lychee'] = lychee_pkg;

					}

				}

				return true;

			}


			return false;

		},

		setSandbox: function(sandbox) {

			sandbox = typeof sandbox === 'boolean' ? sandbox : null;


			if (sandbox !== null) {

				if (sandbox !== this.sandbox) {

					this.sandbox = sandbox;


					if (sandbox === true) {

						this.global = new _Sandbox(null, this.tags.platform || null);
						this.global.lychee.setEnvironment(this);

					} else {

						this.global = global;

					}

				}


				return true;

			}


			return false;

		},

		setTags: function(tags) {

			tags = tags instanceof Object ? tags : null;


			if (tags !== null) {

				this.tags = {};

				for (let type in tags) {

					let values = tags[type];
					if (values instanceof Array) {
						this.tags[type] = values.filter(value => typeof value === 'string');
					}

				}

				return true;

			}


			return false;

		},

		setTimeout: function(timeout) {

			timeout = typeof timeout === 'number' ? (timeout | 0) : null;


			if (timeout !== null) {

				this.timeout = timeout;

				return true;

			}


			return false;

		},

		setTarget: function(identifier) {

			identifier = typeof identifier === 'string' ? identifier : null;


			if (identifier !== null) {

				let type = this.type;
				if (type === 'build') {

					this.target = identifier;

					return true;

				} else {

					let pid = identifier.split('.')[0];
					let pkg = this.packages[pid] || null;
					if (pkg !== null) {

						this.target = identifier;

						return true;

					}

				}

			}


			return false;

		},

		setType: function(type) {

			type = typeof type === 'string' ? type : null;


			if (type !== null) {

				if (/^(build|export|source)$/g.test(type)) {

					this.type = type;


					if (type === 'export') {
						type = 'source';
					}


					for (let pid in this.packages) {
						this.packages[pid].setType(type);
					}


					return true;

				}

			}


			return false;

		},

		setVariant: function(variant) {

			variant = typeof variant === 'string' ? variant : null;


			if (variant !== null) {

				if (/^(application|library)$/g.test(variant)) {

					this.variant = variant;

					return true;

				}


			}


			return false;

		}

	};


	Composite.displayName           = 'lychee.Environment';
	Composite.prototype.displayName = 'lychee.Environment';


	return Composite;

})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));


lychee.Package = typeof lychee.Package !== 'undefined' ? lychee.Package : (function(global) {

	const lychee = global.lychee;


	/*
	 * HELPERS
	 */

	const _fuzz_id = function() {

		let found = null;

		if (this.url !== null) {

			let url = this.url;
			if (url.includes('/libraries/')) {

				let ns    = url.split('/');
				let tmp_i = ns.indexOf('libraries');
				let tmp_s = ns[tmp_i + 1] || '';

				if (tmp_s !== '') {
					found = tmp_s;
				}

			}

		}

		return found;

	};

	const _resolve_root = function() {

		let root = this.root;
		let type = this.type;

		if (type === 'api') {
			root += '/api';
		} else if (type === 'build') {
			root += '/build';
		} else if (type === 'review') {
			root += '/review';
		} else if (type === 'source') {
			root += '/source';
		}

		return root;

	};

	const _CORE_MAP = {
		'':              'lychee',
		'Asset':         'Asset',
		'Debugger':      'Debugger',
		'Definition':    'Definition',
		'Environment':   'Environment',
		'Package':       'Package',
		'Simulation':    'Simulation',
		'Specification': 'Specification'
	};

	const _resolve_path = function(candidate) {

		let config = this.config;
		let path   = typeof candidate === 'string' ? candidate.split('/') : null;

		if (config !== null && path !== null) {

			let pointer = config.buffer[this.type].files || null;

			if (pointer !== null) {

				for (let p = 0, pl = path.length; p < pl; p++) {

					let name = path[p];
					if (pointer[name] !== undefined) {
						pointer = pointer[name];
					} else {
						pointer = null;
						break;
					}

				}

			}

			return pointer;

		}


		return null;

	};

	const _resolve_attachments = function(candidate) {

		let config      = this.config;
		let attachments = {};

		if (config !== null) {

			let pointer = _resolve_path.call(this, candidate);
			if (pointer !== null && pointer instanceof Array) {

				let definition_path = _resolve_root.call(this) + '/' + candidate;

				for (let po = 0, pol = pointer.length; po < pol; po++) {

					let type = pointer[po];
					if (type !== 'js') {
						attachments[type] = definition_path + '.' + type;
					}

				}

			}

		}

		return attachments;

	};

	const _resolve_candidates = function(id, tags) {

		tags = tags instanceof Object ? tags : null;


		let candidatepath = id.split('.').join('/');
		let candidates    = [];

		if (tags !== null) {

			for (let tag in tags) {

				let values = [];

				if (tags[tag] instanceof Array) {

					let tmp = tags[tag].map(value => _resolve_tag.call(this, tag, value) + '/' + candidatepath);
					if (tmp.length > 0) {
						values = tmp.filter(path => _resolve_path.call(this, path) !== null);
					}

				}

				if (values.length > 0) {
					candidates.push.apply(candidates, values);
				}

			}

		}


		let core_path = _CORE_MAP[candidatepath] || null;
		if (core_path !== null && this.id === 'lychee' && this.type !== 'source') {

			candidates.push(core_path);

		} else {

			if (_resolve_path.call(this, candidatepath) !== null) {
				candidates.push(candidatepath);
			}

		}


		return candidates;

	};

	const _resolve_namespaces = function(node, namespaces, path) {

		namespaces = namespaces instanceof Array ? namespaces : [];
		path       = typeof path === 'string'    ? path       : '';


		if (node instanceof Array) {

			// Ignore Arrays specifically

		} else if (node instanceof Object) {

			if (path !== '' && namespaces.includes(path) === false) {
				namespaces.push(path);
			}

			Object.keys(node).forEach(child => {

				if (child.includes('__') === false) {

					if (node[child] instanceof Array) {
						// Ignore Arrays specifically
					} else {
						_resolve_namespaces(node[child], namespaces, (path !== '' ? (path + '.') : '') + child);
					}

				}

			});

		}

	};

	const _resolve_files = function(node, files, path, extensions) {

		files      = files instanceof Array   ? files : [];
		path       = typeof path === 'string' ? path  : '';
		extensions = extensions === true;


		if (node instanceof Array) {

			if (extensions === true) {

				for (let n = 0, nl = node.length; n < nl; n++) {
					files.push(path + '.' + node[n]);
				}

			} else {

				files.push(path);

			}

		} else if (node instanceof Object) {

			Object.keys(node).forEach(child => {

				if (child.includes('__') === false) {
					_resolve_files(node[child], files, path + '/' + child, extensions);
				}

			});

		}

		return files;

	};

	const _resolve_tag = function(tag, value) {

		tag   = typeof tag === 'string'   ? tag   : null;
		value = typeof value === 'string' ? value : null;


		let config = this.config;

		if (config !== null && tag !== null && value !== null) {

			let pointer = config.buffer[this.type].tags || null;
			if (pointer !== null) {

				if (pointer[tag] instanceof Object) {

					let path = pointer[tag][value] || null;
					if (path !== null) {
						return path;
					}

				}

			}

		}


		return '';

	};

	const _sort_by_tag = function(a, b) {

		let rank_a = 0;
		let rank_b = 0;

		let check_a = a.includes('-');
		let check_b = b.includes('-');

		if (check_a && check_b) {

			let tmp_a = a.split('-');
			let tmp_b = b.split('-');

			if (tmp_a[0] > tmp_b[0]) rank_a += 3;
			if (tmp_b[0] > tmp_a[0]) rank_b += 3;

			if (tmp_a[0] === tmp_b[0]) {
				if (tmp_a[1] > tmp_b[1]) rank_a += 1;
				if (tmp_b[1] > tmp_a[1]) rank_b += 1;
			}

		} else if (check_a && !check_b) {

			let tmp_a = a.split('-');

			if (tmp_a[0] > b)   rank_a += 3;
			if (b > tmp_a[0])   rank_b += 3;
			if (tmp_a[0] === b) rank_b += 1;

		} else if (!check_a && check_b) {

			let tmp_b = b.split('-');

			if (a > tmp_b[0])   rank_a += 3;
			if (tmp_b[0] > a)   rank_b += 3;
			if (a === tmp_b[0]) rank_a += 1;

		} else {

			if (a > b) rank_a += 3;
			if (b > a) rank_b += 3;

		}

		if (rank_a > rank_b) return  1;
		if (rank_b > rank_a) return -1;
		return 0;

	};

	const _validate_env_tags = function(source_tags, target_tags) {

		for (let tag in source_tags) {

			let source_value = source_tags[tag];
			let target_value = target_tags[tag] || null;
			if (target_value !== null) {

				if (source_value instanceof Array && target_value instanceof Array) {

					let valid = true;

					for (let t = 0, tl = target_value.length; t < tl; t++) {

						let check = source_value.includes(target_value[t]);
						if (check === false) {
							valid = false;
							break;
						}

					}

					if (valid === false) {
						return false;
					}

				} else if (source_value instanceof Array && typeof target_value === 'string') {

					let check = source_value.includes(target_value);
					if (check === false) {
						return false;
					}

				} else if (typeof source_value === 'string' && typeof target_value === 'string') {

					let check = source_value === target_value;
					if (check === false) {
						return false;
					}

				} else if (typeof source_value === 'string' && target_value instanceof Array) {

					let check = target_value.includes(source_value);
					if (check === false) {
						return false;
					}

				}

			}

		}


		return true;

	};

	const _load_candidate = function(id, candidates) {

		if (candidates.length > 0) {

			let map = {
				id:           id,
				candidate:    null,
				candidates:   Array.from(candidates),
				attachments:  [],
				dependencies: [],
				loading:      1,
				type:         this.type
			};


			this.__requests[id] = map;


			let candidate = map.candidates.shift();

			while (candidate !== undefined) {

				if (this.__blacklist[candidate] === 1) {
					candidate = map.candidates.shift();
				} else {
					break;
				}

			}


			// Try to load the first suggested Candidate Implementation
			if (candidate !== undefined) {

				let url            = _resolve_root.call(this) + '/' + candidate + '.js';
				let implementation = new lychee.Asset(url, null, false);
				let attachments    = _resolve_attachments.call(this, candidate);

				if (implementation !== null) {
					_load_candidate_implementation.call(this, candidate, implementation, attachments, map);
				}

			}

		}

	};

	const _load_candidate_implementation = function(candidate, implementation, attachments, map) {

		let type       = map.type;
		let identifier = this.id + '.' + map.id;
		if (identifier.endsWith('.')) {
			identifier = identifier.substr(0, identifier.length - 1);
		}


		implementation.onload = result => {

			map.loading--;


			if (result === true) {

				if (type === 'export' || type === 'source') {

					let environment = this.environment || null;
					if (environment !== null) {

						let definition = environment.definitions[identifier] || null;
						if (definition !== null) {

							map.candidate = this;


							let attachment_ids = Object.keys(attachments);
							if (attachment_ids.length > 0) {

								// Temporarily remove definition to prevent misusage
								delete environment.definitions[identifier];

								map.loading += attachment_ids.length;


								attachment_ids.forEach(assetId => {

									let url   = attachments[assetId];
									let asset = new lychee.Asset(url, null, true);
									if (asset !== null) {

										asset.onload = function(result) {

											map.loading--;

											let tmp = {};
											if (result === true) {
												tmp[assetId] = this;
											} else {
												tmp[assetId] = null;
											}

											definition.attaches(tmp);


											if (map.loading === 0) {
												environment.definitions[identifier] = definition;
											}

										};

										asset.load();

									} else {

										map.loading--;

									}

								});

							}


							for (let i = 0, il = definition._includes.length; i < il; i++) {
								environment.load(definition._includes[i]);
							}

							for (let r = 0, rl = definition._requires.length; r < rl; r++) {
								environment.load(definition._requires[r]);
							}

						} else {

							// Invalid Definition format
							delete environment.definitions[identifier];

						}

					}

				} else if (type === 'review') {

					let simulation = this.simulation || null;
					if (simulation !== null) {

						let specification = simulation.specifications[identifier] || null;
						if (specification !== null) {

							for (let r = 0, rl = specification._requires.length; r < rl; r++) {
								simulation.load(specification._requires[r]);
							}

						} else {

							// Invalid Specification format
							delete simulation.specifications[identifier];

						}

					}

				}

			}


			this.__blacklist[candidate] = 1;

			// Load next candidate, if any available
			if (map.candidates.length > 0) {
				_load_candidate.call(this, map.id, map.candidates);
			}

		};

		implementation.load();

	};



	/*
	 * IMPLEMENTATION
	 */

	const Composite = function(data) {

		let states = Object.assign({}, data);


		this.id          = 'app';
		this.config      = null;
		this.environment = null;
		this.root        = null;
		this.simulation  = null;
		this.type        = 'source';
		this.url         = null;

		this.__blacklist = {};
		this.__requests  = {};
		this.__warnings  = {};


		let check = states.id || null;
		if (check !== null && /^([a-z]+)$/g.test(check)) {
			this.setId(states.id);
			this.setUrl(states.url);
		} else {
			this.setUrl(states.url);
			this.setId(states.id);
		}


		this.setEnvironment(states.environment);
		this.setSimulation(states.simulation);
		this.setType(states.type);

		states = null;

	};


	Composite.prototype = {

		/*
		 * ENTITY API
		 */

		deserialize: function(blob) {

			if (blob.config instanceof Object) {
				this.config = lychee.deserialize(blob.config);
			}

		},

		serialize: function() {

			let states = {};
			let blob   = {};


			if (this.id !== '')         states.id   = this.id;
			if (this.type !== 'source') states.type = this.type;
			if (this.url !== '')        states.url  = this.url;


			if (this.config !== null) {
				blob.config = lychee.serialize(this.config);
			}


			return {
				'constructor': 'lychee.Package',
				'arguments':   [ states ],
				'blob':        Object.keys(blob).length > 0 ? blob : null
			};

		},



		/*
		 * CUSTOM API
		 */

		getDefinitions: function(tags) {

			tags = tags instanceof Object ? tags : null;


			let filtered = [];

			let config = this.config || null;
			if (config !== null) {

				let buffer = config.buffer || null;
				if (buffer !== null) {

					let files = [];
					let type  = this.type;
					let root  = buffer[type].files || null;

					if (root !== null) {
						_resolve_files(root, files, '', false);
					}

					if (tags !== null) {

						for (let tag in tags) {

							if (tags[tag] instanceof Array) {

								for (let t = 0, tl = tags[tag].length; t < tl; t++) {

									let value  = tags[tag][t];
									let prefix = _resolve_tag.call(this, tag, value);

									for (let f = 0, fl = files.length; f < fl; f++) {

										let file = files[f];
										if (file.startsWith('/' + prefix + '/')) {

											let id = file.substr(1 + prefix.length + 1).split('/').join('.');
											if (filtered.includes(id) === false) {
												filtered.push(id);
											}

										}

									}

								}

							} else if (typeof tags[tag] === 'string') {

								let value  = tags[tag];
								let prefix = _resolve_tag.call(this, tag, value);

								for (let f = 0, fl = files.length; f < fl; f++) {

									let file = files[f];
									if (file.startsWith('/' + prefix + '/')) {

										let id = file.substr(1 + prefix.length + 1).split('/').join('.');
										if (filtered.includes(id) === false) {
											filtered.push(id);
										}

									}

								}

							}

						}

					} else {

						let tags     = [];
						let prefixes = [];
						let pointer  = config.buffer[this.type].tags || null;
						if (pointer !== null) {

							for (let tag in pointer) {

								tags.push(tag);


								let pkg_tags = pointer[tag];
								if (pkg_tags instanceof Object) {

									for (let id in pkg_tags) {

										let prefix = pkg_tags[id] || null;
										if (prefix !== null) {
											prefixes.push(prefix);
										}

									}

								}

							}

						}


						for (let f = 0, fl = files.length; f < fl; f++) {

							let file = files[f];

							for (let p = 0, pl = prefixes.length; p < pl; p++) {

								let prefix = prefixes[p];

								if (file.startsWith('/' + prefix + '/')) {

									let id = file.substr(1 + prefix.length + 1).split('/').join('.');
									if (filtered.includes(id) === false) {
										filtered.push(id);
									}

								} else {

									let untagged = true;

									for (let t = 0, tl = tags.length; t < tl; t++) {

										let tag = tags[t];

										if (file.startsWith('/' + tag)) {
											untagged = false;
											break;
										}

									}

									if (untagged === true) {

										let id = file.substr(1).split('/').join('.');
										if (filtered.includes(id) === false) {
											filtered.push(id);
										}

									}

								}

							}

						}

					}

				}

			}

			filtered = filtered.sort();


			return filtered;

		},

		getEnvironments: function(tags) {

			tags = tags instanceof Object ? tags : null;


			let filtered = [];

			let config = this.config || null;
			if (config !== null) {

				let buffer = config.buffer || null;
				if (buffer !== null) {

					let type         = this.type;
					let environments = buffer[type].environments || null;

					if (environments !== null) {

						for (let id in environments) {

							let environment = lychee.assignunlink({
								id: id
							}, environments[id]);


							if (tags !== null) {

								let valid = _validate_env_tags(environment.tags || {}, tags);
								if (valid === true) {
									filtered.push(environment);
								}

							} else {

								filtered.push(environment);

							}

						}

					}

				}

			}

			filtered = filtered.sort((a, b) => _sort_by_tag(a.id, b.id));


			return filtered;

		},

		getFiles: function(tags) {

			tags = tags instanceof Object ? tags : null;


			let filtered = [];

			let config = this.config || null;
			if (config !== null) {

				let buffer = config.buffer || null;
				if (buffer !== null) {

					let files = [];
					let type  = this.type;
					let root  = buffer[type].files || null;

					if (root !== null) {
						_resolve_files(root, files, '', true);
					}

					if (tags !== null) {

						for (let tag in tags) {

							if (tags[tag] instanceof Array) {

								for (let t = 0, tl = tags[tag].length; t < tl; t++) {

									let value  = tags[tag][t];
									let prefix = _resolve_tag.call(this, tag, value);

									for (let f = 0, fl = files.length; f < fl; f++) {

										let file = files[f];
										if (file.startsWith('/' + prefix + '/')) {
											filtered.push(file.substr(1));
										}

									}

								}

							} else if (typeof tags[tag] === 'string') {

								let value  = tags[tag];
								let prefix = _resolve_tag.call(this, tag, value);

								for (let f = 0, fl = files.length; f < fl; f++) {

									let file = files[f];
									if (file.startsWith('/' + prefix + '/')) {
										filtered.push(file.substr(1));
									}

								}

							}

						}

					} else {

						for (let f = 0, fl = files.length; f < fl; f++) {
							filtered.push(files[f].substr(1));
						}

					}

				}

			}

			filtered = filtered.sort();


			return filtered;

		},

		getNamespaces: function(tags) {

			tags = tags instanceof Object ? tags : null;


			let filtered = [];

			let config = this.config || null;
			if (config !== null) {

				let buffer = config.buffer || null;
				if (buffer !== null) {

					let namespaces = [];
					let type       = this.type;
					let root       = buffer[type].files || null;

					if (root !== null) {
						_resolve_namespaces(root, namespaces, '');
					}

					if (tags !== null) {

						for (let tag in tags) {

							if (tags[tag] instanceof Array) {

								for (let t = 0, tl = tags[tag].length; t < tl; t++) {

									let value  = tags[tag][t];
									let prefix = _resolve_tag.call(this, tag, value).split('/').join('.');

									for (let n = 0, nl = namespaces.length; n < nl; n++) {

										let namespace = namespaces[n];
										if (namespace.startsWith(prefix + '.')) {

											let id = namespace.substr(prefix.length + 1);
											if (filtered.includes(id) === false) {
												filtered.push(id);
											}

										}

									}

								}

							} else if (typeof tags[tag] === 'string') {

								let value  = tags[tag];
								let prefix = _resolve_tag.call(this, tag, value).split('/').join('.');

								for (let n = 0, nl = namespaces.length; n < nl; n++) {

									let namespace = namespaces[n];
									if (namespace.startsWith(prefix + '.')) {

										let id = namespace.substr(prefix.length + 1);
										if (filtered.includes(id) === false) {
											filtered.push(id);
										}

									}

								}

							}

						}

					} else {

						let tags     = [];
						let prefixes = [];
						let pointer  = config.buffer[this.type].tags || null;
						if (pointer !== null) {

							for (let tag in pointer) {

								tags.push(tag);


								let pkg_tags = pointer[tag];
								if (pkg_tags instanceof Object) {

									for (let id in pkg_tags) {

										let prefix = pkg_tags[id] || null;
										if (prefix !== null) {
											prefixes.push(prefix.split('/').join('.'));
										}

									}

								}

							}

						}


						for (let n = 0, nl = namespaces.length; n < nl; n++) {

							let namespace = namespaces[n];

							for (let p = 0, pl = prefixes.length; p < pl; p++) {

								let prefix = prefixes[p];

								if (namespace.startsWith(prefix + '.')) {

									let id = namespace.substr(prefix.length + 1);
									if (filtered.includes(id) === false) {
										filtered.push(id);
									}

								} else {

									let untagged = true;

									for (let t = 0, tl = tags.length; t < tl; t++) {

										let tag = tags[t];

										if (namespace.startsWith(tag)) {
											untagged = false;
											break;
										}

									}

									if (untagged === true) {

										let id = namespace;
										if (filtered.includes(id) === false) {
											filtered.push(id);
										}

									}

								}

							}

						}

					}

				}

			}

			filtered = filtered.sort();


			return filtered;

		},

		getSimulations: function(tags) {

			tags = tags instanceof Object ? tags : null;


			let filtered = [];

			let config = this.config || null;
			if (config !== null) {

				let buffer = config.buffer || null;
				if (buffer !== null) {

					let type        = this.type;
					let simulations = buffer[type].simulations || null;

					if (simulations !== null) {

						for (let id in simulations) {

							let simulation = lychee.assignunlink({
								id: id
							}, simulations[id]);


							let environment = simulation.environment || null;
							if (environment instanceof Object && tags !== null) {

								let valid = _validate_env_tags(environment.tags || {}, tags);
								if (valid === true) {
									filtered.push(simulation);
								}

							} else {

								filtered.push(simulation);

							}

						}

					}

				}

			}

			filtered = filtered.sort((a, b) => _sort_by_tag(a.id, b.id));


			return filtered;

		},

		load: function(id, tags) {

			id   = typeof id === 'string' ? id   : null;
			tags = tags instanceof Object ? tags : null;


			let config = this.config;

			if (id !== null && config !== null) {

				let request = this.__requests[id] || null;
				if (request === null) {

					let candidates = _resolve_candidates.call(this, id, tags);
					if (candidates.length > 0) {

						_load_candidate.call(this, id, candidates);

						return true;

					} else {

						let check = this.__warnings[id] || null;
						if (check === null) {

							if (tags !== null) {
								let info = Object.keys(tags).length > 0 ? (' (' + JSON.stringify(tags) + ').') : '.';
								console.error('lychee.Package ("' + this.id + '"): Invalid Definition "' + id + '"' + info);
							} else {
								console.error('lychee.Package ("' + this.id + '"): Invalid Definition "' + id + '".');
							}

							this.__warnings[id] = 1;

						}

						return false;

					}

				} else {

					return true;

				}

			}


			return false;

		},

		resolve: function(id, tags) {

			id   = typeof id === 'string' ? id   : null;
			tags = tags instanceof Object ? tags : null;


			let config   = this.config;
			let filtered = [];

			if (id !== null && config !== null) {

				let candidates = _resolve_candidates.call(this, id, tags);
				if (candidates.length > 0) {

					for (let c = 0, cl = candidates.length; c < cl; c++) {
						filtered.push(candidates[c]);
					}

				}

			}

			return filtered;

		},

		setId: function(id) {

			id = typeof id === 'string' ? id : null;


			if (id !== null && /^([a-z]+)$/g.test(id)) {

				this.id = id;

				return true;

			} else {

				let fuzzed = _fuzz_id.call(this);
				if (fuzzed !== null) {

					this.id = fuzzed;

					console.warn('lychee.Package: Injecting Identifier "' + fuzzed + '" ("' + this.url + '").');

					return true;

				} else if (id !== null) {

					console.error('lychee.Package: Invalid Identifier "' + id + '" ("' + this.url + '").');

				}

			}


			return false;

		},

		setUrl: function(url) {

			url = typeof url === 'string' ? url : null;


			if (url !== null && url.endsWith('/lychee.pkg')) {

				this.config = null;
				this.root   = url.split('/').slice(0, -1).join('/');
				this.url    = url;


				let config = new Config(url);

				config.onload = result => {

					let buffer = config.buffer || null;
					if (
						buffer !== null
						&& buffer instanceof Object
						&& buffer.build instanceof Object
						&& buffer.review instanceof Object
						&& buffer.source instanceof Object
					) {

						console.info('lychee.Package ("' + this.id + '"): Config "' + config.url + '" ready.');

						this.config = config;

					} else {

						console.error('lychee.Package ("' + this.id + '"): Config "' + config.url + '" corrupt.');

					}

				};

				config.load();


				return true;

			}


			return false;

		},

		setEnvironment: function(environment) {

			environment = environment instanceof lychee.Environment ? environment : null;


			if (environment !== null) {

				this.environment = environment;

				return true;

			} else {

				this.environment = null;

			}


			return false;

		},

		setSimulation: function(simulation) {

			simulation = simulation instanceof lychee.Simulation ? simulation : null;


			if (simulation !== null) {

				this.simulation = simulation;

				return true;

			} else {

				this.simulation = null;

			}


			return false;

		},

		setType: function(type) {

			type = typeof type === 'string' ? type : null;


			if (type !== null) {

				if (/^(api|build|review|source)$/g.test(type)) {

					this.type = type;

					return true;

				}

			}


			return false;

		}

	};


	Composite.displayName           = 'lychee.Package';
	Composite.prototype.displayName = 'lychee.Package';


	return Composite;

})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));


lychee.Simulation = typeof lychee.Simulation !== 'undefined' ? lychee.Simulation : (function(global) {

	let   _id      = 0;
	const _console = global.console;
	const _lychee  = global.lychee;



	/*
	 * HELPERS
	 */

	const _get_debug = function() {

		let debug       = _lychee.debug;
		let environment = this.environment;
		if (environment !== null) {
			debug = environment.debug;
		}

		return debug;

	};

	const _get_console = function() {

		let console     = _console;
		let environment = this.environment;
		if (environment !== null) {
			console = environment.global.console;
		}

		return console;

	};

	const _get_global = function() {

		let pointer     = global;
		let environment = this.environment;
		if (environment !== null) {
			pointer = environment.global;
		}

		return pointer;

	};

	const _build_loop = function(cache) {

		let load  = cache.load;
		let trace = cache.trace;


		for (let l = 0, ll = load.length; l < ll; l++) {

			let identifier    = load[l];
			let specification = this.specifications[identifier] || null;
			if (specification !== null) {

				if (trace.indexOf(identifier) === -1) {
					trace.push(identifier);
				}

				load.splice(l, 1);
				ll--;
				l--;

			}

		}


		for (let t = 0, tl = trace.length; t < tl; t++) {

			let identifier = trace[t];
			let specification = this.specifications[identifier] || null;
			if (specification !== null) {

				let dependencies = _resolve_dependencies.call(this, specification);
				if (dependencies.length > 0) {

					for (let d = 0, dl = dependencies.length; d < dl; d++) {

						let dependency = dependencies[d];
						if (load.indexOf(dependency) === -1 && trace.indexOf(dependency) === -1) {

							this.load(dependency);
							load.push(dependency);

						}

					}

				} else {

					specification.export(this.sandboxes);

					trace.splice(t, 1);
					tl--;
					t--;

				}

			}

		}


		if (load.length === 0 && trace.length === 0) {

			cache.active = false;

		} else {

			if (Date.now() > cache.timeout) {
				cache.active = false;
			}

		}

	};

	const _on_build_success = function(cache, callback) {

		let console     = _get_console.call(this);
		let debug       = _get_debug.call(this);
		let environment = this.environment;
		let sandboxes   = this.sandboxes;


		if (debug === true) {
			console.info('lychee.Simulation ("' + this.id + '"): BUILD END (' + (cache.end - cache.start) + 'ms).');
		}


		try {
			callback.call(environment.global, sandboxes);
		} catch (err) {
			_lychee.Debugger.report(environment, err, null);
		}

	};

	const _on_build_timeout = function(cache, callback) {

		let console     = _get_console.call(this);
		let debug       = _get_debug.call(this);
		let environment = this.environment;


		if (debug === true) {
			console.warn('lychee.Simulation ("' + this.id + '"): BUILD TIMEOUT (' + (cache.end - cache.start) + 'ms).');
		}


		if (cache.load.length > 0) {
			console.error('lychee.Simulation ("' + this.id + '"): Invalid Dependencies\n' + cache.load.map(value => '\t - ' + value).join('\n') + '.');
		}


		try {
			callback.call(environment.global, null);
		} catch (err) {
			_lychee.Debugger.report(environment, err, null);
		}

	};

	const _resolve = function(identifier) {

		let pointer   = this;
		let namespace = identifier.split('.');
		let id        = namespace.pop();

		for (let n = 0, nl = namespace.length; n < nl; n++) {

			let name = namespace[n];

			if (pointer[name] === undefined) {
				pointer[name] = {};
			}

			pointer = pointer[name];

		}


		let check = id.toLowerCase();
		if (check === id) {

			if (pointer[id] === undefined) {
				pointer[id] = {};
			}

			return pointer[id];

		} else {

			if (pointer[id] !== undefined) {
				return pointer[id];
			}

		}


		return null;

	};

	const _resolve_dependencies = function(specification) {

		let dependencies = [];

		if (specification instanceof _lychee.Specification) {

			for (let r = 0, rl = specification._requires.length; r < rl; r++) {

				let req   = specification._requires[r];
				let check = _resolve.call(this.sandboxes, req);
				if (check === null) {
					dependencies.push(req);
				}

			}

		}

		return dependencies;

	};



	/*
	 * IMPLEMENTATION
	 */

	const Composite = function(data) {

		let states = Object.assign({}, data);


		this.id             = 'lychee-Simulation-' + _id++;
		this.environment    = null;
		this.specifications = {};
		this.target         = 'app.Main';
		this.timeout        = 10000;

		this.sandboxes  = {};
		this.__cache    = {
			active:        false,
			assimilations: [],
			start:         0,
			end:           0,
			retries:       0,
			timeout:       0,
			load:          [],
			trace:         []
		};
		this.__packages = {};


		this.setId(states.id);
		this.setSpecifications(states.specifications);
		this.setEnvironment(states.environment);
		this.setTimeout(states.timeout);

		// Needs this.__packages to be ready
		this.setTarget(states.target);


		states = null;

	};


	Composite.prototype = {

		/*
		 * ENTITY API
		 */

		deserialize: function(blob) {

			if (blob.specifications instanceof Object) {

				for (let id in blob.specifications) {
					this.specifications[id] = lychee.deserialize(blob.specifications[id]);
				}

			}

			if (blob.environment instanceof Object) {
				this.setEnvironment(lychee.deserialize(blob.environment));
			}

		},

		serialize: function() {

			let states = {};
			let blob   = {};


			if (this.id !== '')             states.id      = this.id;
			if (this.target !== 'app.Main') states.target  = this.target;
			if (this.timeout !== 10000)     states.timeout = this.timeout;


			if (Object.keys(this.specifications).length > 0) {

				blob.specifications = {};

				for (let sid in this.specifications) {
					blob.specifications[sid] = lychee.serialize(this.specifications[sid]);
				}

			}


			return {
				'constructor': 'lychee.Simulation',
				'arguments':   [ states ],
				'blob':        Object.keys(blob).length > 0 ? blob : null
			};

		},



		/*
		 * CUSTOM API
		 */

		load: function(identifier) {

			identifier = typeof identifier === 'string' ? identifier : null;


			if (identifier !== null) {

				let tmp    = identifier.split('.');
				let pkg_id = tmp[0];
				let def_id = tmp.slice(1).join('.');


				let specification = this.specifications[identifier] || null;
				if (specification !== null) {

					return true;

				} else {

					let pkg = this.__packages[pkg_id] || null;
					if (pkg !== null && pkg.config !== null) {

						let result = pkg.load(def_id);
						if (result === true) {

							let debug = _get_debug.call(this);
							if (debug === true) {
								console.log('lychee.Simulation ("' + this.id + '"): Loading "' + identifier + '" from Package "' + pkg.id + '".');
							}

						}

						return result;

					}

				}

			}


			return false;

		},

		specify: function(specification, inject) {

			specification = specification instanceof lychee.Specification ? specification : null;
			inject        = inject === true;


			let console = _get_console.call(this);
			let debug   = _get_debug.call(this);


			if (specification !== null) {

				let url = specification.url || null;
				if (url !== null && inject === false) {

					let old_pkg_id   = specification.id.split('.')[0];
					let new_pkg_id   = null;
					let assimilation = true;


					let packages = this.__packages;

					for (let pid in packages) {

						let pkg = packages[pid];

						if (url.startsWith(pkg.root)) {
							new_pkg_id = pkg.id;
						}

						if (pid === old_pkg_id || pid === new_pkg_id) {
							assimilation = false;
						}

					}


					if (assimilation === true) {

						if (debug === true) {
							console.log('lychee.Simulation ("' + this.id + '"): Assimilating Specification "' + specification.id + '".');
						}


						this.__cache.assimilations.push(specification.id);

					} else if (new_pkg_id !== null && new_pkg_id !== old_pkg_id) {

						if (debug === true) {
							console.log('lychee.Simulation ("' + this.id + '"): Injecting Specification "' + specification.id + '" into Package "' + new_pkg_id + '".');
						}


						specification.id = new_pkg_id + '.' + specification.id.split('.').slice(1).join('.');

						for (let r = 0, rl = specification._requires.length; r < rl; r++) {

							let req = specification._requires[r];
							if (req.startsWith(old_pkg_id)) {
								specification._requires[r] = new_pkg_id + req.substr(old_pkg_id.length);
							}

						}

					}

				} else {

					// XXX: Direct injection has no auto-mapping

				}


				if (debug === true) {
					console.log('lychee.Simulation ("' + this.id + '"): Mapping Specification "' + specification.id + '".');
				}


				this.specifications[specification.id] = specification;


				return true;

			}


			console.error('lychee.Simulation ("' + this.id + '"): Invalid Specification "' + specification.id + '".');


			return false;

		},

		init: function(callback) {

			callback = callback instanceof Function ? callback : null;


			let cache       = this.__cache;
			let console     = _get_console.call(this);
			let debug       = _get_debug.call(this);
			let environment = this.environment;
			let target      = this.target;


			if (debug === true) {
				global.lychee.SIMULATIONS[this.id] = this;
			}


			if (target !== null && environment !== null && cache.active === false) {

				let result = this.load(target);
				if (result === true) {

					if (debug === true) {
						console.info('lychee.Simulation ("' + this.id + '"): BUILD START ("' + target + '").');
					}


					cache.start   = Date.now();
					cache.timeout = Date.now() + this.timeout;
					cache.load    = [ target ];
					cache.trace   = [];
					cache.active  = true;


					let interval = setInterval(_ => {

						let cache = this.__cache;
						if (cache.active === true) {

							_build_loop.call(this, cache);

						} else if (cache.active === false) {

							if (interval !== null) {
								clearInterval(interval);
								interval = null;
							}


							let assimilations = cache.assimilations;
							if (assimilations.length > 0) {

								for (let a = 0, al = assimilations.length; a < al; a++) {

									let identifier    = assimilations[a];
									let specification = this.specifications[identifier] || null;
									if (specification !== null) {
										specification.export(this.sandboxes);
									}

								}

							}


							cache.end = Date.now();


							if (cache.end > cache.timeout) {
								_on_build_timeout.call(this, cache, callback);
							} else {
								_on_build_success.call(this, cache, callback);
							}

						}

					}, (1000 / 60) | 0);

				} else {

					cache.retries++;


					if (cache.retries < 3) {

						if (debug === true) {
							console.warn('lychee.Simulation ("' + this.id + '"): Unready Package "' + target + '" (retrying in 100ms ...).');
						}

						setTimeout(_ => this.init(callback), 100);

					} else {

						console.error('lychee.Simulation ("' + this.id + '"): Invalid Dependencies\n\t - ' + target + ' (target).');


						try {
							callback.call(environment.global || null, null);
						} catch (err) {
							_lychee.Debugger.report(environment, err, null);
						}

					}

				}


				return true;

			}


			try {
				callback.call(environment.global || null, null);
			} catch (err) {
				_lychee.Debugger.report(environment, err, null);
			}


			return false;

		},

		setEnvironment: function(environment) {

			environment = environment instanceof lychee.Environment ? environment : null;


			if (environment !== null) {

				this.environment = environment;
				this.__packages  = {};

				for (let pid in environment.packages) {

					let pkg = environment.packages[pid];

					this.__packages[pid] = new lychee.Package({
						id:         pkg.id,
						url:        pkg.url,
						type:       'review',
						simulation: this
					});

				}

				return true;

			} else {

				this.environment = null;
				this.__packages  = {};

			}


			return false;

		},

		setId: function(id) {

			id = typeof id === 'string' ? id : null;


			if (id !== null) {

				this.id = id;

				return true;

			}


			return false;

		},

		setSpecifications: function(specifications) {

			specifications = specifications instanceof Object ? specifications : null;


			if (specifications !== null) {

				for (let identifier in specifications) {

					let specification = specifications[identifier];
					if (specification instanceof lychee.Specification) {
						this.specifications[identifier] = specification;
					}

				}


				return true;

			}


			return false;

		},

		setTarget: function(identifier) {

			identifier = typeof identifier === 'string' ? identifier : null;


			if (identifier !== null) {

				let pid = identifier.split('.')[0];
				let pkg = this.__packages[pid] || null;
				if (pkg !== null) {

					this.target = identifier;

					return true;
				}

			}


			return false;

		},

		setTimeout: function(timeout) {

			timeout = typeof timeout === 'number' ? (timeout | 0) : null;


			if (timeout !== null) {

				this.timeout = timeout;

				return true;

			}


			return false;

		}

	};


	return Composite;

})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));


lychee.Specification = typeof lychee.Specification !== 'undefined' ? lychee.Specification : (function(global) {

	const lychee = global.lychee;



	/*
	 * HELPERS
	 */

	const _fuzz_id = function() {

		let found = null;

		if (this.url !== null) {

			let namespace = null;

			for (let pid in lychee.environment.packages) {

				let pkg  = lychee.environment.packages[pid];
				let base = pkg.url.split('/').slice(0, -1).join('/');

				if (this.url.startsWith(base)) {
					namespace = pkg.id;
				}

			}


			if (namespace !== null) {

				let id    = '';
				let ns    = this.url.split('/');
				let tmp_i = ns.indexOf('review');
				let tmp_s = ns[ns.length - 1];

				if (/\.js$/g.test(tmp_s)) {
					ns[ns.length - 1] = tmp_s.split('.').slice(0, -1).join('.');
				}

				if (tmp_i !== -1 && ns[tmp_i + 1] === 'core') {

					if (ns[tmp_i + 2] === 'lychee') {
						ns.splice(tmp_i + 1, 2);
					} else {
						ns.splice(tmp_i + 1, 1);
					}

				}

				if (tmp_i !== -1) {
					id = ns.slice(tmp_i + 1).join('.');
				}

				if (id !== '') {
					found = namespace + '.' + id;
				} else {
					found = namespace;
				}

			}

		}

		return found;

	};

	const _resolve = function(identifier) {

		let pointer   = this;
		let namespace = identifier.split('.');
		let id        = namespace.pop();

		for (let n = 0, nl = namespace.length; n < nl; n++) {

			let name = namespace[n];

			if (pointer[name] === undefined) {
				pointer[name] = {};
			}

			pointer = pointer[name];

		}


		let check = id.toLowerCase();
		if (check === id) {

			if (pointer[id] === undefined) {
				pointer[id] = {};
			}

			return pointer[id];

		} else {

			if (pointer[id] !== undefined) {
				return pointer[id];
			}

		}


		return null;

	};

	const _assert = function(a, b) {

		let result = lychee.diff(a, b);
		if (result === false) {
			this.results.ok++;
		}

		this.results.all++;

	};

	const _expect = function(assert, callback) {

		this._expect++;


		callback((a, b) => {
			this._expect--;
			assert(a, b);
		});

	};

	const _Sandbox = function(identifier) {

		this._IDENTIFIER = identifier || null;
		this._INSTANCE   = null;

		this.blob       = {};
		this.states     = {};
		this.properties = {};
		this.enums      = {};
		this.events     = {};
		this.methods    = {};

	};

	_Sandbox.prototype = {

		/*
		 * ENTITY API
		 */

		deserialize: function(blob) {

			if (blob.instance instanceof Object) {
				this._INSTANCE = lychee.deserialize(blob.instance);
			}

			if (blob.states instanceof Object) {
				this.states = lychee.deserialize(blob.states);
			}

			if (blob.properties instanceof Object) {

				for (let p in blob.properties) {
					this.properties[p] = lychee.deserialize(blob.properties[p]);
				}

			}

			if (blob.enums instanceof Object) {

				for (let e in blob.enums) {
					this.enums[e] = lychee.deserialize(blob.enums[e]);
				}

			}

			if (blob.events instanceof Object) {

				for (let e in blob.events) {
					this.events[e] = lychee.deserialize(blob.events[e]);
				}

			}

			if (blob.methods instanceof Object) {

				for (let m in blob.methods) {
					this.methods[m] = lychee.deserialize(blob.methods[m]);
				}

			}

		},

		serialize: function() {

			let blob = {};


			if (Object.keys(this.states).length > 0) {
				blob.states = lychee.serialize(this.states);
			}

			if (Object.keys(this.properties).length > 0) {

				blob.properties = {};

				for (let p in this.properties) {
					blob.properties[p] = lychee.serialize(this.properties[p]);
				}

			}

			if (Object.keys(this.enums).length > 0) {

				blob.enums = {};

				for (let e in this.enums) {
					blob.enums[e] = lychee.serialize(this.enums[e]);
				}

			}

			if (Object.keys(this.events).length > 0) {

				blob.events = {};

				for (let e in this.events) {
					blob.events[e] = lychee.serialize(this.events[e]);
				}

			}

			if (Object.keys(this.methods).length > 0) {

				blob.methods = {};

				for (let m in this.methods) {
					blob.methods[m] = lychee.serialize(this.methods[m]);
				}

			}


			if (this._INSTANCE !== null) {
				blob.instance = lychee.serialize(this._INSTANCE);
			}


			return {
				'constructor': '_Sandbox',
				'arguments':   [ this._IDENTIFIER ],
				'blob':        Object.keys(blob).length > 0 ? blob : null
			};

		},



		/*
		 * CUSTOM API
		 */

		evaluate: function(callback) {

			callback = callback instanceof Function ? callback : null;


			if (callback !== null) {

				let statistics = {
					properties: {},
					enums:      {},
					events:     {},
					methods:    {}
				};


				if (this._IDENTIFIER !== null) {

					let Definition = lychee.import(this._IDENTIFIER);
					if (Definition !== null) {

						if (Definition.prototype instanceof Object) {

							this._INSTANCE = new Definition(this.states);

							if (
								Object.keys(this.blob).length > 0
								&& typeof this._INSTANCE.deserialize === 'function'
							) {
								this._INSTANCE.deserialize(this.blob);
							}

						} else {
							this._INSTANCE = Definition;
						}

					}


					if (this._INSTANCE !== null) {

						for (let id in this.properties) {

							statistics.properties[id] = {
								_expect: 0,
								results: {
									ok:  0,
									all: 0
								}
							};

							let assert = _assert.bind(statistics.properties[id]);
							let expect = _expect.bind(statistics.properties[id], assert);

							this.properties[id].call(this._INSTANCE, assert, expect);

						}

						for (let id in this.enums) {

							statistics.enums[id] = {
								_expect: 0,
								results: {
									ok:  0,
									all: 0
								}
							};

							let assert = _assert.bind(statistics.enums[id]);
							let expect = _expect.bind(statistics.enums[id], assert);

							this.enums[id].call(this._INSTANCE, assert, expect);

						}

						for (let id in this.events) {

							statistics.events[id] = {
								_expect: 0,
								results: {
									ok:  0,
									all: 0
								}
							};

							let assert = _assert.bind(statistics.events[id]);
							let expect = _expect.bind(statistics.events[id], assert);

							this.events[id].call(this._INSTANCE, assert, expect);

						}

						for (let id in this.methods) {

							statistics.methods[id] = {
								_expect: 0,
								results: {
									ok:  0,
									all: 0
								}
							};

							let assert = _assert.bind(statistics.methods[id]);
							let expect = _expect.bind(statistics.methods[id], assert);

							this.methods[id].call(this._INSTANCE, assert, expect);

						}


						let timeout  = Date.now() + 5000;
						let interval = setInterval(_ => {

							if (Date.now() > timeout) {

								clearInterval(interval);
								interval = null;

								callback(statistics);

							} else {

								let stop = true;

								for (let type in statistics) {

									for (let id in statistics[type]) {

										if (statistics[type][id]._expect > 0) {
											stop = false;
											break;
										}

									}

								}

								if (stop === true) {

									clearInterval(interval);
									interval = null;

									callback(statistics);

								}

							}

						}, 500);

					} else {

						if (callback !== null) {
							callback(null);
						}

					}

				} else {

					if (callback !== null) {
						callback(null);
					}

				}

			}

		},

		setBlob: function(blob) {

			blob = blob instanceof Object ? blob : null;


			if (blob !== null) {

				this.blob = blob;

				return true;

			}


			return false;

		},

		setStates: function(states) {

			states = states instanceof Object ? states : null;


			if (states !== null) {

				this.states = states;

				return true;

			}


			return false;

		},

		setEnum: function(name, callback) {

			name     = typeof name === 'string'     ? name     : null;
			callback = callback instanceof Function ? callback : null;


			if (name !== null && callback !== null) {

				this.enums[name] = callback;

				return true;

			}


			return false;

		},

		setEvent: function(name, callback) {

			name     = typeof name === 'string'     ? name     : null;
			callback = callback instanceof Function ? callback : null;


			if (name !== null && callback !== null) {

				this.events[name] = callback;

				return true;

			}


			return false;

		},

		setMethod: function(name, callback) {

			name     = typeof name === 'string'     ? name     : null;
			callback = callback instanceof Function ? callback : null;


			if (name !== null && callback !== null) {

				this.methods[name] = callback;

				return true;

			}


			return false;

		},

		setProperty: function(name, callback) {

			name     = typeof name === 'string'     ? name     : null;
			callback = callback instanceof Function ? callback : null;


			if (name !== null && callback !== null) {

				this.properties[name] = callback;

				return true;

			}


			return false;

		}

	};



	/*
	 * IMPLEMENTATION
	 */

	const Composite = function(data) {

		let states = Object.assign({}, data);


		this.id  = '';
		this.url = lychee.FILENAME || null;

		this._requires = [];
		this._exports  = null;


		// XXX: url has to be set first for fuzzing
		this.setUrl(states.url);
		this.setId(states.id);

		states = null;

	};


	Composite.prototype = {

		/*
		 * ENTITY API
		 */

		deserialize: function(blob) {

			if (blob.requires instanceof Array) {
				this.requires(blob.requires);
			}

			if (typeof blob.exports === 'string') {

				// Function head
				let tmp = blob.exports.split('{')[0].trim();
				if (tmp.startsWith('function')) {
					tmp = tmp.substr('function'.length).trim();
				}

				if (tmp.startsWith('anonymous')) tmp = tmp.substr('anonymous'.length).trim();
				if (tmp.startsWith('('))         tmp = tmp.substr(1).trim();
				if (tmp.endsWith(')'))           tmp = tmp.substr(0, tmp.length - 1).trim();

				let bindargs = tmp.split(',').map(name => name.trim());
				let check    = bindargs[bindargs.length - 1];
				if (check.includes('\n')) {
					bindargs[bindargs.length - 1] = check.split('\n')[0];
				}


				// Function body
				let i1 = blob.exports.indexOf('{') + 1;
				let i2 = blob.exports.lastIndexOf('}') - 1;
				bindargs.push(blob.exports.substr(i1, i2 - i1));

				this.exports(Function.apply(Function, bindargs));

			}

		},

		serialize: function() {

			let states = {};
			let blob   = {};


			if (this.id !== '')  states.id  = this.id;
			if (this.url !== '') states.url = this.url;

			if (this._requires.length > 0)         blob.requires = this._requires.slice(0);
			if (this._exports instanceof Function) blob.exports  = this._exports.toString();


			return {
				'constructor': 'lychee.Specification',
				'arguments':   [ states ],
				'blob':        Object.keys(blob).length > 0 ? blob : null
			};

		},



		/*
		 * CUSTOM API
		 */

		setId: function(id) {

			id = typeof id === 'string' ? id : null;


			if (id !== null) {

				if (id.includes('.') && /^([A-Za-z0-9-.]+)$/g.test(id)) {

					this.id = id;

					return true;

				} else {

					let fuzzed = _fuzz_id.call(this);
					if (fuzzed !== null) {

						this.id = fuzzed;

						console.warn('lychee.Specification: Injecting Identifier "' + fuzzed + '" ("' + this.url + '").');

						return true;

					} else {

						console.error('lychee.Specification: Invalid Identifier "' + id + '" ("' + this.url + '").');

					}

				}

			}


			return false;

		},

		setUrl: function(url) {

			url = typeof url === 'string' ? url : null;


			if (url !== null) {

				this.url = url;

				return true;

			}


			return false;

		},

		export: function(sandboxes) {

			sandboxes = sandboxes instanceof Object ? sandboxes : global;


			let check = _resolve.call(sandboxes, this.id);
			if (check === null) {

				if (this._exports !== null) {

					let requires = this._requires.map(id => _resolve.call(sandboxes, id));
					if (requires.includes(null) === false) {

						let id        = this.id;
						let namespace = _resolve.call(sandboxes, id.split('.').slice(0, -1).join('.'));
						let name      = id.split('.').pop();
						let sandbox   = new _Sandbox(id);


						try {
							this._exports.call(
								this._exports,
								lychee,
								sandbox
							) || null;
						} catch (err) {
							lychee.Debugger.report(lychee.environment, err, this);
						}


						namespace[name] = sandbox;


						return true;

					} else {

						let invalid_requires = this._requires.filter((id, r) => requires[r] === null);
						if (invalid_requires.length > 0) {

							for (let i = 0, il = invalid_requires.length; i < il; i++) {
								let tmp = invalid_requires[i];
								console.error('lychee.Specification ("' + this.id + '"): Invalid Requirement of "' + tmp + '".');
							}

						}

					}

				}

			}


			return false;

		},

		exports: function(callback) {

			callback = callback instanceof Function ? callback : null;


			if (callback !== null) {

				let check = (callback).toString().split('{')[0];
				if (check.includes('\n')) {
					check = check.split('\n').join('');
				}

				if (check.includes('(lychee, sandbox)') || check.includes('(lychee,sandbox)')) {
					this._exports = callback;
				} else {
					console.error('lychee.Specification ("' + this.id + '"): Invalid exports callback.');
					console.info('lychee.Specification ("' + this.id + '"): Use lychee.specify(id).exports(function(lychee, sandbox) {}).');
				}

			}


			return this;

		},

		requires: function(definitions) {

			definitions = definitions instanceof Array ? definitions : null;


			if (definitions !== null) {

				for (let d = 0, dl = definitions.length; d < dl; d++) {

					let definition = definitions[d];
					if (typeof definition === 'string') {

						let is_definition = definition.includes('.');
						let is_namespace  = definition === definition.toLowerCase();

						if (is_definition === true) {

							if (this._requires.includes(definition) === false) {
								this._requires.push(definition);
							}

						} else if (is_namespace === true) {
							this._requires.push(definition);
						}

					} else {
						console.warn('lychee.Specification ("' + this.id + '"): Invalid Requirement #' + d + '.');
					}

				}

			}


			return this;

		}

	};


	Composite.displayName           = 'lychee.Specification';
	Composite.prototype.displayName = 'lychee.Specification';


	return Composite;

})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));


["html","html-nwjs","html-webview","nidium","node","node-sdl"].forEach(function(platform) {
	if (lychee.PLATFORMS.includes(platform) === false) {
		lychee.PLATFORMS.push(platform);
	}
});


(function(lychee, global) {

	let _std_out = '';
	let _std_err = '';



	/*
	 * HELPERS
	 */

	const _INDENT     = '    ';
	const _WHITESPACE = new Array(512).fill(' ').join('');

	const _format_date = function(n) {
		return n < 10 ? '0' + n : '' + n;
	};

	const _stringify = function(data, indent) {

		indent = typeof indent === 'string' ? indent : '';


		let str = '';

		if (
			typeof data === 'boolean'
			|| data === null
			|| data === undefined
			|| (
				typeof data === 'number'
				&& (
					data === Infinity
					|| data === -Infinity
					|| isNaN(data) === true
				)
			)
		) {

			if (data === null) {
				str = indent + 'null';
			} else if (data === undefined) {
				str = indent + 'undefined';
			} else if (data === false) {
				str = indent + 'false';
			} else if (data === true) {
				str = indent + 'true';
			} else if (data === Infinity) {
				str = indent + 'Infinity';
			} else if (data === -Infinity) {
				str = indent + '-Infinity';
			} else if (isNaN(data) === true) {
				str = indent + 'NaN';
			}

		} else if (typeof data === 'number') {

			str = indent + data.toString();

		} else if (typeof data === 'string') {

			str = indent + '"' + data + '"';

		} else if (typeof data === 'function') {

			let body   = data.toString().split('\n');
			let offset = 0;

			let first = body.find(ch => ch.startsWith('\t')) || null;
			if (first !== null) {

				let check = /(^\t+)/g.exec(first);
				if (check !== null) {
					offset = Math.max(0, check[0].length - indent.length);
				}

			}


			for (let b = 0, bl = body.length; b < bl; b++) {

				let line = body[b];
				if (line.startsWith('\t')) {
					str += indent + line.substr(offset);
				} else {
					str += indent + line;
				}

				str += '\n';

			}

		} else if (data instanceof Array) {

			let is_primitive = data.find(val => val instanceof Object || typeof val === 'function') === undefined;
			let dimension    = Math.sqrt(data.length, 2);
			let is_matrix    = dimension === (dimension | 0);

			if (data.length === 0) {

				str = indent + '[]';

			} else if (is_primitive === true && is_matrix === true) {

				let max = 0;

				for (let d = 0, dl = data.length; d < dl; d++) {
					max = Math.max(max, (data[d]).toString().length);
				}


				str  = indent;
				str += '[\n';

				for (let y = 0; y < dimension; y++) {

					str += '\t' + indent;

					for (let x = 0; x < dimension; x++) {

						let tmp = (data[x + y * dimension]).toString();
						if (tmp.length < max) {
							str += _WHITESPACE.substr(0, max - tmp.length);
						}

						str += tmp;

						if (x < dimension - 1) {
							str += ', ';
						}

					}

					if (y < dimension - 1) {
						str += ',';
					}

					str += '\n';

				}

				str += indent + ']';

			} else if (is_primitive === true) {

				str  = indent;
				str += '[';

				for (let d = 0, dl = data.length; d < dl; d++) {

					if (d === 0) {
						str += ' ';
					}

					str += _stringify(data[d]);

					if (d < dl - 1) {
						str += ', ';
					} else {
						str += ' ';
					}

				}

				str += ']';

			} else {

				str  = indent;
				str += '[\n';

				for (let d = 0, dl = data.length; d < dl; d++) {

					str += _stringify(data[d], '\t' + indent);

					if (d < dl - 1) {
						str += ',';
					}

					str += '\n';

				}

				str += indent + ']';

			}

		} else if (data instanceof Date) {

			str  = indent;

			str += data.getUTCFullYear()                + '-';
			str += _format_date(data.getUTCMonth() + 1) + '-';
			str += _format_date(data.getUTCDate())      + 'T';
			str += _format_date(data.getUTCHours())     + ':';
			str += _format_date(data.getUTCMinutes())   + ':';
			str += _format_date(data.getUTCSeconds())   + 'Z';

		} else if (data instanceof Object) {

			let keys = Object.keys(data);
			if (keys.length === 0) {

				str = indent + '{}';

			} else {

				str  = indent;
				str += '{\n';

				for (let k = 0, kl = keys.length; k < kl; k++) {

					let key = keys[k];

					str += '\t' + indent + '"' + key + '": ';
					str += _stringify(data[key], '\t' + indent).trim();

					if (k < kl - 1) {
						str += ',';
					}

					str += '\n';

				}

				str += indent + '}';

			}

		}


		return str;

	};

	const _args_to_string = function(args, offset) {

		offset = typeof offset === 'number' ? offset : null;


		let output  = [];
		let columns = process.stdout.columns;

		for (let a = 0, al = args.length; a < al; a++) {

			let value = args[a];
			let o     = 0;

			if (typeof value === 'function') {

				let tmp = (value).toString().split('\n');

				for (let t = 0, tl = tmp.length; t < tl; t++) {
					output.push(tmp[t].replace(/\t/g, _INDENT));
				}

				o = output.length - 1;

			} else if (value instanceof Object) {

				let tmp = _stringify(value).split('\n');
				if (tmp.length > 1) {

					for (let t = 0, tl = tmp.length; t < tl; t++) {
						output.push(tmp[t].replace(/\t/g, _INDENT));
					}

					o = output.length - 1;

				} else {

					let chunk = output[o];
					if (chunk === undefined) {
						output[o] = tmp[0].trim();
					} else {
						output[o] = (chunk + ' ' + tmp[0]).trim();
					}

				}

			} else if (typeof value === 'string' && value.includes('\n')) {

				let tmp = value.split('\n');

				for (let t = 0, tl = tmp.length; t < tl; t++) {
					output.push(tmp[t].replace(/\t/g, _INDENT));
				}

				o = output.length - 1;

			} else {

				let chunk = output[o];
				if (chunk === undefined) {
					output[o] = ('' + value).replace(/\t/g, _INDENT).trim();
				} else {
					output[o] = (chunk + (' ' + value).replace(/\t/g, _INDENT)).trim();
				}

			}

		}


		let ol = output.length;
		if (ol > 1) {

			if (offset !== null) {

				for (let o = 0; o < ol; o++) {

					let line = output[o];
					let maxl = (o === 0 || o === ol - 1) ? (columns - offset) : columns;
					if (line.length > maxl) {
						output[o] = line.substr(0, maxl);
					} else {
						output[o] = line + _WHITESPACE.substr(0, maxl - line.length);
					}

				}

			}


			return output.join('\n');

		} else {

			if (offset !== null) {

				let line = output[0];
				let maxl = columns - offset * 2;
				if (line.length > maxl) {
					line = line.substr(0, maxl);
				} else {
					line = line + _WHITESPACE.substr(0, maxl - line.length);
				}

				return line;

			}


			return output[0];

		}

	};



	/*
	 * IMPLEMENTATION
	 */

	console.clear = function() {

		// clear screen
		// process.stdout.write('\x1B[2J');

		// clear screen and reset cursor
		process.stdout.write('\x1B[2J\x1B[0f');

		// clear scroll buffer
		process.stdout.write('\u001b[3J');

	};

	console.log = function() {

		let al   = arguments.length;
		let args = [ '(L)' ];
		for (let a = 0; a < al; a++) {
			args.push(arguments[a]);
		}

		_std_out += _args_to_string(args) + '\n';

		process.stdout.write('\u001b[49m\u001b[97m ' + _args_to_string(args, 1) + ' \u001b[39m\u001b[49m\u001b[0m\n');

	};

	console.info = function() {

		let al   = arguments.length;
		let args = [ '(I)' ];
		for (let a = 0; a < al; a++) {
			args.push(arguments[a]);
		}

		_std_out += _args_to_string(args) + '\n';

		process.stdout.write('\u001b[42m\u001b[97m ' + _args_to_string(args, 1) + ' \u001b[39m\u001b[49m\u001b[0m\n');

	};

	console.warn = function() {

		let al   = arguments.length;
		let args = [ '(W)' ];
		for (let a = 0; a < al; a++) {
			args.push(arguments[a]);
		}

		_std_out += _args_to_string(args) + '\n';

		process.stdout.write('\u001b[43m\u001b[97m ' + _args_to_string(args, 1) + ' \u001b[39m\u001b[49m\u001b[0m\n');

	};

	console.error = function() {

		let al   = arguments.length;
		let args = [ '(E)' ];
		for (let a = 0; a < al; a++) {
			args.push(arguments[a]);
		}

		_std_err += _args_to_string(args) + '\n';

		process.stderr.write('\u001b[41m\u001b[97m ' + _args_to_string(args, 1) + ' \u001b[39m\u001b[49m\u001b[0m\n');

	};

	console.deserialize = function(blob) {

		if (typeof blob.stdout === 'string') {
			_std_out = blob.stdout;
		}

		if (typeof blob.stderr === 'string') {
			_std_err = blob.stderr;
		}

	};

	console.serialize = function() {

		let blob = {};


		if (_std_out.length > 0) blob.stdout = _std_out;
		if (_std_err.length > 0) blob.stderr = _std_err;


		return {
			'reference': 'console',
			'blob':      Object.keys(blob).length > 0 ? blob : null
		};

	};

})(lychee, global);


(function(lychee, global) {

	(function(process, selfpath) {

		let tmp1 = selfpath.indexOf('/libraries/lychee');
		if (tmp1 !== -1) {
			lychee.ROOT.lychee = selfpath.substr(0, tmp1);
		}

		let tmp2 = selfpath.split('/').slice(0, 3).join('/');
		if (tmp2.startsWith('/opt/lycheejs')) {
			lychee.ROOT.lychee = tmp2;
		}

		let tmp3 = process.env.LYCHEEJS_ROOT || '';
		if (tmp3 !== '') {
			lychee.ROOT.lychee = tmp3;
		}

		let cwd = typeof process.cwd === 'function' ? process.cwd() : '';
		if (cwd !== '') {
			lychee.ROOT.project = cwd;
		}

	})(global.process || {}, typeof __filename === 'string' ? __filename : '');



	/*
	 * POLYFILLS
	 */

	const _META_KEYCODE     = /^(?:\x1b)([a-zA-Z0-9])$/;
	const _FUNCTION_KEYCODE = /^(?:\x1b+)(O|N|\[|\[\[)(?:(\d+)(?:;(\d+))?([~^$])|(?:1;)?(\d+)?([a-zA-Z]))/;

	const _parse_keypress   = function(str) {

		let parts;


		if (Buffer.isBuffer(str)) {

			if (str[0] > 127 && str[1] === undefined) {
				str[0] -= 128;
				str = '\x1b' + str.toString('utf8');
			} else {
				str = str.toString('utf8');
			}

		}


		let key = {
			name:  null,
			ctrl:  false,
			meta:  false,
			shift: false
		};


		// Return
		if (str === '\r' || str === '\n') {

			key.name = 'return';

		// Tab
		} else if (str === '\t') {

			key.name = 'tab';

		// Backspace or Ctrl + H
		} else if (str === '\b' || str === '\x7f' || str === '\x1b\b' || str === '\x1b\x7f') {

			key.name = 'backspace';
			key.meta = (str.charAt(0) === '\x1b');

		// Escape
		} else if (str === '\x1b' || str === '\x1b\x1b') {

			key.name = 'escape';
			key.meta = (str.length === 2);

		// Space
		} else if (str === ' ' || str === '\x1b ') {

			key.name = 'space';
			key.meta = (str.length === 2);

		// Ctrl + Letter
		} else if (str <= '\x1a') {

			key.name = String.fromCharCode(str.charCodeAt(0) + 'a'.charCodeAt(0) - 1);
			key.ctrl = true;

		// Letter
		} else if (str.length === 1 && str >= 'a' && str <= 'z') {

			key.name = str;

		// Shift + Letter
		} else if (str.length === 1 && str >= 'A' && str <= 'Z') {

			// was: key.name = str.toLowerCase();
			key.name = str;
			key.shift = true;

		// Meta + Letter
		} else if ((parts = _META_KEYCODE.exec(str))) {

			key.name = parts[1].toLowerCase();
			key.meta = true;
			key.shift = /^[A-Z]$/.test(parts[1]);

		// Function Key (ANSI ESCAPE SEQUENCE)
		} else if ((parts = _FUNCTION_KEYCODE.exec(str))) {

			let code = (parts[1] || '') + (parts[2] || '') + (parts[4] || '') + (parts[6] || '');
			let mod  = (parts[3] || parts[5] || 1) - 1;

			key.ctrl = !!(mod & 4);
			key.meta = !!(mod & 10);
			key.shift = !!(mod & 1);


			// Parse the key itself
			switch (code) {

				// xterm ESC O letter
				case 'OP':   key.name = 'f1'; break;
				case 'OQ':   key.name = 'f2'; break;
				case 'OR':   key.name = 'f3'; break;
				case 'OS':   key.name = 'f4'; break;

				// xterm ESC [ number ~
				case '[11~': key.name = 'f1'; break;
				case '[12~': key.name = 'f2'; break;
				case '[13~': key.name = 'f3'; break;
				case '[14~': key.name = 'f4'; break;

				// Cygwin/libuv
				case '[[A':  key.name = 'f1'; break;
				case '[[B':  key.name = 'f2'; break;
				case '[[C':  key.name = 'f3'; break;
				case '[[D':  key.name = 'f4'; break;
				case '[[E':  key.name = 'f5'; break;

				// common
				case '[15~': key.name = 'f5';  break;
				case '[17~': key.name = 'f6';  break;
				case '[18~': key.name = 'f7';  break;
				case '[19~': key.name = 'f8';  break;
				case '[20~': key.name = 'f9';  break;
				case '[21~': key.name = 'f10'; break;
				case '[23~': key.name = 'f11'; break;
				case '[24~': key.name = 'f12'; break;

				// xterm ESC [ letter
				case '[A':   key.name = 'up';    break;
				case '[B':   key.name = 'down';  break;
				case '[C':   key.name = 'right'; break;
				case '[D':   key.name = 'left';  break;
				case '[E':   key.name = 'clear'; break;
				case '[F':   key.name = 'end';   break;
				case '[H':   key.name = 'home';  break;

				// xterm ESC O letter
				case 'OA':   key.name = 'up';    break;
				case 'OB':   key.name = 'down';  break;
				case 'OC':   key.name = 'right'; break;
				case 'OD':   key.name = 'left';  break;
				case 'OE':   key.name = 'clear'; break;
				case 'OF':   key.name = 'end';   break;
				case 'OH':   key.name = 'home';  break;

				// xterm ESC [ number ~
				case '[1~':  key.name = 'home';     break;
				case '[2~':  key.name = 'insert';   break;
				case '[3~':  key.name = 'delete';   break;
				case '[4~':  key.name = 'end';      break;
				case '[5~':  key.name = 'pageup';   break;
				case '[6~':  key.name = 'pagedown'; break;

				// Putty
				case '[[5~': key.name = 'pageup';   break;
				case '[[6~': key.name = 'pagedown'; break;

				// misc.
				case '[Z':   key.name = 'tab'; key.shift = true; break;
				default:     key.name = null;                    break;

			}

		}


		if (key.name !== null) {
			return key;
		}


		return null;

	};



	/*
	 * EXPORTS
	 */

	global.require = require;

	Object.defineProperty(lychee, 'FILENAME', {

		get: function() {

			let filename = global.__FILENAME || null;
			if (filename !== null) {
				return filename;
			}

			return null;

		},

		set: function() {
			return false;
		}

	});

	module.exports = function(root) {

		root = typeof root === 'string' ? root : null;


		if (root === null) {
			console.warn('BOOTSTRAP.js: No project root set.                                ');
			console.warn('Use "require(\'./libraries/crux/build/node/dist.js\')(__dirname)".');
		}


		let stream      = process.stdin;
		let is_emitting = stream._emitsKeypress === true;
		if (is_emitting === false) {

			// Note: This fixes issues with running IOJS with nohup
			if (stream.isTTY === true) {

				stream._emitsKeypress = true;

				stream.setEncoding('utf8');
				stream.setRawMode(true);
				stream.resume();

				stream.on('data', function(data) {

					if (this.listeners('keypress').length > 0) {

						let key = _parse_keypress(data);
						if (key !== null) {
							this.emit('keypress', key);
						}

					}

				});

			}

		}


		if (typeof root === 'string') {
			lychee.ROOT.project = root;
		}


		return lychee;

	};

})(lychee, global);


(function(lychee, global) {



	/*
	 * IMPLEMENTATION
	 */

	Buffer.prototype.serialize = function() {

		return {
			'constructor': 'Buffer',
			'arguments':   [ this.toString('base64'), 'base64' ]
		};

	};

	Buffer.prototype.map = function(callback) {

		callback = callback instanceof Function ? callback : null;


		let clone = Buffer.alloc(this.length);

		if (callback !== null) {

			for (let b = 0; b < this.length; b++) {
				clone[b] = callback(this[b], b);
			}

		} else {

			for (let b = 0; b < this.length; b++) {
				clone[b] = this[b];
			}

		}

		return clone;

	};


	global.Buffer = Buffer;

})(lychee, global);


(function(lychee, global) {

	const _fs = require('fs');



	/*
	 * HELPERS
	 */

	const _CONFIG_CACHE = {};

	const _clone_config = function(origin, clone) {

		if (origin.buffer !== null) {

			clone.buffer = JSON.parse(JSON.stringify(origin.buffer));

			clone.__load = false;

		}

	};



	/*
	 * IMPLEMENTATION
	 */

	const Config = function(url) {

		url = typeof url === 'string' ? url : null;


		this.url    = url;
		this.onload = null;
		this.buffer = null;

		this.__load = true;


		if (url !== null) {

			if (_CONFIG_CACHE[url] !== undefined) {
				_clone_config(_CONFIG_CACHE[url], this);
			} else {
				_CONFIG_CACHE[url] = this;
			}

		}

	};


	Config.prototype = {

		deserialize: function(blob) {

			if (typeof blob.buffer === 'string') {

				let tmp1 = blob.buffer.substr(blob.buffer.indexOf(',') + 1);
				let tmp2 = Buffer.from(tmp1, 'base64');

				try {
					this.buffer = JSON.parse(tmp2.toString('utf8'));
				} catch (err) {
				}

				this.__load = false;

			}

		},

		serialize: function() {

			let blob = {};


			if (this.buffer !== null) {

				let tmp1 = JSON.stringify(this.buffer, null, '\t');
				let tmp2 = Buffer.from(tmp1, 'utf8');

				blob.buffer = 'data:application/json;base64,' + tmp2.toString('base64');

			}


			return {
				'constructor': 'Config',
				'arguments':   [ this.url ],
				'blob':        Object.keys(blob).length > 0 ? blob : null
			};

		},

		load: function() {

			if (this.__load === false) {

				if (this.onload instanceof Function) {
					this.onload(true);
					this.onload = null;
				}

				return;

			}


			let path = lychee.environment.resolve(this.url);

			_fs.readFile(path, 'utf8', (error, buffer) => {

				let data = null;
				try {
					data = JSON.parse(buffer);
				} catch (err) {
				}


				this.buffer = data;
				this.__load = false;

				if (data === null) {
					console.warn('Invalid Config at "' + this.url + '" (No JSON file).');
					console.warn(path);
				}

				if (this.onload instanceof Function) {
					this.onload(data !== null);
					this.onload = null;
				}

			});

		}

	};


	global.Config = Config;

})(lychee, global);


(function(lychee, global) {

	const _fs = require('fs');



	/*
	 * HELPERS
	 */

	const _parse_font = function() {

		let data = this.__buffer;

		if (typeof data.kerning === 'number' && typeof data.spacing === 'number') {

			if (data.kerning > data.spacing) {
				data.kerning = data.spacing;
			}

		}


		if (data.texture !== undefined) {

			let texture = new Texture(data.texture);

			texture.onload = result => {
				this.texture = texture;
			};

			texture.load();

		} else {

			console.warn('Invalid Font at "' + this.url + '" (No FNT file).');

		}


		this.baseline   = typeof data.baseline === 'number'   ? data.baseline   : this.baseline;
		this.charset    = typeof data.charset === 'string'    ? data.charset    : this.charset;
		this.lineheight = typeof data.lineheight === 'number' ? data.lineheight : this.lineheight;
		this.kerning    = typeof data.kerning === 'number'    ? data.kerning    : this.kerning;
		this.spacing    = typeof data.spacing === 'number'    ? data.spacing    : this.spacing;


		if (data.font instanceof Object) {

			this.__font.color   = data.font.color   || '#ffffff';
			this.__font.family  = data.font.family  || 'Ubuntu Mono';
			this.__font.outline = data.font.outline || 0;
			this.__font.size    = data.font.size    || 16;
			this.__font.style   = data.font.style   || 'normal';

		}


		_parse_font_characters.call(this);

	};

	const _parse_font_characters = function() {

		let data = this.__buffer;
		let url  = this.url;

		if (_CHAR_CACHE[url] === undefined) {
			_CHAR_CACHE[url] = {};
		}

		if (data.map instanceof Array) {

			let offset = this.spacing;

			for (let c = 0, cl = this.charset.length; c < cl; c++) {

				let id  = this.charset[c];
				let chr = {
					width:      data.map[c] + this.spacing * 2,
					height:     this.lineheight,
					realwidth:  data.map[c],
					realheight: this.lineheight,
					x:          offset - this.spacing,
					y:          0
				};

				offset += chr.width;

				_CHAR_CACHE[url][id] = chr;

			}

		}

	};


	const _CHAR_CACHE = {};
	const _FONT_CACHE = {};

	const _clone_font = function(origin, clone) {

		if (origin.__buffer !== null) {

			clone.__buffer = origin.__buffer;
			clone.__load   = false;

			_parse_font.call(clone);

		}

	};



	/*
	 * IMPLEMENTATION
	 */

	const Font = function(url) {

		url = typeof url === 'string' ? url : null;


		this.url        = url;
		this.onload     = null;
		this.texture    = null;

		this.baseline   = 0;
		this.charset    = ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~';
		this.kerning    = 0;
		this.spacing    = 0;
		this.lineheight = 1;

		this.__buffer   = null;
		this.__font     = {
			color:   '#ffffff',
			family:  'Ubuntu Mono',
			outline: 0,
			size:    16,
			style:   'normal'
		};
		this.__load     = true;


		if (url !== null) {

			if (_CHAR_CACHE[url] === undefined) {

				_CHAR_CACHE[url]     = {};
				_CHAR_CACHE[url][''] = {
					width:      0,
					height:     this.lineheight,
					realwidth:  0,
					realheight: this.lineheight,
					x:          0,
					y:          0
				};

			}


			if (_FONT_CACHE[url] !== undefined) {
				_clone_font(_FONT_CACHE[url], this);
			} else {
				_FONT_CACHE[url] = this;
			}

		}

	};


	Font.prototype = {

		deserialize: function(blob) {

			if (typeof blob.buffer === 'string') {

				let tmp1 = blob.buffer.substr(blob.buffer.indexOf(',') + 1);
				let tmp2 = Buffer.from(tmp1, 'base64');

				try {
					this.__buffer = JSON.parse(tmp2.toString('utf8'));
				} catch (err) {
				}

				this.__load = false;
				_parse_font.call(this);

			}

		},

		serialize: function() {

			let blob = {};


			if (this.__buffer !== null) {

				let tmp1 = JSON.stringify(this.__buffer, null, '\t');
				let tmp2 = Buffer.from(tmp1, 'utf8');

				blob.buffer = 'data:application/json;base64,' + tmp2.toString('base64');

			}


			return {
				'constructor': 'Font',
				'arguments':   [ this.url ],
				'blob':        Object.keys(blob).length > 0 ? blob : null
			};

		},

		measure: function(text) {

			text = typeof text === 'string' ? text : '';


			let buffer = this.__buffer;
			if (buffer !== null) {

				// Cache Usage
				if (this.__load === false) {

					let cache = _CHAR_CACHE[this.url] || null;
					if (cache !== null) {

						let tl = text.length;
						if (tl === 1) {

							if (cache[text] !== undefined) {
								return cache[text];
							}

						} else if (tl > 1) {

							let data = cache[text] || null;
							if (data === null) {

								let width = 0;
								let map   = buffer.map;

								for (let t = 0; t < tl; t++) {

									let m = this.charset.indexOf(text[t]);
									if (m !== -1) {
										width += map[m] + this.kerning;
									}

								}

								if (width > 0) {

									// TODO: Embedded Font ligatures will set x and y values based on settings.map
									data = cache[text] = {
										width:      width,
										height:     this.lineheight,
										realwidth:  width,
										realheight: this.lineheight,
										x:          0,
										y:          0
									};

								}

							}


							return data;

						}


						return cache[''];

					}

					// Temporary Usage
				} else {

					let tl = text.length;
					if (tl === 1) {

						let m = this.charset.indexOf(text);
						if (m !== -1) {

							let offset  = this.spacing;
							let spacing = this.spacing;
							let map     = buffer.map;

							for (let c = 0; c < m; c++) {
								offset += map[c] + spacing * 2;
							}

							return {
								width:      map[m] + spacing * 2,
								height:     this.lineheight,
								realwidth:  map[m],
								realheight: this.lineheight,
								x:          offset - spacing,
								y:          0
							};

						}

					} else if (tl > 1) {

						let width = 0;
						let map   = buffer.map;

						for (let t = 0; t < tl; t++) {

							let m = this.charset.indexOf(text[t]);
							if (m !== -1) {
								width += map[m] + this.kerning;
							}

						}

						if (width > 0) {

							return {
								width:      width,
								height:     this.lineheight,
								realwidth:  width,
								realheight: this.lineheight,
								x:          0,
								y:          0
							};

						}

					}


					return {
						width:      0,
						height:     this.lineheight,
						realwidth:  0,
						realheight: this.lineheight,
						x:          0,
						y:          0
					};

				}

			}


			return null;

		},

		load: function() {

			if (this.__load === false) {

				if (this.onload instanceof Function) {
					this.onload(true);
					this.onload = null;
				}

				return;

			}


			let path = lychee.environment.resolve(this.url);

			_fs.readFile(path, 'utf8', (error, buffer) => {

				let data = null;
				try {
					data = JSON.parse(buffer);
				} catch (err) {
				}


				this.__buffer = data;
				this.__load   = false;

				if (data !== null) {
					_parse_font.call(this);
				}

				if (this.onload instanceof Function) {
					this.onload(data !== null);
					this.onload = null;
				}

			});

		}

	};


	global.Font = Font;

})(lychee, global);


(function(lychee, global) {

	const _fs = require('fs');



	/*
	 * HELPERS
	 */

	const _MUSIC_CACHE = {};

	const _clone_music = function(origin, clone) {

		if (origin.__buffer.ogg !== null || origin.__buffer.mp3 !== null) {

			clone.__buffer.ogg = origin.__buffer.ogg;
			clone.__buffer.mp3 = origin.__buffer.mp3;
			clone.__load       = false;

		}

	};



	/*
	 * IMPLEMENTATION
	 */

	const Music = function(url) {

		url = typeof url === 'string' ? url : null;


		this.url      = url;
		this.onload   = null;
		this.buffer   = null;
		this.volume   = 0.0;
		this.isIdle   = true;

		this.__buffer = { ogg: null, mp3: null };
		this.__load   = true;


		if (url !== null) {

			if (_MUSIC_CACHE[url] !== undefined) {
				_clone_music(_MUSIC_CACHE[url], this);
			} else {
				_MUSIC_CACHE[url] = this;
			}

		}

	};


	Music.prototype = {

		deserialize: function(blob) {

			if (blob.buffer instanceof Object) {

				if (typeof blob.buffer.ogg === 'string') {

					let tmp = blob.buffer.ogg.substr(blob.buffer.ogg.indexOf(',') + 1);

					this.__buffer.ogg = Buffer.from(tmp, 'base64');

				}

				if (typeof blob.buffer.mp3 === 'string') {

					let tmp = blob.buffer.mp3.substr(blob.buffer.mp3.indexOf(',') + 1);

					this.__buffer.mp3 = Buffer.from(tmp, 'base64');

				}


				this.__load = false;

			}

		},

		serialize: function() {

			let blob = {};


			if (this.__buffer.ogg !== null || this.__buffer.mp3 !== null) {

				blob.buffer = {};

				if (this.__buffer.ogg !== null) {
					blob.buffer.ogg = 'data:application/ogg;base64,' + this.__buffer.ogg.toString('base64');
				}

				if (this.__buffer.mp3 !== null) {
					blob.buffer.mp3 = 'data:audio/mp3;base64,' + this.__buffer.mp3.toString('base64');
				}

			}


			return {
				'constructor': 'Music',
				'arguments':   [ this.url ],
				'blob':        Object.keys(blob).length > 0 ? blob : null
			};

		},

		load: function() {

			if (this.__load === false) {

				if (this.onload instanceof Function) {
					this.onload(true);
					this.onload = null;
				}

				return;

			}


			let path_ogg = lychee.environment.resolve(this.url + '.ogg');
			let path_mp3 = lychee.environment.resolve(this.url + '.mp3');

			_fs.readFile(path_ogg, (error_ogg, buffer_ogg) => {

				_fs.readFile(path_mp3, (error_mp3, buffer_mp3) => {

					this.__buffer.ogg = buffer_ogg || null;
					this.__buffer.mp3 = buffer_mp3 || null;
					this.__load       = false;

					if (this.onload instanceof Function) {
						this.onload(buffer_ogg !== null || buffer_mp3 !== null);
						this.onload = null;
					}

				});

			});

		},

		clone: function() {
			return new Music(this.url);
		},

		play: function() {
			this.isIdle = false;
		},

		pause: function() {
			this.isIdle = true;
		},

		resume: function() {
			this.isIdle = false;
		},

		stop: function() {
			this.isIdle = true;
		},

		setVolume: function(volume) {

			volume = typeof volume === 'number' ? volume : null;


			return false;

		}

	};


	global.Music = Music;

})(lychee, global);


(function(lychee, global) {

	const _fs = require('fs');



	/*
	 * HELPERS
	 */

	const _SOUND_CACHE = {};

	const _clone_sound = function(origin, clone) {

		if (origin.__buffer.ogg !== null || origin.__buffer.mp3 !== null) {

			clone.__buffer.ogg = origin.__buffer.ogg;
			clone.__buffer.mp3 = origin.__buffer.mp3;
			clone.__load       = false;

		}

	};



	/*
	 * IMPLEMENTATION
	 */

	const Sound = function(url) {

		url = typeof url === 'string' ? url : null;


		this.url      = url;
		this.onload   = null;
		this.buffer   = null;
		this.volume   = 0.0;
		this.isIdle   = true;

		this.__buffer = { ogg: null, mp3: null };
		this.__load   = true;


		if (url !== null) {

			if (_SOUND_CACHE[url] !== undefined) {
				_clone_sound(_SOUND_CACHE[url], this);
			} else {
				_SOUND_CACHE[url] = this;
			}

		}

	};


	Sound.prototype = {

		deserialize: function(blob) {

			if (blob.buffer instanceof Object) {

				if (typeof blob.buffer.ogg === 'string') {

					let tmp = blob.buffer.ogg.substr(blob.buffer.ogg.indexOf(',') + 1);

					this.__buffer.ogg = Buffer.from(tmp, 'base64');

				}

				if (typeof blob.buffer.mp3 === 'string') {

					let tmp = blob.buffer.mp3.substr(blob.buffer.mp3.indexOf(',') + 1);

					this.__buffer.mp3 = Buffer.from(tmp, 'base64');

				}


				this.__load = false;

			}

		},

		serialize: function() {

			let blob = {};


			if (this.__buffer.ogg !== null || this.__buffer.mp3 !== null) {

				blob.buffer = {};

				if (this.__buffer.ogg !== null) {
					blob.buffer.ogg = 'data:application/ogg;base64,' + this.__buffer.ogg.toString('base64');
				}

				if (this.__buffer.mp3 !== null) {
					blob.buffer.mp3 = 'data:audio/mp3;base64,' + this.__buffer.mp3.toString('base64');
				}

			}


			return {
				'constructor': 'Sound',
				'arguments':   [ this.url ],
				'blob':        Object.keys(blob).length > 0 ? blob : null
			};

		},

		load: function() {

			if (this.__load === false) {

				if (this.onload instanceof Function) {
					this.onload(true);
					this.onload = null;
				}

				return;

			}


			let path_ogg = lychee.environment.resolve(this.url + '.ogg');
			let path_mp3 = lychee.environment.resolve(this.url + '.mp3');

			_fs.readFile(path_ogg, (error_ogg, buffer_ogg) => {

				_fs.readFile(path_mp3, (error_mp3, buffer_mp3) => {

					this.__buffer.ogg = buffer_ogg || null;
					this.__buffer.mp3 = buffer_mp3 || null;
					this.__load       = false;

					if (this.onload instanceof Function) {
						this.onload(buffer_ogg !== null || buffer_mp3 !== null);
						this.onload = null;
					}

				});

			});

		},

		clone: function() {
			return new Sound(this.url);
		},

		play: function() {
			this.isIdle = false;
		},

		pause: function() {
			this.isIdle = true;
		},

		resume: function() {
			this.isIdle = false;
		},

		stop: function() {
			this.isIdle = true;
		},

		setVolume: function(volume) {

			volume = typeof volume === 'number' ? volume : null;


			return false;

		}

	};


	global.Sound = Sound;

})(lychee, global);


(function(lychee, global) {

	const _fs = require('fs');



	/*
	 * HELPERS
	 */

	const _STUFF_CACHE = {};

	const _clone_stuff = function(origin, clone) {

		if (origin.buffer !== null) {

			clone.buffer = origin.buffer;

			clone.__load = false;

		}

	};

	const _execute_stuff = function(callback) {

		let url    = this.url;
		let ignore = this.__ignore;

		if (url.endsWith('.js') && ignore === false) {

			// XXX: Used by BOOTSTRAP.js
			global.__FILENAME = url;


			let cid = lychee.environment.resolve(url);
			if (require.cache[cid] !== undefined) {
				delete require.cache[cid];
			}

			let result = false;
			try {
				require(cid);
				result = true;
			} catch (err) {
				lychee.Debugger.report(lychee.environment, err, this);
			}


			// XXX: Used by BOOTSTRAP.js
			global.__FILENAME = null;


			callback.call(this, result);

		} else {

			callback.call(this, true);

		}

	};



	/*
	 * IMPLEMENTATION
	 */

	const Stuff = function(url, ignore) {

		url    = typeof url === 'string' ? url : null;
		ignore = ignore === true;


		this.url      = url;
		this.onload   = null;
		this.buffer   = null;

		this.__ignore = ignore;
		this.__load   = true;


		if (url !== null) {

			if (_STUFF_CACHE[url] !== undefined) {
				_clone_stuff(_STUFF_CACHE[url], this);
			} else {
				_STUFF_CACHE[url] = this;
			}

		}

	};


	Stuff.prototype = {

		deserialize: function(blob) {

			if (typeof blob.buffer === 'string') {

				let tmp = blob.buffer.substr(blob.buffer.indexOf(',') + 1);

				this.buffer = Buffer.from(tmp, 'base64');
				this.__load = false;

			}

		},

		serialize: function() {

			let blob = {};
			let mime = 'application/octet-stream';


			if (this.url.endsWith('.js')) {
				mime = 'application/javascript';
			}


			if (this.buffer !== null) {
				blob.buffer = 'data:' + mime + ';base64,' + this.buffer.toString('base64');
			}


			return {
				'constructor': 'Stuff',
				'arguments':   [ this.url ],
				'blob':        Object.keys(blob).length > 0 ? blob : null
			};

		},

		load: function() {

			if (this.__load === false) {

				_execute_stuff.call(this, function(result) {

					if (this.onload instanceof Function) {
						this.onload(result);
						this.onload = null;
					}

				});


				return;

			}


			let path = lychee.environment.resolve(this.url);

			_fs.readFile(path, (error, buffer) => {

				let raw = buffer || null;
				if (raw !== null) {

					this.buffer = Buffer.from(raw);
					this.__load = false;

					_execute_stuff.call(this, function(result) {

						if (this.onload instanceof Function) {
							this.onload(result);
							this.onload = null;
						}

					});

				} else {

					this.buffer = null;
					this.__load = false;

					if (this.onload instanceof Function) {
						this.onload(false);
						this.onload = null;
					}

				}

			});

		}

	};


	global.Stuff = Stuff;

})(lychee, global);


(function(lychee, global) {

	const _fs = require('fs');



	/*
	 * HELPERS
	 */

	let   _TEXTURE_ID    = 0;
	const _TEXTURE_CACHE = {};

	const _parse_texture = function(data) {

		this.width  = (data[0] << 24) | (data[1] << 16) | (data[2] << 8) | data[3];
		this.height = (data[4] << 24) | (data[5] << 16) | (data[6] << 8) | data[7];

	};

	const _clone_texture = function(origin, clone) {

		if (origin.buffer !== null) {

			clone.id     = origin.id;

			clone.buffer = origin.buffer;
			clone.width  = origin.width;
			clone.height = origin.height;

			clone.__load = false;

		}

	};



	/*
	 * IMPLEMENTATION
	 */

	const Texture = function(url) {

		url = typeof url === 'string' ? url : null;


		this.id     = _TEXTURE_ID++;
		this.url    = url;
		this.onload = null;
		this.buffer = null;
		this.width  = 0;
		this.height = 0;

		this.__load = true;


		if (url !== null && url.startsWith('data:image') === false) {

			if (_TEXTURE_CACHE[url] !== undefined) {
				_clone_texture(_TEXTURE_CACHE[url], this);
			} else {
				_TEXTURE_CACHE[url] = this;
			}

		}

	};


	Texture.prototype = {

		deserialize: function(blob) {

			if (typeof blob.buffer === 'string') {

				let tmp = blob.buffer.substr(blob.buffer.indexOf(',') + 1);

				this.buffer = Buffer.from(tmp, 'base64');
				this.__load = false;

			}

		},

		serialize: function() {

			let blob = {};


			if (this.buffer !== null) {
				blob.buffer = 'data:image/png;base64,' + this.buffer.toString('base64');
			}


			return {
				'constructor': 'Texture',
				'arguments':   [ this.url ],
				'blob':        Object.keys(blob).length > 0 ? blob : null
			};

		},

		load: function() {

			if (this.__load === false) {

				if (this.onload instanceof Function) {
					this.onload(true);
					this.onload = null;
				}

				return;

			}


			let url = this.url;
			if (url.startsWith('data:')) {

				if (url.startsWith('data:image/png;')) {

					let b64data = url.substr(15, url.length - 15);
					this.buffer = Buffer.from(b64data, 'base64');
					this.__load = false;

					_parse_texture.call(this, this.buffer.slice(16, 24));


					let is_power_of_two = (this.width & (this.width - 1)) === 0 && (this.height & (this.height - 1)) === 0;
					if (lychee.debug === true && is_power_of_two === false) {
						console.warn('Invalid Texture at data:image/png; (NOT power-of-two).');
					}

				} else {

					console.warn('Invalid Texture at "' + url.substr(0, 15) + '" (No PNG file).');

				}


				if (this.onload instanceof Function) {
					this.onload(this.buffer !== null);
					this.onload = null;
				}

			} else {

				if (url.endsWith('.png')) {


					let path = lychee.environment.resolve(url);

					_fs.readFile(path, (error, buffer) => {

						this.buffer = buffer || null;
						this.__load = false;

						if (this.buffer !== null) {
							_parse_texture.call(this, this.buffer);
						}

						let is_power_of_two = (this.width & (this.width - 1)) === 0 && (this.height & (this.height - 1)) === 0;
						if (lychee.debug === true && is_power_of_two === false) {
							console.warn('Invalid Texture at "' + this.url + '" (NOT power-of-two).');
						}

						if (this.onload instanceof Function) {
							this.onload(buffer !== null);
							this.onload = null;
						}

					});

				} else {

					console.warn('Invalid Texture at "' + this.url + '" (No PNG file).');


					if (this.onload instanceof Function) {
						this.onload(false);
						this.onload = null;
					}

				}

			}

		}

	};


	global.Texture = Texture;

})(lychee, global);


(function(lychee, global) {

	const _BUFFER = {
		Buffer: function() {}
	};

	const _CHILD_PROCESS = {
		execFile: function(path, args) {}
	};

	const _FS = {
		readFile:      function(path, encoding, callback) {},
		readFileSync:  function(path, encoding) {},
		mkdirSync:     function(path, mode) {},
		unlinkSync:    function(path) {},
		writeFileSync: function(path, data, encoding) {},

		lstatSync:     function(path) {
			return {
				isDirectory: function() {}
			};
		}

	};

	const _Server = function(states) {

		this.allowHalfOpen  = false;
		this.pauseOnConnect = false;

	};

	_Server.prototype = {

		close:  function() {},
		listen: function(port, host) {},

		on: function(event, callback) {

			if (event === 'connection') {
				callback(new _Socket());
			}

		}

	};

	const _Socket = function(states) {

		this.allowHalfOpen = false;

	};

	_Socket.prototype = {
		destroy:            function() {},
		on:                 function(event, callback) {},
		removeAllListeners: function(event) {},
		setKeepAlive:       function(flag, delay) {},
		setNoDelay:         function(flag) {},
		setTimeout:         function(delay) {}
	};


	const _NET = {
		Server: _Server,
		Socket: _Socket
	};

	const _PATH = {
		dirname: function(path) {}
	};

	const _FEATURES = {

		require: function(id) {

			if (id === 'buffer')        return _BUFFER;
			if (id === 'child_process') return _CHILD_PROCESS;
			if (id === 'fs')            return _FS;
			if (id === 'net')           return _NET;
			if (id === 'path')          return _PATH;


			throw new Error('Cannot find module \'' + id + '\'');

		},

		process: {
			env: {
				APPDATA: null,
				HOME:    '/home/dev'
			},
			stdin: {
				on: function(event, callback) {}
			},
			stdout: {
				on:    function(event, callback) {},
				write: function(str) {}
			}
		},

		clearInterval: function(id) {},
		clearTimeout:  function(id) {},
		setInterval:   function(callback, delay) {},
		setTimeout:    function(callback, delay) {}

	};


	lychee.FEATURES['node'] = _FEATURES;

})(lychee, typeof global !== 'undefined' ? global : this);


(function(lychee, global) {

	const _CONTEXT = {
		fillStyle:    '#000000',
		globalAlpha:  1.0,
		lineWidth:    1,
		strokeStyle:  '#000000'
	};

	_CONTEXT.prototype = {

		arc:          function(x, y, radius, start, end) {},
		beginPath:    function() {},
		closePath:    function() {},
		drawImage:    function(image, x, y, width, height, srcx, srcy, src_width, src_height) {},
		fill:         function() {},
		fillRect:     function(x, y, width, height) {},
		setTransform: function(x1, y1, z1, x2, y2, z2) {},
		lineTo:       function(x, y) {},
		moveTo:       function(x, y) {},
		stroke:       function() {},
		strokeRect:   function(x, y, width, height) {}

	};

	const _ELEMENT = {
		id:        '',
		className: '',
		style:     {
			position:        'static',
			width:           1337,
			height:          1337,
			backgroundColor: '#000000',
			pointerEvents:   'none',
			transform:       '',
			zIndex:          0
		}
	};

	_ELEMENT.prototype = {

		getBoundingClientRect: function() {

			return {
				left: 1337,
				top:  1337
			};

		}

	};

	const _CANVAS = Object.assign({}, _ELEMENT);

	_CANVAS.prototype = Object.assign({}, _ELEMENT.prototype, {

		getContext: function(context) {

			if (context === '2d') {
				return _CONTEXT;
			}

			return null;

		}

	});

	const _INPUT = {

		oncancel:     function() {},
		onchange:     function() {},
		onclick:      function() {},
		value:        '',

		click:        function() {},
		setAttribute: function(name, value) {}

	};

	const _FEATURES = {

		innerWidth:  1337,
		innerHeight: 1337,

		CanvasRenderingContext2D: function() {},
		FileReader:               function() {},
		Storage:                  function() {},
		WebSocket:                function(url, protocols) {},
		XMLHttpRequest:           function() {},

		addEventListener:      function(event, callback, bubble) {},
		clearInterval:         function(id) {},
		clearTimeout:          function(id) {},
		requestAnimationFrame: function(callback) {},
		setInterval:           function(callback, delay) {},
		setTimeout:            function(callback, delay) {},

		document: {

			createElement: function(type) {

				if (type === 'a' || type === 'div') {
					return _ELEMENT;
				} else if (type === 'input') {
					return _INPUT;
				} else if (type === 'canvas') {
					return _CANVAS;
				}

				return null;

			},

			querySelectorAll: function(query) {

				if (query === '.lychee-Renderer') {
					return [ _ELEMENT ];
				}

				return null;

			},
			body: {
				appendChild: function(element) {}
			}
		},

		location: {
			href: 'file:///tmp/index.html'
		},

		localStorage: {
			setItem: function(key, value) {},
			getItem: function(key) {}
		},

		sessionStorage: {
			setItem: function(key, value) {},
			getItem: function(key) {}
		}

	};

	_FEATURES.FileReader.prototype.readAsDataURL = function() {};


	lychee.FEATURES['html'] = _FEATURES;

})(lychee, typeof global !== 'undefined' ? global : this);


(function(lychee, global) {

	const _BUFFER = {
		Buffer: function() {}
	};

	const _CHILD_PROCESS = {
		execFile: function(path, args) {}
	};

	const _FS = {
		readFile:      function(path, encoding, callback) {},
		readFileSync:  function(path, encoding) {},
		mkdirSync:     function(path, mode) {},
		unlinkSync:    function(path) {},
		writeFileSync: function(path, data, encoding) {},

		lstatSync:     function(path) {
			return {
				isDirectory: function() {}
			};
		}

	};

	const _Server = function(states) {

		this.allowHalfOpen  = false;
		this.pauseOnConnect = false;

	};

	_Server.prototype = {

		close:  function() {},
		listen: function(port, host) {},

		on: function(event, callback) {

			if (event === 'connection') {
				callback(new _Socket());
			}

		}

	};

	const _Socket = function(states) {

		this.allowHalfOpen = false;

	};

	_Socket.prototype = {
		destroy:            function() {},
		on:                 function(event, callback) {},
		removeAllListeners: function(event) {},
		setKeepAlive:       function(flag, delay) {},
		setNoDelay:         function(flag) {},
		setTimeout:         function(delay) {}
	};


	const _NET = {
		Server: _Server,
		Socket: _Socket
	};

	const _PATH = {
		dirname: function(path) {}
	};

	const _FEATURES = {

		require: function(id) {

			if (id === 'buffer')        return _BUFFER;
			if (id === 'child_process') return _CHILD_PROCESS;
			if (id === 'fs')            return _FS;
			if (id === 'net')           return _NET;
			if (id === 'path')          return _PATH;


			throw new Error('Cannot find module \'' + id + '\'');

		},

		process: {
			env: {
				APPDATA: null,
				HOME:    '/home/dev'
			},
			stdin: {
				on: function(event, callback) {}
			},
			stdout: {
				on:    function(event, callback) {},
				write: function(str) {}
			}
		},

		clearInterval: function(id) {},
		clearTimeout:  function(id) {},
		setInterval:   function(callback, delay) {},
		setTimeout:    function(callback, delay) {}

	};


	// XXX: This is an incremental platform of 'html'

	lychee.FEATURES['html-nwjs'] = _FEATURES;

})(lychee, typeof global !== 'undefined' ? global : this);


(function(lychee, global) {

	const _FEATURES = {
	};


	lychee.FEATURES['html-webview'] = _FEATURES;

})(lychee, typeof global !== 'undefined' ? global : this);


(function(lychee, global) {

	const _CONTEXT = {
		fillStyle:    '#000000',
		globalAlpha:  1.0,
		lineWidth:    1,
		strokeStyle:  '#000000'
	};

	_CONTEXT.prototype = {

		arc:          function(x, y, radius, start, end) {},
		beginPath:    function() {},
		closePath:    function() {},
		drawImage:    function(image, x, y, width, height, srcx, srcy, src_width, src_height) {},
		fill:         function() {},
		fillRect:     function(x, y, width, height) {},
		setTransform: function(x1, y1, z1, x2, y2, z2) {},
		lineTo:       function(x, y) {},
		moveTo:       function(x, y) {},
		stroke:       function() {},
		strokeRect:   function(x, y, width, height) {}

	};

	const _Canvas = function(width, height, options) {
		this.width  = 1337;
		this.height = 1337;
		this.__left = 0;
		this.__top  = 0;
	};

	_Canvas.prototype = {

		clear: function() {},

		getContext: function(context) {

			if (context === '2d') {
				return _CONTEXT;
			}

			return null;

		}

	};

	const _File = function(path, options, callback) {
		this.filesize = 1337;
	};

	_File.prototype = {
		openSync:  function(mode, callback) {},
		readSync:  function(bytes, callback) {},
		writeSync: function(buffer, callback) {},
		closeSync: function() {}
	};

	_File.read = function(path, options, callback) {
	};

	const _Socket = function(host, port) {
		this.binary       = false;
		this.encoding     = 'utf8';
		this.onconnect    = null;
		this.ondisconnect = null;
		this.ondrain      = null;
		this.onmessage    = null;
	};

	_Socket.prototype = {
		close:   function() {},
		connect: function(mode) {},
		listen:  function(mode) {},
		write:   function(data) {}
	};


	const _FEATURES = {

		Canvas:                   _Canvas,
		CanvasRenderingContext2D: _CONTEXT,
		File:                     _File,
		Socket:                   _Socket,

		addEventListener:      function(event, callback, bubble) {},
		clearInterval:         function(id) {},
		clearTimeout:          function(id) {},
		requestAnimationFrame: function(callback) {},
		setInterval:           function(callback, delay) {},
		setTimeout:            function(callback, delay) {},

		document: {

			canvas: {

				add:    function(canvas) {},
				remove: function(canvas) {}

			}

		},

		window: {

			innerWidth:  1337,
			innerHeight: 1337,
			left:        0,
			top:         0,

			_onblur:     null,
			_onfocus:    null,

			__nidium__:  {
				build:    'abcdef0123456789',
				revision: 'abcdef0123456789',
				version:  '0.2'
			},

			addEventListener:      function(event, callback) {},
			exec:                  function(cmd) {},
			openFileDialog:        function(types, callback) {},
			requestAnimationFrame: function(callback) {},
			setSize:               function(width, height) {}

		}

	};


	lychee.FEATURES['nidium'] = _FEATURES;

})(lychee, typeof global !== 'undefined' ? global : this);

(function(lychee, global) {

	const _BUFFER = {
		Buffer: function() {}
	};

	const _CHILD_PROCESS = {
		execFile: function(path, args) {}
	};

	const _FS = {
		readFile:      function(path, encoding, callback) {},
		readFileSync:  function(path, encoding) {},
		mkdirSync:     function(path, mode) {},
		unlinkSync:    function(path) {},
		writeFileSync: function(path, data, encoding) {},

		lstatSync:     function(path) {
			return {
				isDirectory: function() {}
			};
		}

	};

	const _Server = function(states) {

		this.allowHalfOpen  = false;
		this.pauseOnConnect = false;

	};

	_Server.prototype = {

		close:  function() {},
		listen: function(port, host) {},

		on: function(event, callback) {

			if (event === 'connection') {
				callback(new _Socket());
			}

		}

	};

	const _Socket = function(states) {

		this.allowHalfOpen = false;

	};

	_Socket.prototype = {
		destroy:            function() {},
		on:                 function(event, callback) {},
		removeAllListeners: function(event) {},
		setKeepAlive:       function(flag, delay) {},
		setNoDelay:         function(flag) {},
		setTimeout:         function(delay) {}
	};


	const _NET = {
		Server: _Server,
		Socket: _Socket
	};

	const _PATH = {
		dirname: function(path) {}
	};

	const _FEATURES = {

		require: function(id) {

			if (id === 'buffer')        return _BUFFER;
			if (id === 'child_process') return _CHILD_PROCESS;
			if (id === 'fs')            return _FS;
			if (id === 'net')           return _NET;
			if (id === 'path')          return _PATH;


			throw new Error('Cannot find module \'' + id + '\'');

		},

		process: {
			env: {
				APPDATA: null,
				HOME:    '/home/dev'
			},
			stdin: {
				on: function(event, callback) {}
			},
			stdout: {
				on:    function(event, callback) {},
				write: function(str) {}
			}
		},

		clearInterval: function(id) {},
		clearTimeout:  function(id) {},
		setInterval:   function(callback, delay) {},
		setTimeout:    function(callback, delay) {}

	};


	lychee.FEATURES['node'] = _FEATURES;

})(lychee, typeof global !== 'undefined' ? global : this);


(function(lychee, global) {

	const _FEATURES = {
	};


	lychee.FEATURES['node-sdl'] = _FEATURES;

})(lychee, typeof global !== 'undefined' ? global : this);


(function(lychee, global) {

	if (lychee === undefined) {

		try {
			lychee = require('./crux.js')(__dirname);
		} catch (err) {
		}

	}


	let blob = {
		"constructor": "lychee.Environment",
		"arguments": [
			{
				"id": "/libraries/harvester/dist",
				"debug": false,
				"target": "harvester.Main",
				"type": "build",
				"variant": "library",
				"tags": {
					"platform": [
						"node"
					]
				}
			}
		],
		"blob": {
			"definitions": {
				"harvester.Main": {
					"constructor": "lychee.Definition",
					"arguments": [
						{
							"id": "harvester.Main",
							"url": "/libraries/harvester/source/Main.js"
						}
					],
					"blob": {
						"attaches": {},
						"requires": [
							"harvester.net.Admin",
							"harvester.net.Server",
							"harvester.Watcher"
						],
						"includes": [
							"lychee.event.Emitter"
						],
						"exports": "(lychee, global, attachments) => {\n\n\tconst _harvester     = lychee.import('harvester');\n\tconst _clearInterval = global.clearInterval || function() {};\n\tconst _setInterval   = global.setInterval;\n\tconst _Emitter       = lychee.import('lychee.event.Emitter');\n\tconst _INTERFACES    = (function() {\n\n\t\tlet os = null;\n\n\t\ttry {\n\t\t\tos = require('os');\n\t\t} catch (err) {\n\t\t}\n\n\n\t\tif (os !== null) {\n\n\t\t\tlet candidates = [];\n\n\t\t\tObject.values(os.networkInterfaces()).forEach(iface => {\n\n\t\t\t\tiface.forEach(alias => {\n\n\t\t\t\t\tif (alias.internal === false) {\n\n\t\t\t\t\t\tif (alias.family === 'IPv6' && alias.scopeid === 0) {\n\t\t\t\t\t\t\tcandidates.push(alias.address);\n\t\t\t\t\t\t} else if (alias.family === 'IPv4') {\n\t\t\t\t\t\t\tcandidates.push(alias.address);\n\t\t\t\t\t\t}\n\n\t\t\t\t\t}\n\n\t\t\t\t});\n\n\t\t\t});\n\n\t\t\treturn candidates.unique();\n\n\t\t}\n\n\n\t\treturn [];\n\n\t})();\n\n\n\n\t/*\n\t * HELPERS\n\t */\n\n\tconst _is_public = function(host) {\n\n\t\tif (host === '::1' || host === 'localhost') {\n\n\t\t\treturn false;\n\n\t\t} else if (/:/g.test(host) === true) {\n\n\t\t\tlet tmp = host.split(':');\n\t\t\tif (tmp[0] !== '') {\n\n\t\t\t\tlet tmp2 = parseInt(tmp[0], 16);\n\t\t\t\tif (tmp2 === 64512) {\n\n\t\t\t\t\treturn false;\n\n\t\t\t\t} else if (tmp2 >= 65152 && tmp2 <= 65215) {\n\n\t\t\t\t\treturn false;\n\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t} else if (/\\./g.test(host) === true) {\n\n\t\t\tlet tmp = host.split('.');\n\n\t\t\tif (tmp[0] === '10') {\n\n\t\t\t\treturn false;\n\n\t\t\t} else if (tmp[0] === '192' && tmp[1] === '168') {\n\n\t\t\t\treturn false;\n\n\t\t\t} else if (tmp[0] === '172') {\n\n\t\t\t\tlet tmp2 = parseInt(tmp[1], 10);\n\t\t\t\tif (!isNaN(tmp2) && tmp2 >= 16 && tmp2 <= 31) {\n\t\t\t\t\treturn false;\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t}\n\n\n\t\treturn true;\n\n\t};\n\n\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tconst Composite = function(states) {\n\n\t\tthis.settings = lychee.assignsafe({\n\t\t\tdebug:   false,\n\t\t\thost:    'localhost',\n\t\t\tport:    8080,\n\t\t\tsandbox: false\n\t\t}, states);\n\n\n\t\tlet debug = this.settings.debug;\n\t\tif (debug === true) {\n\t\t\tconsole.log('harvester.Main: Parsed settings are ...');\n\t\t\tconsole.log(this.settings);\n\t\t}\n\n\n\t\t// Updated by Watcher instance\n\t\tthis._libraries = {};\n\t\tthis._projects  = {};\n\n\t\tthis.admin   = null;\n\t\tthis.server  = null;\n\t\tthis.watcher = new _harvester.Watcher(this);\n\n\t\tthis.__interval = null;\n\n\n\t\t_Emitter.call(this);\n\n\t\tstates = null;\n\n\n\n\t\t/*\n\t\t * INITIALIZATION\n\t\t */\n\n\t\tthis.bind('load', function() {\n\n\t\t\tlet host = this.settings.host;\n\t\t\tlet port = this.settings.port;\n\n\n\t\t\tthis.admin  = new _harvester.net.Admin({\n\t\t\t\thost: null,\n\t\t\t\tport: 4848\n\t\t\t});\n\n\t\t\tthis.server = new _harvester.net.Server({\n\t\t\t\thost: host === 'localhost' ? null : host,\n\t\t\t\tport: port\n\t\t\t});\n\n\t\t}, this, true);\n\n\t\tthis.bind('init', function() {\n\n\t\t\tthis.admin.connect();\n\t\t\tthis.server.connect();\n\n\n\t\t\tconsole.log('');\n\t\t\tconsole.info('harvester.Main: +-------------------------------------------------------+');\n\t\t\tconsole.info('harvester.Main: | Open one of these URLs with a Blink-based Web Browser |');\n\t\t\tconsole.info('harvester.Main: +-------------------------------------------------------+');\n\t\t\tconsole.log('');\n\t\t\tthis.getHosts().forEach(host => console.log('harvester.Main: ' + host));\n\t\t\tconsole.log('');\n\n\t\t}, this, true);\n\n\t\tthis.bind('init', function() {\n\n\t\t\tlet watcher = this.watcher || null;\n\t\t\tif (watcher !== null) {\n\n\t\t\t\twatcher.init();\n\n\t\t\t\tthis.__interval = _setInterval(_ => watcher.update(), 30000);\n\n\t\t\t}\n\n\t\t}, this, true);\n\n\t};\n\n\n\tComposite.prototype = {\n\n\t\t/*\n\t\t * ENTITY API\n\t\t */\n\n\t\tdeserialize: function(blob) {\n\n\t\t\tlet admin = lychee.deserialize(blob.admin);\n\t\t\tif (admin !== null) {\n\t\t\t\tthis.admin = admin;\n\t\t\t}\n\n\n\t\t\tlet server = lychee.deserialize(blob.server);\n\t\t\tif (server !== null) {\n\t\t\t\tthis.server = server;\n\t\t\t}\n\n\t\t},\n\n\t\tserialize: function() {\n\n\t\t\tlet data = _Emitter.prototype.serialize.call(this);\n\t\t\tdata['constructor'] = 'harvester.Main';\n\n\n\t\t\tlet states = lychee.assignunlink({}, this.settings);\n\t\t\tlet blob   = data['blob'] || {};\n\n\n\t\t\tif (this.admin !== null)  blob.admin  = lychee.serialize(this.admin);\n\t\t\tif (this.server !== null) blob.server = lychee.serialize(this.server);\n\n\n\t\t\tdata['arguments'][0] = states;\n\t\t\tdata['blob']         = Object.keys(blob).length > 0 ? blob : null;\n\n\n\t\t\treturn data;\n\n\t\t},\n\n\n\n\t\t/*\n\t\t * MAIN API\n\t\t */\n\n\t\tinit: function() {\n\n\t\t\tthis.trigger('load');\n\t\t\tthis.trigger('init');\n\n\t\t\treturn true;\n\n\t\t},\n\n\t\tdestroy: function() {\n\n\t\t\tfor (let pid in this._projects) {\n\n\t\t\t\tlet project = this._projects[pid];\n\t\t\t\tif (project.server !== null) {\n\n\t\t\t\t\tif (typeof project.server.destroy === 'function') {\n\t\t\t\t\t\tproject.server.destroy();\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\tif (this.admin !== null) {\n\t\t\t\tthis.admin.disconnect();\n\t\t\t\tthis.admin = null;\n\t\t\t}\n\n\t\t\tif (this.server !== null) {\n\t\t\t\tthis.server.disconnect();\n\t\t\t\tthis.server = null;\n\t\t\t}\n\n\t\t\tif (this.__interval !== null) {\n\t\t\t\t_clearInterval(this.__interval);\n\t\t\t\tthis.__interval = null;\n\t\t\t}\n\n\n\t\t\tthis.trigger('destroy');\n\n\t\t\treturn true;\n\n\t\t},\n\n\n\n\t\t/*\n\t\t * CUSTOM API\n\t\t */\n\n\t\tgetHosts: function() {\n\n\t\t\tlet filtered = [];\n\n\t\t\tlet server = this.server;\n\t\t\tif (server !== null) {\n\n\t\t\t\tlet host = server.host || null;\n\t\t\t\tlet port = server.port;\n\t\t\t\tif (host === null) {\n\n\t\t\t\t\tfor (let i = 0, il = _INTERFACES.length; i < il; i++) {\n\n\t\t\t\t\t\tlet iface = _INTERFACES[i];\n\t\t\t\t\t\tif (/:/g.test(iface)) {\n\t\t\t\t\t\t\tfiltered.push('http://[' + iface + ']:' + port);\n\t\t\t\t\t\t} else {\n\t\t\t\t\t\t\tfiltered.push('http://' + iface + ':' + port);\n\t\t\t\t\t\t}\n\n\t\t\t\t\t}\n\n\t\t\t\t\tfiltered.push('http://localhost:' + port);\n\n\t\t\t\t} else {\n\n\t\t\t\t\tif (/:/g.test(host)) {\n\t\t\t\t\t\tfiltered.push('http://[' + host + ']:' + port);\n\t\t\t\t\t} else {\n\t\t\t\t\t\tfiltered.push('http://' + host + ':' + port);\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\treturn filtered;\n\n\t\t},\n\n\t\tgetNetworks: function() {\n\n\t\t\tlet networks = [];\n\t\t\tlet server   = null;\n\n\t\t\tif (server !== null) {\n\n\t\t\t\tlet host = server.host || null;\n\t\t\t\tlet port = server.port;\n\n\t\t\t\tif (_is_public(host) === true) {\n\t\t\t\t\tnetworks.push((/:/g.test(host) ? '[' + host + ']' : host) + ':' + port);\n\t\t\t\t}\n\n\t\t\t\tnetworks.push.apply(networks, _INTERFACES.filter(_is_public).map(host => {\n\t\t\t\t\treturn (/:/g.test(host) ? '[' + host + ']' : host) + ':' + port;\n\t\t\t\t}));\n\n\t\t\t}\n\n\n\t\t\treturn networks;\n\n\t\t}\n\n\t};\n\n\n\treturn Composite;\n\n}"
					}
				},
				"lychee.event.Emitter": {
					"constructor": "lychee.Definition",
					"arguments": [
						{
							"id": "lychee.event.Emitter",
							"url": "/libraries/lychee/source/event/Emitter.js"
						}
					],
					"blob": {
						"attaches": {},
						"exports": "(lychee, global, attachments) => {\n\n\t/*\n\t * HELPERS\n\t */\n\n\tconst _has = function(event, callback, scope) {\n\n\t\tlet found = false;\n\n\t\tif (event !== null) {\n\n\t\t\tfound = _has_event.call(this, event, callback, scope);\n\n\t\t} else {\n\n\t\t\tfor (event in this.___events) {\n\n\t\t\t\tlet result = _has_event.call(this, event, callback, scope);\n\t\t\t\tif (result === true) {\n\t\t\t\t\tfound = true;\n\t\t\t\t\tbreak;\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t}\n\n\t\treturn found;\n\n\t};\n\n\tconst _has_event = function(event, callback, scope) {\n\n\t\tif (this.___events !== undefined && this.___events[event] !== undefined) {\n\n\t\t\tlet found = false;\n\n\t\t\tfor (let e = 0, el = this.___events[event].length; e < el; e++) {\n\n\t\t\t\tlet entry = this.___events[event][e];\n\n\t\t\t\tif ((callback === null || entry.callback === callback) && (scope === null || entry.scope === scope)) {\n\t\t\t\t\tfound = true;\n\t\t\t\t\tbreak;\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t\treturn found;\n\n\t\t}\n\n\n\t\treturn false;\n\n\t};\n\n\tconst _bind = function(event, callback, scope, once) {\n\n\t\tif (event === null || callback === null) {\n\t\t\treturn false;\n\t\t}\n\n\n\t\tlet pass_event = false;\n\t\tlet pass_self  = false;\n\n\t\tlet modifier = event.charAt(0);\n\t\tif (modifier === '@') {\n\n\t\t\tevent      = event.substr(1, event.length - 1);\n\t\t\tpass_event = true;\n\n\t\t} else if (modifier === '#') {\n\n\t\t\tevent     = event.substr(1, event.length - 1);\n\t\t\tpass_self = true;\n\n\t\t}\n\n\n\t\tif (this.___events[event] === undefined) {\n\t\t\tthis.___events[event] = [];\n\t\t}\n\n\n\t\tthis.___events[event].push({\n\t\t\tpass_event: pass_event,\n\t\t\tpass_self:  pass_self,\n\t\t\tcallback:   callback,\n\t\t\tscope:      scope,\n\t\t\tonce:       once\n\t\t});\n\n\n\t\treturn true;\n\n\t};\n\n\tconst _publish = function(event, instance, once) {\n\n\t\tif (event === null || instance === null) {\n\t\t\treturn false;\n\t\t}\n\n\n\t\tlet callback = function() {\n\n\t\t\tlet event = arguments[0];\n\t\t\tlet data  = [];\n\n\t\t\tfor (let a = 1, al = arguments.length; a < al; a++) {\n\t\t\t\tdata.push(arguments[a]);\n\t\t\t}\n\n\t\t\tthis.trigger(event, data);\n\n\t\t};\n\n\n\t\tif (this.___events[event] === undefined) {\n\t\t\tthis.___events[event] = [];\n\t\t}\n\n\n\t\tthis.___events[event].push({\n\t\t\tpass_event: true,\n\t\t\tpass_self:  false,\n\t\t\tcallback:   callback,\n\t\t\tscope:      instance,\n\t\t\tonce:       once\n\t\t});\n\n\n\t\treturn true;\n\n\t};\n\n\tconst _subscribe = function(event, instance, once) {\n\n\t\tif (event === null || instance === null) {\n\t\t\treturn false;\n\t\t}\n\n\n\t\tlet callback = function() {\n\n\t\t\tlet event = arguments[0];\n\t\t\tlet data  = [];\n\n\t\t\tfor (let a = 1, al = arguments.length; a < al; a++) {\n\t\t\t\tdata.push(arguments[a]);\n\t\t\t}\n\n\t\t\tthis.trigger(event, data);\n\n\t\t};\n\n\n\t\tif (instance.___events[event] === undefined) {\n\t\t\tinstance.___events[event] = [];\n\t\t}\n\n\n\t\tinstance.___events[event].push({\n\t\t\tpass_event: true,\n\t\t\tpass_self:  false,\n\t\t\tcallback:   callback,\n\t\t\tscope:      this,\n\t\t\tonce:       once\n\t\t});\n\n\n\t\treturn true;\n\n\t};\n\n\tconst _transfer = function(event, instance, once) {\n\n\t\tif (event === null || instance === null) {\n\t\t\treturn false;\n\t\t}\n\n\n\t\tlet events = this.___events[event] || [];\n\t\tif (events.length > 0) {\n\n\t\t\tfor (let e = 0, el = events.length; e < el; e++) {\n\n\t\t\t\tlet entry = this.___events[event][e];\n\n\t\t\t\tinstance.___events[event].push({\n\t\t\t\t\tpass_event: entry.pass_event,\n\t\t\t\t\tpass_self:  entry.pass_self,\n\t\t\t\t\tcallback:   entry.callback,\n\t\t\t\t\tscope:      instance,\n\t\t\t\t\tonce:       once\n\t\t\t\t});\n\n\t\t\t}\n\n\t\t}\n\n\n\t\treturn true;\n\n\t};\n\n\tconst _trigger = function(event, data) {\n\n\t\tif (this.___events !== undefined && this.___events[event] !== undefined) {\n\n\t\t\tlet value = undefined;\n\n\t\t\tfor (let e = 0; e < this.___events[event].length; e++) {\n\n\t\t\t\tlet args  = [];\n\t\t\t\tlet entry = this.___events[event][e];\n\n\t\t\t\tif (entry.pass_event === true) {\n\n\t\t\t\t\targs.push(event);\n\n\t\t\t\t} else if (entry.pass_self === true) {\n\n\t\t\t\t\targs.push(this);\n\n\t\t\t\t}\n\n\n\t\t\t\tif (data !== null) {\n\t\t\t\t\targs.push.apply(args, data);\n\t\t\t\t}\n\n\n\t\t\t\tlet result = entry.callback.apply(entry.scope, args);\n\t\t\t\tif (result !== undefined) {\n\t\t\t\t\tvalue = result;\n\t\t\t\t}\n\n\n\t\t\t\tif (entry.once === true) {\n\n\t\t\t\t\tif (this.unbind(event, entry.callback, entry.scope) === true) {\n\t\t\t\t\t\te--;\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\tif (value !== undefined) {\n\t\t\t\treturn value;\n\t\t\t} else {\n\t\t\t\treturn true;\n\t\t\t}\n\n\t\t}\n\n\n\t\treturn false;\n\n\t};\n\n\tconst _unbind = function(event, callback, scope) {\n\n\t\tlet found = false;\n\n\t\tif (event !== null) {\n\n\t\t\tfound = _unbind_event.call(this, event, callback, scope);\n\n\t\t} else {\n\n\t\t\tfor (event in this.___events) {\n\n\t\t\t\tlet result = _unbind_event.call(this, event, callback, scope);\n\t\t\t\tif (result === true) {\n\t\t\t\t\tfound = true;\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t}\n\n\t\treturn found;\n\n\t};\n\n\tconst _unbind_event = function(event, callback, scope) {\n\n\t\tif (this.___events !== undefined && this.___events[event] !== undefined) {\n\n\t\t\tlet found = false;\n\n\t\t\tfor (let e = 0, el = this.___events[event].length; e < el; e++) {\n\n\t\t\t\tlet entry = this.___events[event][e];\n\n\t\t\t\tif ((callback === null || entry.callback === callback) && (scope === null || entry.scope === scope)) {\n\n\t\t\t\t\tfound = true;\n\n\t\t\t\t\tthis.___events[event].splice(e, 1);\n\t\t\t\t\tel--;\n\t\t\t\t\te--;\n\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t\treturn found;\n\n\t\t}\n\n\n\t\treturn false;\n\n\t};\n\n\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tconst Composite = function() {\n\n\t\tthis.___events   = {};\n\t\tthis.___timeline = {\n\t\t\tbind:      [],\n\t\t\thas:       [],\n\t\t\tpublish:   [],\n\t\t\tsubscribe: [],\n\t\t\ttransfer:  [],\n\t\t\ttrigger:   [],\n\t\t\tunbind:    []\n\t\t};\n\n\t};\n\n\n\tComposite.prototype = {\n\n\t\t/*\n\t\t * ENTITY API\n\t\t */\n\n\t\tdeserialize: function(blob) {\n\n\t\t\tif (blob.events instanceof Object) {\n\t\t\t\t// TODO: deserialize events\n\t\t\t}\n\n\t\t\tif (blob.timeline instanceof Object) {\n\t\t\t\t// TODO: deserialize timeline\n\t\t\t}\n\n\t\t},\n\n\t\tserialize: function() {\n\n\t\t\tlet blob = {};\n\n\n\t\t\tif (Object.keys(this.___events).length > 0) {\n\n\t\t\t\tblob.events = {};\n\n\t\t\t\tfor (let event in this.___events) {\n\n\t\t\t\t\tblob.events[event] = [];\n\n\t\t\t\t\tfor (let e = 0, el = this.___events[event].length; e < el; e++) {\n\n\t\t\t\t\t\tlet entry = this.___events[event][e];\n\n\t\t\t\t\t\tblob.events[event].push({\n\t\t\t\t\t\t\tpass_event: entry.pass_event,\n\t\t\t\t\t\t\tpass_self:  entry.pass_self,\n\t\t\t\t\t\t\tcallback:   lychee.serialize(entry.callback),\n\t\t\t\t\t\t\t// scope:      lychee.serialize(entry.scope),\n\t\t\t\t\t\t\tscope:      null,\n\t\t\t\t\t\t\tonce:       entry.once\n\t\t\t\t\t\t});\n\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\tlet timeline = {};\n\n\t\t\tif (this.___timeline.bind.length > 0) {\n\n\t\t\t\ttimeline.bind = [];\n\n\t\t\t\tfor (let b = 0, bl = this.___timeline.bind.length; b < bl; b++) {\n\t\t\t\t\ttimeline.bind.push(this.___timeline.bind[b]);\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t\tif (this.___timeline.has.length > 0) {\n\n\t\t\t\ttimeline.has = [];\n\n\t\t\t\tfor (let h = 0, hl = this.___timeline.has.length; h < hl; h++) {\n\t\t\t\t\ttimeline.has.push(this.___timeline.has[h]);\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t\tif (this.___timeline.publish.length > 0) {\n\n\t\t\t\ttimeline.publish = [];\n\n\t\t\t\tfor (let p = 0, pl = this.___timeline.publish.length; p < pl; p++) {\n\t\t\t\t\ttimeline.publish.push(this.___timeline.publish[p]);\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t\tif (this.___timeline.subscribe.length > 0) {\n\n\t\t\t\ttimeline.subscribe = [];\n\n\t\t\t\tfor (let s = 0, sl = this.___timeline.subscribe.length; s < sl; s++) {\n\t\t\t\t\ttimeline.subscribe.push(this.___timeline.subscribe[s]);\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t\tif (this.___timeline.transfer.length > 0) {\n\n\t\t\t\ttimeline.transfer = [];\n\n\t\t\t\tfor (let t = 0, tl = this.___timeline.transfer.length; t < tl; t++) {\n\t\t\t\t\ttimeline.transfer.push(this.___timeline.transfer[t]);\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t\tif (this.___timeline.trigger.length > 0) {\n\n\t\t\t\ttimeline.trigger = [];\n\n\t\t\t\tfor (let t = 0, tl = this.___timeline.trigger.length; t < tl; t++) {\n\t\t\t\t\ttimeline.trigger.push(this.___timeline.trigger[t]);\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t\tif (this.___timeline.unbind.length > 0) {\n\n\t\t\t\ttimeline.unbind = [];\n\n\t\t\t\tfor (let u = 0, ul = this.___timeline.unbind.length; u < ul; u++) {\n\t\t\t\t\ttimeline.unbind.push(this.___timeline.unbind[u]);\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t\tif (Object.keys(timeline).length > 0) {\n\t\t\t\tblob.timeline = timeline;\n\t\t\t}\n\n\n\t\t\treturn {\n\t\t\t\t'constructor': 'lychee.event.Emitter',\n\t\t\t\t'arguments':   [],\n\t\t\t\t'blob':        Object.keys(blob).length > 0 ? blob : null\n\t\t\t};\n\n\t\t},\n\n\n\n\t\t/*\n\t\t * CUSTOM API\n\t\t */\n\n\t\tbind: function(event, callback, scope, once) {\n\n\t\t\tevent    = typeof event === 'string'    ? event    : null;\n\t\t\tcallback = callback instanceof Function ? callback : null;\n\t\t\tscope    = scope !== undefined          ? scope    : this;\n\t\t\tonce     = once === true;\n\n\n\t\t\tlet result = _bind.call(this, event, callback, scope, once);\n\t\t\tif (result === true && lychee.debug === true) {\n\n\t\t\t\tthis.___timeline.bind.push({\n\t\t\t\t\ttime:     Date.now(),\n\t\t\t\t\tevent:    event,\n\t\t\t\t\tcallback: lychee.serialize(callback),\n\t\t\t\t\t// scope:    lychee.serialize(scope),\n\t\t\t\t\tscope:    null,\n\t\t\t\t\tonce:     once\n\t\t\t\t});\n\n\t\t\t}\n\n\n\t\t\treturn result;\n\n\t\t},\n\n\t\thas: function(event, callback, scope) {\n\n\t\t\tevent    = typeof event === 'string'    ? event    : null;\n\t\t\tcallback = callback instanceof Function ? callback : null;\n\t\t\tscope    = scope !== undefined          ? scope    : this;\n\n\n\t\t\tlet result = _has.call(this, event, callback, scope);\n\t\t\tif (result === true && lychee.debug === true) {\n\n\t\t\t\tthis.___timeline.has.push({\n\t\t\t\t\ttime:     Date.now(),\n\t\t\t\t\tevent:    event,\n\t\t\t\t\tcallback: lychee.serialize(callback),\n\t\t\t\t\t// scope:    lychee.serialize(scope)\n\t\t\t\t\tscope:    null\n\t\t\t\t});\n\n\t\t\t}\n\n\n\t\t\treturn result;\n\n\t\t},\n\n\t\tpublish: function(event, instance, once) {\n\n\t\t\tevent    = typeof event === 'string'               ? event    : null;\n\t\t\tinstance = lychee.interfaceof(Composite, instance) ? instance : null;\n\t\t\tonce     = once === true;\n\n\n\t\t\tlet result = _publish.call(this, event, instance, once);\n\t\t\tif (result === true && lychee.debug === true) {\n\n\t\t\t\tthis.___timeline.publish.push({\n\t\t\t\t\ttime:     Date.now(),\n\t\t\t\t\tevent:    event,\n\t\t\t\t\tinstance: lychee.serialize(instance),\n\t\t\t\t\tonce:     once\n\t\t\t\t});\n\n\t\t\t}\n\n\n\t\t\treturn result;\n\n\t\t},\n\n\t\tsubscribe: function(event, instance, once) {\n\n\t\t\tevent    = typeof event === 'string'               ? event    : null;\n\t\t\tinstance = lychee.interfaceof(Composite, instance) ? instance : null;\n\t\t\tonce     = once === true;\n\n\n\t\t\tlet result = _subscribe.call(this, event, instance, once);\n\t\t\tif (result === true && lychee.debug === true) {\n\n\t\t\t\tthis.___timeline.subscribe.push({\n\t\t\t\t\ttime:     Date.now(),\n\t\t\t\t\tevent:    event,\n\t\t\t\t\tinstance: lychee.serialize(instance),\n\t\t\t\t\tonce:     once\n\t\t\t\t});\n\n\t\t\t}\n\n\n\t\t\treturn result;\n\n\t\t},\n\n\t\ttransfer: function(event, instance, once) {\n\n\t\t\tevent    = typeof event === 'string'               ? event    : null;\n\t\t\tinstance = lychee.interfaceof(Composite, instance) ? instance : null;\n\t\t\tonce     = once === true;\n\n\n\t\t\tlet result = _transfer.call(this, event, instance, once);\n\t\t\tif (result === true && lychee.debug === true) {\n\n\t\t\t\tthis.___timeline.transfer.push({\n\t\t\t\t\ttime:     Date.now(),\n\t\t\t\t\tevent:    event,\n\t\t\t\t\tinstance: lychee.serialize(instance),\n\t\t\t\t\tonce:     once\n\t\t\t\t});\n\n\t\t\t}\n\n\n\t\t\treturn result;\n\n\t\t},\n\n\t\ttrigger: function(event, data) {\n\n\t\t\tevent = typeof event === 'string' ? event : null;\n\t\t\tdata  = data instanceof Array     ? data  : null;\n\n\n\t\t\tlet result = _trigger.call(this, event, data);\n\t\t\tif (result === true && lychee.debug === true) {\n\n\t\t\t\tthis.___timeline.trigger.push({\n\t\t\t\t\ttime:  Date.now(),\n\t\t\t\t\tevent: event,\n\t\t\t\t\tdata:  lychee.serialize(data)\n\t\t\t\t});\n\n\t\t\t}\n\n\n\t\t\treturn result;\n\n\t\t},\n\n\t\tunbind: function(event, callback, scope) {\n\n\t\t\tevent    = typeof event === 'string'    ? event    : null;\n\t\t\tcallback = callback instanceof Function ? callback : null;\n\t\t\tscope    = scope !== undefined          ? scope    : null;\n\n\n\t\t\tlet result = _unbind.call(this, event, callback, scope);\n\t\t\tif (result === true) {\n\n\t\t\t\tthis.___timeline.unbind.push({\n\t\t\t\t\ttime:     Date.now(),\n\t\t\t\t\tevent:    event,\n\t\t\t\t\tcallback: lychee.serialize(callback),\n\t\t\t\t\t// scope:    lychee.serialize(scope)\n\t\t\t\t\tscope:    null\n\t\t\t\t});\n\n\t\t\t}\n\n\n\t\t\treturn result;\n\n\t\t}\n\n\t};\n\n\n\treturn Composite;\n\n}"
					}
				},
				"harvester.net.Admin": {
					"constructor": "lychee.Definition",
					"arguments": [
						{
							"id": "harvester.net.Admin",
							"url": "/libraries/harvester/source/net/Admin.js"
						}
					],
					"blob": {
						"attaches": {},
						"requires": [
							"harvester.net.Remote",
							"harvester.net.service.Console",
							"harvester.net.service.Harvester",
							"harvester.net.service.Library",
							"harvester.net.service.Profile",
							"harvester.net.service.Project",
							"harvester.net.service.Server",
							"lychee.codec.JSON"
						],
						"includes": [
							"lychee.net.Server"
						],
						"exports": "(lychee, global, attachments) => {\n\n\tconst _service = lychee.import('harvester.net.service');\n\tconst _Remote  = lychee.import('harvester.net.Remote');\n\tconst _Server  = lychee.import('lychee.net.Server');\n\tconst _JSON    = lychee.import('lychee.codec.JSON');\n\n\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tconst Composite = function(data) {\n\n\t\tlet states = Object.assign({\n\t\t\tcodec:    _JSON,\n\t\t\thost:     'localhost',\n\t\t\tport:     4848,\n\t\t\tprotocol: _Server.PROTOCOL.HTTP,\n\t\t\tremote:   _Remote\n\t\t}, data);\n\n\n\t\t_Server.call(this, states);\n\n\t\tstates = null;\n\n\n\n\t\t/*\n\t\t * INITIALIZATION\n\t\t */\n\n\t\tthis.bind('connect', remote => {\n\n\t\t\tremote.addService(new _service.Console({\n\t\t\t\tid: 'console',\n\t\t\t\ttunnel: remote\n\t\t\t}));\n\n\t\t\tremote.addService(new _service.Harvester({\n\t\t\t\tid: 'harvester',\n\t\t\t\ttunnel: remote\n\t\t\t}));\n\n\t\t\tremote.addService(new _service.Library({\n\t\t\t\tid: 'library',\n\t\t\t\ttunnel: remote\n\t\t\t}));\n\n\t\t\tremote.addService(new _service.Profile({\n\t\t\t\tid: 'profile',\n\t\t\t\ttunnel: remote\n\t\t\t}));\n\n\t\t\tremote.addService(new _service.Project({\n\t\t\t\tid: 'project',\n\t\t\t\ttunnel: remote\n\t\t\t}));\n\n\t\t\tremote.addService(new _service.Server({\n\t\t\t\tid: 'server',\n\t\t\t\ttunnel: remote\n\t\t\t}));\n\n\n\t\t\tremote.bind('receive', (payload, headers) => {\n\n\t\t\t\tlet method = headers['method'];\n\t\t\t\tif (method === 'OPTIONS') {\n\n\t\t\t\t\tremote.send({}, {\n\t\t\t\t\t\t'status':                       '200 OK',\n\t\t\t\t\t\t'access-control-allow-headers': 'Content-Type, X-Service-Id, X-Service-Method, X-Service-Event',\n\t\t\t\t\t\t'access-control-allow-origin':  '*',\n\t\t\t\t\t\t'access-control-allow-methods': 'GET, POST',\n\t\t\t\t\t\t'access-control-max-age':       '3600'\n\t\t\t\t\t});\n\n\t\t\t\t} else {\n\n\t\t\t\t\tremote.send({\n\t\t\t\t\t\t'message': 'Please go away. 凸(｀⌒´メ)凸'\n\t\t\t\t\t}, {\n\t\t\t\t\t\t'status': '404 Not Found'\n\t\t\t\t\t});\n\n\t\t\t\t}\n\n\t\t\t});\n\n\t\t}, this);\n\n\n\t\tthis.connect();\n\n\t};\n\n\n\tComposite.prototype = {\n\n\t\t/*\n\t\t * ENTITY API\n\t\t */\n\n\t\t// deserialize: function(blob) {},\n\n\t\tserialize: function() {\n\n\t\t\tlet data = _Server.prototype.serialize.call(this);\n\t\t\tdata['constructor'] = 'harvester.net.Admin';\n\n\n\t\t\treturn data;\n\n\t\t}\n\n\t};\n\n\n\treturn Composite;\n\n}"
					}
				},
				"harvester.net.Server": {
					"constructor": "lychee.Definition",
					"arguments": [
						{
							"id": "harvester.net.Server",
							"url": "/libraries/harvester/source/net/Server.js"
						}
					],
					"blob": {
						"attaches": {},
						"requires": [
							"harvester.net.Remote",
							"harvester.net.server.File",
							"harvester.net.server.Redirect"
						],
						"includes": [
							"lychee.net.Server"
						],
						"exports": "(lychee, global, attachments) => {\n\n\tconst _File     = lychee.import('harvester.net.server.File');\n\tconst _Redirect = lychee.import('harvester.net.server.Redirect');\n\tconst _Remote   = lychee.import('harvester.net.Remote');\n\tconst _Server   = lychee.import('lychee.net.Server');\n\tconst _CODEC    = {\n\t\tencode: data => data,\n\t\tdecode: data => data\n\t};\n\n\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tconst Composite = function(data) {\n\n\t\tlet states = Object.assign({\n\t\t\tcodec:    _CODEC,\n\t\t\tprotocol: _Server.PROTOCOL.HTTP,\n\t\t\tremote:   _Remote\n\t\t}, data);\n\n\n\t\t_Server.call(this, states);\n\n\t\tstates = null;\n\n\n\n\t\t/*\n\t\t * INITIALIZATION\n\t\t */\n\n\t\tthis.bind('connect', remote => {\n\n\t\t\tremote.bind('receive', function(payload, headers) {\n\n\t\t\t\tlet method = headers['method'];\n\t\t\t\tif (method === 'OPTIONS') {\n\n\t\t\t\t\tthis.send({}, {\n\t\t\t\t\t\t'status':                       '200 OK',\n\t\t\t\t\t\t'access-control-allow-headers': 'Content-Type',\n\t\t\t\t\t\t'access-control-allow-origin':  'http://localhost',\n\t\t\t\t\t\t'access-control-allow-methods': 'GET, POST',\n\t\t\t\t\t\t'access-control-max-age':       '3600'\n\t\t\t\t\t});\n\n\t\t\t\t} else {\n\n\t\t\t\t\tlet redirect = _Redirect.receive.call({ tunnel: this }, payload, headers);\n\t\t\t\t\tif (redirect === false) {\n\n\t\t\t\t\t\tlet file = _File.receive.call({ tunnel: this }, payload, headers);\n\t\t\t\t\t\tif (file === false) {\n\n\t\t\t\t\t\t\tthis.send('File not found.', {\n\t\t\t\t\t\t\t\t'status':       '404 Not Found',\n\t\t\t\t\t\t\t\t'content-type': 'text/plain; charset=utf-8'\n\t\t\t\t\t\t\t});\n\n\t\t\t\t\t\t}\n\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t});\n\n\t\t}, this);\n\n\n\t\tthis.connect();\n\n\t};\n\n\n\tComposite.prototype = {\n\n\t\t/*\n\t\t * ENTITY API\n\t\t */\n\n\t\t// deserialize: function(blob) {},\n\n\t\tserialize: function() {\n\n\t\t\tlet data = _Server.prototype.serialize.call(this);\n\t\t\tdata['constructor'] = 'harvester.net.Server';\n\n\n\t\t\treturn data;\n\n\t\t}\n\n\t};\n\n\n\treturn Composite;\n\n}"
					}
				},
				"harvester.Watcher": {
					"constructor": "lychee.Definition",
					"arguments": [
						{
							"id": "harvester.Watcher",
							"url": "/libraries/harvester/source/Watcher.js"
						}
					],
					"blob": {
						"attaches": {},
						"requires": [
							"harvester.data.Filesystem",
							"harvester.data.Project",
							"harvester.mod.Beautifier",
							"harvester.mod.Fertilizer",
							"harvester.mod.Harvester",
							"harvester.mod.Packager",
							"harvester.mod.Server",
							"harvester.mod.Strainer"
						],
						"exports": "(lychee, global, attachments) => {\n\n\tconst _Filesystem = lychee.import('harvester.data.Filesystem');\n\tconst _Project    = lychee.import('harvester.data.Project');\n\tconst _mod        = {\n\t\tBeautifier: lychee.import('harvester.mod.Beautifier'),\n\t\tFertilizer: lychee.import('harvester.mod.Fertilizer'),\n\t\tHarvester:  lychee.import('harvester.mod.Harvester'),\n\t\tPackager:   lychee.import('harvester.mod.Packager'),\n\t\tServer:     lychee.import('harvester.mod.Server'),\n\t\tStrainer:   lychee.import('harvester.mod.Strainer')\n\t};\n\n\n\n\t/*\n\t * HELPERS\n\t */\n\n\tconst _update_cache = function(silent) {\n\n\t\tsilent = silent === true;\n\n\n\t\t// Libraries\n\t\tlet libraries = this.filesystem.dir('/libraries').filter(v => /README\\.md/.test(v) === false).map(v => '/libraries/' + v);\n\n\t\t// Remove Libraries\n\t\tObject.keys(this.libraries).forEach(identifier => {\n\n\t\t\tlet index = libraries.indexOf(identifier);\n\t\t\tif (index === -1) {\n\n\t\t\t\tif (silent === false) {\n\t\t\t\t\tconsole.log('harvester.Watcher: Remove Library \"' + identifier + '\"');\n\t\t\t\t}\n\n\t\t\t\tlet server = this.libraries[identifier].server || null;\n\t\t\t\tif (server !== null) {\n\t\t\t\t\tserver.destroy();\n\t\t\t\t}\n\n\t\t\t\tdelete this.libraries[identifier];\n\n\t\t\t}\n\n\t\t});\n\n\t\t// Add Libraries\n\t\tlibraries.forEach(identifier => {\n\n\t\t\tlet check = this.libraries[identifier] || null;\n\t\t\tlet info1 = this.filesystem.info(identifier + '/lychee.pkg');\n\n\t\t\tif (check === null && (info1 !== null && info1.type === 'file')) {\n\n\t\t\t\tif (silent === false) {\n\t\t\t\t\tconsole.log('harvester.Watcher: Add Library \"' + identifier + '\"');\n\t\t\t\t}\n\n\t\t\t\tthis.libraries[identifier] = new _Project({\n\t\t\t\t\tidentifier: identifier\n\t\t\t\t});\n\n\t\t\t}\n\n\t\t});\n\n\n\n\t\t// Projects\n\t\tlet projects = this.filesystem.dir('/projects').filter(v => v !== 'README.md').map(v => '/projects/' + v);\n\n\t\t// Remove Projects\n\t\tObject.keys(this.projects).forEach(identifier => {\n\n\t\t\tlet index = projects.indexOf(identifier);\n\t\t\tif (index === -1) {\n\n\t\t\t\tif (silent === false) {\n\t\t\t\t\tconsole.log('harvester.Watcher: Remove Project \"' + identifier + '\"');\n\t\t\t\t}\n\n\t\t\t\tlet server = this.projects[identifier].server || null;\n\t\t\t\tif (server !== null) {\n\t\t\t\t\tserver.destroy();\n\t\t\t\t}\n\n\t\t\t\tdelete this.projects[identifier];\n\n\t\t\t}\n\n\t\t});\n\n\t\t// Add Projects\n\t\tprojects.forEach(identifier => {\n\n\t\t\tlet check = this.projects[identifier] || null;\n\t\t\tlet info1 = this.filesystem.info(identifier + '/index.html');\n\t\t\tlet info2 = this.filesystem.info(identifier + '/lychee.pkg');\n\n\t\t\tif (check === null && ((info1 !== null && info1.type === 'file') || (info2 !== null && info2.type === 'file'))) {\n\n\t\t\t\tif (silent === false) {\n\t\t\t\t\tconsole.log('harvester.Watcher: Add Project \"' + identifier + '\"');\n\t\t\t\t}\n\n\t\t\t\tthis.projects[identifier] = new _Project({\n\t\t\t\t\tidentifier: identifier\n\t\t\t\t});\n\n\t\t\t}\n\n\t\t});\n\n\t};\n\n\tconst _update_harvester = function(silent) {\n\n\t\tsilent = silent === true;\n\n\n\t\tlet Harvester = _mod.Harvester;\n\n\n\t\tlet sandbox = this.sandbox;\n\t\tif (sandbox === true) {\n\t\t\tHarvester = null;\n\t\t}\n\n\n\t\tif (Harvester !== null) {\n\n\t\t\tlet branch = 'master';\n\t\t\tlet check  = false;\n\t\t\tlet status = _mod.Harvester.can();\n\t\t\tif (status !== null) {\n\n\t\t\t\tbranch = status.branch || 'master';\n\n\t\t\t\tif (status.changes.length === 0 && status.ahead === 0) {\n\t\t\t\t\tcheck = true;\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\tif (check === true) {\n\n\t\t\t\tif (silent === false) {\n\n\t\t\t\t\tconsole.info('harvester.Watcher: Autonomous Software Updates enabled.');\n\t\t\t\t\tconsole.log('');\n\n\t\t\t\t}\n\n\t\t\t\t_mod.Harvester.process();\n\n\t\t\t} else {\n\n\t\t\t\tif (silent === false) {\n\n\t\t\t\t\tconsole.warn('harvester.Watcher: Autonomous Software Updates disabled.');\n\n\t\t\t\t\tif (status.ahead !== 0) {\n\t\t\t\t\t\tconsole.warn('harvester.Watcher: Local git branch \"' + branch + '\" is ahead of remote \"upstream\".');\n\t\t\t\t\t} else if (status.changes.length > 0) {\n\t\t\t\t\t\tconsole.warn('harvester.Watcher: Local uncommited changes cannot be transmitted to the cloud.');\n\t\t\t\t\t}\n\n\t\t\t\t\tconsole.log('');\n\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t} else {\n\n\t\t\tif (silent === false) {\n\t\t\t\tconsole.warn('harvester.Watcher: Autonomous Software Updates disabled.');\n\t\t\t\tconsole.log('');\n\t\t\t}\n\n\t\t}\n\n\t};\n\n\tconst _update_mods = function() {\n\n\t\t// XXX: Fertilizer disabled for performance reasons\n\t\t// let Fertilizer = _mod.Fertilizer;\n\t\tlet Beautifier = _mod.Beautifier;\n\t\tlet Fertilizer = null;\n\t\tlet Packager   = _mod.Packager;\n\t\tlet Server     = _mod.Server;\n\t\tlet Strainer   = _mod.Strainer;\n\n\n\t\tlet sandbox = this.sandbox;\n\t\tif (sandbox === true) {\n\n\t\t\tFertilizer = null;\n\t\t\tServer     = null;\n\t\t\tStrainer   = null;\n\n\t\t}\n\n\n\t\tfor (let lid in this.libraries) {\n\n\t\t\tlet library = this.libraries[lid];\n\t\t\tlet reasons = [];\n\n\t\t\tif (Packager !== null && Packager.can(library) === true) {\n\t\t\t\treasons = Packager.process(library);\n\t\t\t}\n\n\t\t\tif (Beautifier !== null && Beautifier.can(library) === true) {\n\t\t\t\tBeautifier.process(library);\n\t\t\t}\n\n\t\t\tif (Server !== null && Server.can(library) === true) {\n\t\t\t\tServer.process(library);\n\t\t\t}\n\n\n\t\t\tif (reasons.length > 0) {\n\n\t\t\t\tlet changed_source = reasons.find(p => p.startsWith('/source/files')) || null;\n\t\t\t\tif (changed_source !== null) {\n\n\t\t\t\t\tif (Strainer !== null && Strainer.can(library) === true) {\n\t\t\t\t\t\tStrainer.process(library);\n\t\t\t\t\t}\n\n\t\t\t\t\tif (Fertilizer !== null && Fertilizer.can(library) === true) {\n\t\t\t\t\t\tFertilizer.process(library);\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t}\n\n\t\tfor (let pid in this.projects) {\n\n\t\t\tlet project = this.projects[pid];\n\t\t\tlet reasons = [];\n\n\t\t\tif (Packager !== null && Packager.can(project) === true) {\n\t\t\t\treasons = Packager.process(project);\n\t\t\t}\n\n\t\t\tif (Beautifier !== null && Beautifier.can(project) === true) {\n\t\t\t\tBeautifier.process(project);\n\t\t\t}\n\n\t\t\tif (Server !== null && Server.can(project) === true) {\n\t\t\t\tServer.process(project);\n\t\t\t}\n\n\n\t\t\tif (reasons.length > 0) {\n\n\t\t\t\tlet changed_source = reasons.find(p => p.startsWith('/source/files')) || null;\n\t\t\t\tif (changed_source !== null) {\n\n\t\t\t\t\tif (Strainer !== null && Strainer.can(project) === true) {\n\t\t\t\t\t\tStrainer.process(project);\n\t\t\t\t\t}\n\n\t\t\t\t\tif (Fertilizer !== null && Fertilizer.can(project) === true) {\n\t\t\t\t\t\tFertilizer.process(project);\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t}\n\n\t};\n\n\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tconst Composite = function(main) {\n\n\t\tthis.filesystem = new _Filesystem();\n\t\tthis.libraries  = {};\n\t\tthis.projects   = {};\n\t\tthis.sandbox    = main.settings.sandbox === true;\n\n\t\t// Figure out if there's a cleaner way\n\t\tmain._libraries = this.libraries;\n\t\tmain._projects  = this.projects;\n\n\t};\n\n\tComposite.prototype = {\n\n\t\t/*\n\t\t * ENTITY API\n\t\t */\n\n\t\t// deserialize: function(blob) {},\n\n\t\tserialize: function() {\n\n\t\t\treturn {\n\t\t\t\t'constructor': 'harvester.Watcher',\n\t\t\t\t'arguments':   []\n\t\t\t};\n\n\t\t},\n\n\t\tinit: function() {\n\n\t\t\t_update_cache.call(this, true);\n\t\t\t_update_harvester.call(this);\n\n\n\t\t\t// XXX: Fertilizer disabled for performance reasons\n\t\t\t// let Fertilizer = _mod.Fertilizer;\n\t\t\tlet Beautifier = _mod.Beautifier;\n\t\t\tlet Packager   = _mod.Packager;\n\t\t\tlet Server     = _mod.Server;\n\t\t\tlet Strainer   = _mod.Strainer;\n\n\n\t\t\tlet sandbox = this.sandbox;\n\t\t\tif (sandbox === true) {\n\n\t\t\t\t// Fertilizer = null;\n\t\t\t\tServer     = null;\n\t\t\t\tStrainer   = null;\n\n\t\t\t}\n\n\n\t\t\tfor (let lid in this.libraries) {\n\n\t\t\t\tlet library = this.libraries[lid];\n\n\t\t\t\tif (Packager !== null && Packager.can(library) === true) {\n\t\t\t\t\tPackager.process(library);\n\t\t\t\t}\n\n\t\t\t\tif (Beautifier !== null && Beautifier.can(library) === true) {\n\t\t\t\t\tBeautifier.process(library);\n\t\t\t\t}\n\n\t\t\t\tif (Server !== null && Server.can(library) === true) {\n\t\t\t\t\tServer.process(library);\n\t\t\t\t}\n\n\t\t\t\tif (Strainer !== null && Strainer.can(library) === true) {\n\t\t\t\t\tStrainer.process(library);\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t\tfor (let pid in this.projects) {\n\n\t\t\t\tlet project = this.projects[pid];\n\n\t\t\t\tif (Packager !== null && Packager.can(project) === true) {\n\t\t\t\t\tPackager.process(project);\n\t\t\t\t}\n\n\t\t\t\tif (Beautifier !== null && Beautifier.can(project) === true) {\n\t\t\t\t\tBeautifier.process(project);\n\t\t\t\t}\n\n\t\t\t\tif (Server !== null && Server.can(project) === true) {\n\t\t\t\t\tServer.process(project);\n\t\t\t\t}\n\n\t\t\t\tif (Strainer !== null && Strainer.can(project) === true) {\n\t\t\t\t\tStrainer.process(project);\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\treturn true;\n\n\t\t},\n\n\t\tupdate: function() {\n\n\t\t\t_update_cache.call(this);\n\t\t\t_update_mods.call(this);\n\t\t\t_update_harvester.call(this, true);\n\n\t\t}\n\n\t};\n\n\n\treturn Composite;\n\n}"
					}
				},
				"lychee.net.Server": {
					"constructor": "lychee.Definition",
					"arguments": [
						{
							"id": "lychee.net.Server",
							"url": "/libraries/lychee/source/platform/node/net/Server.js"
						}
					],
					"blob": {
						"attaches": {},
						"tags": {
							"platform": "node"
						},
						"requires": [
							"lychee.Storage",
							"lychee.codec.JSON",
							"lychee.net.Remote"
						],
						"includes": [
							"lychee.event.Emitter"
						],
						"supports": "(lychee, global) => {\n\n\tif (typeof global.require === 'function') {\n\n\t\ttry {\n\n\t\t\tglobal.require('net');\n\t\t\treturn true;\n\n\t\t} catch (err) {\n\t\t}\n\n\t}\n\n\n\treturn false;\n\n}",
						"exports": "(lychee, global, attachments) => {\n\n\tconst _net     = global.require('net');\n\tconst _Emitter = lychee.import('lychee.event.Emitter');\n\tconst _JSON    = lychee.import('lychee.codec.JSON');\n\tconst _Remote  = lychee.import('lychee.net.Remote');\n\tconst _Storage = lychee.import('lychee.Storage');\n\tconst _storage = new _Storage({\n\t\tid:    'server',\n\t\ttype:  _Storage.TYPE.persistent,\n\t\tmodel: {\n\t\t\tid:   '[::ffff]:1337',\n\t\t\ttype: 'client',\n\t\t\thost: '::ffff',\n\t\t\tport: 1337\n\t\t}\n\t});\n\n\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tconst Composite = function(data) {\n\n\t\tlet states = Object.assign({}, data);\n\n\n\t\tthis.codec    = _JSON;\n\t\tthis.host     = null;\n\t\tthis.port     = 1337;\n\t\tthis.protocol = Composite.PROTOCOL.WS;\n\t\tthis.remote   = _Remote;\n\n\n\t\tthis.__isConnected = false;\n\t\tthis.__server      = null;\n\n\n\t\tthis.setCodec(states.codec);\n\t\tthis.setHost(states.host);\n\t\tthis.setPort(states.port);\n\t\tthis.setProtocol(states.protocol);\n\t\tthis.setRemote(states.remote);\n\n\n\t\t_Emitter.call(this);\n\n\t\tstates = null;\n\n\n\t\t/*\n\t\t * INITIALIZATION\n\t\t */\n\n\t\tthis.bind('connect', remote => {\n\n\t\t\tlet id  = (/:/g.test(remote.host) ? '[' + remote.host + ']' : remote.host) + ':' + remote.port;\n\t\t\tlet obj = _storage.create();\n\t\t\tif (obj !== null) {\n\n\t\t\t\tobj.id   = id;\n\t\t\t\tobj.type = 'client';\n\t\t\t\tobj.host = remote.host;\n\t\t\t\tobj.port = remote.port;\n\n\t\t\t\t_storage.write(id, obj);\n\n\t\t\t}\n\n\t\t}, this);\n\n\t\tthis.bind('disconnect', remote => {\n\n\t\t\tlet id  = (/:/g.test(remote.host) ? '[' + remote.host + ']' : remote.host) + ':' + remote.port;\n\t\t\tlet obj = _storage.read(id);\n\t\t\tif (obj !== null) {\n\t\t\t\t_storage.remove(id);\n\t\t\t}\n\n\t\t}, this);\n\n\t};\n\n\n\tComposite.PROTOCOL = {\n\t\tWS:   0,\n\t\tHTTP: 1,\n\t\tTCP:  2\n\t};\n\n\n\tComposite.prototype = {\n\n\t\t/*\n\t\t * ENTITY API\n\t\t */\n\n\t\t// deserialize: function(blob) {},\n\n\t\tserialize: function() {\n\n\t\t\tlet data = _Emitter.prototype.serialize.call(this);\n\t\t\tdata['constructor'] = 'lychee.net.Server';\n\n\t\t\tlet states = (data['arguments'][0] || {});\n\n\n\t\t\tif (this.codec !== _JSON)                    states.codec    = lychee.serialize(this.codec);\n\t\t\tif (this.host !== 'localhost')               states.host     = this.host;\n\t\t\tif (this.port !== 1337)                      states.port     = this.port;\n\t\t\tif (this.protocol !== Composite.PROTOCOL.WS) states.protocol = this.protocol;\n\t\t\tif (this.remote !== _Remote)                 states.remote   = lychee.serialize(this.remote);\n\n\n\t\t\tdata['arguments'][0] = states;\n\n\n\t\t\treturn data;\n\n\t\t},\n\n\n\n\t\t/*\n\t\t * CUSTOM API\n\t\t */\n\n\t\tconnect: function() {\n\n\t\t\tif (this.__isConnected === false) {\n\n\t\t\t\tif (lychee.debug === true) {\n\t\t\t\t\tconsole.log('lychee.net.Server: Connected to ' + this.host + ':' + this.port);\n\t\t\t\t}\n\n\n\t\t\t\tlet server = new _net.Server({\n\t\t\t\t\tallowHalfOpen:  true,\n\t\t\t\t\tpauseOnConnect: true\n\t\t\t\t});\n\n\t\t\t\tserver.on('connection', socket => {\n\n\t\t\t\t\tlet host   = socket.remoteAddress || socket.server._connectionKey.split(':')[1];\n\t\t\t\t\tlet port   = socket.remotePort    || socket.server._connectionKey.split(':')[2];\n\t\t\t\t\tlet remote = new this.remote({\n\t\t\t\t\t\tcodec:    this.codec,\n\t\t\t\t\t\thost:     host,\n\t\t\t\t\t\tport:     port,\n\t\t\t\t\t\tprotocol: this.protocol\n\t\t\t\t\t});\n\n\t\t\t\t\tthis.trigger('preconnect', [ remote ]);\n\n\t\t\t\t\tremote.bind('connect',    _ => this.trigger('connect', [ remote ]));\n\t\t\t\t\tremote.bind('disconnect', _ => this.trigger('disconnect', [ remote ]));\n\n\t\t\t\t\tremote.connect(socket);\n\n\t\t\t\t});\n\n\t\t\t\tserver.on('error', _ => server.close());\n\n\t\t\t\tserver.on('close', _ => {\n\t\t\t\t\tthis.__isConnected = false;\n\t\t\t\t\tthis.__server      = null;\n\t\t\t\t});\n\n\t\t\t\tserver.listen(this.port, this.host);\n\n\n\t\t\t\tthis.__server      = server;\n\t\t\t\tthis.__isConnected = true;\n\n\n\t\t\t\treturn true;\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t},\n\n\t\tdisconnect: function() {\n\n\t\t\tlet server = this.__server;\n\t\t\tif (server !== null) {\n\t\t\t\tserver.close();\n\t\t\t}\n\n\n\t\t\treturn true;\n\n\t\t},\n\n\n\n\t\t/*\n\t\t * TUNNEL API\n\t\t */\n\n\t\tsetCodec: function(codec) {\n\n\t\t\tcodec = lychee.interfaceof(_JSON, codec) ? codec : null;\n\n\n\t\t\tif (codec !== null) {\n\n\t\t\t\tlet oldcodec = this.codec;\n\t\t\t\tif (oldcodec !== codec) {\n\n\t\t\t\t\tthis.codec = codec;\n\n\n\t\t\t\t\tif (this.__isConnected === true) {\n\t\t\t\t\t\tthis.disconnect();\n\t\t\t\t\t\tthis.connect();\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\n\t\t\t\treturn true;\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t},\n\n\t\tsetHost: function(host) {\n\n\t\t\thost = typeof host === 'string' ? host : null;\n\n\n\t\t\tif (host !== null) {\n\n\t\t\t\tthis.host = host;\n\n\t\t\t\treturn true;\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t},\n\n\t\tsetPort: function(port) {\n\n\t\t\tport = typeof port === 'number' ? (port | 0) : null;\n\n\n\t\t\tif (port !== null) {\n\n\t\t\t\tthis.port = port;\n\n\t\t\t\treturn true;\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t},\n\n\t\tsetProtocol: function(protocol) {\n\n\t\t\tprotocol = lychee.enumof(Composite.PROTOCOL, protocol) ? protocol : null;\n\n\n\t\t\tif (protocol !== null) {\n\n\t\t\t\tif (this.protocol !== protocol) {\n\n\t\t\t\t\tthis.protocol = protocol;\n\n\n\t\t\t\t\tif (this.__isConnected === true) {\n\t\t\t\t\t\tthis.disconnect();\n\t\t\t\t\t\tthis.connect();\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\n\t\t\t\treturn true;\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t},\n\n\t\tsetRemote: function(remote) {\n\n\t\t\tremote = lychee.interfaceof(_Remote, remote) ? remote : null;\n\n\n\t\t\tif (remote !== null) {\n\n\t\t\t\tif (this.remote !== remote) {\n\n\t\t\t\t\tthis.remote = remote;\n\n\n\t\t\t\t\tif (this.__isConnected === true) {\n\t\t\t\t\t\tthis.disconnect();\n\t\t\t\t\t\tthis.connect();\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\n\t\t\t\treturn true;\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t}\n\n\t};\n\n\n\treturn Composite;\n\n}"
					}
				},
				"harvester.net.Remote": {
					"constructor": "lychee.Definition",
					"arguments": [
						{
							"id": "harvester.net.Remote",
							"url": "/libraries/harvester/source/net/Remote.js"
						}
					],
					"blob": {
						"attaches": {},
						"requires": [
							"lychee.codec.BENCODE",
							"lychee.codec.BITON",
							"lychee.codec.JSON"
						],
						"includes": [
							"lychee.net.Tunnel"
						],
						"exports": "(lychee, global, attachments) => {\n\n\tconst _Tunnel  = lychee.import('lychee.net.Tunnel');\n\tconst _BENCODE = lychee.import('lychee.codec.BENCODE');\n\tconst _BITON   = lychee.import('lychee.codec.BITON');\n\tconst _JSON    = lychee.import('lychee.codec.JSON');\n\n\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tconst Composite = function(data) {\n\n\t\tlet states = Object.assign({}, data);\n\n\n\t\tstates.type = 'remote';\n\n\t\t_Tunnel.call(this, states);\n\n\t\tstates = null;\n\n\t};\n\n\n\tComposite.prototype = {\n\n\t\t/*\n\t\t * ENTITY API\n\t\t */\n\n\t\t// deserialize: function(blob) {},\n\n\t\tserialize: function() {\n\n\t\t\tlet data = _Tunnel.prototype.serialize.call(this);\n\t\t\tdata['constructor'] = 'harvester.net.Remote';\n\n\n\t\t\treturn data;\n\n\t\t},\n\n\n\n\t\t/*\n\t\t * CUSTOM API\n\t\t */\n\n\t\treceive: function(payload, headers) {\n\n\t\t\tpayload = payload instanceof Buffer ? payload : null;\n\t\t\theaders = headers instanceof Object ? headers : {};\n\n\n\t\t\tlet host = headers['host'] || null;\n\t\t\tif (host !== null && payload !== null) {\n\n\t\t\t\tlet data = null;\n\t\t\t\tif (payload !== null) {\n\t\t\t\t\tdata = this.codec.decode(payload);\n\t\t\t\t}\n\n\t\t\t\tif (data !== null) {\n\t\t\t\t\tdata['@host'] = host;\n\t\t\t\t\tpayload = this.codec.encode(data);\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\tlet result = _Tunnel.prototype.receive.call(this, payload, headers);\n\t\t\tif (result === true) {\n\t\t\t\treturn true;\n\t\t\t}\n\n\n\t\t\treturn true;\n\n\t\t},\n\n\t\tsend: function(data, headers) {\n\n\t\t\t// XXX: data can be Object, Buffer or String\n\n\t\t\tdata    = data !== undefined        ? data    : null;\n\t\t\theaders = headers instanceof Object ? headers : {};\n\n\n\t\t\tif (data instanceof Object) {\n\n\t\t\t\theaders['access-control-allow-origin'] = '*';\n\t\t\t\theaders['content-control']             = 'no-transform';\n\n\n\t\t\t\tlet codec = this.codec;\n\t\t\t\tif (codec === _BENCODE) {\n\t\t\t\t\theaders['content-type'] = 'application/bencode; charset=utf-8';\n\t\t\t\t} else if (codec === _BITON) {\n\t\t\t\t\theaders['content-type'] = 'application/biton; charset=binary';\n\t\t\t\t} else if (codec === _JSON) {\n\t\t\t\t\theaders['content-type'] = 'application/json; charset=utf-8';\n\t\t\t\t}\n\n\n\t\t\t\tlet event = headers['event'] || null;\n\t\t\t\tif (event === 'error') {\n\t\t\t\t\theaders['status'] = '400 Bad Request';\n\t\t\t\t}\n\n\n\t\t\t\tif (/@plug|@unplug/g.test(headers.method) === false) {\n\n\t\t\t\t\tlet result = _Tunnel.prototype.send.call(this, data, headers);\n\t\t\t\t\tif (result === true) {\n\t\t\t\t\t\treturn true;\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t} else {\n\n\t\t\t\tlet payload = null;\n\n\t\t\t\tif (typeof data === 'string') {\n\t\t\t\t\tpayload = Buffer.from(data, 'utf8');\n\t\t\t\t} else if (data instanceof Buffer) {\n\t\t\t\t\tpayload = data;\n\t\t\t\t}\n\n\n\t\t\t\tif (payload instanceof Buffer) {\n\n\t\t\t\t\tthis.trigger('send', [ payload, headers ]);\n\n\t\t\t\t\treturn true;\n\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t}\n\n\t};\n\n\n\treturn Composite;\n\n}"
					}
				},
				"harvester.net.service.Console": {
					"constructor": "lychee.Definition",
					"arguments": [
						{
							"id": "harvester.net.service.Console",
							"url": "/libraries/harvester/source/net/service/Console.js"
						}
					],
					"blob": {
						"attaches": {},
						"includes": [
							"lychee.net.Service"
						],
						"exports": "(lychee, global, attachments) => {\n\n\tconst _Service = lychee.import('lychee.net.Service');\n\tconst _CACHE   = {};\n\n\n\n\t/*\n\t * HELPERS\n\t */\n\n\tconst _on_sync = function(data) {\n\n\t\tif (data instanceof Object) {\n\n\t\t\tfor (let prop in data) {\n\t\t\t\t_CACHE[prop] = data[prop];\n\t\t\t}\n\n\t\t}\n\n\t};\n\n\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tconst Composite = function(data) {\n\n\t\tlet states = Object.assign({}, data);\n\n\n\t\t_Service.call(this, states);\n\n\t\tstates = null;\n\n\n\n\t\t/*\n\t\t * INITIALIZATION: CLIENT\n\t\t */\n\n\t\tthis.bind('sync', _on_sync, this);\n\n\t};\n\n\n\tComposite.prototype = {\n\n\t\t/*\n\t\t * ENTITY API\n\t\t */\n\n\t\t// deserialize: function(blob) {},\n\n\t\tserialize: function() {\n\n\t\t\tlet data = _Service.prototype.serialize.call(this);\n\t\t\tdata['constructor'] = 'harvester.net.service.Console';\n\n\n\t\t\treturn data;\n\n\t\t},\n\n\n\n\t\t/*\n\t\t * CUSTOM API\n\t\t */\n\n\t\tindex: function() {\n\n\t\t\treturn this.send(lychee.serialize(console), {\n\t\t\t\tevent: 'sync'\n\t\t\t});\n\n\t\t},\n\n\t\tsync: function() {\n\n\t\t\tlet tunnel = this.tunnel;\n\t\t\tif (tunnel !== null) {\n\n\t\t\t\tif (tunnel.type === 'client') {\n\n\t\t\t\t\treturn this.send({}, {\n\t\t\t\t\t\tmethod: 'index'\n\t\t\t\t\t});\n\n\t\t\t\t} else if (tunnel.type === 'remote') {\n\n\t\t\t\t\treturn this.index();\n\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t}\n\n\t};\n\n\n\treturn Composite;\n\n}"
					}
				},
				"harvester.net.service.Harvester": {
					"constructor": "lychee.Definition",
					"arguments": [
						{
							"id": "harvester.net.service.Harvester",
							"url": "/libraries/harvester/source/net/service/Harvester.js"
						}
					],
					"blob": {
						"attaches": {},
						"requires": [
							"lychee.Storage"
						],
						"includes": [
							"lychee.net.Service"
						],
						"exports": "(lychee, global, attachments) => {\n\n\tconst _Service = lychee.import('lychee.net.Service');\n\tconst _Storage = lychee.import('lychee.Storage');\n\tlet   _ID      = null;\n\tconst _storage = new _Storage({\n\t\tid:    'harvester',\n\t\ttype:  _Storage.TYPE.persistent,\n\t\tmodel: {\n\t\t\tid:        '13371337',\n\t\t\ttype:      'harvester',\n\t\t\tnetworks:  [ '[::ffff]:1337'         ],\n\t\t\tlibraries: [ '/libraries/lychee'     ],\n\t\t\tprojects:  [ '/projects/boilerplate' ]\n\t\t}\n\t});\n\n\n\n\t/*\n\t * HELPERS\n\t */\n\n\tconst _generate_id = function() {\n\t\treturn ((Math.random() * 0x07fffffff) | 0).toString(16);\n\t};\n\n\tconst _serialize = function(harvester) {\n\n\t\treturn {\n\t\t\tid:        _ID || null,\n\t\t\tnetworks:  harvester.getNetworks(),\n\t\t\tlibraries: Object.keys(harvester._libraries),\n\t\t\tprojects:  Object.keys(harvester._projects)\n\t\t};\n\n\t};\n\n\tconst _on_connect = function(data) {\n\n\t\tlet id  = data.id || null;\n\t\tlet obj = null;\n\n\t\tif (id !== null) {\n\n\t\t\tobj = _storage.read(id);\n\n\t\t} else if (id === null) {\n\n\t\t\tid     = _generate_id();\n\t\t\tobj    = _storage.create();\n\t\t\tobj.id = id;\n\n\n\t\t\tthis.send({\n\t\t\t\tid: id\n\t\t\t}, {\n\t\t\t\tevent: 'handshake'\n\t\t\t});\n\n\t\t}\n\n\n\t\tif (id !== null && obj !== null) {\n\n\t\t\tobj.networks  = data.networks  || [];\n\t\t\tobj.libraries = data.libraries || [];\n\t\t\tobj.projects  = data.projects  || [];\n\n\t\t\t_storage.write(id, obj);\n\n\t\t}\n\n\t};\n\n\tconst _on_disconnect = function(data) {\n\n\t\tlet id  = data.id || null;\n\t\tlet obj = _storage.read(id);\n\t\tif (obj !== null) {\n\t\t\t_storage.remove(id);\n\t\t}\n\n\t};\n\n\tconst _on_handshake = function(data) {\n\n\t\tif (typeof data.id === 'string') {\n\t\t\t_ID = data.id;\n\t\t}\n\n\t};\n\n\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tconst Composite = function(data) {\n\n\t\tlet states = Object.assign({}, data);\n\n\n\t\t_Service.call(this, states);\n\n\t\tstates = null;\n\n\n\n\t\t/*\n\t\t * INITIALIZATION: CLIENT\n\t\t */\n\n\t\tthis.bind('handshake', _on_handshake, this);\n\n\n\n\t\t/*\n\t\t * INITIALIZATION: REMOTE\n\t\t */\n\n\t\tthis.bind('connect',     _on_connect,    this);\n\t\tthis.bind('disconnect',  _on_disconnect, this);\n\n\t};\n\n\n\tComposite.prototype = {\n\n\t\t/*\n\t\t * ENTITY API\n\t\t */\n\n\t\t// deserialize: function(blob) {},\n\n\t\tserialize: function() {\n\n\t\t\tlet data = _Service.prototype.serialize.call(this);\n\t\t\tdata['constructor'] = 'harvester.net.service.Harvester';\n\n\n\t\t\treturn data;\n\n\t\t},\n\n\n\n\t\t/*\n\t\t * CUSTOM API\n\t\t */\n\n\t\tconnect: function() {\n\n\t\t\tlet main = global.MAIN || null;\n\t\t\tif (main !== null) {\n\n\t\t\t\treturn this.send(_serialize(main), {\n\t\t\t\t\tevent: 'connect'\n\t\t\t\t});\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t},\n\n\t\tdisconnect: function() {\n\n\t\t\tlet main = global.MAIN || null;\n\t\t\tif (main !== null) {\n\n\t\t\t\treturn this.send({\n\t\t\t\t\tid: _ID\n\t\t\t\t}, {\n\t\t\t\t\tevent: 'disconnect'\n\t\t\t\t});\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t},\n\n\t\tindex: function() {\n\n\t\t\treturn this.send(_storage.filter(_ => true), {\n\t\t\t\tevent: 'sync'\n\t\t\t});\n\n\t\t},\n\n\t\tsync: function() {\n\t\t\treturn this.index();\n\t\t}\n\n\t};\n\n\n\treturn Composite;\n\n}"
					}
				},
				"harvester.net.service.Library": {
					"constructor": "lychee.Definition",
					"arguments": [
						{
							"id": "harvester.net.service.Library",
							"url": "/libraries/harvester/source/net/service/Library.js"
						}
					],
					"blob": {
						"attaches": {},
						"requires": [
							"harvester.mod.Server"
						],
						"includes": [
							"lychee.net.Service"
						],
						"exports": "(lychee, global, attachments) => {\n\n\tconst _Service = lychee.import('lychee.net.Service');\n\tconst _Server  = lychee.import('harvester.mod.Server');\n\tconst _CACHE   = {};\n\n\n\n\t/*\n\t * HELPERS\n\t */\n\n\tconst _serialize = function(library) {\n\n\t\tlet filesystem = null;\n\t\tlet server     = null;\n\t\tlet web        = false;\n\n\t\tif (library.filesystem !== null) {\n\n\t\t\tfilesystem = library.filesystem.root;\n\n\t\t\tlet check = library.filesystem.info('/index.html');\n\t\t\tif (check !== null && check.type === 'file') {\n\t\t\t\tweb = true;\n\t\t\t}\n\n\t\t}\n\n\t\tif (library.server !== null) {\n\n\t\t\tserver = {\n\t\t\t\thost: library.server.host,\n\t\t\t\tport: library.server.port\n\t\t\t};\n\n\t\t}\n\n\n\t\treturn {\n\t\t\tidentifier: library.identifier,\n\t\t\tdetails:    library.details || null,\n\t\t\tfilesystem: filesystem,\n\t\t\tserver:     server,\n\t\t\tharvester:  library.harvester,\n\t\t\tweb:        web\n\t\t};\n\n\t};\n\n\tconst _on_start = function(data) {\n\n\t\tlet identifier = data.identifier || null;\n\t\tlet main       = global.MAIN     || null;\n\n\t\tif (identifier !== null && main !== null) {\n\n\t\t\tlet library = main._libraries[identifier] || null;\n\t\t\tif (library !== null && library.server === null) {\n\n\t\t\t\t_Server.process(library);\n\n\t\t\t\tthis.accept('Server started (\"' + identifier + '\")');\n\n\t\t\t} else {\n\n\t\t\t\tthis.reject('No server (\"' + identifier + '\")');\n\n\t\t\t}\n\n\t\t} else {\n\n\t\t\tthis.reject('No Identifier');\n\n\t\t}\n\n\t};\n\n\tconst _on_stop = function(data) {\n\n\t\tlet identifier = data.identifier || null;\n\t\tlet main       = global.MAIN     || null;\n\n\t\tif (identifier !== null && main !== null) {\n\n\t\t\tlet library = main._libraries[identifier] || null;\n\t\t\tif (library !== null && library.server !== null) {\n\n\t\t\t\tlibrary.server.destroy();\n\t\t\t\tlibrary.server = null;\n\n\t\t\t\tthis.accept('Server stopped (\"' + identifier + '\")');\n\n\t\t\t} else {\n\n\t\t\t\tthis.reject('No Server (\"' + identifier + '\")');\n\n\t\t\t}\n\n\t\t} else {\n\n\t\t\tthis.reject('No Identifier');\n\n\t\t}\n\n\t};\n\n\tconst _on_sync = function(data) {\n\n\t\tif (data instanceof Array) {\n\n\t\t\tdata.forEach(object => {\n\t\t\t\t_CACHE[object.identifier] = object;\n\t\t\t});\n\n\t\t}\n\n\t};\n\n\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tconst Composite = function(data) {\n\n\t\tlet states = Object.assign({}, data);\n\n\n\t\t_Service.call(this, states);\n\n\t\tstates = null;\n\n\n\n\t\t/*\n\t\t * INITIALIZATION: CLIENT\n\t\t */\n\n\t\tthis.bind('sync', _on_sync, this);\n\n\n\n\t\t/*\n\t\t * INITIALIZATION: REMOTE\n\t\t */\n\n\t\tthis.bind('start', _on_start, this);\n\t\tthis.bind('stop',  _on_stop,  this);\n\n\t};\n\n\n\tComposite.prototype = {\n\n\t\t/*\n\t\t * ENTITY API\n\t\t */\n\n\t\t// deserialize: function(blob) {},\n\n\t\tserialize: function() {\n\n\t\t\tlet data = _Service.prototype.serialize.call(this);\n\t\t\tdata['constructor'] = 'harvester.net.service.Library';\n\n\n\t\t\treturn data;\n\n\t\t},\n\n\n\n\t\t/*\n\t\t * CUSTOM API\n\t\t */\n\n\t\tindex: function() {\n\n\t\t\tlet main = global.MAIN || null;\n\t\t\tif (main !== null) {\n\n\t\t\t\treturn this.send(Object.values(main._libraries).map(_serialize), {\n\t\t\t\t\tevent: 'sync'\n\t\t\t\t});\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t},\n\n\t\tsync: function() {\n\n\t\t\tlet tunnel = this.tunnel;\n\t\t\tif (tunnel !== null) {\n\n\t\t\t\tif (tunnel.type === 'client') {\n\n\t\t\t\t\treturn this.send({}, {\n\t\t\t\t\t\tmethod: 'index'\n\t\t\t\t\t});\n\n\t\t\t\t} else if (tunnel.type === 'remote') {\n\n\t\t\t\t\treturn this.index();\n\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t}\n\n\t};\n\n\n\treturn Composite;\n\n}"
					}
				},
				"harvester.net.service.Profile": {
					"constructor": "lychee.Definition",
					"arguments": [
						{
							"id": "harvester.net.service.Profile",
							"url": "/libraries/harvester/source/net/service/Profile.js"
						}
					],
					"blob": {
						"attaches": {},
						"requires": [
							"harvester.data.Filesystem",
							"lychee.codec.JSON"
						],
						"includes": [
							"lychee.net.Service"
						],
						"exports": "(lychee, global, attachments) => {\n\n\tconst _Filesystem = lychee.import('harvester.data.Filesystem');\n\tconst _Service    = lychee.import('lychee.net.Service');\n\tconst _CACHE      = {};\n\tconst _FILESYSTEM = new _Filesystem({\n\t\troot: '/libraries/harvester/profiles'\n\t});\n\tconst _JSON       = lychee.import('lychee.codec.JSON');\n\n\n\n\t/*\n\t * FEATURE DETECTION\n\t */\n\n\t(function(cache, filesystem) {\n\n\t\tlet identifiers = filesystem.dir('/').map(path => path.split('.').slice(0, -1).join('.'));\n\t\tif (identifiers.length > 0) {\n\n\t\t\tidentifiers.forEach(identifier => {\n\n\t\t\t\tlet profile = filesystem.read('/' + identifier + '.json');\n\t\t\t\tif (profile !== null) {\n\t\t\t\t\tcache[identifier] = _JSON.decode(profile);\n\t\t\t\t\tcache[identifier].identifier = identifier;\n\t\t\t\t}\n\n\t\t\t});\n\n\t\t}\n\n\t})(_CACHE, _FILESYSTEM);\n\n\n\n\t/*\n\t * HELPERS\n\t */\n\n\tconst _save_profile = function(profile) {\n\n\t\tlet path = '/' + profile.identifier + '.json';\n\t\tlet data = _JSON.encode(profile);\n\n\t\tif (data !== null) {\n\n\t\t\t_FILESYSTEM.write(path, data);\n\n\t\t\treturn true;\n\n\t\t}\n\n\n\t\treturn false;\n\n\t};\n\n\tconst _serialize = function(profile) {\n\n\t\treturn {\n\t\t\tidentifier: profile.identifier || '',\n\t\t\thost:       profile.host       || 'localhost',\n\t\t\tport:       profile.port       || 8080,\n\t\t\tdebug:      profile.debug      || false\n\t\t};\n\n\t};\n\n\tconst _on_save = function(data) {\n\n\t\tlet identifier = data.identifier || null;\n\t\tif (identifier !== null) {\n\n\t\t\tlet profile = _CACHE[identifier] || null;\n\t\t\tif (profile !== null) {\n\n\t\t\t\tprofile.identifier = identifier;\n\t\t\t\tprofile.host       = data.host  || 'localhost';\n\t\t\t\tprofile.port       = data.port  || 8080;\n\t\t\t\tprofile.debug      = data.debug || false;\n\n\t\t\t\t_save_profile(profile);\n\n\t\t\t\tthis.accept('Profile updated (\"' + identifier + '\")');\n\n\t\t\t} else {\n\n\t\t\t\tthis.reject('No profile (\"' + identifier + '\")');\n\n\t\t\t}\n\n\t\t} else {\n\n\t\t\tthis.reject('No identifier');\n\n\t\t}\n\n\t};\n\n\tconst _on_sync = function(data) {\n\n\t\tif (data instanceof Array) {\n\n\t\t\tdata.forEach(object => {\n\t\t\t\t_CACHE[object.identifier] = object;\n\t\t\t});\n\n\t\t}\n\n\t};\n\n\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tconst Composite = function(data) {\n\n\t\tlet states = Object.assign({}, data);\n\n\n\t\t_Service.call(this, states);\n\n\t\tstates = null;\n\n\n\n\t\t/*\n\t\t * INITIALIZATION: CLIENT\n\t\t */\n\n\t\tthis.bind('sync', _on_sync, this);\n\n\n\n\t\t/*\n\t\t * INITIALIZATION: REMOTE\n\t\t */\n\n\t\tthis.bind('save', _on_save, this);\n\n\t};\n\n\n\tComposite.prototype = {\n\n\t\t/*\n\t\t * ENTITY API\n\t\t */\n\n\t\t// deserialize: function(blob) {},\n\n\t\tserialize: function() {\n\n\t\t\tlet data = _Service.prototype.serialize.call(this);\n\t\t\tdata['constructor'] = 'harvester.net.service.Profile';\n\n\n\t\t\treturn data;\n\n\t\t},\n\n\n\n\t\t/*\n\t\t * CUSTOM API\n\t\t */\n\n\t\tindex: function() {\n\n\t\t\treturn this.send(Object.values(_CACHE).map(_serialize), {\n\t\t\t\tevent: 'sync'\n\t\t\t});\n\n\t\t},\n\n\t\tsave: function(data) {\n\n\t\t\tdata = data instanceof Object ? data : null;\n\n\n\t\t\tif (data !== null) {\n\n\t\t\t\tlet profile = {\n\t\t\t\t\tidentifier: typeof data.identifier === 'string' ? data.identifier : null,\n\t\t\t\t\thost:       typeof data.host === 'string'       ? data.host       : null,\n\t\t\t\t\tport:       typeof data.port === 'string'       ? data.port       : null,\n\t\t\t\t\tdebug:      data.debug   === true\n\t\t\t\t};\n\n\t\t\t\tif (profile.identifier !== null && profile.host !== null && profile.port !== null) {\n\n\t\t\t\t\treturn this.send(profile, {\n\t\t\t\t\t\tevent: 'save'\n\t\t\t\t\t});\n\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t},\n\n\t\tsync: function() {\n\n\t\t\tlet tunnel = this.tunnel;\n\t\t\tif (tunnel !== null) {\n\n\t\t\t\tif (tunnel.type === 'client') {\n\n\t\t\t\t\treturn this.send({}, {\n\t\t\t\t\t\tmethod: 'index'\n\t\t\t\t\t});\n\n\t\t\t\t} else if (tunnel.type === 'remote') {\n\n\t\t\t\t\treturn this.index();\n\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t}\n\n\t};\n\n\n\treturn Composite;\n\n}"
					}
				},
				"harvester.net.service.Project": {
					"constructor": "lychee.Definition",
					"arguments": [
						{
							"id": "harvester.net.service.Project",
							"url": "/libraries/harvester/source/net/service/Project.js"
						}
					],
					"blob": {
						"attaches": {},
						"requires": [
							"harvester.mod.Server"
						],
						"includes": [
							"lychee.net.Service"
						],
						"exports": "(lychee, global, attachments) => {\n\n\tconst _Service = lychee.import('lychee.net.Service');\n\tconst _Server  = lychee.import('harvester.mod.Server');\n\tconst _CACHE   = {};\n\n\n\n\t/*\n\t * HELPERS\n\t */\n\n\tconst _serialize = function(project) {\n\n\t\tlet filesystem = null;\n\t\tlet server     = null;\n\t\tlet web        = false;\n\n\t\tif (project.filesystem !== null) {\n\n\t\t\tfilesystem = project.filesystem.root;\n\n\t\t\tlet check = project.filesystem.info('/index.html');\n\t\t\tif (check !== null && check.type === 'file') {\n\t\t\t\tweb = true;\n\t\t\t}\n\n\t\t}\n\n\t\tif (project.server !== null) {\n\n\t\t\tserver = {\n\t\t\t\thost: project.server.host,\n\t\t\t\tport: project.server.port\n\t\t\t};\n\n\t\t}\n\n\n\t\treturn {\n\t\t\tidentifier: project.identifier,\n\t\t\tdetails:    project.details || null,\n\t\t\tfilesystem: filesystem,\n\t\t\tserver:     server,\n\t\t\tharvester:  project.harvester,\n\t\t\tweb:        web\n\t\t};\n\n\t};\n\n\tconst _on_start = function(data) {\n\n\t\tlet identifier = data.identifier || null;\n\t\tlet main       = global.MAIN     || null;\n\n\t\tif (identifier !== null && main !== null) {\n\n\t\t\tlet project = main._projects[identifier] || null;\n\t\t\tif (project !== null && project.server === null) {\n\n\t\t\t\t_Server.process(project);\n\n\t\t\t\tthis.accept('Server started (\"' + identifier + '\")');\n\n\t\t\t} else {\n\n\t\t\t\tthis.reject('No Server (\"' + identifier + '\")');\n\n\t\t\t}\n\n\t\t} else {\n\n\t\t\tthis.reject('No Identifier');\n\n\t\t}\n\n\t};\n\n\tconst _on_stop = function(data) {\n\n\t\tlet identifier = data.identifier || null;\n\t\tlet main       = global.MAIN     || null;\n\n\t\tif (identifier !== null && main !== null) {\n\n\t\t\tlet project = main._projects[identifier] || null;\n\t\t\tif (project !== null && project.server !== null) {\n\n\t\t\t\tproject.server.destroy();\n\t\t\t\tproject.server = null;\n\n\t\t\t\tthis.accept('Server stopped (\"' + identifier + '\")');\n\n\t\t\t} else {\n\n\t\t\t\tthis.reject('No Server (\"' + identifier + '\")');\n\n\t\t\t}\n\n\t\t} else {\n\n\t\t\tthis.reject('No Identifier');\n\n\t\t}\n\n\t};\n\n\tconst _on_sync = function(data) {\n\n\t\tif (data instanceof Array) {\n\n\t\t\tdata.forEach(object => {\n\t\t\t\t_CACHE[object.identifier] = object;\n\t\t\t});\n\n\t\t}\n\n\t};\n\n\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tconst Composite = function(data) {\n\n\t\tlet states = Object.assign({}, data);\n\n\n\t\t_Service.call(this, states);\n\n\t\tstates = null;\n\n\n\n\t\t/*\n\t\t * INITIALIZATION: CLIENT\n\t\t */\n\n\t\tthis.bind('sync', _on_sync, this);\n\n\n\n\t\t/*\n\t\t * INITIALIZATION: REMOTE\n\t\t */\n\n\t\tthis.bind('start', _on_start, this);\n\t\tthis.bind('stop',  _on_stop,  this);\n\n\t};\n\n\n\tComposite.prototype = {\n\n\t\t/*\n\t\t * ENTITY API\n\t\t */\n\n\t\t// deserialize: function(blob) {},\n\n\t\tserialize: function() {\n\n\t\t\tlet data = _Service.prototype.serialize.call(this);\n\t\t\tdata['constructor'] = 'harvester.net.service.Project';\n\n\n\t\t\treturn data;\n\n\t\t},\n\n\n\n\t\t/*\n\t\t * CUSTOM API\n\t\t */\n\n\t\tindex: function() {\n\n\t\t\tlet main = global.MAIN || null;\n\t\t\tif (main !== null) {\n\n\t\t\t\treturn this.send(Object.values(main._projects).map(_serialize), {\n\t\t\t\t\tevent: 'sync'\n\t\t\t\t});\n\n\t\t\t}\n\n\t\t},\n\n\t\tsync: function() {\n\n\t\t\tlet tunnel = this.tunnel;\n\t\t\tif (tunnel !== null) {\n\n\t\t\t\tif (tunnel.type === 'client') {\n\n\t\t\t\t\treturn this.send({}, {\n\t\t\t\t\t\tmethod: 'index'\n\t\t\t\t\t});\n\n\t\t\t\t} else if (tunnel.type === 'remote') {\n\n\t\t\t\t\treturn this.index();\n\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t}\n\n\t};\n\n\n\treturn Composite;\n\n}"
					}
				},
				"harvester.net.service.Server": {
					"constructor": "lychee.Definition",
					"arguments": [
						{
							"id": "harvester.net.service.Server",
							"url": "/libraries/harvester/source/net/service/Server.js"
						}
					],
					"blob": {
						"attaches": {},
						"includes": [
							"lychee.net.Service"
						],
						"exports": "(lychee, global, attachments) => {\n\n\tconst _Service = lychee.import('lychee.net.Service');\n\n\n\n\t/*\n\t * HELPERS\n\t */\n\n\tconst _serialize_remotes = function(project) {\n\n\t\tlet remotes = [];\n\n\t\tlet info = project.filesystem.info('/lychee.store');\n\t\tif (info !== null) {\n\n\t\t\tlet database = JSON.parse(project.filesystem.read('/lychee.store'));\n\t\t\tif (database instanceof Object) {\n\n\t\t\t\tif (database['server'] instanceof Object) {\n\n\t\t\t\t\tlet objects = database['server']['@objects'] || null;\n\t\t\t\t\tif (objects instanceof Object) {\n\n\t\t\t\t\t\tremotes = Object.values(objects).map(remote => ({\n\t\t\t\t\t\t\tid:   remote.id,\n\t\t\t\t\t\t\ttype: remote.type,\n\t\t\t\t\t\t\thost: remote.host,\n\t\t\t\t\t\t\tport: remote.port\n\t\t\t\t\t\t}));\n\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t}\n\n\t\treturn remotes;\n\n\t};\n\n\tconst _serialize = function(project) {\n\n\t\tproject = project instanceof Object ? project : null;\n\n\n\t\tif (project !== null) {\n\n\t\t\tlet main        = global.MAIN || null;\n\t\t\tlet remotes     = _serialize_remotes(project);\n\t\t\tlet server_host = null;\n\t\t\tlet server_port = null;\n\n\t\t\tif (project.server !== null) {\n\t\t\t\tserver_host = project.server.host;\n\t\t\t\tserver_port = project.server.port;\n\t\t\t}\n\n\n\t\t\tif (main !== null && server_host === null) {\n\t\t\t\tserver_host = main.server.host;\n\t\t\t}\n\n\t\t\tif (server_host === null) {\n\t\t\t\tserver_host = 'localhost';\n\t\t\t}\n\n\n\t\t\treturn {\n\t\t\t\tidentifier: project.identifier,\n\t\t\t\thost:       server_host,\n\t\t\t\tport:       server_port,\n\t\t\t\tremotes:    remotes\n\t\t\t};\n\n\t\t}\n\n\n\t\treturn null;\n\n\t};\n\n\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tconst Composite = function(data) {\n\n\t\tlet states = Object.assign({}, data);\n\n\n\t\t_Service.call(this, states);\n\n\t\tstates = null;\n\n\t};\n\n\n\tComposite.prototype = {\n\n\t\t/*\n\t\t * ENTITY API\n\t\t */\n\n\t\t// deserialize: function(blob) {},\n\n\t\tserialize: function() {\n\n\t\t\tlet data = _Service.prototype.serialize.call(this);\n\t\t\tdata['constructor'] = 'harvester.net.service.Server';\n\n\n\t\t\treturn data;\n\n\t\t},\n\n\n\n\t\t/*\n\t\t * CUSTOM API\n\t\t */\n\n\t\tindex: function(data) {\n\n\t\t\tdata = data instanceof Object ? data : null;\n\n\n\t\t\tif (data !== null) {\n\n\t\t\t\tlet host = data['@host'] || null;\n\t\t\t\tif (host !== null) {\n\n\t\t\t\t\tif (host.endsWith(':4848')) {\n\t\t\t\t\t\thost = host.substr(0, host.length - 5);\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\n\t\t\t\tlet main = global.MAIN || null;\n\t\t\t\tif (main !== null) {\n\n\t\t\t\t\tlet all       = [];\n\t\t\t\t\tlet projects  = Object.values(main._projects);\n\t\t\t\t\tlet libraries = Object.values(main._libraries);\n\n\t\t\t\t\tfor (let p = 0, pl = projects.length; p < pl; p++) {\n\t\t\t\t\t\tall.push(projects[p]);\n\t\t\t\t\t}\n\n\t\t\t\t\tfor (let l = 0, ll = libraries.length; l < ll; l++) {\n\t\t\t\t\t\tall.push(libraries[l]);\n\t\t\t\t\t}\n\n\n\t\t\t\t\tall.forEach(project => {\n\t\t\t\t\t\tproject.host = project.host !== 'localhost' ? project.host : host;\n\t\t\t\t\t});\n\n\n\t\t\t\t\treturn this.send(all.map(_serialize), {\n\t\t\t\t\t\tevent: 'sync'\n\t\t\t\t\t});\n\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t},\n\n\t\tconnect: function(data) {\n\n\t\t\tdata = data instanceof Object ? data : null;\n\n\n\t\t\tif (data !== null) {\n\n\t\t\t\tlet host = data['@host'] || null;\n\t\t\t\tif (host !== null) {\n\n\t\t\t\t\tif (host.endsWith(':4848')) {\n\t\t\t\t\t\thost = host.substr(0, host.length - 5);\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\n\t\t\t\tlet identifier = data.identifier || null;\n\t\t\t\tlet main       = global.MAIN     || null;\n\t\t\t\tif (identifier !== null && main !== null) {\n\n\t\t\t\t\tlet project = _serialize(main._libraries[identifier] || main._projects[identifier]);\n\t\t\t\t\tif (project !== null) {\n\n\t\t\t\t\t\tproject.host = project.host !== 'localhost' ? project.host : host;\n\n\t\t\t\t\t\treturn this.send(project, {\n\t\t\t\t\t\t\tevent: 'connect'\n\t\t\t\t\t\t});\n\n\t\t\t\t\t} else {\n\n\t\t\t\t\t\tthis.reject('No Server (\"' + identifier + '\")');\n\n\t\t\t\t\t}\n\n\t\t\t\t} else {\n\n\t\t\t\t\tthis.reject('No Identifier');\n\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t}\n\n\t};\n\n\n\treturn Composite;\n\n}"
					}
				},
				"harvester.net.server.File": {
					"constructor": "lychee.Definition",
					"arguments": [
						{
							"id": "harvester.net.server.File",
							"url": "/libraries/harvester/source/net/server/File.js"
						}
					],
					"blob": {
						"attaches": {},
						"requires": [
							"harvester.data.Filesystem"
						],
						"exports": "(lychee, global, attachments) => {\n\n\tconst _Filesystem = lychee.import('harvester.data.Filesystem');\n\tconst _MIME       = {\n\t\t'default':  { binary: true,  type: 'application/octet-stream'      },\n\t\t'appcache': { binary: false, type: 'text/cache-manifest'           },\n\t\t'css':      { binary: false, type: 'text/css'                      },\n\t\t'env':      { binary: false, type: 'application/json'              },\n\t\t'eot':      { binary: false, type: 'application/vnd.ms-fontobject' },\n\t\t'gz':       { binary: true,  type: 'application/x-gzip'            },\n\t\t'fnt':      { binary: false, type: 'application/json'              },\n\t\t'html':     { binary: false, type: 'text/html'                     },\n\t\t'ico':      { binary: true,  type: 'image/x-icon'                  },\n\t\t'jpg':      { binary: true,  type: 'image/jpeg'                    },\n\t\t'js':       { binary: false, type: 'application/javascript'        },\n\t\t'json':     { binary: false, type: 'application/json'              },\n\t\t'md':       { binary: false, type: 'text/x-markdown'               },\n\t\t'mf':       { binary: false, type: 'text/cache-manifest'           },\n\t\t'mp3':      { binary: true,  type: 'audio/mp3'                     },\n\t\t'ogg':      { binary: true,  type: 'application/ogg'               },\n\t\t'pkg':      { binary: false, type: 'application/json'              },\n\t\t'store':    { binary: false, type: 'application/json'              },\n\t\t'tar':      { binary: true,  type: 'application/x-tar'             },\n\t\t'ttf':      { binary: false, type: 'application/x-font-truetype'   },\n\t\t'txt':      { binary: false, type: 'text/plain'                    },\n\t\t'png':      { binary: true,  type: 'image/png'                     },\n\t\t'svg':      { binary: true,  type: 'image/svg+xml'                 },\n\t\t'woff':     { binary: true,  type: 'application/font-woff'         },\n\t\t'woff2':    { binary: true,  type: 'application/font-woff'         },\n\t\t'xml':      { binary: false, type: 'text/xml'                      },\n\t\t'zip':      { binary: true,  type: 'application/zip'               }\n\t};\n\n\tconst _GUIDES_PROJECT = {\n\t\tidentifier: '/guides',\n\t\tfilesystem: new _Filesystem({\n\t\t\troot: '/guides'\n\t\t})\n\t};\n\tconst _PUBLIC_PROJECT = {\n\t\tidentifier: '/libraries/harvester/public',\n\t\tfilesystem: new _Filesystem({\n\t\t\troot: '/libraries/harvester/public'\n\t\t})\n\t};\n\n\n\n\t/*\n\t * HELPERS\n\t */\n\n\tconst _get_headers = function(info, mime, custom) {\n\n\t\tcustom = custom instanceof Object ? custom : null;\n\n\n\t\tlet headers = {\n\t\t\t'status':          '200 OK',\n\t\t\t'e-tag':           '\"' + info.length + '-' + Date.parse(info.mtime) + '\"',\n\t\t\t'last-modified':   new Date(info.mtime).toUTCString(),\n\t\t\t'content-control': 'no-transform',\n\t\t\t'content-type':    mime.type,\n\t\t\t'expires':         new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toUTCString(),\n\t\t\t'vary':            'Accept-Encoding',\n\t\t\t'@binary':         mime.binary\n\t\t};\n\n\n\t\tif (custom !== null) {\n\n\t\t\tfor (let c in custom) {\n\t\t\t\theaders['@' + c] = custom[c];\n\t\t\t}\n\n\t\t}\n\n\n\t\tif (mime.type.startsWith('text')) {\n\t\t\theaders['content-type'] = mime.type + '; charset=utf-8';\n\t\t}\n\n\n\t\treturn headers;\n\n\t};\n\n\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tconst Module = {\n\n\t\t/*\n\t\t * MODULE API\n\t\t */\n\n\t\t// deserialize: function(blob) {},\n\n\t\tserialize: function() {\n\n\t\t\treturn {\n\t\t\t\t'reference': 'harvester.net.server.File',\n\t\t\t\t'arguments': []\n\t\t\t};\n\n\t\t},\n\n\n\n\t\t/*\n\t\t * CUSTOM API\n\t\t */\n\n\t\treceive: function(payload, headers) {\n\n\t\t\tpayload = payload instanceof Buffer ? payload : null;\n\t\t\theaders = headers instanceof Object ? headers : {};\n\n\n\t\t\tlet identifier = null;\n\t\t\tlet info       = null;\n\t\t\tlet path       = null;\n\t\t\tlet project    = null;\n\t\t\tlet tunnel     = this.tunnel;\n\n\t\t\tlet url = headers['url'];\n\t\t\tif (url.includes('?')) {\n\t\t\t\turl = url.split('?')[0];\n\t\t\t}\n\n\t\t\tlet mime = _MIME[url.split('.').pop()] || _MIME['default'];\n\n\t\t\tif (url.startsWith('/libraries')) {\n\n\t\t\t\t// /libraries/lychee/*\n\n\t\t\t\tidentifier = url.split('/').slice(0, 3).join('/');\n\t\t\t\tpath       = '/' + url.split('/').slice(3).join('/');\n\t\t\t\tproject    = lychee.import('MAIN')._libraries[identifier] || null;\n\n\n\t\t\t} else if (url.startsWith('/projects')) {\n\n\t\t\t\t// /projects/boilerplate/*\n\n\t\t\t\tidentifier = url.split('/').slice(0, 3).join('/');\n\t\t\t\tpath       = '/' + url.split('/').slice(3).join('/');\n\t\t\t\tproject    = lychee.import('MAIN')._projects[identifier] || null;\n\n\t\t\t} else if (url.startsWith('/guides')) {\n\n\t\t\t\t// /guides/software/lycheejs-breeder.md\n\n\t\t\t\tidentifier = null;\n\t\t\t\tpath       = '/' + url.split('/').slice(2).join('/');\n\t\t\t\tproject    = _GUIDES_PROJECT;\n\n\t\t\t} else {\n\n\t\t\t\t// /favicon.ico /index.html\n\n\t\t\t\tidentifier = null;\n\t\t\t\tpath       = url;\n\t\t\t\tproject    = _PUBLIC_PROJECT;\n\n\t\t\t}\n\n\n\t\t\tif (project !== null) {\n\t\t\t\tinfo = project.filesystem.info(path);\n\t\t\t}\n\n\n\t\t\tif (project !== null && info !== null && info.type === 'file') {\n\n\t\t\t\tlet custom = null;\n\n\t\t\t\tif (path.startsWith('/build/') && path.endsWith('.js')) {\n\n\t\t\t\t\tlet check = project.filesystem.info(path + '.map');\n\t\t\t\t\tif (check !== null && check.type === 'file') {\n\t\t\t\t\t\tcustom = {\n\t\t\t\t\t\t\t'sourcemap': url + '.map'\n\t\t\t\t\t\t};\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\n\t\t\t\tlet timestamp = headers['if-modified-since'] || null;\n\t\t\t\tif (timestamp !== null) {\n\n\t\t\t\t\tlet diff = info.mtime > new Date(timestamp);\n\t\t\t\t\tif (diff === false) {\n\n\t\t\t\t\t\ttunnel.send('', {\n\t\t\t\t\t\t\t'status':        '304 Not Modified',\n\t\t\t\t\t\t\t'last-modified': info.mtime.toUTCString()\n\t\t\t\t\t\t});\n\n\t\t\t\t\t\treturn true;\n\n\t\t\t\t\t} else {\n\n\t\t\t\t\t\tproject.filesystem.read(path, payload => {\n\t\t\t\t\t\t\ttunnel.send(payload, _get_headers(info, mime, custom));\n\t\t\t\t\t\t});\n\n\t\t\t\t\t\treturn true;\n\n\t\t\t\t\t}\n\n\t\t\t\t} else {\n\n\t\t\t\t\tproject.filesystem.read(path, payload => {\n\t\t\t\t\t\ttunnel.send(payload, _get_headers(info, mime, custom));\n\t\t\t\t\t});\n\n\n\t\t\t\t\treturn true;\n\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t}\n\n\t};\n\n\n\treturn Module;\n\n}"
					}
				},
				"harvester.net.server.Redirect": {
					"constructor": "lychee.Definition",
					"arguments": [
						{
							"id": "harvester.net.server.Redirect",
							"url": "/libraries/harvester/source/net/server/Redirect.js"
						}
					],
					"blob": {
						"attaches": {},
						"exports": "(lychee, global, attachments) => {\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tconst Module = {\n\n\t\t/*\n\t\t * MODULE API\n\t\t */\n\n\t\t// deserialize: function(blob) {},\n\n\t\tserialize: function() {\n\n\t\t\treturn {\n\t\t\t\t'reference': 'harvester.net.server.Redirect',\n\t\t\t\t'arguments': []\n\t\t\t};\n\n\t\t},\n\n\n\n\t\t/*\n\t\t * CUSTOM API\n\t\t */\n\n\t\treceive: function(payload, headers) {\n\n\t\t\tpayload = payload instanceof Buffer ? payload : null;\n\t\t\theaders = headers instanceof Object ? headers : {};\n\n\n\t\t\tlet tunnel = this.tunnel;\n\t\t\tlet url    = headers['url'];\n\n\t\t\tif (url.includes('?')) {\n\t\t\t\turl = url.split('?')[0];\n\t\t\t}\n\n\t\t\t// Multi-project mode /index.html\n\t\t\tif (url === '/') {\n\n\t\t\t\ttunnel.send('SHIT', {\n\t\t\t\t\t'status':   '301 Moved Permanently',\n\t\t\t\t\t'location': '/index.html'\n\t\t\t\t});\n\n\t\t\t\treturn true;\n\n\n\t\t\t// Multi-project mode /projects/*\n\t\t\t} else if (url.startsWith('/projects')) {\n\n\t\t\t\tlet identifier = url.split('/').slice(0, 3).join('/');\n\t\t\t\tlet project    = lychee.import('MAIN')._projects[identifier] || null;\n\t\t\t\tif (project !== null) {\n\n\t\t\t\t\tlet path = '/' + url.split('/').slice(3).join('/');\n\t\t\t\t\tif (path === identifier || path === identifier + '/' || path === '/') {\n\n\t\t\t\t\t\tlet info = project.filesystem.info('/index.html');\n\t\t\t\t\t\tif (info !== null) {\n\n\t\t\t\t\t\t\ttunnel.send('', {\n\t\t\t\t\t\t\t\t'status':   '301 Moved Permanently',\n\t\t\t\t\t\t\t\t'location': identifier + '/index.html'\n\t\t\t\t\t\t\t});\n\n\t\t\t\t\t\t\treturn true;\n\n\t\t\t\t\t\t}\n\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t}\n\n\t};\n\n\n\treturn Module;\n\n}"
					}
				},
				"harvester.data.Filesystem": {
					"constructor": "lychee.Definition",
					"arguments": [
						{
							"id": "harvester.data.Filesystem",
							"url": "/libraries/harvester/source/platform/node/data/Filesystem.js"
						}
					],
					"blob": {
						"attaches": {},
						"tags": {
							"platform": "node"
						},
						"supports": "(lychee, global) => {\n\n\ttry {\n\n\t\trequire('fs');\n\t\trequire('path');\n\n\t\treturn true;\n\n\t} catch (err) {\n\n\t}\n\n\n\treturn false;\n\n}",
						"exports": "(lychee, global, attachments) => {\n\n\tconst _ROOT = lychee.ROOT.lychee;\n\tconst _fs   = require('fs');\n\tconst _path = require('path');\n\n\n\n\t/*\n\t * HELPERS\n\t */\n\n\tconst _create_directory = function(path, mode) {\n\n\t\tif (mode === undefined) {\n\t\t\tmode = 0o777 & (~process.umask());\n\t\t}\n\n\n\t\tlet is_directory = false;\n\n\t\ttry {\n\n\t\t\tlet stat1 = _fs.lstatSync(path);\n\t\t\tif (stat1.isSymbolicLink()) {\n\n\t\t\t\tlet tmp   = _fs.realpathSync(path);\n\t\t\t\tlet stat2 = _fs.lstatSync(tmp);\n\t\t\t\tif (stat2.isDirectory()) {\n\t\t\t\t\tis_directory = true;\n\t\t\t\t}\n\n\t\t\t} else if (stat1.isDirectory()) {\n\t\t\t\tis_directory = true;\n\t\t\t}\n\n\t\t} catch (err) {\n\n\t\t\tif (err.code === 'ENOENT') {\n\n\t\t\t\tif (_create_directory(_path.dirname(path), mode) === true) {\n\t\t\t\t\t_fs.mkdirSync(path, mode);\n\t\t\t\t}\n\n\t\t\t\ttry {\n\n\t\t\t\t\tlet stat2 = _fs.lstatSync(path);\n\t\t\t\t\tif (stat2.isSymbolicLink()) {\n\n\t\t\t\t\t\tlet tmp   = _fs.realpathSync(path);\n\t\t\t\t\t\tlet stat3 = _fs.lstatSync(tmp);\n\t\t\t\t\t\tif (stat3.isDirectory()) {\n\t\t\t\t\t\t\tis_directory = true;\n\t\t\t\t\t\t}\n\n\t\t\t\t\t} else if (stat2.isDirectory()) {\n\t\t\t\t\t\tis_directory = true;\n\t\t\t\t\t}\n\n\t\t\t\t} catch (err) {\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t}\n\n\n\t\treturn is_directory;\n\n\t};\n\n\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tconst Composite = function(data) {\n\n\t\tlet states = Object.assign({}, data);\n\n\n\t\tthis.root = typeof states.root === 'string' ? states.root : null;\n\n\t\tthis.__root = _ROOT;\n\n\n\n\t\t/*\n\t\t * INITIALIZATION\n\t\t */\n\n\t\tif (this.root !== null) {\n\n\t\t\tlet tmp1 = _path.normalize(this.root);\n\t\t\tlet tmp2 = _ROOT;\n\t\t\tif (tmp1.startsWith('/')) {\n\t\t\t\ttmp2 = _ROOT + tmp1;\n\t\t\t} else if (tmp1.startsWith('./')) {\n\t\t\t\ttmp2 = _ROOT + tmp1.substr(1);\n\t\t\t}\n\n\t\t\tif (tmp2.endsWith('/')) {\n\t\t\t\ttmp2 = tmp2.substr(0, tmp2.length - 1);\n\t\t\t}\n\n\t\t\tthis.__root = tmp2;\n\n\t\t}\n\n\t\tstates = null;\n\n\t};\n\n\n\tComposite.prototype = {\n\n\t\t/*\n\t\t * ENTITY API\n\t\t */\n\n\t\t// deserialize: function(blob) {},\n\n\t\tserialize: function() {\n\n\t\t\tlet states = {};\n\n\n\t\t\tif (this.root !== null) states.root = this.root.substr(_ROOT.length);\n\n\n\t\t\treturn {\n\t\t\t\t'constructor': 'harvester.data.Filesystem',\n\t\t\t\t'arguments':   [ states ]\n\t\t\t};\n\n\t\t},\n\n\n\n\t\t/*\n\t\t * CUSTOM API\n\t\t */\n\n\t\tasset: function(path, callback, scope) {\n\n\t\t\tpath     = typeof path === 'string'     ? path     : null;\n\t\t\tcallback = callback instanceof Function ? callback : null;\n\t\t\tscope    = scope !== undefined          ? scope    : this;\n\n\n\t\t\tif (path === null) {\n\n\t\t\t\tif (callback !== null) {\n\t\t\t\t\tcallback(null);\n\t\t\t\t}\n\n\t\t\t\treturn null;\n\n\t\t\t} else if (path.charAt(0) !== '/') {\n\t\t\t\tpath = '/' + path;\n\t\t\t}\n\n\n\t\t\tlet asset    = null;\n\t\t\tlet resolved = _path.normalize(this.__root.substr(process.cwd().length) + path);\n\t\t\tif (callback !== null) {\n\n\t\t\t\tasset = new lychee.Asset(resolved, null, true);\n\n\t\t\t\tif (asset !== null) {\n\n\t\t\t\t\tasset.onload = function() {\n\t\t\t\t\t\tcallback.call(scope, this);\n\t\t\t\t\t};\n\n\t\t\t\t\tasset.load();\n\n\t\t\t\t} else {\n\n\t\t\t\t\tcallback.call(scope, null);\n\n\t\t\t\t}\n\n\t\t\t} else {\n\n\t\t\t\ttry {\n\n\t\t\t\t\tasset = new lychee.Asset(resolved, null, true);\n\n\t\t\t\t\tif (asset !== null) {\n\t\t\t\t\t\tasset.load();\n\t\t\t\t\t}\n\n\t\t\t\t\treturn asset;\n\n\t\t\t\t} catch (err) {\n\t\t\t\t\treturn null;\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t},\n\n\t\tdir: function(path, callback, scope) {\n\n\t\t\tpath     = typeof path === 'string'     ? path     : null;\n\t\t\tcallback = callback instanceof Function ? callback : null;\n\t\t\tscope    = scope !== undefined          ? scope    : this;\n\n\n\t\t\tif (path === null) {\n\n\t\t\t\tif (callback !== null) {\n\t\t\t\t\tcallback([]);\n\t\t\t\t}\n\n\t\t\t\treturn [];\n\n\t\t\t} else if (path.charAt(0) !== '/') {\n\t\t\t\tpath = '/' + path;\n\t\t\t}\n\n\n\t\t\tlet resolved = _path.normalize(this.__root + path);\n\t\t\tif (callback !== null) {\n\n\t\t\t\t_fs.readdir(resolved, (err, data) => {\n\n\t\t\t\t\tif (err) {\n\t\t\t\t\t\tcallback.call(scope, []);\n\t\t\t\t\t} else {\n\t\t\t\t\t\tcallback.call(scope, data);\n\t\t\t\t\t}\n\n\t\t\t\t});\n\n\t\t\t} else {\n\n\t\t\t\ttry {\n\t\t\t\t\treturn _fs.readdirSync(resolved);\n\t\t\t\t} catch (err) {\n\t\t\t\t\treturn [];\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t},\n\n\t\tread: function(path, callback, scope) {\n\n\t\t\tpath     = typeof path === 'string'     ? path     : null;\n\t\t\tcallback = callback instanceof Function ? callback : null;\n\t\t\tscope    = scope !== undefined          ? scope    : this;\n\n\n\t\t\tif (path === null) {\n\n\t\t\t\tif (callback !== null) {\n\t\t\t\t\tcallback(null);\n\t\t\t\t}\n\n\t\t\t\treturn null;\n\n\t\t\t} else if (path.charAt(0) !== '/') {\n\t\t\t\tpath = '/' + path;\n\t\t\t}\n\n\n\t\t\tlet resolved = _path.normalize(this.__root + path);\n\t\t\tif (callback !== null) {\n\n\t\t\t\tlet data = null;\n\t\t\t\ttry {\n\t\t\t\t\tdata = _fs.readFileSync(resolved);\n\t\t\t\t} catch (err) {\n\t\t\t\t\tdata = null;\n\t\t\t\t}\n\n\t\t\t\tcallback.call(scope, data);\n\n\t\t\t} else {\n\n\t\t\t\ttry {\n\t\t\t\t\treturn _fs.readFileSync(resolved);\n\t\t\t\t} catch (err) {\n\t\t\t\t\treturn null;\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t},\n\n\t\twrite: function(path, data, callback, scope) {\n\n\t\t\tpath     = typeof path === 'string'     ? path     : null;\n\t\t\tdata     = data !== undefined           ? data     : null;\n\t\t\tcallback = callback instanceof Function ? callback : null;\n\t\t\tscope    = scope !== undefined          ? scope    : this;\n\n\n\t\t\tif (path === null) {\n\n\t\t\t\tif (callback !== null) {\n\t\t\t\t\tcallback(false);\n\t\t\t\t}\n\n\t\t\t\treturn false;\n\n\t\t\t} else if (path.charAt(0) !== '/') {\n\t\t\t\tpath = '/' + path;\n\t\t\t}\n\n\n\t\t\tlet encoding = 'binary';\n\n\t\t\tif (typeof data === 'string') {\n\t\t\t\tencoding = 'utf8';\n\t\t\t} else {\n\t\t\t\tencoding = 'binary';\n\t\t\t}\n\n\n\t\t\t_create_directory(_path.dirname(this.__root + path));\n\n\n\t\t\tlet info     = this.info(_path.dirname(path));\n\t\t\tlet resolved = _path.normalize(this.__root + path);\n\t\t\tif (resolved !== null && info !== null && info.type === 'directory') {\n\n\t\t\t\tif (callback !== null) {\n\n\t\t\t\t\tlet result = false;\n\t\t\t\t\ttry {\n\t\t\t\t\t\t_fs.writeFileSync(resolved, data, encoding);\n\t\t\t\t\t\tresult = true;\n\t\t\t\t\t} catch (err) {\n\t\t\t\t\t\tresult = false;\n\t\t\t\t\t}\n\n\t\t\t\t\tcallback.call(scope, result);\n\n\t\t\t\t} else {\n\n\t\t\t\t\tlet result = false;\n\t\t\t\t\ttry {\n\t\t\t\t\t\t_fs.writeFileSync(resolved, data, encoding);\n\t\t\t\t\t\tresult = true;\n\t\t\t\t\t} catch (err) {\n\t\t\t\t\t\tresult = false;\n\t\t\t\t\t}\n\n\t\t\t\t\treturn result;\n\n\t\t\t\t}\n\n\t\t\t} else {\n\n\t\t\t\tif (callback !== null) {\n\t\t\t\t\tcallback.call(scope, false);\n\t\t\t\t} else {\n\t\t\t\t\treturn false;\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t},\n\n\t\tinfo: function(path) {\n\n\t\t\tpath = typeof path === 'string' ? path : null;\n\n\n\t\t\tif (path === null) {\n\t\t\t\treturn null;\n\t\t\t} else if (path.charAt(0) !== '/') {\n\t\t\t\tpath = '/' + path;\n\t\t\t}\n\n\n\t\t\tlet resolved = _path.normalize(this.__root + path);\n\t\t\tif (resolved !== null) {\n\n\t\t\t\ttry {\n\n\t\t\t\t\tlet stat1 = _fs.lstatSync(resolved);\n\t\t\t\t\tif (stat1.isSymbolicLink()) {\n\n\t\t\t\t\t\tlet tmp   = _fs.realpathSync(resolved);\n\t\t\t\t\t\tlet stat2 = _fs.lstatSync(tmp);\n\n\t\t\t\t\t\treturn {\n\t\t\t\t\t\t\ttype:   stat2.isFile() ? 'file' : 'directory',\n\t\t\t\t\t\t\tlength: stat2.size,\n\t\t\t\t\t\t\tmtime:  new Date(stat2.mtime.toUTCString())\n\t\t\t\t\t\t};\n\n\t\t\t\t\t} else {\n\n\t\t\t\t\t\treturn {\n\t\t\t\t\t\t\ttype:   stat1.isFile() ? 'file' : 'directory',\n\t\t\t\t\t\t\tlength: stat1.size,\n\t\t\t\t\t\t\tmtime:  new Date(stat1.mtime.toUTCString())\n\t\t\t\t\t\t};\n\n\t\t\t\t\t}\n\n\t\t\t\t} catch (err) {\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\treturn null;\n\n\t\t}\n\n\t};\n\n\n\treturn Composite;\n\n}"
					}
				},
				"harvester.data.Project": {
					"constructor": "lychee.Definition",
					"arguments": [
						{
							"id": "harvester.data.Project",
							"url": "/libraries/harvester/source/data/Project.js"
						}
					],
					"blob": {
						"attaches": {},
						"requires": [
							"harvester.data.Filesystem",
							"harvester.data.Package",
							"harvester.data.Server"
						],
						"exports": "(lychee, global, attachments) => {\n\n\tconst _Filesystem = lychee.import('harvester.data.Filesystem');\n\tconst _Package    = lychee.import('harvester.data.Package');\n\tconst _Server     = lychee.import('harvester.data.Server');\n\n\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tconst Composite = function(data) {\n\n\t\tlet states = Object.assign({}, data);\n\n\n\t\tthis.identifier = typeof states.identifier === 'string' ? states.identifier : '/projects/boilerplate';\n\t\tthis.filesystem = new _Filesystem({\n\t\t\troot: this.identifier\n\t\t});\n\t\tthis.package    = new _Package({\n\t\t\tbuffer: this.filesystem.read('/lychee.pkg')\n\t\t});\n\t\tthis.server     = null;\n\t\tthis.harvester  = false;\n\n\n\t\tif (Object.keys(this.package.source).length === 0) {\n\t\t\tconsole.error('harvester.data.Project: Invalid package at \"' + this.identifier + '/lychee.pkg\".');\n\t\t}\n\n\n\t\tlet check = this.filesystem.info('/harvester.js');\n\t\tif (check !== null) {\n\t\t\tthis.harvester = true;\n\t\t}\n\n\n\t\tstates = null;\n\n\t};\n\n\n\n\n\tComposite.prototype = {\n\n\t\t/*\n\t\t * ENTITY API\n\t\t */\n\n\t\t// deserialize: function(blob) {},\n\n\t\tserialize: function() {\n\n\t\t\tlet blob = {};\n\n\n\t\t\tif (this.filesystem !== null) blob.filesystem = lychee.serialize(this.filesystem);\n\t\t\tif (this.package !== null)    blob.package    = lychee.serialize(this.package);\n\t\t\tif (this.server !== null)     blob.server     = lychee.serialize(this.server);\n\n\n\t\t\treturn {\n\t\t\t\t'constructor': 'harvester.data.Project',\n\t\t\t\t'arguments':   [ this.identifier ],\n\t\t\t\t'blob':        Object.keys(blob).length > 0 ? blob : null\n\t\t\t};\n\n\t\t},\n\n\n\n\t\t/*\n\t\t * CUSTOM API\n\t\t */\n\n\t\tsetPackage: function(pkg) {\n\n\t\t\tpkg = pkg instanceof _Package ? pkg : null;\n\n\n\t\t\tif (pkg !== null) {\n\n\t\t\t\tthis.package = pkg;\n\n\t\t\t\treturn true;\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t},\n\n\t\tsetServer: function(server) {\n\n\t\t\tserver = server instanceof _Server ? server : null;\n\n\n\t\t\tif (server !== null) {\n\n\t\t\t\tthis.server = server;\n\n\t\t\t\treturn true;\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t}\n\n\t};\n\n\n\treturn Composite;\n\n}"
					}
				},
				"harvester.mod.Beautifier": {
					"constructor": "lychee.Definition",
					"arguments": [
						{
							"id": "harvester.mod.Beautifier",
							"url": "/libraries/harvester/source/mod/Beautifier.js"
						}
					],
					"blob": {
						"attaches": {},
						"requires": [
							"harvester.data.Package",
							"harvester.data.Project"
						],
						"exports": "(lychee, global, attachments) => {\n\n\tconst _Project = lychee.import('harvester.data.Package');\n\n\n\n\t/*\n\t * HELPERS\n\t */\n\n\tconst _beautify_json = function(project, path) {\n\n\t\tlet data = null;\n\n\t\ttry {\n\t\t\tdata = JSON.parse(project.filesystem.read(path));\n\t\t} catch (err) {\n\t\t\tdata = null;\n\t\t}\n\n\n\t\tif (data !== null) {\n\n\t\t\tdata = JSON.stringify(data, null, '\\t');\n\t\t\tproject.filesystem.write(path, data);\n\n\t\t}\n\n\n\t\treturn data;\n\n\t};\n\n\tconst _get_files = function(project) {\n\n\t\tlet files = [];\n\n\n\t\t// _walk_directory.call(project.filesystem, '/bin', files);\n\t\t// _walk_directory.call(project.filesystem, '/api', files);\n\t\t// _walk_directory.call(project.filesystem, '/asset', files);\n\t\t// _walk_directory.call(project.filesystem, '/build', files);\n\n\t\t_walk_directory.call(project.filesystem, '/review', files);\n\t\t_walk_directory.call(project.filesystem, '/source', files);\n\n\n\t\treturn files;\n\n\t};\n\n\tconst _walk_directory = function(path, cache) {\n\n\t\tlet name = path.split('/').pop();\n\n\t\tlet info = this.info(path);\n\t\tif (info !== null && name.startsWith('.') === false) {\n\n\t\t\tif (info.type === 'file') {\n\n\t\t\t\tif (name.endsWith('.json')) {\n\t\t\t\t\tcache.push(path);\n\t\t\t\t}\n\n\t\t\t} else if (info.type === 'directory') {\n\t\t\t\tthis.dir(path).forEach(child => _walk_directory.call(this, path + '/' + child, cache));\n\t\t\t}\n\n\t\t}\n\n\t};\n\n\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tconst Module = {\n\n\t\t/*\n\t\t * ENTITY API\n\t\t */\n\n\t\t// deserialize: function(blob) {},\n\n\t\tserialize: function() {\n\n\t\t\treturn {\n\t\t\t\t'reference': 'harvester.mod.Beautifier',\n\t\t\t\t'arguments': []\n\t\t\t};\n\n\t\t},\n\n\n\n\t\t/*\n\t\t * CUSTOM API\n\t\t */\n\n\t\tcan: function(project) {\n\n\t\t\tproject = project instanceof _Project ? project : null;\n\n\n\t\t\tif (project !== null) {\n\n\t\t\t\tif (project.identifier.indexOf('__') === -1 && project.package !== null && project.filesystem !== null) {\n\n\t\t\t\t\tlet files = _get_files(project);\n\t\t\t\t\tif (files.length > 0) {\n\t\t\t\t\t\treturn true;\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t},\n\n\t\tprocess: function(project) {\n\n\t\t\tproject = project instanceof _Project ? project : null;\n\n\n\t\t\tif (project !== null) {\n\n\t\t\t\tif (project.package !== null) {\n\n\t\t\t\t\tlet files = _get_files(project);\n\t\t\t\t\tif (files.length > 0) {\n\n\t\t\t\t\t\tfiles.filter(path => path.endsWith('.json')).forEach(path => {\n\t\t\t\t\t\t\t_beautify_json(project, path);\n\t\t\t\t\t\t});\n\n\t\t\t\t\t}\n\n\t\t\t\t\treturn true;\n\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t}\n\n\t};\n\n\n\treturn Module;\n\n}"
					}
				},
				"harvester.mod.Fertilizer": {
					"constructor": "lychee.Definition",
					"arguments": [
						{
							"id": "harvester.mod.Fertilizer",
							"url": "/libraries/harvester/source/platform/node/mod/Fertilizer.js"
						}
					],
					"blob": {
						"attaches": {},
						"tags": {
							"platform": "node"
						},
						"requires": [
							"harvester.data.Project"
						],
						"supports": "(lychee, global) => {\n\n\tif (typeof global.require === 'function') {\n\n\t\ttry {\n\n\t\t\tglobal.require('child_process');\n\n\t\t\treturn true;\n\n\t\t} catch (err) {\n\n\t\t}\n\n\t}\n\n\n\treturn false;\n\n}",
						"exports": "(lychee, global, attachments) => {\n\n\tconst _child_process = global.require('child_process');\n\tconst _setInterval   = global.setInterval;\n\tconst _Project       = lychee.import('harvester.data.Project');\n\tconst _BINARY        = process.execPath;\n\tlet   _ACTIVE        = false;\n\tconst _CACHE         = {};\n\tconst _QUEUE         = [];\n\tconst _ROOT          = lychee.ROOT.lychee;\n\n\n\n\t/*\n\t * FEATURE DETECTION\n\t */\n\n\t(function(cache) {\n\n\t\t_setInterval(_ => {\n\n\t\t\tif (_ACTIVE === false) {\n\n\t\t\t\tlet tmp = _QUEUE.splice(0, 1);\n\t\t\t\tif (tmp.length === 1) {\n\n\t\t\t\t\t_ACTIVE = true;\n\t\t\t\t\t_fertilize(tmp[0].project, tmp[0].target);\n\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t}, 1000);\n\n\t})(_CACHE);\n\n\n\n\t/*\n\t * HELPERS\n\t */\n\n\tconst _is_cached = function(id, target, pkg) {\n\n\t\tlet cache = _CACHE[id] || null;\n\t\tif (cache !== null) {\n\n\t\t\tif (cache[target] === pkg) {\n\t\t\t\treturn true;\n\t\t\t}\n\n\t\t}\n\n\t\treturn false;\n\n\t};\n\n\tconst _fertilize = function(project, target) {\n\n\t\tlet handle = null;\n\n\t\ttry {\n\n\t\t\t// XXX: Alternative (_ROOT + '/bin/helper/helper.sh', [ 'env:node', _ROOT + '/libraries/fertilizer/bin/fertilizer.js', target, project ])\n\t\t\thandle = _child_process.execFile(_BINARY, [\n\t\t\t\t_ROOT + '/libraries/fertilizer/bin/fertilizer.js',\n\t\t\t\ttarget,\n\t\t\t\tproject\n\t\t\t], {\n\t\t\t\tcwd: lychee.ROOT.lychee\n\t\t\t}, (error, stdout, stderr) => {\n\n\t\t\t\t_ACTIVE = false;\n\n\t\t\t\tif (error || stdout.indexOf('fertilizer: SUCCESS') === -1) {\n\t\t\t\t\tconsole.error('harvester.mod.Fertilizer: FAILURE (\"' + project + ' | ' + target + '\")');\n\t\t\t\t} else {\n\t\t\t\t\tconsole.info('harvester.mod.Fertilizer: SUCCESS (\"' + project + ' | ' + target + '\")');\n\t\t\t\t}\n\n\t\t\t});\n\n\t\t} catch (err) {\n\n\t\t\thandle = null;\n\n\t\t}\n\n\t\treturn handle;\n\n\t};\n\n\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tconst Module = {\n\n\t\t/*\n\t\t * ENTITY API\n\t\t */\n\n\t\t// deserialize: function(blob) {},\n\n\t\tserialize: function() {\n\n\t\t\treturn {\n\t\t\t\t'reference': 'harvester.mod.Fertilizer',\n\t\t\t\t'arguments': []\n\t\t\t};\n\n\t\t},\n\n\n\n\t\t/*\n\t\t * CUSTOM API\n\t\t */\n\n\t\tcan: function(project) {\n\n\t\t\tproject = project instanceof _Project ? project : null;\n\n\n\t\t\tif (project !== null) {\n\n\t\t\t\tlet id  = project.identifier;\n\t\t\t\tlet pkg = project.package;\n\n\t\t\t\tif (id.indexOf('__') === -1 && pkg !== null) {\n\n\t\t\t\t\tlet build = pkg.json.build || null;\n\t\t\t\t\tif (build !== null) {\n\n\t\t\t\t\t\tlet environments = build.environments || null;\n\t\t\t\t\t\tif (environments !== null) {\n\n\t\t\t\t\t\t\tlet targets = Object.keys(environments).filter(t => _is_cached(id, t, pkg) === false);\n\t\t\t\t\t\t\tif (targets.length > 0) {\n\t\t\t\t\t\t\t\treturn true;\n\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t}\n\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t},\n\n\t\tprocess: function(project) {\n\n\t\t\tproject = project instanceof _Project ? project : null;\n\n\n\t\t\tif (project !== null) {\n\n\t\t\t\tlet id  = project.identifier;\n\t\t\t\tlet fs  = project.filesystem;\n\t\t\t\tlet pkg = project.package;\n\n\t\t\t\tif (fs !== null && pkg !== null) {\n\n\t\t\t\t\tlet build = pkg.json.build || null;\n\t\t\t\t\tif (build !== null) {\n\n\t\t\t\t\t\tlet environments = build.environments || null;\n\t\t\t\t\t\tif (environments !== null) {\n\n\t\t\t\t\t\t\tObject.keys(environments).filter(t => _is_cached(id, t, pkg) === false).forEach(target => {\n\n\t\t\t\t\t\t\t\tlet cache = _CACHE[id] || null;\n\t\t\t\t\t\t\t\tif (cache === null) {\n\t\t\t\t\t\t\t\t\tcache = _CACHE[id] = {};\n\t\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t\t\tcache[target] = pkg;\n\n\t\t\t\t\t\t\t\t_QUEUE.push({\n\t\t\t\t\t\t\t\t\tproject: id,\n\t\t\t\t\t\t\t\t\ttarget:  target\n\t\t\t\t\t\t\t\t});\n\n\t\t\t\t\t\t\t});\n\n\n\t\t\t\t\t\t\treturn true;\n\n\t\t\t\t\t\t}\n\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t}\n\n\t};\n\n\n\treturn Module;\n\n}"
					}
				},
				"harvester.mod.Harvester": {
					"constructor": "lychee.Definition",
					"arguments": [
						{
							"id": "harvester.mod.Harvester",
							"url": "/libraries/harvester/source/mod/Harvester.js"
						}
					],
					"blob": {
						"attaches": {},
						"requires": [
							"harvester.data.Git",
							"harvester.data.Project",
							"harvester.net.Client"
						],
						"exports": "(lychee, global, attachments) => {\n\n\tconst _Client  = lychee.import('harvester.net.Client');\n\tconst _Git     = lychee.import('harvester.data.Git');\n\tconst _Project = lychee.import('harvester.data.Project');\n\tconst _git     = new _Git();\n\tlet   _TIMEOUT = null;\n\n\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tconst Module = {\n\n\t\t/*\n\t\t * ENTITY API\n\t\t */\n\n\t\t// deserialize: function(blob) {},\n\n\t\tserialize: function() {\n\n\t\t\treturn {\n\t\t\t\t'reference': 'harvester.mod.Harvester',\n\t\t\t\t'arguments': []\n\t\t\t};\n\n\t\t},\n\n\n\n\t\t/*\n\t\t * CUSTOM API\n\t\t */\n\n\t\tcan: function() {\n\n\t\t\tlet timeout = _TIMEOUT;\n\t\t\tif (timeout === null || Date.now() > timeout) {\n\n\t\t\t\tlet status = _git.status();\n\t\t\t\tif (status !== null) {\n\t\t\t\t\treturn status;\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\treturn null;\n\n\t\t},\n\n\t\tprocess: function() {\n\n\t\t\tlet timeout = _TIMEOUT || null;\n\t\t\tif (timeout === null || Date.now() > timeout) {\n\n\t\t\t\tlet report = _git.report();\n\t\t\t\tif (report.status === _Git.STATUS.update) {\n\n\t\t\t\t\t// XXX: timeout is 60 minutes\n\t\t\t\t\t_TIMEOUT = Date.now() + 60 * 60 * 1000;\n\n\n\t\t\t\t\tlet result = _git.fetch('upstream', report.branch);\n\t\t\t\t\tif (result === true) {\n\n\t\t\t\t\t\tconsole.info('harvester.mod.Harvester: FETCH (\"' + report.branch + '\")');\n\n\t\t\t\t\t\t// TODO: Merge new HEAD into local history\n\t\t\t\t\t\t// (using git pull upstream <branch>?)\n\n\t\t\t\t\t\t// TODO: Broadcast local HEAD and reflog\n\t\t\t\t\t\t// TODO: Find system with real HEAD\n\t\t\t\t\t\t// TODO: Synchronize reflog and pull from real HEAD\n\n\n\t\t\t\t\t\treturn true;\n\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t}\n\n\t};\n\n\n\treturn Module;\n\n}"
					}
				},
				"harvester.mod.Server": {
					"constructor": "lychee.Definition",
					"arguments": [
						{
							"id": "harvester.mod.Server",
							"url": "/libraries/harvester/source/platform/node/mod/Server.js"
						}
					],
					"blob": {
						"attaches": {},
						"tags": {
							"platform": "node"
						},
						"requires": [
							"harvester.data.Project",
							"harvester.data.Server"
						],
						"supports": "(lychee, global) => {\n\n\tif (typeof global.require === 'function') {\n\n\t\ttry {\n\n\t\t\tglobal.require('child_process');\n\t\t\tglobal.require('net');\n\n\t\t\treturn true;\n\n\t\t} catch (err) {\n\n\t\t}\n\n\t}\n\n\n\treturn false;\n\n}",
						"exports": "(lychee, global, attachments) => {\n\n\tconst _child_process = global.require('child_process');\n\tconst _net           = global.require('net');\n\tconst _Project       = lychee.import('harvester.data.Project');\n\tconst _Server        = lychee.import('harvester.data.Server');\n\tconst _BINARY        = process.execPath;\n\tconst _MIN_PORT      = 49152;\n\tlet   _CUR_PORT      = _MIN_PORT;\n\tconst _MAX_PORT      = 65534;\n\tconst _ROOT          = lychee.ROOT.lychee;\n\n\n\n\t/*\n\t * HELPERS\n\t */\n\n\tconst _OFFSET  = new Array('harvester.mod.Server: '.length).fill(' ').join('');\n\tconst _MESSAGE = {\n\t\tprefixes: [ '(L)', '(I)', '(W)', '(E)' ],\n\t\tconsoles: [ console.log, console.info, console.warn, console.error ]\n\t};\n\n\tconst _on_message = function(raw) {\n\n\t\tlet prefix = '\\u001b[41m\\u001b[97m';\n\t\tlet suffix = '\\u001b[39m\\u001b[49m\\u001b[0m';\n\t\tlet lines  = raw.trim().split('\\n');\n\t\tlet last   = null;\n\n\t\tfor (let l = 0, ll = lines.length; l < ll; l++) {\n\n\t\t\tlet line = lines[l].trim();\n\t\t\tif (line.startsWith('\\u001b')) {\n\t\t\t\tline = line.substr(prefix.length, line.length - prefix.length).trim();\n\t\t\t}\n\n\t\t\tif (line.endsWith('\\u001b[0m')) {\n\t\t\t\tline = line.substr(0, line.length - suffix.length).trim();\n\t\t\t}\n\n\n\t\t\tlet type = line.substr(0, 3);\n\t\t\tif (_MESSAGE.prefixes.includes(type)) {\n\t\t\t\tline = line.substr(3).trim();\n\t\t\t\tlast = type;\n\t\t\t}\n\n\n\t\t\tif (line.length > 0) {\n\t\t\t\tthis.push(last + ' ' + line);\n\t\t\t}\n\n\t\t}\n\n\t};\n\n\tconst _report_error = function(text) {\n\n\t\tlet lines   = text.split('\\n');\n\t\tlet line    = null;\n\t\tlet file    = null;\n\t\tlet message = null;\n\n\n\t\tif (lines.length > 0) {\n\n\t\t\tif (lines[0].indexOf(':') !== -1) {\n\n\t\t\t\tfile = lines[0].split(':')[0];\n\t\t\t\tline = lines[0].split(':')[1];\n\n\t\t\t}\n\n\n\t\t\tlines.forEach(line => {\n\n\t\t\t\tlet err = line.substr(0, line.indexOf(':'));\n\t\t\t\tif (/Error/g.test(err)) {\n\t\t\t\t\tmessage = line.trim();\n\t\t\t\t}\n\n\t\t\t});\n\n\t\t}\n\n\n\t\tif (file !== null && line !== null) {\n\t\t\tconsole.error('harvester.mod.Server: Report from ' + file + '#L' + line + ':');\n\t\t\tconsole.error('                      \"' + message + '\"');\n\t\t}\n\n\t};\n\n\tconst _scan_port = function(callback, scope) {\n\n\t\tcallback = callback instanceof Function ? callback : null;\n\t\tscope    = scope !== undefined          ? scope    : this;\n\n\n\t\tif (callback !== null) {\n\n\t\t\tlet socket = new _net.Socket();\n\t\t\tlet status = null;\n\t\t\tlet port   = _CUR_PORT++;\n\n\n\t\t\tsocket.setTimeout(100);\n\n\t\t\tsocket.on('connect', _ => {\n\t\t\t\tstatus = 'used';\n\t\t\t\tsocket.destroy();\n\t\t\t});\n\n\t\t\tsocket.on('timeout', _ => {\n\t\t\t\tstatus = 'free';\n\t\t\t\tsocket.destroy();\n\t\t\t});\n\n\t\t\tsocket.on('error', err => {\n\n\t\t\t\tif (err.code === 'ECONNREFUSED') {\n\t\t\t\t\tstatus = 'free';\n\t\t\t\t} else {\n\t\t\t\t\tstatus = 'used';\n\t\t\t\t}\n\n\t\t\t\tsocket.destroy();\n\n\t\t\t});\n\n\t\t\tsocket.on('close', err => {\n\n\t\t\t\tif (status === 'free') {\n\t\t\t\t\tcallback.call(scope, port);\n\t\t\t\t} else if (status === 'used') {\n\t\t\t\t\t_scan_port(callback, scope);\n\t\t\t\t} else {\n\t\t\t\t\tcallback.call(scope, null);\n\t\t\t\t}\n\n\t\t\t});\n\n\n\t\t\tsocket.connect(port, '127.0.0.1');\n\n\t\t}\n\n\t};\n\n\tconst _serve = function(project, port) {\n\n\t\tport = typeof port === 'number' ? port : null;\n\n\n\t\tlet handle = null;\n\n\t\tif (port !== null && port >= _MIN_PORT && port <= _MAX_PORT) {\n\n\t\t\tlet info = '\"' + project + '\" | \"*:' + port + '\"';\n\n\t\t\tconsole.info('harvester.mod.Server: BOOTUP (' + info + ')');\n\n\n\t\t\ttry {\n\n\t\t\t\tlet stdout = [];\n\t\t\t\tlet stderr = [];\n\t\t\t\tlet args   = [\n\t\t\t\t\t_ROOT + project + '/harvester.js',\n\t\t\t\t\tport,\n\t\t\t\t\t'null'\n\t\t\t\t];\n\n\t\t\t\tif (lychee.debug === true) {\n\t\t\t\t\targs.push('--debug');\n\t\t\t\t}\n\n\t\t\t\t// XXX: Alternative (_ROOT + '/bin/helper/helper.sh', [ 'env:node', file, port, host ])\n\t\t\t\thandle = _child_process.execFile(_BINARY, args, {\n\t\t\t\t\tcwd: _ROOT + project\n\t\t\t\t}, error => {\n\n\t\t\t\t\tif (stderr.length > 0) {\n\n\t\t\t\t\t\tconsole.error('harvester.mod.Server: FAILURE (' + info + ')');\n\n\t\t\t\t\t\tif (lychee.debug === true) {\n\n\t\t\t\t\t\t\tfor (let s = 0, sl = stdout.length; s < sl; s++) {\n\n\t\t\t\t\t\t\t\tlet line  = stdout[s];\n\t\t\t\t\t\t\t\tlet type  = line.substr(0, 3);\n\t\t\t\t\t\t\t\tlet chunk = _OFFSET + line.substr(3).trim();\n\n\t\t\t\t\t\t\t\tlet index = _MESSAGE.prefixes.indexOf(type);\n\t\t\t\t\t\t\t\tif (index !== -1) {\n\t\t\t\t\t\t\t\t\t_MESSAGE.consoles[index].call(console, chunk);\n\t\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t}\n\n\t\t\t\t\t\tfor (let s = 0, sl = stderr.length; s < sl; s++) {\n\n\t\t\t\t\t\t\tlet line  = stderr[s];\n\t\t\t\t\t\t\tlet type  = line.substr(0, 3);\n\t\t\t\t\t\t\tlet chunk = _OFFSET + line.substr(3).trim();\n\n\t\t\t\t\t\t\tlet index = _MESSAGE.prefixes.indexOf(type);\n\t\t\t\t\t\t\tif (index !== -1) {\n\t\t\t\t\t\t\t\t_MESSAGE.consoles[index].call(console, chunk);\n\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t}\n\n\t\t\t\t\t}\n\n\t\t\t\t});\n\n\t\t\t\thandle.stdout.on('data', raw => _on_message.call(stdout, raw));\n\t\t\t\thandle.stderr.on('data', raw => _on_message.call(stderr, raw));\n\n\t\t\t\thandle.on('error', _ => {\n\t\t\t\t\tconsole.warn('harvester.mod.Server: SHUTDOWN (' + info + ')');\n\t\t\t\t\thandle.kill('SIGTERM');\n\t\t\t\t});\n\n\t\t\t\thandle.on('exit', _ => {});\n\n\t\t\t\thandle.destroy = _ => {\n\t\t\t\t\tconsole.warn('harvester.mod.Server: SHUTDOWN (' + info + ')');\n\t\t\t\t\thandle.kill('SIGTERM');\n\t\t\t\t};\n\n\t\t\t} catch (err) {\n\n\t\t\t\thandle = null;\n\n\t\t\t}\n\n\t\t}\n\n\n\t\treturn handle;\n\n\t};\n\n\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tconst Module = {\n\n\t\t/*\n\t\t * ENTITY API\n\t\t */\n\n\t\t// deserialize: function(blob) {},\n\n\t\tserialize: function() {\n\n\t\t\treturn {\n\t\t\t\t'reference': 'harvester.mod.Server',\n\t\t\t\t'arguments': []\n\t\t\t};\n\n\t\t},\n\n\n\n\t\t/*\n\t\t * CUSTOM API\n\t\t */\n\n\t\tcan: function(project) {\n\n\t\t\tproject = project instanceof _Project ? project : null;\n\n\n\t\t\tif (project !== null) {\n\n\t\t\t\tif (project.identifier.indexOf('__') === -1 && project.server === null) {\n\n\t\t\t\t\tlet info = project.filesystem.info('/harvester.js');\n\t\t\t\t\tif (info !== null && info.type === 'file') {\n\t\t\t\t\t\treturn true;\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t},\n\n\t\tprocess: function(project) {\n\n\t\t\tproject = project instanceof _Project ? project : null;\n\n\n\t\t\tif (project !== null) {\n\n\t\t\t\tif (project.server === null) {\n\n\t\t\t\t\tlet info = project.filesystem.info('/harvester.js');\n\t\t\t\t\tif (info !== null && info.type === 'file') {\n\n\t\t\t\t\t\t_scan_port(port => {\n\n\t\t\t\t\t\t\tlet server = _serve(project.identifier, port);\n\t\t\t\t\t\t\tif (server !== null) {\n\n\t\t\t\t\t\t\t\tproject.setServer(new _Server({\n\t\t\t\t\t\t\t\t\tprocess: server,\n\t\t\t\t\t\t\t\t\thost:    null,\n\t\t\t\t\t\t\t\t\tport:    port\n\t\t\t\t\t\t\t\t}));\n\n\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t}, this);\n\n\n\t\t\t\t\t\treturn true;\n\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t}\n\n\t};\n\n\n\treturn Module;\n\n}"
					}
				},
				"harvester.mod.Strainer": {
					"constructor": "lychee.Definition",
					"arguments": [
						{
							"id": "harvester.mod.Strainer",
							"url": "/libraries/harvester/source/platform/node/mod/Strainer.js"
						}
					],
					"blob": {
						"attaches": {},
						"tags": {
							"platform": "node"
						},
						"requires": [
							"harvester.data.Project"
						],
						"supports": "(lychee, global) => {\n\n\tif (typeof global.require === 'function') {\n\n\t\ttry {\n\n\t\t\tglobal.require('child_process');\n\n\t\t\treturn true;\n\n\t\t} catch (err) {\n\n\t\t}\n\n\t}\n\n\n\treturn false;\n\n}",
						"exports": "(lychee, global, attachments) => {\n\n\tconst _child_process = global.require('child_process');\n\tconst _setInterval   = global.setInterval;\n\tconst _Project       = lychee.import('harvester.data.Project');\n\tconst _BINARY        = process.execPath;\n\tlet   _ACTIVE        = false;\n\tconst _QUEUE         = [];\n\tconst _ROOT          = lychee.ROOT.lychee;\n\n\n\n\t/*\n\t * FEATURE DETECTION\n\t */\n\n\t(function() {\n\n\t\t_setInterval(_ => {\n\n\t\t\tif (_ACTIVE === false) {\n\n\t\t\t\tlet tmp = _QUEUE.splice(0, 1);\n\t\t\t\tif (tmp.length === 1) {\n\n\t\t\t\t\t_ACTIVE = true;\n\t\t\t\t\t_strain(tmp[0].project);\n\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t}, 1000);\n\n\t})();\n\n\n\n\t/*\n\t * HELPERS\n\t */\n\n\tconst _is_queued = function(id) {\n\n\t\tlet entry = _QUEUE.find(e => e.project === id) || null;\n\t\tif (entry !== null) {\n\t\t\treturn true;\n\t\t}\n\n\t\treturn false;\n\n\t};\n\n\tconst _strain = function(project) {\n\n\t\tlet handle = null;\n\n\t\ttry {\n\n\t\t\t// XXX: Alternative (_ROOT + '/bin/helper/helper.sh', [ 'env:node', _ROOT + '/libraries/strainer/bin/strainer.js', target, project ])\n\n\t\t\thandle = _child_process.execFile(_BINARY, [\n\t\t\t\t_ROOT + '/libraries/strainer/bin/strainer.js',\n\t\t\t\t'check',\n\t\t\t\tproject\n\t\t\t], {\n\t\t\t\tcwd: _ROOT\n\t\t\t}, (error, stdout, stderr) => {\n\n\t\t\t\t_ACTIVE = false;\n\n\n\t\t\t\tlet tmp_err = stderr.trim().split('\\n').map(line => {\n\t\t\t\t\treturn line.substr(15, line.length - 29).trim();\n\t\t\t\t}).filter(line => {\n\t\t\t\t\treturn line.startsWith('strainer: /');\n\t\t\t\t});\n\n\t\t\t\tlet tmp_out = stdout.trim().split('\\n').filter(line => {\n\t\t\t\t\treturn line.includes('(W)');\n\t\t\t\t}).map(line => {\n\t\t\t\t\treturn line.substr(15, line.length - 29).trim();\n\t\t\t\t}).filter(line => {\n\t\t\t\t\treturn line.startsWith('strainer: /');\n\t\t\t\t});\n\n\n\t\t\t\tif (tmp_err.length > 0) {\n\n\t\t\t\t\tconsole.error('harvester.mod.Strainer: FAILURE (\"' + project + '\")');\n\n\t\t\t\t\ttmp_out.forEach(line => console.warn(line));\n\t\t\t\t\ttmp_err.forEach(line => console.error(line));\n\n\t\t\t\t} else if (tmp_out.length > 0) {\n\n\t\t\t\t\tconsole.info('harvester.mod.Strainer: SUCCESS (\"' + project + '\")');\n\n\t\t\t\t\ttmp_out.forEach(line => console.warn(line));\n\n\t\t\t\t} else if (error) {\n\n\t\t\t\t\tconsole.error('harvester.mod.Strainer: ERROR (\"' + project + '\")');\n\n\t\t\t\t} else {\n\n\t\t\t\t\tconsole.info('harvester.mod.Strainer: SUCCESS (\"' + project + '\")');\n\n\t\t\t\t}\n\n\t\t\t});\n\n\t\t} catch (err) {\n\n\t\t\thandle = null;\n\n\t\t}\n\n\t\treturn handle;\n\n\t};\n\n\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tconst Module = {\n\n\t\t/*\n\t\t * ENTITY API\n\t\t */\n\n\t\t// deserialize: function(blob) {},\n\n\t\tserialize: function() {\n\n\t\t\treturn {\n\t\t\t\t'reference': 'harvester.mod.Strainer',\n\t\t\t\t'arguments': []\n\t\t\t};\n\n\t\t},\n\n\n\n\t\t/*\n\t\t * CUSTOM API\n\t\t */\n\n\t\tcan: function(project) {\n\n\t\t\tproject = project instanceof _Project ? project : null;\n\n\n\t\t\tif (project !== null) {\n\n\t\t\t\tlet id  = project.identifier;\n\t\t\t\tlet fs  = project.filesystem;\n\t\t\t\tlet pkg = project.package;\n\n\t\t\t\tif (id.indexOf('__') === -1 && pkg !== null && fs !== null) {\n\n\t\t\t\t\tlet buffer = fs.read('/api/strainer.pkg');\n\t\t\t\t\tlet data   = [];\n\n\t\t\t\t\ttry {\n\t\t\t\t\t\tdata = JSON.parse(buffer.toString('utf8'));\n\t\t\t\t\t} catch (err) {\n\t\t\t\t\t\tdata = [];\n\t\t\t\t\t}\n\n\n\t\t\t\t\tlet needs_check = false;\n\n\t\t\t\t\tif (data.length > 0) {\n\n\t\t\t\t\t\tfor (let d = 0, dl = data.length; d < dl; d++) {\n\n\t\t\t\t\t\t\tif (data[d] < Date.now()) {\n\t\t\t\t\t\t\t\tneeds_check = true;\n\t\t\t\t\t\t\t\tbreak;\n\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t}\n\n\t\t\t\t\t} else {\n\n\t\t\t\t\t\tneeds_check = true;\n\n\t\t\t\t\t}\n\n\t\t\t\t\treturn needs_check;\n\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t},\n\n\t\tprocess: function(project) {\n\n\t\t\tproject = project instanceof _Project ? project : null;\n\n\n\t\t\tif (project !== null) {\n\n\t\t\t\tlet id  = project.identifier;\n\t\t\t\tlet fs  = project.filesystem;\n\t\t\t\tlet pkg = project.package;\n\n\t\t\t\tif (fs !== null && pkg !== null) {\n\n\t\t\t\t\tif (_is_queued(id) === false) {\n\n\t\t\t\t\t\t_QUEUE.push({\n\t\t\t\t\t\t\tproject: id\n\t\t\t\t\t\t});\n\n\n\t\t\t\t\t\treturn true;\n\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t}\n\n\t};\n\n\n\treturn Module;\n\n}"
					}
				},
				"lychee.codec.JSON": {
					"constructor": "lychee.Definition",
					"arguments": [
						{
							"id": "lychee.codec.JSON",
							"url": "/libraries/lychee/source/codec/JSON.js"
						}
					],
					"blob": {
						"attaches": {},
						"exports": "(lychee, global, attachments) => {\n\n\t/*\n\t * HELPERS\n\t */\n\n\tconst _CHARS_SEARCH = /[\\\\\"\\u0000-\\u001f\\u007f-\\u009f\\u00ad\\u0600-\\u0604\\u070f\\u17b4\\u17b5\\u200c-\\u200f\\u2028-\\u202f\\u2060-\\u206f\\ufeff\\ufff0-\\uffff]/g;\n\tconst _CHARS_META   = {\n\t\t'\\r': '',    // FUCK YOU, Microsoft!\n\t\t'\\b': '\\\\b',\n\t\t'\\t': '\\\\t',\n\t\t'\\n': '\\\\n',\n\t\t'\\f': '\\\\f',\n\t\t'\"':  '\\\\\"',\n\t\t'\\\\': '\\\\\\\\'\n\t};\n\n\tconst _format_date = function(n) {\n\t\treturn n < 10 ? '0' + n : '' + n;\n\t};\n\n\tconst _desanitize_string = function(san) {\n\n\t\tlet str = san;\n\n\t\t// str = str.replace(/\\\\b/g, '\\b');\n\t\t// str = str.replace(/\\\\f/g, '\\f');\n\t\tstr = str.replace(/\\\\t/g, '\\t');\n\t\tstr = str.replace(/\\\\n/g, '\\n');\n\t\tstr = str.replace(/\\\\\\\\/g, '\\\\');\n\n\t\treturn str;\n\n\t};\n\n\tconst _sanitize_string = function(str) {\n\n\t\tlet san = str;\n\n\t\tif (_CHARS_SEARCH.test(san)) {\n\n\t\t\tsan = san.replace(_CHARS_SEARCH, character => {\n\n\t\t\t\tlet meta = _CHARS_META[character];\n\t\t\t\tif (meta !== undefined) {\n\t\t\t\t\treturn meta;\n\t\t\t\t} else {\n\t\t\t\t\treturn '\\\\u' + (character.charCodeAt(0).toString(16)).slice(-4);\n\t\t\t\t}\n\n\t\t\t});\n\n\t\t}\n\n\t\treturn san;\n\n\t};\n\n\n\n\t/*\n\t * STRUCTS\n\t */\n\n\tconst _Stream = function(buffer) {\n\n\t\tthis.__buffer = typeof buffer === 'string' ? buffer : '';\n\t\tthis.__index  = 0;\n\n\t};\n\n\n\t_Stream.prototype = {\n\n\t\ttoString: function() {\n\t\t\treturn this.__buffer;\n\t\t},\n\n\t\tpointer: function() {\n\t\t\treturn this.__index;\n\t\t},\n\n\t\tlength: function() {\n\t\t\treturn this.__buffer.length;\n\t\t},\n\n\t\tread: function(bytes) {\n\n\t\t\tlet buffer = '';\n\n\t\t\tbuffer       += this.__buffer.substr(this.__index, bytes);\n\t\t\tthis.__index += bytes;\n\n\t\t\treturn buffer;\n\n\t\t},\n\n\t\tsearch: function(array) {\n\n\t\t\tlet bytes = Infinity;\n\n\t\t\tfor (let a = 0, al = array.length; a < al; a++) {\n\n\t\t\t\tlet token = array[a];\n\t\t\t\tlet size  = this.__buffer.indexOf(token, this.__index + 1) - this.__index;\n\t\t\t\tif (size > -1 && size < bytes) {\n\t\t\t\t\tbytes = size;\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\tif (bytes === Infinity) {\n\t\t\t\treturn 0;\n\t\t\t}\n\n\n\t\t\treturn bytes;\n\n\t\t},\n\n\t\tseek: function(bytes) {\n\n\t\t\tif (bytes > 0) {\n\t\t\t\treturn this.__buffer.substr(this.__index, bytes);\n\t\t\t} else {\n\t\t\t\treturn this.__buffer.substr(this.__index + bytes, Math.abs(bytes));\n\t\t\t}\n\n\t\t},\n\n\t\twrite: function(buffer) {\n\n\t\t\tthis.__buffer += buffer;\n\t\t\tthis.__index  += buffer.length;\n\n\t\t}\n\n\t};\n\n\n\n\t/*\n\t * ENCODER and DECODER\n\t */\n\n\tconst _encode = function(stream, data) {\n\n\t\t// Boolean, Null (or EOS), Undefined, Infinity, NaN\n\t\tif (\n\t\t\ttypeof data === 'boolean'\n\t\t\t|| data === null\n\t\t\t|| data === undefined\n\t\t\t|| (\n\t\t\t\ttypeof data === 'number'\n\t\t\t\t&& (\n\t\t\t\t\tdata === Infinity\n\t\t\t\t\t|| data === -Infinity\n\t\t\t\t\t|| isNaN(data) === true\n\t\t\t\t)\n\t\t\t)\n\t\t) {\n\n\t\t\tif (data === null) {\n\t\t\t\tstream.write('null');\n\t\t\t} else if (data === undefined) {\n\t\t\t\tstream.write('undefined');\n\t\t\t} else if (data === false) {\n\t\t\t\tstream.write('false');\n\t\t\t} else if (data === true) {\n\t\t\t\tstream.write('true');\n\t\t\t} else if (data === Infinity) {\n\t\t\t\tstream.write('Infinity');\n\t\t\t} else if (data === -Infinity) {\n\t\t\t\tstream.write('-Infinity');\n\t\t\t} else if (isNaN(data) === true) {\n\t\t\t\tstream.write('NaN');\n\t\t\t}\n\n\n\t\t// 123, 12.3: Integer or Float\n\t\t} else if (typeof data === 'number') {\n\n\t\t\tlet type = 1;\n\t\t\tif (data < 268435456 && data !== (data | 0)) {\n\t\t\t\ttype = 2;\n\t\t\t}\n\n\n\t\t\t// Negative value\n\t\t\tlet sign = 0;\n\t\t\tif (data < 0) {\n\t\t\t\tdata = -data;\n\t\t\t\tsign = 1;\n\t\t\t}\n\n\n\t\t\tif (sign === 1) {\n\t\t\t\tstream.write('-');\n\t\t\t}\n\n\n\t\t\tif (type === 1) {\n\t\t\t\tstream.write('' + data.toString());\n\t\t\t} else {\n\t\t\t\tstream.write('' + data.toString());\n\t\t\t}\n\n\n\t\t// \"\": String\n\t\t} else if (typeof data === 'string') {\n\n\t\t\tdata = _sanitize_string(data);\n\n\n\t\t\tstream.write('\"');\n\n\t\t\tstream.write(data);\n\n\t\t\tstream.write('\"');\n\n\n\t\t// 2021-12-31T11:12:13.123Z\n\t\t} else if (data instanceof Date) {\n\n\t\t\tlet str = '';\n\n\t\t\tstr += data.getUTCFullYear()                + '-';\n\t\t\tstr += _format_date(data.getUTCMonth() + 1) + '-';\n\t\t\tstr += _format_date(data.getUTCDate())      + 'T';\n\t\t\tstr += _format_date(data.getUTCHours())     + ':';\n\t\t\tstr += _format_date(data.getUTCMinutes())   + ':';\n\t\t\tstr += _format_date(data.getUTCSeconds())   + 'Z';\n\n\t\t\tstream.write(str);\n\n\t\t// []: Array\n\t\t} else if (data instanceof Array) {\n\n\t\t\tstream.write('[');\n\n\t\t\tfor (let d = 0, dl = data.length; d < dl; d++) {\n\n\t\t\t\t_encode(stream, data[d]);\n\n\t\t\t\tif (d < dl - 1) {\n\t\t\t\t\tstream.write(',');\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t\tstream.write(']');\n\n\n\t\t// {}: Object\n\t\t} else if (data instanceof Object && typeof data.serialize !== 'function') {\n\n\t\t\tstream.write('{');\n\n\t\t\tlet keys = Object.keys(data);\n\n\t\t\tfor (let k = 0, kl = keys.length; k < kl; k++) {\n\n\t\t\t\tlet key = keys[k];\n\n\t\t\t\t_encode(stream, key);\n\t\t\t\tstream.write(':');\n\n\t\t\t\t_encode(stream, data[key]);\n\n\t\t\t\tif (k < kl - 1) {\n\t\t\t\t\tstream.write(',');\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t\tstream.write('}');\n\n\n\t\t// Custom High-Level Implementation\n\t\t} else if (data instanceof Object && typeof data.serialize === 'function') {\n\n\t\t\tstream.write('%');\n\n\t\t\tlet blob = lychee.serialize(data);\n\n\t\t\t_encode(stream, blob);\n\n\t\t\tstream.write('%');\n\n\t\t}\n\n\t};\n\n\tconst _decode = function(stream) {\n\n\t\tlet value  = undefined;\n\t\tlet seek   = '';\n\t\tlet size   = 0;\n\t\tlet errors = 0;\n\t\tlet check  = null;\n\n\n\t\tif (stream.pointer() < stream.length()) {\n\n\t\t\tseek = stream.seek(1);\n\n\n\t\t\t// Boolean, Null (or EOS), Undefined, Infinity, NaN\n\t\t\tif (stream.seek(4) === 'null') {\n\t\t\t\tstream.read(4);\n\t\t\t\tvalue = null;\n\t\t\t} else if (stream.seek(9) === 'undefined') {\n\t\t\t\tstream.read(9);\n\t\t\t\tvalue = undefined;\n\t\t\t} else if (stream.seek(5) === 'false') {\n\t\t\t\tstream.read(5);\n\t\t\t\tvalue = false;\n\t\t\t} else if (stream.seek(4) === 'true') {\n\t\t\t\tstream.read(4);\n\t\t\t\tvalue = true;\n\t\t\t} else if (stream.seek(8) === 'Infinity') {\n\t\t\t\tstream.read(8);\n\t\t\t\tvalue = Infinity;\n\t\t\t} else if (stream.seek(9) === '-Infinity') {\n\t\t\t\tstream.read(9);\n\t\t\t\tvalue = -Infinity;\n\t\t\t} else if (stream.seek(3) === 'NaN') {\n\t\t\t\tstream.read(3);\n\t\t\t\tvalue = NaN;\n\n\t\t\t// 2021-12-31T11:12:13.123Z -> length is 24\n\t\t\t// 2021-12-31T11:12:13Z     -> length is 20\n\t\t\t} else if (stream.seek(20)[19] === 'Z' || stream.seek(24)[23] === 'Z') {\n\n\t\t\t\tsize  = stream.search([ 'Z' ]);\n\t\t\t\tcheck = stream.seek(size + 1);\n\n\t\t\t\tif (/^([0-9]{4})-([0-9]{2})-([0-9]{2})T([0-9]{2}):([0-9]{2}):([0-9]{2})?(Z|\\.([0-9]{3})Z)$/g.test(check) === true) {\n\t\t\t\t\tstream.read(size + 1);\n\t\t\t\t\tvalue = new Date(check);\n\t\t\t\t}\n\n\t\t\t// 123, 12.3: Number\n\t\t\t} else if (seek === '-' || isNaN(parseInt(seek, 10)) === false) {\n\n\t\t\t\tsize = stream.search([ ',', ']', '}' ]);\n\n\t\t\t\tif (size > 0) {\n\n\t\t\t\t\tlet tmp = stream.read(size);\n\t\t\t\t\tif (tmp.indexOf('.') !== -1) {\n\t\t\t\t\t\tvalue = parseFloat(tmp, 10);\n\t\t\t\t\t} else {\n\t\t\t\t\t\tvalue = parseInt(tmp, 10);\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t// \"\": String\n\t\t\t} else if (seek === '\"') {\n\n\t\t\t\tstream.read(1);\n\n\t\t\t\tsize = stream.search([ '\"' ]);\n\n\t\t\t\tif (size > 0) {\n\t\t\t\t\tvalue = stream.read(size);\n\t\t\t\t} else {\n\t\t\t\t\tvalue = '';\n\t\t\t\t}\n\n\n\t\t\t\tcheck = stream.read(1);\n\n\n\t\t\t\tlet unichar = stream.seek(-2);\n\n\t\t\t\twhile (check === '\"' && unichar.charAt(0) === '\\\\') {\n\n\t\t\t\t\tif (value.charAt(value.length - 1) === '\\\\') {\n\t\t\t\t\t\tvalue = value.substr(0, value.length - 1) + check;\n\t\t\t\t\t}\n\n\t\t\t\t\tsize    = stream.search([ '\"' ]);\n\t\t\t\t\tvalue  += stream.read(size);\n\t\t\t\t\tcheck   = stream.read(1);\n\t\t\t\t\tunichar = stream.seek(-2);\n\n\t\t\t\t}\n\n\t\t\t\tvalue = _desanitize_string(value);\n\n\t\t\t// []: Array\n\t\t\t} else if (seek === '[') {\n\n\t\t\t\tvalue = [];\n\n\n\t\t\t\tsize  = stream.search([ ']' ]);\n\t\t\t\tcheck = stream.read(1).trim() + stream.seek(size).trim();\n\n\t\t\t\tif (check !== '[]') {\n\n\t\t\t\t\twhile (errors === 0) {\n\n\t\t\t\t\t\tvalue.push(_decode(stream));\n\n\t\t\t\t\t\tcheck = stream.seek(1);\n\n\t\t\t\t\t\tif (check === ',') {\n\t\t\t\t\t\t\tstream.read(1);\n\t\t\t\t\t\t} else if (check === ']') {\n\t\t\t\t\t\t\tbreak;\n\t\t\t\t\t\t} else {\n\t\t\t\t\t\t\terrors++;\n\t\t\t\t\t\t}\n\n\t\t\t\t\t}\n\n\t\t\t\t\tstream.read(1);\n\n\t\t\t\t} else {\n\n\t\t\t\t\tstream.read(size);\n\n\t\t\t\t}\n\n\n\t\t\t// {}: Object\n\t\t\t} else if (seek === '{') {\n\n\t\t\t\tvalue = {};\n\n\n\t\t\t\tstream.read(1);\n\n\t\t\t\twhile (errors === 0) {\n\n\t\t\t\t\tif (stream.seek(1) === '}') {\n\t\t\t\t\t\tbreak;\n\t\t\t\t\t}\n\n\n\t\t\t\t\tlet object_key = _decode(stream);\n\t\t\t\t\tcheck = stream.seek(1);\n\n\t\t\t\t\tif (check === '}') {\n\t\t\t\t\t\tbreak;\n\t\t\t\t\t} else if (check === ':') {\n\t\t\t\t\t\tstream.read(1);\n\t\t\t\t\t} else if (check !== ':') {\n\t\t\t\t\t\terrors++;\n\t\t\t\t\t}\n\n\t\t\t\t\tlet object_value = _decode(stream);\n\t\t\t\t\tcheck = stream.seek(1);\n\n\n\t\t\t\t\tvalue[object_key] = object_value;\n\n\n\t\t\t\t\tif (check === '}') {\n\t\t\t\t\t\tbreak;\n\t\t\t\t\t} else if (check === ',') {\n\t\t\t\t\t\tstream.read(1);\n\t\t\t\t\t} else {\n\t\t\t\t\t\terrors++;\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t\tstream.read(1);\n\n\t\t\t// %%: Custom High-Level Implementation\n\t\t\t} else if (seek === '%') {\n\n\t\t\t\tstream.read(1);\n\n\t\t\t\tlet blob = _decode(stream);\n\n\t\t\t\tvalue = lychee.deserialize(blob);\n\t\t\t\tcheck = stream.read(1);\n\n\t\t\t\tif (check !== '%') {\n\t\t\t\t\tvalue = undefined;\n\t\t\t\t}\n\n\t\t\t} else {\n\n\t\t\t\t// Invalid seek, assume it's a space character\n\n\t\t\t\tstream.read(1);\n\t\t\t\treturn _decode(stream);\n\n\t\t\t}\n\n\t\t}\n\n\n\t\treturn value;\n\n\t};\n\n\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tconst Module = {\n\n\t\t/*\n\t\t * ENTITY API\n\t\t */\n\n\t\t// deserialize: function(blob) {},\n\n\t\tserialize: function() {\n\n\t\t\treturn {\n\t\t\t\t'reference': 'lychee.codec.JSON',\n\t\t\t\t'blob':      null\n\t\t\t};\n\n\t\t},\n\n\n\n\t\t/*\n\t\t * CUSTOM API\n\t\t */\n\n\t\tencode: function(data) {\n\n\t\t\tdata = data instanceof Object ? data : null;\n\n\n\t\t\tif (data !== null) {\n\n\t\t\t\tlet stream = new _Stream('');\n\n\t\t\t\t_encode(stream, data);\n\n\t\t\t\treturn Buffer.from(stream.toString(), 'utf8');\n\n\t\t\t}\n\n\n\t\t\treturn null;\n\n\t\t},\n\n\t\tdecode: function(data) {\n\n\t\t\tdata = data instanceof Buffer ? data : null;\n\n\n\t\t\tif (data !== null) {\n\n\t\t\t\tlet stream = new _Stream(data.toString('utf8'));\n\t\t\t\tlet object = _decode(stream);\n\t\t\t\tif (object !== undefined) {\n\t\t\t\t\treturn object;\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\treturn null;\n\n\t\t}\n\n\t};\n\n\n\treturn Module;\n\n}"
					}
				},
				"harvester.mod.Packager": {
					"constructor": "lychee.Definition",
					"arguments": [
						{
							"id": "harvester.mod.Packager",
							"url": "/libraries/harvester/source/mod/Packager.js"
						}
					],
					"blob": {
						"attaches": {},
						"requires": [
							"harvester.data.Package",
							"harvester.data.Project"
						],
						"exports": "(lychee, global, attachments) => {\n\n\tconst _Package = lychee.import('harvester.data.Package');\n\tconst _Project = lychee.import('harvester.data.Project');\n\tconst _ALLOWED = [\n\t\t'appcache',\n\t\t'cmd',\n\t\t'fnt',\n\t\t'html',\n\t\t'js',  'json',\n\t\t'md',  'msc',\n\t\t'nml',\n\t\t'pkg', 'png',\n\t\t'sh',\n\t\t'snd',\n\t\t'tpl', 'txt'\n\t];\n\n\n\n\t/*\n\t * HELPERS\n\t */\n\n\tconst _get_reasons = function(aobject, bobject, reasons, path) {\n\n\t\tpath = typeof path === 'string' ? path : '';\n\n\n\t\tlet akeys = Object.keys(aobject);\n\t\tlet bkeys = Object.keys(bobject);\n\n\t\tif (akeys.length !== bkeys.length) {\n\n\t\t\tfor (let a = 0, al = akeys.length; a < al; a++) {\n\n\t\t\t\tlet aval = akeys[a];\n\t\t\t\tlet bval = bkeys.find(val => val === aval);\n\t\t\t\tif (bval === undefined) {\n\t\t\t\t\treasons.push(path + '/' + aval);\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t\tfor (let b = 0, bl = bkeys.length; b < bl; b++) {\n\n\t\t\t\tlet bval = bkeys[b];\n\t\t\t\tlet aval = akeys.find(val => val === bval);\n\t\t\t\tif (aval === undefined) {\n\t\t\t\t\treasons.push(path + '/' + bval);\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t} else {\n\n\t\t\tfor (let a = 0, al = akeys.length; a < al; a++) {\n\n\t\t\t\tlet key = akeys[a];\n\n\t\t\t\tif (bobject[key] !== undefined) {\n\n\t\t\t\t\tif (aobject[key] !== null && bobject[key] !== null) {\n\n\t\t\t\t\t\tif (aobject[key] instanceof Object && bobject[key] instanceof Object) {\n\t\t\t\t\t\t\t_get_reasons(aobject[key], bobject[key], reasons, path + '/' + key);\n\t\t\t\t\t\t} else if (typeof aobject[key] !== typeof bobject[key]) {\n\t\t\t\t\t\t\treasons.push(path + '/' + key);\n\t\t\t\t\t\t}\n\n\t\t\t\t\t}\n\n\t\t\t\t} else {\n\t\t\t\t\treasons.push(path + '/' + key);\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t}\n\n\t};\n\n\tconst _serialize = function(project) {\n\n\t\tlet json = {};\n\t\tlet tmp  = {};\n\n\n\t\ttry {\n\n\t\t\tjson = JSON.parse(project.filesystem.read('/lychee.pkg'));\n\n\t\t} catch (err) {\n\n\t\t\tconsole.error('harvester.mod.Packager: FAILURE (\"' + project.identifier + '\")');\n\n\t\t\ttry {\n\t\t\t\tjson = JSON.parse(JSON.stringify(project.package.json));\n\t\t\t} catch (err) {\n\t\t\t}\n\n\t\t}\n\n\n\t\tif (json === null) json = {};\n\n\t\tif (typeof json.api === 'undefined')                 json.api       = {};\n\t\tif (typeof json.api.files === 'undefined')           json.api.files = {};\n\t\tif (typeof json.api.environments !== 'undefined')    delete json.api.environments;\n\t\tif (typeof json.api.simulations !== 'undefined')     delete json.api.simulations;\n\t\tif (typeof json.api.tags !== 'undefined')            delete json.api.tags;\n\n\t\tif (typeof json.build  === 'undefined')              json.build              = {};\n\t\tif (typeof json.build.environments === 'undefined')  json.build.environments = {};\n\t\tif (typeof json.build.files === 'undefined')         json.build.files        = {};\n\t\tif (typeof json.build.simulations !== 'undefined')   delete json.build.simulations;\n\t\tif (typeof json.build.tags !== 'undefined')          delete json.build.tags;\n\n\t\tif (typeof json.review === 'undefined')              json.review             = {};\n\t\tif (typeof json.review.simulations === 'undefined')  json.review.simulations = {};\n\t\tif (typeof json.review.files === 'undefined')        json.review.files       = {};\n\t\tif (typeof json.review.environments !== 'undefined') delete json.review.environments;\n\t\tif (typeof json.review.tags !== 'undefined')         delete json.review.tags;\n\n\t\tif (typeof json.source === 'undefined')              json.source       = {};\n\t\tif (typeof json.source.files === 'undefined')        json.source.files = {};\n\t\tif (typeof json.source.tags === 'undefined')         json.source.tags  = {};\n\t\tif (typeof json.source.environments !== 'undefined') delete json.source.environments;\n\t\tif (typeof json.source.simulations !== 'undefined')  delete json.source.simulations;\n\n\n\t\tjson.api.files = {};\n\t\t_walk_directory.call(project.filesystem, tmp, '/api');\n\t\tjson.api.files = _sort_recursive(tmp.api || {});\n\n\t\tjson.build.files = {};\n\t\t_walk_directory.call(project.filesystem, tmp, '/build');\n\t\tjson.build.environments = _sort_recursive(json.build.environments);\n\t\tjson.build.files        = _sort_recursive(tmp.build || {});\n\n\t\tjson.review.files = {};\n\t\t_walk_directory.call(project.filesystem, tmp, '/review');\n\t\tjson.review.simulations = _sort_recursive(json.review.simulations);\n\t\tjson.review.files       = _sort_recursive(tmp.review || {});\n\n\t\tjson.source.files = {};\n\t\t_walk_directory.call(project.filesystem, tmp, '/source');\n\t\tjson.source.files       = _sort_recursive(tmp.source || {});\n\t\tjson.source.tags        = _walk_tags(json.source.files);\n\n\n\t\treturn {\n\t\t\tapi:    json.api,\n\t\t\tbuild:  json.build,\n\t\t\treview: json.review,\n\t\t\tsource: json.source\n\t\t};\n\n\t};\n\n\tconst _sort_recursive = function(obj, name) {\n\n\t\tif (obj instanceof Array) {\n\n\t\t\tif (name === 'platform') {\n\n\t\t\t\t// XXX: platform: [ 'html-webview', 'html', 'node-sdl', 'node' ]\n\t\t\t\treturn obj.sort((a, b) => {\n\n\t\t\t\t\tlet rank_a = 0;\n\t\t\t\t\tlet rank_b = 0;\n\n\t\t\t\t\tlet check_a = a.includes('-');\n\t\t\t\t\tlet check_b = b.includes('-');\n\n\t\t\t\t\tif (check_a && check_b) {\n\n\t\t\t\t\t\tlet tmp_a = a.split('-');\n\t\t\t\t\t\tlet tmp_b = b.split('-');\n\n\t\t\t\t\t\tif (tmp_a[0] > tmp_b[0]) rank_a += 3;\n\t\t\t\t\t\tif (tmp_b[0] > tmp_a[0]) rank_b += 3;\n\n\t\t\t\t\t\tif (tmp_a[0] === tmp_b[0]) {\n\t\t\t\t\t\t\tif (tmp_a[1] > tmp_b[1]) rank_a += 1;\n\t\t\t\t\t\t\tif (tmp_b[1] > tmp_a[1]) rank_b += 1;\n\t\t\t\t\t\t}\n\n\t\t\t\t\t} else if (check_a && !check_b) {\n\n\t\t\t\t\t\tlet tmp_a = a.split('-');\n\n\t\t\t\t\t\tif (tmp_a[0] > b)   rank_a += 3;\n\t\t\t\t\t\tif (b > tmp_a[0])   rank_b += 3;\n\t\t\t\t\t\tif (tmp_a[0] === b) rank_b += 1;\n\n\t\t\t\t\t} else if (!check_a && check_b) {\n\n\t\t\t\t\t\tlet tmp_b = b.split('-');\n\n\t\t\t\t\t\tif (a > tmp_b[0])   rank_a += 3;\n\t\t\t\t\t\tif (tmp_b[0] > a)   rank_b += 3;\n\t\t\t\t\t\tif (a === tmp_b[0]) rank_a += 1;\n\n\t\t\t\t\t} else {\n\n\t\t\t\t\t\tif (a > b) rank_a += 3;\n\t\t\t\t\t\tif (b > a) rank_b += 3;\n\n\t\t\t\t\t}\n\n\t\t\t\t\tif (rank_a > rank_b) return  1;\n\t\t\t\t\tif (rank_b > rank_a) return -1;\n\t\t\t\t\treturn 0;\n\n\t\t\t\t});\n\n\t\t\t} else {\n\n\t\t\t\treturn obj.sort();\n\n\t\t\t}\n\n\t\t} else if (obj instanceof Object) {\n\n\t\t\tfor (let prop in obj) {\n\t\t\t\tobj[prop] = _sort_recursive(obj[prop], prop);\n\t\t\t}\n\n\t\t\treturn Object.sort(obj);\n\n\t\t} else {\n\n\t\t\treturn obj;\n\n\t\t}\n\n\t};\n\n\tconst _walk_tags = function(files) {\n\n\t\tlet tags = {};\n\n\t\tif (files.platform instanceof Object) {\n\n\t\t\ttags.platform = {};\n\n\t\t\tfor (let id in files.platform) {\n\t\t\t\ttags.platform[id] = 'platform/' + id;\n\t\t\t}\n\n\t\t}\n\n\t\treturn tags;\n\n\t};\n\n\tconst _walk_directory = function(pointer, path) {\n\n\t\tlet name = path.split('/').pop();\n\n\t\tlet info = this.info(path);\n\t\tif (info !== null && name.startsWith('.') === false) {\n\n\t\t\tif (info.type === 'file') {\n\n\t\t\t\tlet identifier = name.split('.')[0];\n\t\t\t\tlet attachment = name.split('.').slice(1).join('.');\n\n\t\t\t\t// Music and Sound asset have a trailing mp3 or ogg\n\t\t\t\t// extension which is dynamically chosen at runtime\n\t\t\t\tlet ext = attachment.split('.').pop();\n\t\t\t\tif (/(mp3|ogg)$/.test(ext)) {\n\t\t\t\t\tattachment = attachment.split('.').slice(0, -1).join('.');\n\t\t\t\t\text        = attachment.split('.').pop();\n\t\t\t\t}\n\n\t\t\t\tlet check = _ALLOWED.includes(ext);\n\t\t\t\tif (check === true) {\n\n\t\t\t\t\tif (pointer[identifier] instanceof Array) {\n\n\t\t\t\t\t\tif (pointer[identifier].indexOf(attachment) === -1) {\n\t\t\t\t\t\t\tpointer[identifier].push(attachment);\n\t\t\t\t\t\t}\n\n\t\t\t\t\t} else {\n\n\t\t\t\t\t\tpointer[identifier] = [ attachment ];\n\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t} else if (info.type === 'directory') {\n\n\t\t\t\tpointer[name] = {};\n\n\t\t\t\tthis.dir(path).forEach(child => _walk_directory.call(this, pointer[name], path + '/' + child));\n\n\t\t\t}\n\n\t\t}\n\n\t};\n\n\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tconst Module = {\n\n\t\t/*\n\t\t * ENTITY API\n\t\t */\n\n\t\t// deserialize: function(blob) {},\n\n\t\tserialize: function() {\n\n\t\t\treturn {\n\t\t\t\t'reference': 'harvester.mod.Packager',\n\t\t\t\t'arguments': []\n\t\t\t};\n\n\t\t},\n\n\n\n\t\t/*\n\t\t * CUSTOM API\n\t\t */\n\n\t\tcan: function(project) {\n\n\t\t\tproject = project instanceof _Project ? project : null;\n\n\n\t\t\tif (project !== null) {\n\n\t\t\t\tif (project.identifier.indexOf('__') === -1 && project.package !== null && project.filesystem !== null) {\n\n\t\t\t\t\tlet diff_a = JSON.stringify(project.package.json);\n\t\t\t\t\tlet diff_b = JSON.stringify(_serialize(project));\n\t\t\t\t\tif (diff_a !== diff_b) {\n\t\t\t\t\t\treturn true;\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t},\n\n\t\tprocess: function(project) {\n\n\t\t\tproject = project instanceof _Project ? project : null;\n\n\n\t\t\tlet reasons = [];\n\n\t\t\tif (project !== null) {\n\n\t\t\t\tif (project.package !== null) {\n\n\t\t\t\t\tlet data = _serialize(project);\n\t\t\t\t\tlet blob = JSON.stringify(data, null, '\\t');\n\n\n\t\t\t\t\t_get_reasons(data, project.package.json, reasons);\n\n\n\t\t\t\t\tif (blob !== null) {\n\n\t\t\t\t\t\tproject.filesystem.write('/lychee.pkg', blob);\n\t\t\t\t\t\tproject.package = null;\n\t\t\t\t\t\tproject.package = new _Package({\n\t\t\t\t\t\t\tbuffer: Buffer.from(blob, 'utf8')\n\t\t\t\t\t\t});\n\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t\treturn reasons;\n\n\t\t}\n\n\t};\n\n\n\treturn Module;\n\n}"
					}
				},
				"lychee.Storage": {
					"constructor": "lychee.Definition",
					"arguments": [
						{
							"id": "lychee.Storage",
							"url": "/libraries/lychee/source/platform/node/Storage.js"
						}
					],
					"blob": {
						"attaches": {},
						"tags": {
							"platform": "node"
						},
						"includes": [
							"lychee.event.Emitter"
						],
						"supports": "(lychee, global) => {\n\n\tif (typeof global.require === 'function') {\n\n\t\ttry {\n\n\t\t\tglobal.require('fs');\n\n\t\t\treturn true;\n\n\t\t} catch (err) {\n\n\t\t}\n\n\t}\n\n\n\treturn false;\n\n}",
						"exports": "(lychee, global, attachments) => {\n\n\tlet   _id         = 0;\n\tconst _Emitter    = lychee.import('lychee.event.Emitter');\n\tconst _JSON       = {\n\t\tencode: JSON.stringify,\n\t\tdecode: JSON.parse\n\t};\n\tconst _PERSISTENT = {\n\t\tdata: {},\n\t\tread: function() {\n\t\t\treturn false;\n\t\t},\n\t\twrite: function() {\n\t\t\treturn false;\n\t\t}\n\t};\n\tconst _TEMPORARY  = {\n\t\tdata: {},\n\t\tread: function() {\n\t\t\treturn true;\n\t\t},\n\t\twrite: function() {\n\t\t\treturn true;\n\t\t}\n\t};\n\n\n\n\t/*\n\t * FEATURE DETECTION\n\t */\n\n\t(function() {\n\n\t\tconst _fs = global.require('fs');\n\n\n\t\tlet read = 'readFileSync' in _fs;\n\t\tif (read === true) {\n\n\t\t\t_PERSISTENT.read = function() {\n\n\t\t\t\tlet url = lychee.environment.resolve('./lychee.store');\n\n\n\t\t\t\tlet raw = null;\n\t\t\t\ttry {\n\t\t\t\t\traw = _fs.readFileSync(url, 'utf8');\n\t\t\t\t} catch (err) {\n\t\t\t\t\traw = null;\n\t\t\t\t}\n\n\n\t\t\t\tlet buffer = null;\n\t\t\t\ttry {\n\t\t\t\t\tbuffer = JSON.parse(raw);\n\t\t\t\t} catch (err) {\n\t\t\t\t\tbuffer = null;\n\t\t\t\t}\n\n\n\t\t\t\tif (buffer !== null) {\n\n\t\t\t\t\tfor (let id in buffer) {\n\t\t\t\t\t\t_PERSISTENT.data[id] = buffer[id];\n\t\t\t\t\t}\n\n\n\t\t\t\t\treturn true;\n\n\t\t\t\t}\n\n\n\t\t\t\treturn false;\n\n\t\t\t};\n\n\t\t}\n\n\n\t\tlet write = 'writeFileSync' in _fs;\n\t\tif (write === true) {\n\n\t\t\t_PERSISTENT.write = function() {\n\n\t\t\t\tlet buffer = _JSON.encode(_PERSISTENT.data);\n\t\t\t\tlet url    = lychee.environment.resolve('./lychee.store');\n\n\n\t\t\t\tlet result = false;\n\t\t\t\ttry {\n\t\t\t\t\tresult = _fs.writeFileSync(url, buffer, 'utf8');\n\t\t\t\t} catch (err) {\n\t\t\t\t\tresult = false;\n\t\t\t\t}\n\n\n\t\t\t\treturn result;\n\n\t\t\t};\n\n\t\t}\n\n\n\t\tif (lychee.debug === true) {\n\n\t\t\tlet methods = [];\n\n\t\t\tif (read && write) methods.push('Persistent');\n\t\t\tif (_TEMPORARY)    methods.push('Temporary');\n\n\t\t\tif (methods.length === 0) {\n\t\t\t\tconsole.error('lychee.Storage: Supported methods are NONE');\n\t\t\t} else {\n\t\t\t\tconsole.info('lychee.Storage: Supported methods are ' + methods.join(', '));\n\t\t\t}\n\n\t\t}\n\n\n\t\t_PERSISTENT.read();\n\n\t})();\n\n\n\n\t/*\n\t * HELPERS\n\t */\n\n\tconst _read_storage = function(silent) {\n\n\t\tsilent = silent === true;\n\n\n\t\tlet id   = this.id;\n\t\tlet blob = null;\n\n\n\t\tlet type = this.type;\n\t\tif (type === Composite.TYPE.persistent) {\n\t\t\tblob = _PERSISTENT.data[id] || null;\n\t\t} else if (type === Composite.TYPE.temporary) {\n\t\t\tblob = _TEMPORARY.data[id]  || null;\n\t\t}\n\n\n\t\tif (blob !== null) {\n\n\t\t\tif (this.model === null) {\n\n\t\t\t\tif (blob['@model'] instanceof Object) {\n\t\t\t\t\tthis.model = blob['@model'];\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\tif (Object.keys(this.__objects).length !== Object.keys(blob['@objects']).length) {\n\n\t\t\t\tif (blob['@objects'] instanceof Object) {\n\n\t\t\t\t\tthis.__objects = {};\n\n\t\t\t\t\tfor (let o in blob['@objects']) {\n\t\t\t\t\t\tthis.__objects[o] = blob['@objects'][o];\n\t\t\t\t\t}\n\n\n\t\t\t\t\tif (silent === false) {\n\t\t\t\t\t\tthis.trigger('sync', [ this.__objects ]);\n\t\t\t\t\t}\n\n\n\t\t\t\t\treturn true;\n\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t}\n\n\n\t\treturn false;\n\n\t};\n\n\tconst _write_storage = function(silent) {\n\n\t\tsilent = silent === true;\n\n\n\t\tlet operations = this.__operations;\n\t\tif (operations.length > 0) {\n\n\t\t\twhile (operations.length > 0) {\n\n\t\t\t\tlet operation = operations.shift();\n\t\t\t\tif (operation.type === 'update') {\n\n\t\t\t\t\tif (this.__objects[operation.id] !== operation.object) {\n\t\t\t\t\t\tthis.__objects[operation.id] = operation.object;\n\t\t\t\t\t}\n\n\t\t\t\t} else if (operation.type === 'remove') {\n\n\t\t\t\t\tif (this.__objects[operation.id] !== undefined) {\n\t\t\t\t\t\tdelete this.__objects[operation.id];\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\tlet id   = this.id;\n\t\t\tlet blob = {\n\t\t\t\t'@model':   this.model,\n\t\t\t\t'@objects': this.__objects\n\t\t\t};\n\n\n\t\t\tlet type = this.type;\n\t\t\tif (type === Composite.TYPE.persistent) {\n\n\t\t\t\t_PERSISTENT.data[id] = blob;\n\t\t\t\t_PERSISTENT.write();\n\n\t\t\t} else if (type === Composite.TYPE.temporary) {\n\n\t\t\t\t_TEMPORARY.data[id] = blob;\n\n\t\t\t}\n\n\n\t\t\tif (silent === false) {\n\t\t\t\tthis.trigger('sync', [ this.__objects ]);\n\t\t\t}\n\n\n\t\t\treturn true;\n\n\t\t}\n\n\n\t\treturn false;\n\n\t};\n\n\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tconst Composite = function(data) {\n\n\t\tlet states = Object.assign({}, data);\n\n\n\t\tthis.id    = 'lychee-Storage-' + _id++;\n\t\tthis.model = {};\n\t\tthis.type  = Composite.TYPE.persistent;\n\n\n\t\tthis.__objects    = {};\n\t\tthis.__operations = [];\n\n\n\t\tthis.setId(states.id);\n\t\tthis.setModel(states.model);\n\t\tthis.setType(states.type);\n\n\n\t\t_Emitter.call(this);\n\n\t\tstates = null;\n\n\n\n\t\t/*\n\t\t * INITIALIZATION\n\t\t */\n\n\t\t_read_storage.call(this);\n\n\t};\n\n\n\tComposite.TYPE = {\n\t\tpersistent: 0,\n\t\ttemporary:  1\n\t};\n\n\n\tComposite.prototype = {\n\n\t\t/*\n\t\t * ENTITY API\n\t\t */\n\n\t\tsync: function(silent) {\n\n\t\t\tsilent = silent === true;\n\n\n\t\t\tlet result = false;\n\n\n\t\t\tif (this.__operations.length > 0) {\n\t\t\t\tresult = _write_storage.call(this, silent);\n\t\t\t} else {\n\t\t\t\tresult = _read_storage.call(this, silent);\n\t\t\t}\n\n\n\t\t\treturn result;\n\n\t\t},\n\n\t\tdeserialize: function(blob) {\n\n\t\t\tif (blob.objects instanceof Object) {\n\n\t\t\t\tthis.__objects = {};\n\n\t\t\t\tfor (let o in blob.objects) {\n\n\t\t\t\t\tlet object = blob.objects[o];\n\n\t\t\t\t\tif (lychee.interfaceof(this.model, object)) {\n\t\t\t\t\t\tthis.__objects[o] = object;\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t},\n\n\t\tserialize: function() {\n\n\t\t\tlet data = _Emitter.prototype.serialize.call(this);\n\t\t\tdata['constructor'] = 'lychee.Storage';\n\n\t\t\tlet states = {};\n\t\t\tlet blob   = (data['blob'] || {});\n\n\n\t\t\tif (this.id.startsWith('lychee-Storage-') === false) states.id    = this.id;\n\t\t\tif (Object.keys(this.model).length !== 0)            states.model = this.model;\n\t\t\tif (this.type !== Composite.TYPE.persistent)         states.type  = this.type;\n\n\n\t\t\tif (Object.keys(this.__objects).length > 0) {\n\n\t\t\t\tblob.objects = {};\n\n\t\t\t\tfor (let o in this.__objects) {\n\n\t\t\t\t\tlet object = this.__objects[o];\n\t\t\t\t\tif (object instanceof Object) {\n\t\t\t\t\t\tblob.objects[o] = _JSON.decode(_JSON.encode(object));\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\tdata['arguments'][0] = states;\n\t\t\tdata['blob']         = Object.keys(blob).length > 0 ? blob : null;\n\n\n\t\t\treturn data;\n\n\t\t},\n\n\n\n\t\t/*\n\t\t * CUSTOM API\n\t\t */\n\n\t\tcreate: function() {\n\t\t\treturn lychee.assignunlink({}, this.model);\n\t\t},\n\n\t\tfilter: function(callback, scope) {\n\n\t\t\tcallback = callback instanceof Function ? callback : null;\n\t\t\tscope    = scope !== undefined          ? scope    : this;\n\n\n\t\t\tlet filtered = [];\n\n\n\t\t\tif (callback !== null) {\n\n\t\t\t\tfor (let o in this.__objects) {\n\n\t\t\t\t\tlet object = this.__objects[o];\n\n\t\t\t\t\tif (callback.call(scope, object, o) === true) {\n\t\t\t\t\t\tfiltered.push(object);\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\n\t\t\t}\n\n\n\t\t\treturn filtered;\n\n\t\t},\n\n\t\tread: function(id) {\n\n\t\t\tid = typeof id === 'string' ? id : null;\n\n\n\t\t\tif (id !== null) {\n\n\t\t\t\tlet object = this.__objects[id] || null;\n\t\t\t\tif (object !== null) {\n\t\t\t\t\treturn object;\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\treturn null;\n\n\t\t},\n\n\t\tremove: function(id) {\n\n\t\t\tid = typeof id === 'string' ? id : null;\n\n\n\t\t\tif (id !== null) {\n\n\t\t\t\tlet object = this.__objects[id] || null;\n\t\t\t\tif (object !== null) {\n\n\t\t\t\t\tthis.__operations.push({\n\t\t\t\t\t\ttype:   'remove',\n\t\t\t\t\t\tid:     id,\n\t\t\t\t\t\tobject: object\n\t\t\t\t\t});\n\n\n\t\t\t\t\t_write_storage.call(this);\n\n\t\t\t\t\treturn true;\n\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t},\n\n\t\twrite: function(id, object) {\n\n\t\t\tid     = typeof id === 'string'                    ? id     : null;\n\t\t\tobject = lychee.diff(this.model, object) === false ? object : null;\n\n\n\t\t\tif (id !== null && object !== null) {\n\n\t\t\t\tthis.__operations.push({\n\t\t\t\t\ttype:   'update',\n\t\t\t\t\tid:     id,\n\t\t\t\t\tobject: object\n\t\t\t\t});\n\n\n\t\t\t\t_write_storage.call(this);\n\n\t\t\t\treturn true;\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t},\n\n\t\tsetId: function(id) {\n\n\t\t\tid = typeof id === 'string' ? id : null;\n\n\n\t\t\tif (id !== null) {\n\n\t\t\t\tthis.id = id;\n\n\t\t\t\treturn true;\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t},\n\n\t\tsetModel: function(model) {\n\n\t\t\tmodel = model instanceof Object ? model : null;\n\n\n\t\t\tif (model !== null) {\n\n\t\t\t\tthis.model = _JSON.decode(_JSON.encode(model));\n\n\t\t\t\treturn true;\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t},\n\n\t\tsetType: function(type) {\n\n\t\t\ttype = lychee.enumof(Composite.TYPE, type) ? type : null;\n\n\n\t\t\tif (type !== null) {\n\n\t\t\t\tthis.type = type;\n\n\t\t\t\treturn true;\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t}\n\n\t};\n\n\n\treturn Composite;\n\n}"
					}
				},
				"lychee.net.Remote": {
					"constructor": "lychee.Definition",
					"arguments": [
						{
							"id": "lychee.net.Remote",
							"url": "/libraries/lychee/source/net/Remote.js"
						}
					],
					"blob": {
						"attaches": {},
						"requires": [
							"lychee.net.service.Debugger",
							"lychee.net.service.Stash",
							"lychee.net.service.Storage"
						],
						"includes": [
							"lychee.net.Tunnel"
						],
						"exports": "(lychee, global, attachments) => {\n\n\tconst _Debugger = lychee.import('lychee.net.service.Debugger');\n\tconst _Stash    = lychee.import('lychee.net.service.Stash');\n\tconst _Storage  = lychee.import('lychee.net.service.Storage');\n\tconst _Tunnel   = lychee.import('lychee.net.Tunnel');\n\n\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tconst Composite = function(data) {\n\n\t\tlet states = Object.assign({}, data);\n\n\n\t\tstates.type = 'remote';\n\n\t\t_Tunnel.call(this, states);\n\n\t\tstates = null;\n\n\n\n\t\t/*\n\t\t * INITIALIZATION\n\t\t */\n\n\t\tif (lychee.debug === true) {\n\n\t\t\tthis.bind('connect', function() {\n\n\t\t\t\tthis.addService(new _Debugger({\n\t\t\t\t\tid: 'debugger',\n\t\t\t\t\ttunnel: this\n\t\t\t\t}));\n\n\t\t\t}, this);\n\n\t\t}\n\n\n\t\tthis.bind('connect', function() {\n\n\t\t\tthis.addService(new _Stash({\n\t\t\t\tid: 'stash',\n\t\t\t\ttunnel: this\n\t\t\t}));\n\n\t\t\tthis.addService(new _Storage({\n\t\t\t\tid: 'storage',\n\t\t\t\ttunnel: this\n\t\t\t}));\n\n\t\t}, this);\n\n\t};\n\n\n\tComposite.prototype = {\n\n\t\t/*\n\t\t * ENTITY API\n\t\t */\n\n\t\t// deserialize: function(blob) {},\n\n\t\tserialize: function() {\n\n\t\t\tlet data = _Tunnel.prototype.serialize.call(this);\n\t\t\tdata['constructor'] = 'lychee.net.Remote';\n\n\n\t\t\treturn data;\n\n\t\t}\n\n\t};\n\n\n\treturn Composite;\n\n}"
					}
				},
				"lychee.net.Service": {
					"constructor": "lychee.Definition",
					"arguments": [
						{
							"id": "lychee.net.Service",
							"url": "/libraries/lychee/source/net/Service.js"
						}
					],
					"blob": {
						"attaches": {},
						"includes": [
							"lychee.event.Emitter"
						],
						"exports": "(lychee, global, attachments) => {\n\n\tlet   _id       = 0;\n\tconst _Emitter  = lychee.import('lychee.event.Emitter');\n\tconst _SERVICES = {};\n\tlet   _Tunnel   = null;\n\n\n\n\t/*\n\t * HELPERS\n\t */\n\n\tconst _plug_broadcast = function() {\n\n\t\tlet id = this.id;\n\t\tif (id !== null) {\n\n\t\t\tlet cache = _SERVICES[id] || null;\n\t\t\tif (cache === null) {\n\t\t\t\tcache = _SERVICES[id] = [];\n\t\t\t}\n\n\n\t\t\tlet found = false;\n\n\t\t\tfor (let c = 0, cl = cache.length; c < cl; c++) {\n\n\t\t\t\tif (cache[c] === this) {\n\t\t\t\t\tfound = true;\n\t\t\t\t\tbreak;\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\tif (found === false) {\n\t\t\t\tcache.push(this);\n\t\t\t}\n\n\t\t}\n\n\t};\n\n\tconst _unplug_broadcast = function() {\n\n\t\tthis.setMulticast([]);\n\n\n\t\tlet id = this.id;\n\t\tif (id !== null) {\n\n\t\t\tlet cache = _SERVICES[id] || null;\n\t\t\tif (cache !== null) {\n\n\t\t\t\tfor (let c = 0, cl = cache.length; c < cl; c++) {\n\n\t\t\t\t\tif (cache[c] === this) {\n\t\t\t\t\t\tcache.splice(c, 1);\n\t\t\t\t\t\tbreak;\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t}\n\n\t};\n\n\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tconst Composite = function(data) {\n\n\t\tlet states = Object.assign({}, data);\n\n\n\t\tthis.id     = 'lychee-net-Service-' + _id++;\n\t\tthis.tunnel = null;\n\n\t\tthis.__multicast = [];\n\n\n\t\t// XXX: Circular Dependency Problem\n\t\tif (_Tunnel === null) {\n\t\t\t_Tunnel = lychee.import('lychee.net.Tunnel');\n\t\t}\n\n\n\t\tthis.setId(states.id);\n\t\tthis.setTunnel(states.tunnel);\n\n\n\t\t_Emitter.call(this);\n\n\t\tstates = null;\n\n\t};\n\n\n\tComposite.prototype = {\n\n\t\t/*\n\t\t * ENTITY API\n\t\t */\n\n\t\t// deserialize: function(blob) {},\n\n\t\tserialize: function() {\n\n\t\t\tlet data = _Emitter.prototype.serialize.call(this);\n\t\t\tdata['constructor'] = 'lychee.net.Service';\n\n\t\t\tlet states = (data['arguments'][0] || {});\n\t\t\tlet blob   = (data['blob'] || {});\n\n\n\t\t\tif (this.id !== null) states.id = this.id;\n\n\n\t\t\tlet tunnel = this.tunnel;\n\t\t\tif (tunnel !== null) {\n\n\t\t\t\tif (tunnel.type === 'client') {\n\t\t\t\t\tstates.tunnel = '#MAIN.client';\n\t\t\t\t} else {\n\t\t\t\t\tstates.tunnel = null;\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\tdata['arguments'][0] = states;\n\t\t\tdata['blob']         = Object.keys(blob).length > 0 ? blob : null;\n\n\n\t\t\treturn data;\n\n\t\t},\n\n\n\n\t\t/*\n\t\t * SERVICE API\n\t\t */\n\n\t\tmulticast: function(data, service) {\n\n\t\t\tdata    = data instanceof Object    ? data    : null;\n\t\t\tservice = service instanceof Object ? service : null;\n\n\n\t\t\tlet tunnel = this.tunnel;\n\t\t\tif (tunnel !== null && data !== null) {\n\n\t\t\t\tlet type = tunnel.type;\n\t\t\t\tif (type === 'client') {\n\n\t\t\t\t\tif (service !== null) {\n\n\t\t\t\t\t\tif (typeof service.id !== 'string') {\n\t\t\t\t\t\t\tservice.id = this.id;\n\t\t\t\t\t\t}\n\n\t\t\t\t\t} else if (service === null) {\n\n\t\t\t\t\t\tservice = {\n\t\t\t\t\t\t\tid:    this.id,\n\t\t\t\t\t\t\tevent: 'multicast'\n\t\t\t\t\t\t};\n\n\t\t\t\t\t}\n\n\n\t\t\t\t\ttunnel.send({\n\t\t\t\t\t\tdata:    data,\n\t\t\t\t\t\tservice: service\n\t\t\t\t\t}, {\n\t\t\t\t\t\tid:     this.id,\n\t\t\t\t\t\tmethod: 'multicast'\n\t\t\t\t\t});\n\n\n\t\t\t\t\treturn true;\n\n\t\t\t\t} else if (type === 'remote') {\n\n\t\t\t\t\t// Allow method calls from remote side\n\t\t\t\t\tif (data !== null && service !== null) {\n\n\t\t\t\t\t\tdata = {\n\t\t\t\t\t\t\tdata:    data,\n\t\t\t\t\t\t\tservice: service\n\t\t\t\t\t\t};\n\n\t\t\t\t\t}\n\n\n\t\t\t\t\tif (data.service !== null) {\n\n\t\t\t\t\t\tfor (let m = 0, ml = this.__multicast.length; m < ml; m++) {\n\n\t\t\t\t\t\t\tlet other = this.__multicast[m];\n\t\t\t\t\t\t\tif (other !== this.tunnel) {\n\n\t\t\t\t\t\t\t\tdata.data.tid = this.tunnel.id;\n\n\t\t\t\t\t\t\t\tother.send(\n\t\t\t\t\t\t\t\t\tdata.data,\n\t\t\t\t\t\t\t\t\tdata.service\n\t\t\t\t\t\t\t\t);\n\n\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t}\n\n\t\t\t\t\t\treturn true;\n\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t},\n\n\t\tbroadcast: function(data, service) {\n\n\t\t\tdata    = data instanceof Object    ? data    : null;\n\t\t\tservice = service instanceof Object ? service : null;\n\n\n\t\t\tlet tunnel = this.tunnel;\n\t\t\tif (tunnel !== null && data !== null) {\n\n\t\t\t\tlet type = tunnel.type;\n\t\t\t\tif (type === 'client') {\n\n\t\t\t\t\tif (service !== null) {\n\n\t\t\t\t\t\tif (typeof service.id !== 'string') {\n\t\t\t\t\t\t\tservice.id = this.id;\n\t\t\t\t\t\t}\n\n\t\t\t\t\t} else {\n\n\t\t\t\t\t\tservice = {\n\t\t\t\t\t\t\tid:    this.id,\n\t\t\t\t\t\t\tevent: 'broadcast'\n\t\t\t\t\t\t};\n\n\t\t\t\t\t}\n\n\t\t\t\t\ttunnel.send({\n\t\t\t\t\t\tdata:    data,\n\t\t\t\t\t\tservice: service\n\t\t\t\t\t}, {\n\t\t\t\t\t\tid:     this.id,\n\t\t\t\t\t\tmethod: 'broadcast'\n\t\t\t\t\t});\n\n\n\t\t\t\t\treturn true;\n\n\t\t\t\t} else if (type === 'remote') {\n\n\t\t\t\t\t// XXX: Allow method calls from remote side\n\t\t\t\t\tif (data !== null && service !== null) {\n\n\t\t\t\t\t\tdata = {\n\t\t\t\t\t\t\tdata:    data,\n\t\t\t\t\t\t\tservice: service\n\t\t\t\t\t\t};\n\n\t\t\t\t\t}\n\n\n\t\t\t\t\tif (data.service !== null) {\n\n\t\t\t\t\t\tlet broadcast = _SERVICES[this.id] || null;\n\t\t\t\t\t\tif (broadcast !== null) {\n\n\t\t\t\t\t\t\tfor (let b = 0, bl = broadcast.length; b < bl; b++) {\n\n\t\t\t\t\t\t\t\tlet other = broadcast[b].tunnel;\n\t\t\t\t\t\t\t\tif (other !== this.tunnel) {\n\n\t\t\t\t\t\t\t\t\tdata.data.tid = this.tunnel.id;\n\n\t\t\t\t\t\t\t\t\tother.send(\n\t\t\t\t\t\t\t\t\t\tdata.data,\n\t\t\t\t\t\t\t\t\t\tdata.service\n\t\t\t\t\t\t\t\t\t);\n\n\t\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t\treturn true;\n\n\t\t\t\t\t\t}\n\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t},\n\n\t\taccept: function(message, blob) {\n\n\t\t\tmessage = typeof message === 'string' ? message : null;\n\t\t\tblob    = blob instanceof Object      ? blob    : null;\n\n\n\t\t\tif (message !== null) {\n\n\t\t\t\tlet tunnel = this.tunnel;\n\t\t\t\tif (tunnel !== null) {\n\n\t\t\t\t\ttunnel.send({\n\t\t\t\t\t\tmessage: message,\n\t\t\t\t\t\tblob:    blob\n\t\t\t\t\t}, {\n\t\t\t\t\t\tid:    this.id,\n\t\t\t\t\t\tevent: 'success'\n\t\t\t\t\t});\n\n\t\t\t\t\treturn true;\n\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t},\n\n\t\treject: function(message, blob) {\n\n\t\t\tmessage = typeof message === 'string' ? message : null;\n\t\t\tblob    = blob instanceof Object      ? blob    : null;\n\n\n\t\t\tif (message !== null) {\n\n\t\t\t\tlet tunnel = this.tunnel;\n\t\t\t\tif (tunnel !== null) {\n\n\t\t\t\t\ttunnel.send({\n\t\t\t\t\t\tmessage: message,\n\t\t\t\t\t\tblob:    blob\n\t\t\t\t\t}, {\n\t\t\t\t\t\tid:    this.id,\n\t\t\t\t\t\tevent: 'error'\n\t\t\t\t\t});\n\n\t\t\t\t\treturn true;\n\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t},\n\n\t\tsend: function(data, service) {\n\n\t\t\tdata    = data instanceof Object    ? data    : null;\n\t\t\tservice = service instanceof Object ? service : null;\n\n\n\t\t\tlet tunnel = this.tunnel;\n\t\t\tif (tunnel !== null && data !== null) {\n\n\t\t\t\tif (service !== null) {\n\n\t\t\t\t\tif (typeof service.id !== 'string') {\n\t\t\t\t\t\tservice.id = this.id;\n\t\t\t\t\t}\n\n\t\t\t\t\tlet result = tunnel.send(data, service);\n\t\t\t\t\tif (result === true) {\n\t\t\t\t\t\treturn true;\n\t\t\t\t\t}\n\n\t\t\t\t} else {\n\n\t\t\t\t\tlet result = tunnel.send(data);\n\t\t\t\t\tif (result === true) {\n\t\t\t\t\t\treturn true;\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t},\n\n\t\tsetId: function(id) {\n\n\t\t\tid = typeof id === 'string' ? id : null;\n\n\n\t\t\tif (id !== null) {\n\n\t\t\t\tthis.id = id;\n\n\t\t\t\treturn true;\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t},\n\n\t\tsetMulticast: function(multicast) {\n\n\t\t\tmulticast = multicast instanceof Array ? multicast : null;\n\n\n\t\t\tif (multicast !== null) {\n\n\t\t\t\tthis.__multicast = multicast.filter(instance => lychee.interfaceof(_Tunnel, instance));\n\n\t\t\t\treturn true;\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t},\n\n\t\tsetTunnel: function(tunnel) {\n\n\t\t\ttunnel = lychee.interfaceof(_Tunnel, tunnel) ? tunnel : null;\n\n\n\t\t\tif (tunnel !== null) {\n\n\t\t\t\tif (this.tunnel !== null) {\n\n\t\t\t\t\tif (tunnel.type === 'client') {\n\n\t\t\t\t\t\tif (this.has('plug', _plug_broadcast, this) === true) {\n\t\t\t\t\t\t\tthis.unbind('plug', _plug_broadcast, this);\n\t\t\t\t\t\t}\n\n\t\t\t\t\t\tif (this.has('unplug', _unplug_broadcast, this) === true) {\n\t\t\t\t\t\t\tthis.unbind('unplug', _unplug_broadcast, this);\n\t\t\t\t\t\t}\n\n\t\t\t\t\t} else if (tunnel.type === 'remote') {\n\n\t\t\t\t\t\tif (this.has('plug', _plug_broadcast, this) === false) {\n\t\t\t\t\t\t\tthis.bind('plug', _plug_broadcast, this);\n\t\t\t\t\t\t}\n\n\t\t\t\t\t\tif (this.has('unplug', _unplug_broadcast, this) === false) {\n\t\t\t\t\t\t\tthis.bind('unplug', _unplug_broadcast, this);\n\t\t\t\t\t\t}\n\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t\tthis.tunnel = tunnel;\n\n\t\t\t\treturn true;\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t}\n\n\t};\n\n\n\treturn Composite;\n\n}"
					}
				},
				"harvester.data.Package": {
					"constructor": "lychee.Definition",
					"arguments": [
						{
							"id": "harvester.data.Package",
							"url": "/libraries/harvester/source/data/Package.js"
						}
					],
					"blob": {
						"attaches": {},
						"exports": "(lychee, global, attachments) => {\n\n\t/*\n\t * HELPERS\n\t */\n\n\tconst _parse_buffer = function() {\n\n\t\tlet json = null;\n\n\t\ttry {\n\t\t\tjson = JSON.parse(this.buffer.toString('utf8'));\n\t\t} catch (err) {\n\t\t}\n\n\n\t\tif (json instanceof Object) {\n\n\t\t\tif (json.api instanceof Object) {\n\n\t\t\t\tif (json.api.files instanceof Object) {\n\t\t\t\t\t_walk_directory(this.api, json.api.files, '');\n\t\t\t\t}\n\n\t\t\t} else {\n\n\t\t\t\tjson.api = {\n\t\t\t\t\tfiles: {}\n\t\t\t\t};\n\n\t\t\t}\n\n\n\t\t\tif (json.build instanceof Object) {\n\n\t\t\t\tif (json.build.files instanceof Object) {\n\t\t\t\t\t_walk_directory(this.build, json.build.files, '');\n\t\t\t\t}\n\n\t\t\t} else {\n\n\t\t\t\tjson.build = {\n\t\t\t\t\tenvironments: {},\n\t\t\t\t\tfiles:        {}\n\t\t\t\t};\n\n\t\t\t}\n\n\n\t\t\tif (json.review instanceof Object) {\n\n\t\t\t\tif (json.review.files instanceof Object) {\n\t\t\t\t\t_walk_directory(this.review, json.review.files, '');\n\t\t\t\t}\n\n\t\t\t} else {\n\n\t\t\t\tjson.review = {\n\t\t\t\t\tenvironments: {},\n\t\t\t\t\tfiles:        {}\n\t\t\t\t};\n\n\t\t\t}\n\n\n\t\t\tif (json.source instanceof Object) {\n\n\t\t\t\tif (json.source.files instanceof Object) {\n\t\t\t\t\t_walk_directory(this.source, json.source.files, '');\n\t\t\t\t}\n\n\t\t\t} else {\n\n\t\t\t\tjson.source = {\n\t\t\t\t\tenvironments: {},\n\t\t\t\t\tfiles:        {},\n\t\t\t\t\ttags:         {}\n\t\t\t\t};\n\n\t\t\t}\n\n\n\t\t\tthis.json = json;\n\n\t\t}\n\n\t};\n\n\tconst _walk_directory = function(files, node, path) {\n\n\t\tif (node instanceof Array) {\n\n\t\t\tnode.forEach(ext => {\n\n\t\t\t\tif (/(msc|snd)$/.test(ext)) {\n\n\t\t\t\t\tif (files.indexOf(path + '.' + ext) === -1) {\n\t\t\t\t\t\tfiles.push(path + '.' + ext);\n\t\t\t\t\t}\n\n\t\t\t\t} else if (/(js|json|fnt|png)$/.test(ext)) {\n\n\t\t\t\t\tif (files.indexOf(path + '.' + ext) === -1) {\n\t\t\t\t\t\tfiles.push(path + '.' + ext);\n\t\t\t\t\t}\n\n\t\t\t\t} else if (/(md|tpl)$/.test(ext)) {\n\n\t\t\t\t\tif (files.indexOf(path + '.' + ext) === -1) {\n\t\t\t\t\t\tfiles.push(path + '.' + ext);\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t});\n\n\t\t} else if (node instanceof Object) {\n\t\t\tObject.keys(node).forEach(child => _walk_directory(files, node[child], path + '/' + child));\n\t\t}\n\n\t};\n\n\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tconst Composite = function(data) {\n\n\t\tlet states = Object.assign({}, data);\n\n\n\t\tthis.buffer = null;\n\n\t\tthis.api    = [];\n\t\tthis.build  = [];\n\t\tthis.review = [];\n\t\tthis.source = [];\n\t\tthis.json   = {};\n\n\n\t\tthis.setBuffer(states.buffer);\n\n\t\tstates = null;\n\n\t};\n\n\n\tComposite.prototype = {\n\n\t\t/*\n\t\t * ENTITY API\n\t\t */\n\n\t\tdeserialize: function(blob) {\n\n\t\t\tlet buffer = lychee.deserialize(blob.buffer);\n\t\t\tif (buffer !== null) {\n\t\t\t\tthis.setBuffer(buffer);\n\t\t\t}\n\n\t\t},\n\n\t\tserialize: function() {\n\n\t\t\tlet blob = {};\n\n\n\t\t\tif (this.buffer !== null) blob.buffer = lychee.serialize(this.buffer);\n\n\n\t\t\treturn {\n\t\t\t\t'constructor': 'harvester.data.Package',\n\t\t\t\t'arguments':   [ null ],\n\t\t\t\t'blob':        Object.keys(blob).length > 0 ? blob : null\n\t\t\t};\n\n\t\t},\n\n\n\n\t\t/*\n\t\t * CUSTOM API\n\t\t */\n\n\t\tsetBuffer: function(buffer) {\n\n\t\t\tbuffer = buffer instanceof Buffer ? buffer : null;\n\n\n\t\t\tif (buffer !== null) {\n\n\t\t\t\tthis.buffer = buffer;\n\t\t\t\t_parse_buffer.call(this);\n\n\n\t\t\t\treturn true;\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t}\n\n\t};\n\n\n\treturn Composite;\n\n}"
					}
				},
				"harvester.data.Server": {
					"constructor": "lychee.Definition",
					"arguments": [
						{
							"id": "harvester.data.Server",
							"url": "/libraries/harvester/source/data/Server.js"
						}
					],
					"blob": {
						"attaches": {},
						"exports": "(lychee, global, attachments) => {\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tconst Composite = function(data) {\n\n\t\tlet states = Object.assign({}, data);\n\n\n\t\tthis.host = typeof states.host === 'string' ? states.host : null;\n\t\tthis.port = typeof states.port === 'number' ? states.port : null;\n\n\t\tthis.__process = states.process || null;\n\n\n\t\tstates = null;\n\n\t};\n\n\n\tComposite.prototype = {\n\n\t\t/*\n\t\t * ENTITY API\n\t\t */\n\n\t\t// deserialize: function(blob) {},\n\n\t\tserialize: function() {\n\n\t\t\tlet states = {};\n\n\n\t\t\tif (this.host !== null) states.host = this.host;\n\t\t\tif (this.port !== null) states.port = this.port;\n\n\n\t\t\t// XXX: native process instance can't be serialized :(\n\n\n\t\t\treturn {\n\t\t\t\t'constructor': 'harvester.data.Server',\n\t\t\t\t'arguments':   [ states ]\n\t\t\t};\n\n\t\t},\n\n\n\n\t\t/*\n\t\t * CUSTOM API\n\t\t */\n\n\t\tdestroy: function() {\n\n\t\t\tif (this.__process !== null) {\n\n\t\t\t\tthis.__process.destroy();\n\t\t\t\tthis.__process = null;\n\n\t\t\t}\n\n\n\t\t\tthis.host = null;\n\t\t\tthis.port = null;\n\n\n\t\t\treturn true;\n\n\t\t}\n\n\t};\n\n\n\treturn Composite;\n\n}"
					}
				},
				"harvester.net.Client": {
					"constructor": "lychee.Definition",
					"arguments": [
						{
							"id": "harvester.net.Client",
							"url": "/libraries/harvester/source/net/Client.js"
						}
					],
					"blob": {
						"attaches": {},
						"requires": [
							"harvester.net.service.Console",
							"harvester.net.service.Harvester",
							"harvester.net.service.Library",
							"harvester.net.service.Profile",
							"harvester.net.service.Project",
							"harvester.net.service.Server",
							"lychee.codec.BENCODE",
							"lychee.codec.BITON",
							"lychee.codec.JSON",
							"lychee.net.Client"
						],
						"includes": [
							"lychee.net.Tunnel"
						],
						"exports": "(lychee, global, attachments) => {\n\n\tconst _Client  = lychee.import('lychee.net.Client');\n\tconst _Tunnel  = lychee.import('lychee.net.Tunnel');\n\tconst _BENCODE = lychee.import('lychee.codec.BENCODE');\n\tconst _BITON   = lychee.import('lychee.codec.BITON');\n\tconst _JSON    = lychee.import('lychee.codec.JSON');\n\tconst _service = lychee.import('harvester.net.service');\n\n\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tconst Composite = function(data) {\n\n\t\tlet states = Object.assign({\n\t\t\tcodec:     _JSON,\n\t\t\thost:      'localhost',\n\t\t\tport:      4848,\n\t\t\tprotocol:  _Tunnel.PROTOCOL.HTTP,\n\t\t\treconnect: 10000\n\t\t}, data);\n\n\n\t\tstates.type = 'client';\n\n\t\t_Tunnel.call(this, states);\n\n\t\tstates = null;\n\n\n\n\t\t/*\n\t\t * INITIALIZATION\n\t\t */\n\n\t\tthis.bind('connect', function() {\n\n\t\t\tthis.addService(new _service.Console({\n\t\t\t\tid: 'console',\n\t\t\t\ttunnel: this\n\t\t\t}));\n\n\t\t\tthis.addService(new _service.Harvester({\n\t\t\t\tid: 'harvester',\n\t\t\t\ttunnel: this\n\t\t\t}));\n\n\t\t\tthis.addService(new _service.Library({\n\t\t\t\tid: 'library',\n\t\t\t\ttunnel: this\n\t\t\t}));\n\n\t\t\tthis.addService(new _service.Profile({\n\t\t\t\tid: 'profile',\n\t\t\t\ttunnel: this\n\t\t\t}));\n\n\t\t\tthis.addService(new _service.Project({\n\t\t\t\tid: 'project',\n\t\t\t\ttunnel: this\n\t\t\t}));\n\n\t\t\tthis.addService(new _service.Server({\n\t\t\t\tid: 'server',\n\t\t\t\ttunnel: this\n\t\t\t}));\n\n\n\t\t\tif (lychee.debug === true) {\n\t\t\t\tconsole.log('harvester.net.Client: Remote connected');\n\t\t\t}\n\n\t\t}, this);\n\n\t\tthis.bind('disconnect', code => {\n\n\t\t\tif (lychee.debug === true) {\n\t\t\t\tconsole.log('harvester.net.Client: Remote disconnected (' + code + ')');\n\t\t\t}\n\n\t\t}, this);\n\n\n\t\tthis.connect();\n\n\t};\n\n\n\tComposite.prototype = {\n\n\t\t/*\n\t\t * ENTITY API\n\t\t */\n\n\t\t// deserialize: function(blob) {},\n\n\t\tserialize: function() {\n\n\t\t\tlet data = _Tunnel.prototype.serialize.call(this);\n\t\t\tdata['constructor'] = 'harvester.net.Client';\n\n\n\t\t\treturn data;\n\n\t\t},\n\n\n\n\t\t/*\n\t\t * CUSTOM API\n\t\t */\n\n\t\tsend: function(data, headers) {\n\n\t\t\t// XXX: data can be Object, Buffer or String\n\n\t\t\tdata    = data !== undefined        ? data    : null;\n\t\t\theaders = headers instanceof Object ? headers : {};\n\n\n\t\t\tif (data instanceof Object) {\n\n\t\t\t\tlet codec = this.codec;\n\t\t\t\tif (codec === _BENCODE) {\n\t\t\t\t\theaders['content-type'] = 'application/bencode; charset=utf-8';\n\t\t\t\t} else if (codec === _BITON) {\n\t\t\t\t\theaders['content-type'] = 'application/biton; charset=binary';\n\t\t\t\t} else if (codec === _JSON) {\n\t\t\t\t\theaders['content-type'] = 'application/json; charset=utf-8';\n\t\t\t\t}\n\n\n\t\t\t\tif (/@plug|@unplug/g.test(headers.method) === false) {\n\n\t\t\t\t\tlet result = _Tunnel.prototype.send.call(this, data, headers);\n\t\t\t\t\tif (result === true) {\n\t\t\t\t\t\treturn true;\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t} else {\n\n\t\t\t\tlet payload = null;\n\n\t\t\t\tif (typeof data === 'string') {\n\t\t\t\t\tpayload = Buffer.from(data, 'utf8');\n\t\t\t\t} else if (data instanceof Buffer) {\n\t\t\t\t\tpayload = data;\n\t\t\t\t}\n\n\n\t\t\t\tif (payload instanceof Buffer) {\n\n\t\t\t\t\tthis.trigger('send', [ payload, headers ]);\n\n\t\t\t\t\treturn true;\n\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t}\n\n\t};\n\n\n\treturn Composite;\n\n}"
					}
				},
				"lychee.net.Tunnel": {
					"constructor": "lychee.Definition",
					"arguments": [
						{
							"id": "lychee.net.Tunnel",
							"url": "/libraries/lychee/source/net/Tunnel.js"
						}
					],
					"blob": {
						"attaches": {},
						"requires": [
							"lychee.net.socket.HTTP",
							"lychee.net.socket.WS",
							"lychee.codec.BENCODE",
							"lychee.codec.BITON",
							"lychee.codec.JSON",
							"lychee.net.Service"
						],
						"includes": [
							"lychee.event.Emitter"
						],
						"exports": "(lychee, global, attachments) => {\n\n\tconst _socket  = lychee.import('lychee.net.socket');\n\tconst _Emitter = lychee.import('lychee.event.Emitter');\n\tconst _Service = lychee.import('lychee.net.Service');\n\tconst _BENCODE = lychee.import('lychee.codec.BENCODE');\n\tconst _BITON   = lychee.import('lychee.codec.BITON');\n\tconst _JSON    = lychee.import('lychee.codec.JSON');\n\n\n\n\t/*\n\t * HELPERS\n\t */\n\n\tconst _plug_service = function(id, service) {\n\n\t\tid = typeof id === 'string' ? id : null;\n\n\t\tif (id === null || service === null) {\n\t\t\treturn;\n\t\t}\n\n\n\t\tlet found = false;\n\n\t\tfor (let w = 0, wl = this.__services.waiting.length; w < wl; w++) {\n\n\t\t\tif (this.__services.waiting[w] === service) {\n\t\t\t\tthis.__services.waiting.splice(w, 1);\n\t\t\t\tfound = true;\n\t\t\t\twl--;\n\t\t\t\tw--;\n\t\t\t}\n\n\t\t}\n\n\n\t\tif (found === true) {\n\n\t\t\tthis.__services.active.push(service);\n\n\t\t\tservice.trigger('plug');\n\n\t\t\tif (lychee.debug === true) {\n\t\t\t\tconsole.log('lychee.net.Tunnel: Remote plugged in Service (' + id + ')');\n\t\t\t}\n\n\t\t}\n\n\t};\n\n\tconst _unplug_service = function(id, service) {\n\n\t\tid = typeof id === 'string' ? id : null;\n\n\t\tif (id === null || service === null) {\n\t\t\treturn;\n\t\t}\n\n\n\t\tlet found = false;\n\n\t\tfor (let w = 0, wl = this.__services.waiting.length; w < wl; w++) {\n\n\t\t\tif (this.__services.waiting[w] === service) {\n\t\t\t\tthis.__services.waiting.splice(w, 1);\n\t\t\t\tfound = true;\n\t\t\t\twl--;\n\t\t\t\tw--;\n\t\t\t}\n\n\t\t}\n\n\t\tfor (let a = 0, al = this.__services.active.length; a < al; a++) {\n\n\t\t\tif (this.__services.active[a] === service) {\n\t\t\t\tthis.__services.active.splice(a, 1);\n\t\t\t\tfound = true;\n\t\t\t\tal--;\n\t\t\t\ta--;\n\t\t\t}\n\n\t\t}\n\n\n\t\tif (found === true) {\n\n\t\t\tservice.trigger('unplug');\n\n\t\t\tif (lychee.debug === true) {\n\t\t\t\tconsole.log('lychee.net.Tunnel: Remote unplugged Service (' + id + ')');\n\t\t\t}\n\n\t\t}\n\n\t};\n\n\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tconst Composite = function(data) {\n\n\t\tlet states = Object.assign({}, data);\n\n\n\t\tthis.id        = 'localhost:1337';\n\t\tthis.codec     = lychee.interfaceof(_JSON, states.codec) ? states.codec : _JSON;\n\t\tthis.host      = 'localhost';\n\t\tthis.port      = 1337;\n\t\tthis.protocol  = Composite.PROTOCOL.WS;\n\t\tthis.reconnect = 0;\n\t\tthis.type      = null;\n\n\n\t\tthis.__isConnected = false;\n\t\tthis.__socket      = null;\n\t\tthis.__services    = {\n\t\t\twaiting: [],\n\t\t\tactive:  []\n\t\t};\n\n\n\t\tthis.setHost(states.host);\n\t\tthis.setPort(states.port);\n\t\tthis.setProtocol(states.protocol);\n\t\tthis.setReconnect(states.reconnect);\n\t\tthis.setType(states.type);\n\n\n\t\t_Emitter.call(this);\n\n\t\tstates = null;\n\n\n\n\t\t/*\n\t\t * INITIALIZATION\n\t\t */\n\n\t\tthis.bind('connect', function() {\n\n\t\t\tthis.__isConnected = true;\n\n\t\t}, this);\n\n\t\tthis.bind('send', function(payload, headers) {\n\n\t\t\tif (this.__socket !== null) {\n\t\t\t\tthis.__socket.send(payload, headers);\n\t\t\t}\n\n\t\t}, this);\n\n\t\tthis.bind('disconnect', function() {\n\n\t\t\tthis.__isConnected = false;\n\n\n\t\t\tfor (let a = 0, al = this.__services.active.length; a < al; a++) {\n\t\t\t\tthis.__services.active[a].trigger('unplug');\n\t\t\t}\n\n\t\t\tthis.__services.active  = [];\n\t\t\tthis.__services.waiting = [];\n\n\n\t\t\tif (this.reconnect > 0) {\n\t\t\t\tsetTimeout(_ => this.trigger('connect'), this.reconnect);\n\t\t\t}\n\n\t\t}, this);\n\n\t};\n\n\n\tComposite.PROTOCOL = {\n\t\tWS:   0,\n\t\tHTTP: 1,\n\t\tTCP:  2\n\t};\n\n\n\tComposite.prototype = {\n\n\t\t/*\n\t\t * ENTITY API\n\t\t */\n\n\t\tdeserialize: function(blob) {\n\n\t\t\tlet socket = lychee.deserialize(blob.socket);\n\t\t\tif (socket !== null) {\n\t\t\t\tthis.__socket = socket;\n\t\t\t}\n\n\n\t\t\tif (blob.services instanceof Array) {\n\n\t\t\t\tfor (let s = 0, sl = blob.services.length; s < sl; s++) {\n\t\t\t\t\tthis.addService(lychee.deserialize(blob.services[s]));\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t},\n\n\t\tserialize: function() {\n\n\t\t\tlet data = _Emitter.prototype.serialize.call(this);\n\t\t\tdata['constructor'] = 'lychee.net.Tunnel';\n\n\t\t\tlet states = {};\n\t\t\tlet blob   = (data['blob'] || {});\n\n\n\t\t\tif (this.codec !== _JSON)                    states.codec     = lychee.serialize(this.codec);\n\t\t\tif (this.host !== 'localhost')               states.host      = this.host;\n\t\t\tif (this.port !== 1337)                      states.port      = this.port;\n\t\t\tif (this.protocol !== Composite.PROTOCOL.WS) states.protocol  = this.protocol;\n\t\t\tif (this.reconnect !== 0)                    states.reconnect = this.reconnect;\n\t\t\tif (this.type !== null)                      states.type      = this.type;\n\n\n\t\t\tif (this.__socket !== null) blob.socket = lychee.serialize(this.__socket);\n\n\n\t\t\tif (this.__services.active.length > 0) {\n\n\t\t\t\tblob.services = [];\n\n\t\t\t\tfor (let a = 0, al = this.__services.active.length; a < al; a++) {\n\n\t\t\t\t\tlet service = this.__services.active[a];\n\n\t\t\t\t\tblob.services.push(lychee.serialize(service));\n\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\tdata['arguments'][0] = states;\n\t\t\tdata['blob']         = Object.keys(blob).length > 0 ? blob : null;\n\n\n\t\t\treturn data;\n\n\t\t},\n\n\n\n\t\t/*\n\t\t * CUSTOM API\n\t\t */\n\n\t\tconnect: function(connection) {\n\n\t\t\tconnection = typeof connection === 'object' ? connection : null;\n\n\n\t\t\tif (this.__isConnected === false) {\n\n\t\t\t\tlet protocol = this.protocol;\n\t\t\t\tif (protocol === Composite.PROTOCOL.WS) {\n\t\t\t\t\tthis.__socket = new _socket.WS();\n\t\t\t\t} else if (protocol === Composite.PROTOCOL.HTTP) {\n\t\t\t\t\tthis.__socket = new _socket.HTTP();\n\t\t\t\t} else if (protocol === Composite.PROTOCOL.TCP) {\n\t\t\t\t\tthis.__socket = new _socket.TCP();\n\t\t\t\t}\n\n\n\t\t\t\tthis.__socket.bind('connect', function() {\n\t\t\t\t\tthis.trigger('connect');\n\t\t\t\t}, this);\n\n\t\t\t\tthis.__socket.bind('receive', function(payload, headers) {\n\t\t\t\t\tthis.receive(payload, headers);\n\t\t\t\t}, this);\n\n\t\t\t\tthis.__socket.bind('disconnect', function() {\n\t\t\t\t\tthis.disconnect();\n\t\t\t\t}, this);\n\n\t\t\t\tthis.__socket.bind('error', function() {\n\t\t\t\t\tthis.setReconnect(0);\n\t\t\t\t\tthis.disconnect();\n\t\t\t\t}, this);\n\n\n\t\t\t\tthis.__socket.connect(this.host, this.port, connection);\n\n\n\t\t\t\treturn true;\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t},\n\n\t\tdisconnect: function() {\n\n\t\t\tif (this.__isConnected === true) {\n\n\t\t\t\tlet socket = this.__socket;\n\t\t\t\tif (socket !== null) {\n\n\t\t\t\t\tsocket.unbind('connect');\n\t\t\t\t\tsocket.unbind('receive');\n\t\t\t\t\tsocket.unbind('disconnect');\n\t\t\t\t\tsocket.unbind('error');\n\t\t\t\t\tsocket.disconnect();\n\t\t\t\t\tthis.__socket = null;\n\n\t\t\t\t}\n\n\n\t\t\t\tthis.trigger('disconnect');\n\n\n\t\t\t\treturn true;\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t},\n\n\t\tsend: function(data, headers) {\n\n\t\t\tdata    = data instanceof Object    ? data    : null;\n\t\t\theaders = headers instanceof Object ? headers : {};\n\n\n\t\t\tif (data === null) {\n\t\t\t\treturn false;\n\t\t\t}\n\n\n\t\t\tif (typeof headers.id     === 'string') headers['@service-id']     = headers.id;\n\t\t\tif (typeof headers.event  === 'string') headers['@service-event']  = headers.event;\n\t\t\tif (typeof headers.method === 'string') headers['@service-method'] = headers.method;\n\n\n\t\t\tdelete headers.id;\n\t\t\tdelete headers.event;\n\t\t\tdelete headers.method;\n\n\n\t\t\tlet payload = null;\n\t\t\tif (data !== null) {\n\t\t\t\tpayload = this.codec.encode(data);\n\t\t\t}\n\n\n\t\t\tif (payload !== null) {\n\n\t\t\t\tthis.trigger('send', [ payload, headers ]);\n\n\t\t\t\treturn true;\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t},\n\n\t\treceive: function(payload, headers) {\n\n\t\t\tpayload = payload instanceof Buffer ? payload : null;\n\t\t\theaders = headers instanceof Object ? headers : {};\n\n\n\t\t\tlet id     = headers['@service-id']     || null;\n\t\t\tlet event  = headers['@service-event']  || null;\n\t\t\tlet method = headers['@service-method'] || null;\n\n\t\t\tlet data = null;\n\t\t\tif (payload.length === 0) {\n\t\t\t\tpayload = this.codec.encode({});\n\t\t\t}\n\n\t\t\tif (payload !== null) {\n\t\t\t\tdata = this.codec.decode(payload);\n\t\t\t}\n\n\n\t\t\tlet instance = this.getService(id);\n\t\t\tif (instance !== null && data !== null) {\n\n\t\t\t\tif (method === '@plug' || method === '@unplug') {\n\n\t\t\t\t\tif (method === '@plug') {\n\t\t\t\t\t\t_plug_service.call(this,   id, instance);\n\t\t\t\t\t} else if (method === '@unplug') {\n\t\t\t\t\t\t_unplug_service.call(this, id, instance);\n\t\t\t\t\t}\n\n\t\t\t\t} else if (method !== null) {\n\n\t\t\t\t\tif (typeof instance[method] === 'function') {\n\t\t\t\t\t\tinstance[method](data);\n\t\t\t\t\t}\n\n\t\t\t\t} else if (event !== null) {\n\n\t\t\t\t\tif (typeof instance.trigger === 'function') {\n\t\t\t\t\t\tinstance.trigger(event, [ data ]);\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t} else {\n\n\t\t\t\tthis.trigger('receive', [ data, headers ]);\n\n\t\t\t}\n\n\n\t\t\treturn true;\n\n\t\t},\n\n\t\tsetHost: function(host) {\n\n\t\t\thost = typeof host === 'string' ? host : null;\n\n\n\t\t\tif (host !== null) {\n\n\t\t\t\tthis.id   = (/:/g.test(host) ? '[' + host + ']' : host) + ':' + this.port;\n\t\t\t\tthis.host = host;\n\n\t\t\t\treturn true;\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t},\n\n\t\tsetPort: function(port) {\n\n\t\t\tport = typeof port === 'number' ? (port | 0) : null;\n\n\n\t\t\tif (port !== null) {\n\n\t\t\t\tthis.id   = (/:/g.test(this.host) ? '[' + this.host + ']' : this.host) + ':' + port;\n\t\t\t\tthis.port = port;\n\n\t\t\t\treturn true;\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t},\n\n\t\tsetProtocol: function(protocol) {\n\n\t\t\tprotocol = lychee.enumof(Composite.PROTOCOL, protocol) ? protocol : null;\n\n\n\t\t\tif (protocol !== null) {\n\n\t\t\t\tif (this.protocol !== protocol) {\n\n\t\t\t\t\tthis.protocol = protocol;\n\n\n\t\t\t\t\tif (this.__isConnected === true) {\n\t\t\t\t\t\tthis.disconnect();\n\t\t\t\t\t\tthis.connect();\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t\treturn true;\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t},\n\n\t\tsetReconnect: function(reconnect) {\n\n\t\t\treconnect = typeof reconnect === 'number' ? (reconnect | 0) : null;\n\n\n\t\t\tif (reconnect !== null) {\n\n\t\t\t\tthis.reconnect = reconnect;\n\n\t\t\t\treturn true;\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t},\n\n\t\taddService: function(service) {\n\n\t\t\tservice = lychee.interfaceof(_Service, service) ? service : null;\n\n\n\t\t\tif (service !== null) {\n\n\t\t\t\tlet found = false;\n\n\t\t\t\tfor (let w = 0, wl = this.__services.waiting.length; w < wl; w++) {\n\n\t\t\t\t\tif (this.__services.waiting[w] === service) {\n\t\t\t\t\t\tfound = true;\n\t\t\t\t\t\tbreak;\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t\tfor (let a = 0, al = this.__services.active.length; a < al; a++) {\n\n\t\t\t\t\tif (this.__services.active[a] === service) {\n\t\t\t\t\t\tfound = true;\n\t\t\t\t\t\tbreak;\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\n\t\t\t\tif (found === false) {\n\n\t\t\t\t\tthis.__services.waiting.push(service);\n\n\t\t\t\t\tthis.send({}, {\n\t\t\t\t\t\tid:     service.id,\n\t\t\t\t\t\tmethod: '@plug'\n\t\t\t\t\t});\n\n\t\t\t\t}\n\n\n\t\t\t\treturn true;\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t},\n\n\t\tgetService: function(id) {\n\n\t\t\tid = typeof id === 'string' ? id : null;\n\n\n\t\t\tif (id !== null) {\n\n\t\t\t\tfor (let w = 0, wl = this.__services.waiting.length; w < wl; w++) {\n\n\t\t\t\t\tlet wservice = this.__services.waiting[w];\n\t\t\t\t\tif (wservice.id === id) {\n\t\t\t\t\t\treturn wservice;\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t\tfor (let a = 0, al = this.__services.active.length; a < al; a++) {\n\n\t\t\t\t\tlet aservice = this.__services.active[a];\n\t\t\t\t\tif (aservice.id === id) {\n\t\t\t\t\t\treturn aservice;\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\treturn null;\n\n\t\t},\n\n\t\tremoveService: function(service) {\n\n\t\t\tservice = lychee.interfaceof(_Service, service) ? service : null;\n\n\n\t\t\tif (service !== null) {\n\n\t\t\t\tlet found = false;\n\n\t\t\t\tfor (let w = 0, wl = this.__services.waiting.length; w < wl; w++) {\n\n\t\t\t\t\tif (this.__services.waiting[w] === service) {\n\t\t\t\t\t\tfound = true;\n\t\t\t\t\t\tbreak;\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t\tfor (let a = 0, al = this.__services.active.length; a < al; a++) {\n\n\t\t\t\t\tif (this.__services.active[a] === service) {\n\t\t\t\t\t\tfound = true;\n\t\t\t\t\t\tbreak;\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\n\t\t\t\tif (found === true) {\n\n\t\t\t\t\tthis.send({}, {\n\t\t\t\t\t\tid:     service.id,\n\t\t\t\t\t\tmethod: '@unplug'\n\t\t\t\t\t});\n\n\t\t\t\t}\n\n\n\t\t\t\treturn true;\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t},\n\n\t\tremoveServices: function() {\n\n\t\t\tthis.__services.waiting.slice(0).forEach(service => _unplug_service.call(this, service.id, service));\n\t\t\tthis.__services.active.slice(0).forEach(service => _unplug_service.call(this, service.id, service));\n\n\t\t\treturn true;\n\n\t\t},\n\n\t\tsetType: function(type) {\n\n\t\t\ttype = typeof type === 'string' ? type : null;\n\n\n\t\t\tif (type !== null) {\n\n\t\t\t\tif (/^(client|remote)$/g.test(type) === true) {\n\n\t\t\t\t\tthis.type = type;\n\n\t\t\t\t\treturn true;\n\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t}\n\n\t};\n\n\n\treturn Composite;\n\n}"
					}
				},
				"lychee.codec.BITON": {
					"constructor": "lychee.Definition",
					"arguments": [
						{
							"id": "lychee.codec.BITON",
							"url": "/libraries/lychee/source/codec/BITON.js"
						}
					],
					"blob": {
						"attaches": {},
						"exports": "(lychee, global, attachments) => {\n\n\t/*\n\t * HELPERS\n\t */\n\n\tconst _CHAR_TABLE = new Array(256);\n\tconst _MASK_TABLE = new Array(9);\n\tconst _POW_TABLE  = new Array(9);\n\tconst _RPOW_TABLE = new Array(9);\n\n\t(function() {\n\n\t\tfor (let c = 0; c < 256; c++) {\n\t\t\t_CHAR_TABLE[c] = String.fromCharCode(c);\n\t\t}\n\n\t\tfor (let m = 0; m < 9; m++) {\n\t\t\t_POW_TABLE[m]  = Math.pow(2, m) - 1;\n\t\t\t_MASK_TABLE[m] = ~(_POW_TABLE[m] ^ 0xff);\n\t\t\t_RPOW_TABLE[m] = Math.pow(10, m);\n\t\t}\n\n\t})();\n\n\n\tconst _CHARS_ESCAPABLE = /[\\\\\"\\u0000-\\u001f\\u007f-\\u009f\\u00ad\\u0600-\\u0604\\u070f\\u17b4\\u17b5\\u200c-\\u200f\\u2028-\\u202f\\u2060-\\u206f\\ufeff\\ufff0-\\uffff]/g;\n\tconst _CHARS_META      = {\n\t\t'\\b': '\\\\b',\n\t\t'\\t': '\\\\t',\n\t\t'\\n': '\\\\n',\n\t\t'\\f': '\\\\f',\n\t\t'\\r': '',    // FUCK YOU, Microsoft!\n\t\t'\"':  '\\\\\"',\n\t\t'\\\\': '\\\\\\\\'\n\t};\n\n\tconst _format_date = function(n) {\n\t\treturn n < 10 ? '0' + n : '' + n;\n\t};\n\n\tconst _sanitize_string = function(str) {\n\n\t\tlet san  = str;\n\t\tlet keys = Object.keys(_CHARS_META);\n\t\tlet vals = Object.values(_CHARS_META);\n\n\t\tkeys.forEach((key, i) => {\n\t\t\tsan = san.replace(key, vals[i]);\n\t\t});\n\n\t\tif (_CHARS_ESCAPABLE.test(san)) {\n\t\t\tsan = san.replace(_CHARS_ESCAPABLE, chr => '\\\\u' + (chr.charCodeAt(0).toString(16)).slice(-4));\n\t\t}\n\n\t\treturn san;\n\n\t};\n\n\tconst _desanitize_string = function(san) {\n\n\t\tlet str  = san;\n\t\tlet keys = Object.keys(_CHARS_META);\n\t\tlet vals = Object.values(_CHARS_META);\n\n\t\tvals.forEach((val, i) => {\n\n\t\t\tif (val !== '') {\n\t\t\t\tstr = str.replace(val, keys[i]);\n\t\t\t}\n\n\t\t});\n\n\t\treturn str;\n\n\t};\n\n\tconst _resolve_constructor = function(identifier, scope) {\n\n\t\tlet pointer = scope;\n\n\t\tlet ns = identifier.split('.');\n\t\tfor (let n = 0, l = ns.length; n < l; n++) {\n\n\t\t\tlet name = ns[n];\n\n\t\t\tif (pointer[name] !== undefined) {\n\t\t\t\tpointer = pointer[name];\n\t\t\t} else {\n\t\t\t\tpointer = null;\n\t\t\t\tbreak;\n\t\t\t}\n\n\t\t}\n\n\n\t\treturn pointer;\n\n\t};\n\n\n\n\t/*\n\t * STRUCTS\n\t */\n\n\tconst _Stream = function(buffer, mode) {\n\n\t\tthis.__buffer    = typeof buffer === 'string' ? buffer : '';\n\t\tthis.__mode      = typeof mode === 'number'   ? mode   : 0;\n\n\t\tthis.__pointer   = 0;\n\t\tthis.__value     = 0;\n\t\tthis.__remaining = 8;\n\t\tthis.__index     = 0;\n\n\t\tif (this.__mode === _Stream.MODE.read) {\n\t\t\tthis.__value = this.__buffer.charCodeAt(this.__index);\n\t\t}\n\n\t};\n\n\n\t_Stream.MODE = {\n\t\tread:  0,\n\t\twrite: 1\n\t};\n\n\n\t_Stream.prototype = {\n\n\t\ttoString: function() {\n\n\t\t\tif (this.__mode === _Stream.MODE.write) {\n\n\t\t\t\tif (this.__value > 0) {\n\t\t\t\t\tthis.__buffer += _CHAR_TABLE[this.__value];\n\t\t\t\t\tthis.__value   = 0;\n\t\t\t\t}\n\n\n\t\t\t\t// 0: Boolean or Null or EOS\n\t\t\t\tthis.write(0, 4);\n\n\t\t\t\t// 0: EOS\n\t\t\t\tthis.write(0, 3);\n\n\t\t\t}\n\n\t\t\treturn this.__buffer;\n\n\t\t},\n\n\t\tpointer: function() {\n\t\t\treturn this.__pointer;\n\t\t},\n\n\t\tlength: function() {\n\t\t\treturn this.__buffer.length * 8;\n\t\t},\n\n\t\tread: function(bits) {\n\n\t\t\tlet overflow = bits - this.__remaining;\n\t\t\tlet captured = this.__remaining < bits ? this.__remaining : bits;\n\t\t\tlet shift    = this.__remaining - captured;\n\n\n\t\t\tlet buffer = (this.__value & _MASK_TABLE[this.__remaining]) >> shift;\n\n\n\t\t\tthis.__pointer   += captured;\n\t\t\tthis.__remaining -= captured;\n\n\n\t\t\tif (this.__remaining === 0) {\n\n\t\t\t\tthis.__value     = this.__buffer.charCodeAt(++this.__index);\n\t\t\t\tthis.__remaining = 8;\n\n\t\t\t\tif (overflow > 0) {\n\t\t\t\t\tbuffer = buffer << overflow | ((this.__value & _MASK_TABLE[this.__remaining]) >> (8 - overflow));\n\t\t\t\t\tthis.__remaining -= overflow;\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\treturn buffer;\n\n\t\t},\n\n\t\treadRAW: function(bytes) {\n\n\t\t\tif (this.__remaining !== 8) {\n\n\t\t\t\tthis.__index++;\n\t\t\t\tthis.__value     = 0;\n\t\t\t\tthis.__remaining = 8;\n\n\t\t\t}\n\n\n\t\t\tlet buffer = '';\n\n\t\t\tif (this.__remaining === 8) {\n\n\t\t\t\tbuffer       += this.__buffer.substr(this.__index, bytes);\n\t\t\t\tthis.__index += bytes;\n\t\t\t\tthis.__value  = this.__buffer.charCodeAt(this.__index);\n\n\t\t\t}\n\n\n\t\t\treturn buffer;\n\n\t\t},\n\n\t\twrite: function(buffer, bits) {\n\n\t\t\tlet overflow = bits - this.__remaining;\n\t\t\tlet captured = this.__remaining < bits ? this.__remaining : bits;\n\t\t\tlet shift    = this.__remaining - captured;\n\n\n\t\t\tif (overflow > 0) {\n\t\t\t\tthis.__value += buffer >> overflow << shift;\n\t\t\t} else {\n\t\t\t\tthis.__value += buffer << shift;\n\t\t\t}\n\n\n\t\t\tthis.__pointer   += captured;\n\t\t\tthis.__remaining -= captured;\n\n\n\t\t\tif (this.__remaining === 0) {\n\n\t\t\t\tthis.__buffer    += _CHAR_TABLE[this.__value];\n\t\t\t\tthis.__remaining  = 8;\n\t\t\t\tthis.__value      = 0;\n\n\t\t\t\tif (overflow > 0) {\n\t\t\t\t\tthis.__value     += (buffer & _POW_TABLE[overflow]) << (8 - overflow);\n\t\t\t\t\tthis.__remaining -= overflow;\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t},\n\n\t\twriteRAW: function(buffer) {\n\n\t\t\tif (this.__remaining !== 8) {\n\n\t\t\t\tthis.__buffer    += _CHAR_TABLE[this.__value];\n\t\t\t\tthis.__value      = 0;\n\t\t\t\tthis.__remaining  = 8;\n\n\t\t\t}\n\n\t\t\tif (this.__remaining === 8) {\n\n\t\t\t\tthis.__buffer  += buffer;\n\t\t\t\tthis.__pointer += buffer.length * 8;\n\n\t\t\t}\n\n\t\t}\n\n\t};\n\n\n\n\t/*\n\t * ENCODER and DECODER\n\t */\n\n\tconst _encode = function(stream, data) {\n\n\t\t// 0: Boolean, Null (or EOS), Undefined, Infinity, NaN\n\t\tif (\n\t\t\ttypeof data === 'boolean'\n\t\t\t|| data === null\n\t\t\t|| data === undefined\n\t\t\t|| (\n\t\t\t\ttypeof data === 'number'\n\t\t\t\t&& (\n\t\t\t\t\tdata === Infinity\n\t\t\t\t\t|| data === -Infinity\n\t\t\t\t\t|| isNaN(data) === true\n\t\t\t\t)\n\t\t\t)\n\t\t) {\n\n\t\t\tstream.write(0, 4);\n\n\t\t\tif (data === null) {\n\t\t\t\tstream.write(1, 3);\n\t\t\t} else if (data === undefined) {\n\t\t\t\tstream.write(2, 3);\n\t\t\t} else if (data === false) {\n\t\t\t\tstream.write(3, 3);\n\t\t\t} else if (data === true) {\n\t\t\t\tstream.write(4, 3);\n\t\t\t} else if (data === Infinity) {\n\t\t\t\tstream.write(5, 3);\n\t\t\t} else if (data === -Infinity) {\n\t\t\t\tstream.write(6, 3);\n\t\t\t} else if (isNaN(data) === true) {\n\t\t\t\tstream.write(7, 3);\n\t\t\t}\n\n\n\t\t// 1: Integer, 2: Float\n\t\t} else if (typeof data === 'number') {\n\n\t\t\tlet type = 1;\n\t\t\tif (data < 268435456 && data !== (data | 0)) {\n\t\t\t\ttype = 2;\n\t\t\t}\n\n\n\t\t\tstream.write(type, 4);\n\n\n\t\t\t// Negative value\n\t\t\tlet sign = 0;\n\t\t\tif (data < 0) {\n\t\t\t\tdata = -data;\n\t\t\t\tsign = 1;\n\t\t\t}\n\n\n\t\t\t// Float only: Calculate the integer value and remember the shift\n\t\t\tlet shift = 0;\n\n\t\t\tif (type === 2) {\n\n\t\t\t\tlet step = 10;\n\t\t\t\tlet m    = data;\n\t\t\t\tlet tmp  = 0;\n\n\n\t\t\t\t// Calculate the exponent and shift\n\t\t\t\tdo {\n\n\t\t\t\t\tm     = data * step;\n\t\t\t\t\tstep *= 10;\n\t\t\t\t\ttmp   = m | 0;\n\t\t\t\t\tshift++;\n\n\t\t\t\t} while (m - tmp > 1 / step && shift < 8 && m < 214748364);\n\n\n\t\t\t\tstep = tmp / 10;\n\n\t\t\t\t// Recorrect shift if we are > 0.5\n\t\t\t\t// and shift is too high\n\t\t\t\tif (step === (step | 0)) {\n\t\t\t\t\ttmp = step;\n\t\t\t\t\tshift--;\n\t\t\t\t}\n\n\t\t\t\tdata = tmp;\n\n\t\t\t}\n\n\n\n\t\t\tif (data < 2) {\n\n\t\t\t\tstream.write(0, 4);\n\t\t\t\tstream.write(data, 1);\n\n\t\t\t} else if (data < 16) {\n\n\t\t\t\tstream.write(1, 4);\n\t\t\t\tstream.write(data, 4);\n\n\t\t\t} else if (data < 256) {\n\n\t\t\t\tstream.write(2, 4);\n\t\t\t\tstream.write(data, 8);\n\n\t\t\t} else if (data < 4096) {\n\n\t\t\t\tstream.write(3, 4);\n\t\t\t\tstream.write(data >>  8 & 0xff, 4);\n\t\t\t\tstream.write(data       & 0xff, 8);\n\n\t\t\t} else if (data < 65536) {\n\n\t\t\t\tstream.write(4, 4);\n\t\t\t\tstream.write(data >>  8 & 0xff, 8);\n\t\t\t\tstream.write(data       & 0xff, 8);\n\n\t\t\t} else if (data < 1048576) {\n\n\t\t\t\tstream.write(5, 4);\n\t\t\t\tstream.write(data >> 16 & 0xff, 4);\n\t\t\t\tstream.write(data >>  8 & 0xff, 8);\n\t\t\t\tstream.write(data       & 0xff, 8);\n\n\t\t\t} else if (data < 16777216) {\n\n\t\t\t\tstream.write(6, 4);\n\t\t\t\tstream.write(data >> 16 & 0xff, 8);\n\t\t\t\tstream.write(data >>  8 & 0xff, 8);\n\t\t\t\tstream.write(data       & 0xff, 8);\n\n\t\t\t} else if (data < 268435456) {\n\n\t\t\t\tstream.write(7, 4);\n\t\t\t\tstream.write(data >> 24 & 0xff, 8);\n\t\t\t\tstream.write(data >> 16 & 0xff, 8);\n\t\t\t\tstream.write(data >>  8 & 0xff, 8);\n\t\t\t\tstream.write(data       & 0xff, 8);\n\n\t\t\t} else {\n\n\t\t\t\tstream.write(8, 4);\n\n\t\t\t\t_encode(stream, data.toString());\n\n\t\t\t}\n\n\n\t\t\tstream.write(sign, 1);\n\n\n\t\t\t// Float only: Remember the shift for precision\n\t\t\tif (type === 2) {\n\t\t\t\tstream.write(shift, 4);\n\t\t\t}\n\n\n\t\t// 3: String\n\t\t} else if (typeof data === 'string') {\n\n\t\t\tdata = _sanitize_string(data);\n\n\n\t\t\tstream.write(3, 4);\n\n\n\t\t\tlet l = data.length;\n\n\t\t\t// Write Size Field\n\t\t\tif (l > 65535) {\n\n\t\t\t\tstream.write(31, 5);\n\n\t\t\t\tstream.write(l >> 24 & 0xff, 8);\n\t\t\t\tstream.write(l >> 16 & 0xff, 8);\n\t\t\t\tstream.write(l >>  8 & 0xff, 8);\n\t\t\t\tstream.write(l       & 0xff, 8);\n\n\t\t\t} else if (l > 255) {\n\n\t\t\t\tstream.write(30, 5);\n\n\t\t\t\tstream.write(l >>  8 & 0xff, 8);\n\t\t\t\tstream.write(l       & 0xff, 8);\n\n\t\t\t} else if (l > 28) {\n\n\t\t\t\tstream.write(29, 5);\n\n\t\t\t\tstream.write(l, 8);\n\n\t\t\t} else {\n\n\t\t\t\tstream.write(l, 5);\n\n\t\t\t}\n\n\n\t\t\tstream.writeRAW(data);\n\n\t\t} else if (data instanceof Date) {\n\n\t\t\tstream.write(4, 4);\n\n\t\t\tlet str = '';\n\n\t\t\tstr += data.getUTCFullYear()                + '-';\n\t\t\tstr += _format_date(data.getUTCMonth() + 1) + '-';\n\t\t\tstr += _format_date(data.getUTCDate())      + 'T';\n\t\t\tstr += _format_date(data.getUTCHours())     + ':';\n\t\t\tstr += _format_date(data.getUTCMinutes())   + ':';\n\t\t\tstr += _format_date(data.getUTCSeconds())   + 'Z';\n\n\t\t\tstream.writeRAW(str);\n\n\t\t// 12: Start of Array\n\t\t} else if (data instanceof Array) {\n\n\t\t\tstream.write(12, 4);\n\n\t\t\tfor (let d = 0, dl = data.length; d < dl; d++) {\n\t\t\t\tstream.write(0, 4);\n\t\t\t\t_encode(stream, data[d]);\n\t\t\t}\n\n\t\t\t// Write EOO marker\n\t\t\tstream.write(15, 4);\n\n\n\t\t// 13: Start of Object\n\t\t} else if (data instanceof Object && typeof data.serialize !== 'function') {\n\n\t\t\tstream.write(13, 4);\n\n\t\t\tfor (let prop in data) {\n\n\t\t\t\tif (data.hasOwnProperty(prop)) {\n\t\t\t\t\tstream.write(0, 4);\n\t\t\t\t\t_encode(stream, prop);\n\t\t\t\t\t_encode(stream, data[prop]);\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t\t// Write EOO marker\n\t\t\tstream.write(15, 4);\n\n\n\t\t// 14: Custom High-Level Implementation\n\t\t} else if (data instanceof Object && typeof data.serialize === 'function') {\n\n\t\t\tstream.write(14, 4);\n\n\t\t\tlet blob = lychee.serialize(data);\n\n\t\t\t_encode(stream, blob);\n\n\t\t\t// Write EOO marker\n\t\t\tstream.write(15, 4);\n\n\t\t}\n\n\t};\n\n\tconst _decode = function(stream) {\n\n\t\tlet value  = undefined;\n\t\tlet tmp    = 0;\n\t\tlet errors = 0;\n\t\tlet check  = 0;\n\n\t\tif (stream.pointer() < stream.length()) {\n\n\t\t\tlet type = stream.read(4);\n\n\n\t\t\t// 0: Boolean, Null (or EOS), Undefined, Infinity, NaN\n\t\t\tif (type === 0) {\n\n\t\t\t\ttmp = stream.read(3);\n\n\t\t\t\tif (tmp === 1) {\n\t\t\t\t\tvalue = null;\n\t\t\t\t} else if (tmp === 2) {\n\t\t\t\t\tvalue = undefined;\n\t\t\t\t} else if (tmp === 3) {\n\t\t\t\t\tvalue = false;\n\t\t\t\t} else if (tmp === 4) {\n\t\t\t\t\tvalue = true;\n\t\t\t\t} else if (tmp === 5) {\n\t\t\t\t\tvalue = Infinity;\n\t\t\t\t} else if (tmp === 6) {\n\t\t\t\t\tvalue = -Infinity;\n\t\t\t\t} else if (tmp === 7) {\n\t\t\t\t\tvalue = NaN;\n\t\t\t\t}\n\n\n\t\t\t// 1: Integer, 2: Float\n\t\t\t} else if (type === 1 || type === 2) {\n\n\t\t\t\ttmp = stream.read(4);\n\n\n\t\t\t\tif (tmp === 0) {\n\n\t\t\t\t\tvalue = stream.read(1);\n\n\t\t\t\t} else if (tmp === 1) {\n\n\t\t\t\t\tvalue = stream.read(4);\n\n\t\t\t\t} else if (tmp === 2) {\n\n\t\t\t\t\tvalue = stream.read(8);\n\n\t\t\t\t} else if (tmp === 3) {\n\n\t\t\t\t\tvalue = (stream.read(4) <<  8) + stream.read(8);\n\n\t\t\t\t} else if (tmp === 4) {\n\n\t\t\t\t\tvalue = (stream.read(8) <<  8) + stream.read(8);\n\n\t\t\t\t} else if (tmp === 5) {\n\n\t\t\t\t\tvalue = (stream.read(4) << 16) + (stream.read(8) <<  8) + stream.read(8);\n\n\t\t\t\t} else if (tmp === 6) {\n\n\t\t\t\t\tvalue = (stream.read(8) << 16) + (stream.read(8) <<  8) + stream.read(8);\n\n\t\t\t\t} else if (tmp === 7) {\n\n\t\t\t\t\tvalue = (stream.read(8) << 24) + (stream.read(8) << 16) + (stream.read(8) <<  8) + stream.read(8);\n\n\t\t\t\t} else if (tmp === 8) {\n\n\t\t\t\t\tlet str = _decode(stream);\n\n\t\t\t\t\tvalue = parseInt(str, 10);\n\n\t\t\t\t}\n\n\n\t\t\t\t// Negative value\n\t\t\t\tlet sign = stream.read(1);\n\t\t\t\tif (sign === 1) {\n\t\t\t\t\tvalue = -1 * value;\n\t\t\t\t}\n\n\n\t\t\t\t// Float only: Shift it back by the precision\n\t\t\t\tif (type === 2) {\n\t\t\t\t\tlet shift = stream.read(4);\n\t\t\t\t\tvalue /= _RPOW_TABLE[shift];\n\t\t\t\t}\n\n\n\t\t\t// 3: String\n\t\t\t} else if (type === 3) {\n\n\t\t\t\tlet size = stream.read(5);\n\n\t\t\t\tif (size === 31) {\n\n\t\t\t\t\tsize = (stream.read(8) << 24) + (stream.read(8) << 16) + (stream.read(8) <<  8) + stream.read(8);\n\n\t\t\t\t} else if (size === 30) {\n\n\t\t\t\t\tsize = (stream.read(8) <<  8) + stream.read(8);\n\n\t\t\t\t} else if (size === 29) {\n\n\t\t\t\t\tsize = stream.read(8);\n\n\t\t\t\t}\n\n\n\t\t\t\tvalue = _desanitize_string(stream.readRAW(size));\n\n\t\t\t// 4: Date\n\t\t\t} else if (type === 4) {\n\n\t\t\t\tcheck = stream.readRAW(20);\n\n\t\t\t\tif (check[19] === 'Z') {\n\t\t\t\t\tvalue = new Date(check);\n\t\t\t\t}\n\n\n\t\t\t// 12: Array\n\t\t\t} else if (type === 12) {\n\n\t\t\t\tvalue = [];\n\n\n\t\t\t\twhile (errors === 0) {\n\n\t\t\t\t\tcheck = stream.read(4);\n\n\t\t\t\t\tif (check === 0) {\n\t\t\t\t\t\tvalue.push(_decode(stream));\n\t\t\t\t\t} else if (check === 15) {\n\t\t\t\t\t\tbreak;\n\t\t\t\t\t} else {\n\t\t\t\t\t\terrors++;\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\n\t\t\t// 13: Object\n\t\t\t} else if (type === 13) {\n\n\t\t\t\tvalue = {};\n\n\n\t\t\t\twhile (errors === 0) {\n\n\t\t\t\t\tcheck = stream.read(4);\n\n\t\t\t\t\tif (check === 0) {\n\t\t\t\t\t\tvalue[_decode(stream)] = _decode(stream);\n\t\t\t\t\t} else if (check === 15) {\n\t\t\t\t\t\tbreak;\n\t\t\t\t\t} else {\n\t\t\t\t\t\terrors++;\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t// 14: Custom High-Level Implementation\n\t\t\t} else if (type === 14) {\n\n\t\t\t\tlet blob = _decode(stream);\n\n\t\t\t\tvalue = lychee.deserialize(blob);\n\t\t\t\tcheck = stream.read(4);\n\n\t\t\t\tif (check !== 15) {\n\t\t\t\t\tvalue = undefined;\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t}\n\n\n\t\treturn value;\n\n\t};\n\n\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tconst Module = {\n\n\t\t/*\n\t\t * ENTITY API\n\t\t */\n\n\t\t// deserialize: function(blob) {},\n\n\t\tserialize: function() {\n\n\t\t\treturn {\n\t\t\t\t'reference': 'lychee.codec.BITON',\n\t\t\t\t'blob':      null\n\t\t\t};\n\n\t\t},\n\n\n\n\t\t/*\n\t\t * CUSTOM API\n\t\t */\n\n\t\tencode: function(data) {\n\n\t\t\tdata = data instanceof Object ? data : null;\n\n\n\t\t\tif (data !== null) {\n\n\t\t\t\tlet stream = new _Stream('', _Stream.MODE.write);\n\n\t\t\t\t_encode(stream, data);\n\n\t\t\t\treturn Buffer.from(stream.toString(), 'utf8');\n\n\t\t\t}\n\n\n\t\t\treturn null;\n\n\t\t},\n\n\t\tdecode: function(data) {\n\n\t\t\tdata = data instanceof Buffer ? data : null;\n\n\n\t\t\tif (data !== null) {\n\n\t\t\t\tlet stream = new _Stream(data.toString('utf8'), _Stream.MODE.read);\n\t\t\t\tlet object = _decode(stream);\n\t\t\t\tif (object !== undefined) {\n\t\t\t\t\treturn object;\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\treturn null;\n\n\t\t}\n\n\t};\n\n\n\treturn Module;\n\n}"
					}
				},
				"lychee.codec.BENCODE": {
					"constructor": "lychee.Definition",
					"arguments": [
						{
							"id": "lychee.codec.BENCODE",
							"url": "/libraries/lychee/source/codec/BENCODE.js"
						}
					],
					"blob": {
						"attaches": {},
						"exports": "(lychee, global, attachments) => {\n\n\t/*\n\t * HELPERS\n\t */\n\n\tconst _CHARS_DANGEROUS = /[\\u0000\\u00ad\\u0600-\\u0604\\u070f\\u17b4\\u17b5\\u200c-\\u200f\\u2028-\\u202f\\u2060-\\u206f\\ufeff\\ufff0-\\uffff]/g;\n\tconst _CHARS_ESCAPABLE = /[\\\\\"\\u0000-\\u001f\\u007f-\\u009f\\u00ad\\u0600-\\u0604\\u070f\\u17b4\\u17b5\\u200c-\\u200f\\u2028-\\u202f\\u2060-\\u206f\\ufeff\\ufff0-\\uffff]/g;\n\tconst _CHARS_META      = {\n\t\t'\\b': '\\\\b',\n\t\t'\\t': '\\\\t',\n\t\t'\\n': '\\\\n',\n\t\t'\\f': '\\\\f',\n\t\t'\\r': '',    // FUCK YOU, Microsoft!\n\t\t'\"':  '\\\\\"',\n\t\t'\\\\': '\\\\\\\\'\n\t};\n\n\tconst _format_date = function(n) {\n\t\treturn n < 10 ? '0' + n : '' + n;\n\t};\n\n\tconst _sanitize_string = function(str) {\n\n\t\tlet san = str;\n\n\n\t\tif (_CHARS_ESCAPABLE.test(san)) {\n\n\t\t\tsan = san.replace(_CHARS_ESCAPABLE, character => {\n\n\t\t\t\tlet val = _CHARS_META[character];\n\t\t\t\tif (typeof val === 'string') {\n\t\t\t\t\treturn val;\n\t\t\t\t} else {\n\t\t\t\t\treturn '\\\\u' + (character.charCodeAt(0).toString(16)).slice(-4);\n\t\t\t\t}\n\n\t\t\t});\n\n\t\t}\n\n\t\treturn san;\n\n\t};\n\n\n\n\t/*\n\t * STRUCTS\n\t */\n\n\tconst _Stream = function(buffer) {\n\n\t\tthis.__buffer = typeof buffer === 'string' ? buffer : '';\n\t\tthis.__index  = 0;\n\n\t};\n\n\n\t_Stream.prototype = {\n\n\t\ttoString: function() {\n\t\t\treturn this.__buffer;\n\t\t},\n\n\t\tpointer: function() {\n\t\t\treturn this.__index;\n\t\t},\n\n\t\tlength: function() {\n\t\t\treturn this.__buffer.length;\n\t\t},\n\n\t\tsearch: function(array) {\n\n\t\t\tlet bytes = Infinity;\n\n\t\t\tfor (let a = 0, al = array.length; a < al; a++) {\n\n\t\t\t\tlet token = array[a];\n\t\t\t\tlet size  = this.__buffer.indexOf(token, this.__index + 1) - this.__index;\n\t\t\t\tif (size > -1 && size < bytes) {\n\t\t\t\t\tbytes = size;\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\tif (bytes === Infinity) {\n\t\t\t\treturn 0;\n\t\t\t}\n\n\n\t\t\treturn bytes;\n\n\t\t},\n\n\t\tseek: function(bytes) {\n\n\t\t\tif (bytes > 0) {\n\t\t\t\treturn this.__buffer.substr(this.__index, bytes);\n\t\t\t} else {\n\t\t\t\treturn this.__buffer.substr(this.__index + bytes, Math.abs(bytes));\n\t\t\t}\n\n\t\t},\n\n\t\tread: function(bytes) {\n\n\t\t\tlet buffer = '';\n\n\t\t\tbuffer       += this.__buffer.substr(this.__index, bytes);\n\t\t\tthis.__index += bytes;\n\n\t\t\treturn buffer;\n\n\t\t},\n\n\t\twrite: function(buffer) {\n\n\t\t\tthis.__buffer += buffer;\n\t\t\tthis.__index  += buffer.length;\n\n\t\t}\n\n\t};\n\n\n\n\t/*\n\t * ENCODER and DECODER\n\t */\n\n\tconst _encode = function(stream, data) {\n\n\t\t// Boolean, Null, Undefined, Infinity, NaN\n\t\tif (\n\t\t\ttypeof data === 'boolean'\n\t\t\t|| data === null\n\t\t\t|| data === undefined\n\t\t\t|| (\n\t\t\t\ttypeof data === 'number'\n\t\t\t\t&& (\n\t\t\t\t\tdata === Infinity\n\t\t\t\t\t|| data === -Infinity\n\t\t\t\t\t|| isNaN(data) === true\n\t\t\t\t)\n\t\t\t)\n\t\t) {\n\n\t\t\tif (data === null) {\n\t\t\t\tstream.write('pne');\n\t\t\t} else if (data === undefined) {\n\t\t\t\tstream.write('pue');\n\t\t\t} else if (data === false) {\n\t\t\t\tstream.write('pfe');\n\t\t\t} else if (data === true) {\n\t\t\t\tstream.write('pte');\n\t\t\t} else if (data === Infinity) {\n\t\t\t\tstream.write('p+e');\n\t\t\t} else if (data === -Infinity) {\n\t\t\t\tstream.write('p-e');\n\t\t\t} else if (isNaN(data) === true) {\n\t\t\t\tstream.write('p_e');\n\t\t\t}\n\n\n\t\t// i123e : Integer\n\t\t// f12.3e : Float\n\t\t} else if (typeof data === 'number') {\n\n\t\t\tlet type = 'i';\n\t\t\tif (data < 268435456 && data !== (data | 0)) {\n\t\t\t\ttype = 'f';\n\t\t\t}\n\n\t\t\tlet sign = 0;\n\t\t\tif (data < 0) {\n\t\t\t\tdata = -data;\n\t\t\t\tsign = 1;\n\t\t\t}\n\n\n\t\t\tstream.write(type);\n\n\t\t\tif (sign === 1) {\n\t\t\t\tstream.write('-');\n\t\t\t}\n\n\t\t\tstream.write(data.toString());\n\n\t\t\tstream.write('e');\n\n\n\t\t// <length>:<contents> : String\n\t\t} else if (typeof data === 'string') {\n\n\t\t\tdata = _sanitize_string(data);\n\n\n\t\t\tstream.write(data.length + ':' + data);\n\n\n\t\t// t<contents>e : Date\n\t\t} else if (data instanceof Date) {\n\n\t\t\tstream.write('t');\n\n\t\t\tlet str = '';\n\n\t\t\tstr += data.getUTCFullYear()                + '-';\n\t\t\tstr += _format_date(data.getUTCMonth() + 1) + '-';\n\t\t\tstr += _format_date(data.getUTCDate())      + 'T';\n\t\t\tstr += _format_date(data.getUTCHours())     + ':';\n\t\t\tstr += _format_date(data.getUTCMinutes())   + ':';\n\t\t\tstr += _format_date(data.getUTCSeconds())   + 'Z';\n\n\t\t\tstream.write(str);\n\n\t\t\tstream.write('e');\n\n\n\t\t// l<contents>e : Array\n\t\t} else if (data instanceof Array) {\n\n\t\t\tstream.write('l');\n\n\t\t\tfor (let d = 0, dl = data.length; d < dl; d++) {\n\t\t\t\t_encode(stream, data[d]);\n\t\t\t}\n\n\t\t\tstream.write('e');\n\n\t\t// d<contents>e : Object\n\t\t} else if (data instanceof Object && typeof data.serialize !== 'function') {\n\n\t\t\tstream.write('d');\n\n\t\t\tlet keys = Object.keys(data).sort((a, b) => {\n\t\t\t\tif (a > b) return  1;\n\t\t\t\tif (a < b) return -1;\n\t\t\t\treturn 0;\n\t\t\t});\n\n\t\t\tfor (let k = 0, kl = keys.length; k < kl; k++) {\n\n\t\t\t\tlet key = keys[k];\n\n\t\t\t\t_encode(stream, key);\n\t\t\t\t_encode(stream, data[key]);\n\n\t\t\t}\n\n\t\t\tstream.write('e');\n\n\n\t\t// s<contents>e : Custom High-Level Implementation\n\t\t} else if (data instanceof Object && typeof data.serialize === 'function') {\n\n\t\t\tstream.write('s');\n\n\t\t\tlet blob = lychee.serialize(data);\n\n\t\t\t_encode(stream, blob);\n\n\t\t\tstream.write('e');\n\n\t\t}\n\n\t};\n\n\tconst _is_decodeable_value = function(str) {\n\n\t\tlet head = str.charAt(0);\n\t\tif (/([piftlds]+)/g.test(head) === true) {\n\t\t\treturn true;\n\t\t} else if (isNaN(parseInt(head, 10)) === false) {\n\t\t\treturn true;\n\t\t}\n\n\t\treturn false;\n\n\t};\n\n\tconst _decode = function(stream) {\n\n\t\tlet value  = undefined;\n\t\tlet size   = 0;\n\t\tlet tmp    = 0;\n\t\tlet errors = 0;\n\t\tlet check  = null;\n\n\n\t\tif (stream.pointer() < stream.length()) {\n\n\t\t\tlet seek = stream.seek(1);\n\n\n\t\t\t// Boolean, Null, Undefined, Infinity, NaN\n\t\t\tif (seek === 'p') {\n\n\t\t\t\tcheck = stream.seek(3);\n\n\t\t\t\tif (check === 'pne') {\n\t\t\t\t\tstream.read(3);\n\t\t\t\t\tvalue = null;\n\t\t\t\t} else if (check === 'pue') {\n\t\t\t\t\tstream.read(3);\n\t\t\t\t\tvalue = undefined;\n\t\t\t\t} else if (check === 'pfe') {\n\t\t\t\t\tstream.read(3);\n\t\t\t\t\tvalue = false;\n\t\t\t\t} else if (check === 'pte') {\n\t\t\t\t\tstream.read(3);\n\t\t\t\t\tvalue = true;\n\t\t\t\t} else if (check === 'p+e') {\n\t\t\t\t\tstream.read(3);\n\t\t\t\t\tvalue = +Infinity;\n\t\t\t\t} else if (check === 'p-e') {\n\t\t\t\t\tstream.read(3);\n\t\t\t\t\tvalue = -Infinity;\n\t\t\t\t} else if (check === 'p_e') {\n\t\t\t\t\tstream.read(3);\n\t\t\t\t\tvalue = NaN;\n\t\t\t\t}\n\n\n\t\t\t// i123e : Integer\n\t\t\t} else if (seek === 'i') {\n\n\t\t\t\tstream.read(1);\n\n\t\t\t\tsize = stream.search([ 'e' ]);\n\n\t\t\t\tif (size > 0) {\n\n\t\t\t\t\ttmp   = stream.read(size);\n\t\t\t\t\tvalue = parseInt(tmp, 10);\n\t\t\t\t\tcheck = stream.read(1);\n\n\t\t\t\t}\n\n\t\t\t// f12.3e : Float\n\t\t\t} else if (seek === 'f') {\n\n\t\t\t\tstream.read(1);\n\n\t\t\t\tsize = stream.search([ 'e' ]);\n\n\t\t\t\tif (size > 0) {\n\n\t\t\t\t\ttmp   = stream.read(size);\n\t\t\t\t\tvalue = parseFloat(tmp, 10);\n\t\t\t\t\tcheck = stream.read(1);\n\n\t\t\t\t}\n\n\t\t\t// <length>:<contents> : String\n\t\t\t} else if (isNaN(parseInt(seek, 10)) === false) {\n\n\t\t\t\tsize = stream.search([ ':' ]);\n\n\t\t\t\tif (size > 0) {\n\n\t\t\t\t\tsize  = parseInt(stream.read(size), 10);\n\t\t\t\t\tcheck = stream.read(1);\n\n\t\t\t\t\tif (isNaN(size) === false && check === ':') {\n\t\t\t\t\t\tvalue = stream.read(size);\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t// t<contents>e : Date\n\t\t\t} else if (seek === 't') {\n\n\t\t\t\tstream.read(1);\n\n\t\t\t\tsize = stream.search([ 'e' ]);\n\n\t\t\t\tif (size > 0) {\n\n\t\t\t\t\ttmp   = stream.read(size);\n\t\t\t\t\tvalue = new Date(tmp);\n\t\t\t\t\tcheck = stream.read(1);\n\n\t\t\t\t}\n\n\t\t\t// l<contents>e : Array\n\t\t\t} else if (seek === 'l') {\n\n\t\t\t\tvalue = [];\n\n\n\t\t\t\tstream.read(1);\n\n\t\t\t\twhile (errors === 0) {\n\n\t\t\t\t\tvalue.push(_decode(stream));\n\n\t\t\t\t\tcheck = stream.seek(1);\n\n\t\t\t\t\tif (check === 'e') {\n\t\t\t\t\t\tbreak;\n\t\t\t\t\t} else if (_is_decodeable_value(check) === false) {\n\t\t\t\t\t\terrors++;\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t\tstream.read(1);\n\n\n\t\t\t// d<contents>e : Object\n\t\t\t} else if (seek === 'd') {\n\n\t\t\t\tvalue = {};\n\n\n\t\t\t\tstream.read(1);\n\n\t\t\t\twhile (errors === 0) {\n\n\t\t\t\t\tlet object_key   = _decode(stream);\n\t\t\t\t\tlet object_value = _decode(stream);\n\n\t\t\t\t\tcheck = stream.seek(1);\n\n\t\t\t\t\tvalue[object_key] = object_value;\n\n\t\t\t\t\tif (check === 'e') {\n\t\t\t\t\t\tbreak;\n\t\t\t\t\t} else if (isNaN(parseInt(check, 10))) {\n\t\t\t\t\t\terrors++;\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t\tstream.read(1);\n\n\n\t\t\t// s<contents>e : Custom High-Level Implementation\n\t\t\t} else if (seek === 's') {\n\n\t\t\t\tstream.read(1);\n\n\t\t\t\tlet blob = _decode(stream);\n\n\t\t\t\tvalue = lychee.deserialize(blob);\n\t\t\t\tcheck = stream.read(1);\n\n\t\t\t\tif (check !== 'e') {\n\t\t\t\t\tvalue = undefined;\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t}\n\n\n\t\treturn value;\n\n\t};\n\n\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tconst Module = {\n\n\t\t/*\n\t\t * ENTITY API\n\t\t */\n\n\t\t// deserialize: function(blob) {},\n\n\t\tserialize: function() {\n\n\t\t\treturn {\n\t\t\t\t'reference': 'lychee.codec.BENCODE',\n\t\t\t\t'blob':      null\n\t\t\t};\n\n\t\t},\n\n\n\n\t\t/*\n\t\t * CUSTOM API\n\t\t */\n\n\t\tencode: function(data) {\n\n\t\t\tdata = data instanceof Object ? data : null;\n\n\n\t\t\tif (data !== null) {\n\n\t\t\t\tlet stream = new _Stream('');\n\n\t\t\t\t_encode(stream, data);\n\n\t\t\t\treturn Buffer.from(stream.toString(), 'utf8');\n\n\t\t\t}\n\n\n\t\t\treturn null;\n\n\t\t},\n\n\t\tdecode: function(data) {\n\n\t\t\tdata = data instanceof Buffer ? data : null;\n\n\n\t\t\tif (data !== null) {\n\n\t\t\t\tlet stream = new _Stream(data.toString('utf8'));\n\t\t\t\tlet object = _decode(stream);\n\t\t\t\tif (object !== undefined) {\n\t\t\t\t\treturn object;\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\treturn null;\n\n\t\t}\n\n\t};\n\n\n\treturn Module;\n\n}"
					}
				},
				"harvester.data.Git": {
					"constructor": "lychee.Definition",
					"arguments": [
						{
							"id": "harvester.data.Git",
							"url": "/libraries/harvester/source/platform/node/data/Git.js"
						}
					],
					"blob": {
						"attaches": {},
						"tags": {
							"platform": "node"
						},
						"requires": [
							"harvester.data.Filesystem"
						],
						"supports": "(lychee, global) => {\n\n\ttry {\n\n\t\trequire('child_process');\n\t\trequire('path');\n\n\t\treturn true;\n\n\t} catch (err) {\n\t}\n\n\n\treturn false;\n\n}",
						"exports": "(lychee, global, attachments) => {\n\n\tconst _ROOT          = lychee.ROOT.lychee;\n\tconst _Filesystem    = lychee.import('harvester.data.Filesystem');\n\tconst _child_process = require('child_process');\n\tconst _path          = require('path');\n\n\n\n\t/*\n\t * HELPERS\n\t */\n\n\tconst _parse_remotes = function(content) {\n\n\t\tlet remotes = {};\n\t\tlet pointer = null;\n\n\t\tcontent.split('\\n').map(line => {\n\n\t\t\tif (line.startsWith('[remote')) {\n\n\t\t\t\tlet tmp = line.split('\"')[1] || null;\n\t\t\t\tif (tmp !== null) {\n\n\t\t\t\t\tpointer = remotes[tmp] = {\n\t\t\t\t\t\turl:   null,\n\t\t\t\t\t\tfetch: null\n\t\t\t\t\t};\n\n\t\t\t\t} else {\n\n\t\t\t\t\tpointer = null;\n\n\t\t\t\t}\n\n\t\t\t} else if (pointer !== null) {\n\n\t\t\t\tlet tmp = line.trim().split('=').map(val => val.trim());\n\t\t\t\tif (tmp[0] === 'url') {\n\t\t\t\t\tpointer.url = tmp[1];\n\t\t\t\t} else if (tmp[0] === 'fetch') {\n\t\t\t\t\tpointer.fetch = tmp[1];\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t});\n\n\n\t\treturn remotes;\n\n\t};\n\n\tconst _parse_log = function(content) {\n\n\t\treturn content.split('\\n').map(line => {\n\t\t\treturn line.substr(line.indexOf(' ') + 1).trim();\n\t\t}).filter(line => line !== '').map(line => {\n\n\t\t\tlet hash = line.substr(0, line.indexOf(' '));\n\t\t\tline = line.substr(hash.length + 1);\n\n\t\t\tlet name = line.substr(0, line.indexOf('<') - 1);\n\t\t\tline = line.substr(name.length + 1);\n\n\t\t\tlet email = line.substr(1, line.indexOf('>') - 1);\n\t\t\tline = line.substr(email.length + 3);\n\n\t\t\tlet timestamp = line.substr(0, line.indexOf('\\t'));\n\t\t\tline = line.substr(timestamp.length + 1);\n\n\t\t\tlet message = line.trim();\n\n\n\t\t\treturn {\n\t\t\t\thash:      hash,\n\t\t\t\tname:      name,\n\t\t\t\temail:     email,\n\t\t\t\ttimestamp: timestamp,\n\t\t\t\tmessage:   message\n\t\t\t};\n\n\t\t});\n\n\t};\n\n\tconst _parse_status = function(content) {\n\n\t\tlet ahead   = 0;\n\t\tlet changes = [];\n\t\tlet branch  = null;\n\n\t\tcontent.split('\\n').filter(line => line.trim()).map(line => {\n\n\t\t\tlet state = line.substr(0, 2);\n\t\t\tlet path  = line.substr(2).trim();\n\n\n\t\t\tif (state === '##') {\n\n\t\t\t\tif (path.includes('...')) {\n\n\t\t\t\t\tlet tmp1 = path.split('...');\n\t\t\t\t\tif (tmp1.length === 2) {\n\t\t\t\t\t\tbranch = tmp1[0];\n\t\t\t\t\t}\n\n\t\t\t\t\tlet tmp2 = tmp1[1].substr(tmp1[1].indexOf(' ')).trim();\n\t\t\t\t\tlet tmp3 = tmp2.split(/\\[ahead\\s([0-9]+)]/g);\n\t\t\t\t\tif (tmp3.length === 3) {\n\n\t\t\t\t\t\tlet tmp4 = parseInt(tmp3[1], 10);\n\t\t\t\t\t\tif (!isNaN(tmp4)) {\n\t\t\t\t\t\t\tahead = tmp4;\n\t\t\t\t\t\t}\n\n\t\t\t\t\t}\n\n\t\t\t\t} else {\n\n\t\t\t\t\tbranch = path;\n\n\t\t\t\t}\n\n\t\t\t} else if (path.length > 0) {\n\n\t\t\t\tif (path.startsWith('./')) {\n\t\t\t\t\tpath = path.substr(1);\n\t\t\t\t}\n\n\t\t\t\tif (path.charAt(0) !== '/') {\n\t\t\t\t\tpath = '/' + path;\n\t\t\t\t}\n\n\t\t\t\tchanges.push({\n\t\t\t\t\tstate: state,\n\t\t\t\t\tpath:  path\n\t\t\t\t});\n\n\t\t\t}\n\n\t\t});\n\n\n\t\treturn {\n\t\t\tbranch:  branch,\n\t\t\tahead:   ahead,\n\t\t\tchanges: changes\n\t\t};\n\n\t};\n\n\tconst _get_log = function() {\n\n\t\tlet development = _parse_log((this.filesystem.read('/logs/refs/remotes/origin/development') || '').toString('utf8'));\n\t\tlet master      = _parse_log((this.filesystem.read('/logs/refs/remotes/origin/master')      || '').toString('utf8'));\n\t\tlet branch      = _parse_log((this.filesystem.read('/logs/HEAD')                            || '').toString('utf8'));\n\t\tlet diff        = branch.filter(commit => {\n\n\t\t\tlet is_master      = master.find(other => other.hash === commit.hash);\n\t\t\tlet is_development = development.find(other => other.hash === commit.hash);\n\n\t\t\tif (is_master === false && is_development === false) {\n\t\t\t\treturn true;\n\t\t\t}\n\n\t\t\treturn false;\n\n\t\t});\n\n\n\t\treturn {\n\t\t\tmaster:      master,\n\t\t\tdevelopment: development,\n\t\t\tbranch:      branch,\n\t\t\tdiff:        diff\n\t\t};\n\n\t};\n\n\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tconst Composite = function(data) {\n\n\t\tlet states = Object.assign({}, data);\n\n\n\t\tthis.identifier = typeof states.identifier === 'string' ? states.identifier : '';\n\t\tthis.filesystem = new _Filesystem({\n\t\t\troot: this.identifier + '/.git'\n\t\t});\n\n\n\t\tstates = null;\n\n\t};\n\n\n\tComposite.STATUS = {\n\t\tignore: 0,\n\t\tupdate: 1,\n\t\tmanual: 2\n\t};\n\n\n\tComposite.prototype = {\n\n\t\t/*\n\t\t * ENTITY API\n\t\t */\n\n\t\tdeserialize: function(blob) {\n\n\t\t\tif (blob.filesystem instanceof Object) {\n\t\t\t\tthis.filesystem = lychee.deserialize(blob.filesystem);\n\t\t\t}\n\n\t\t},\n\n\t\tserialize: function() {\n\n\t\t\tlet states = {};\n\t\t\tlet blob   = {};\n\n\n\t\t\tif (this.identifier !== '') states.identifier = this.identifier;\n\n\t\t\tif (this.filesystem !== null) blob.filesystem = lychee.serialize(this.filesystem);\n\n\n\t\t\treturn {\n\t\t\t\t'constructor': 'harvester.data.Git',\n\t\t\t\t'arguments':   [ states ],\n\t\t\t\t'blob':        Object.keys(blob).length > 0 ? blob : null\n\t\t\t};\n\n\t\t},\n\n\n\n\t\t/*\n\t\t * CUSTOM API\n\t\t */\n\n\t\tcheckout: function(branch, path) {\n\n\t\t\tbranch = typeof branch === 'string' ? branch : null;\n\t\t\tpath   = typeof path === 'string'   ? path   : null;\n\n\n\t\t\tif (branch !== null && path !== null) {\n\n\t\t\t\tlet filesystem = this.filesystem;\n\t\t\t\tlet result     = null;\n\n\t\t\t\ttry {\n\n\t\t\t\t\tlet cwd  = _ROOT;\n\t\t\t\t\tlet root = _ROOT + path;\n\n\t\t\t\t\tlet tmp = filesystem.root.split('/');\n\t\t\t\t\tif (tmp.pop() === '.git') {\n\t\t\t\t\t\tcwd = tmp.join('/');\n\t\t\t\t\t}\n\n\t\t\t\t\tlet real = _path.relative(cwd, root);\n\t\t\t\t\tif (real.startsWith('..') === false) {\n\n\t\t\t\t\t\tlet handle = _child_process.spawnSync('git', [\n\t\t\t\t\t\t\t'checkout',\n\t\t\t\t\t\t\t'--quiet',\n\t\t\t\t\t\t\t'origin/' + branch,\n\t\t\t\t\t\t\t'./' + real\n\t\t\t\t\t\t], {\n\t\t\t\t\t\t\tcwd: cwd\n\t\t\t\t\t\t});\n\n\t\t\t\t\t\tlet stdout = (handle.stdout || '').toString().trim();\n\t\t\t\t\t\tlet stderr = (handle.stderr || '').toString().trim();\n\t\t\t\t\t\tif (stderr !== '') {\n\t\t\t\t\t\t\tresult = null;\n\t\t\t\t\t\t} else {\n\t\t\t\t\t\t\tresult = stdout;\n\t\t\t\t\t\t}\n\n\t\t\t\t\t}\n\n\t\t\t\t} catch (err) {\n\n\t\t\t\t\tconsole.error(err.message);\n\n\t\t\t\t\tresult = null;\n\n\t\t\t\t}\n\n\t\t\t\treturn result !== null;\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t},\n\n\t\tfetch: function(remote, branch) {\n\n\t\t\tremote = typeof remote === 'string' ? remote : 'upstream';\n\t\t\tbranch = typeof branch === 'string' ? branch : 'development';\n\n\n\t\t\tif (remote !== null && branch !== null) {\n\n\t\t\t\tlet filesystem = this.filesystem;\n\t\t\t\tlet result     = null;\n\n\t\t\t\ttry {\n\n\t\t\t\t\tlet cwd = _ROOT;\n\t\t\t\t\tlet tmp = filesystem.root.split('/');\n\t\t\t\t\tif (tmp.pop() === '.git') {\n\t\t\t\t\t\tcwd = tmp.join('/');\n\t\t\t\t\t}\n\n\t\t\t\t\tresult = _child_process.execSync('git fetch --quiet ' + remote + ' \"' + branch + '\"', {\n\t\t\t\t\t\tcwd: cwd\n\t\t\t\t\t}).toString();\n\n\t\t\t\t} catch (err) {\n\n\t\t\t\t\tresult = null;\n\n\t\t\t\t}\n\n\t\t\t\treturn result !== null;\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t},\n\n\t\tconfig: function() {\n\n\t\t\tlet config  = (this.filesystem.read('/config') || '').toString().trim();\n\t\t\tlet remotes = _parse_remotes(config);\n\n\n\t\t\treturn {\n\t\t\t\tremotes: remotes\n\t\t\t};\n\n\t\t},\n\n\t\treport: function() {\n\n\t\t\tlet head       = (this.filesystem.read('/HEAD')       || '').toString().trim();\n\t\t\tlet fetch_head = (this.filesystem.read('/FETCH_HEAD') || '').toString().trim();\n\t\t\tlet orig_head  = (this.filesystem.read('/ORIG_HEAD')  || '').toString().trim();\n\t\t\tlet branch     = 'master';\n\n\n\t\t\tif (head.startsWith('ref: ')) {\n\n\t\t\t\tif (head.startsWith('ref: refs/heads/')) {\n\t\t\t\t\tbranch = head.substr(16).trim();\n\t\t\t\t}\n\n\t\t\t\tlet ref = this.filesystem.read('/' + head.substr(5));\n\t\t\t\tif (ref !== null) {\n\t\t\t\t\thead = ref.toString().trim();\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t\tif (fetch_head.includes('\\t')) {\n\t\t\t\tfetch_head = fetch_head.split('\\t')[0];\n\t\t\t}\n\n\n\t\t\tlet log    = _get_log.call(this);\n\t\t\tlet status = Composite.STATUS.manual;\n\n\t\t\tif (log.diff.length === 0) {\n\n\t\t\t\tif (head === fetch_head) {\n\n\t\t\t\t\tstatus = Composite.STATUS.ignore;\n\n\t\t\t\t} else {\n\n\t\t\t\t\tlet check = log.development.find(other => other.hash === head);\n\t\t\t\t\tif (check !== undefined) {\n\t\t\t\t\t\tstatus = Composite.STATUS.update;\n\t\t\t\t\t} else {\n\t\t\t\t\t\tstatus = Composite.STATUS.manual;\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\n\t\t\t\t// XXX: Verify that user did not break their git history\n\t\t\t\tif (fetch_head !== orig_head) {\n\n\t\t\t\t\tlet check = log.development.find(other => other.hash === orig_head);\n\t\t\t\t\tif (check !== undefined) {\n\t\t\t\t\t\tstatus = Composite.STATUS.update;\n\t\t\t\t\t} else {\n\t\t\t\t\t\tstatus = Composite.STATUS.manual;\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t} else {\n\n\t\t\t\tstatus = Composite.STATUS.manual;\n\n\t\t\t}\n\n\n\t\t\treturn {\n\t\t\t\tbranch: branch,\n\t\t\t\tlog:    log,\n\t\t\t\tstatus: status,\n\t\t\t\thead: {\n\t\t\t\t\tbranch: head,\n\t\t\t\t\tfetch:  fetch_head,\n\t\t\t\t\torigin: orig_head\n\t\t\t\t}\n\t\t\t};\n\n\t\t},\n\n\t\tstatus: function() {\n\n\t\t\tlet filesystem = this.filesystem;\n\t\t\tlet result     = null;\n\n\t\t\ttry {\n\n\t\t\t\tlet root = _ROOT;\n\t\t\t\tlet tmp  = filesystem.root.split('/');\n\t\t\t\tif (tmp.pop() === '.git') {\n\n\t\t\t\t\tif (tmp.length > 0) {\n\t\t\t\t\t\troot = _ROOT + '/' + tmp.join('/');\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\n\t\t\t\tlet handle = _child_process.spawnSync('git', [\n\t\t\t\t\t'status',\n\t\t\t\t\t'-b',\n\t\t\t\t\t'--porcelain'\n\t\t\t\t], {\n\t\t\t\t\tcwd: root\n\t\t\t\t});\n\n\t\t\t\tlet stdout = (handle.stdout || '').toString().trim();\n\t\t\t\tlet stderr = (handle.stderr || '').toString().trim();\n\t\t\t\tif (stderr !== '') {\n\t\t\t\t\tresult = null;\n\t\t\t\t} else {\n\t\t\t\t\tresult = stdout;\n\t\t\t\t}\n\n\t\t\t} catch (err) {\n\n\t\t\t\tresult = null;\n\n\t\t\t}\n\n\n\t\t\tif (result !== null) {\n\n\t\t\t\treturn _parse_status(result);\n\n\t\t\t}\n\n\n\t\t\treturn null;\n\n\t\t}\n\n\t};\n\n\n\treturn Composite;\n\n}"
					}
				},
				"lychee.net.service.Debugger": {
					"constructor": "lychee.Definition",
					"arguments": [
						{
							"id": "lychee.net.service.Debugger",
							"url": "/libraries/lychee/source/net/service/Debugger.js"
						}
					],
					"blob": {
						"attaches": {},
						"includes": [
							"lychee.net.Service"
						],
						"exports": "(lychee, global, attachments) => {\n\n\tconst _Service = lychee.import('lychee.net.Service');\n\tconst _TUNNELS = [];\n\n\n\n\t/*\n\t * HELPERS\n\t */\n\n\tconst _resolve_reference = function(identifier) {\n\n\t\tlet pointer = this;\n\n\t\tlet ns = identifier.split('.');\n\t\tfor (let n = 0, l = ns.length; n < l; n++) {\n\n\t\t\tlet name = ns[n];\n\n\t\t\tif (pointer[name] !== undefined) {\n\t\t\t\tpointer = pointer[name];\n\t\t\t} else {\n\t\t\t\tpointer = null;\n\t\t\t\tbreak;\n\t\t\t}\n\n\t\t}\n\n\t\treturn pointer;\n\n\t};\n\n\tconst _bind_console = function(event) {\n\n\t\tthis.bind(event, function(data) {\n\n\t\t\tlet tunnel = this.tunnel;\n\t\t\tif (tunnel !== null && tunnel.type === 'remote') {\n\n\t\t\t\tlet tid = data.tid || null;\n\t\t\t\tif (tid !== null) {\n\n\t\t\t\t\tlet other = _TUNNELS.find(t => t.id === tid) || null;\n\t\t\t\t\tif (other !== null) {\n\n\t\t\t\t\t\tother.send(data, {\n\t\t\t\t\t\t\tid: this.id,\n\t\t\t\t\t\t\tevent: 'console'\n\t\t\t\t\t\t});\n\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t}, this);\n\n\t};\n\n\tconst _bind_relay = function(event) {\n\n\t\tthis.bind(event, function(data) {\n\n\t\t\tlet tunnel = this.tunnel;\n\t\t\tif (tunnel !== null && tunnel.type === 'remote') {\n\n\t\t\t\tlet tid = data.tid || null;\n\t\t\t\tif (tid !== null) {\n\n\t\t\t\t\tlet other = _TUNNELS.find(t => t.id === tid) || null;\n\t\t\t\t\tif (other !== null) {\n\n\t\t\t\t\t\tdata.receiver = tunnel.id;\n\n\t\t\t\t\t\tother.send(data, {\n\t\t\t\t\t\t\tid: this.id,\n\t\t\t\t\t\t\tevent: event\n\t\t\t\t\t\t});\n\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t}, this);\n\n\t};\n\n\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tconst Composite = function(data) {\n\n\t\tlet states = Object.assign({}, data);\n\n\n\t\t_Service.call(this, states);\n\n\t\tstates = null;\n\n\n\n\t\t/*\n\t\t * INITIALIZATION: CLIENT\n\t\t */\n\n\t\tthis.bind('define', function(data) {\n\n\t\t\tlet tunnel = this.tunnel;\n\t\t\tif (tunnel !== null && tunnel.type === 'client') {\n\n\t\t\t\tif (typeof data.construtor === 'string' || typeof data.reference === 'string') {\n\n\t\t\t\t\tlet environment = (lychee.environment !== null ? lychee.environment : null);\n\t\t\t\t\tlet value       = false;\n\t\t\t\t\tlet definition  = lychee.deserialize(data);\n\n\t\t\t\t\tif (environment !== null) {\n\t\t\t\t\t\tvalue = environment.define(definition);\n\t\t\t\t\t}\n\n\n\t\t\t\t\tif (tunnel !== null) {\n\n\t\t\t\t\t\ttunnel.send({\n\t\t\t\t\t\t\ttid:   data.receiver,\n\t\t\t\t\t\t\tvalue: value === true\n\t\t\t\t\t\t}, {\n\t\t\t\t\t\t\tid: this.id,\n\t\t\t\t\t\t\tevent: 'define-value'\n\t\t\t\t\t\t});\n\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t}, this);\n\n\t\tthis.bind('execute', function(data) {\n\n\t\t\tlet tunnel = this.tunnel;\n\t\t\tif (tunnel !== null && tunnel.type === 'client') {\n\n\t\t\t\tif (typeof data.reference === 'string') {\n\n\t\t\t\t\tlet scope    = (lychee.environment !== null ? lychee.environment.global : global);\n\t\t\t\t\tlet value    = null;\n\t\t\t\t\tlet instance = _resolve_reference.call(scope, data.reference);\n\t\t\t\t\tlet bindargs = Array.from(data.arguments).map(value => {\n\n\t\t\t\t\t\tif (typeof value === 'string' && value.charAt(0) === '#') {\n\n\t\t\t\t\t\t\tif (lychee.debug === true) {\n\t\t\t\t\t\t\t\tconsole.log('lychee.net.service.Debugger: Injecting \"' + value + '\" from global');\n\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t\tlet resolved_injection = _resolve_reference.call(scope, value.substr(1));\n\t\t\t\t\t\t\tif (resolved_injection !== null) {\n\t\t\t\t\t\t\t\tvalue = null;\n\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t}\n\n\t\t\t\t\t\treturn value;\n\n\t\t\t\t\t});\n\n\n\t\t\t\t\tif (typeof instance === 'object') {\n\n\t\t\t\t\t\tvalue = lychee.serialize(instance);\n\n\t\t\t\t\t} else if (typeof resolved === 'function') {\n\n\t\t\t\t\t\tvalue = instance(bindargs);\n\n\t\t\t\t\t}\n\n\n\t\t\t\t\tif (value === undefined) {\n\t\t\t\t\t\tvalue = null;\n\t\t\t\t\t}\n\n\t\t\t\t\ttunnel.send({\n\t\t\t\t\t\ttid:   data.receiver,\n\t\t\t\t\t\tvalue: value\n\t\t\t\t\t}, {\n\t\t\t\t\t\tid: this.id,\n\t\t\t\t\t\tevent: 'execute-value'\n\t\t\t\t\t});\n\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t}, this);\n\n\t\tthis.bind('expose', function(data) {\n\n\t\t\tlet tunnel = this.tunnel;\n\t\t\tif (tunnel !== null && tunnel.type === 'client') {\n\n\t\t\t\tif (typeof data.reference === 'string') {\n\n\t\t\t\t\tlet scope       = (lychee.environment !== null ? lychee.environment.global : global);\n\t\t\t\t\tlet environment = _resolve_reference.call(scope, data.reference);\n\t\t\t\t\tlet value       = lychee.Debugger.expose(environment);\n\n\t\t\t\t\ttunnel.send({\n\t\t\t\t\t\ttid:   data.receiver,\n\t\t\t\t\t\tvalue: value\n\t\t\t\t\t}, {\n\t\t\t\t\t\tid: this.id,\n\t\t\t\t\t\tevent: 'expose-value'\n\t\t\t\t\t});\n\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t}, this);\n\n\t\tthis.bind('snapshot', function(data) {\n\n\t\t\tlet tunnel = this.tunnel;\n\t\t\tif (tunnel !== null && tunnel.type === 'client') {\n\n\t\t\t\tif (typeof data.reference === 'string') {\n\n\t\t\t\t\tlet scope    = (lychee.environment !== null ? lychee.environment.global : global);\n\t\t\t\t\tlet instance = _resolve_reference.call(scope, data.reference);\n\t\t\t\t\tlet value    = lychee.serialize(instance);\n\n\t\t\t\t\ttunnel.send({\n\t\t\t\t\t\ttid:   data.receiver,\n\t\t\t\t\t\tvalue: value\n\t\t\t\t\t}, {\n\t\t\t\t\t\tid:    'debugger',\n\t\t\t\t\t\tevent: 'snapshot-value'\n\t\t\t\t\t});\n\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t}, this);\n\n\n\n\t\t/*\n\t\t * INITIALIZATION: REMOTE\n\t\t */\n\n\t\tthis.bind('plug', function() {\n\n\t\t\tlet tunnel = this.tunnel;\n\t\t\tif (tunnel !== null && tunnel.type === 'remote') {\n\t\t\t\t_TUNNELS.push(tunnel);\n\t\t\t}\n\n\t\t}, this);\n\n\t\tthis.bind('unplug', function() {\n\n\t\t\tlet tunnel = this.tunnel;\n\t\t\tif (tunnel !== null && tunnel.type === 'remote') {\n\n\t\t\t\tlet index = _TUNNELS.indexOf(tunnel);\n\t\t\t\tif (index !== -1) {\n\t\t\t\t\t_TUNNELS.splice(index, 1);\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t}, this);\n\n\t\t// Relay events to proper tunnel (data.tid)\n\t\t_bind_relay.call(this, 'define');\n\t\t_bind_relay.call(this, 'execute');\n\t\t_bind_relay.call(this, 'expose');\n\t\t_bind_relay.call(this, 'snapshot');\n\n\t\t// Relay events to proper tunnel (data.receiver > data.tid)\n\t\t_bind_console.call(this, 'define-value');\n\t\t_bind_console.call(this, 'execute-value');\n\t\t_bind_console.call(this, 'expose-value');\n\t\t_bind_console.call(this, 'snapshot-value');\n\n\t};\n\n\n\tComposite.prototype = {\n\n\t\t/*\n\t\t * ENTITY API\n\t\t */\n\n\t\t// deserialize: function(blob) {},\n\n\t\tserialize: function() {\n\n\t\t\tlet data = _Service.prototype.serialize.call(this);\n\t\t\tdata['constructor'] = 'lychee.net.service.Debugger';\n\n\n\t\t\treturn data;\n\n\t\t},\n\n\n\n\t\t/*\n\t\t * CUSTOM API\n\t\t */\n\n\t\tdefine: function(tid, data) {\n\n\t\t\ttid  = typeof tid === 'string' ? tid  : null;\n\t\t\tdata = data instanceof Object  ? data : null;\n\n\n\t\t\tif (data !== null) {\n\n\t\t\t\treturn this.send({\n\t\t\t\t\ttid:         tid,\n\t\t\t\t\tconstructor: data.constructor || null,\n\t\t\t\t\treference:   data.reference   || null,\n\t\t\t\t\targuments:   data.arguments   || null\n\t\t\t\t}, {\n\t\t\t\t\tevent: 'define'\n\t\t\t\t});\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t},\n\n\t\texecute: function(tid, data) {\n\n\t\t\ttid  = typeof tid === 'string' ? tid  : null;\n\t\t\tdata = data instanceof Object  ? data : null;\n\n\n\t\t\tif (data !== null) {\n\n\t\t\t\treturn this.send({\n\t\t\t\t\ttid:       tid,\n\t\t\t\t\treference: data.reference || null,\n\t\t\t\t\targuments: data.arguments || null\n\t\t\t\t}, {\n\t\t\t\t\tevent: 'execute'\n\t\t\t\t});\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t},\n\n\t\texpose: function(tid, data) {\n\n\t\t\ttid  = typeof tid === 'string' ? tid  : null;\n\t\t\tdata = data instanceof Object  ? data : null;\n\n\n\t\t\tif (tid !== null && data !== null) {\n\n\t\t\t\treturn this.send({\n\t\t\t\t\ttid:       tid,\n\t\t\t\t\treference: data.reference || null\n\t\t\t\t}, {\n\t\t\t\t\tevent: 'expose'\n\t\t\t\t});\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t},\n\n\t\treport: function(message, blob) {\n\n\t\t\tmessage = typeof message === 'string' ? message : null;\n\t\t\tblob    = blob instanceof Object      ? blob    : null;\n\n\n\t\t\tif (message !== null) {\n\n\t\t\t\treturn this.send({\n\t\t\t\t\tmessage: message,\n\t\t\t\t\tblob:    blob\n\t\t\t\t}, {\n\t\t\t\t\tevent: 'error'\n\t\t\t\t});\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t},\n\n\t\tsnapshot: function(tid, data) {\n\n\t\t\ttid  = typeof tid === 'string' ? tid  : null;\n\t\t\tdata = data instanceof Object  ? data : null;\n\n\n\t\t\tif (tid !== null && data !== null) {\n\n\t\t\t\treturn this.send({\n\t\t\t\t\ttid:       tid,\n\t\t\t\t\treference: data.reference || null\n\t\t\t\t}, {\n\t\t\t\t\tevent: 'snapshot'\n\t\t\t\t});\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t}\n\n\t};\n\n\n\treturn Composite;\n\n}"
					}
				},
				"lychee.net.service.Storage": {
					"constructor": "lychee.Definition",
					"arguments": [
						{
							"id": "lychee.net.service.Storage",
							"url": "/libraries/lychee/source/net/service/Storage.js"
						}
					],
					"blob": {
						"attaches": {},
						"includes": [
							"lychee.net.Service"
						],
						"exports": "(lychee, global, attachments) => {\n\n\tconst _Service = lychee.import('lychee.net.Service');\n\n\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tconst Composite = function(data) {\n\n\t\tlet states = Object.assign({}, data);\n\n\n\t\t_Service.call(this, states);\n\n\t\tstates = null;\n\n\n\n\t\t/*\n\t\t * INITIALIZATION\n\t\t */\n\n\t\tthis.bind('sync', function(data) {\n\n\t\t\tlet tunnel = this.tunnel;\n\t\t\tif (tunnel !== null && tunnel.type === 'remote') {\n\n\t\t\t\tthis.broadcast(data, {\n\t\t\t\t\tevent: 'sync'\n\t\t\t\t});\n\n\t\t\t}\n\n\t\t}, this);\n\n\t};\n\n\n\tComposite.prototype = {\n\n\t\t/*\n\t\t * ENTITY API\n\t\t */\n\n\t\t// deserialize: function(blob) {},\n\n\t\tserialize: function() {\n\n\t\t\tlet data = _Service.prototype.serialize.call(this);\n\t\t\tdata['constructor'] = 'lychee.net.service.Storage';\n\n\n\t\t\treturn data;\n\n\t\t},\n\n\n\n\t\t/*\n\t\t * CUSTOM API\n\t\t */\n\n\t\tsync: function(objects) {\n\n\t\t\tobjects = objects instanceof Array ? objects : null;\n\n\n\t\t\tif (objects !== null) {\n\n\t\t\t\treturn this.send({\n\t\t\t\t\ttimestamp: Date.now(),\n\t\t\t\t\tobjects:   objects\n\t\t\t\t}, {\n\t\t\t\t\tevent: 'sync'\n\t\t\t\t});\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t}\n\n\t};\n\n\n\treturn Composite;\n\n}"
					}
				},
				"lychee.net.service.Stash": {
					"constructor": "lychee.Definition",
					"arguments": [
						{
							"id": "lychee.net.service.Stash",
							"url": "/libraries/lychee/source/net/service/Stash.js"
						}
					],
					"blob": {
						"attaches": {},
						"includes": [
							"lychee.net.Service"
						],
						"exports": "(lychee, global, attachments) => {\n\n\tconst _Service = lychee.import('lychee.net.Service');\n\n\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tconst Composite = function(data) {\n\n\t\tlet states = Object.assign({}, data);\n\n\n\t\t_Service.call(this, states);\n\n\t\tstates = null;\n\n\n\n\t\t/*\n\t\t * INITIALIZATION\n\t\t */\n\n\t\tthis.bind('sync', function(data) {\n\n\t\t\tlet tunnel = this.tunnel;\n\t\t\tif (tunnel !== null && tunnel.type === 'remote') {\n\n\t\t\t\tthis.broadcast(data, {\n\t\t\t\t\tevent: 'sync'\n\t\t\t\t});\n\n\t\t\t}\n\n\t\t}, this);\n\n\t};\n\n\n\tComposite.prototype = {\n\n\t\t/*\n\t\t * ENTITY API\n\t\t */\n\n\t\t// deserialize: function(blob) {},\n\n\t\tserialize: function() {\n\n\t\t\tlet data = _Service.prototype.serialize.call(this);\n\t\t\tdata['constructor'] = 'lychee.net.service.Stash';\n\n\n\t\t\treturn data;\n\n\t\t},\n\n\n\n\t\t/*\n\t\t * CUSTOM API\n\t\t */\n\n\t\tsync: function(assets) {\n\n\t\t\tassets = assets instanceof Object ? assets : null;\n\n\n\t\t\tif (assets !== null) {\n\n\t\t\t\tlet data = {};\n\n\t\t\t\tfor (let id in assets) {\n\t\t\t\t\tdata[id] = lychee.serialize(assets[id]);\n\t\t\t\t}\n\n\n\t\t\t\treturn this.send({\n\t\t\t\t\ttimestamp: Date.now(),\n\t\t\t\t\tassets:    data\n\t\t\t\t}, {\n\t\t\t\t\tevent: 'sync'\n\t\t\t\t});\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t}\n\n\t};\n\n\n\treturn Composite;\n\n}"
					}
				},
				"lychee.net.Client": {
					"constructor": "lychee.Definition",
					"arguments": [
						{
							"id": "lychee.net.Client",
							"url": "/libraries/lychee/source/net/Client.js"
						}
					],
					"blob": {
						"attaches": {},
						"requires": [
							"lychee.net.service.Debugger",
							"lychee.net.service.Stash",
							"lychee.net.service.Storage"
						],
						"includes": [
							"lychee.net.Tunnel"
						],
						"exports": "(lychee, global, attachments) => {\n\n\tconst _Debugger = lychee.import('lychee.net.service.Debugger');\n\tconst _Stash    = lychee.import('lychee.net.service.Stash');\n\tconst _Storage  = lychee.import('lychee.net.service.Storage');\n\tconst _Tunnel   = lychee.import('lychee.net.Tunnel');\n\n\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tconst Composite = function(data) {\n\n\t\tlet states = Object.assign({}, data);\n\n\n\t\tstates.type = 'client';\n\n\t\t_Tunnel.call(this, states);\n\n\t\tstates = null;\n\n\n\n\t\t/*\n\t\t * INITIALIZATION\n\t\t */\n\n\t\tif (lychee.debug === true) {\n\n\t\t\tthis.bind('connect', function() {\n\n\t\t\t\tthis.addService(new _Debugger({\n\t\t\t\t\tid: 'debugger',\n\t\t\t\t\ttunnel: this\n\t\t\t\t}));\n\n\t\t\t}, this);\n\n\t\t}\n\n\n\t\tthis.bind('connect', function() {\n\n\t\t\tthis.addService(new _Stash({\n\t\t\t\tid: 'stash',\n\t\t\t\ttunnel: this\n\t\t\t}));\n\n\t\t\tthis.addService(new _Storage({\n\t\t\t\tid: 'storage',\n\t\t\t\ttunnel: this\n\t\t\t}));\n\n\t\t}, this);\n\n\t};\n\n\n\tComposite.prototype = {\n\n\t\t/*\n\t\t * ENTITY API\n\t\t */\n\n\t\t// deserialize: function(blob) {},\n\n\t\tserialize: function() {\n\n\t\t\tlet data = _Tunnel.prototype.serialize.call(this);\n\t\t\tdata['constructor'] = 'lychee.net.Client';\n\n\n\t\t\treturn data;\n\n\t\t}\n\n\t};\n\n\n\treturn Composite;\n\n}"
					}
				},
				"lychee.net.socket.HTTP": {
					"constructor": "lychee.Definition",
					"arguments": [
						{
							"id": "lychee.net.socket.HTTP",
							"url": "/libraries/lychee/source/platform/node/net/socket/HTTP.js"
						}
					],
					"blob": {
						"attaches": {},
						"tags": {
							"platform": "node"
						},
						"requires": [
							"lychee.net.protocol.HTTP"
						],
						"includes": [
							"lychee.event.Emitter"
						],
						"supports": "(lychee, global) => {\n\n\tif (typeof global.require === 'function') {\n\n\t\ttry {\n\n\t\t\tglobal.require('net');\n\n\t\t\treturn true;\n\n\t\t} catch (err) {\n\t\t}\n\n\t}\n\n\n\treturn false;\n\n}",
						"exports": "(lychee, global, attachments) => {\n\n\tconst _net      = global.require('net');\n\tconst _Emitter  = lychee.import('lychee.event.Emitter');\n\tconst _Protocol = lychee.import('lychee.net.protocol.HTTP');\n\n\n\n\t/*\n\t * HELPERS\n\t */\n\n\tconst _connect_socket = function(socket, protocol) {\n\n\t\tif (this.__connection !== socket) {\n\n\t\t\tsocket.on('data', blob => {\n\n\t\t\t\tlet chunks = protocol.receive(blob);\n\t\t\t\tif (chunks.length > 0) {\n\n\t\t\t\t\tfor (let c = 0, cl = chunks.length; c < cl; c++) {\n\t\t\t\t\t\tthis.trigger('receive', [ chunks[c].payload, chunks[c].headers ]);\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t});\n\n\t\t\tsocket.on('error', _ => {\n\t\t\t\tthis.trigger('error');\n\t\t\t\tthis.disconnect();\n\t\t\t});\n\n\t\t\tsocket.on('timeout', _ => {\n\t\t\t\tthis.trigger('error');\n\t\t\t\tthis.disconnect();\n\t\t\t});\n\n\t\t\tsocket.on('close', _ => {\n\t\t\t\tthis.disconnect();\n\t\t\t});\n\n\t\t\tsocket.on('end', _ => {\n\t\t\t\tthis.disconnect();\n\t\t\t});\n\n\n\t\t\tthis.__connection = socket;\n\t\t\tthis.__protocol   = protocol;\n\n\t\t\tthis.trigger('connect');\n\n\t\t}\n\n\t};\n\n\tconst _disconnect_socket = function(socket, protocol) {\n\n\t\tif (this.__connection === socket) {\n\n\t\t\tsocket.removeAllListeners('data');\n\t\t\tsocket.removeAllListeners('error');\n\t\t\tsocket.removeAllListeners('timeout');\n\t\t\tsocket.removeAllListeners('close');\n\t\t\tsocket.removeAllListeners('end');\n\n\t\t\tsocket.destroy();\n\t\t\tprotocol.close();\n\n\n\t\t\tthis.__connection = null;\n\t\t\tthis.__protocol   = null;\n\n\t\t\tthis.trigger('disconnect');\n\n\t\t}\n\n\t};\n\n\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tconst Composite = function() {\n\n\t\tthis.__connection = null;\n\t\tthis.__protocol   = null;\n\n\n\t\t_Emitter.call(this);\n\n\t};\n\n\n\tComposite.prototype = {\n\n\t\t/*\n\t\t * ENTITY API\n\t\t */\n\n\t\t// deserialize: function(blob) {},\n\n\t\tserialize: function() {\n\n\t\t\tlet data = _Emitter.prototype.serialize.call(this);\n\t\t\tdata['constructor'] = 'lychee.net.socket.HTTP';\n\n\n\t\t\treturn data;\n\n\t\t},\n\n\n\n\t\t/*\n\t\t * CUSTOM API\n\t\t */\n\n\t\tconnect: function(host, port, connection) {\n\n\t\t\thost       = typeof host === 'string'       ? host       : null;\n\t\t\tport       = typeof port === 'number'       ? (port | 0) : null;\n\t\t\tconnection = typeof connection === 'object' ? connection : null;\n\n\n\t\t\tif (host !== null && port !== null) {\n\n\t\t\t\tif (connection !== null) {\n\n\t\t\t\t\tconnection.allowHalfOpen = true;\n\t\t\t\t\tconnection.setTimeout(0);\n\t\t\t\t\tconnection.setNoDelay(true);\n\t\t\t\t\tconnection.setKeepAlive(true, 0);\n\t\t\t\t\tconnection.removeAllListeners('timeout');\n\n\n\t\t\t\t\t_connect_socket.call(this, connection, new _Protocol({\n\t\t\t\t\t\ttype: _Protocol.TYPE.remote\n\t\t\t\t\t}));\n\n\t\t\t\t\tconnection.resume();\n\n\t\t\t\t} else {\n\n\t\t\t\t\tconnection = new _net.Socket({\n\t\t\t\t\t\treadable: true,\n\t\t\t\t\t\twritable: true\n\t\t\t\t\t});\n\n\t\t\t\t\tconnection.allowHalfOpen = true;\n\t\t\t\t\tconnection.setTimeout(0);\n\t\t\t\t\tconnection.setNoDelay(true);\n\t\t\t\t\tconnection.setKeepAlive(true, 0);\n\t\t\t\t\tconnection.removeAllListeners('timeout');\n\n\n\t\t\t\t\t_connect_socket.call(this, connection, new _Protocol({\n\t\t\t\t\t\ttype: _Protocol.TYPE.client\n\t\t\t\t\t}));\n\n\t\t\t\t\tconnection.connect({\n\t\t\t\t\t\thost: host,\n\t\t\t\t\t\tport: port\n\t\t\t\t\t});\n\n\t\t\t\t}\n\n\n\t\t\t\treturn true;\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t},\n\n\t\tsend: function(payload, headers, binary) {\n\n\t\t\tpayload = payload instanceof Buffer ? payload : null;\n\t\t\theaders = headers instanceof Object ? headers : null;\n\t\t\tbinary  = binary === true;\n\n\n\t\t\tif (payload !== null) {\n\n\t\t\t\tlet connection = this.__connection;\n\t\t\t\tlet protocol   = this.__protocol;\n\n\t\t\t\tif (connection !== null && protocol !== null) {\n\n\t\t\t\t\tlet chunk = protocol.send(payload, headers, binary);\n\t\t\t\t\tlet enc   = binary === true ? 'binary' : 'utf8';\n\n\t\t\t\t\tif (chunk !== null) {\n\n\t\t\t\t\t\tconnection.write(chunk, enc);\n\n\t\t\t\t\t\treturn true;\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t},\n\n\t\tdisconnect: function() {\n\n\t\t\tlet connection = this.__connection;\n\t\t\tlet protocol   = this.__protocol;\n\n\t\t\tif (connection !== null && protocol !== null) {\n\n\t\t\t\t_disconnect_socket.call(this, connection, protocol);\n\n\n\t\t\t\treturn true;\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t}\n\n\t};\n\n\n\treturn Composite;\n\n}"
					}
				},
				"lychee.net.socket.WS": {
					"constructor": "lychee.Definition",
					"arguments": [
						{
							"id": "lychee.net.socket.WS",
							"url": "/libraries/lychee/source/platform/node/net/socket/WS.js"
						}
					],
					"blob": {
						"attaches": {},
						"tags": {
							"platform": "node"
						},
						"requires": [
							"lychee.crypto.SHA1",
							"lychee.net.protocol.WS"
						],
						"includes": [
							"lychee.event.Emitter"
						],
						"supports": "(lychee, global) => {\n\n\tif (\n\t\ttypeof global.require === 'function'\n\t\t&& typeof global.setInterval === 'function'\n\t) {\n\n\t\ttry {\n\n\t\t\tglobal.require('net');\n\n\t\t\treturn true;\n\n\t\t} catch (err) {\n\t\t}\n\n\t}\n\n\n\treturn false;\n\n}",
						"exports": "(lychee, global, attachments) => {\n\n\tconst _net           = global.require('net');\n\tconst _clearInterval = global.clearInterval;\n\tconst _setInterval   = global.setInterval;\n\tconst _Emitter       = lychee.import('lychee.event.Emitter');\n\tconst _Protocol      = lychee.import('lychee.net.protocol.WS');\n\tconst _SHA1          = lychee.import('lychee.crypto.SHA1');\n\n\n\n\t/*\n\t * HELPERS\n\t */\n\n\tconst _connect_socket = function(socket, protocol) {\n\n\t\tif (this.__connection !== socket) {\n\n\t\t\tsocket.on('data', blob => {\n\n\t\t\t\tlet chunks = protocol.receive(blob);\n\t\t\t\tif (chunks.length > 0) {\n\n\t\t\t\t\tfor (let c = 0, cl = chunks.length; c < cl; c++) {\n\n\t\t\t\t\t\tlet chunk = chunks[c];\n\t\t\t\t\t\tif (chunk.payload[0] === 136) {\n\n\t\t\t\t\t\t\tthis.send(chunk.payload, chunk.headers, true);\n\t\t\t\t\t\t\tthis.disconnect();\n\n\t\t\t\t\t\t\treturn;\n\n\t\t\t\t\t\t} else {\n\n\t\t\t\t\t\t\tthis.trigger('receive', [ chunk.payload, chunk.headers ]);\n\n\t\t\t\t\t\t}\n\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t});\n\n\t\t\tsocket.on('error', _ => {\n\t\t\t\tthis.trigger('error');\n\t\t\t\tthis.disconnect();\n\t\t\t});\n\n\t\t\tsocket.on('timeout', _ => {\n\t\t\t\tthis.trigger('error');\n\t\t\t\tthis.disconnect();\n\t\t\t});\n\n\t\t\tsocket.on('close', _ => {\n\t\t\t\tthis.disconnect();\n\t\t\t});\n\n\t\t\tsocket.on('end', _ => {\n\t\t\t\tthis.disconnect();\n\t\t\t});\n\n\n\t\t\tthis.__connection = socket;\n\t\t\tthis.__protocol   = protocol;\n\n\t\t\tthis.trigger('connect');\n\n\t\t}\n\n\t};\n\n\tconst _disconnect_socket = function(socket, protocol) {\n\n\t\tif (this.__connection === socket) {\n\n\t\t\tsocket.removeAllListeners('data');\n\t\t\tsocket.removeAllListeners('error');\n\t\t\tsocket.removeAllListeners('timeout');\n\t\t\tsocket.removeAllListeners('close');\n\t\t\tsocket.removeAllListeners('end');\n\n\t\t\tsocket.destroy();\n\t\t\tprotocol.close();\n\n\n\t\t\tthis.__connection = null;\n\t\t\tthis.__protocol   = null;\n\n\t\t\tthis.trigger('disconnect');\n\n\t\t}\n\n\t};\n\n\tconst _verify_client = function(headers, nonce) {\n\n\t\tlet connection = (headers['connection'] || '').toLowerCase();\n\t\tlet upgrade    = (headers['upgrade']    || '').toLowerCase();\n\t\tlet protocol   = (headers['sec-websocket-protocol'] || '').toLowerCase();\n\n\t\tif (connection === 'upgrade' && upgrade === 'websocket' && protocol === 'lycheejs') {\n\n\t\t\tlet accept = (headers['sec-websocket-accept'] || '');\n\t\t\tlet expect = (function(nonce) {\n\n\t\t\t\tlet sha1 = new _SHA1();\n\t\t\t\tsha1.update(nonce + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11');\n\t\t\t\treturn sha1.digest().toString('base64');\n\n\t\t\t})(nonce.toString('base64'));\n\n\n\t\t\tif (accept === expect) {\n\t\t\t\treturn accept;\n\t\t\t}\n\n\t\t}\n\n\n\t\treturn null;\n\n\t};\n\n\tconst _verify_remote = function(headers) {\n\n\t\tlet connection = (headers['connection'] || '').toLowerCase();\n\t\tlet upgrade    = (headers['upgrade']    || '').toLowerCase();\n\t\tlet protocol   = (headers['sec-websocket-protocol'] || '').toLowerCase();\n\n\t\tif (connection === 'upgrade' && upgrade === 'websocket' && protocol === 'lycheejs') {\n\n\t\t\tlet host   = headers['host']   || null;\n\t\t\tlet nonce  = headers['sec-websocket-key'] || null;\n\t\t\tlet origin = headers['origin'] || null;\n\n\t\t\tif (host !== null && nonce !== null && origin !== null) {\n\n\t\t\t\tlet handshake = '';\n\t\t\t\tlet accept    = (function(nonce) {\n\n\t\t\t\t\tlet sha1 = new _SHA1();\n\t\t\t\t\tsha1.update(nonce + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11');\n\t\t\t\t\treturn sha1.digest().toString('base64');\n\n\t\t\t\t})(nonce);\n\n\n\t\t\t\t// HEAD\n\n\t\t\t\thandshake += 'HTTP/1.1 101 WebSocket Protocol Handshake\\r\\n';\n\t\t\t\thandshake += 'Upgrade: WebSocket\\r\\n';\n\t\t\t\thandshake += 'Connection: Upgrade\\r\\n';\n\n\t\t\t\thandshake += 'Sec-WebSocket-Version: '  + '13'       + '\\r\\n';\n\t\t\t\thandshake += 'Sec-WebSocket-Origin: '   + origin     + '\\r\\n';\n\t\t\t\thandshake += 'Sec-WebSocket-Protocol: ' + 'lycheejs' + '\\r\\n';\n\t\t\t\thandshake += 'Sec-WebSocket-Accept: '   + accept     + '\\r\\n';\n\n\n\t\t\t\t// BODY\n\t\t\t\thandshake += '\\r\\n';\n\n\n\t\t\t\treturn handshake;\n\n\t\t\t}\n\n\t\t}\n\n\n\t\treturn null;\n\n\t};\n\n\tconst _upgrade_client = function(host, port, nonce) {\n\n\t\tlet handshake  = '';\n\t\tlet identifier = lychee.ROOT.project;\n\n\n\t\tif (identifier.startsWith(lychee.ROOT.lychee)) {\n\t\t\tidentifier = lychee.ROOT.project.substr(lychee.ROOT.lychee.length + 1);\n\t\t}\n\n\t\tfor (let n = 0; n < 16; n++) {\n\t\t\tnonce[n] = Math.round(Math.random() * 0xff);\n\t\t}\n\n\n\n\t\t// HEAD\n\n\t\thandshake += 'GET / HTTP/1.1\\r\\n';\n\t\thandshake += 'Host: ' + host + ':' + port + '\\r\\n';\n\t\thandshake += 'Upgrade: WebSocket\\r\\n';\n\t\thandshake += 'Connection: Upgrade\\r\\n';\n\t\thandshake += 'Origin: lycheejs://' + identifier + '\\r\\n';\n\t\thandshake += 'Sec-WebSocket-Key: ' + nonce.toString('base64') + '\\r\\n';\n\t\thandshake += 'Sec-WebSocket-Version: 13\\r\\n';\n\t\thandshake += 'Sec-WebSocket-Protocol: lycheejs\\r\\n';\n\n\n\t\t// BODY\n\t\thandshake += '\\r\\n';\n\n\n\t\tthis.once('data', data => {\n\n\t\t\tlet headers = {};\n\t\t\tlet lines   = data.toString('utf8').split('\\r\\n');\n\n\n\t\t\tlines.forEach(line => {\n\n\t\t\t\tlet index = line.indexOf(':');\n\t\t\t\tif (index !== -1) {\n\n\t\t\t\t\tlet key = line.substr(0, index).trim().toLowerCase();\n\t\t\t\t\tlet val = line.substr(index + 1, line.length - index - 1).trim();\n\t\t\t\t\tif (/connection|upgrade|sec-websocket-version|sec-websocket-origin|sec-websocket-protocol/g.test(key)) {\n\t\t\t\t\t\theaders[key] = val.toLowerCase();\n\t\t\t\t\t} else if (key === 'sec-websocket-accept') {\n\t\t\t\t\t\theaders[key] = val;\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t});\n\n\n\t\t\tif (headers['connection'] === 'upgrade' && headers['upgrade'] === 'websocket') {\n\n\t\t\t\tthis.emit('upgrade', {\n\t\t\t\t\theaders: headers,\n\t\t\t\t\tsocket:  this\n\t\t\t\t});\n\n\t\t\t} else {\n\n\t\t\t\tlet err = new Error('connect ECONNREFUSED');\n\t\t\t\terr.code = 'ECONNREFUSED';\n\n\t\t\t\tthis.emit('error', err);\n\n\t\t\t}\n\n\t\t});\n\n\n\t\tthis.write(handshake, 'ascii');\n\n\t};\n\n\tconst _upgrade_remote = function(data) {\n\n\t\tlet lines   = data.toString('utf8').split('\\r\\n');\n\t\tlet headers = {};\n\n\n\t\tlines.forEach(line => {\n\n\t\t\tlet index = line.indexOf(':');\n\t\t\tif (index !== -1) {\n\n\t\t\t\tlet key = line.substr(0, index).trim().toLowerCase();\n\t\t\t\tlet val = line.substr(index + 1, line.length - index - 1).trim();\n\t\t\t\tif (/host|connection|upgrade|origin|sec-websocket-protocol/g.test(key)) {\n\t\t\t\t\theaders[key] = val.toLowerCase();\n\t\t\t\t} else if (key === 'sec-websocket-key') {\n\t\t\t\t\theaders[key] = val;\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t});\n\n\n\t\tif (headers['connection'] === 'upgrade' && headers['upgrade'] === 'websocket') {\n\n\t\t\tthis.emit('upgrade', {\n\t\t\t\theaders: headers,\n\t\t\t\tsocket:  this\n\t\t\t});\n\n\t\t} else {\n\n\t\t\tthis.destroy();\n\n\t\t}\n\n\t};\n\n\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tconst Composite = function() {\n\n\t\tthis.__connection = null;\n\t\tthis.__protocol   = null;\n\n\n\t\t_Emitter.call(this);\n\n\t};\n\n\n\tComposite.prototype = {\n\n\t\t/*\n\t\t * ENTITY API\n\t\t */\n\n\t\t// deserialize: function(blob) {},\n\n\t\tserialize: function() {\n\n\t\t\tlet data = _Emitter.prototype.serialize.call(this);\n\t\t\tdata['constructor'] = 'lychee.net.socket.WS';\n\n\n\t\t\treturn data;\n\n\t\t},\n\n\n\n\t\t/*\n\t\t * CUSTOM API\n\t\t */\n\n\t\tconnect: function(host, port, connection) {\n\n\t\t\thost       = typeof host === 'string'       ? host       : null;\n\t\t\tport       = typeof port === 'number'       ? (port | 0) : null;\n\t\t\tconnection = typeof connection === 'object' ? connection : null;\n\n\n\t\t\tif (host !== null && port !== null) {\n\n\t\t\t\tif (connection !== null) {\n\n\t\t\t\t\tconnection.once('data', _upgrade_remote.bind(connection));\n\t\t\t\t\tconnection.resume();\n\n\t\t\t\t\tconnection.once('error', err => {\n\n\t\t\t\t\t\tif (lychee.debug === true) {\n\n\t\t\t\t\t\t\tlet code = err.code || '';\n\t\t\t\t\t\t\tif (/ECONNABORTED|ECONNREFUSED|ECONNRESET/.test(code)) {\n\t\t\t\t\t\t\t\tconsole.warn('lychee.net.socket.WS: BAD CONNECTION to ' + host + ':' + port);\n\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t}\n\n\t\t\t\t\t\tthis.trigger('error');\n\t\t\t\t\t\tthis.disconnect();\n\n\t\t\t\t\t});\n\n\t\t\t\t\tconnection.on('upgrade', event => {\n\n\t\t\t\t\t\tlet protocol = new _Protocol({\n\t\t\t\t\t\t\ttype: _Protocol.TYPE.remote\n\t\t\t\t\t\t});\n\t\t\t\t\t\tlet socket   = event.socket || null;\n\n\n\t\t\t\t\t\tif (socket !== null) {\n\n\t\t\t\t\t\t\tlet verification = _verify_remote.call(socket, event.headers);\n\t\t\t\t\t\t\tif (verification !== null) {\n\n\t\t\t\t\t\t\t\tsocket.allowHalfOpen = true;\n\t\t\t\t\t\t\t\tsocket.setTimeout(0);\n\t\t\t\t\t\t\t\tsocket.setNoDelay(true);\n\t\t\t\t\t\t\t\tsocket.setKeepAlive(true, 0);\n\t\t\t\t\t\t\t\tsocket.removeAllListeners('timeout');\n\t\t\t\t\t\t\t\tsocket.write(verification, 'ascii');\n\n\n\t\t\t\t\t\t\t\t_connect_socket.call(this, socket, protocol);\n\n\t\t\t\t\t\t\t} else {\n\n\t\t\t\t\t\t\t\tif (lychee.debug === true) {\n\t\t\t\t\t\t\t\t\tconsole.warn('lychee.net.socket.WS: BAD HANDSHAKE to ' + host + ':' + port);\n\t\t\t\t\t\t\t\t}\n\n\n\t\t\t\t\t\t\t\tsocket.write('', 'ascii');\n\t\t\t\t\t\t\t\tsocket.end();\n\t\t\t\t\t\t\t\tsocket.destroy();\n\n\t\t\t\t\t\t\t\tthis.trigger('error');\n\t\t\t\t\t\t\t\tthis.disconnect();\n\n\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t}\n\n\t\t\t\t\t});\n\n\t\t\t\t} else {\n\n\t\t\t\t\tlet nonce     = Buffer.alloc(16);\n\t\t\t\t\tlet connector = new _net.Socket({\n\t\t\t\t\t\tfd:       null,\n\t\t\t\t\t\treadable: true,\n\t\t\t\t\t\twritable: true\n\t\t\t\t\t});\n\n\n\t\t\t\t\tconnector.once('connect', _upgrade_client.bind(connector, host, port, nonce));\n\n\t\t\t\t\tconnector.on('upgrade', event => {\n\n\t\t\t\t\t\tlet protocol = new _Protocol({\n\t\t\t\t\t\t\ttype: _Protocol.TYPE.client\n\t\t\t\t\t\t});\n\t\t\t\t\t\tlet socket   = event.socket || null;\n\n\n\t\t\t\t\t\tif (socket !== null) {\n\n\t\t\t\t\t\t\tlet verification = _verify_client(event.headers, nonce);\n\t\t\t\t\t\t\tif (verification !== null) {\n\n\t\t\t\t\t\t\t\tsocket.setTimeout(0);\n\t\t\t\t\t\t\t\tsocket.setNoDelay(true);\n\t\t\t\t\t\t\t\tsocket.setKeepAlive(true, 0);\n\t\t\t\t\t\t\t\tsocket.removeAllListeners('timeout');\n\n\n\t\t\t\t\t\t\t\tlet interval_id = _setInterval(_ => {\n\n\t\t\t\t\t\t\t\t\tif (socket.writable) {\n\n\t\t\t\t\t\t\t\t\t\tlet chunk = protocol.ping();\n\t\t\t\t\t\t\t\t\t\tif (chunk !== null) {\n\t\t\t\t\t\t\t\t\t\t\tsocket.write(chunk);\n\t\t\t\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t\t\t\t} else {\n\n\t\t\t\t\t\t\t\t\t\t_clearInterval(interval_id);\n\t\t\t\t\t\t\t\t\t\tinterval_id = null;\n\n\t\t\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t\t\t}, 60000);\n\n\n\t\t\t\t\t\t\t\t_connect_socket.call(this, socket, protocol);\n\n\t\t\t\t\t\t\t} else {\n\n\t\t\t\t\t\t\t\tif (lychee.debug === true) {\n\t\t\t\t\t\t\t\t\tconsole.warn('lychee.net.socket.WS: BAD HANDSHAKE to ' + host + ':' + port);\n\t\t\t\t\t\t\t\t}\n\n\n\t\t\t\t\t\t\t\tsocket.end();\n\t\t\t\t\t\t\t\tsocket.destroy();\n\n\t\t\t\t\t\t\t\tthis.trigger('error');\n\t\t\t\t\t\t\t\tthis.disconnect();\n\n\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t}\n\n\t\t\t\t\t});\n\n\t\t\t\t\tconnector.once('error', err => {\n\n\t\t\t\t\t\tif (lychee.debug === true) {\n\n\t\t\t\t\t\t\tlet code = err.code || '';\n\t\t\t\t\t\t\tif (/ECONNABORTED|ECONNREFUSED|ECONNRESET/.test(code)) {\n\t\t\t\t\t\t\t\tconsole.warn('lychee.net.socket.WS: BAD CONNECTION to ' + host + ':' + port);\n\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t}\n\n\t\t\t\t\t\tthis.trigger('error');\n\t\t\t\t\t\tthis.disconnect();\n\n\t\t\t\t\t\tconnector.end();\n\t\t\t\t\t\tconnector.destroy();\n\n\t\t\t\t\t});\n\n\t\t\t\t\tconnector.connect({\n\t\t\t\t\t\thost: host,\n\t\t\t\t\t\tport: port\n\t\t\t\t\t});\n\n\t\t\t\t}\n\n\n\t\t\t\treturn true;\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t},\n\n\t\tsend: function(payload, headers, binary) {\n\n\t\t\tpayload = payload instanceof Buffer ? payload : null;\n\t\t\theaders = headers instanceof Object ? headers : null;\n\t\t\tbinary  = binary === true;\n\n\n\t\t\tif (payload !== null) {\n\n\t\t\t\tlet connection = this.__connection;\n\t\t\t\tlet protocol   = this.__protocol;\n\n\t\t\t\tif (connection !== null && protocol !== null) {\n\n\t\t\t\t\tlet chunk = protocol.send(payload, headers, binary);\n\t\t\t\t\tlet enc   = binary === true ? 'binary' : 'utf8';\n\n\t\t\t\t\tif (chunk !== null) {\n\n\t\t\t\t\t\tconnection.write(chunk, enc);\n\n\t\t\t\t\t\treturn true;\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t},\n\n\t\tdisconnect: function() {\n\n\t\t\tlet connection = this.__connection;\n\t\t\tlet protocol   = this.__protocol;\n\n\t\t\tif (connection !== null && protocol !== null) {\n\n\t\t\t\t_disconnect_socket.call(this, connection, protocol);\n\n\n\t\t\t\treturn true;\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t}\n\n\t};\n\n\n\treturn Composite;\n\n}"
					}
				},
				"lychee.crypto.SHA1": {
					"constructor": "lychee.Definition",
					"arguments": [
						{
							"id": "lychee.crypto.SHA1",
							"url": "/libraries/lychee/source/crypto/SHA1.js"
						}
					],
					"blob": {
						"attaches": {},
						"exports": "(lychee, global, attachments) => {\n\n\t/*\n\t * HELPERS\n\t */\n\n\tconst _read_int32BE = function(buffer, offset) {\n\t\treturn (buffer[offset] << 24) | (buffer[offset + 1] << 16) | (buffer[offset + 2] << 8) | (buffer[offset + 3]);\n\t};\n\n\tconst _write_int32BE = function(buffer, value, offset) {\n\n\t\tvalue  = +value;\n\t\toffset = offset | 0;\n\n\n\t\tif (value < 0) {\n\t\t\tvalue = 0xffffffff + value + 1;\n\t\t}\n\n\t\tfor (let b = 0, bl = Math.min(buffer.length - offset, 4); b < bl; b++) {\n\t\t\tbuffer[offset + b] = (value >>> (3 - b) * 8) & 0xff;\n\t\t}\n\n\n\t\treturn offset + 4;\n\n\t};\n\n\tconst _write_zero = function(buffer, start, end) {\n\n\t\tstart = typeof start === 'number' ? (start | 0) : 0;\n\t\tend   = typeof end === 'number'   ? (end   | 0) : buffer.length;\n\n\n\t\tif (start === end) return;\n\n\n\t\tend = Math.min(end, buffer.length);\n\n\n\t\tlet diff = end - start;\n\t\tfor (let b = 0; b < diff; b++) {\n\t\t\tbuffer[b + start] = 0;\n\t\t}\n\n\t};\n\n\tconst _calculate_w = function(w, i) {\n\t\treturn _rotate(w[i - 3] ^ w[i - 8] ^ w[i - 14] ^ w[i - 16], 1);\n\t};\n\n\tconst _rotate = function(number, count) {\n\t\treturn (number << count) | (number >>> (32 - count));\n\t};\n\n\tconst _update_chunk = function(buffer) {\n\n\t\tlet a = this.__a;\n\t\tlet b = this.__b;\n\t\tlet c = this.__c;\n\t\tlet d = this.__d;\n\t\tlet e = this.__e;\n\t\tlet w = this.__w;\n\n\n\t\tlet j = 0;\n\t\tlet tmp1, tmp2;\n\n\t\twhile (j < 16) {\n\n\t\t\ttmp1 = _read_int32BE(buffer, j * 4);\n\t\t\ttmp2 = _rotate(a, 5) + ((b & c) | ((~b) & d)) + e + tmp1 + 1518500249;\n\t\t\tw[j] = tmp1;\n\n\t\t\te = d;\n\t\t\td = c;\n\t\t\tc = _rotate(b, 30);\n\t\t\tb = a;\n\t\t\ta = tmp2;\n\t\t\tj++;\n\n\t\t}\n\n\t\twhile (j < 20) {\n\n\t\t\ttmp1 = _calculate_w(w, j);\n\t\t\ttmp2 = _rotate(a, 5) + ((b & c) | ((~b) & d)) + e + tmp1 + 1518500249;\n\t\t\tw[j] = tmp1;\n\n\t\t\te = d;\n\t\t\td = c;\n\t\t\tc = _rotate(b, 30);\n\t\t\tb = a;\n\t\t\ta = tmp2;\n\t\t\tj++;\n\n\t\t}\n\n\t\twhile (j < 40) {\n\n\t\t\ttmp1 = _calculate_w(w, j);\n\t\t\ttmp2 = _rotate(a, 5) + (b ^ c ^ d) + e + tmp1 + 1859775393;\n\t\t\tw[j] = tmp1;\n\n\t\t\te = d;\n\t\t\td = c;\n\t\t\tc = _rotate(b, 30);\n\t\t\tb = a;\n\t\t\ta = tmp2;\n\t\t\tj++;\n\n\t\t}\n\n\t\twhile (j < 60) {\n\n\t\t\ttmp1 = _calculate_w(w, j);\n\t\t\ttmp2 = _rotate(a, 5) + ((b & c) | (b & d) | (c & d)) + e + tmp1 - 1894007588;\n\t\t\tw[j] = tmp1;\n\n\t\t\te = d;\n\t\t\td = c;\n\t\t\tc = _rotate(b, 30);\n\t\t\tb = a;\n\t\t\ta = tmp2;\n\t\t\tj++;\n\n\t\t}\n\n\t\twhile (j < 80) {\n\n\t\t\ttmp1 = _calculate_w(w, j);\n\t\t\ttmp2 = _rotate(a, 5) + (b ^ c ^ d) + e + tmp1 - 899497514;\n\t\t\tw[j] = tmp1;\n\n\t\t\te = d;\n\t\t\td = c;\n\t\t\tc = _rotate(b, 30);\n\t\t\tb = a;\n\t\t\ta = tmp2;\n\t\t\tj++;\n\n\t\t}\n\n\n\t\tthis.__a = (a + this.__a) | 0;\n\t\tthis.__b = (b + this.__b) | 0;\n\t\tthis.__c = (c + this.__c) | 0;\n\t\tthis.__d = (d + this.__d) | 0;\n\t\tthis.__e = (e + this.__e) | 0;\n\n\t};\n\n\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tconst Composite = function() {\n\n\t\tthis.__a = 0x67452301 | 0;\n\t\tthis.__b = 0xefcdab89 | 0;\n\t\tthis.__c = 0x98badcfe | 0;\n\t\tthis.__d = 0x10325476 | 0;\n\t\tthis.__e = 0xc3d2e1f0 | 0;\n\t\tthis.__w = new Array(80);\n\n\t\tthis.__buffer  = Buffer.alloc(64);\n\t\tthis.__length  = 0;\n\t\tthis.__pointer = 0;\n\n\t};\n\n\n\tComposite.prototype = {\n\n\t\t/*\n\t\t * ENTITY API\n\t\t */\n\n\t\t// deserialize: function(blob) {},\n\n\t\tserialize: function() {\n\n\t\t\treturn {\n\t\t\t\t'constructor': 'lychee.crypto.SHA1',\n\t\t\t\t'arguments':   []\n\t\t\t};\n\n\t\t},\n\n\n\n\t\t/*\n\t\t * CRYPTO API\n\t\t */\n\n\t\tupdate: function(data) {\n\n\t\t\tdata = data instanceof Buffer ? data : Buffer.from(data, 'utf8');\n\n\n\t\t\tlet buffer  = this.__buffer;\n\t\t\tlet length  = this.__length + data.length;\n\t\t\tlet pointer = this.__pointer;\n\n\n\t\t\tlet p = 0;\n\n\t\t\twhile (pointer < length) {\n\n\t\t\t\tlet size = (Math.min(data.length, p + 64 - (pointer % 64)) - p);\n\n\t\t\t\tfor (let s = 0; s < size; s++) {\n\t\t\t\t\tbuffer[(pointer % 64) + s] = data[s + p];\n\t\t\t\t}\n\n\t\t\t\tpointer += size;\n\t\t\t\tp       += size;\n\n\t\t\t\tif (pointer % 64 === 0) {\n\t\t\t\t\t_update_chunk.call(this, buffer);\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\tthis.__length  = length;\n\t\t\tthis.__pointer = p;\n\n\t\t},\n\n\t\tdigest: function() {\n\n\t\t\tlet buffer = this.__buffer;\n\t\t\tlet length = this.__length;\n\n\n\t\t\tbuffer[length % 64] = 0x80;\n\t\t\t_write_zero(buffer, length % 64 + 1);\n\t\t\t// buffer.fill(0, length % 64 + 1);\n\n\n\t\t\tif ((length * 8) % (64 * 8) >= (56 * 8)) {\n\t\t\t\t_update_chunk.call(this, buffer);\n\t\t\t\t_write_zero(buffer);\n\t\t\t\t// buffer.fill(0);\n\t\t\t}\n\n\n\t\t\t_write_int32BE(buffer, length * 8, 64 - 4);\n\t\t\t_update_chunk.call(this, buffer);\n\n\n\t\t\tlet hash = Buffer.alloc(20);\n\n\t\t\t_write_int32BE(hash, this.__a | 0,  0);\n\t\t\t_write_int32BE(hash, this.__b | 0,  4);\n\t\t\t_write_int32BE(hash, this.__c | 0,  8);\n\t\t\t_write_int32BE(hash, this.__d | 0, 12);\n\t\t\t_write_int32BE(hash, this.__e | 0, 16);\n\n\t\t\treturn hash;\n\n\t\t}\n\n\t};\n\n\n\treturn Composite;\n\n}"
					}
				},
				"lychee.net.protocol.HTTP": {
					"constructor": "lychee.Definition",
					"arguments": [
						{
							"id": "lychee.net.protocol.HTTP",
							"url": "/libraries/lychee/source/net/protocol/HTTP.js"
						}
					],
					"blob": {
						"attaches": {},
						"exports": "(lychee, global, attachments) => {\n\n\t/*\n\t * HELPERS\n\t */\n\n\tconst _uppercase = function(str) {\n\n\t\tlet tmp = str.split('-');\n\n\t\tfor (let t = 0, tl = tmp.length; t < tl; t++) {\n\t\t\tlet ch = tmp[t];\n\t\t\ttmp[t] = ch.charAt(0).toUpperCase() + ch.substr(1);\n\t\t}\n\n\t\treturn tmp.join('-');\n\n\t};\n\n\tconst _encode_buffer = function(payload, headers, binary) {\n\n\t\tlet type           = this.type;\n\t\tlet buffer         = null;\n\n\t\tlet headers_data   = null;\n\t\tlet headers_length = 0;\n\t\tlet payload_data   = payload;\n\t\tlet payload_length = payload.length;\n\n\n\t\tif (type === Composite.TYPE.client) {\n\n\t\t\tlet url            = headers['url']             || null;\n\t\t\tlet method         = headers['method']          || null;\n\t\t\tlet service_id     = headers['@service-id']     || null;\n\t\t\tlet service_event  = headers['@service-event']  || null;\n\t\t\tlet service_method = headers['@service-method'] || null;\n\n\n\t\t\tif (service_id !== null) {\n\n\t\t\t\tif (service_method !== null) {\n\n\t\t\t\t\tmethod = 'GET';\n\t\t\t\t\turl    = '/api/' + service_id + '/' + service_method;\n\n\t\t\t\t} else if (service_event !== null) {\n\n\t\t\t\t\tmethod = 'POST';\n\t\t\t\t\turl    = '/api/' + service_id + '/' + service_event;\n\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\tif (url !== null && method !== null) {\n\t\t\t\theaders_data = method + ' ' + url + ' HTTP/1.1\\r\\n';\n\t\t\t} else {\n\t\t\t\theaders_data = 'GET * HTTP/1.1\\r\\n';\n\t\t\t}\n\n\n\t\t\theaders_data += 'Connection: keep-alive\\r\\n';\n\t\t\theaders_data += 'Content-Length: ' + payload_length + '\\r\\n';\n\n\t\t\tfor (let key in headers) {\n\n\t\t\t\tif (key.charAt(0) === '@') {\n\t\t\t\t\theaders_data += '' + _uppercase('x-' + key.substr(1)) + ': ' + headers[key] + '\\r\\n';\n\t\t\t\t} else if (/url|method/g.test(key) === false) {\n\t\t\t\t\theaders_data += '' + _uppercase(key) + ': ' + headers[key] + '\\r\\n';\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t\theaders_data  += '\\r\\n';\n\t\t\theaders_length = headers_data.length;\n\n\t\t} else {\n\n\t\t\tlet status  = headers['status'] || Composite.STATUS.normal_okay;\n\t\t\tlet exposed = [ 'Content-Type' ];\n\n\n\t\t\theaders_data  = 'HTTP/1.1 ' + status + '\\r\\n';\n\t\t\theaders_data += 'Connection: keep-alive\\r\\n';\n\t\t\theaders_data += 'Content-Length: ' + payload_length + '\\r\\n';\n\n\t\t\tfor (let key in headers) {\n\n\t\t\t\tif (key.charAt(0) === '@') {\n\t\t\t\t\theaders_data += '' + _uppercase('x-' + key.substr(1)) + ': ' + headers[key] + '\\r\\n';\n\t\t\t\t\texposed.push(_uppercase('x-' + key.substr(1)));\n\t\t\t\t} else if (/status/g.test(key) === false) {\n\t\t\t\t\theaders_data += '' + _uppercase(key) + ': ' + headers[key] + '\\r\\n';\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t\theaders_data  += 'Access-Control-Expose-Headers: ' + exposed.join(', ') + '\\r\\n';\n\t\t\theaders_data  += '\\r\\n';\n\t\t\theaders_length = headers_data.length;\n\n\t\t}\n\n\n\t\tlet content_type = headers['content-type'] || 'text/plain';\n\t\tif (/text\\//g.test(content_type) === true) {\n\n\t\t\tbuffer = Buffer.alloc(headers_length + payload_length + 4);\n\t\t\tbuffer.write(headers_data, 0, headers_length, 'utf8');\n\t\t\tpayload_data.copy(buffer, headers_length, 0, payload_length);\n\t\t\tbuffer.write('\\r\\n\\r\\n', headers_length + payload_length, 4, 'utf8');\n\n\t\t} else {\n\n\t\t\tbuffer = Buffer.alloc(headers_length + payload_length + 4);\n\t\t\tbuffer.write(headers_data, 0, headers_length, 'utf8');\n\t\t\tpayload_data.copy(buffer, headers_length, 0, payload_length);\n\t\t\tbuffer.write('\\r\\n\\r\\n', headers_length + payload_length, 4, 'utf8');\n\n\t\t}\n\n\n\t\treturn buffer;\n\n\t};\n\n\tconst _decode_buffer = function(buffer) {\n\n\t\tbuffer = buffer.toString('utf8');\n\n\n\t\tlet chunk = {\n\t\t\tbytes:   -1,\n\t\t\theaders: {},\n\t\t\tpayload: null\n\t\t};\n\n\n\t\tif (buffer.indexOf('\\r\\n\\r\\n') === -1) {\n\t\t\treturn chunk;\n\t\t}\n\n\n\t\tlet headers_length = buffer.indexOf('\\r\\n\\r\\n') + 4;\n\t\tlet headers_data   = buffer.substr(0, headers_length);\n\t\tlet payload_data   = buffer.substr(headers_length);\n\t\tlet payload_length = payload_data.length;\n\n\n\t\tlet i_end = payload_data.indexOf('\\r\\n\\r\\n');\n\t\tif (i_end !== -1) {\n\t\t\tpayload_data   = payload_data.substr(0, i_end);\n\t\t\tpayload_length = payload_data.length + 4;\n\t\t}\n\n\n\t\theaders_data.split('\\r\\n').forEach(line => {\n\n\t\t\tlet tmp = line.trim();\n\t\t\tif (/^(OPTIONS|GET|POST)/g.test(tmp) === true) {\n\n\t\t\t\tlet tmp2   = tmp.split(' ');\n\t\t\t\tlet method = (tmp2[0] || '').trim() || null;\n\t\t\t\tlet url    = (tmp2[1] || '').trim() || null;\n\n\t\t\t\tif (method !== null && url !== null) {\n\n\t\t\t\t\tchunk.headers['method'] = method;\n\t\t\t\t\tchunk.headers['url']    = url;\n\n\t\t\t\t}\n\n\n\t\t\t\tif (url.startsWith('/api/')) {\n\n\t\t\t\t\tlet tmp3 = [];\n\n\t\t\t\t\tif (url.indexOf('?') !== -1) {\n\t\t\t\t\t\ttmp3 = url.split('?')[0].split('/');\n\t\t\t\t\t} else {\n\t\t\t\t\t\ttmp3 = url.split('/');\n\t\t\t\t\t}\n\n\t\t\t\t\tif (tmp3.length === 4) {\n\n\t\t\t\t\t\tif (method === 'GET') {\n\n\t\t\t\t\t\t\tchunk.headers['@service-id']     = tmp3[2];\n\t\t\t\t\t\t\tchunk.headers['@service-method'] = tmp3[3];\n\n\t\t\t\t\t\t} else if (method === 'POST') {\n\n\t\t\t\t\t\t\tchunk.headers['@service-id']    = tmp3[2];\n\t\t\t\t\t\t\tchunk.headers['@service-event'] = tmp3[3];\n\n\t\t\t\t\t\t}\n\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t} else if (tmp.startsWith('HTTP')) {\n\n\t\t\t\tif (/[0-9]{3}/g.test(tmp) === true) {\n\t\t\t\t\tchunk.headers['status'] = tmp.split(' ')[1];\n\t\t\t\t}\n\n\t\t\t} else if (/^[0-9]{3}/g.test(tmp) === true) {\n\n\t\t\t\tchunk.headers['status'] = tmp.split(' ')[0];\n\n\t\t\t} else if (/:/g.test(tmp)) {\n\n\t\t\t\tlet i_tmp = tmp.indexOf(':');\n\t\t\t\tlet key   = tmp.substr(0, i_tmp).trim().toLowerCase();\n\t\t\t\tlet val   = tmp.substr(i_tmp + 1).trim().toLowerCase();\n\n\t\t\t\tif (key === 'host') {\n\n\t\t\t\t\tif (/^\\[([a-f0-9:]+)\\](.*)$/g.test(val) === true) {\n\t\t\t\t\t\tchunk.headers[key] = val.split(/^\\[([a-f0-9:]+)\\](.*)$/g)[1];\n\t\t\t\t\t} else {\n\t\t\t\t\t\tchunk.headers[key] = val;\n\t\t\t\t\t}\n\n\t\t\t\t} else if (/origin|connection|upgrade|content-type|content-length|accept-encoding|accept-language|e-tag/g.test(key) === true) {\n\n\t\t\t\t\tchunk.headers[key] = val;\n\n\t\t\t\t} else if (/expires|if-modified-since|last-modified/g.test(key) === true) {\n\n\t\t\t\t\tval = tmp.split(':').slice(1).join(':').trim();\n\t\t\t\t\tchunk.headers[key] = val;\n\n\t\t\t\t} else if (/access-control/g.test(key) === true) {\n\n\t\t\t\t\tchunk.headers[key] = val;\n\n\t\t\t\t} else if (key.startsWith('x-')) {\n\n\t\t\t\t\tchunk.headers['@' + key.substr(2)] = val;\n\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t});\n\n\n\t\tlet check = chunk.headers['method'] || null;\n\t\tif (check === 'GET') {\n\n\t\t\tlet tmp4 = chunk.headers['url'] || '';\n\t\t\tif (tmp4.indexOf('?') !== -1) {\n\n\t\t\t\tlet tmp5 = tmp4.split('?')[1].split('&');\n\t\t\t\tlet tmp6 = {};\n\n\t\t\t\ttmp5.forEach(str => {\n\n\t\t\t\t\tlet key = str.split('=')[0] || '';\n\t\t\t\t\tlet val = str.split('=')[1] || '';\n\n\t\t\t\t\tif (key !== '' && val !== '') {\n\t\t\t\t\t\ttmp6[key] = val;\n\t\t\t\t\t}\n\n\t\t\t\t});\n\n\n\t\t\t\tlet tmp7 = JSON.stringify(tmp6);\n\n\t\t\t\tchunk.bytes   = headers_length + payload_length;\n\t\t\t\tchunk.payload = Buffer.alloc(tmp7.length, tmp7, 'utf8');\n\n\t\t\t} else {\n\n\t\t\t\tchunk.bytes   = headers_length + payload_length;\n\t\t\t\tchunk.payload = Buffer.alloc(0, '', 'utf8');\n\n\t\t\t}\n\n\t\t} else if (check === 'OPTIONS') {\n\n\t\t\tchunk.bytes   = headers_length + payload_length;\n\t\t\tchunk.payload = Buffer.alloc(0, '', 'utf8');\n\n\t\t} else if (check === 'POST') {\n\n\t\t\tchunk.bytes   = headers_length + payload_length;\n\t\t\tchunk.payload = Buffer.alloc(payload_data.length, payload_data, 'utf8');\n\n\t\t} else {\n\n\t\t\tlet status = chunk.headers['status'] || null;\n\t\t\tif (status !== null) {\n\n\t\t\t\tchunk.bytes   = headers_length + payload_length;\n\t\t\t\tchunk.payload = Buffer.alloc(payload_data.length, payload_data, 'utf8');\n\n\t\t\t} else {\n\n\t\t\t\tchunk.bytes   = buffer.length;\n\t\t\t\tchunk.headers = null;\n\t\t\t\tchunk.payload = null;\n\n\t\t\t}\n\n\t\t}\n\n\n\t\treturn chunk;\n\n\t};\n\n\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tconst Composite = function(data) {\n\n\t\tlet states = Object.assign({}, data);\n\n\n\t\tthis.type = lychee.enumof(Composite.TYPE, states.type) ? states.type : null;\n\n\t\tthis.__buffer   = Buffer.alloc(0);\n\t\tthis.__isClosed = false;\n\n\n\t\tif (lychee.debug === true) {\n\n\t\t\tif (this.type === null) {\n\t\t\t\tconsole.error('lychee.net.protocol.HTTP: Invalid (lychee.net.protocol.HTTP.TYPE) type.');\n\t\t\t}\n\n\t\t}\n\n\t\tstates = null;\n\n\t};\n\n\n\t// Composite.FRAMESIZE = 32768; // 32kB\n\tComposite.FRAMESIZE = 0x800000; // 8MiB\n\n\n\tComposite.STATUS = {\n\n\t\t// RFC7231\n\t\tnormal_continue: '100 Continue',\n\t\tnormal_okay:     '200 OK',\n\t\tprotocol_error:  '400 Bad Request',\n\t\tmessage_too_big: '413 Payload Too Large',\n\t\tnot_found:       '404 Not Found',\n\t\tnot_allowed:     '405 Method Not Allowed',\n\t\tnot_implemented: '501 Not Implemented',\n\t\tbad_gateway:     '502 Bad Gateway',\n\n\t\t// RFC7233\n\t\tnormal_closure:  '204 No Content',\n\t\tnormal_partial:  '206 Partial Content'\n\n\t};\n\n\n\tComposite.TYPE = {\n\t\t// 'default': 0, (deactivated)\n\t\t'client': 1,\n\t\t'remote': 2\n\t};\n\n\n\tComposite.prototype = {\n\n\t\t/*\n\t\t * ENTITY API\n\t\t */\n\n\t\t// deserialize: function(blob) {},\n\n\t\tserialize: function() {\n\n\t\t\tlet states = {};\n\n\n\t\t\tif (this.type !== null) states.type = this.type;\n\n\n\t\t\treturn {\n\t\t\t\t'constructor': 'lychee.net.protocol.HTTP',\n\t\t\t\t'arguments':   [ states ],\n\t\t\t\t'blob':        null\n\t\t\t};\n\n\t\t},\n\n\n\n\t\t/*\n\t\t * PROTOCOL API\n\t\t */\n\n\t\tsend: function(payload, headers, binary) {\n\n\t\t\tpayload = payload instanceof Buffer ? payload : null;\n\t\t\theaders = headers instanceof Object ? headers : null;\n\t\t\tbinary  = binary === true;\n\n\n\t\t\tif (payload !== null) {\n\n\t\t\t\tif (this.__isClosed === false) {\n\t\t\t\t\treturn _encode_buffer.call(this, payload, headers, binary);\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\treturn null;\n\n\t\t},\n\n\t\treceive: function(blob) {\n\n\t\t\tblob = blob instanceof Buffer ? blob : null;\n\n\n\t\t\tlet chunks = [];\n\n\n\t\t\tif (blob !== null) {\n\n\t\t\t\tif (blob.length > Composite.FRAMESIZE) {\n\n\t\t\t\t\tchunks.push(this.close(Composite.STATUS.message_too_big));\n\n\t\t\t\t} else if (this.__isClosed === false) {\n\n\t\t\t\t\tlet buf = this.__buffer;\n\t\t\t\t\tlet tmp = Buffer.alloc(buf.length + blob.length);\n\n\n\t\t\t\t\tbuf.copy(tmp);\n\t\t\t\t\tblob.copy(tmp, buf.length);\n\t\t\t\t\tbuf = tmp;\n\n\n\t\t\t\t\tlet chunk = _decode_buffer.call(this, buf);\n\n\t\t\t\t\twhile (chunk.bytes !== -1) {\n\n\t\t\t\t\t\tif (chunk.payload !== null) {\n\t\t\t\t\t\t\tchunks.push(chunk);\n\t\t\t\t\t\t}\n\n\n\t\t\t\t\t\ttmp = Buffer.alloc(buf.length - chunk.bytes);\n\t\t\t\t\t\tbuf.copy(tmp, 0, chunk.bytes);\n\t\t\t\t\t\tbuf = tmp;\n\n\t\t\t\t\t\tchunk = null;\n\t\t\t\t\t\tchunk = _decode_buffer.call(this, buf);\n\n\t\t\t\t\t}\n\n\n\t\t\t\t\tthis.__buffer = buf;\n\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\treturn chunks;\n\n\t\t},\n\n\t\tclose: function(status) {\n\n\t\t\tstatus = typeof status === 'number' ? status : Composite.STATUS.no_content;\n\n\n\t\t\tif (this.__isClosed === false) {\n\n\t\t\t\t// TODO: Close method should create a close status buffer\n\t\t\t\t// let buffer = Buffer.alloc(4);\n\n\t\t\t\t// buffer[0]  = 128 + 0x08;\n\t\t\t\t// buffer[1]  =   0 + 0x02;\n\n\t\t\t\t// buffer.write(String.fromCharCode((status >> 8) & 0xff) + String.fromCharCode((status >> 0) & 0xff), 2, 'binary');\n\n\t\t\t\t// this.__isClosed = true;\n\n\n\t\t\t\t// return buffer;\n\n\t\t\t}\n\n\n\t\t\treturn null;\n\n\t\t}\n\n\t};\n\n\n\treturn Composite;\n\n}"
					}
				},
				"lychee.net.protocol.WS": {
					"constructor": "lychee.Definition",
					"arguments": [
						{
							"id": "lychee.net.protocol.WS",
							"url": "/libraries/lychee/source/net/protocol/WS.js"
						}
					],
					"blob": {
						"attaches": {},
						"requires": [
							"lychee.codec.JSON"
						],
						"exports": "(lychee, global, attachments) => {\n\n\tconst _JSON = lychee.import('lychee.codec.JSON');\n\n\n\n\t/*\n\t * HELPERS\n\t */\n\n\t/*\n\t * WebSocket Framing Protocol\n\t *\n\t * |0 1 2 3 4 5 6 7|0 1 2 3 4 5 6 7|0 1 2 3 4 5 6 7|0 1 2 3 4 5 6 7|\n\t * +-+-+-+-+-------+-+-------------+-------------------------------+\n\t * |F|R|R|R| opcode|M| Payload len |    Extended payload length    |\n\t * |I|S|S|S|  (4)  |A|     (7)     |             (16/64)           |\n\t * |N|V|V|V|       |S|             |   (if payload len==126/127)   |\n\t * | |1|2|3|       |K|             |                               |\n\t * +-+-+-+-+-------+-+-------------+ - - - - - - - - - - - - - - - +\n\t * |     Extended payload length continued, if payload len == 127  |\n\t * + - - - - - - - - - - - - - - - +-------------------------------+\n\t * |                               |Masking-key, if MASK set to 1  |\n\t * +-------------------------------+-------------------------------+\n\t * | Masking-key (continued)       |          Payload Data         |\n\t * +-------------------------------- - - - - - - - - - - - - - - - +\n\t * :                     Payload Data continued ...                :\n\t * + - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - +\n\t * |                     Payload Data continued ...                |\n\t * +---------------------------------------------------------------+\n\t *\n\t */\n\n\tconst _on_ping_frame = function() {\n\n\t\tlet type = this.type;\n\t\tif (type === Composite.TYPE.remote) {\n\n\t\t\tlet buffer = Buffer.alloc(2);\n\n\t\t\t// FIN, Pong\n\t\t\t// Unmasked, 0 payload\n\n\t\t\tbuffer[0] = 128 + 0x0a;\n\t\t\tbuffer[1] =   0 + 0x00;\n\n\n\t\t\treturn buffer;\n\n\t\t}\n\n\n\t\treturn null;\n\n\t};\n\n\tconst _on_pong_frame = function() {\n\n\t\tlet type = this.type;\n\t\tif (type === Composite.TYPE.client) {\n\n\t\t\tlet buffer = Buffer.alloc(6);\n\n\t\t\t// FIN, Ping\n\t\t\t// Masked, 0 payload\n\n\t\t\tbuffer[0] = 128 + 0x09;\n\t\t\tbuffer[1] = 128 + 0x00;\n\n\t\t\tbuffer[2] = (Math.random() * 0xff) | 0;\n\t\t\tbuffer[3] = (Math.random() * 0xff) | 0;\n\t\t\tbuffer[4] = (Math.random() * 0xff) | 0;\n\t\t\tbuffer[5] = (Math.random() * 0xff) | 0;\n\n\n\t\t\treturn buffer;\n\n\t\t}\n\n\n\t\treturn null;\n\n\t};\n\n\tconst _encode_buffer = function(payload, headers, binary) {\n\n\t\tlet buffer         = null;\n\t\tlet data           = _JSON.encode({\n\t\t\theaders: headers,\n\t\t\tpayload: payload\n\t\t});\n\t\tlet mask           = false;\n\t\tlet mask_data      = null;\n\t\tlet payload_data   = null;\n\t\tlet payload_length = data.length;\n\t\tlet type           = this.type;\n\n\n\t\tif (type === Composite.TYPE.client) {\n\n\t\t\tmask      = true;\n\t\t\tmask_data = Buffer.alloc(4);\n\n\t\t\tmask_data[0] = (Math.random() * 0xff) | 0;\n\t\t\tmask_data[1] = (Math.random() * 0xff) | 0;\n\t\t\tmask_data[2] = (Math.random() * 0xff) | 0;\n\t\t\tmask_data[3] = (Math.random() * 0xff) | 0;\n\n\t\t\tpayload_data = data.map((value, index) => value ^ mask_data[index % 4]);\n\n\t\t} else {\n\n\t\t\tmask         = false;\n\t\t\tmask_data    = Buffer.alloc(4);\n\t\t\tpayload_data = data.map(value => value);\n\n\t\t}\n\n\n\t\t// 64 Bit Extended Payload Length\n\t\tif (payload_length > 0xffff) {\n\n\t\t\tlet lo = payload_length | 0;\n\t\t\tlet hi = (payload_length - lo) / 4294967296;\n\n\t\t\tbuffer = Buffer.alloc((mask === true ? 14 : 10) + payload_length);\n\n\t\t\tbuffer[0] = 128 + (binary === true ? 0x02 : 0x01);\n\t\t\tbuffer[1] = (mask === true ? 128 : 0) + 127;\n\n\t\t\tbuffer[2] = (hi >> 24) & 0xff;\n\t\t\tbuffer[3] = (hi >> 16) & 0xff;\n\t\t\tbuffer[4] = (hi >>  8) & 0xff;\n\t\t\tbuffer[5] = (hi >>  0) & 0xff;\n\n\t\t\tbuffer[6] = (lo >> 24) & 0xff;\n\t\t\tbuffer[7] = (lo >> 16) & 0xff;\n\t\t\tbuffer[8] = (lo >>  8) & 0xff;\n\t\t\tbuffer[9] = (lo >>  0) & 0xff;\n\n\n\t\t\tif (mask === true) {\n\n\t\t\t\tmask_data.copy(buffer, 10);\n\t\t\t\tpayload_data.copy(buffer, 14);\n\n\t\t\t} else {\n\n\t\t\t\tpayload_data.copy(buffer, 10);\n\n\t\t\t}\n\n\n\t\t// 16 Bit Extended Payload Length\n\t\t} else if (payload_length > 125) {\n\n\t\t\tbuffer = Buffer.alloc((mask === true ? 8 : 4) + payload_length);\n\n\t\t\tbuffer[0] = 128 + (binary === true ? 0x02 : 0x01);\n\t\t\tbuffer[1] = (mask === true ? 128 : 0) + 126;\n\n\t\t\tbuffer[2] = (payload_length >> 8) & 0xff;\n\t\t\tbuffer[3] = (payload_length >> 0) & 0xff;\n\n\n\t\t\tif (mask === true) {\n\n\t\t\t\tmask_data.copy(buffer, 4);\n\t\t\t\tpayload_data.copy(buffer, 8);\n\n\t\t\t} else {\n\n\t\t\t\tpayload_data.copy(buffer, 4);\n\n\t\t\t}\n\n\n\t\t// 7 Bit Payload Length\n\t\t} else {\n\n\t\t\tbuffer = Buffer.alloc((mask === true ? 6 : 2) + payload_length);\n\n\t\t\tbuffer[0] = 128 + (binary === true ? 0x02 : 0x01);\n\t\t\tbuffer[1] = (mask === true ? 128 : 0) + payload_length;\n\n\n\t\t\tif (mask === true) {\n\n\t\t\t\tmask_data.copy(buffer, 2);\n\t\t\t\tpayload_data.copy(buffer, 6);\n\n\t\t\t} else {\n\n\t\t\t\tpayload_data.copy(buffer, 2);\n\n\t\t\t}\n\n\t\t}\n\n\n\t\treturn buffer;\n\n\t};\n\n\tconst _decode_buffer = function(buffer) {\n\n\t\tlet fragment = this.__fragment;\n\t\tlet chunk    = {\n\t\t\tbytes:   -1,\n\t\t\theaders: {},\n\t\t\tpayload: null\n\t\t};\n\n\n\t\tif (buffer.length <= 2) {\n\t\t\treturn chunk;\n\t\t}\n\n\n\t\tlet fin            = (buffer[0] & 128) === 128;\n\t\t// let rsv1        = (buffer[0] & 64) === 64;\n\t\t// let rsv2        = (buffer[0] & 32) === 32;\n\t\t// let rsv3        = (buffer[0] & 16) === 16;\n\t\tlet operator       = buffer[0] & 15;\n\t\tlet mask           = (buffer[1] & 128) === 128;\n\t\tlet mask_data      = Buffer.alloc(4);\n\t\tlet payload_length = buffer[1] & 127;\n\t\tlet payload_data   = null;\n\n\t\tif (payload_length <= 125) {\n\n\t\t\tif (mask === true) {\n\t\t\t\tmask_data    = buffer.slice(2, 6);\n\t\t\t\tpayload_data = buffer.slice(6, 6 + payload_length);\n\t\t\t\tchunk.bytes  = 6 + payload_length;\n\t\t\t} else {\n\t\t\t\tmask_data    = null;\n\t\t\t\tpayload_data = buffer.slice(2, 2 + payload_length);\n\t\t\t\tchunk.bytes  = 2 + payload_length;\n\t\t\t}\n\n\t\t} else if (payload_length === 126) {\n\n\t\t\tpayload_length = (buffer[2] << 8) + buffer[3];\n\n\n\t\t\tif (payload_length > buffer.length) {\n\t\t\t\treturn chunk;\n\t\t\t}\n\n\n\t\t\tif (mask === true) {\n\t\t\t\tmask_data    = buffer.slice(4, 8);\n\t\t\t\tpayload_data = buffer.slice(8, 8 + payload_length);\n\t\t\t\tchunk.bytes  = 8 + payload_length;\n\t\t\t} else {\n\t\t\t\tmask_data    = null;\n\t\t\t\tpayload_data = buffer.slice(4, 4 + payload_length);\n\t\t\t\tchunk.bytes  = 4 + payload_length;\n\t\t\t}\n\n\t\t} else if (payload_length === 127) {\n\n\t\t\tlet hi = (buffer[2] * 0x1000000) + ((buffer[3] << 16) | (buffer[4] << 8) | buffer[5]);\n\t\t\tlet lo = (buffer[6] * 0x1000000) + ((buffer[7] << 16) | (buffer[8] << 8) | buffer[9]);\n\n\n\t\t\tpayload_length = (hi * 4294967296) + lo;\n\n\n\t\t\tif (payload_length > buffer.length) {\n\t\t\t\treturn chunk;\n\t\t\t}\n\n\n\t\t\tif (mask === true) {\n\t\t\t\tmask_data    = buffer.slice(10, 14);\n\t\t\t\tpayload_data = buffer.slice(14, 14 + payload_length);\n\t\t\t\tchunk.bytes  = 14 + payload_length;\n\t\t\t} else {\n\t\t\t\tmask_data    = null;\n\t\t\t\tpayload_data = buffer.slice(10, 10 + payload_length);\n\t\t\t\tchunk.bytes  = 10 + payload_length;\n\t\t\t}\n\n\t\t}\n\n\n\t\tif (mask_data !== null) {\n\t\t\tpayload_data = payload_data.map((value, index) => value ^ mask_data[index % 4]);\n\t\t}\n\n\n\t\t// 0: Continuation Frame (Fragmentation)\n\t\tif (operator === 0x00) {\n\n\t\t\tif (payload_data !== null) {\n\n\t\t\t\tlet payload = Buffer.alloc(fragment.payload.length + payload_length);\n\n\t\t\t\tfragment.payload.copy(payload, 0);\n\t\t\t\tpayload_data.copy(payload, fragment.payload.length);\n\n\t\t\t\tfragment.payload = payload;\n\n\t\t\t}\n\n\n\t\t\tif (fin === true) {\n\n\t\t\t\tlet tmp0 = _JSON.decode(fragment.payload);\n\t\t\t\tif (tmp0 !== null) {\n\t\t\t\t\tchunk.headers = tmp0.headers || {};\n\t\t\t\t\tchunk.payload = tmp0.payload || null;\n\t\t\t\t}\n\n\t\t\t\tfragment.operator = 0x00;\n\t\t\t\tfragment.payload  = Buffer.alloc(0);\n\n\t\t\t}\n\n\n\t\t// 1: Text Frame\n\t\t} else if (operator === 0x01) {\n\n\t\t\tif (fin === true) {\n\n\t\t\t\tlet tmp1 = _JSON.decode(payload_data);\n\t\t\t\tif (tmp1 !== null) {\n\t\t\t\t\tchunk.headers = tmp1.headers || {};\n\t\t\t\t\tchunk.payload = tmp1.payload || null;\n\t\t\t\t}\n\n\t\t\t} else if (payload_data !== null) {\n\n\t\t\t\tlet payload = Buffer.alloc(fragment.payload.length + payload_length);\n\n\t\t\t\tfragment.payload.copy(payload, 0);\n\t\t\t\tpayload_data.copy(payload, fragment.payload.length);\n\n\t\t\t\tfragment.payload  = payload;\n\t\t\t\tfragment.operator = operator;\n\n\t\t\t}\n\n\n\t\t// 2: Binary Frame\n\t\t} else if (operator === 0x02) {\n\n\t\t\tif (fin === true) {\n\n\t\t\t\tlet tmp2 = _JSON.decode(payload_data);\n\t\t\t\tif (tmp2 !== null) {\n\t\t\t\t\tchunk.headers = tmp2.headers || {};\n\t\t\t\t\tchunk.payload = tmp2.payload || null;\n\t\t\t\t}\n\n\t\t\t} else if (payload_data !== null) {\n\n\t\t\t\tlet payload = Buffer.alloc(fragment.payload.length + payload_length);\n\n\t\t\t\tfragment.payload.copy(payload, 0);\n\t\t\t\tpayload_data.copy(payload, fragment.payload.length);\n\n\t\t\t\tfragment.payload  = payload;\n\t\t\t\tfragment.operator = operator;\n\n\t\t\t}\n\n\n\t\t// 8: Connection Close\n\t\t} else if (operator === 0x08) {\n\n\t\t\tchunk.payload = this.close(Composite.STATUS.normal_closure);\n\n\n\t\t// 9: Ping Frame\n\t\t} else if (operator === 0x09) {\n\n\t\t\tchunk.payload = _on_ping_frame.call(this);\n\n\n\t\t// 10: Pong Frame\n\t\t} else if (operator === 0x0a) {\n\n\t\t\tchunk.payload = _on_pong_frame.call(this);\n\n\n\t\t// 3-7: Reserved Non-Control Frames, 11-15: Reserved Control Frames\n\t\t} else {\n\n\t\t\tchunk.payload = this.close(Composite.STATUS.protocol_error);\n\n\t\t}\n\n\n\t\treturn chunk;\n\n\t};\n\n\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tconst Composite = function(data) {\n\n\t\tlet states = Object.assign({}, data);\n\n\n\t\tthis.type = lychee.enumof(Composite.TYPE, states.type) ? states.type : null;\n\n\t\tthis.__buffer   = Buffer.alloc(0);\n\t\tthis.__fragment = {\n\t\t\toperator: 0x00,\n\t\t\tpayload:  Buffer.alloc(0)\n\t\t};\n\t\tthis.__isClosed = false;\n\n\n\t\tif (lychee.debug === true) {\n\n\t\t\tif (this.type === null) {\n\t\t\t\tconsole.error('lychee.net.protocol.WS: Invalid (lychee.net.protocol.WS.TYPE) type.');\n\t\t\t}\n\n\t\t}\n\n\t\tstates = null;\n\n\t};\n\n\n\t// Composite.FRAMESIZE = 32768; // 32kB\n\tComposite.FRAMESIZE = 0x800000; // 8MiB\n\n\n\tComposite.STATUS = {\n\n\t\t// IESG_HYBI\n\t\tnormal_closure:  1000,\n\t\tprotocol_error:  1002,\n\t\tmessage_too_big: 1009\n\n\t\t// IESG_HYBI\n\t\t// going_away:         1001,\n\t\t// unsupported_data:   1003,\n\t\t// no_status_received: 1005,\n\t\t// abnormal_closure:   1006,\n\t\t// invalid_payload:    1007,\n\t\t// policy_violation:   1008,\n\t\t// missing_extension:  1010,\n\t\t// internal_error:     1011,\n\n\t\t// IESG_HYBI Current\n\t\t// service_restart:    1012,\n\t\t// service_overload:   1013,\n\n\t\t// IESG_HYBI\n\t\t// tls_handshake:      1015\n\n\t};\n\n\n\tComposite.TYPE = {\n\t\t// 'default': 0, (deactivated)\n\t\t'client': 1,\n\t\t'remote': 2\n\t};\n\n\n\tComposite.prototype = {\n\n\t\t/*\n\t\t * ENTITY API\n\t\t */\n\n\t\t// deserialize: function(blob) {},\n\n\t\tserialize: function() {\n\n\t\t\tlet states = {};\n\n\n\t\t\tif (this.type !== null) states.type = this.type;\n\n\n\t\t\treturn {\n\t\t\t\t'constructor': 'lychee.net.protocol.WS',\n\t\t\t\t'arguments':   [ states ],\n\t\t\t\t'blob':        null\n\t\t\t};\n\n\t\t},\n\n\n\n\t\t/*\n\t\t * PROTOCOL API\n\t\t */\n\n\t\tsend: function(payload, headers, binary) {\n\n\t\t\tpayload = payload instanceof Buffer ? payload : null;\n\t\t\theaders = headers instanceof Object ? headers : null;\n\t\t\tbinary  = binary === true;\n\n\n\t\t\tif (payload !== null) {\n\n\t\t\t\tif (this.__isClosed === false) {\n\t\t\t\t\treturn _encode_buffer.call(this, payload, headers, binary);\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\treturn null;\n\n\t\t},\n\n\t\treceive: function(blob) {\n\n\t\t\tblob = blob instanceof Buffer ? blob : null;\n\n\n\t\t\tlet chunks = [];\n\n\n\t\t\tif (blob !== null) {\n\n\t\t\t\tif (blob.length > Composite.FRAMESIZE) {\n\n\t\t\t\t\tchunks.push({\n\t\t\t\t\t\tpayload: this.close(Composite.STATUS.message_too_big)\n\t\t\t\t\t});\n\n\t\t\t\t} else if (this.__isClosed === false) {\n\n\t\t\t\t\tlet buf = this.__buffer;\n\t\t\t\t\tlet tmp = Buffer.alloc(buf.length + blob.length);\n\n\n\t\t\t\t\tbuf.copy(tmp);\n\t\t\t\t\tblob.copy(tmp, buf.length);\n\t\t\t\t\tbuf = tmp;\n\n\n\t\t\t\t\tlet chunk = _decode_buffer.call(this, buf);\n\n\t\t\t\t\twhile (chunk.bytes !== -1) {\n\n\t\t\t\t\t\tif (chunk.payload !== null) {\n\t\t\t\t\t\t\tchunks.push(chunk);\n\t\t\t\t\t\t}\n\n\n\t\t\t\t\t\tif (buf.length - chunk.bytes > 0) {\n\n\t\t\t\t\t\t\ttmp = Buffer.alloc(buf.length - chunk.bytes);\n\t\t\t\t\t\t\tbuf.copy(tmp, 0, chunk.bytes);\n\t\t\t\t\t\t\tbuf = tmp;\n\n\t\t\t\t\t\t} else {\n\t\t\t\t\t\t\tbuf = Buffer.alloc(0);\n\t\t\t\t\t\t}\n\n\n\t\t\t\t\t\tchunk = null;\n\t\t\t\t\t\tchunk = _decode_buffer.call(this, buf);\n\n\t\t\t\t\t}\n\n\n\t\t\t\t\tthis.__buffer = buf;\n\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\treturn chunks;\n\n\t\t},\n\n\t\tclose: function(status) {\n\n\t\t\tstatus = typeof status === 'number' ? status : Composite.STATUS.normal_closure;\n\n\n\t\t\tif (this.__isClosed === false) {\n\n\t\t\t\tlet buffer = Buffer.alloc(4);\n\n\t\t\t\tbuffer[0]  = 128 + 0x08;\n\t\t\t\tbuffer[1]  =   0 + 0x02;\n\n\t\t\t\tbuffer.write(String.fromCharCode((status >> 8) & 0xff) + String.fromCharCode((status >> 0) & 0xff), 2, 'binary');\n\n\t\t\t\tthis.__isClosed = true;\n\n\n\t\t\t\treturn buffer;\n\n\t\t\t}\n\n\n\t\t\treturn null;\n\n\t\t},\n\n\n\n\t\t/*\n\t\t * CUSTOM API\n\t\t */\n\n\t\tping: function() {\n\n\t\t\tlet buffer = _on_pong_frame.call(this);\n\t\t\tif (buffer !== null) {\n\t\t\t\treturn buffer;\n\t\t\t}\n\n\n\t\t\treturn null;\n\n\t\t}\n\n\t};\n\n\n\treturn Composite;\n\n}"
					}
				}
			},
			"features": {
				"require": "function",
				"setInterval": "function"
			}
		}
	};

	let environment = lychee.deserialize(blob);
	if (environment !== null) {

		if (environment.variant === 'application') {
			lychee.init(environment, {
				profile: {}
			});
		} else if (environment.variant === 'library') {
			environment.init();
		}

	}

	lychee.ENVIRONMENTS['/libraries/harvester/dist'] = environment;

	return environment;

})(typeof lychee !== 'undefined' ? lychee : undefined, typeof global !== 'undefined' ? global : this);
