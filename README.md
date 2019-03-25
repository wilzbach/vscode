# VSCode Storyscript extension

Provides Storyscript language support for Visual Studio Code powered by the [Storyscript Language Server](https://github.com/storyscript/sls).

## Installation

Launch VS Code Quick Open (Ctrl+P), paste the following command, and press enter.

```shell
ext install asyncy.storyscript
```

[Open on the VSCode Marketplace](https://marketplace.visualstudio.com/items?itemName=asyncy.storyscript)

## Features

![Storyscript in Visual Studio Code](https://raw.githubusercontent.com/storyscript/vscode/master/preview.png)

- Syntax highlighting
- Autocomplete (provided via the LSP module, WIP)
- Linting (WIP)
- Formatting (WIP)

## Development

1) Install all dependencies

```sh
npm install
```

2) Open up VSCode (dev instance)

```sh
npm run vscode
```

### Development tips

#### Automatically recompile the extension

Use Typescript's `watch` to monitor all Typescript files and automatically recompile the extension:

```sh
npm run watch
```

Now you can use the `vscode:open` target to start the VSCode instance faster:

```sh
npm run vscode:open
```

Subsequent executions of `npm run vscode:open` will refresh the development instance.

#### Spawn via VSCode

You can also start up a VSCode instance via VSCode. This will allow you to debug into an extension.

1) Open VSCode
2) Open Folder (-> select "<this-dir>/client")
3) View -> Debug
4) Run "Launch Client"
5) Open up a directory with Storyscript files or create a new `.story` file
