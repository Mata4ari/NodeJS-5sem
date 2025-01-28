const WebSocket = require('ws');

const clientName = process.argv[2] || 'DefaultClient';
const ws = new WebSocket('ws://localhost:4000');

ws.on('open', () => {
    console.log('Connected to 11-04 WebSocket server');
    const timestamp = new Date().toISOString();
    ws.send(JSON.stringify({ client: clientName, timestamp }));
});

ws.on('message', (message) => {
    try {
        const response = JSON.parse(message);
        console.log('Response from server:', response);
    } catch (error) {
        console.log('Message from server:', message.toString());
    }
});
