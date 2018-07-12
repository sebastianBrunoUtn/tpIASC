const { exec } = require('child_process');

class LocalInstantiator {
    constructor(supervisorPort) {
        this.supervisorAddress = "http://localhost:" + supervisorPort;
    }

    instantiateServer(server) {
        const port = server.address.split(':');
        console.log(`node src/Server/Server.js ${server.id} ${this.supervisorAddress} ${server.slave} ${port[2]}`);
        exec(`node src/Server/Server.js ${server.id} ${this.supervisorAddress} ${server.slave} ${port[2]}`);
    }

    instantiateSlave(slave) {
        const port = slave.address.split(':');
        exec(`node src/Server/Slave.js ${slave.id} ${port[2]}`);
    }
}

module.exports = LocalInstantiator;