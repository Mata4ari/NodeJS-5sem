const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 4000 });
let messageCount = 0;

setInterval(() => {
    server.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(`11-03-server: ${messageCount}`);
        }
    });
    messageCount++;
}, 15000);

setInterval(() => {
    let activeConnections = 0;
    server.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.ping();
            activeConnections++;
        }
    });
    console.log('Active connections:', activeConnections);
}, 5000);

server.on('connection', (ws) => {
        ws.on('pong', () => {
            console.log('Received pong');
    });

    ws.send('Connected to 11-03 WebSocket server');
});


console.log('11-03 WebSocket server running on ws://localhost:4000');
