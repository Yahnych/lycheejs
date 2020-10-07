
# lychee.js Strainer Fixer

The `lycheejs-strainer-fixer` is a Command-Line Linter that
helps to lint, parse and understand single files and their
contents (and recursively resolved dependencies).

It can be seen as a `quickfix` mode supporting tool and is
the code assistant that rewrites your code and fixes things
automatically - while you as a human - still write code in
your IDE.

In most IDEs there's something like mentioned `quickfix` mode
available that allows the parsing of the external process's
output.


## lychee.js Strainer Fixer (stdout/stderr) Format

The `lycheejs-strainer-fixer /path/to/file.js` command will
show errors every time it could not understand your code,
its meanings or its relations to other definitions.

The output format of the `lycheejs-strainer-fixer` command is
the following, where each line represents a separate error:

```bash
/path/to/file.js:line:column: Error Message. [error-rule-id]

<count> problems
```

```bash
# Example Output
[$] cd /opt/lycheejs;
[$] lycheejs-strainer-fixer libraries/lychee/source/app/Main.js
libraries/lychee/source/app/Main.js:37:11: Parsing error: Unexpected token an. [parser-error]
libraries/lychee/source/app/Main.js:426:3: Invalid return value for method "init()". [no-return-value]
libraries/lychee/source/app/Main.js:507:3: Invalid return value for method "destroy()". [no-return-value]
libraries/lychee/source/app/Main.js:559:22: Invalid parameter values for "id" for method "setState()". [no-parameter-value]
libraries/lychee/source/app/Main.js:577:26: Invalid parameter values for "whatever" for method "getState()". [no-parameter-value]

5 problems
```


**VIM / NeoVIM**:

An integration for VIM's [ALE](https://github.com/w0rp/ALE) plugin
is available. Copy the [strainer.vim](../bin/linter/ale/strainer.vim)
file to `~/.vim/ale_linters/javascript/strainer.vim` and add the
following lines to your `.vimrc`:

```vim
if filereadable("lychee.store") || filereadable("lychee.pkg")
	let g:ale_linters = { 'javascript': [ 'strainer' ] }
endif
```

