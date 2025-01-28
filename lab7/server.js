const express = require('express');
const path = require('path');
const cors = require('cors');
const m07_01 = require('./m07-01');

const app = express();
const port = 3000;

const staticDir = path.join(__dirname, 'static');

app.use(cors());

app.get('/*', (req, res) => {
    m07_01.handleRequest(req, res, staticDir);
});

app.all('*', (req, res) => {
    res.status(405).send('Method Not Allowed');
});

app.listen(port, () => {
    console.log(`${port}`);
});
