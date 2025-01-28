const WebSocket = require('ws');

const client = new WebSocket('ws://localhost:4000');

client.on('open', () => {
    const requests = [
        { method: 'square', params: [3], clientId: 2 },
        { method: 'square', params: [5, 4], clientId: 2 },
        { method: 'sum', params: [2], clientId: 2 },
        { method: 'sum', params: [2, 4, 6, 8, 10], clientId: 2 },
        { method: 'mul', params: [3], clientId: 2 },
        { method: 'mul', params: [3, 5, 7, 9, 11, 13], clientId: 2 },
        { method: 'fib', params: [1], clientId: 2 },
        { method: 'fib', params: [2], clientId: 2 },
        { method: 'fib', params: [7], clientId: 2 },
        { method: 'fact', params: [0], clientId: 2 },
        { method: 'fact', params: [5], clientId: 2 },
        { method: 'fact', params: [10], clientId: 2 },
    ];

    requests.forEach(request => {
        setTimeout(() => {
            client.send(JSON.stringify(request));
        }, Math.random() * 1000);
    });
});

client.on('message', (message) => {
    const response = JSON.parse(message);
    console.log(response.result);
});
