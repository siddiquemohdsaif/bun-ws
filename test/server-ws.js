import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });
let user  = 0;
let i=0;
wss.on('connection', (ws) => {
    user++;
    i++;
    if(i === 1000){
        i=0;
        console.log('Client connected , user:'+user);
    }

    ws.on('message', (message) => {
        //console.log(`Received message: ${message}`);

        try {
            const payload = JSON.parse(message);

            if (payload.type === 'message') {
                ws.send(JSON.stringify({ 
                    type: 'message', 
                    payload: 'hello world', 
                    count: payload.count + 1 
                }));
            } else {
                ws.send('Unknown command');
            }
        } catch (err) {
            console.error('Error parsing message:', err);
            ws.send('Invalid JSON payload');
        }
    });

    ws.on('close', () => {
        //console.log('Client disconnected');
    });
});

console.log('WebSocket server is listening on port 8080');
