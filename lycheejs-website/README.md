
# lychee.js Website


## Overview

This website is a project made with [lychee.js](https://lychee.js.org).

It is automatically built and deployed to GitHub using the following
`lycheejs-fertilizer` integration scripts:

- `bin/build.sh` builds the website and copies asset and download folders



## IMPORTANT: Structure

The `./build` folder is a `git repository` containing the `gh-pages` branch!
Be careful with your branches when something went wrong.

The `master` branch (which is NOT the default branch of the repository)
contains all assets and source files. The `build` folder is only temporarily
this same `git repository` with the `gh-pages` branch to deploy the website to
GitHub.

If you work on this project, always work on the `master` branch!



## Installation and Build Process

The build process is integrated with the `lycheejs-fertilizer` toolchain.
These are the steps to get everything to run and build properly:

Local development requires zero overhead, just start the `lycheejs-harvester`
and use the existing toolchain.

```bash
cd /opt/lycheejs;

# Move the lycheejs-website repository to /opt/lycheejs/projects/lycheejs-website

# This will build and deploy the website automatically
lycheejs-fertilizer html/main /projects/lycheejs-website;
```

