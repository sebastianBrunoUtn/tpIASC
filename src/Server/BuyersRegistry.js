class BuyersRegistry {
    constructor(logger = null) {
        this.buyers = new Set();
        this.logger = logger? {log: (msg) => logger.log(msg, "BuyersRegistry")} : {log: () => false};
    }

    addBuyer(buyer) {
        this.buyers.add(buyer);
        this.logger.log(`Registered buyer ${buyer.name} : ${JSON.stringify(buyer)}`);
    }

    addBuyers(buyers) {
        buyers.forEach((buyer) => this.addBuyer(buyer));
    }

    buyerWithNameExists(name) {
        return Array.from(this.buyers).some((buyer) => buyer.name === name);
    }

    getBuyers() {
        return Array.from(this.buyers);
    }

    getBuyersWithTags(tags) {
        return Array.from(this.buyers).filter((buyer) => buyer.hasAnyTag(tags));
    }
}


module.exports = BuyersRegistry;