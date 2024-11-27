const sqlite3 = require('sqlite3').verbose();

class Query {
    db = null;
    table = '';
    pk = 'id';
    value = {};
    params = {
        'field': '*',
        'subQuery': null,
        'join': '',
        'where': [],
        'order': '',
        'limit': '',
    }

    constructor(db, table) {
        this.db = db;
        this.table = table;
    }

    table(name) {
        this.table = name;
        return this;
    }

    where(field, value = null) {
        if (Array.isArray(field)) {
            for (let item of field) {
                if (typeof item === 'string') {
                    this.params.where.push(item);
                } else {
                    this.addWhere(...item);
                }
            }
        } else {
            this.addWhere(field, value);
        }
        return this;
    }

    addWhere(field, value = null) {
        var [fieldName, ...exp] = field.split(' ');
        exp = exp.join(' ').trim();
        if (exp === '') {
            exp = '=';
        }
        this.params.where.push(fieldName);
        this.params.where.push(exp);
        var paramName = '$' + fieldName;
        if (value !== null) {
            this.params.where.push(paramName);
            this.value[paramName] = value;

        }
        return this;
    }

    order(value) {
        this.params.order = value;
        return this;
    }

    limit(value) {
        this.params.limit = value;
        return this;
    }

    join(value) {
        this.params.join = value;
        return this;
    }

    subQuery(query) {
        this.params.query = query;
        return this;
    }

    makeWhere() {
        if (this.params.where.length > 0) {
            return ' WHERE ' + this.params.where.join(' ');

        }
        return '';
    }

    makeOrder() {
        if (this.params.order !== '') {
            return ' ORDER BY ' + this.params.order;
        }
        return '';
    }

    makeLimit() {
        if (Array.isArray(this.params.limit) && this.params.limit.length > 0) {
            return ' LIMIT ' + this.params.limit.join(',');
        }
        return '';
    }

    makeSubSql() {
        if (this.params.query instanceof Query) {
            return '(' + this.params.query.makeSql() + ')';
        }
        return '';
    }

    makeTableName() {
        return this.table;
    }

    makeJoin() {
        return this.params.join;
    }

    makeSql() {
        var sql = `SELECT ${this.params.field} FROM ${this.makeJoin()} ${this.makeSubSql()} ${this.makeTableName()} ${this.makeWhere()} ${this.makeOrder()} ${this.makeLimit()}`;
        console.log(sql);
        return sql;
    }

    async get(id = null) {
        if (id) {
            this.addWhere(this.pk, id);
        }
        return await this.db.get(this.makeSql(), this.value);
    }

    async first() {
        return await this.get();
    }

    async find() {
        return await this.get();
    }

    async one() {
        return await this.get();
    }

    async all() {
        return await this.db.all(this.makeSql(), this.value);
    }

    async select() {
        return await this.all();
    }

    async page(p = 1, pageSize = 10) {
        this.params.limit = [(p - 1) * pageSize, pageSize];
        return await this.all();
    }

    async count(field = '*') {
        this.params.field = 'COUNT(' + field + ') as num';
        var result = await this.get();
        return result ? result['num'] : 0;
    }

    async sum(field = '*') {
        this.params.field = 'sum(' + field + ') as num';
        var result = await this.get();
        return result ? result['num'] : 0;
    }

}

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

    async get(sql, params = {}, callback = null) {
        var result = await new Promise((resolve, reject) => {
            this.db.get(sql, params, (err, row) => {
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

    query(tableName) {
        return new Query(this, tableName);
    }

}

module.exports = Sqlite