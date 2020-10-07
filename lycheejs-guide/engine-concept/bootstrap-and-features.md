
# Platform Bootstrap and Platform Features

In the lychee.js Engine stack, every new `platform` tag
will imply a separate `bootstrap.js` and a separate
`features.js` file inside the `/libraries/lychee/source/platform/<tag>`
folder.

These two files are the integration part that allow
the lychee.js Engine to rely on low-level mechanisms, so
that e.g. executed ECMAScript code always works the same
or e.g. loading of Textures always works the same - without
having to bother to rewrite the Library- or Project-specific
code every time you want to support a new platform.


## bootstrap.js

The `bootstrap.js` is injected directly after the lychee.js
Core in the `./bin/configure.js` file. It will polyfill
all necessary Asset data types, and will integrate them
with the loading mechanisms of the platform or the
filesystem.

The polyfilled Asset data types are:

- `new Buffer()` is a generic low-level Buffer for encoding/decoding blobs
- `new Config(url)` is used for `json`, `pkg` and `store`
- `new Font(url)` is used for `fnt`
- `new Music(url)` is used for `msc.mp3` and `msc.ogg`
- `new Sound(url)` is used for `snd.mp3` and `snd.ogg`
- `new Texture(url)` is used for `png`
- `new Stuff(url)` is used for everything else

Additionally, path resolution is also polyfilled - as
every platform may require a different type of URL scheme
in order to work properly.

Some examples are the differences between the
`chrome-extension://` protocol and the `http://` protocol
or even the `file://` protocol.

In any case, the `lychee.Environment.prototype.resolve(url)`
is overridden and allows to have the same path scheme across
all platforms.

This path resolving mechanism is dependent on two different
constants, which may be modified at any time:

- `lychee.ROOT.lychee` which represents the lychee.js root folder (e.g. `/opt/lycheejs` or `/tmp/lycheejs`)
- `lychee.ROOT.project` which represents the current runtime's working directory or the lychee.js Project's folder (e.g. `/projects/boilerplate`)


## features.js

The `features.js` is injected directly after the `bootstrap.js`
in the `./bin/configure.js` file. It will setup all
necessary properties, methods, and return values to
allow [Feature Detection](./Feature-Detection.md) and
[Feature Prediction](./Feature-Prediction.md) on any
platform.

The structure of the `lychee.FEATURES[platform]` object
is dependent on the currently executed (or simulated)
environment.

For example, for the `node` platform it might have a
`lychee.FEATURES['node'].require = function() {}` while
for the `html` platform it might have a
`lychee.FEATURES['html'].CanvasRenderingContext2D = function() {}`
property.

