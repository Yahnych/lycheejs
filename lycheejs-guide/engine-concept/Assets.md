
# Assets

The lychee.js Asset Format is a format that works cross-platform
and is defined in the lychee.js bootstrap file. It consists of APIs
that are integrated with each platform (fertilizer).

The core lychee.js Assets are defined as follows:

- `new Buffer()` is a generic low-level Buffer for encoding/decoding blobs
- `new Config(url)` is used for `json`, `pkg` and `store`
- `new Font(url)` is used for `fnt`
- `new Music(url)` is used for `msc.mp3` and `msc.ogg`
- `new Sound(url)` is used for `snd.mp3` and `snd.ogg`
- `new Texture(url)` is used for `png`
- `new Stuff(url)` is used for everything else


## Serialization

Each Asset is automatically cached and intelligently cloned behind the
scenes via its `url` property. If multiple instances of the same Asset
type are loaded for the same `url`, it will be reused and will save
loading time.

All Assets are serializable and have a `serialize()` and `deserialize(blob)`
method. That means all `attachments` of [Definitions](./Definitions.md)
are serializable and reusable in sandboxed [Environments](./Environments.md).

Each serialized Asset has a `buffer` property that represents the contents
depending on the specific platform. For example, the `buffer` of a `Texture`
instance on the `html` platform is an `Image` instance, whilst it is a `Buffer`
instance on the `node` platform.

However, each serialized Asset has a `base64` encoded representation that
can be used across all platforms. It is possible to share Assets across
different peers in the network, server- and client-side by simple transferring
the `Serialization Object` returned by its `serialize()` method. A simple
`lychee.deserialize(data)` call on the other side will completely deserialize
the Asset and recreate an identical instance on the other side.


## Basic Example

The `lychee.Asset` Callback helps to create instances of Assets. Whenever
a new Asset type is associated for a file extension, this helper will use
the new Asset constructor automatically behind the scenes.

```javascript
let asset_a = new lychee.Asset('/path/to/texture.png');
let asset_b = new Texture('/path/to/texture.png');

asset_a instanceof Texture;  // true
asset_b instanceof Texture;  // true
asset_a.url === asset_b.url; // true

asset_a === asset_b;         // false, asset_b is a clone of asset_a
asset_a.serialize();         // { "constructor": "Texture", "blob": { "buffer": "data:image/png;base64,..." }}


let asset_c = lychee.deserialize(asset_a.serialize());

asset_c instanceof Texture;  // true
asset_c.url === asset_a.url; // true
asset_c === asset_a;         // false, asset_c is a clone of asset_a
```

