
# Installation

The lychee.js project is distributed via 3 different channels:

- Library (portable, for prototyping. The versatile swiss army lychee)
- Engine (real deal, with AI automation and whatnot. Runs on every platform)
- Bundles (prebuilt, for lazy sysadmins)



## lychee.js Library Installation

The lychee.js Library is a self-hosted library that is not integrated
with the software bots nor the lychee.js Engine itself.

It exists for the purpose of reusing your lychee.js Projects and
Libraries in other Projects (like in an HTML5 App or a Node.js Server).

If the lychee.js Library caught your interest;  Please read the
[README](https://github.com/Artificial-Engineering/lycheejs-library/blob/master/README.md)
of the lychee.js Library repository for instructions.

However, keep in mind that integration of the lychee.js tools are
pointless outside the lychee.js Engine world, so you have no
advantages of our software bots and neither an AI support for
most things.

The recommended, failsafe way is to use our lychee.js Engine
Net Installer.



**Installation using Bower**

```javascript
cd /path/to/your/project;

# This will install lychee.js to ./bower_components/lycheejs
bower install lycheejs;
```



**Installation using NPM**

```javascript
cd /path/to/your/project;

# This will install lychee.js to ./node_modules/lycheejs
npm install lycheejs;
```



## lychee.js Engine Installation (recommended)

All lychee.js Engine and Bundle installations include the git
repository, so that you can get updates anytime via
`git pull origin development` or by using the [Updates](./Updates.md)
helper that eases up the selection of the update channel.


The Net Installer shell script allows to automatically install
the lychee.js Engine on any UNIX-compatible machine (arm, x86 or
amd64). The only requirements beforehand are working `bash`,
`curl` and `git`.

```bash
# This will install lycheejs into /opt/lycheejs

sudo bash -c "$(curl -fsSL https://lychee.js.org/install.sh)";
```

The Net Installer will also execute the `./bin/maintenance/do-install.sh`
script and the `./bin/configure.sh` script, so you are directly
ready to go.



**1) Install Dependencies**

This is only required if you installed a Generic Bundle, but it
is not required if you used the Net Installer. However, it is
here for the sake of easier Debugging in worst-case scenarios.

The `./bin/maintenance/do-install.sh` script has to be executed
one time with `sudo` (not `su`). It will install all the
necessary packages and dependencies the lychee.js Engine will
require to function.

It will also provide all the `lycheejs-*` tools as symlinks in
`/usr/local/bin`.

```bash
cd /opt/lycheejs;

# GUI and CLI tools integration
sudo ./bin/maintenance/do-install.sh;
```



**2) Configuration and Bootup**

The `./bin/configure.sh` script will automatically build the
lychee.js Engine Core, so that every project is ready to go.
Whenever you change something in the `/libraries/lychee/core`
folder, you probably need to execute this script again.

After you've built the lychee.js Engine Core, you can start
using all the lychee.js tools right away. The first thing is
to start the `lycheejs-harvester`, so that you can play around
with the installed projects in your Blink-based Browser at
`http://localhost:8080`.

```bash
cd /opt/lycheejs;

# Build lychee.js Engine Core
./bin/configure.sh;

# Bootup lychee.js Harvester
lycheejs-harvester start development;
```

The `--sandbox` flag can be used with all lychee.js tools, so
they do not use any native tools outside the `/opt/lycheejs`
folder, which in return will use less resources and run better
on slower machines like a Raspberry Pi.

However, the sandbox flag disables all software bots like
auto-testing, auto-documentation, auto-fertilization and
auto-synchronization of all lychee.js Libraries and Projects.

The `--debug` flag can be used with all lychee.js tools, so
they will show you more advanced debugging logs and output
in case things go and didn't work as expected.

All lychee.js tools have bash autocomplete support by default,
so in case you're stuck you can always press `<Tab><Tab>` to
see the syntax and suggestions of the tool itself.



**3) Optional Dependencies**

The lychee.js Engine optionally requires `OpenJDK 8` in order
to ship to mobile platforms.

If you have it installed on your system, please make sure to
set the `JAVA_HOME` environment variable correctly:

```bash
# On GNU/Linux
export JAVA_HOME="/usr/lib/jvm/java-8-openjdk-amd64";

# On OSX
export JAVA_HOME=$(/usr/libexec/java_home);
```


## lychee.js Bundle Installation (not recommended)

The lychee.js Bundles are prebuilt bundles that include everything
you otherwise would have installed later in a lychee.js Engine setup.

Imagine them as ISO images that are ready to go. They are future-proof
and can be updated using the same [Updates](../Updates.md) procedure
as a lychee.js Engine installation.

You can download the lychee.js Bundles in the releases section of the
[lychee.js Bundle](https://github.com/Artificial-Engineering/lycheejs-bundle/releases)
repository.

If you want to rebuild them yourself for easier installation in your
own server cloud, you can easily generate them yourself. Please read
the [README](https://github.com/Artificial-Engineering/lycheejs-bundle/blob/master/README.md)
of the lychee.js Bundle repository for instructions.

The Generic Bundles work on all operating systems. The Generic Mini
Bundle has only `node` platform support, but will run on very low-powered
systems like a Raspberry Pi.

These are the necessary steps to install the `Generic Bundle` variants:

- Extract zip file to `/opt/lycheejs`.
- Execute `sudo ./bin/maintenance/do-install.sh`.
- Execute `sudo ./bin/configure.sh`.
- Follow the [Quickstart Instructions](https://github.com/Artificial-Engineering/lycheejs#quickstart).
