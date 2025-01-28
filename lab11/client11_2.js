const WebSocket = require('ws');
const fs = require('fs');

const ws = new WebSocket('ws://localhost:4000');

ws.on('open', () => {
    console.log('Подключено к серверу');
});

ws.on('message', (data) => {
    if (typeof data === 'string') {
        console.log(`Сообщение от сервера: ${data}`);
    } else {
        const fileName = `received_file_${Date.now()}`;
        
        fs.writeFile(fileName, data, { flag: 'wx' }, (err) => {
            if (err) {
                console.error(`Ошибка при записи файла: ${err}`);
            } else {
                console.log(`Файл сохранён как: ${fileName}`);
            }
        });
    }
});

ws.on('close', () => {
    console.log('Соединение закрыто');
});

ws.on('error', (error) => {
    console.error(`Ошибка: ${error.message}`);
});