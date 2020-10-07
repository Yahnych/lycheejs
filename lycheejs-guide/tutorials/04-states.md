
## App States

This tutorial will explain the concept of an application
and its states. A so-called `App State` represents one
major layout of the application and is used to reflect
the different aspects of the Application.

For example, this can be a `Credits`, `Game`,  or a
`Chat` State that itself in its form is different from
other States of the Application.


## Prerequisites

- You should have completed the [Basic Debugging](./03-debugging.md)
  Tutorial.


## MAIN

The lychee.js Engine allows to have multiple applications
running in parallel, so there can be scenarios where the
current application is in fact multiple applications that
run in a sandboxed manner.

However, to keep things easy, we currently assume that the
environment runs with `sandbox: false`. To prevent mistakes
please make sure that the `sandbox` setting is set to false
in your `index.html`.


**Profiles**

The `lychee.app.Main` is the entry point for an application.
It has a given event flow on how to set things up and it
offers `states` and `profiles` integration, so that you
can customize the behaviour of your `MAIN` instance.

Somewhere in `source/Main.js` you will find the defaulted
settings of your application that you can modify:

```javascript
const Composite = function(data) {

	let states = Object.assign({
		// Default Settings here
	}, data);

};
```

As you can imagine, every single Composite in the lychee.js
Engine accepts an object that represents its configuration.

That means, for example, that the `states.viewport` object
gets directly passed through to the `new lychee.Viewport(states.viewport)`
constructor.

All `states` across the lychee.js Stack have the idea of
serialization and deserialization and allow each instance and
all that happened on the timeline to be reproduced everywhere.

This includes all platforms, all runtimes, all AI simulations
and all sandboxes without any exception. The very own lychee.js
Software Bots make use of that and therefore can serialize and
deserialize themselves for automated debugging, for example.

We will dig into the Serialization Blob in detail later, for
now it is important to know that there are two different types
of "objects" that play a role in the lychee.js Composite Pattern:

- `states` is a state representation (`new Composite(states)`)
- `blob` is a behaviour representation (e.g. timeline data, event flows, animations; used via `instance.deserialize(blob)`)


**Initialization Flow**

The `app.Main` of each Project or Library always has two major
events that are represented using a `lychee.event.Flow` that is
similar to the `Promise` idea in ES2016 and later.

```javascript
let main = new lychee.app.Main();

main.bind('load', function(oncomplete) {

	// This is a Dummy to demonstrate the event flow
	this.dummy = new external.Client('ws://backend/api');

	this.dummy.on('ready', function() {
		oncomplete(true);
	});

	this.dummy.on('error', function(err) {
		// Oh shit, can't continue
		oncomplete(false);
	});

}, main, true); // bind on main, only once

main.bind('init', function(oncomplete) {

	let state1 = new lychee.ui.State(this);
	let state2 = new lychee.app.State(this);

	this.setState('welcome', state1);
	this.setState('credits', state2);

	this.changeState('welcome', 'settings');

}, main, true); // bind on main, only once
```

**Event Flow**

- The `load` event loads all resources, for example the network
  server or client, external `REST` API resources or third-party
  libraries and so on.

- The `init` event initializes your Application. That means
  all states are created (and deserialized) and the Application
  is fully booted up afterwards.

Remember that the `app.Main` of all Projects and Libraries
are _fully isomorphic_ - which means that they are used on
client-side, server-side or peer-side.

So using things like DOM APIs in there will probably be stupid.
The lychee.js Stack is completely DOM and platform-specific
code free to guarantee isomorphic behaviour on across all
platforms.


**Debugging the MAIN**

After the above Example is initialized, the Main will have a
`MAIN.state` property that represents the active App State.

As the above Example initialized a `UI State` and passed
`settings` to the `enter(oncomplete, data)` method, the
currently visible UI layer is `ui > settings`.

In the Browser / nw.js Console, you can do something like
this at any time to figure out what's going on:

```javascript
let state = MAIN.state;
let layer = state.query('ui > settings');

layer.visible;                // true
MAIN.changeState('credits'); // true or false
```

Important Note: The global `MAIN` property will only be
available when the `sandbox: false` flag is set. If the
`sandbox: true` flag is set, the `MAIN` will run in an
isolated sandbox; and therefore be only available via
the `lychee.environment.global.MAIN` property.


## App States

The Main also consists of different App States. In our
`/projects/tutorial` case, the Main was created using the
Boilerplate and has already a `welcome` State setup that is
changed to by default.

A `State` always has an `enter()` and `leave()` method that is
called once the `changeState()` of the MAIN was called. Accordingly
the last active state will be left and the new one will be entered.

As a `UI State` can have several UI layers that are represented
in a Scene Graph, a `State` also accepts `(string) layer` as a second
parameter and will transition to this layer identifier automatically
when the `enter()` method was called.

```javascript
let state = new lychee.ui.State();

state.enter(function(ready) {
	console.log('Enter transition complete');
}, 'settings');

state.leave(function(ready) {
	console.log('Leave transition complete');
});
```

Important Note: In the case of a `UI State` the `data` parameter is a
layer identifier, while in the case of an `App State` this can be
anything (that you want it to).


**Welcome State**

The `welcome` State of the Boilerplate (or the Tutorial Project) is
defined at `source/state/Welcome.js` and is a `UI State` that
automatically integrates the whole lychee.js UI stack, layers and
everything you typically need so that you can navigate around, have
a sidebar menu and can tweak the application's settings.


When taking a closer look at the `_BLOB` constant in the `source/state/Welcome.js`,
you will find something like this:

```javascript
const _State = lychee.import('lychee.ui.State');
const _BLOB  = attachments["json"].buffer;


const Composite = function(main) {

	_State.call(this, main);

	this.deserialize(_BLOB);

};

Composite.prototype = {

	deserialize: function(blob) {

		_State.prototype.deserialize.call(this, blob);


		let menu = this.query('ui > menu');
		if (menu !== null) {

			menu.setHelpers([
				'refresh'
			]);

		}

	}

};
```

The `attachments["json"]` represents the `source/state/Welcome.json`
file that contains the whole Scene Graph.

All layers, all entities, all blueprints, all elements, all game
entities, all physics entities and everything else related to the
scene graph are stored in serialized form in that JSON file.

The Scene Graph is also editable via the "Scene" State in
[lychee.js Studio](../software-bots/lycheejs-studio.md).


**State Deserialization**

The idea of States and their deserialization is that they can be
reused more efficiently and stay contained with no dependencies
to other states.

For example, you could easily copy/paste a State and its JSON
file to another project and it will directly work - given that
the Entity and Layer Definitions it uses are available.

When we want to initialize custom events, it's better to bind them
in a delegation pattern and only one time - to save computation
time.

So, in our case it makes most sense to bind them inside the `deserialize()`
method. Note that the State itself never receives any events, updates
or anything until it is the current active state of the Application.

So it's safe to bind UI events on layers and entities without having to
worry whether the user "can actually reach" this layer or entity.

For example, we can do this now at the bottom of the `deserialize()` method:

```javascript
let menu = this.query('ui > menu');
if (menu !== null) {
	menu.bind('change', function(state) {
		console.info('Selected Menu Item "' + state + '"');
	});
}
```


As we learned before, we can modify the State's `enter()` and `leave()`
method to implement our custom logic, we can bind and unbind events
and/or initialize additional graph structures.

A typical use case for a game would be a custom touch event handler
that delegates into the game logic.

```javascript
Composite.prototype = {

	enter: function(oncomplete, data) {

		console.log('Hello from State');

		let input = this.input || null;
		if (input !== null) {
			input.bind('touch', _on_touch, this);
		}

		_State.prototype.enter.call(this, oncomplete, data);

	},

	leave: function(oncomplete) {

		let input = this.input || null;
		if (input !== null) {
			input.unbind('touch', _on_touch, this);
		}

		console.log('Bye from State');

		_State.prototype.leave.call(this, oncomplete);

	}

};
```

