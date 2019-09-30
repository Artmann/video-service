const bodyParser = require('body-parser');
const express = require('express');
const fs = require('fs');
const helmet = require('helmet');
const { JSONRPCServer } = require('json-rpc-2.0');
const morgan = require('morgan');
const { join } = require('path');
const { Converter }  = require('showdown');

const findVideo = require('./endpoints/find-video');

const server = new JSONRPCServer();
const app = express();

server.addMethod('findVideo', findVideo);

app.use(bodyParser.json());
app.use(helmet());
app.use(morgan('combined'));

app.get('/', function (request, response) {
  const path = join(__dirname, '..', 'README.md');
  const content = fs.readFileSync(path, { encoding: 'utf8' });
  const converter = new Converter();
  const html = converter.makeHtml(content);

  response.set('Content-Type', 'text/html');
  response.send(Buffer.from(html));
});

app.post('/json-rpc', (req, res) => {
  const jsonRPCRequest = req.body;
  // server.receive takes a JSON-RPC request and returns a promise of a JSON-RPC response.
  server.receive(jsonRPCRequest).then(jsonRPCResponse => {
    if (jsonRPCResponse) {
      res.json(jsonRPCResponse);
    } else {
      // If response is absent, it was a JSON-RPC notification method.
      // Respond with no content status (204).
      res.sendStatus(204);
    }
  });
});

const port = process.env['PORT'] || 3000;

app.listen(port, function () {
  console.log(`Listening on port ${port}!`);
});
