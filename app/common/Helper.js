class Helper {
    static md5(str) {
        var crypto = require('crypto');
        var md5 = crypto.createHash('md5');
        return md5.update(str).digest('hex');
    }
    static installed() {
        var fs = require('fs');
        if (fs.existsSync(global.ROOT_DIR +'/install.lock')) {
            return true;
        }
        return false;
    }

}

module.exports = Helper;