class Router {
    static routeRandomly(servers) {
        return servers.length > 0 ? servers[Math.floor(Math.random() * servers.length)] : false;
    }

    static routeViaOngoingBid(bidId, servers) {
        console.log(bidId);
        console.log(servers);
        const bidServer = servers.find((server) => server.bids.includes(bidId));
        console.log(bidServer);
        return bidServer? bidServer : false;
    }
}

module.exports = Router;