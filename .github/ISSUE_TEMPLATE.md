
## Checklist

This checklist makes sure that everything is up-to-date
and to avoid the little common mistakes that happen.

No worries, humans make mistakes. It's human.

- [ ] I have installed all dependencies for my Operating System.

```bash
cd /opt/lycheejs;

sudo ./bin/maintenance/do-install.sh;
```

- [ ] I am on the branch `development` and have updated lychee.js.

```bash
cd /opt/lycheejs;

# select "1) development" here
./bin/maintenance/do-update.sh;
```

- [ ] I have rebuilt lychee.js and started the lychee.js Harvester.

```bash
cd /opt/lycheejs;

./bin/configure.sh;

lycheejs-harvester start development.
```


# Type of Request

- [ ] This is a feature request.
- [ ] This is a problem report.


## Description of Problems

If this is a feature request, describe the
missing feature here. If this is a problem
report, try to describe what happened.

**What I expected to happen**:

Please let us know what you did and what you
expected to happen.

**What actually did happen**:

Please let us know what error happened and
try to explain how to reproduce this problem.
Any logs or screenshots might help us understand
more what the problem was.

Does it have a graphical user interface?
Upload the screenshot to [imgur](https://imgur.com).

![Link to screenshot](Enter the screenshot URL here)

Does it have a command-line interface?
Upload the log to [pastebin](https://pastebin.com).

![Link to pastebin](Enter the pastebin URL here)

Was it in the Browser or nw.js?
Do a `Right Click` > `Inspect Element` and do a
screenshot of the `Console` tab.

Upload the screenshot to [imgur](https://imgur.com).

![Link to imgur](Enter the imgur URL here)


## System / Libraries / Projects

Please replace these in order to let us know what
is broken. If you don't know what to enter in each
line, just replace the answer with an `-`.


- **Operating Systems**: `all` _or_ `Android`, `BBOS`, `iOS`, `FirefoxOS`, `Linux`, `Windows`, `OSX`
- **Platforms**: `all` _or_ `html`, `html-nwjs`, `html-webview`, `node`, `node-sdl`
- **Library/Project**: `/libraries/<identifier>` or `/project/<identifier>`

