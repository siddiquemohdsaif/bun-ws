import cluster from './cluster-bun.js';
import http from 'http';
import os from 'os';

const numCPUs = os.cpus().length;

if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);

    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    // Start the load balancer on port 3000
    cluster.startLoadBalancer(3000);
} else {
    process.on('message', (message, connection) => {
        if (message === 'newConnection') {
            http.createServer((req, res) => {
                res.writeHead(200);
                res.end(`Hello from Worker with PID: ${process.pid}!\n`);
            }).emit('connection', connection);
        }
    });

    console.log(`Worker ${process.pid} started`);
}
