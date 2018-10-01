
# Do-Update Guide

This update guide will explain what goes on behind
the scenes regarding a lychee.js Engine updates.

It can be seen as a documentation that contributors
or users can follow through in case the [do-netinstall.sh](./do-netinstall.md)
does not work for any reason.


## Prerequisites

The [Do-Install Guide](./do-install.md) has to be
followed through beforehand.

The [do-update.sh](/bin/maintenance/do-update.sh) script
requires the following external programs in order to be
executed successfully:

- `bash` has to be available.
- `curl` has to be available (version `7.52.0+` for failsafe downloads with auto-retries).
- `git` has to be available.
- `zip` and `unzip` have to be available (to check integrity and extract the runtimes).

## Usage

The [do-update.sh](/bin/maintenance/do-update.sh) script
by default will synchronize everything with the upstream
`development` branch on github. The URLs inside the script
can be modified easily, in case you want to use `gitlab`
or other source hosting providers.

However, the `lycheejs-runtime` download currently expects
the GitHub releases API that is available at
`https://api.github.com/repos/Artificial-Engineering/lycheejs-runtime/releases/latest`
in order to find and download the latest released file.

```bash
cd /opt/lycheejs;

bash ./bin/maintenance/do-update.sh;
```

**Flags**:

- `--branch=master` or `--master` to switch to the quaterly-released `master` branch.
- `--branch=development` or `--development` to switch to the up-to-date `development` branch (defaulted).
- `--yes` or `-y` to deactivate the manual confirmation dialogs.
- `--only-node` to download only the `node` platform adapters and runtimes (useful for embedded systems).

## Update Process

### Engine Update (via git)

0. Checkout branch.
1. Fetch updates from `upstream` or `origin`.
2. force-pull changes in from remote branch.
1. Fetch all changes again (via `git fetch --all`).
2. Reset to the originating HEAD from `upstream` or `origin`.

### Runtimes Update (via curl)

0. Query GitHub API to get latest release file and its download URL.
1. Download via `curl`, depending on `--retry-connrefused` support. Important note: GitHub CDN uses 2 redirects, so `--location` is necessary.
2. Unzip downloaded `lycheejs-runtime.zip` or `lycheejs-runtime-only-node.zip`.
3. Update `lychee.js Runtimes` by executing the `./bin/runtime/do-update.sh` script.

