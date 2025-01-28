const express = require('express');
const bodyParser = require('body-parser')
const multer = require('multer')
const fs = require('fs')
const path = require('path')
const xml2js = require('xml2js')
const port = 3000;

const app = express()
const upload = multer({dest: 'static/'})

let keepAliveTimeout = 5000;

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Задание 01
app.get('/connection', (req, res) => {
    res.send(`Current KeepAliveTimeout: ${keepAliveTimeout}`);
});

app.get('/connection/set=:set', (req, res) => {
    keepAliveTimeout = parseInt(req.params.set, 10);
    res.send(`New KeepAliveTimeout value set to: ${keepAliveTimeout}`);
});

// Задание 02
app.get('/headers', (req, res) => {
    res.set('X-Custom-Headers', 'MyCustomHeaderValue');
    res.send({ requestHeaders: req.headers, responseHeaders: res.getHeaders() });
});

// Задание 03
app.get('/parameter', (req, res) => {
    const {x, y} = req.query;
    const numX = parseFloat(x);
    const numY = parseFloat(y);

    if(!isNaN(numX) && !isNaN(numY)) {
        res.send({
            sum: numX + numY,
            diff: numX - numY,
            multi: numX * numY,
            quotient: numY !== 0 ? numX / numY : 'Cannot divide by zero',
        });
    }
    else {
        res.status(400).send('Invalid parameters. Please provide valid numbers.');
    }
});

// Задание 04
app.get('/parameter/:x/:y', (req, res) => {
    const x = req.params.x;
    const y = req.params.y;
    const numX = parseFloat(x);
    const numY = parseFloat(y);
    
    if (!isNaN(numX) && !isNaN(numY)) {
        res.send({
            sum: numX + numY,
            difference: numX - numY,
            product: numX * numY,
            quotient: numY !== 0 ? numX / numY : 'Cannot divide by zero',
        });
    } else {
        res.send(req.originalUrl);
    }
});

// Задание 5
app.get('/close', (req, res) => {
    res.send('Server will close in 10 seconds...');
    setTimeout(() => {
        process.exit();
    }, 10000);
});

// Задание 6
app.get('/socket', (req, res) => {
    const clientIp = req.ip;
    const clientPort = req.socket.remotePort;
    const serverIp = req.socket.localAddress;
    const serverPort = req.socket.localPort;

    res.send({ clientIp, clientPort, serverIp, serverPort });
});

// Задание 7
app.get('/req-data', (req, res) => {
    res.send('Data received in chunks: ' + req.headers['content-length']);
})

// Задание 8
app.get('/resp-status', (req, res) => {
    const code = req.query.code;
    const message = req.query.mess;

    if (!code || !message) {
        return res.status(400).send('Missing code or message');
    }

    const statusCode = parseInt(code, 10);
    if (isNaN(statusCode) || statusCode < 100 || statusCode > 599) {
        return res.status(400).send('Invalid status code');
    }

    res.status(statusCode).send(message);
});

// Задание 9
app.post('/formparameter', (req, res) => {
    res.send(req.body);
});

// Задание 10
app.post('/json', (req, res) => {
    const { x, y, s, o, m } = req.body;

    const response = {
        'x+y': x + y,
        'Concatenation_s_o': s + o,
        'Length_m': m.length,
    };

    res.json(response);
});

// Задание 11
app.post('/xml', (req, res) => {
    let body = '';

    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', () => {
        xml2js.parseString(body, (err, result) => {
            if (err) {
                res.status(400).send('Invalid XML');
                return;
            }

            const xValues = result.request.x || []; 
            const mValues = result.request.m || [];

            const sumX = xValues.reduce((acc, val) => acc + parseFloat(val.$.value), 0);
            const concatM = mValues.reduce((acc, val) => acc + val.$.value, '');

            const builder = new xml2js.Builder();
            const xmlResponse = builder.buildObject({
                response: {
                    sum: { $: { value: sumX } },
                    concat: { $: { value: concatM } },
                }
            });

            res.type('application/xml').send(xmlResponse);
        });
    });
});

// Задание 12
app.get('/files', (req, res) => {
    fs.readdir('static', (err, files) => {
        if (err) {
            return res.status(500).send('Error reading directory');
        }
        res.set('X-static-files-count', files.length.toString());
        res.send(`Number of static files: ${files.length}`);
    });
});

// Задание 13
app.get('/files/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, 'static', filename);
    
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            return res.status(404).send('File not found');
        }
        res.sendFile(filePath);
    });
});

// Задание 14
app.get('/upload', (req, res) => {
    res.send(`
        <form action="/upload" method="post" enctype="multipart/form-data">
            <input type="file" name="file" /><br/>
            <input type="submit" value="Upload" />
        </form>
    `);
});

app.post('/upload', upload.single('file'), (req, res) => {
    res.send(`File uploaded: ${req.file.originalname}`);
});

app.listen(port, () => {
    console.log(`${port}`);
});