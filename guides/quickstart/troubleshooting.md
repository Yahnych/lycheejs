
# Troubleshooting

This guide is dedicated to commonly known errors and mistakes
that did lead to situations that may be hard to figure out
for an untrained eye.


## Installation Problems

### BSD

FreeBSD, OpenBSD and CentOS may in some circumstances require
a better integration with their package managers. Currently we
have no idea on how to achieve that failsafe.

Please note that as of now, all BSD-based systems have to have
[Linux Binary Compatibility](https://www.freebsd.org/doc/handbook/linuxemu-lbc-install.html)
activated.

```bash
sudo kldload "linux64";
sudo pkg install "emulators/linux_base-c6";

sudo echo 'linux_enable="YES"' >> /etc/rc.conf;
```

If an error happens on your BSD installation, please let us
know in the [Issues](https://github.com/Artificial-Engineering/lycheejs/issues)
of the upstream lychee.js Engine project.

### GNU/Linux

It is confirmed that Arch Linux, Debian, Ubuntu, Fedora,
Linux Mint, Red Hat and openSUSE are working by using the
[do-netinstall.sh](/bin/maintenance/do-netinstall.sh) which
is also available on the website via [lychee.js.org/install.sh](https://lychee.js.org/install.sh).

The installation process requires either of the following
package managers installed beforehand:
`pacman`, `apk`, `apt-get`, `dnf`, `yum`, `zypper` or `apt`.

If we haven't integrated your package manager yet, please let us
know in the [Issues](https://github.com/Artificial-Engineering/lycheejs/issues)
of the upstream lychee.js Engine project.

### MacOS

MacOS (El Capitan, Sierra, High Sierra or later) is known to work
with the [do-netinstall.sh](/bin/maintenance/do-netinstall.sh) which
is also available on the website via [lychee.js.org/install.sh](https://lychee.js.org/install.sh).

Before executing the `do-netinstall.s`, make sure that the [brew](https://brew.sh)
package manager is installed on the system.

A fallback exists for [macports](https://macports.org) as well, but
macports is heavily outdated and unreliable in the provided packages
it offers.

### Windows

Windows as a development machine is currently not officially supported.

We currently require a fully working GNU environment with proper bash and
all required GNU utilities for proper cross-packaging and cross-compilation.

The `lycheejs://` URL wrapper is necessary to have full unlimited
no-CORS-or-Firewall-blocked access for POST and GET requests to a webserver
running on `localhost:4848` which is our local management port.

The so-called Ephermal Ports ( `49152` to `65534` ) have to be available
in order to have a working peer-to-peer TCP or WebSocket environment.

As of now the only way to get this to run is by using the so-called
[Windows Subsystem for Linux](https://docs.microsoft.com/en-us/windows/wsl/install-win10)
on an up-to-date Windows 10 machine. Don't forget to install a Linux
distribution from the `Microsoft Store` afterwards.

However, the [lychee.js Fertilizer](../software/lycheejs-fertilizer.md)
can also compile Projects and Libraries to Windows as a target platform.

## Bootup Problems

Here's a list of common problems that may happen if something went wrong.

Please make sure that you followed the Installation instructions in the
[README.md](/README.md) correctly.

- Current shell is not a `bash` compatible shell.
- Did not install all dependencies via `sudo ./bin/maintenance/do-install.sh`
- Did not compile the `lychee.js Core` via `./bin/configure.sh`.
- Port `4848` is blocked (localhost-only TCP/HTTP management port).
- Port `8080` is blocked (localhost-only TCP/HTTP serve port).
- Forgot to modify the profile in `./bin/harvester/<profile>.json`.

## Reinstallation

If you have made no important uncommited changes in the `/opt/lycheejs/projects`
or `/opt/lycheejs/libraries` folder, you can always achieve a completely
wiped-as-in-factory-reset lychee.js Engine Installation by using the
[do-netinstall.sh](/bin/maintenance/do-netinstall.sh) again.

Please remember to backup your Libraries and Projects before to prevent
unwanted loss of data.

