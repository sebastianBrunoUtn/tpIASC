const request = require('request');

class Notifier {
    constructor(serverId, supervisorAddress, logger = false) {
        this.serverId = serverId;
        this.supervisorAddress = supervisorAddress;
        this.logger = logger? {log: (msg) => logger.log(msg, "Notifier")} : {log: () => false};
    }

    notifyNewBuyer(buyer) {
        this.logger.log(`Notifying Supervisor about new buyer ${buyer.name}`);
        request.post(this.supervisorAddress + "/new-buyer", {form: {buyer: JSON.stringify(buyer), serverId: this.serverId}},
            (err, res, body) => {
                if(err) {
                    console.log(err);
                }
        });
    }
}

module.exports = Notifier;