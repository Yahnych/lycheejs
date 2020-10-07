
# Troubleshooting

This guide is dedicated to commonly known errors and mistakes
that did lead to situations that may be hard to figure out
for an untrained eye.


## Installation Problems

**BSD**

FreeBSD, OpenBSD and CentOS may in some circumstances require
a better integration with their package managers. Currently we
have no idea on how to achieve that failsafe.

If an error happens on your BSD installation, please let us
know in the [Issues](https://github.com/Artificial-Engineering/lycheejs/issues)
of the upstream lychee.js Engine project.


**GNU/Linux**

It is confirmed that Arch Linux, Debian, Ubuntu, Fedora,
Linux Mint, Red Hat and openSUSE are working by using the
netinstaller from the [Install](https://lychee.js.org/#!install)
page.

If we haven't integrated your package manager yet, please let us
know in the [Issues](https://github.com/Artificial-Engineering/lycheejs/issues)
of the upstream lychee.js Engine project.


**Mac OSX**

Mac OSX (El Capitan and Sierra) is known to work with the
netinstaller from the [Install](https://lychee.js.org/#!install)
page.

The requirements beforehand is to have a working [brew](http://brew.sh)
or (not recommended) [macports](https://macports.org)
installation. We heavily recommend using brew over macports
as it's way more up-to-date and has a bigger superset of
available packages.


**Windows**

Windows as a development machine is currently not supported.

We currently require a fully working GNU environment with proper bash and
all required GNU utilities for proper cross-packaging and cross-compilation.

The `lycheejs://` URL wrapper is necessary to have full unlimited
no-CORS-or-Firewall-blocked access for POST and GET requests to a webserver
running on `localhost:4848` which is our local management port.

The so-called Ephermal Ports ( `49152` to `65534` ) have to be available
in order to have a working peer-to-peer TCP or WebSocket environment.

As of now (2017 Q4) this is pretty much close to impossible to achieve with
Windows. If you can prove us wrong, feel free to give us hints in the
[Issues](https://github.com/Artificial-Engineering/lycheejs/issues) of the
upstream lychee.js Engine project.

However, the `lycheejs-fertilizer` can also compile Apps to Windows as a
target platform.


## Bootup Problems

Here's a list of common problems that may happen if something went wrong.

Please make sure that you followed the Installation instructions in the [README.md](https://github.com/Artificial-Engineering/lycheejs/#quickstart)
correctly.

- Current shell is not a `bash` compatible shell.
- Did not install all dependencies via `sudo ./bin/maintenance/do-install.sh`
- Did not compile the `lychee.js Core` via `./bin/configure.sh`.
- Port `4848` is blocked (localhost-only TCP/HTTP management port).
- Port `8080` is blocked (localhost-only TCP/HTTP serve port).
- Forgot to modify the profile in `./bin/harvester/<profile>.json`.


## Reinstallation

If you have made no important uncommited changes in the `/opt/lycheejs/projects`
or `/opt/lycheejs/libraries` folder, you can always achieve a completely
wiped-as-new installation by using the Net Installer again.

Please remember to backup your project and library folders before to avoid data loss.

