const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:4000');

ws.on('open', () => {
    console.log('Connected to 11-03 WebSocket server');
});

ws.on('message', (message) => {
    console.log('Message from server:', message.toString());
});

ws.on('ping', () => {
    console.log('Received ping');
    ws.pong();
});
