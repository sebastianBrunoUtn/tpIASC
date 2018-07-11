const {assert} = require('chai');
const Registry = require("../Registry");

const Server = (id, address = null, bids = null) => ({id, address, bids});

describe('Registry', function() {
    it('should start with no servers', function() {
        const registry = new Registry();

        assert.equal(registry.getServers().length, 0);
    });

    it('should correctly set servers', function() {
        const registry = new Registry();
        const servers = [Server(1), Server(2), Server(3)];

        registry.setServers(servers);

        assert.equal(registry.getServers(), servers);
    });
});