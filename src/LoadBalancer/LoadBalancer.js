const express = require('express');
const bodyParser = require('body-parser');
const Registry = require("./Registry");
const Router = require("./Router");

const app = express();
const port = process.argv[2]? process.argv[2] : 8080;

const registry = new Registry();
const Server = (id, address = null, ongoingBids = null) => ({id, address, ongoingBids});
const servers = [Server(1, "http://localhost:8009", [1, 3]), Server(2, "https://twitter.com", [4, 5]), Server(3, "https://dev.to", [2])];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/api/set-servers', function (req, res) {
    registry.setServers(JSON.parse(req.body.servers));
    res.send(true);
});

app.post('/api/update-server', function (req, res) {
    registry.updateServer(JSON.parse(req.body.server));
    res.send(true);
});

app.post('/buyers', function (req, res) {
	const server = Router.routeRandomly(registry.getServers());
	res.send(307, server.address + "/buyer");
});

app.post('/bids', function (req, res) {
    const server = Router.routeRandomly(servers);
    res.redirect(307, servers[0].address + "/bids");
});

app.post('/bids/:bidId/offer', function (req, res) {
    const server = Router.routeViaOngoingBid(req.params.bidId, servers);
    res.redirect(307, servers[0].address + "/bids/" + req.params.bidId + "/offer");
});

app.post('/bids/:bidId/cancel', function (req, res) {
    const server = Router.routeViaOngoingBid(req.params.bidId, servers);
    res.redirect(307, servers[0].address + "/bids/" + req.params.bidId + "/cancel");
});

app.get('/healthcheck', function (req, res) {
    res.send(true);
});

app.listen(port, function () {
  console.log('Load Balancer listening on port ' + port);
});
