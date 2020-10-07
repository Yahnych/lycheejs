
const _         = imports.misc.extensionUtils.getCurrentExtension();
const console   = _.imports.console.console;
const GLib      = imports.gi.GLib;
const Gtk       = imports.gi.Gtk;
const Lang      = imports.lang;
const PopupMenu = imports.ui.popupMenu;
const St        = imports.gi.St;



/*
 * HELPERS
 */

const _on_init = function(project) {

	this._identifier = project.identifier;
	this._filesystem = project.filesystem || null;
	this._harvester  = project.harvester === true;
	this._server     = project.server || null;
	this._web        = project.web === true;
	this._box        = _render_box.call(this);

};

const _on_update = function(project) {

	let needs_render = false;


	let filesystem = project.filesystem || null;
	if (filesystem !== this._filesystem) {
		this._filesystem = filesystem;
		needs_render     = true;
	}

	let harvester = project.harvester === true;
	if (harvester !== this._harvester) {
		this._harvester = harvester;
	}

	let server = project.server || null;
	if (server !== null) {

		if (this._server === null) {
			this._server = { host: null, port: null };
		}

		this._server.host = server.host;
		this._server.port = server.port;

		if (typeof this.setToggleState === 'function') {
			this.setToggleState(true);
		}

	} else {

		this._server = null;

		if (typeof this.setToggleState === 'function') {
			this.setToggleState(false);
		}

	}

	let web = project.web === true;
	if (web !== this._web) {
		this._web    = web;
		needs_render = true;

	}


	if (needs_render === true) {
		this._box.destroy();
		this._box = _render_box.call(this);
	}

};

const _render_box = function() {

	let box = new St.BoxLayout({
		style_class: 'panel-status-menu-box'
	});

	box.add(new St.Label({
		can_focus:   false,
		visible:     true,
		style_class: 'system-menu-separator lycheejs-menu-separator'
	}), {
		expand:  true,
		x_align: St.Align.MIDDLE
	});



	let button_file = null;

	if (this._filesystem !== null) {

		button_file = new St.Button({
			accessible_name: 'file',
			can_focus:       true,
			reactive:        true,
			style_class:     'system-menu-action lycheejs-menu-action',
			x_align:         St.Align.END
		});

		button_file.child = new St.Icon({
			icon_name: 'system-file-manager-symbolic'
		});

		button_file.connect('clicked', _ => {
			GLib.spawn_command_line_async('sh -c "lycheejs-helper file ' + this._identifier + '";');
		});

	} else {

		button_file = new St.Label({
			can_focus:   false,
			style_class: 'lycheejs-menu-dummy',
			visible:     true
		});

	}

	box.add(button_file, {
		expand:  false,
		x_align: St.Align.END
	});


	let button_web = null;

	if (this._web === true) {

		button_web = new St.Button({
			accessible_name: 'web',
			can_focus:       true,
			reactive:        true,
			style_class:     'system-menu-action lycheejs-menu-action',
			x_align:         St.Align.END
		});

		button_web.child = new St.Icon({
			icon_name: 'web-browser-symbolic'
		});

		button_web.connect('clicked', _ => {
			GLib.spawn_command_line_async('sh -c "lycheejs-helper web http://localhost:8080' + this._identifier + '"/index.html;');
		});

	} else {

		button_web = new St.Label({
			can_focus:   false,
			style_class: 'lycheejs-menu-dummy',
			visible:     true
		});

	}

	box.add(button_web, {
		expand:  false,
		x_align: St.Align.END
	});


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
		GLib.spawn_command_line_async('sh -c "gnome-terminal --working-directory=\\"/opt/lycheejs' + this._identifier + '\\"";');
	});

	return box;

};



/*
 * IMPLEMENTATION
 */

const _Switch = new Lang.Class({

	Name:    'Switch',
	Extends: PopupMenu.PopupSwitchMenuItem,

	_identifier: null,
	_harvester:  false,
	_server:     null,

	_init: function(project) {

		_on_init.call(this, project);

		this.parent(project.identifier, this._server !== null);


		let label = this.actor.get_children()[1] || null;
		if (label !== null) {
			label.add_style_class_name('system-menu-label lycheejs-menu-label');
		}

		this.actor.add(this._box, {
			expand:  true,
			x_align: St.Align.END
		});

		this.connect('toggled', _ => {

			let state = this.state;
			if (state === true) {
				GLib.spawn_command_line_async('sh -c "lycheejs-helper start ' + this._identifier + '";');
			} else {
				GLib.spawn_command_line_async('sh -c "lycheejs-helper stop ' + this._identifier + '";');
			}

		});

	},

	_update: function(project) {

		_on_update.call(this, project);

	}

});


const _Item = new Lang.Class({

	Name:    'Item',
	Extends: PopupMenu.PopupMenuItem,

	_identifier: null,
	_harvester:  false,
	_server:     null,

	_init: function(project) {

		_on_init.call(this, project);

		this.parent(project.identifier);


		let label = this.actor.get_children()[1] || null;
		if (label !== null) {
			label.add_style_class_name('system-menu-label lycheejs-menu-label');
		}

		this.actor.add(this._box, {
			expand:  true,
			x_align: St.Align.END
		});

	},

	_update: function(project) {

		_on_update.call(this, project);

	}

});



/*
 * EXPORTS
 */

var Item   = _Item;
var Switch = _Switch;

