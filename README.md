# VSCode Storyscript extension

[![CircleCI](https://img.shields.io/circleci/project/github/storyscript/vscode/master.svg?style=for-the-badge)](https://circleci.com/gh/storyscript/vscode)

Provides Storyscript language support for Visual Studio Code powered by the [Storyscript Language Server](https://github.com/storyscript/sls).

## Installation

Launch VS Code Quick Open (Ctrl+P), paste the following command, and press enter.

```shell
ext install story.script
```

[Open on the VSCode Marketplace](https://marketplace.visualstudio.com/items?itemName=asyncy.storyscript)

## Features

### Syntax highlighting

![Storyscript in Visual Studio Code](https://raw.githubusercontent.com/storyscript/vscode/master/preview.png)

### Auto-completion

![autocompletion](https://user-images.githubusercontent.com/4370550/55664816-e11f9d80-5834-11e9-832c-ecfb888e20d3.gif)

### Linting

![linting](https://user-images.githubusercontent.com/4370550/55664858-a4a07180-5835-11e9-9ad2-f5f61ffb9ba0.gif)

## Debug output

Set `sls.debug` to `true` in your user or worspace settings.

To open your user and workspace settings, use the following VS Code menu command:

- On Windows/Linux - File > Preferences > Settings
- On macOS - Code > Preferences > Settings
-
You can also open the Settings editor from the Command Palette (`Ctrl+Shift+P`) with "Preferences: Open Settings" or use the keyboard shortcut (`Ctrl+,`).

Alternatively, quickly paste this in your workspace to create a new settings file:

```
cat > .vscode/settings.json <<EOF
{
    "sls.debug": true
}
EOF
```

[Learn more about VSCode settings](https://code.visualstudio.com/docs/getstarted/settings).

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
