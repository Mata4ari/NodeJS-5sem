// client.js
const WebSocket = require('ws');
const readline = require('readline');

const ws = new WebSocket('ws://localhost:4000');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

ws.on('open', () => {
    console.log('Клиент подключен к серверу. Введите A, B или C для отправки уведомления.');

    rl.on('line', (input) => {
        if (['A', 'B', 'C'].includes(input)) {
            ws.send(input);
            console.log(`Клиент отправил уведомление: ${input}`);
        } else {
            console.log('Введите A, B или C для отправки уведомления');
        }
    });
});

ws.on('close', () => {
    console.log('Клиент отключен от сервера');
});

ws.on('error', (error) => {
    console.error('Ошибка WebSocket:', error);
});
