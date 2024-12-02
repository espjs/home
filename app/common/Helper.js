class Helper {
    static db() {
        return require(global.CORE_DIR + "/db/Database")();
    }
    static md5(str) {
        var crypto = require('crypto');
        var md5 = crypto.createHash('md5');
        return md5.update(str).digest('hex');
    }
    static installed() {
        var fs = require('fs');
        if (fs.existsSync(global.DATA_DIR + '/db.sqlite')) {
            return true;
        }
        return false;
    }

    static makeToken() {
        return Helper.md5(Math.random() + new Date().getTime() + '');
    }

    static getTime() {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;
        const date = now.getDate();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();
        return `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;
    }

}

module.exports = Helper;