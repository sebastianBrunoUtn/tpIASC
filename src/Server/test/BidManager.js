const {assert} = require('chai');
const Logger = require("../../Logger");
const Bid = require("../Bid");
const BidManager = require("../BidManager");

describe('BidManager', function() {
    const logger = new Logger('./logs/bidRunnerTest.txt');
    const noOpNotifierMock = {
        notifyNewBid: () => false,
        notifyNewOffer: () => false,
        notifyCancelledBid: () => false
    };

    it('should return a valid bidId', function() {
        const bidRunner = new BidManager(noOpNotifierMock, logger);
        assert.isNumber(bidRunner.newBid(new Bid([], 0.0, 200, {})));
    });

    it('should notify of a new bid', function(done) {
        const notifierMock = {
            notifyNewBid: () => done()
        };
        const bidRunner = new BidManager(notifierMock, logger);

        bidRunner.newBid(new Bid([], 0.0, 200, {}));
    });

    it('should correctly return if it is running a bid', function() {
        const bidRunner = new BidManager(noOpNotifierMock, logger);
        const bidId = bidRunner.newBid(new Bid([], 0.0, 200, {}));

        assert.isTrue(bidRunner.isRunningBid(bidId));
        assert.isFalse(bidRunner.isRunningBid(666));
    });

    it('should accept an offer if it is higher than the price', function() {
        const bidRunner = new BidManager(noOpNotifierMock, logger);
        const bidId = bidRunner.newBid(new Bid([], 0.0, 200, {}));

        assert.isTrue(bidRunner.offer(bidId, "buyer1", 10));
    });

    it('should deny an offer if it is lower than the price', function() {
        const bidRunner = new BidManager(noOpNotifierMock, logger);
        const bidId = bidRunner.newBid(new Bid([], 10.0, 200, {}));

        assert.isFalse(bidRunner.offer(bidId, "buyer1", 1.0));
    });

    it('should notify of a new higher offer', function(done) {
        const notifierMock = {
            notifyNewBid: () => false,
            notifyNewOffer: () => done()
        };
        const bidRunner = new BidManager(notifierMock, logger);
        const bidId = bidRunner.newBid(new Bid([], 0.0, 200, {}));

        bidRunner.offer(bidId, "buyer1", 10);
    });

    it('should notify of a finished bid', function(done) {
        const notifierMock = {
            notifyNewBid: () => false,
            notifyNewOffer: () => false,
            notifyFinishedBid: () => done()
        };
        const bidRunner = new BidManager(notifierMock, logger);
        const bidId = bidRunner.newBid(new Bid([], 0.0, 200, {}));
    });

    it('should notify of a finished bid with no winner', function(done) {
        const notifierMock = {
            notifyNewBid: () => false,
            notifyNewOffer: () => false,
            notifyFinishedBid: (bid) => {
                assert.isNull(bid.highestBidder);
                done();
            }
        };
        const bidRunner = new BidManager(notifierMock, logger);
        const bidId = bidRunner.newBid(new Bid([], 0.0, 200, {}));
    });

    it('should correctly notify of a finished bid with a winner', function(done) {
        const notifierMock = {
            notifyNewBid: () => false,
            notifyNewOffer: () => false,
            notifyFinishedBid: (bid) => {
                assert.equal(bid.highestBidder, buyerName);
                done();
            }
        };
        const buyerName = "buyerName";
        const bidRunner = new BidManager(notifierMock, logger);
        const bidId = bidRunner.newBid(new Bid([], 0.0, 200, {}));

        bidRunner.offer(bidId, buyerName, 10);
    });

    it('should correctly notify of a finished bid with a winner that offered higher', function(done) {
        const notifierMock = {
            notifyNewBid: () => false,
            notifyNewOffer: () => false,
            notifyFinishedBid: (bid) => {
                assert.equal(bid.highestBidder, buyerName);
                done();
            }
        };
        const buyerName = "buyerName";
        const bidRunner = new BidManager(notifierMock, logger);
        const bidId = bidRunner.newBid(new Bid([], 0.0, 200, {}));

        bidRunner.offer(bidId, "firstBuyer", 10);
        bidRunner.offer(bidId, buyerName, 20);
    });

    it('should correctly return false to isRunningBid if it has ended', function(done) {
        const notifierMock = {
            notifyNewBid: () => false,
            notifyNewOffer: () => false,
            notifyFinishedBid: () => {
                assert.isFalse(bidRunner.isRunningBid(bidId));
                done();
            }
        };
        const bidRunner = new BidManager(notifierMock, logger);
        const bidId = bidRunner.newBid(new Bid([], 0.0, 200, {}));
    });

    it('should correctly cancel a bid', function() {
        const bidRunner = new BidManager(noOpNotifierMock, logger);
        const bidId = bidRunner.newBid(new Bid([], 0.0, 200, {}));

        bidRunner.cancelBid(bidId);

        assert.isFalse(bidRunner.isRunningBid(bidId));
    });

    it('should notify of a cancelled bid', function(done) {
        const notifierMock = {
            notifyNewBid: () => false,
            notifyNewOffer: () => false,
            notifyFinishedBid: () => false,
            notifyCancelledBid: () => done()
        };
        const bidRunner = new BidManager(notifierMock, logger);
        const bidId = bidRunner.newBid(new Bid([], 0.0, 200, {}));

        bidRunner.cancelBid(bidId);
    });
});