const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:4000');

ws.on('open', () => {
    console.log('Клиент A подключен к серверу');
});

ws.on('message', (message) => {
    if (message.includes('A')) {
        console.log(`Клиент A получил сообщение: ${message}`);
    }
});

ws.on('close', () => {
    console.log('Клиент A отключен от сервера');
});
