
# lychee.js Mono Repository


Important Notes to follow through Installation Quirks:

The [lycheejs-engine](./lycheejs-engine) Repository needs to be installed to the path `/opt/lycheejs`.
Every other project has to be placed inside `/opt/lycheejs/projects/*`.

The [lycheejs-runtime](./lycheejs-runtime) Repository contains all building logic that is required in
order to compile, build, transpile and port lychee.js Projects to other platforms and runtimes.

The binaries of the `lycheejs-runtime` Repository are contained in the `releases` section of this
repository, and the `lycheejs-runtimes.zip` folder reflects the contents of the `./lycheejs-engine/bin/runtime` folder.

