class Server {
    constructor(id, address, slave) {
        this.id = id;
        this.address = address;
        this.slave = slave;
        this.bids = [];
    }

    addBid(bidId) {
        this.bids.push(bidId);
    }
}

module.exports = Server;