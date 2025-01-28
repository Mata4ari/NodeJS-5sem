const http = require('http');

const PORT = 5000;

const server = http.createServer((req,res)=>{
    if(req.url==='/api/name'){
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