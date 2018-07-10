class Server {
    constructor(id, address) {
        this.id = id;
        this.address = address;
        this.ongoingBids = [];
    }

    addOngoingBid(bid) {
        this.ongoingBids.push(bid);
    }

    removeOngoingBid(bidId) {
        const index = this.ongoingBids.findIndex(bid => bid.id === bidId);
        if (index > -1) {
            this.ongoingBids.splice(index, 1);
        }
    }
}

module.exports = Server;