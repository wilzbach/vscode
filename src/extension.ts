import {
    commands,
    languages,
    Disposable,
    ExtensionContext,
    IndentAction,
    workspace,
} from 'vscode';

import {
    LanguageClient,
    LanguageClientOptions,
} from 'vscode-languageclient';

import {
    initLogging,
    log,
    stopLogging,
} from './log';

import {
    bootstrap,
} from './bootstrap';

import startLangServerStdio from './server/stdio';
import {
    socketDestroy,
    startLangServerTCP,
} from './server/tcp';

let client: LanguageClient;

export function activate(context: ExtensionContext) {
    initLogging();
    asyncyActivate(context);
}

export async function asyncyActivate(context: ExtensionContext) {
    languages.setLanguageConfiguration('storyscript', {
        onEnterRules: [
            {
                beforeText: /^\s*(?:function|foreach|if|else|while|try|finally|catch|async)\b.*:\s*/,
                action: { indentAction: IndentAction.Indent }
            },
            {
                beforeText: /^(?!\s+\\)[^#\n]+\\\s*/,
                action: { indentAction: IndentAction.Indent }
            },
            {
                beforeText: /^\s*#.*/,
                afterText: /.+$/,
                action: { indentAction: IndentAction.None, appendText: '# ' }
            },
            {
                beforeText: /^\s+(continue|break|return)\b.*/,
                afterText: /\s+$/,
                action: { indentAction: IndentAction.Outdent }
            }
        ]
    });

    // Options to control the language client
    let clientOptions: LanguageClientOptions = {
        // Register the server for storyscript documents
        documentSelector: [
            { scheme: 'file', language: 'storyscript' },
        ],
        synchronize: {
            // Notify the server about file changes to '.story' files contained in the workspace
            fileEvents: [
                workspace.createFileSystemWatcher('**/.story'),
            ],
            configurationSection: 'sls',
        },
    };

    let restartHandler;
    const rootDir = context.asAbsolutePath('.');

    // Create the language client
    if (workspace.getConfiguration().get('sls.stdio')) {
        // make sure the newest SLS is installed
        const slsBin = await bootstrap(context);
        if (!slsBin) {
            return; // SLS bootstrapping failed
        }
        log(`Starting SLS (stdio) -> ${slsBin}`)
        restartHandler = () => {
            log(`Restarting SLS (stdio) -> ${slsBin}`)
            client.stop();
            client = startLangServerStdio(slsBin, rootDir, clientOptions);
            context.subscriptions.push(client.start());
        };
        client = startLangServerStdio(slsBin, rootDir, clientOptions);
    } else {
        // this is for debugging. You will need to start the sls server manually.
        const port:number = workspace.getConfiguration().get<number>('sls.port');
        restartHandler = () => {
            // Handy restart of the socket connection
            socketDestroy();
            client.stop();
            client = startLangServerTCP(port, clientOptions, restartHandler);
            context.subscriptions.push(client.start());
        };
        client = startLangServerTCP(port, clientOptions, restartHandler);
        log(`Starting SLS (port: ${port})`)
    }

    // Register commands
    context.subscriptions.push(commands.registerCommand('sls.restart', restartHandler));

    // Start the client
    context.subscriptions.push(client.start());
}

export function deactivate(): Thenable<void> | undefined {
    stopLogging();
    if (!client) {
        return undefined;
    }
    return client.stop();
}
