
lychee.define('Track').tags({
	platform: 'html'
}).supports(function(lychee, global) {

	if (global.Audio) {
		return true;
	}


	return false;

}).exports(function(lychee, global) {

	var _mime = {
		'3gp':  [ 'audio/3gpp' ],
		'aac':  [ 'audio/aac', 'audio/aacp' ],
		'amr':  [ 'audio/amr' ],
		'caf':  [ 'audio/x-caf', 'audio/x-aiff; codecs="IMA-ADPCM, ADPCM"' ],
		'm4a':  [ 'audio/mp4; codecs=mp4a' ],
		'mp3':  [ 'audio/mpeg' ],
		'mp4':  [ 'audio/mp4' ],
		'ogg':  [ 'application/ogg', 'audio/ogg', 'audio/ogg; codecs=theora, vorbis' ],
		'wav':  [ 'audio/wave', 'audio/wav', 'audio/wav; codecs="1"', 'audio/x-wav', 'audio/x-pn-wav' ],
		'webm': [ 'audio/webm', 'audio/webm; codecs=vorbis' ]
	};


	var _audio = null;

	if (global.Audio) {

		// Basic Audio API
		_audio = new Audio();

	}


	var _codecs = {};

	if (_audio !== null) {

		for (var ext in _mime) {

			var data = _mime[ext];
			for (var d = 0, l = data.length; d < l; d++) {
				if (_audio.canPlayType(data[d])) {
					_codecs[ext] = data[d];
				} else if (_codecs[ext] === undefined) {
					_codecs[ext] = false;
				}
			}

		}

	}


	var _supportedFormats = [];
	for (var ext in _codecs) {
		if (_codecs[ext] !== false) {
			_supportedFormats.push(ext);
		}
	}

	if (lychee.debug === true) {
		console.log("lychee.Track: Supported media formats are " + _supportedFormats.join(', '));
	}


	var Class = function(id, settings, isReady) {

		isReady = isReady === true ? true : false;

		if (_audio === null) {
			throw "Your Browser does not support HTML5 Audio.";
		}

		this.id = id;
		this.settings = lychee.extend({}, this.defaults, settings);

		this.__endTime = 0;
		this.__isIdle = true;
		this.__isLooping = false;
		this.__isMuted = false;
		this.__isReady = isReady;


		var playableFormat = null;
		for (var f = 0, l = this.settings.formats.length; f < l; f++) {

			var format = this.settings.formats[f];
			if (
				playableFormat === null
				&& _codecs[format] !== false
			) {
				playableFormat = format;
			}

		}


		if (playableFormat === null) {
			throw "Your Environment does only support these codecs: " + _supportedFormats.join(', ');
		} else {
			this.__init(this.settings.base + '.' + playableFormat);
		}

	};



	Class.prototype = {

		defaults: {
			base: null,
			formats: []
		},



		/*
		 * PRIVATE API
		 */

		__init: function(url) {

			this.__audio = new Audio(url);
			this.__audio.autobuffer = true; // old WebKit
			this.__audio.preload = true; // new WebKit
			this.__audio.load();


			var that = this;
			this.__audio.addEventListener('ended', function() {
				that.__onEnd();
			}, true);


			if (this.__isReady === false) {

				this.__audio.addEventListener('canplaythrough', function() {
					that.__isReady = true;
				}, true);

				setTimeout(function() {
					that.__isReady = true;
				}, 500);

			}

		},

		__onEnd: function() {

			if (this.__isLooping === true) {

				this.play(true);
				return false;

			} else {

				this.__isIdle = true;
				return true;

			}

		},

		__resetPointer: function() {

			try {
				this.__audio.currentTime = 0;
			} catch(e) {
			}

		},



		/*
		 * PUBLIC API
		 */

		play: function(loop) {

			loop = loop === true ? true : false;


			if (this.__isReady === true) {

				this.__resetPointer();
				this.__audio.play();
				this.__endTime = Date.now() + (this.__audio.duration * 1000);
				this.__isIdle = false;
				this.__isLooping = loop;

			}

		},

		stop: function() {

			this.__isIdle = true;
			this.__isLooping = false;

			this.__audio.pause();
			this.__resetPointer();

		},

		pause: function() {
			this.__audio.pause();
		},

		resume: function() {
			this.__audio.play();
		},

		mute: function() {

			if (this.__isMuted === false) {

				this.__unmuteVolume = this.__audio.volume;
				this.__audio.volume = 0;
				this.__isMuted = true;

				return true;

			}


			return false;

		},

		unmute: function() {

			if (this.__isMuted === true) {

				this.__audio.volume = this.__unmuteVolume || 1;
				this.__isMuted = false;

				return true;

			}


			return false;

		},

		getVolume: function() {
			return this.__audio.volume;
		},

		setVolume: function(volume) {

			var newVolume = Math.min(Math.max(0, volume), 1);
			this.__audio.volume = newVolume;

			if (newVolume === volume) {
				return true;
			}


			return false;

		},

		clone: function() {

			var id = this.id;
			var settings = lychee.extend({}, this.settings);

			return new lychee.Track(id, settings, true);

		},

		isIdle: function() {

			if (Date.now() > this.__endTime) {
				return this.__onEnd();
			}

			if (this.__audio.currentTime >= this.__audio.duration) {
				return this.__onEnd();
			}


			return this.__isIdle;

		},

		isMuted: function() {
			return this.__isMuted;
		},

		isReady: function() {
			return this.isIdle() && this.__isReady === true;
		}

	};


	return Class;

});

