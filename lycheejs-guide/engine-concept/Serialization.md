
# Serialization

The lychee.js Engine stack includes a fundamentally important
serialization concept which allows all of the other features.

All Asset (`Buffer`, `Config`, `Font`, `Music`, `Sound`,
`Texture` or `Stuff`) instances are serializable.

All Composite instances, Module references or Callback
references (that are defined by Definitions and their
attachments in the form of Assets) are serializable.

All Environments, including their sandboxes, tracked
features and event timelines, are serializable.

Together these three major serialization areas allow to
clone, modify and simulation Environments across different
platforms and runtimes in an absolutely identical manner.

This is a very important aspect of the lychee.js Engine, as
it allows our Artificial Intelligence to re-simulate given
Projects or Libraries and allows it to understand what went
wrong in the case of errors, mistakes or failures that happened
inside the code.

The tracking Module in the case of errors is the
`lychee.Debugger` Module which is part of the core and sends
errors across the network using a simple `lychee.environment.serialize()`
call; which will then recursively call `lychee.serialize(instance)`
on all instances in order to get the whole Serialization Blob.

As Definitions and Assets are also serializable, this is the
part that the Artificial Intelligence can now reproduce, as
the code in the form of ECMAScript can now be written, injected,
simulated and reproduced everywhere.

That is essentially why external Preloader concepts are
disrecommended, as most of them (if not all) are platform-specific
and do not allow reusage of identical code across other
platforms or runtimes.


## Serialization Format

The serialization format in the lychee.js Engine specifies
a given format that is re-used across all codecs. A codec
is a serialization technique (e.g. `JSON`, `BITON`, `DIXY`
and others).

There are two different serialization formats, which follow
both the same rule:

If something can be represented using the definition time,
it is part of the `arguments` (or `states` object in the
Composite case).

If it cannot be represented using the definition time -
and has a relative time sensitivity (e.g. an animation that
is not yet completed and requires something like a `t = 0.7123`
state), it is part of the optional `blob`.

```javascript
let module = lychee.import('lychee.codec.JSON');
let data   = lychee.serialize(module);

data; // { reference: 'lychee.codec.JSON', arguments: [] }
```

```javascript
let _Tank = lychee.import('game.app.entity.Tank');
let instance = new _Tank({
	position: {
		x: 0,
		y: 0
	}
});


// XXX: Definition Time example
let data1 = lychee.serialize(instance);

data1; // { constructor: 'game.app.entity.Tank', arguments: [{ position: { x: 0, y: 0 }}]


// XXX: Time-sensitive example

let duration = 1000;
let target   = { x: 100 };

instance.moveTo(target, duration);


setTimeout(_ => {

	let data2 = lychee.serialize(instance);

	data2; // { constructor: 'game.app.entity.Tank', arguments: [{ position: { x: 0, y: 0 }}], blob: { target: { x: 100 }, t: 0.7 }

}, 700); // t == 0.7 because duration == 1000
```


## lychee.serialize(instance)

The `lychee.serialize(instance)` method allows to serialize
everything. Everthing in ECMAScript is an Object instance,
so all low-level data types are polyfilled and supported
as well.


```javascript
let _Main    = lychee.import('lychee.app.Main');
let instance = new _Main({ custom: 'setting' });
let data     = lychee.serialize(instance);

data; // { constructor: 'app.Main', arguments: [{ custom: 'setting' }] }
```

## lychee.deserialize(data)

The `lychee.deserialize(data)` method allows to deserialize
a Serialization Blob. All Assets, Definitions, Composites,
Modules, Callbacks - are serializable in the whole lychee.js
Engine stack and Projects or Libraries.

```javascript
let asset = new Config('/whatever.json');

asset.onload = function() {

	let data = lychee.serialize(asset);

	data; // { constructor: 'Config', arguments: [ '/whatever.json' ], blob: { buffer: '...' }}

	let clone = lychee.deserialize(data);

	clone === asset;         // false
	clone.url === asset.url; // true

	clone.buffer === asset.buffer;                                 // false
	JSON.stringify(clone.buffer) === JSON.stringify(asset.buffer); // true

};

asset.load();
```

