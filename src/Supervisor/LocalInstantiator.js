const { exec } = require('child_process');

class LocalInstantiator {
    constructor(supervisorPort) {
        this.supervisorAddress = "http://localhost:" + supervisorPort;
    }

    instantiate(server) {
        const port = server.address.split(':');
        exec(`node src/Server/Server.js ${server.id} ${this.supervisorAddress} ${port[2]}`);
    }
}

module.exports = LocalInstantiator;