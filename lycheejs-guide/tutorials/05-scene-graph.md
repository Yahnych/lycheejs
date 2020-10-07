
# Scene Graph

The lychee.js Engine integrates a Scene Graph that
allows clean interaction between Entities and a
graphical representation that is layered and buffered
for better performance.


## Prerequisites

- No Prerequisites necessary


## Entities

The lychee.js Scene Graph uses an Entity/Component
concept. Entities are described as `plug and play`
renderable Instances that have close to no external
dependencies.

A custom Entity can look like this in the filesystem:

```bash
/source
+-- /ui
  +-- /sprite
    +-- Button.js
    +-- Button.png
    +-- Button.json
    +-- Button.msc.ogg
    +-- Button.msc.mp3
```

All files follow a naming scheme, so that it is easier
for automated tools to create/fork/modify Entities.

The above Entity creates the `app.ui.entity.Button`
Entity that (probably) renders a custom Sprite in its
`render()` method as you can judge by the `png` and
`json` attachment.

As all namespaces try to reflect the behaviour of the
implementations, the `ui.sprite` namespace will automatically
indicate that the Entity has a behaviour identical to
the `lychee.ui.Sprite`, same goes for `lychee.ui.Entity`
and so on.


## Entity Types

The different Entity types are:

- App Entity (for custom simulations)
- UI Entity (for UI interactions)
- Verlet Entity (for Physics simulations)


The `lychee.app.Entity` is made for custom usage and
velocity-based behaviours:

- can receive no `events`
- has `collision` with other Entities
- has `effects`
- has `velocity`


The `lychee.ui.Entity` can receive UI events and is made for
UI interaction and visible/hidden state-changes:

- can receive `events` (via `lychee.event.Emitter`)
- has no `collision` with other Entities
- has `effects`
- can be `visible` or hidden

The `lychee.verlet.Entity` inherits from `lychee.app.Entity`
and is made for physics-based simulations. It is tightly
integrated with the `lychee.math` stack, so it has support
for `Matrix` and `Quaternion` based translations, rotations
and projections.


## Layers

The lychee.js Scene Graph uses Layers and a delegation
pattern to fire events.

Each layer can either trigger an event on a child inside the
`entities[]` Array or decide to receive an event for itself
when an event was `bind()` on the Layer before.


## Layer Types

The different Layer types are:

- App Layer (for custom simulations)
- AI Layer (for AI simulations)
- UI Layer (for UI interactions)
- Verlet Layer (for Physics simulations)


The `lychee.app.Layer` is made for custom usage:

- can receive `events`
- can `relayout` on relayout event
- has `projections` for its entities
- can be `visible` or hidden

The `lychee.ai.Layer` is made for AI simulations and can have
`lychee.ai.Agent` instances as its children:

- can NOT `render()` its agents
- can `update()` its agents
- has `epoche` event for evaluation of agents

The `lychee.ui.Layer` can receive and delegate UI events and
is made for UI interaction:

- can receive `events`
- can `relayout` on relayout event
- can delegate UI events (`touch`, `key`, `scroll`)
- has `projections` for its entities
- can be `visible` or hidden

The `lychee.verlet.Layer` inherits from `lychee.app.Layer`
and is made for physics simulations.

- can receive `events`
- can `relayout` on relayout event
- has `projections` for its entities
- can be `visible` or hidden
- has `friction` for its entities
- has `gravity` for its entities

The `lychee.verlet.Layer` is tightly integrated with the
`lychee.math` stack, so it has support for `gravity` and
`friction` by default and allows quick and easy physics
environments.


## Scene Graph Queries

The `lychee.app.State`, `lychee.ui.State` and all Layers
offer a `query(path)` API that allows flexible queries
on its graph structures.

You can easily use that API to inspect how Layers and
Entities are constructed and what properties influence
their behaviours.

Remember, every Entity is serializable any time and has a
`serialize()` method that returns a Serialization Object
with all information that is required to clone its state
representation _and_ behaviour.

Possible Query Identifiers:

- Index (`Number` index in the `entities[]` Array)
- Identifier (`String` id that was used in `setEntity(id, entity)`)
- Internal Identifier (`String` id that is prefixed with an `@`)

In the Browser console or node-inspector, you can do something
like this to inspect an Entity in the Scene Graph:

```javascript
let main   = lychee.environment.global.MAIN;
let entity = main.state.query('ui > menu > @select');

console.log(entity);
console.log(entity.serialize());
```


## Automated Scene Graph

The lychee.js Scene Graph also supports an automated layouting
stack that allows quick and easy mockup-style layouts that are
learning from the user's behaviour and preference.

This automated graph uses two different abstractions:

- `lychee.ui.Blueprint` which relayouts, prioritizes and reshapes elements
- `lychee.ui.Element` which implements workflows

You can see the `lychee.ui.Element` abstraction as something like
a `widget` in other frameworks; though it is a self-containing
instance that has only a `change` event with an action attached
to it.

That means all internal workflows, data abstractions, data bindings
etc. are _isolated_ from the outside graph world and each element
works plug and play to offer its functionality.

```javascript
let blueprint = new lychee.ui.Blueprint();
let element   = new lychee.ui.element.Jukebox();

element.bind('change', function(action) {

	if (action === 'save') {
		console.log('Saving Jukebox Settings ...');
	}

});

blueprint.addEntity(element);

// Of course, add the blueprint to the Scene Graph
MAIN.state.setLayer('ui', blueprint);

// Force relayout
MAIN.state.trigger('relayout');
```


## Flexible Customization

The lychee.js Scene Graphs allows a very flexible integration
of third-party custom logic and foreign libraries.

A use case could be that of training an AI, but its update
cycles and epoches for evaluation are different from the Scene
Graph. In that case it's possible to simply create something
like a `lychee.ai.Layer` that can be placed in the Scene Graph
to integrate its `lychee.ai.Entity` or `lychee.ai.Agent`
instances as `entities[]`.

Another example for a use case is that of `Box2D`, a very
popular physics simulation engine made for Games. In that case
it's possible to simply create a `app.box2d.Layer` that
integrates the custom simulations with the update cycles of the
lychee.js Scene Graph.

