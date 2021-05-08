import {readFileSync, writeFileSync, existsSync, unlinkSync} from "fs";
import {dirname, resolve} from 'path';
import wabt from "wabt";
import readline from 'readline';

const moduleFlagIndex = process.argv.findIndex((arg) => arg === '-m');
const importsPath = moduleFlagIndex === -1 ? null : process.argv[moduleFlagIndex + 1];
const [,, pathToWatFile, execFilePath] = process.argv.filter((arg) => arg !== importsPath && arg !== '-i' && arg !== '-m');

if (!pathToWatFile) {
  console.log('Usage: node playground.mjs <pathToWatFile> [<pathToExecJsFile>] [-m <pathToImportsFile>]');
  process.exit();
}

if (!existsSync(pathToWatFile)) {
  console.log(`File ${pathToWatFile} does not exist.`);
  process.exit();
}

if (importsPath && !existsSync(importsPath)) {
  console.log(`File ${importsPath} does not exist.`);
  process.exit();
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const wasmExports = await getWatExports();

if (execFilePath) {
  if (!existsSync(execFilePath)) {
    throw new Error(`${execFilePath} does not exist.`);
  }

  const imports = await import(resolve(dirname('./'), execFilePath));
  await imports.default(wasmExports);

  process.exit();
}

const validCommands = `
- list (list all exported methods)
- exit (exit program)
- Or calling one of your exported methods: ${
    wasmExports.length === 0 ?
      'no exported method found' :
      Object.keys(wasmExports).join(',')
    }
`;

console.log(`Initialized with ${pathToWatFile}. Use one of the following commands:\n${validCommands}`);
showNextPrompt();

function showNextPrompt() {
  rl.question("> ", (command) => {
    if (command === 'list') {
      console.log(Object.keys(wasmExports));
      showNextPrompt();
      return;
    }

    if (command === 'exit') {
      process.exit();
    }

    const {method, args} = parse(command);

    if (!method) {
      console.log(`Invalid command. Valid commands are:\n${validCommands}`);
      showNextPrompt();
      return;
    }

    if (!Object.keys(wasmExports).includes(method)) {
      console.log(`Method ${method} is not exported by WAT file.`);
      showNextPrompt();
      return;
    }

    console.log(wasmExports[method](...args));

    showNextPrompt();
  });
}

async function getWatExports() {
  const module = await wabt();
  const outputWasmFilePath = "~temp.wasm";

  const wasmModule = module.parseWat(pathToWatFile, readFileSync(pathToWatFile, "utf8"));
  const { buffer } = wasmModule.toBinary({});

  writeFileSync(outputWasmFilePath, Buffer.from(buffer));

  const wasmBuffer = readFileSync(outputWasmFilePath);
  const webModule = await WebAssembly.compile(wasmBuffer);

  const imports = importsPath ? await import(resolve(dirname('./'), importsPath)) : null;
  const {exports: wasmExports} = await WebAssembly.instantiate(webModule, {
    imports: imports ? imports.default : undefined,
  });

  unlinkSync(outputWasmFilePath);

  return wasmExports;
}

function parse(input) {
  const characters = input.split('');
  const tokens = [];

  let valueState = {
    open: false,
    current: '',
  };

  const specialCharacters = ['(', ')', ',', '"', '\''];

  for (const character of characters) {
    if (specialCharacters.includes(character)) {
      if (!valueState.open) continue;
      valueState.open = false;
      const isNumber = !isNaN(valueState.current);
      tokens.push({
        type: isNumber ? 'number' : 'string',
        value: valueState.current
      });
      valueState.current = '';
      continue;
    }

    valueState.open = true;
    valueState.current += character;
  }

  return {
    method: tokens.length > 0 ? tokens[0].value : null,
    args: tokens.slice(1).map(({type, value}) =>
      type === 'number' ? Number(value) : value.trim(),
    ),
  };
}
