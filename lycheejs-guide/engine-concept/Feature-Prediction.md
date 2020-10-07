
# Feature Prediction

The lychee.js Feature Detection system has the advantage
that every [Environment](./engine-concept/Environments.md)
can be sandboxed and reproduced in an identical manner
on every platform or in any runtime.

In order to achieve this, there's the so-called `lychee.FEATURES`
constant that represents each platform and its features and
simulates their behaviour, so that the `supports(lychee, global)`
callback for each Definition can use a sandboxed global.

This sandboxed global is essentially an ES6 `Proxy` that allows
the `lychee.Environment` instance to trace down which properties,
which methods and which return values are expected for the
target platform; even if the target platform is currently
not supported.

An example use case for this is the [lychee.js Fertilizer](../software-bots/lycheejs-fertilizer.md)
as the Project itself can only run on the `node` platform, but
is using this mechanism to build a sandboxed `lychee.Environment`
for the target platform, which can be e.g. `html`.

The huge advantage here is that lychee.js Projects or Libraries
can build themselves (that is essentially what the `./bin/configure.sh`
script does) without an external already-boostrapped compiler.

Remember: Each Environment can be sandboxed and exported, and
as each Definition can run anywhere, there's no limit in where
your code in the implementation can actually run.


## Supporting unexisting platforms

If you encounter a new platform that is currently unsupported,
you can freely modify the `lychee.FEATURES[<platform>]` object
to tell the lychee.Environment what `global` features are expected
to exist in order to support this platform.

An example code for the initialization code might look like this:


```javascript
lychee.pkg('build', 'html-electron/main', function(environment, profile) {

	// XXX: html-electron automatically
	// inherits features of html

	lychee.FEATURES['html-electron'] = {
		location: {
			hash: '#example-hash'
		},
		onhashchange: function() {}
	};

	lychee.init(environment, {
		debug:   false,
		sandbox: false,
		profile: profile
	});

});
```

Again, remember, the above code is not `html` platform-specific,
as above code would work perfectly fine inside a `node` runtime.

That's what sandboxing and feature detection is for: Allowing
to simulate environments wherever possible.

