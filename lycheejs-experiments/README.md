
# lychee.js Experiments

This repository contains highly experimental Experiments and Prototypes
that are not meant for the public and are excluded from the AI-related
`Environment` or `Simulation` stack on purpose.

Yet it is open sourced, so people can try to learn from the sandboxing
concepts and/or prototyping capabilities of the lychee.js Engine

Some experiments might require external dependencies for successful
verifications and/or compatibility checks with reference implementations.
These dependencies are tracked in the [package.json](./package.json)
and require `npm` (and therefore the `node` runtime) installed.

## Installation

```bash
# core must be available
cd /opt/lycheejs;
./bin/configure.sh --core;

# install experiments
cd /opt/lycheejs/projects/lycheejs-experiments;

# install dependencies
npm install;
```

## Usage

All experiments can be executed using the `lycheejs-helper` and its
`env:<platform>` syntax:

```bash
cd /opt/lycheejs/experiments;

lycheejs-helper env:node lychee/codec/BENCODE.js;

lycheejs-helper env:node lychee/net/Server-ws.js;
lycheejs-helper env:html lychee/net/Client-ws.html;
```

## License

Released under WTFPL without any warranty.

## TODO

[crux](/crux) experiments:

- [ ] `lychee`
- [x] `Asset`
- [ ] `Debugger`
- [x] `Definition`
- [ ] `Environment`
- [x] `Package`
- [ ] `Simulation`
- [ ] `Specification`

[lychee](/lychee) experiments:

- [ ] `ai`
- [ ] `app`
- [x] `codec`
- [x] `crypto`
- [ ] `data`
- [ ] `effect`
- [x] `event`
- [ ] `math`
- [x] `net`
- [ ] `policy`
- [ ] `ui`
- [ ] `verlet`

