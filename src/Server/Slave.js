const express = require('express');
const bodyParser = require('body-parser');
const Logger = require("../Logger");

const app = express();
const serverId = process.argv[2]? process.argv[2] : 666;
const port = process.argv[3]? process.argv[3] : 8080;

const logger = new Logger(`./logs/slave-${serverId}.txt`);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let buyers = [];
let bids = [];

app.post('/buyers', function (req, res) {
    buyers = JSON.parse(req.body.buyers);
    logger.log(`Received buyers update: ${JSON.stringify(buyers)}`, "Slave");
    res.send(true);
});

app.post('/bids', function (req, res) {
    bids = JSON.parse(req.body.bids);
    logger.log(`Received bids update: ${JSON.stringify(bids)}`, "Slave");
    res.send(true);
});

app.get('/buyers', function (req, res) {
    logger.log(`Received buyers request, sending ${JSON.stringify(buyers)}`, "Slave");
    res.send(JSON.stringify(buyers));
});

app.get('/bids', function (req, res) {
    logger.log(`Received bids request, sending ${JSON.stringify(bids)}`, "Slave");
    res.send(JSON.stringify(bids));
});

app.get('/healthcheck', function (req, res) {
    res.send(true);
});

app.listen(port, function () {
    console.log('Slave listening on port ' + port);
});
