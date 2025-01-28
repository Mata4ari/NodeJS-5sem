const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'example.txt');

const ws = new WebSocket('ws://localhost:4000');

ws.on('open', () => {
    console.log('Соединение с сервером установлено');

    if (fs.existsSync(filePath)) {
        const fileStream = fs.createReadStream(filePath);

        fileStream.on('data', (chunk) => {
            ws.send(chunk, { binary: true });
        });

        fileStream.on('end', () => {
            console.log('Файл отправлен');
            ws.close();
        });
    } else {
        console.error('Файл для отправки не найден');
        ws.close();
    }
});

ws.on('message', (message) => {
    console.log(`Ответ от сервера: ${message}`);
});

ws.on('close', () => {
    console.log('Соединение с сервером закрыто');
});

ws.on('error', (error) => {
    console.error('Ошибка WebSocket:', error);
});
