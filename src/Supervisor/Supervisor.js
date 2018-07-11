const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
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
const serverMonitor = new ServerMonitor(servers, new LocalInstantiator(port), logger);
const loadBalancerCommunicator = new LoadBalancerCommunicator(config.loadBalancer);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
loadBalancerCommunicator.sendServers(servers);

app.post('/new-bid', function (req, res) {
    const server = servers.find((server) => server.id === parseInt(req.body.serverId));
    const bidId = parseInt(req.body.bidId);

    server.addBid(bidId);
    loadBalancerCommunicator.sendServers(servers);

    logger.log(`Added bid #${bidId} to Server #${parseInt(req.body.serverId)}`, "Supervisor");
    res.send(true);
});

app.post('/new-buyer', function (req, res) {
    const sender = servers.find((server) => server.id === parseInt(req.body.serverId));
    if(sender) {
        const buyer = req.body.buyer;
        logger.log(`Synchronizing with servers new buyer received from Server #${sender.id}: ${buyer}`, "Supervisor");
        servers.forEach(server => {
            if(server.id !== sender.id) {
                request.post(server.address + "/add-buyer", {form: {buyer: buyer}},
                    (err, res, body) => {
                        if(err) {
                            logger.log(`Couldn't send new buyer to #${server.id}: ${err}`, "Supervisor");
                        }
                    });
            }
        });
        res.send(true);
    } else {
        res.send(false);
    }
});

app.listen(port, function () {
    console.log('Server listening on port ' + port);
});
