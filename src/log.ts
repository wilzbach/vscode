import {
    OutputChannel,
    workspace,
    window as Window,
} from 'vscode';

let debug = 0
let out:OutputChannel;

// Log a message to specific SLS output channel (debug mode) or
// the default console otherwise.
export function log(message: string) {
    if (debug) {
        out.appendLine(message);
    } else {
        console.log('[sls] ' + message);
    }
}

export function initLogging() {
    debug = workspace.getConfiguration().get('sls.debug');
    // for debugging: provide a special SLS channel
    if (debug) {
        out = Window.createOutputChannel("SLS");
        out.show(); // reveal the SLS channel in the UI
    }
}
 export function stopLogging() {
    if (out !== undefined) {
        out.clear();
        out.hide();
        out.dispose();
    }
 }

 export default log;
