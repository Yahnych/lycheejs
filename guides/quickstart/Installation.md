
# Installation

The lychee.js Engine is distributed via 3 different channels:

- `lychee.js Library` which is a prototyping library for use with other tech stacks.
- `lychee.js Engine` which is an isomorphic engine and contains AI automation, all tools and software bots.



## lychee.js Library Installation (not recommended)

The lychee.js Library is a self-hosted library that is not integrated
with the software bots and not integrated with the lychee.js Engine.

It exists for the purpose of reusing your lychee.js Projects and
Libraries in other Projects (like in an HTML5 App or a Node.js Server).

The [README](https://github.com/Artificial-Engineering/lycheejs-library/blob/master/README.md)
of the lychee.js Library repository contains detailed usage instructions.

The recommended, failsafe way is to use our lychee.js Engine
Net Installer.

## lychee.js Engine Installation (recommended)

The lychee.js Engine is a self-hosted engine and development environment
that includes all necessary runtimes, binaries and external SDKs that
you need for further cross-compilation or deployment to its supported
target platforms and architectures.

The Net Installer shell script allows to automatically install the
lychee.js Engine on any UNIX-compatible machine (`armhf`, `x86` or
`x86_64`). The only preinstalled requirements beforehand are `bash`,
`curl` and `git`.

```bash
# This will install lycheejs into /opt/lycheejs

sudo bash -c "$(curl -fsSL https://lychee.js.org/install.sh)";
```

![Quickstart CLI Animation](/guides/asset/quickstart.svg)

In detail, the [do-netinstall.sh](/bin/maintenance/do-netinstall.sh) will do these steps:

1. Clone the [lycheejs](https://github.com/Artificial-Engineering/lycheejs) repo into `/opt/lycheejs`.
2. Execute the [/bin/maintenance/do-install.sh](/bin/maintenance/do-install.sh) script.
3. Execute the [/bin/maintenance/do-update.sh](/bin/maintenance/do-update.sh) script.
4. Execute the [/bin/configure.sh](/bin/configure.sh) script.

## Configuration and Bootup

The [/bin/configure.sh](/bin/configure.sh) script will
automatically build the [lychee.js Crux](/libraries/crux)
Library and distribute and learn the [lychee.js Engine](/libraries/lychee)
Library, so that every Project is ready to go.

Whenever something changes in `/libraries/crux`, the
`/bin/configure.sh` script has to be executed again.

```bash
cd /opt/lycheejs;

# Build lychee.js Crux and lychee.js Engine
./bin/configure.sh;
```

Afterwards, all the lychee.js Software Bots can be used.

The best thing to do is to start the [lychee.js Harvester](/guides/software/lycheejs-harvester.md)
and to play around with the Projects served at `http://localhost:8080`.

```bash
cd /opt/lycheejs;

# Boot lychee.js Harvester
lycheejs-harvester start development;

# Open Web Browser
lycheejs-helper web http://localhost:8080;
```

## Optional Dependencies

The lychee.js Engine optionally requires `OpenJDK 8` or later
in order to ship to mobile platforms such as `Android`.

If it is installed on the host machine already, the `JAVA_HOME`
environment variable has to be set in order to use it:

```bash
# On GNU/Debian
export JAVA_HOME="/usr/lib/jvm/java-8-openjdk-amd64";

# On Arch Linux
export JAVA_HOME="/usr/lib/jvm/java-8-openjdk";

# On MacOS
export JAVA_HOME=$(/usr/libexec/java_home);


# Afterwards ...
cd /opt/lycheejs;
lycheejs-fertilizer fertilizer /projects/boilerplate html-webview/main;
```

