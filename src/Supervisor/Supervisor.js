const express = require('express');
const bodyParser = require('body-parser');
const Logger = require('../Logger');
const Server = require('./Server');
const ServerMonitor = require('./ServerMonitor');
const LocalInstantiator = require('./LocalInstantiator');
const LoadBalancerCommunicator = require('./LoadBalancerCommunicator');

const app = express();
const port = process.argv[2]? process.argv[2] : 8080;

const config = require('./config.json');
const logger = new Logger('./logs/supervisor.txt');
const servers = config.servers.map(server => new Server(server.id, server.address));
const serverMonitor = new ServerMonitor(servers, LocalInstantiator, logger);
const loadBalancerCommunicator = new LoadBalancerCommunicator(config.loadBalancer);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
loadBalancerCommunicator.sendServers(servers);

app.post('/new-bid', function (req, res) {
    const server = servers.find((server) => server.id === parseInt(req.body.serverId));
    const bid = JSON.parse(req.body.bid);

    server.addOngoingBid(bid);
    loadBalancerCommunicator.sendServers(servers);

    logger.log(`Added bid #${parseInt(bid.id)} to Server #${parseInt(req.body.serverId)}`, "Supervisor");
    res.send(true);
});

app.listen(port, function () {
    console.log('Server listening on port ' + port);
});
