const http = require('http');
const database = require('./db');
const { StringDecoder } = require('string_decoder');
const EventEmitter = require('events');

class DBEventEmitter extends EventEmitter {}

let db = new database.DB();
const dbEmitter = new DBEventEmitter();
const PORT = 5000;

// Обработчики событий для методов
dbEmitter.on('GET', (req, res) => {
    db.select().then((results) => {
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(results));
    });
});

dbEmitter.on('POST', (req, res) => {
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });
    req.on('end', () => {
        const newPerson = JSON.parse(body);
        db.insert(newPerson).then((result) => {
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify(result));
        }).catch((e) => {
            res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ error: 'incorrect id', details: e.message }));
        });
    });
});

dbEmitter.on('PUT', (req, res) => {
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });
    req.on('end', () => {
        const newPerson = JSON.parse(body);
        db.update(newPerson).then((result) => {
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify(result));
        }).catch((e) => {
            res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ error: 'incorrect user', details: e.message }));
        });
    });
});

dbEmitter.on('DELETE', (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    let id = parseInt(url.searchParams.get('id'), 10);
    db.delete(id).then((result) => {
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(result));
    }).catch((e) => {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ error: 'incorrect id', details: e.message }));
    });
});

const server = http.createServer((req, res) => {
    const method = req.method.toUpperCase();

    if (req.url.startsWith('/api/db')) {
        dbEmitter.emit(method, req, res);
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('incorrect url');
    }
});

server.listen(PORT, () => {
    console.log('Server started on port', PORT);
});