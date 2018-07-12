class Bid {
    constructor(tags, basePrice, duration, article, id = null) {
        this.id = id;
        this.tags = tags;
        this.price = basePrice;
        this.startTime = null;
        this.duration = duration;
        this.article = article;
        this.running = false;
        this.finished = false;
        this.cancelled = false;
        this.highestBidder = null;
    }

    static fromJSON(json) {
        const bid = new Bid(json.tags, json.basePrice, json.duration, json.article, json.id);
        bid.startTime = json.startTime;
        bid.running = json.running;
        bid.finished = json.finished;
        bid.cancelled = json.cancelled;
        bid.highestBidder = json.highestBidder;
        return bid;
    }

    run(id) {
        const now = new Date().getTime();
        this.id = id;
        this.running = true;
        this.startTime = this.startTime? this.startTime : now;
        const timeLeft = (this.startTime + this.duration) - now;

        return new Promise((resolve, _) => setTimeout(resolve, timeLeft))
            .then(() => {
                if (this.cancelled) {
                    return Promise.reject("Cancelled bid");
                } else {
                    this.running = false;
                    this.finished = true;
                    return this;
                }
            });
    }

    cancel() {
        this.cancelled = true;
    }

    offer(bidder, price) {
        if(price > this.price) {
            this.price = price;
            this.highestBidder = bidder;
            return true;
        }

        return false;
    }

    isRunning () {
        return this.running && !this.cancelled;
    }
}

module.exports = Bid;