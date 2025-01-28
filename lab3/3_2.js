const http = require('http')
const fs = require('fs')
const path = require('path')


const PORT = 5000;

const server = http.createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    
    if (url.pathname === '/fact') {
        const k = parseInt(url.searchParams.get('k'), 10); 

        if (isNaN(k)) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Параметр k должен быть числом.' }));
            return;
        }

        const fact = factorial(k); 

        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ k: k, fact: fact })); 
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Неизвестный путь.' }));
    }
});

server.listen(PORT,()=>{
    console.log('start')
})

const factorial = (n) => {
    if (n < 0) return null; 
    if (n === 0 || n === 1) return 1;
    return n * factorial(n - 1);
};
