const express = require('express');
const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');

const app = express();
const wsServer = new WebSocket.Server({port: 4000});

const uploadDir = path.join(__dirname, 'upload');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

wsServer.on('connection', (ws) => {
    console.log('Клиент подключился');

    let fileStream = null;

    ws.on('message', (message, isBinary) => {
        if (isBinary) {
            if (!fileStream) {
                const filePath = path.join(uploadDir, `file_${Date.now()}`);
                fileStream = fs.createWriteStream(filePath);
                console.log(`Начало сохранения файла в ${filePath}`);
            }

            fileStream.write(message);
        } else {
            console.log(`Сообщение от клиента: ${message}`);
        }
    });

    ws.on('close', () => {
        if (fileStream) {
            fileStream.end();
            console.log('Файл успешно сохранен');
        }
        console.log('Клиент отключился');
    });

    ws.on('error', (error) => {
        console.error('Ошибка WebSocket:', error);
    });
});