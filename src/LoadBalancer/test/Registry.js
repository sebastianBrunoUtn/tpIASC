const {assert} = require('chai');
const Registry = require("../Registry");

const Server = (id, address = null, ongoingBids = null) => ({id, address, ongoingBids});

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

    it('should correctly update server', function() {
        const registry = new Registry();
        const servers = [Server(1, "old address"), Server(2), Server(3)];
        const updatedServer = Server(1, "new address");

        registry.setServers(servers);
        registry.updateServer(updatedServer);

        assert.isTrue(registry.getServers().includes(updatedServer));
    });

    it('should return false if the updated server does not exist', function() {
        const registry = new Registry();
        const servers = [Server(1, "old address"), Server(2), Server(3)];
        const updatedServer = Server(4, "new address");

        registry.setServers(servers);


        assert.isFalse(registry.updateServer(updatedServer));
    });
});