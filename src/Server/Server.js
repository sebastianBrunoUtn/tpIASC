const express = require('express');
const bodyParser = require('body-parser');
const Logger = require("../Logger");
const Notifier = require("./Notifier");
const SlaveCommunicator = require("./SlaveCommunicator");
const Buyer = require("./Buyer");
const BuyersRegistry = require("./BuyersRegistry");
const Bid = require("./Bid");
const BidManager = require("./BidManager");

const app = express();
const serverId = process.argv[2]? process.argv[2] : 666;
const supervisorAddress = process.argv[3]? process.argv[3] : "http://localhost:8009";
const slaveAddress = process.argv[4]? process.argv[4] : false;
const port = process.argv[5]? process.argv[5] : 8080;

const logger = new Logger(`./logs/server-${serverId}.txt`);
const buyersRegistry = new BuyersRegistry(logger);
const slaveCommunicator = new SlaveCommunicator(slaveAddress, logger);

slaveCommunicator.getBuyers(buyers =>
    buyersRegistry.addBuyers(buyers.map(buyer => new Buyer(buyer.name, buyer.address, buyer.tagsOfInterest))));
const notifier = new Notifier(serverId, supervisorAddress, buyersRegistry, logger);
const bidManager = new BidManager(notifier, slaveCommunicator, logger);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

slaveCommunicator.getBids(bids => bids.forEach(bid => bidManager.loadBidFromSlave(Bid.fromJSON(bid))));

app.post('/buyer', function (req, res) {
    const buyer = new Buyer(req.body.name, req.body.address, JSON.parse(req.body.tags));
    buyersRegistry.addBuyer(buyer);
    notifier.notifyNewBuyer(buyer);
    slaveCommunicator.updateBuyers(buyersRegistry.getBuyers());
    res.send(true);
});

app.post('/add-buyer', function (req, res) {
    logger.log(`Received new buyer from Supervisor: ${req.body.buyer}`, "Server");
    const receivedBuyer = JSON.parse(req.body.buyer);
    const buyer = new Buyer(receivedBuyer.name, receivedBuyer.address, receivedBuyer.tagsOfInterest);
    buyersRegistry.addBuyer(buyer);
    slaveCommunicator.updateBuyers(buyersRegistry.getBuyers());
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
    slaveCommunicator.updateBids(bidManager.getBids());
    res.send(bid.id.toString());
});

app.get('/bids/:bidId', function (req, res) {
    const bid = bidManager.getBid(parseInt(req.params.bidId));
    if(bid) {
        res.send(bid);
    } else {
        res.status(404);
    }
});

// Próxima versión: Asegurarse de que sea el que la creó el que puede cancelarla.
app.post('/bids/:bidId/cancel', function (req, res) {
    bidManager.cancelBid(parseInt(req.params.bidId));
    slaveCommunicator.updateBids(bidManager.getBids());
    res.send(true);
});

// Próxima versión: Chequear quién es el bidder via address
app.post('/bids/:bidId/offer', function (req, res) {
    const result = bidManager.offer(parseInt(req.params.bidId), req.body.bidder, parseFloat(req.body.price));
    slaveCommunicator.updateBids(bidManager.getBids());
    res.send(result);
});

app.get('/healthcheck', function (req, res) {
    res.send(true);
});

app.post('/kill', function (req, res) {
    try {
        process.exit();
    } catch(err) {
        logger.log("Trying to kill but couldnt beacuse " + err);
    }
});

app.listen(port, function () {
    console.log('Server listening on port ' + port);
});
