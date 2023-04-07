const http = require('node:http');

PORT = 3000;
HOST = 'localhost';

const server = http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({message: 'ok'}));
});

server.listen(PORT, HOST, () => {
    console.log(`Server is running on http://${PORT}:${HOST}`);
});