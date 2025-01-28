const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 4000 });

const isAuthorized = (clientId) => {
    return clientId === 2 || clientId === 3;
};

const calculateSquare = (r, a, b) => {
    if (typeof r !== 'undefined' && typeof a === 'undefined' && typeof b === 'undefined') {
        return Math.PI * Math.pow(r, 2);
    } else if (typeof a !== 'undefined' && typeof b !== 'undefined') {
        return a * b;
    }
    return null;
};

const calculateSum = (...args) => {
    return args.reduce((acc, val) => acc + val, 0);
};

const calculateMul = (...args) => {
    return args.reduce((acc, val) => acc * val, 1);
};

const calculateFib = (n) => {
    const fib = [0, 1];
    for (let i = 2; i < n; i++) {
        fib[i] = fib[i - 1] + fib[i - 2];
    }
    return fib.slice(0, n);
};

const calculateFact = (n) => {
    if (n === 0 || n === 1) return 1;
    return n * calculateFact(n - 1);
};

server.on('connection', (ws) => {
    console.log('Client connected');
    ws.on('message', (message) => {
        const { method, params, clientId } = JSON.parse(message);
        let result;

        switch (method) {
            case 'square':
                result = calculateSquare(...params);
                break;
            case 'sum':
                result = calculateSum(...params);
                break;
            case 'mul':
                result = calculateMul(...params);
                break;
            case 'fib':
                if (isAuthorized(clientId)) {
                    result = calculateFib(params[0]);
                } else {
                    result = 'Unauthorized access to protected method fib.';
                }
                break;
            case 'fact':
                if (isAuthorized(clientId)) {
                    result = calculateFact(params[0]);
                } else {
                    result = 'Unauthorized access to protected method fact.';
                }
                break;
            default:
                result = 'Unknown method';
        }

        ws.send(JSON.stringify({ result }));
    });
});

console.log('WebSocket server is running on ws://localhost:4000');
