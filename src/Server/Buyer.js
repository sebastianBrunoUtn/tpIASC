class Buyer {
    constructor(name, address, tagsOfInterest) {
        this.name = name;
        this.address = address;
        this.tagsOfInterest = tagsOfInterest;
    }

    hasTag(tag) {
        return this.tagsOfInterest.includes(tag);
    }

    hasAnyTag(tags) {
        return tags.some((tag) => this.tagsOfInterest.includes(tag));
    }
}

module.exports = Buyer;