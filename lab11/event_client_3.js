const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:4000');

ws.on('open', () => {
    console.log('Клиент C подключен к серверу');
});

ws.on('message', (message) => {
    if (message.includes('C')) {
        console.log(`Клиент C получил сообщение: ${message}`);
    }
});

ws.on('close', () => {
    console.log('Клиент C отключен от сервера');
});
