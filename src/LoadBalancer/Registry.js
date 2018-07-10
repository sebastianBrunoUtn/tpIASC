class Registry {
    constructor() {
        this.servers = [];
    }

    getServers() {
        return this.servers;
    }

    setServers(servers) {
        this.servers = servers;
    }
}

module.exports = Registry;