const fs = require('fs');

class Logger {
    constructor(path) {
        this.path = path;
        if(fs.existsSync(path)) {
            fs.truncate(path, 0);
        }
    }

    log(log, tag) {
        fs.appendFile(this.path, `[${tag}] ${log}\n`, err => {if(err) throw err});
    }
}

module.exports = Logger;