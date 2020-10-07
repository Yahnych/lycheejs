
# Feature Detection

The lychee.js Definitions allow to have feature detection
capabilities which are analysed at runtime and can be
injected at runtime.


## Sandboxes

## Basic Concept

Any Definition is cross-platform and cross-portable. That
means every Definition is loaded and evaluated based on
the current `lychee.environment`'s settings and tags.

Any environment can be built and simulated in any runtime,
so each Definition has to define its own requirements.

If the Definition is a non-generic Definition, it has to
fullfill the `supports()` and `tags()` API in order to be
mapped correctly by the environment.


## Definition Tags

Each Definition can have multiple tags, where tags in
combination represent the featureset that the final
lychee.js Library or Project wants to deliver. By default,
the [Environments](./Environments.md) and [Fertilizers](./Fertilizers.md)
are only respecting the `platform` tag.

All tags can inherit featuresets from other tags
automatically by using a `-` divider, for example
the `html-nwjs` tag is incrementelly inheriting
from the `html` tag.

That allows to arrange tags and features without
the duplication of tag-specific adapters.

Custom tags are freely nameable, but it is
recommended to not name it `platform`, as this
would require to have multiple adapters for
multiple runtimes and would require additions to
the Fertilizer source code. You could do that, but
it is not recommended as it requires mentioned
additional code.


## Basic Example

This is a basic example for a custom `app.Renderer`
using a platform-specific canvas API that is not
available on other platforms than `html`.


```javascript
lychee.define('app.Renderer').tags({
	platform: 'html'
}).includes([
	'lychee.Renderer'
]).supports(function(lychee, global) {

	// XXX: typeof CanvasRenderingContext is
	// > object in Safari
	// > function everywhere else

	if (
		typeof global.document !== 'undefined'
		&& typeof global.document.createElement === 'function'
		&& typeof global.CanvasRenderingContext2D !== 'undefined'
	) {

		return true;

	}


	return false;

}).exports(function(lychee, global, attachments) {

	const _document = global.document;
	const _Renderer = lychee.import('lychee.Renderer');



	/*
	 * IMPLEMENTATION
	 */

	const Composite = function(data) {

		let states = Object.assign({}, data);


		this.__canvas  = _document.createElement('canvas');
		this.__context = this.__canvas.getContext('2d');


		_Renderer.call(this, states);

		states = null;

	};


	Composite.prototype = {

	};


	return Composite;

});
```



## Package Integration

All `lychee.pkg` files have a `source/tags/<tag>/<value>`
map where the `tag` for the above Definition is `platform`
and the `value` is `html`.

The equivalent file path is `platform/html`, which means
that there are multiple `app.Renderer` Definitions available
inside the `./projects/example/source/platform/*/` folders.

Here's an example `lychee.pkg` file that contains the above
example, offering an alternative Renderer for the `node`
platform tag.

```json
{
	"build": {},
	"source": {
		"environments": {},
		"tags": {
			"platform": {
				"html": "platform/html",
				"node": "platform/node"
			}
		},
		"files": {
			"platform": {
				"html": {
					"Renderer": [ "js" ]
				},
				"node": {
					"Renderer": [ "js" ]
				}
			}
		}
	}
}
```

