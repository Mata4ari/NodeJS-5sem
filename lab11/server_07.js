const WebSocket = require('ws');
const readline = require('readline');

const wss = new WebSocket.Server({ port: 4000 });

console.log('WebSocket сервер запущен на порту 4000');

wss.on('connection', (ws) => {
    console.log('Новый клиент подключен');

    ws.on('close', () => {
        console.log('Клиент отключился');
    });
});

wss.on('message', (message) => {
    if (['A', 'B', 'C'].includes(message)) {
        console.log(`Сервер получил уведомление: ${message}`);
    } else {
        console.log('Получено некорректное уведомление');
    }
});
