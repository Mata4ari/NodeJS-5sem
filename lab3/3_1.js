const http = require('http')
const fs = require('fs')
const path = require('path')
const readline = require('readline');

let state = 'norm';

const PORT = 5000;

const server = http.createServer((req,res)=>{
    if(req.url==='/'){
        const filePath = path.join(__dirname,'index.html');
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
    else if(req.url==='/state'){
        res.writeHead(200,{'Content-Type':'text/plain; charset=utf-8'});
        res.end(state);
    }
    else{
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('пупупу');
    }
})

server.listen(PORT,()=>{
})

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const promptUser = () => {
    let str =state;
    rl.question(`${state}-->`, (input) => {
        if (['norm', 'stop', 'test', 'idle'].includes(input)) {
            state = input;
            console.log('state='+state)
        } else if (input === 'exit') {
            console.log('Завершение приложения.');
            rl.close();
            process.exit(0);
        } else {
            console.log(`${input}`);
        }
        promptUser(); 
    });
};

promptUser();