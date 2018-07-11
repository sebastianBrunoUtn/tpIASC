const request = require('request');

class LoadBalancerCommunicator {
    constructor(address) {
        this.address = address;
    }

    sendServers(servers) {
        const serversJSON = servers.map(server => ({
            id: server.id,
            address: server.address,
            bids: server.bids.map(bid => bid.id)
        }));

        request.post(this.address + "/api/set-servers", {form: {servers: JSON.stringify(serversJSON)}}, (err, res, body) => {
            if(err) {
                console.log("LoadBalancer unreacheable, please run it before the supervisor!");
            }
        });
    }
}

module.exports = LoadBalancerCommunicator;