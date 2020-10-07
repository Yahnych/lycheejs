
# Package Format

The lychee.js Engine has a unique Package Format that
allows the integration of all Software Bots, automatic
build pipelines and smart IDE integrations.

Each project and each library has a single `lychee.pkg`
file in its root folder. This is a JSON file that is
automatically generated, configured and integrated by
the [lychee.js Harvester](../software-bots/lycheejs-harvester.md).


## Package Structure

Each top-level identifier of the Package Structure
reflects the same top-level subfolders of the Project.

That means e.g. all files and their contents in the `/source`
folder are reflected in `lychee.pkg/source/files`.

```javascript
{
	"bin": {                // Binaries (scripts) for Software Bot integration
		"files": {}
	},
	"api": {                // Generated API Knowledge
		"files": {}
	},
	"asset": {              // External RAW assets
		"files": {}
	},
	"build": {              // Production (build) variants of the Project or Library
		"environments": {},
		"files": {}
	},
	"review": {             // Simulation (review) variants of the Project or Library
		"environments": {},
		"files": {}
	},
	"source": {             // Development (source) variants of the Project or Library
		"environments": {},
		"files": {},
		"tags": {}
	}
}
```


## Package Environments (/environments)

The `environments/<identifier>` Map represents all
environments that are automatically fertilized by the
[lychee.js Fertilizer](../software-bots/lycheejs-fertilizer.md).

All entries consist of a `settings` Object that is
directly passed to the `new lychee.Environment(settings)`
instance where the `profile` is the parameter that is
passed to the `new <target>(<profile>)` constructor
call.

It is recommended that all platform-specific build
identifiers follow the name scheme `platform/<target>`
to allow further automation.

Everything that runs on a client-side can be simulated
both on client-side and server-side, so remember that
by default all projects are simulated across all platforms
supported by lychee.js.

This example creates an `application` build of the
`app.Main` build target that is automatically packaged
with the `html-nwjs` runtime:

```javascript
{
	"build": {
		"environments": {
			"html-nwjs/main": {
				"debug": false,
				"packages": {
					"app": "./lychee.pkg"
				},
				"sandbox": false,
				"tags": {
					"platform": [
						"html-nwjs",
						"html"
					]
				},
				"target": "app.Main",
				"variant": "application",
				"profile": {
					"client": "/api/server/connect?identifier=/projects/boilerplate"
				}
			}
		}
	}
}
```


## Package Files (/files)

The `files` Map represents all files of the Project
or Library.

As every `lychee.Definition` can have multiple
`attachments`, an `Array` represents a single
`Definition` while an `Object` represents a (Sub-)
Folder.

Every `Definition` entry is also mapped via `/tags`
depending on their platform (fertilizer) support
that is done via [Feature Detection](../engine-concept/Feature-Detection.md).

All files are automatically tracked, updated and
injected across all server-connected application
instances by the [lychee.js Harvester](../software-bots/lycheejs-harvester.md)
so it's basically never necessary to touch this
section by hand.

The only valid exception to modify the `/files`
section of any lychee.js Project is when adding
new files into the lychee.js Core (in
`/libraries/lychee/source/core`) as that results
in a `chicken/egg` problem for the build toolchain.

This example has three definitions, `app.Main`,
`app.Renderer` and `app.entity.Custom`. The example
is assuming that the `app.Renderer` overrides the
`lychee.Renderer` and is platform-specific, in this
case for the `html` platform.

```javascript
{
	"source": {
		"tags": {
			"platform": {
				"html": "platform/html"
			}
		}
	},
	"files": {
		"Main": [
			"js"
		],
		"entity": {
			"Custom": [    // "app.entity.Custom" or "/source/entity/Custom"
				"js",
				"fnt",     // (Font) attachments["fnt"]
				"png",     // (Texture) attachments["png"]
				"snd.mp3", // (Sound) attachments["snd"]
				"snd.ogg"
			]
		},
		"platform": {
			"html": {
				"Renderer": [ // "app.Renderer" or "/source/platform/html/Renderer"
					"js"
				]
			}
		}
	}
}
```


## Package Tags (/tags)

The `tags` Map represent all platform-specific
implementations that will only work for a single
platform.

Therefore they allow to have multiple implementations
of the same API (or Definition) in parallel; which
allows to have e.g. a `Renderer` for the `html` or `node`
platform - or event to have a different `Renderer` for
the `html-webgl` platform that will improve rendering
performance compared to the `html` platform's `Renderer`.

The Factory Pattern is not used in the lychee.js
Engine and it is highly recommended not to use
it as it introduces glue code that is not
understandable by a time-sensitive AI.

Every tag of every Definition is incremental,
meaning that a dash (`-`) represents that the tag
inherits from its main derivate.

This allows to write small patched Definitions that
only slightly change from their main derivates. For
example, the platform `html-nwjs` uses all Definitions
in `html`, but incrementally replaces them with their
own ones (e.g. the `lychee.Stash` or `lychee.Storage`).

This example here is a quote of the `lychee` Library
and represent all (currently) supported platform tags.

Remember that every `tagged` Definition should have a
`supports()` block that allows [Feature Detection](../engine-concept/Feature-Detection.md).

```javascript
{
	"source": {
		"tags": {
			"platform": {
				"html": "platform/html",
				"html-nwjs": "platform/html-nwjs",
				"html-webview": "platform/html-webview",
				"nidium": "platform/nidium",
				"node": "platform/node",
				"node-sdl": "platform/node-sdl"
			}
		}
	}
}
```

