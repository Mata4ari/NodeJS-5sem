const http = require('http');
const database = require('./db');
const fs = require('fs');
let db = new database.DB();
const PORT = 5000;


db.on('GET', (req, res) => {
    db.select().then((results) => {
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(results));
    });
});

db.on('POST', (req, res) => {
    req.on('data', (data) => {
        const newPerson = JSON.parse(data);
        db.insert(newPerson).then((result) => {
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify(result));
        })
        .catch((e) => {
            res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ error: 'incorrect id', details: e.message }));
        });
    });
});

db.on('PUT', (req, res) => {
    req.on('data', (data) => {
        const newPerson = JSON.parse(data);
        db.update(newPerson).then((result) => {
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify(result));
        })
        .catch((e) => {
            res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ error: 'incorrect user', details: e.message }));
        });
    });
});

db.on('DELETE', (req, res) => {
    let id = parseInt(new URL(req.url, `http://${req.headers.host}`).searchParams.get('id'), 10);
    db.delete(id).then((result) => {
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(result));
    })
    .catch((e) => {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ error: 'incorrect id', details: e.message }));
    });
});

const server = http.createServer((req, res) => {
    let url = new URL(req.url, `http://${req.headers.host}`);

    if (url.pathname === '/api/db') {
        db.emit(req.method, req, res);
    } else if (url.pathname === '/') {
        let html = fs.readFileSync("index.html", 'utf8');
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(html);
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('incorrect url');
    }
});

server.listen(PORT, () => {
    console.log('Server started on port', PORT);
});