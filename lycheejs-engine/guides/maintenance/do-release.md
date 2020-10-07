
# Do-Release Guide

## Install Buildbot

The build server setup requires either an Arch Linux,
Debian Jessie, Debian Testing or Ubuntu (non-LTS!)
machine with at least 8GB of memory space in `/tmp`.

If there's not enough memory space available in `/tmp`,
the script will automatically set the `RELEASE_FOLDER`
to `/mnt/lycheejs`.


## Authentication

### Authenticate GitHub API

The Maintenance scripts require a configured GitHub Access
Token. You must be member of the [Artificial-Engineering](https://github.com/Artificial-Engineering)
organization and the [Personal Access Token](https://github.com/settings/tokens)
with `repo` rights must be available in the `.github/TOKEN`
file.

It is recommended to use the [@humansneednotapply](https://github.com/humansneednotapply)
build bot account for that purpose.

```bash
# Create folder if it doesn't exist
mkdir -p /opt/lycheejs/.github;

# Token for username @humansneednotapply
echo "MY-PERSONAL-ACCESS-TOKEN" > /opt/lycheejs/.github/TOKEN;
```

### Authenticate GitHub SSH

If there's no SSH key pair, generate a new one. Setup git
so that it uses the same user details as the [@humansneednotapply](https://github.com/humansneednotapply)
account.

```bash
yes "" | ssh-keygen -q -N "" -t rsa -b 8192 -C "robot [ insert an at here ] artificial.engineering";

# Add this SSH key to @humansneednotapply's GitHub account
cat ~/.ssh/id_rsa.pub;

git config --global user.name "Robot";
git config --global user.email "robot [ insert an at here ] artificial.engineering";
```

Follow [these instructions](https://help.github.com/articles/adding-a-new-ssh-key-to-your-github-account) afterwards.


### Authenticate NPM

Authenticate `npm` with the [~artificial-engineering](https://www.npmjs.com/~artificial-engineering)
account.

```bash
npm whoami; # has to be artificial-engineering
npm login;

# Enter username artificial-engineering
# Enter email    robot [ insert an at here ] artificial.engineering
# Enter password ...
```



## Update lychee.js

The `development` branch is the branch that is the newest HEAD
and gets merged back to `master` with a single squashed release
commit.

Before a release is created the update tool has to be executed:

```bash
cd /opt/lycheejs;

# Branch should have been on development already
git checkout development;

./bin/maintenance/do-update.sh;
```


## Release lychee.js

The lychee.js Release Tool is a wizard that automatically updates
and creates the quaterly releases for everything including:

- [lycheejs](https://github.com/Artificial-Engineering/lycheejs.git) (build, package and publish to GitHub)
- [lycheejs-runtime](https://github.com/Artificial-Engineering/lycheejs-runtime.git) (build, package and publish to GitHub)
- [lycheejs-library](https://github.com/Artificial-Engineering/lycheejs-library.git) (build, package and publish to GitHub, NPM and Bower)
- [lycheejs-bundle](https://github.com/Artificial-Engineering/lycheejs-bundle.git) (build, package and publish to GitHub)

Install the requirements, authenticate everything as instructed
before and *THEN* execute the `do-release.sh` script. Either of
`/tmp` or `/mnt` requires at least 8GB memory space available.

```bash
cd /opt/lycheejs;

# Some servers need to remount /tmp before
# mount -o remount,size=8G,noatime /tmp;

# Optionally enforce release folder
# export RELEASE_FOLDER="/mnt/lycheejs";

./bin/maintenance/do-release.sh --simulation;
```

It is recommended to execute the `do-release.sh` script at least
one time in simulation mode to verify that `git`, `ssh` and `npm`
are working correctly (as yes/no dialogs of changed SSH keys or
unknown hosts actually block a potential git clone).

The `RELEASE_FOLDER` environment variable is available to enforce
a build path. The build workflow of all sub projects assume that
they use a `-` (dash) in between to sandbox lychee.js installations.

For example, setting `export RELEASE_FOLDER="/tmp/lycheejs"` leads
to the bundles being built inside `/tmp/lycheejs-bundles`.

**Flags**:

- `-y` or `--yes` skips dialogs and assumes yes for all questions.
- `-s` or `--simulation` will skip all dialogs and will skip the `publish` step for all projects.


### Release Third-Party lychee.js Projects and Libraries

After the release has been completed and successfully published,
the lychee.js Fertilizer has to be run on the third-party projects
of the [Artificial-Engineering](https://github.com/Artificial-Engineering)
and [Artificial-University](https://github.com/Artificial-University)
organization.

This includes the [lycheejs-website](https://github.com/Artificial-Engineering/lycheejs-website.git).

