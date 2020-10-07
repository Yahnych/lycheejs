
# Event Graph

The lychee.js Engine integrates an Event Graph that
allows clean event flows and branches between Entities
and Fertilizer (platform) Adapters.

Every time there's a passive interaction with your
App it is better to use an Event Graph Entity.

Every time there's a stateful interaction with your
App it is better to use a Scene Graph Entity.

So, for example, a `touch` event on a `lychee.ui.Layer`
could lead to a `setPosition()` of a Scene Graph Entity.


## Prerequisites

- You should have completed the [Basic Debugging](./03-debugging.md)
  Tutorial.
- You should have completed the [Scene Graph](./04-scene-graph.md)
  Tutorial.


## Event Emitter

The lychee.js Event Graph is not limited to a Scene Graph
usage. The centralized `lychee.event.Emitter` can be used
on `any Object instance` in your App.

That means, for example, even the `lychee.net.Client` and
`lychee.net.Server` work with the help of the
`lychee.event.Emitter` interface to send and receive data
across the network connections.

The huge advantage the `lychee.event.Emitter` has is that
it can serialize all events and resimulate them on another
machine exactly 1:1.

You can activate this by activating the `lychee.debug` flag
inside the environment.

The `lychee.Debugger` serializes the `lychee.environment`
instance and tracks all `events`, so that the snapshot and
the "how the user crashed my App" can be resimulated in a
completely automated manner.


## TODO: Integration with the Editor

