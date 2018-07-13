class BidManager {
    constructor(notifier, slaveCommunicator = null, logger = null) {
        this.notifier = notifier;
        this.slaveCommunicator = slaveCommunicator;
        this.logger = logger? {log: (msg) => logger.log(msg, "BidManager")} : {log: () => false};
        this.bids = new Map();
    }

    newBid(bid) {
        const bidId = Math.floor(Math.random() * 100000);   //Próxima versión: Se puede llevar un registro global de IDs.

        bid.run(bidId, this.logger)
            .then(() => {
                this.notifier.notifyFinishedBid(bid);
                this.slaveCommunicator.updateBids(this.getBids());
                this.logger.log(`Bid #${bidId} finished: ${JSON.stringify(bid)}`);
            })
            .catch(() => this.logger.log(`Bid #${bidId} ended but it was cancelled`));

        this.bids.set(bidId, bid);
        this.logger.log(`New bid #${bidId}: ${JSON.stringify(bid)}`);
        this.notifier.notifyNewBid(bid);

        return bidId;
    }

    loadBidFromSlave(bid) {
        if(!bid.cancelled && !bid.finished) {
            this.logger.log(`Adding 5 seconds to #${bid.id}: ${bid.startTime} -> ${bid.startTime + 5000}`);
            bid.startTime += 5000;

            this.logger.log(`Resuming pending bid #${bid.id}: ${JSON.stringify(bid)}`);
            bid.run(bid.id, this.logger)
                .then(() => {
                    this.notifier.notifyFinishedBid(bid);
                    this.logger.log(`Bid #${bid.id} finished: ${JSON.stringify(bid)}`);
                    this.slaveCommunicator.updateBids(this.getBids());
                })
                .catch();
        }

        this.bids.set(bid.id, bid);
        this.slaveCommunicator.updateBids(this.getBids());
        this.logger.log(`Loaded bid from slave #${bid.id}: ${JSON.stringify(bid)}`);
    }

    offer(bidId, bidder, price) {
        const bid = this.getBid(bidId);
        if(!bid || !bid.isRunning()) {
            return false;
        }

        const result = bid.offer(bidder, price);
        if(result) {
            this.notifier.notifyNewOffer(bid);
            this.logger.log(`New offer on bid #${bidId}: ${JSON.stringify(bid)}`);
        }

        return result;
    }

    cancelBid(bidId) {
        const bid = this.getBid(bidId);
        if(bid) {
            bid.cancel();
            this.notifier.notifyCancelledBid(bid);
            this.logger.log(`Bid #${bidId} cancelled`);
        }
    }

    getBids() {
        return Array.from(this.bids.values());
    }

    getBid(bidId) {
        const bid = this.bids.get(bidId);
        return typeof(bid) !== "undefined"? bid : false;
    }
}

module.exports = BidManager;