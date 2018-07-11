const express = require('express');
const bodyParser = require('body-parser');
const Logger = require("../Logger");
const Registry = require("./Registry");
const Router = require("./Router");

const app = express();
const port = process.argv[2]? process.argv[2] : 8080;

const logger = new Logger('./logs/loadBalancer.txt');
const registry = new Registry();
const Server = (id, address = null, bids = null) => ({id, address, bids});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/api/set-servers', function (req, res) {
    logger.log(`Received request to set/update servers: ${req.body.servers}`);
    registry.setServers(JSON.parse(req.body.servers).map(server => Server(server.id, server.address, server.bids)));
    res.send(true);
});

app.post('/buyers', function (req, res) {
	const server = Router.routeRandomly(registry.getServers());
	res.redirect(307, server.address + "/buyer");
});

app.post('/bids', function (req, res) {
    const server = Router.routeRandomly(registry.getServers());
    res.redirect(307, server.address + "/bids");
});

app.post('/bids/:bidId/offer', function (req, res) {
    const bidId = parseInt(req.params.bidId);
    const server = Router.routeViaOngoingBid(bidId, registry.getServers());
    res.redirect(307, server.address + "/bids/" + bidId + "/offer");
});

app.post('/bids/:bidId/cancel', function (req, res) {
    const server = Router.routeViaOngoingBid(req.params.bidId, registry.getServers());
    res.redirect(307, server.address + "/bids/" + req.params.bidId + "/cancel");
});

app.get('/healthcheck', function (req, res) {
    res.send(true);
});

app.listen(port, function () {
  console.log('Load Balancer listening on port ' + port);
});
