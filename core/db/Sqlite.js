const sqlite3 = require('sqlite3').verbose();

class Sqlite {
    db = null;
    constructor(path) {
        this.db = new sqlite3.Database(path);
    }

    run(sql, params = []) {
        this.db.run(sql, params);
    }

    async exec(sql, callback = null) {
        var result = await new Promise((resolve, reject) => {
            this.db.exec(sql, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(false);
            });
        });
        if (callback) {
            callback(result);
        }
        return result;
    }

    each(sql, param, callback, complete) {
        this.db.each(sql, param, callback, complete);
    }

    async get(sql, param, callback = null) {
        var result = await new Promise((resolve, reject) => {
            this.db.get(sql, param, (err, row) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(row);
            });
        });
        if (callback) {
            callback(result);
        }
        return result;
    }

    async all(sql, param = [], callback = null) {
        var self = this;
        var result = await new Promise((resolve, reject) => {
            self.db.all(sql, param, (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(rows);
            });
        });
        if (callback) {
            callback(result);
        }
        return result;
    }

}

module.exports = Sqlite