const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');

const server = new WebSocket.Server({ port: 4000 });
const downloadDir = path.join(__dirname, 'download');

server.on('connection', (ws) => {
  const files = fs.readdirSync(downloadDir);

  files.forEach((file) => {
    const filePath = path.join(downloadDir, file);
    
    const fileStream = fs.createReadStream(filePath);
    
    fileStream.on('data', (chunk) => {
      ws.send(chunk);
    });

    fileStream.on('end', () => {
      console.log('Файл отправлен');
      ws.close();
  });

    fileStream.on('error', (err) => {
      console.error(`Ошибка при чтении файла: ${file}`, err);
    });
  });

});

console.log('WebSocket сервер запущен ://localhost:4000');