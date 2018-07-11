const {assert} = require('chai');
const Router = require("../Router");

const Server = (id, address = null, bids = null) => ({id, address, bids});
const servers = [Server(1, null, [1, 3]), Server(2, null, [4, 5]), Server(3, null, [2])];

describe('Router', function() {
    it('should randomly choose a server', function() {
        assert.isTrue(servers.includes(Router.routeRandomly(servers)));
    });

    it('should correctly route via an ongoing bid', function() {
        assert.equal(servers[0], Router.routeViaOngoingBid(1, servers));
        assert.equal(servers[2], Router.routeViaOngoingBid(2, servers));
        assert.equal(servers[0], Router.routeViaOngoingBid(3, servers));
        assert.equal(servers[1], Router.routeViaOngoingBid(4, servers));
        assert.equal(servers[1], Router.routeViaOngoingBid(5, servers));
    });

    it('should return false if there are no servers', function() {
        assert.isFalse(servers.includes(Router.routeRandomly([])));
        assert.isFalse(servers.includes(Router.routeViaOngoingBid(666, [])));
    });
});