const http = require('http')
const fs = require('fs')
const path = require('path')

const PORT = 5000;

const server = http.createServer((req,res)=>{
    if(req.url==='/fetch'){
        const filePath = path.join(__dirname,'fetch.html');
        fs.readFile(filePath,(err,data)=>{
            if(err){
                res.writeHead(500,{'Content-Type':'text/plain; charset=utf-8'});
                res.end('Ошибка');
                return;
            }
            res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});
            res.end(data);
        })
    }
    else if(req.url==='/api/name'){
        const name = 'Мякинко Матфей Евгеньевич'
        res.writeHead(200,{'Content-Type':'text/plain; charset=utf-8'});
        res.end(name);
    }
    else{
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('пупупу');
    }
})

server.listen(PORT,()=>{
    console.log('start');
})