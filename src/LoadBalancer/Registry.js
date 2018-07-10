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

    updateServer(updatedServer) {
        const index = this.servers.findIndex((server) => server.id === updatedServer.id);
        if(index !== -1) {
            this.servers[index] = updatedServer;
            return true;
        } else {
            return false;
        }
    }
}

module.exports = Registry;