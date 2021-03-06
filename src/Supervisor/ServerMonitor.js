const request = require('request');

class ServerMonitor {
    constructor(servers, slaves, instantiator, logger) {
        this.servers = servers;
        this.slaves = slaves;
        this.instantiator = instantiator;
        this.logger = logger? {log: (msg) => logger.log(msg, "ServerMonitor")} : {log: () => false};
        this.startSlaves();
        this.startServers();
        this.startMonitoring();
    }

    startSlaves() {
        this.logger.log(`Instantiating ${this.slaves.length} slaves...`);
        this.slaves.forEach(slave => this.instantiator.instantiateSlave(slave));
    }

    startServers() {
        this.logger.log(`Instantiating ${this.servers.length} servers...`);
        this.servers.forEach(server => this.instantiator.instantiateServer(server));
    }

    startMonitoring() {
        setInterval(this.checkServersStatus.bind(this), 1000);
        setInterval(this.checkSlavesStatus.bind(this), 2000);
    }

    checkServersStatus() {
        this.servers.forEach(server => {
            request(server.address + "/healthcheck", (err, res, body) => {
                if(err) {
                    console.log(err);
                    this.logger.log(`Server ${server.id} (${server.address}) is down, resurrecting it...`);
                    this.instantiator.instantiateServer(server);
                }
            });
        });
    }

    checkSlavesStatus() {
        this.slaves.forEach(slave => {
            request(slave.address + "/healthcheck", (err, res, body) => {
                if(err) {
                    console.log(err);
                    this.logger.log(`Server ${slave.id} (${slave.address}) is down, resurrecting it...`);
                    this.instantiator.instantiateSlave(slave);
                }
            });
        });
    }
}

module.exports = ServerMonitor;