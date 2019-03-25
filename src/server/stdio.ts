import {
    Executable,
    LanguageClient,
    LanguageClientOptions,
    ServerOptions,
} from 'vscode-languageclient';

import log from '../log';

export function startLangServerStdio(slsBin: string, rootDir: string, clientOptions: LanguageClientOptions): LanguageClient {
    let server:Executable = {
        command: slsBin,
        args: ['--stdio'],
        options: {
            cwd: rootDir,
        }
    };

    let serverOptions: ServerOptions = server;
    return new LanguageClient(
        'storyscript',
        'Storyscript LSP (Stdio)',
        serverOptions,
        clientOptions
    );
}

export default startLangServerStdio;
