# WebAssembly Text Playground CLI

A CLI to play around with and learn how to write the [WebAssembly text format](https://developer.mozilla.org/en-US/docs/WebAssembly/Understanding_the_text_format).

## Setup

Install dependencies by running `yarn` and switch your Node version to `v13` or later.

## Usage examples

### Print help message

```
node playground.mjs -h
Usage: node playground.mjs <pathToWatFile> [<pathToExecJsFile>] [-m <pathToImportsFile>] [-c <execCommand>]
```

### Using a JS file

```
node playground.mjs examples/simple/simple.wat examples/simple/simple.mjs
42
```

### Interactive mode

```
node playground.mjs examples/add-two.wat

Initialized with examples/add-two.wat. Use one of the following commands:

- list (list all exported methods)
- exit (exit program)
- Or calling one of your exported methods: addTwo

> addTwo(2, 5)
7
```

### Executing a command directly

```
node playground.mjs examples/add-two.wat -c "addTwo(2, 2)"
4
```

### Using imports

```
node playground.mjs examples/simple/simple.wat -m examples/log.imports.mjs

Initialized with examples/simple/simple.wat. Use one of the following commands:

- list (list all exported methods)
- exit (exit program)
- Or calling one of your exported methods: logValue

> logValue()
42
undefined
```
