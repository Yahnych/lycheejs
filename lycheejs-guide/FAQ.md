
# Frequently Asked Questions


## How to install lychee.js?

Read the [Quickstart / Installation](./quickstart/Installation.md) section.
Everything is explained there.

It is recommended to use the `Net Installer` to
prevent user- or system-specific errors.


## How to uninstall lychee.js?

If you have (had) a lychee.js Engine installation,
you can uninstall it using the `do-uninstall.sh`
script.

Otherwise, just remove the `lycheejs` package and
remove the `/opt/lycheejs` folder. That's it.

```bash
cd /;
sudo /opt/lycheejs/bin/maintenance/do-uninstall.sh;
sudo rm -rf /opt/lycheejs;
```


## No Windows support?

Yes, we have no Windows support for a development
machine. Our hardcore AI and cross-compiler shit
is not even remotely automate-able on a Windows
platform.

If you want to still give Windows some love,
you are invited to use the [Dockerfile](https://github.com/Artificial-Engineering/lycheejs-bundle/blob/master/bin/package/docker/Dockerfile)
or the [Windows Subsystem for Linux](https://msdn.microsoft.com/de-de/commandline/wsl/install_guide).

However, we very much recommend to just buy a little
Raspberry Pi and install lychee.js there. Much easier
and done within less 10 minutes if you got one laying
around.


## Help! It does not work?

Please follow the steps `1:1` of the [Quickstart / Installation](./quickstart/Installation.md) section.

If it is confusing or you cannot understand what to do,
please be calm and open up an [Issue](https://github.com/Artificial-Engineering/lycheejs)
in the lychee.js Project itself.

