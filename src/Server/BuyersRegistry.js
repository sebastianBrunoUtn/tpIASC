class BuyersRegistry {
    constructor() {
        this.buyers = new Set();
    }

    addBuyer(buyer) {
        this.buyers.add(buyer);
    }

    addBuyers(buyers) {
        buyers.forEach((buyer) => this.buyers.add(buyer));
    }

    buyerWithNameExists(name) {
        return Array.from(this.buyers).some((buyer) => buyer.name === name);
    }

    getBuyersWithTags(tags) {
        return Array.from(this.buyers).filter((buyer) => buyer.hasAnyTag(tags));
    }
}


module.exports = BuyersRegistry;