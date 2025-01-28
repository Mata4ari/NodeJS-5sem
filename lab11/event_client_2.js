const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:4000');

ws.on('open', () => {
    console.log('Клиент B подключен к серверу');
});

ws.on('message', (message) => {
    if (message.includes('B')) {
        console.log(`Клиент B получил сообщение: ${message}`);
    }
});

ws.on('close', () => {
    console.log('Клиент B отключен от сервера');
});
