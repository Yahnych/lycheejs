
## Description of Changes

Please let us know here what you've worked on.

An issue beforehand might come in handy, so that everybody
can give and get feedback as early in the process as possible.


## System / Libraries / Projects

Please replace these in order to let us know what you've
worked on:

- **Operating Systems**: `all` _or_ `Android`, `BBOS`, `iOS`, `FirefoxOS`, `Linux`, `Windows`, `OSX`
- **Platforms**: `all` _or_ `html`, `html-nwjs`, `html-webview`, `node`, `node-sdl`
- **Library/Project**: `/libraries/<identifier>` or `/project/<identifier>`
- **Issue**: `#1337`


## Checklist before Merge

If you've worked on `/libraries/lychee`, the configure
script needs to run in order to rebuild the core.


Check these checkboxes and make sure your code runs through with these commands:


- [ ] The `./bin/configure.sh` script runs with no errors
- [ ] The `lycheejs-harvester start development` command runs with no errors
- [ ] _If project or library:_ The `lycheejs-strainer auto <identifier>` command runs with no errors
- [ ] _If project or library:_ The `lycheejs-fertilizer auto <identifier>` command runs with no errors
- [ ] The code style follows the [CODESTYLE guide](https://github.com/Artificial-Engineering/lycheejs/blob/development/guides/CODESTYLE.md)
- [ ] The commit messages follow the [CONTRIBUTION guide](https://github.com/Artificial-Engineering/lycheejs/blob/development/guides/CONTRIBUTION.md)
- [ ] The pull-request branch is not named `development`, `2XXX-QX` or `humansneednotapply`

Above commands for copy/paste to your Terminal:

```bash
cd /opt/lycheejs;

./bin/configure.sh;
lycheejs-harvester start development;

lycheejs-strainer auto /libraries/<identifier>;
lycheejs-fertilizer auto /libraries/<identifier>;
```
