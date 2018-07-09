const express = require('express');
const bodyParser = require('body-parser');
const Logger = require("../Logger");
const Buyer = require("./Buyer");
const BuyersRegistry = require("./BuyersRegistry");
const Bid = require("./Bid");
const BidManager = require("./BidManager");

const app = express();
const port = process.argv[2]? process.argv[2] : 8080;

const logger = new Logger('./logs/server.txt');
const buyersRegistry = new BuyersRegistry(logger);
const noOpNotifierMock = {
    notifyNewBid: () => false,
    notifyNewOffer: () => false,
    notifyFinishedBid: () => false,
    notifyCancelledBid: () => false
};
const bidManager = new BidManager(noOpNotifierMock, logger);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/buyer', function (req, res) {
    buyersRegistry.addBuyer(new Buyer(req.body.name, req.body.address, JSON.parse(req.body.tags)));
    res.send(true);
});

app.post('/buyers', function (req, res) {
    const buyersJSON = JSON.parse(req.body.buyers);
    buyersRegistry.addBuyers(buyersJSON.map((buyerJSON) => new Buyer(buyerJSON.name, buyerJSON.address, buyerJSON.tags)));
    res.send(true);
});

app.post('/bids', function (req, res) {
    const bid = new Bid(JSON.parse(req.body.tags), parseFloat(req.body.price), parseInt(req.body.duration), JSON.parse(req.body.article));
    bidManager.newBid(bid);
    res.send(bid.id.toString());
});

// Próxima versión: Asegurarse de que sea el que la creó el que puede cancelarla.
app.post('/bids/:bidId/cancel', function (req, res) {
    bidManager.cancelBid(parseInt(req.params.bidId));
    res.send(true);
});

// Próxima versión: Chequear quién es el bidder via address
app.post('/bids/:bidId/offer', function (req, res) {
    const result = bidManager.offer(parseInt(req.params.bidId), req.body.bidder, parseFloat(req.body.price));
    res.send(result);
});

app.listen(port, function () {
    console.log('Server listening on port ' + port);
});
