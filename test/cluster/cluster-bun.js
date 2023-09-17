import { fork } from 'child_process';

class Worker {
    constructor() {
        this.process = fork(process.argv[1], ['--cluster-bun-worker']); // Re-run the same script as a worker
        this.process.on('message', (message) => {
            if (this.onMessageCallback) this.onMessageCallback(message);
        });
    }

    send(message) {
        this.process.send(message);
    }

    onMessage(callback) {
        this.onMessageCallback = callback;
    }
}

class ClusterBun {
    constructor() {
        this.isMaster = process.argv.indexOf('--cluster-bun-worker') === -1;
        this.isWorker = !this.isMaster;
        this.workers = [];
    }

    fork() {
        if (this.isMaster) {
            const worker = new Worker();
            this.workers.push(worker);
            return worker;
        }
    }

    setupMaster(settings) {
        // For now, we'll ignore the settings, but you can expand this as needed.
    }
}

const clusterBun = new ClusterBun();

export default clusterBun;
