
# lychee.js Library (2018-Q3)


## Overview

This is the lychee.js Isomorphic Library that can be used standalone in your existing projects.

The upstream project lychee.js is the `Isomorphic Engine`, this project is the
`Isomorphic Library` which lacks essential features such as the `lycheejs-*`
tools, integration with our Software Bots and the Artificial Intelligence.

This downstream project can be seen as a quick prototyping library for several
platforms - quick n' dirty style.



## NPM Usage

Install the lychee.js Library with the `lycheejs` package.

```bash
# node, node-sdl
npm install lycheejs;
```

Include custom lychee.js Definitions with the `lychee.assimilate(url)` method.
Reuse the lychee.js Definitions with the `lychee.import(identifier)` method.

These methods guarantee isomorphic behaviour across all platforms.

```javascript
const lychee = require('lycheejs')(__dirname);

lychee.init(null);
lychee.environment.init(function(sandbox) {

	let Renderer = lychee.import('lychee.Renderer');
	let renderer = new Renderer({
		width: 1024,
		height: 768
	});

});
```



## Bower Usage

Install the lychee.js Library with the `lycheejs` package.

```bash
# html, html-nwjs, html-webview
bower install lycheejs;
```

Include custom lychee.js Definitions with the `lychee.assimilate(url)` method.
Reuse the lychee.js Definitions with the `lychee.import(identifier)` method.

These methods guarantee isomorphic behaviour across all platforms.

```html
<script src="./bower_components/lycheejs/build/html/lychee.js"></script>
```

```javascript
const lychee = (window || global).lychee;

lychee.init(null);
lychee.environment.init(function(sandbox) {

	let Renderer = lychee.import('lychee.Renderer');
	let renderer = new Renderer({
		width: 1024,
		height: 768
	});

});
```


## License

The lychee.js Library is released under the [GNU GPL 3](./LICENSE_GPL3.txt) license.

