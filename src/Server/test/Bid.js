const Bid = require("../Bid");

describe('Bid', function() {
    it('should correctly run a bid', function(done) {
        const bid = new Bid([], 0.0, 500, {});
        bid.run(666).then(() => done());
    });

    it('should throw error if the bid was cancelled', function(done) {
        const bid = new Bid([], 0.0, 500, {});
        bid.run(666)
            .then(() => {})
            .catch(() => done());

        bid.cancel();
    });
});