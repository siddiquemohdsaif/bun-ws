const WebSocketBun = require('./ws-bun');

const socket = new WebSocketBun('ws://localhost:3000/chat');

socket.addEventListener('message', event => {
  console.log(event.data);
});

socket.addEventListener('open', () => {
  console.log('Socket opened');
  socket.send('Hello from ws-bun!');
});

socket.addEventListener('close', event => {
  console.log('Socket closed:', event.code, event.reason);
});

socket.addEventListener('error', event => {
  console.log('Error:', event.error);
});

// ... and so on for other events.
