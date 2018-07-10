class Router {
    static routeRandomly(servers) {
        return servers.length > 0 ? servers[Math.floor(Math.random() * servers.length)] : false;
    }

    static routeViaOngoingBid(bidId, servers) {
        const bidServer = servers.find((server) => server.ongoingBids.includes(bidId));
        return bidServer? bidServer : false;
    }
}

module.exports = Router;