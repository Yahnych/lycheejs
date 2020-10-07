
# Create a Client

This tutorial will explain how to create a Client that
uses the `html` platform stack with the `lychee.net.Client`
that can run client-side (or server-side).


## Prerequisites

- You should have completed the [Create a Server](./01-server.md)
  Tutorial.


## Networking Basics

The `app.net.client.Chat` service we are going to build will
inherit from the `lychee.net.client.Chat` Composite, because
it is a very easy-to-use service. The client-side service is
the counterpart of the previously created server-side service.

All network services in lychee.js are peer-to-peer, which means
they are really not client/server environments, but more of
a self-authing self-discriminating nature.

The `lychee.net.Service` Composite has some handy events and
methods already integrated to support typical usages like `multicast`,
`broadcast` or `sessioncast`.

The relations for a service can get complicated when you have
multi-peer and multi-proxy environments, but in our case they
are quite simple:

```
1 remote has n services
1 service has n tunnels (remotes)

1 chat service has n chat rooms
1 chat room has n users
```

In our case, we mostly want to implement a simple chat room that
everybody can join into, so we ignore things like authentication
and encryption here for now.

However, the lychee.js stack and its peer network protocols are
completely SSH and TLS compatible, so you can always tunnel them
through a secure transport layer.

Back to our chat, we use the `broadcast` event to send an incoming
message to all users in the same chat room.

In the lychee.js Network stack, methods are used to actively transfer
data imperatively; while events are the equivalent receiving side.

As all clients are remotes on the other side and vice versa, it is
important to follow this usage scheme to not get confused.

```javascript
# Client-Side Example

let service = new lychee.net.client.Chat(client, 'chat', {
	room: 'hello-world',
	user: '@awesome'
});

service.broadcast({
	message: "I like unicorns"
});
```

```javascript
# Remote-Side Example

let service = new lychee.net.remote.Chat(remote, 'chat', {
	room: 'hello-world'
});

service.bind('broadcast', function(data) {
	console.log('RECEIVED BROADCAST MESSAGE', data.message);
});
```


## Create the Network Service

We now apply the learned knowledge from above and create the
Network Service for our custom `app.net.Client`.

The naming scheme is identical to the `remote` side as before,
so our client-side service will be stored in the `source/net/client/Chat.js`
file.


Create the `source/net/client/Chat.js` file with the following
content:

```javascript
lychee.define('app.net.client.Chat').includes([
	'lychee.net.client.Chat'
]).exports(function(lychee, global, attachments) {

	const _Chat = lychee.import('lychee.net.client.Chat');



	/*
	 * IMPLEMENTATION
	 */

	const Composite = function(client) {

		_Chat.call(this, 'chat', client, {
			room: 'hello-world',
			user: '@awesome'
		});

		this.bind('broadcast', function(data) {
			console.log('BROADCASTED MESSAGE', data);
		}, this);

	};


	Composite.prototype = {

		/*
		 * CUSTOM API
		 */

		hello: function(message) {

			message = typeof message === 'string' ? message : null;

			if (message !== null) {

				this.broadcast({
					message: message
				});

			}

		}

	};


	return Composite;

});
```


## Integrate the Network Service

Now that the `app.net.client.Chat` service is ready
for use, it is possible to integrate it with the
`app.net.Client` located at `source/net/Client.js`.

In order to integrate the new service, we have to
add it to the `app.net.Client` itself.

**Event Sourcing / Domain Driven Design Basics**

Each service tries to fullfill one purpose only
and does not try to be the godlike all-knowing
service that knows about all data structures inside
your application.

So it's important to understand that all network
services in lychee.js fullfill one purpose only and
can be reused across any future networking protocol,
because the `lychee.net.Service` API stays identical.

All services can also be plugged in asynchronously
and can be unplugged and re-plugged in at anytime.

So it is important to make sure your custom code always
respects that and doesn't assume that all services
are available all the time.

Some network protocols, like `lychee.net.protocol.MQTT`,
are automatically scheduled based on their usage and
activity. So if somebody re-uses your network service
and changes to such a different network protocol,
things should not break and continue to work nicely.

That means you should always make sure that you use the
equivalent state-forgiving comparisons in your code
when you use the network service to send or receive
data:

```javascript
let client = main.client || null;
if (client !== null) {

	let service = client.getService('my-service');
	if (service !== null) {
		service.doWhatever();
	} else {
		console.error('Well, no service here?');
	}

}
```

**Add a Service to the Client**

The following challenges are now for you to solve inside
the `source/net/Client.js` file:

1. Add the `app.net.client.Chat` to the requirements.
2. Import the `app.net.client.Chat` to `_Chat` variable.
3. Add `new _Chat(client)` service to the client's `connect` event.

You will most likely realize that both the `Client` and
`Server` API are very similar.

The only difference that is non-avoidable by-concept is
that the server has multiple clients to serve, so the
`connect` and `disconnect` event differs in its arguments
and passes through the `remote` parameter on the server-side
event.

From there on, both the `lychee.net.Client` and
`lychee.net.Remote` have the identical API, which is
offered via the `lychee.net.Tunnel` Definition.

## Debug the Client

By default, the `index.html` of each project uses the
`lychee.pkginit()` method in order to use the package.

The `debug: true` flag can be activated in order to have
better debugging messages. If `sandbox: true` is set, the
`lychee.Environment` will not pollute the global scope
with Definitions or platform-specific methods.

If the `lycheejs-harvester` is not started already, start it.

Open up the Browser now and open up the URL `http://localhost:8080/projects/tutorial/index.html`
so that we can inspect our current Project.


## lychee.js Environments

The lychee.js Engine is built for multiple Environments
that also can run in parallel. Depending on each Environment
setup, those can interact or be used for simulation purposes.

The active Environment is mapped on the `lychee.environment`
property. Open up the `Console Tab` of the Dev Tools and
enter the following code to send a message to all
other active peers (try more than one Browser in parallel):


```javascript
let service = lychee.environment.global.MAIN.client.getService('chat');

service.hello('Hello World!');
```

Now open up the `Network Tab` of the Dev Tools and inspect
the last (WebSocket) connection to see what has been sent.

![browser](./02-client/asset/browser.png)

