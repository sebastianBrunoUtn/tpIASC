const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

const app = express();
const server = process.argv[2]? process.argv[2] : "http://localhost:8000";
const name = process.argv[3]? process.argv[3] : "Generic Client";
const port = process.argv[4]? process.argv[4] : 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/register', function (req, res) {
    console.log("Registrando cliente");
    request({followAllRedirects: true, uri: server + "/buyers", method: 'POST',
        form: {name: name, address: "http://localhost:"+port, tags: req.body.tags}}, (err, ress, body) => {
        if(err) {
            console.log(err);
        }
        res.send(true);
    });
});

app.post('/post-bid', function (req, res) {
    console.log("Publicando nueva subasta");
    request({followAllRedirects: true, uri: server + "/bids", method: 'POST',
        form: {article: req.body.article, price: req.body.price, duration: req.body.duration,  tags: req.body.tags}}, (err, ress, body) => {
        if(err) {
            console.log(err);
        }
        res.send(body);
    });
});

app.post('/bids/:bidId/cancel', function (req, res) {
    console.log("Cancelando Bid");
    request({followAllRedirects: true, uri: server + "/bids/"+req.params.bidId+"/cancel", method: 'POST',
        form: {bidId: req.body.bidId}}, (err, ress, body) => {
        if(err) {
            console.log(err);
        }
        res.send(body);
    });
});

app.post('/bids/:bidId/offer', function (req, res) {
    console.log("Publicando Nueva Oferta");
    console.log(name);
    request({followAllRedirects: true, uri: server + "/bids/"+req.params.bidId+"/offer", method: 'POST',
        form: {bidId: req.body.bidId, bidder: name, price: req.body.price}}, (err, ress, body) => {
        if(err) {
            console.log(err);
        }
        res.send(body);
    });
});

app.post('/', function (req, res) {
    console.log("Recibida notificación");
    console.log(req.body.notification);
});

app.listen(port, function () {
    console.log('Client listening on port ' + port);
});
