
# lychee.js Helper

The `lycheejs-helper` is a low-level bash script
that integrates the typical POSIX environment with
the lychee.js World. It integrates many useful
features for both application interaction and
rapid prototyping.


## Usage (Actions)

The lychee.js Helper is a bash script, so the
`lycheejs-helper` command needs to be executed within
the Terminal (a bash session).

When given no arguments, the bash script will show
an overview and examples on specific use cases.

The typical use cases for the `lycheejs-helper` actions are:

- `lycheejs://` Protocol interaction
- `boot` and `unboot` for Harvester Interaction
- `start`, `stop`, `file` and `edit` for Project interaction
- `cmd`, `web` for CLI and Browser interaction

Note that all actions can be mapped in the `lycheejs://Action=Resource`
theme where `action` is the first parameter and `resource`
is the second parameter in below examples.

This allows projects of the `html` platform to interact
with the native operating system.


## Usage (Helpers)

The typical use cases for the `lycheejs-helper` helpers are:

- `env:<platform>` to execute code in a specific environment
- `which:<platform>` to return the runtime path for a specific environment
- `run:<identifier> <Library/Project>` to execute the build variant of a project in a specific environment

```bash
# Executes the node binary
lycheejs-helper env:node;

# Returns the node binary's path
lycheejs-helper which:node;
# /opt/lycheejs/bin/runtime/node/linux/x86\_64/node


# Run the html-nwjs/main build
lycheejs-fertilizer html-nwjs/main /projects/boilerplate;
lycheejs-helper run:html-nwjs/main /projects/boilerplate;
```

**Shebang Usage**

The `env:<platform>` feature has the identical behaviour
as GNU's `/bin/env` binary. It can be also used for quick
demos and prototypical development of experiments. You
don't necessarily need to have a full Project structure.


## Environment Interaction (`env:platform` and `which:platform`)

The lychee.js Helper can be used for Rapid Prototyping
purposes. It is possible to play around with an API
without having to have a lychee.js Project structure.

A single JS file can be directly executed in the target
environment using either a shebang (`#!/usr/bin/lycheejs-helper env:node`)
or the bash (`lycheejs-helper env:node file.js`).

```bash
# Reports the Path to a specific Runtime
lycheejs-helper which:node
# Example output: /opt/lycheejs/bin/runtime/node/linux/x86_64/node


# Starts the File in a specific Runtime
lycheejs-helper env:node /path/to/file.js
```


**node Fertilizer Example**

Here's the `node` Fertilizer example for a quick 'n dirty
`lychee.net.Server` instance that can be executed via
`./server.js` directly (due to the shebang) or via
`lycheejs-helper env:node ./server.js`.


```javascript
#!/usr/local/bin/lycheejs-helper env:node

require('/opt/lycheejs/libraries/lychee/build/node/core.js')(__dirname);
require('/opt/lycheejs/libraries/lychee/build/node/dist/index.js');

(function(lychee, global) {

	console.log(lychee.ROOT.lychee);
	console.log(lychee.ROOT.project);

	lychee.inject(lychee.ENVIRONMENTS['/libraries/lychee/dist']);
	lychee.environment.setDebug(true);

	setTimeout(function() {

		let _Server = lychee.import('lychee.net.Server');
		let _JSON   = lychee.import('lychee.codec.JSON');
		let server  = new _Server({
			codec: _JSON,
//			host:  'localhost',
			port:  1337,
			type:  _Server.TYPE.WS
		});

		server.bind('connect', (remote) => console.log('CONNECT', remote.host + ' : ' + remote.port));
		server.connect();

	}.bind(this), 200);

})(lychee, typeof global !== 'undefined' ? global : this);
```


**html Fertilizer Example**

Here's the `html` Fertilizer example for a quick 'n dirty
`lychee.net.Client` instance that can be executed via
`lycheejs-helper env:html ./client.html`.


```html
<script src="file:///opt/lycheejs/libraries/lychee/build/html/core.js"></script>
<script src="file:///opt/lycheejs/libraries/lychee/build/html/dist/index.js"></script>
<script>
(function(lychee, global) {

	console.log(lychee.ROOT.lychee);
	console.log(lychee.ROOT.project);

	lychee.inject(lychee.ENVIRONMENTS['/libraries/lychee/dist']);
	lychee.environment.setDebug(true);

	setTimeout(function() {

		let _Client = lychee.import('lychee.net.Client');
		let _JSON   = lychee.import('lychee.codec.JSON');
		let client  = new _Client({
			codec: _JSON,
			host:  'localhost',
			port:  1337,
			type:  _Client.TYPE.WS
		});

		client.bind('connect', _ => console.log('CLIENT CONNECTED'));
		client.connect();

	}.bind(this), 200);

})(lychee, typeof global !== 'undefined' ? global : this);
</script>
```


## Harvester Interaction (`boot`, `unboot`)

The lychee.js Helper can boot and unboot the lychee.js
Harvester with a given Profile. This comes in handy once
you develop graphical applications that need a running
lychee.js Harvester instance in the background.

```bash
# Boots the lychee.js Harvester
lycheejs-helper boot development;

# Unboots the lychee.js Harvester
lycheejs-helper unboot;
```


## Project Interaction (`start`, `stop`, `file`, `edit`)

The lychee.js Helper can interact with the lychee.js
Projects and Libraries.

```bash
# Stops the Project server
lycheejs-helper stop /projects/boilerplate;

# Starts the Project server
lycheejs-helper start /projects/boilerplate;

# Opens the File Manager of the OS
lycheejs-helper file /projects/boilerplate;

# Opens lychee.js Studio
lycheejs-helper edit /projects/boilerplate;
```


## Tool / Web Interaction (`cmd`, `web`)

The lychee.js Helper can interact with other
lycheejs tools that are installed on the system
and the Web Browser.


```bash
# Starts the lycheejs-ranger with a JSON file
lycheejs-helper "lycheejs://cmd=lycheejs-ranger?data="$(echo '{"foo":"bar"}' | base64);
lycheejs-helper cmd "lycheejs-ranger?data="$(echo '{"foo":"bar"}' | base64);

# Starts the Web Browser
lycheejs-helper lycheejs://web=https://lychee.js.org;
lycheejs-helper web https://lychee.js.org;
```

