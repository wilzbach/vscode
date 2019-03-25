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

Linux/Mac:

```shell
$ cd ~/.vscode/extensions/
$ git clone --recursive git@github.com:storyscript/vscode.git storyscript
$ cd storyscript
```
