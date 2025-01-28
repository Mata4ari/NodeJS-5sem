const http = require('http');
const database = require('./db');
const fs = require('fs');
let db = new database.DB();
const readline = require('readline');
const PORT = 5000;

let serverTimeout;
let commitInterval;
let statsInterval;
let totalRequests = 0;
let totalCommits = 0;
let start;
let finish;


function stopServer(seconds) {
    if (serverTimeout) {
        clearTimeout(serverTimeout);
    }
    if (seconds > 0) {
        serverTimeout = setTimeout(() => {
            console.log("Сервер остановлен.");
            commitInterval.unref();
            statsInterval.unref();
            process.exit(0); 
        }, seconds * 1000);
        console.log(`Сервер будет остановлен через ${seconds} секунд.`);
    }
}

function startCommit(x) {
    if (commitInterval) {
        clearInterval(commitInterval);
    }
    if (x > 0) {
        commitInterval = setInterval(() => {
            totalCommits++;
            db.commit().then((result)=>{console.log(result)})
        }, x * 1000);
        console.log(`Периодическая фиксация состояния БД запущена с интервалом ${x} секунд.`);
    }
}

function startStats(x) {
    if (statsInterval) {
        clearTimeout(statsInterval);
        start = '';
        finish ='';
    }
    if (x > 0) {
        statsInterval = setTimeout(() => {
            console.log(`Сбор статистики завершен. Выполнено запросов: ${totalRequests}, фиксаций: ${totalCommits}.`);
            totalRequests = 0; 
            totalCommits = 0;
        }, x * 1000);
        start = new Date();
        console.log(`Сбор статистики запущен на ${x} секунд.`);
    }
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


rl.on('line', (input) => {
    const [command, param] = input.split(' ');
    const value = parseInt(param);

    switch (command) {
        case 'sd':
            if (isNaN(value)) {
                clearTimeout(serverTimeout);
                console.log("Остановка сервера отменена.");
            } else {
                stopServer(value);
            }
            break;
        case 'sc':
            if (isNaN(value)) {
                clearInterval(commitInterval);
                console.log("Периодическая фиксация остановлена.");
            } else {
                startCommit(value);
            }
            break;
        case 'ss':
            if (isNaN(value)) {
                clearTimeout(statsInterval);
                console.log("Сбор статистики остановлен.");
            } else {
                startStats(value);
            }
            break;
        default:
            console.log("Неизвестная команда.");
    }

});


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
    totalRequests++;

    if (url.pathname === '/api/db') {
        db.emit(req.method, req, res);
    } 
    else if(url.pathname === '/api/ss'&&req.method==='GET'){
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({}))
    }
    else if (url.pathname === '/') {
        let html = fs.readFileSync("index.html", 'utf8');
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(html);
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('incorrect url');
    }
});

server.listen(PORT, () => {
    console.log('start', PORT);
});