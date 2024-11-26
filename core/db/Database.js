const config = require(global.APP_DIR + '/config/db');

module.exports = function db() {
    switch (config.type) {
        case 'sqlite':
            var filename = config.filename.replace('@', global.ROOT_DIR);
            var Sqlite = require('./Sqlite');
            return new Sqlite(filename);
        default:
            throw new Error('Database type not supported');
    }
}