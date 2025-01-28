const fs = require('fs');
const path = require('path');

const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.png': 'image/png',
    '.docx': 'application/msword',
    '.json': 'application/json',
    '.xml': 'application/xml',
    '.mp4': 'video/mp4'
};

function handleRequest(req, res, staticDir) {
    const filePath = path.join(staticDir, req.url);
    const ext = path.extname(filePath);
    
    if (!mimeTypes[ext]) {
        return res.status(404).send('Not Found');
    }

    fs.readFile(filePath, (err, data) => {
        if (err) {
            return res.status(404).send('File Not Found');
        }

        res.setHeader('Content-Type', mimeTypes[ext]);
        res.send(data);
    });
}

module.exports = { handleRequest };
