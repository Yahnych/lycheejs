
# Create a Server

This tutorial will explain how to create a Server that
uses the `node` platform stack with the `lychee.net.Server`
that can run server-side (or client-side).


## Prerequisites

- The lychee.js Engine has to be installed already (into `/opt/lycheejs`).


## Initialize the Project

The `/opt/lycheejs/projects` directory contains all projects
made with lychee.js. It already contains many examples and
demos that you can open, edit and manipulate with the
lychee.js Tools.

First of all, we need to create our new project using the
`lycheejs-breeder` command line tool.

It is explicitely important to create lychee.js Projects
only in the `/opt/lycheejs/projects` subfolder in order to
have all features offered by the lychee.js Engine.

As all tools are cross-dependent, the lychee.js Breeder also
interacts with the Fertilizer, Strainer, Harvester, Studio,
Ranger and all the other tools behind the scenes automagically.

```bash
cd /opt/lycheejs;

# Create the Project Folder
mkdir ./projects/tutorial;
cd ./projects/tutorial;

# Initialize the Boilerplate
lycheejs-breeder init;
```

The output of the above commands should look like this:

![lycheejs-breeder](./01-server/asset/initialize.png)


## Bootup the Project

As you might have noticed, the project automatically has
a `harvester.js` file. It is named that way, because it
is the integration entry point for the `lycheejs-harvester`.

The lychee.js Harvester automatically calls the `harvester.js`
and spawns the App Server on an ephermal port ( `49152` to `65534` )
dependent on what other programs already run on your machine
and use the ports already.

You have to start the `lycheejs-harvester` with the
`development` profile in a separate Terminal window.

```bash
cd /opt/lycheejs;

# Start lychee.js Harvester
lycheejs-harvester start development;
```

The output of the above command should look like this:

```bash
(I) harvester.mod.Server: BOOTUP ("/projects/tutorial | null:49157")
```

![lycheejs-harvester](./01-server/asset/bootup.png)

You can stop the lychee.js Harvester by pressing `[Ctrl] + [C]`
in the Terminal window.


## Definition Requirements

The Boilerplate already has an integrated `app.net.Server`
Definition which is easily extendable with further network
services.

The `HEADER` section of the `source/net/Server.js` file shows
that the server has both requirements and inclusions that the
Definition inherits from:

```javascript
lychee.define('app.net.Server').requires([
	'app.net.remote.Ping'
]).includes([
	'lychee.net.Server'
]) // ...
```

The Definition `app.net.Server` requires the `app.net.remote.Ping`
service that is a dummy service helping measure latencies in
our network.

Each Definition has an `exports()` call with the so-called `BODY`
section of a Definition file. This section contains and returns
the actual Implementation of your Definition.

The lychee.js [CODESTYLE Guide](https://github.com/Artificial-Engineering/lychee.js/blob/master/guides/CODESTYLE.md#definition-layout)
explains more in detail how the Definition Implementation is
structured.


## Clients and Remotes

Clients and Remotes both share the same `lychee.net.Tunnel`
interface, so they can be replaced in our peer-based network.

That means that depending on several network factors Clients
and Servers switch their role in a network to optimize the
data flow and reduce latency.

The `lychee.net.Tunnel` has an `addService()` method that accepts a
`lychee.net.Service` instance. In our case the `remote` currently
only has the `app.net.remote.Ping` service, but it will now be
extended with a custom network service.


## Create the Network Service

The `app.net.remote.Chat` service we are going to build will
inherit from the `lychee.net.remote.Chat` Composite, because
it is a very easy-to-use service.

The service will have the unique identifier `chat`, so that
we can easily identify it in the `Networks Tab` of our Dev Tools
in the Browser.

Create the `source/net/remote/Chat.js` file with the following
content:

```javascript
lychee.define('app.net.remote.Chat').includes([
	'lychee.net.remote.Chat'
]).exports(function(lychee, global, attachments) {

	const _Chat = lychee.import('lychee.net.remote.Chat');


	/*
	 * IMPLEMENTATION
	 */

	const Composite = function(remote) {

		_Chat.call(this, 'chat', remote, {
			limit: 1337 // allow 1337 users
		});

	};


	Composite.prototype = {
		
	};


	return Composite;

});
```


## Integrate the Network Service

Now that the `app.net.remote.Chat` service is ready
for use, it is possible to integrate it with the
`source/net/Server.js` Definition.

**Connect/Disconnect Basics**

As the whole lychee.js Network stack is built for
peer-to-peer usage, all clients and remotes can be
connected and disconnected at anytime.

So it is important to have that in mind when using
network services and integrating them.

The `lychee.net.Server` has a `connect` and `disconnect`
event that offers an easy integration on a per-remote
basis:

```javascript
let server = new lychee.net.Server({
	host: null,
	port: 1337
});

server.bind('connect', function(remote) {
	console.log('REMOTE ' + remote.id + ' CONNECTED');
});

server.bind('disconnect', function(remote) {
	console.log('REMOTE ' + remote.id + ' DISCONNECTED');
});
```

When we add and remove services, we have to keep in mind
that they are on a per-remote basis. That means we should
also cleanup and remove the service once the client or
remote was disconnected.

```javascript
let service = new _Chat({ room: 'hello-world' });

server.bind('connect', function(remote) {
	remote.addService(service);
});

server.bind('disconnect', function(remote) {
	remote.removeService(service);
	// alternative: remote.removeServices();
});
```


**Add a Service to the Server**

The following challenges are now for you to solve inside
the `source/net/Server.js` file:

1. Add the `app.net.remote.Chat` to the requirements.
2. Import the `app.net.remote.Chat` to `_Chat` constant.
3. Add `new _Chat(remote)` service to the server's `connect` event.

Remember, you can always use `git diff` to see your progress
compared on what should be done:

```bash
# I am unsure why it doesnt work
export TUTORIAL=/path/to/lycheejs-guide/tutorial;


cd /opt/lycheejs/projects/tutorial;

git diff $TUTORIAL/01-server/source/net/Server.js ./source/net/Server.js;
```


## Manage the Project

Every time you make a change to the `app.net.Server`
you can restart it in order to see the changes
immediately (and/or debug errors).

The lychee.js Engine stack is completely compatible
with the [node-inspector](https://github.com/node-inspector/node-inspector)
project.


Restart the Project Server with the `lycheejs-helper`:

```bash
cd /opt/lycheejs;

lycheejs-helper stop /projects/tutorial;
lycheejs-helper start /projects/tutorial;
```

The output of the above commands should look like this:

```bash
lycheejs-helper stop /projects/tutorial;

{"message":"Server stopped (\"/projects/tutorial\")","blob":null}

lycheejs-helper start /projects/tutorial;

{"message":"Server started (\"/projects/tutorial\")","blob":null}
```

