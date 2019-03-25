import * as net from 'net';

import {
    LanguageClient,
    LanguageClientOptions,
    ServerOptions,
} from 'vscode-languageclient';

import log from '../log';

let socket: net.Socket;

export function socketDestroy() {
    if (socket !== undefined) {
        socket.destroy();
    }
}

export function startLangServerTCP(port: number, clientOptions: LanguageClientOptions, restartCallback): LanguageClient {
    const serverOptions: ServerOptions = function() {
        return new Promise((resolve, reject) => {
            if (socket !== undefined) {
                socket.destroy();
            }
            socket = new net.Socket();
            socket.connect(port, "127.0.0.1");
            socket.on('connect', function(err) {
                resolve({
                    reader: socket,
                    writer: socket,
                });
            });
            socket.on('error', function(err) {
                log('socket.error: ' + err)
                // try to connect to a newly started server automatically
                setTimeout(restartCallback, 500);
            });
            socket.on('close', function() {
                log('socket.close')
            });
        });
    }

    return new LanguageClient(`SLS (port ${port})`, serverOptions, clientOptions);
}

export default startLangServerTCP;
