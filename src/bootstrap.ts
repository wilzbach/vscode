import * as path from 'path';
import * as fs from 'fs';
import {
    exec as childExec
} from 'child_process';
import {
    promisify
} from 'util';

import {
    some
} from 'lodash';

import { expectedSLSVersion } from './sls';

import {
    ExtensionContext,
    Progress,
    ProgressOptions,
    ProgressLocation,
    window as Window,
} from 'vscode';

import log from './log';

const stat = promisify(fs.stat);
const isWin = process.platform === 'win32';

// run a command asynchronously
function execAsync(cmd, options: object = {}): Promise<string> {
  return new Promise((resolve, reject) => {
    childExec(cmd, options, (error, stdout, stderr) => {
       if (error) return reject(error);
       // for now, we aren't interested in stderr
       //if (stderr) return resolve(stderr);
       resolve(stdout);
    });
  });
}

/*
* Convert a promise into a Go-style plain promise:
*
* ```
* let [err, output] = await plain(myPromise);
* ```
*/
function plain<T>(promise: Promise<T>) : Promise<any[]> {
    return promise
        .then(d => [undefined, d])
        .catch(e => [e, undefined]);
}

// allow execution with plain-promises
function exec(cmd: string, options: object = {}){
    return plain(execAsync(cmd, options));
}

// Returns the binary folder for used platform
function venvBinFolder() {
    if (isWin) {
        return 'Scripts';
    }
    return 'bin';
}

// Returns the python binary for the used platform
function pythonBinary() {
    if (isWin) {
        return 'python';
    }
    return 'python3';
}

// Makes sure that an exact version of SLS is installed
export async function bootstrap(context: ExtensionContext) {
    const venvFolder = context.asAbsolutePath(path.join('venv'));
    const slsBin = path.join(venvFolder, venvBinFolder(), 'sls');

    // check the version of the installed SLS binary
    const [err, output] = await exec(`${slsBin} version`);
    if (err) {
        // Version checking failed. we don't know why, but now it's a good idea
        // to run the upgrade setup
        log(`[bootstrap] ERROR: ${err}`);
        return await upgradeSLS(venvFolder);
    }
    const slsVersion = output.trim();
    if (slsVersion !== expectedSLSVersion) {
        log(`[bootstrap] Version mismatch: ${slsVersion}, expected: ${expectedSLSVersion}`);
        return await upgradeSLS(venvFolder);
    }
    return slsBin;
}

// Trigger the upgrade operation with a progress window
async function upgradeSLS(venvFolder:string) {
    let progressOptions: ProgressOptions = {
        location: ProgressLocation.Notification,
        title: 'SLS Bootstrap',
    };
    return Window.withProgress(progressOptions, async progress => {
        const upgrader = new SLSUpgrade(venvFolder, progress);
        return await upgrader.run();
    });
}

// Custom upgrade error that might be thrown during the SLS upgrade process
class SLSUpgradeError extends Error {
    constructor(message:string) {
        super(message);
        Object.setPrototypeOf(this, SLSUpgradeError.prototype);
        this.name = this.constructor.name;
    }
}

/**
* Create or upgrade a SLS installation.
*/
class SLSUpgrade {
    slsBin:string;
    venvFolder:string;
    venvBinFolder:string;
    progress: Progress<{message: string}>;

    constructor(venvFolder:string, progress: Progress<{message: string}>) {
        this.venvFolder = venvFolder;
        this.venvBinFolder = path.join(venvFolder, venvBinFolder());
        this.progress = progress;
        this.slsBin = undefined;
    }

    /**
    * Runs the entire upgrade process step by step.
    * Aborts if a single step fails.
    */
    async run() {
        this.report("Starting bootstrapping");
        const steps = [
            {
                method: 'checkPython',
                message: 'Checking Python installation',
                error: 'No Python3 installation found',
            },
            {
                method: 'createVenv',
                message: 'Creating virtualenv',
            },
            {
                method: 'installSLS',
                message: `Installing SLS(${expectedSLSVersion})`,
            },
        ];
        for(let i=0; i < steps.length; i++) {
            const step = steps[i];
            try {
                this.report(step.message);
                await this[step.method]();
            } catch(err) {
                let errorMessage;
                if (err instanceof SLSUpgradeError) {
                    errorMessage = err.message;
                } else if (step.error !== undefined) {
                    errorMessage = step.error;
                } else {
                    // fallback error message
                    errorMessage = `${step.message} failed`;
                }
                this.info(`ERROR in ${step.method}: ${err}`);
                Window.showErrorMessage(errorMessage);
                return false;
            }
        }
        this.report("Bootstrapping succeeded");
        this.info(`Success -> ${this.slsBin}`);
        return this.slsBin;
    }

    // Ensures that python3.6 or higher is available
    async checkPython() {
        const output = await execAsync(`${pythonBinary()} --version`);
        const pythonVersion = output.replace("Python ", "").trim();
        const isSupportedPython = some(["3.6", "3.7", "3.8", "3.9"],
            e => pythonVersion.startsWith(e)
        );
        if (!isSupportedPython) {
            throw new SLSUpgradeError('SLS requires Python3.6 or newer');
        }
    }

    // Ensures a venv directory exists. Otherwise creates a new one
    async createVenv() {
        this.info(`Setting up virtualenv in ${this.venvFolder}`);
        const [err, _] = await plain(stat(this.venvFolder))
        if (!err) {
            this.info('Re-using existing virtualenv');
            return;
        }
        await execAsync(`${pythonBinary()} -m venv ${this.venvFolder}`);
    }

    // Installs an explicit version of SLS with pip
    async installSLS() {
        const pipBin = path.join(this.venvBinFolder, 'pip');
        await execAsync(`${pipBin} install -U sls==${expectedSLSVersion}`);
        this.slsBin = path.join(this.venvBinFolder, 'sls');
    }

    // Reports the current progress to the progress window
    report(message:string) {
        this.progress.report({
            message: message,
        });
    }

    // Logs messages with a [bootstrap] prefix
    info(message:string) {
        log(`[bootstrap] ${message}`);
    }
}
