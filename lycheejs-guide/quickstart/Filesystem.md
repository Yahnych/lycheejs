
# Filesystem

The lychee.js Engine is installed at `/opt/lycheejs`,
its folder structure looks like this:

- `/opt/lycheejs/bin/*` for Binaries and Helper Scripts.
- `/opt/lycheejs/libraries/*` for lychee.js Libraries.
- `/opt/lycheejs/projects/*` for lychee.js Projects.

As the lychee.js Engine can compile and package itself,
there's no other external folder that is relevant to
the Engine.

The only external requirement as of now is the linting
tool `eslint`, which prepares the codebase so that the
parsing overhead for the lychee.js Strainer can stay
simple.

By default the `.gitignore` file does only explicitely
track the upstream-maintained core Libraries and core
Projects.

That means it is recommended to use explicitely `git init`
and an own git repository for each lychee.js Library
or Project that is not part of the lychee.js Engine.


## Libraries and Projects

All projects and libraries can be tracked by `git` using
a simple `git init` call inside their folder. By default,
the `/opt/lycheejs/.gitignore` file only tracks the official
example projects of the upstream lychee.js Engine.

```bash
cd /opt/lycheejs;

mkdir -p ./projects/my-project;
cd ./projects/my-project;

lycheejs-breeder init;

git init;
```


## Third-party Libraries and Projects

The lychee.js Engine completely supports the usage of
symbolic links, so that it is not necessary to maintain
a Fork of the Engine or a complicated submodule structure.

An external Library or Project can be easily integrated
with a symbolic link:

```bash
# Install a third-party Library

cd /home/$USER/Software;
git clone https://github.com/Artificial-Engineering/research.git;

# Track the Project via identifier "/projects/research"

cd /opt/lycheejs/projects;
ln -s /home/$USER/Software/research ./research;
```

