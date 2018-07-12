const request = require('request');

class SlaveCommunicator {
    constructor(slave, logger = false) {
        this.slave = slave;
        this.logger = logger? {log: (msg) => logger.log(msg, "SlaveCommunicator")} : {log: () => false};
    }

    updateBuyers(buyers) {
        this.logger.log(`Updating buyers on slave... ${JSON.stringify(buyers)}`);
        request.post(this.slave + "/buyers", {form: {buyers: JSON.stringify(buyers)}},
            (err, res, body) => {
                if(err) {
                    this.logger.log(`Error notifying slave: ${err}`);
                }
            });
    }

    updateBids(bids) {
        this.logger.log(`Updating bids on slave... ${JSON.stringify(bids)}`);
        request.post(this.slave + "/bids", {form: {bids: JSON.stringify(bids)}},
            (err, res, body) => {
                if(err) {
                    this.logger.log(`Error notifying slave: ${err}`);
                }
            });
    }

    getBuyers(cb) {
        request.get(this.slave + "/buyers", (err, res, body) => {
            if(err) {
                this.logger.log(`Error getting buyers from slave: ${err}`);
            } else if(res.statusCode === 200) {
                const buyers = JSON.parse(body);
                this.logger.log(`Got buyers from slave: ${body}`);
                cb(buyers);
            }
        });
    }

    getBids(cb) {
        request.get(this.slave + "/bids", (err, res, body) => {
            if(err) {
                this.logger.log(`Error getting bids from slave: ${err}`);
            } else if(res.statusCode === 200) {
                const bids = JSON.parse(body);
                this.logger.log(`Got bids from slave: ${body}`);
                cb(bids);
            }
        });
    }
}

module.exports = SlaveCommunicator;