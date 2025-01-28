// app.js
const WebSocket = require('ws');
const readline = require('readline');

const wss = new WebSocket.Server({ port: 4000 });

console.log('WebSocket сервер запущен на порту 4000');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

wss.on('connection', (ws) => {
    console.log('Новый клиент подключен');

    ws.on('close', () => {
        console.log('Клиент отключился');
    });
});

rl.on('line', (input) => {
    if (['A', 'B', 'C'].includes(input)) {
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(`Событие ${input}`);
            }
        });
    } else {
        console.log('Введите A, B или C для генерации события');
    }
});
