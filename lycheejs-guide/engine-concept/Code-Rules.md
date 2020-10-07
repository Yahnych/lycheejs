
# Code Rules

These rules apply to pretty much everything of the whole
Engine stack and all Projects and Libraries and guarantee
best experience for both Humans and our Software Bots.

If an Exception is made, it is subject for refactoring.
So far every single worst-case abstraction iteratively
progressed into a clean state that follows these rules.


## Composition Pattern over Inheritance.

Every Definition tries to be a freely combineable Composite
with zero Dependencies.

This means that every Composite Definition tries to
represent its states via its constructor (the `states`
argument) and tries to reflect changing behaviour via a
predefined, guessable method signature (e.g. `setPosition`
method will influence the `position` property).


## Every Definition is serializable and deserializable.

Every instance-based property is recursively mapped via
`serialize()` and `deserialize()`.

The difference between `states` and `blob` is the position
in the timeline. If a Composite can be instanciated at
definition-time, the property is mapped into the `states`
object. If the same property changes over time (e.g. a fade
animation that needs a relative t `0.0 - 1.0` value) the
property is mapped into the `blob` object.

All recursive graph structures are also mapped into the
`blob`, so for example a `lychee.app.Layer` instance that
has multiple entities maps these entities via
`blob.entities = this.entities.map(lychee.serialize)`.


## Every Definition is simulateable and reproducible.

No platform-specific APIs are allowed outside the
`/source/platform/<tag>` folder.

This guarantees that every Composite and Module in the
codebase can be reproduced everywhere, no matter if that
target platform is already supported or will be supported
in the future.


## Every Definition is namespaced by behaviour.

For example, every Definition in `lychee.ui.entity` behaves
like a `lychee.ui.Entity` and fulfills the same interface.

For those definitions the `lychee.blobof()` method and
`lychee.interfaceof()` method can guess the behaviour
completely before the Composites are instanciated, which
is an important performance-increasing feature for our
AI simulations.


## Every Definition is a freely combinable Composite or a referencable Module.

Composites abstract behaviour while Modules abstract logic.

Each Composite allows to be re-used in other Composites on
a per-enum, per-property, per-method and per-event basis.

Modules on the other hand are static logic and they neither
change in inheritance levels nor in combinatory levels.

Callbacks are also allowed, so the Factory pattern is theoretically
supported. But as Factories are a time abstraction, there's
no efficient way to teach this to an AI.

The usage of the Factory pattern is completely disrecommended.


## Every Entity (Definition + Assets) is plug and play.

Entities have no dependency to third-party static Modules
that would introduce glue code.

Each Definition (e.g. `source/app/Tank.js`) is self-contained
with other files in the same folder that share the same prefix
(e.g. `source/app/Tank.png` or `source/app/Tank.json`).

Those assets are so-called attachments in the Definition and
allow to have reproducible, plug-and-play components when they
are reused - or - even renamed into different components
in future.

The huge advantage here is that every single Entity that was
written with lychee.js can be reused in every future lychee.js.

As every Project can function as a Library, there's no limit
on how to reuse your existing code.


## Every Layer can optionally add logic to third-party integrations.

For example, the layer `app.box2d.Layer` is the abstraction for
a third-party `Box2D` engine.

Seeing it as an entity graph, every layer in the lychee.js
Engine is only a projection of its properties. This means
that e.g. the `lychee.ai.Layer` or `lychee.ai.layer.*`
Definitions can still use a `lychee.app.Entity`, but will
probably require additional properties on the Composite
instances to function properly.

Those properties are probably reflected by the `lychee.ai.Entity`
or `lychee.ai.entity.*` Definitions, but are also compatible
with `lychee.app.Entity` instances.

In other words: Every Composite in the lychee.js Engine is
freely interchangeable and the first argument in the constructor
reflects its `states` - as opposed to a Class inhertiance pattern
which reflects `behaviour` via its `extends()` or super-chain.

