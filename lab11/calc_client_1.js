const WebSocket = require('ws');

const client = new WebSocket('ws://localhost:4000');

client.on('open', () => {
    const requests = [
        { method: 'square', params: [3], clientId: 1 },
        { method: 'square', params: [5, 4], clientId: 1 },
        { method: 'sum', params: [2], clientId: 1 },
        { method: 'sum', params: [2, 4, 6, 8, 10], clientId: 1 },
        { method: 'mul', params: [3], clientId: 1 },
        { method: 'mul', params: [3, 5, 7, 9, 11, 13], clientId: 1 },
        { method: 'fib', params: [1], clientId: 2 },
        { method: 'fib', params: [2], clientId: 2 },
        { method: 'fib', params: [7], clientId: 1 },
        { method: 'fact', params: [0], clientId: 3 },
        { method: 'fact', params: [5], clientId: 3 },
        { method: 'fact', params: [10], clientId: 1 },
    ];

    requests.forEach(request => {
        client.send(JSON.stringify(request));
    });
});

client.on('message', (message) => {
    const response = JSON.parse(message);
    console.log(response.result);
});
