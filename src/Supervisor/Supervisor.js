const express = require('express');
const bodyParser = require('body-parser');
const Logger = require('../Logger');
const Server = require('./Server');
const ServersMonitor = require('./ServerMonitor');
const LocalInstantiator = require('./LocalInstantiator');

const app = express();
const port = process.argv[2]? process.argv[2] : 8080;

const config = require('./config.json');
const servers = config.servers.map(server => new Server(server.id, server.address));
const serversMonitor = new ServersMonitor(servers, LocalInstantiator, new Logger('./logs/supervisor.txt'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/buyer', function (req, res) {
    res.send(true);
});

app.listen(port, function () {
    console.log('Server listening on port ' + port);
});
