
# Tools

The lychee.js Engine has some CLI and GUI
tools to help with the development workflow.

This is the quick overview of the tools. The
tools themselves are explained in detail in
the Software Bots chapter.

All tools, except for the lychee.js Helper,
are written with lychee.js. You can reuse them
as a Library or a Project - fork, extend or
modify their behaviour and their Definitions.


## lychee.js Helper

The `lycheejs-helper` is a low-level bash script
that integrates the typical POSIX environment with
the lychee.js World. It integrates many useful
features for both application interaction and
rapid prototyping.

It offers simple commands that allow e.g. replacement
of `/usr/bin/env`, can be used as a shebang tool and
it can remote-control the lychee.js Harvester's
library- or project-specific servers.

Please read the
[lychee.js Helper](../software-bots/lycheejs-helper.md)
chapter for more information.


## lychee.js Harvester

The lychee.js Harvester is a `library` and `project`
that integrates your projects and libraries with the
peer-cloud, the software automation pipeline and all
running software bots.

It can be imagined as a development server that has
zero requirements, so that you can quickly get to
work without having to bootup another server.

It is tightly integrated with the lychee.js Engine,
so it features several (JSON RPC) APIs that the AI
Botnet behind lychee.js needs.

Please read the
[lychee.js Harvester](../software-bots/lycheejs-harvester.md)
chapter for more information.


## lychee.js Breeder

The lychee.js Breeder is your Project management
wizard. It can be seen as the source code management
tool that automatically sets up your Project or
Library from the Boilerplate and integrates
everything correctly with the other Software Bots.

Please read the
[lychee.js Breeder](../software-bots/lycheejs-breeder.md)
chapter for more information.


## lychee.js Studio

The lychee.js Studio is the graphical Editor
that allows you to modify, clone, create and fork
Projects or Libraries without having to write
code.

It has many features, but focusses on all things
related to the Application Architecture (and
integrating Assets or Entities quickly), so it
is not meant to replace your Code Editor.

Please read the
[lychee.js Studio](../software-bots/lycheejs-studio.md)
chapter for more information.


## lychee.js Fertilizer

The lychee.js Fertilizer is a command line
Build Tool that completely automates the
packaging and distribution process of lychee.js
Projects or Libraries.

It has full support for sandboxed Environments
and simulation of build on a targeted fertilizer
(platform).

Please read the
[lychee.js Fertilizer](../software-bots/lycheejs-fertilizer.md)
chapter for more information.


## lychee.js Ranger

The lychee.js Ranger is a graphical Management
Tool that manages your lychee.js Harvester
installations. It uses the lychee.js Harvester's
RPC APIs in order to integrate the remote server
locally with your computer.

Due to security reasons, it is required to
tunnel connections through SSH to remote servers.

Please read the
[lychee.js Ranger](../software-bots/lycheejs-ranger.md)
chapter for more information.


## lychee.js Strainer

The lychee.js Strainer is a command line Tool
that automatically fuzz-tests your code and
filters bugs, fixes mistakes and synchronizes
its knowledge with the peer-cloud of Software
Bots.

Please read the
[lychee.js Strainer](../software-bots/lycheejs-strainer.md)
chapter for more information.

