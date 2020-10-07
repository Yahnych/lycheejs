
const _         = imports.misc.extensionUtils.getCurrentExtension();
const console   = _.imports.console.console;
const GLib      = imports.gi.GLib;
const Item      = _.imports.item.Item;
const Lang      = imports.lang;
const Main      = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const Soup      = imports.gi.Soup;
const St        = imports.gi.St;
const Switch    = _.imports.item.Switch;
let   MANAGER   = null;



/*
 * HELPERS
 */

const _DUMMY = {
	can_focus:   false,
	style_class: 'lycheejs-menu-dummy',
	visible:     true
};

const _render_harvester = function(online) {

	let menu  = new PopupMenu.PopupSwitchMenuItem('lychee.js Harvester', online);
	let label = menu.actor.get_children()[1] || null;
	let box   = new St.BoxLayout({
		style_class: 'panel-status-menu-box'
	});

	if (label !== null) {
		label.add_style_class_name('system-menu-label lycheejs-menu-label');
	}

	box.add(new St.Label({
		can_focus:   false,
		visible:     true,
		style_class: 'system-menu-separator lycheejs-menu-separator'
	}), {
		expand:  true,
		x_align: St.Align.MIDDLE
	});

	box.add(new St.Label(_DUMMY));
	box.add(new St.Label(_DUMMY));


	let button_term = new St.Button({
		accessible_name: 'term',
		can_focus:       true,
		reactive:        true,
		style_class:     'system-menu-action lycheejs-menu-action',
		x_align:         St.Align.END
	});

	button_term.child = new St.Icon({
		icon_name: 'utilities-terminal-symbolic'
	});

	box.add(button_term, {
		expand:  false,
		x_align: St.Align.END
	});

	button_term.connect('clicked', _ => {
		GLib.spawn_command_line_async('sh -c "gnome-terminal --working-directory=\\"/opt/lycheejs\\"";');
	});

	menu.actor.add(box, {
		expand:  true,
		x_align: St.Align.END
	});

	menu.connect('toggled', _ => {

		let state = menu.state;
		if (state === true) {

			GLib.spawn_command_line_async('sh -c "cd /opt/lycheejs && lycheejs-harvester start development 1> /tmp/lycheejs-harvester.log 2> /tmp/lycheejs-harvester.err";');

		} else {

			for (let c = 0, cl = this._cache.length; c < cl; c++) {

				this._cache[c].destroy();
				this._cache.splice(c, 1);
				cl--;
				c--;

			}

			GLib.spawn_command_line_async('sh -c "cd /opt/lycheejs && lycheejs-harvester stop";');

		}

	});

	return menu;

};

const _parse = function(body) {

	let data = [];
	let json = null;

	try {
		json = JSON.parse(body);
	} catch (err) {
		json = null;
	}

	if (json instanceof Array) {
		json.forEach(obj => data.push(obj));
	}

	return data;

};

const _request_index = function(host, callback) {

	let session = new Soup.Session();
	let message = Soup.Message.new('GET', 'http://' + host + ':4848');

	session.queue_message(message, (session, message) => {

		let data = null;

		try {
			data = JSON.parse(message.response_body.data);
		} catch (err) {
			data = null;
		}

		if (data instanceof Object) {
			callback(data.message.includes('Please go away.'));
		} else {
			callback(false);
		}

	});

};

const _request_api = function(host, callback) {

	let session = new Soup.Session();
	let msg1    = Soup.Message.new('GET', 'http://' + host + ':4848/api/library/index');
	let msg2    = Soup.Message.new('GET', 'http://' + host + ':4848/api/project/index');

	session.queue_message(msg1, (session, msg1) => {

		session.queue_message(msg2, (session, msg2) => {

			let filtered  = [];
			let libraries = msg1.status_code === 200 ? _parse(msg1.response_body.data) : [];
			let projects  = msg2.status_code === 200 ? _parse(msg2.response_body.data) : [];


			libraries.forEach(library => filtered.push(library));
			projects.forEach(project => filtered.push(project));

			filtered = filtered.sort(function(a, b) {
				if (a.identifier > b.identifier) return  1;
				if (b.identifier > a.identifier) return -1;
				return 0;
			});

			callback(filtered);

		});

	});

};

const _refresh_list = function() {

	let cache     = this._cache;
	let container = this.container || null;
	let settings  = this.settings;

	if (container === null) {
		return;
	}


	_request_api(settings.host, data => {

		data.forEach(project => {

			let other     = cache.find(o => o._identifier === project.identifier) || null;
			let harvester = project.harvester === true;


			// XXX: Libraries cannot be remote-controlled
			if (project.identifier.startsWith('/libraries')) {
				harvester = false;
			}


			if (other === null) {

				if (harvester === true) {

					let item = new Switch(project);
					container.menu.addMenuItem(item);
					cache.push(item);

				} else {

					let item = new Item(project);
					container.menu.addMenuItem(item);
					cache.push(item);

				}

			} else {

				other._update(project);

			}

		});

	});

};



/*
 * IMPLEMENTATION
 */

const _ServiceManager = new Lang.Class({

	Name: 'ServiceManager',

	_cache: [],
	_init:  function(host) {

		this.settings = {
			host: host || 'localhost'
		};

		this.container = new PanelMenu.Button();
		PanelMenu.Button.prototype._init.call(this.container, 0.0);

		this._harvester = _render_harvester.call(this, false);


		let hbox = new St.BoxLayout({
			style_class: 'panel-status-menu-box'
		});

		let icon = new St.Icon({
			icon_name:   'lycheejs',
			style_class: 'system-status-icon'
		});

		hbox.add_child(icon);


		this.container.actor.add_actor(hbox);
		this.container.actor.add_style_class_name('panel-status-button');
		this.container.actor.connect('button-press-event', _ => {

			_request_index(this.settings.host, online => {

				this._harvester.setToggleState(online);

				if (online === true) {
					_refresh_list.call(this);
				} else {
					this._cache.forEach(element => {
						element.destroy();
					});
				}

			});

		});
		this.container.menu.addMenuItem(this._harvester);


		Main.panel.addToStatusArea('lycheejs', this.container);

	},

	destroy: function() {

		let container = this.container || null;
		if (container !== null) {
			container.destroy();
		}

	}

});



/*
 * EXPORTS
 */

function init() {

}

function enable() {
	MANAGER = new _ServiceManager('localhost');
}

function disable() {
	MANAGER.destroy();
	MANAGER = null;
}

