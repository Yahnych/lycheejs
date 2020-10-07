
# Updates

The lychee.js Engine has a quarterly release cycle.

That means before every ending Quarter of the Year
a new release is created and published to the `master`
branch.



## Reserved Branches

In order to have a failsafe integration

- `master` branch is reserved for quarterly releases.
- `20XX-XX` tags are reserved for quartlery releases.
- `development` branch ships everything up-to-date (recommended).
- `humansneednotapply` branch ships everything the software bots are working on (not recommended).

The `humansneednotapply` branch is constantly merged
with `development`. Use with care, as this branch is
heavily updated and constantly squashed in its history.



## Updating lychee.js Engine Installation

A local lychee.js Engine Installation can be updated
anytime by using the `do-update.sh` wizard that will
make sure that everything is setup correctly.

```bash
cd /opt/lycheejs;

# Update lychee.js Engine Installation
./bin/maintenance/do-update.sh;
```

However, if you don't want to update the runtimes and
only update the lychee.js Engine itself, you can use
a simple `git pull origin development` in your workflow.

```bash
# See "Reserved Branches"
git pull origin development;
```

