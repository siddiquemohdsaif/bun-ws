import {WebSocketServer} from './lib/ws-bun';

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    console.log(`Received: ${message}`);
  });

  ws.send('Hello from server!');

  // Close the connection after a delay of 2 seconds.
  setTimeout(() => {
    ws.close(4100,"dddddddd");
  }, 2000);
});