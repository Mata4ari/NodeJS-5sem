const WebSocket = require('ws');

const client = new WebSocket('ws://localhost:4000');

client.on('open', () => {
    const requests = [
        { method: 'square', params: [3], clientId: 3 },
        { method: 'square', params: [5, 4], clientId: 3 },
        { method: 'mul', params: [3, 5, 7, 9, 11, 13], clientId: 3 },
        { method: 'fib', params: [7], clientId: 3 },
        { method: 'mul', params: [2, 4, 6], clientId: 3 },
    ];

    let results = {};
    
    requests.forEach(request => {
        client.send(JSON.stringify(request));
    });

    client.on('message', (message) => {
        const response = JSON.parse(message);
        results[response.method] = response.result;

        if (Object.keys(results).length === requests.length) {
            const sum = results['square(3)'] + results['square(5,4)'] + results['mul'];
            const fib = results['fib'];
            const mul = results['mul(2,4,6)'];
            const finalResult = (sum + fib) * mul;
            console.log(`Final Result: ${finalResult}`);
            client.close();
        }
    });
});
