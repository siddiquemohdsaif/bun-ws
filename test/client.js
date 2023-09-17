import WebSocket from 'ws';

const ws = new WebSocket('ws://localhost:8080');

ws.on('open', function open() {
  console.log('Connected to the WebSocket server!');
  ws.send('Hello from the client!');
});

ws.on('message', function incoming(data) {
  console.log(`Received from server: ${data}`);
});

ws.on('close', function close(code, reason) {
    console.log(`Disconnected from the WebSocket server. Code: ${code}, Reason: ${reason}`);
});

ws.on('error', function error(err) {
  console.error(`WebSocket error: ${err}`);
});
