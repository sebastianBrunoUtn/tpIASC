class Server {
    constructor(id, address) {
        this.id = id;
        this.address = address;
        this.ongoingBids = [];
    }

    addOngoingBid(bidId) {
        this.ongoingBids.push(bidId);
    }

    removeOngoingBid(bidId) {
        const index = this.ongoingBids.indexOf(bidId);
        if (index > -1) {
            this.ongoingBids.splice(index, 1);
        }
    }
}

module.exports = Server;