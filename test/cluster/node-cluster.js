import cluster from 'cluster';
import http from 'http';
import os from 'os';

const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
    console.log(`Master ${process.pid} is running`);

    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died`);
    });
} else {
    // Workers can share any TCP connection
    http.createServer((req, res) => {
        res.writeHead(200);
        res.end(`Hello from Worker with PID: ${process.pid}!\n`);
    }).listen(3000);

    console.log(`Worker ${process.pid} started`);
}
