# WebAssembly Text Playground CLI

A CLI to play around with and learn how to write the [WebAssembly text format](https://developer.mozilla.org/en-US/docs/WebAssembly/Understanding_the_text_format).

## Setup

Install dependencies by running `yarn` and switch your Node version to `v13` or later.

## Example usage

```
node playground.mjs examples/add-two.wat

Initialized with examples/add-two.wat. Use one of the following commands:

- list (list all exported methods)
- exit (exit program)
- Or calling one of your exported methods: addTwo

> addTwo(2, 5)
7
```
