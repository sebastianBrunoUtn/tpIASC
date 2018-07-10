const { exec } = require('child_process');

class LocalInstantiator {
    static instantiate(server) {
        const port = server.address.split(':');
        exec('node src/Server/Server.js ' + port[2]);
    }
}

module.exports = LocalInstantiator;