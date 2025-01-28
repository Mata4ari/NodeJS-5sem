const http = require('http');

const server = http.createServer((req, res) => {
    let body = '';

    // Слушаем события получения данных
    req.on('data', chunk => {
        body += chunk.toString(); // Преобразуем Buffer в строку
    });

    // Обрабатываем конец запроса
    req.on('end', () => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');

        // Формируем HTML-ответ с информацией о запросе
        const responseHtml = `
            <h1>Request Information</h1>
            <p><strong>Method:</strong> ${req.method}</p>
            <p><strong>URI:</strong> ${req.url}</p>
            <p><strong>Protocol Version:</strong> ${req.httpVersion}</p>
            <p><strong>Headers:</strong> ${JSON.stringify(req.headers, null, 2)}</p>
            <p><strong>Body:</strong> ${body || 'N/A'}</p>
        `;

        res.end(responseHtml);
    });
});

// Устанавливаем порт для сервера
const PORT = 3000;
server.listen(PORT, () => {
    console.log('start');
});