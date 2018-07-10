const request = require('request');

class ServerMonitor {
    constructor(servers, instantiator, logger) {
        this.servers = servers;
        this.instantiator = instantiator;
        this.logger = logger? {log: (msg) => logger.log(msg, "ServerMonitor")} : {log: () => false};
        this.startServers();
        this.startMonitoring();
    }

    startServers() {
        this.logger.log(`Instantiating ${this.servers.length} servers...`);
        this.servers.forEach(server => this.instantiator.instantiate(server));
    }

    startMonitoring() {
        setInterval(this.checkServersStatus.bind(this), 1000);
    }

    checkServersStatus() {
        this.servers.forEach(server => {
            request(server.address + "/healthcheck", (err, res, body) => {
                if(err) {
                    console.log(err);
                    this.logger.log(`Server ${server.id} (${server.address}) is down, resurrecting it...`);
                    //Check for ongoing bids
                    this.instantiator.instantiate(server);
                }
            });
        });
    }
}

module.exports = ServerMonitor;