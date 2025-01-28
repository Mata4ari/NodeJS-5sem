const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 4000 });
let messageCount = 0;

server.on('connection', (ws) => {
    ws.on('message', (message) => {
        const { client, timestamp } = JSON.parse(message);
        const response = { server: messageCount++, client, timestamp };
        ws.send(JSON.stringify(response));
    });

    ws.send('Connected to 11-04 WebSocket server');
});

console.log('11-04 WebSocket server running on ws://localhost:4000');
