// Setup an event listener for messages from the master process
process.on('message', (message) => {
    console.log(`[Worker ${process.pid}] Received message from master: ${message}`);

    // Respond back to the master process
    process.send(`[Worker ${process.pid}] Hello, Master! I received your message.`);
});

console.log(`[Worker ${process.pid}] Worker process started`);
