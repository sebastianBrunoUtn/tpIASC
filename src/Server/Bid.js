class Bid {
    constructor(tags, basePrice, duration, article, id = null) {
        this.id = id;
        this.tags = tags;
        this.price = basePrice;
        this.startTime = null;
        this.duration = duration;
        this.article = article;
        this.running = true;
        this.cancelled = false;
        this.highestBidder = null;
    }

    run(id) {
        this.id = id;
        this.startTime = new Date().getTime();

        return new Promise((resolve, _) => setTimeout(resolve, this.duration))
            .then(() => {
                if (this.cancelled) {
                    return Promise.reject("Cancelled bid");
                } else {
                    this.running = false;
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

    /*

    isFinished = () => !this.running && !this.cancelled && this.id;

    isCancelled = () => this.cancelled;*/
}

module.exports = Bid;