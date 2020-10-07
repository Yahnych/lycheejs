
# Tutorials

The lychee.js Tutorials are all available here. They are
fully compatible with the workflow of [lychee.js Breeder](../software-bots/lycheejs-breeder.md).


## Prerequisites

- The lychee.js Engine has to be installed already (into `/opt/lycheejs`).
- You should know the `git` command syntax, how to use `git diff` and `git checkout`.
- (Recommended) You should have basic knowledge of `ES2016` to understand things more quickly.


## Workflow

Every lychee.js Tutorial can be done after one another,
which means you start with the first, then you can do
the second, then the third and so on.

Each folder inside this very `./tutorial` folder contains
the code state when the equivalent Tutorial was completed.

You can use `git diff` or similar tools to figure out
what went wrong or what needs to be changed to succeed.

These Tutorials will also focus on giving you a strong
knowledge about the architecture. So most things are done
the hard way first, to teach you how things work behind
the scenes when you use the graphical tools like
[lychee.js Studio](../software-bots/lycheejs-studio.md) or
[lychee.js Ranger](../software-bots/lycheejs-ranger.md)


## Usage

Each time you start with a lychee.js Tutorial, you can
also start it by copying the files from the previous
Tutorial, so that everything is completely in sync.

Each Tutorial folder in this Guide contains the complete
incremental progress that you need in order to compare
it to your own progress (using `git diff`) or to start
the next Tutorial directly.

If you want to directly start with the `02-client`
Tutorial, you can start by merging the data of the
`01-server` Tutorial:

```bash
cd /opt/lycheejs;

# Initialize the Tutorial Project
mkdir ./projects/tutorial;
cd ./projects/tutorial;
lycheejs-breeder init;

# Merge progress of previous Tutorial
cp -R /path/to/lycheejs-guide/tutorials/01-server/* ./;

# Follow instructions of current Tutorial now
```


## Tutorials

1.  [Create a Server](./01-server.md)
2.  [Create a Client](./02-client.md)
3.  Basic Debugging
4.  [App States](./04-states.md)
5.  [Scene Graph](./05-scene-graph.md)
6.  [Event Graph](./06-event-graph.md)
7.  Integrate a Background
8.  Integrate a Sprite
9.  Integrate a UI Entity
10. Integrate a UI Event
11. Integrate a UI Effect
12. Integrate a Network Service
13. Integrate a Network Event
14. Integrate an AI
15. Serialize your Project
16. [Fertilize a Project](./16-fertilizer.md)

