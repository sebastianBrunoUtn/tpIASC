class Server {
    constructor(id, address) {
        this.id = id;
        this.address = address;
        this.bids = [];
    }

    addBid(bidId) {
        this.bids.push(bidId);
    }
}

module.exports = Server;