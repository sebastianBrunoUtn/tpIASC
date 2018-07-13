const request = require('request');

class Notifier {
    constructor(serverId, supervisorAddress, buyersRegistry, logger = false) {
        this.serverId = serverId;
        this.supervisorAddress = supervisorAddress;
        this.buyersRegistry = buyersRegistry;
        this.logger = logger? {log: (msg) => logger.log(msg, "Notifier")} : {log: () => false};
    }

    notifyNewBuyer(buyer) {
        this.logger.log(`Notifying Supervisor about new buyer ${buyer.name}`);
        request.post(this.supervisorAddress + "/new-buyer", {form: {buyer: JSON.stringify(buyer), serverId: this.serverId}},
            (err, res, body) => {
                if(err) {
                    this.logger.log(`Error notifying supervisor: ${err}`);
                }
        });
    }

    notifyNewBid(bid)  {
        this.logger.log(`Notifying about new bid ${bid.id}`);
        this.notifyNewBidToSupervisor(bid);
        this.notifyNewBidToBuyers(bid);
    }

    notifyNewBidToSupervisor(bid) {
        this.logger.log(`Notifying Supervisor: ${this.supervisorAddress + "/new-bid"}`);
        request.post(this.supervisorAddress + "/new-bid", {form: {bidId: bid.id, serverId: this.serverId}},
            (err, res, body) => {
                if(err) {
                    this.logger.log(`Error notifying supervisor: ${err}`);
                }
            });
    }

    notifyNewBidToBuyers(bid) {
        const buyers = this.buyersRegistry.getBuyersWithTags(bid.tags);
        this.logger.log(`Notifying buyers...`);
        buyers.forEach(buyer => this.notifyBuyer(buyer, {event: "New bid", bid: bid}));
    }

    notifyNewOffer(bid) {
        const buyers = this.buyersRegistry.getBuyersWithTags(bid.tags);
        this.logger.log(`Notifying buyers about new offer`);
        buyers.forEach(buyer => this.notifyBuyer(buyer, {event: "New offer", bid: bid}));
    }

    notifyFinishedBid(bid) {
        const buyers = this.buyersRegistry.getBuyersWithTags(bid.tags);
        this.logger.log(`Notifying buyers about finished bid`);
        buyers.forEach(buyer => this.notifyBuyer(buyer, {event: "Finished bid", bid: bid}));
    }

    notifyCancelledBid(bid) {
        const buyers = this.buyersRegistry.getBuyersWithTags(bid.tags);
        this.logger.log(`Notifying buyers about cancelled bid`);
        buyers.forEach(buyer => this.notifyBuyer(buyer, {event: "Cancelled bid", bid: bid}));
    }

    notifyBuyer(buyer, notification) {
        this.logger.log(`Notifying buyer: ${JSON.stringify(buyer)}`);
        request.post(buyer.address, {form: {notification: notification}},
            (err, res, body) => {
                if(err) {
                    this.logger.log(`Error notifying buyer: ${err}`);
                }
                this.logger.log(body);
            });
    }
}

module.exports = Notifier;