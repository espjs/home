const sqlite3 = require('sqlite3').verbose();

class Query {
    _db = null;
    _table = '';
    _pk = 'id';
    _result = null; // 返回值类型, model 或 null
    _value = {};
    _params = {
        field: '*',
        subQuery: null,
        join: '',
        where: [],
        order: '',
        limit: '',
    }

    constructor(db, table) {
        this._db = db;
        this._table = table;
    }

    table(name) {
        this._table = name;
        return this;
    }

    pk(pk) {
        this._pk = pk;
        return this;
    }

    field(field) {
        this._params.field = field;
        return this;
    }

    result(result) {
        this._result = result;
        return this;
    }

    where(field, value = null) {
        if (Array.isArray(field)) {
            for (let item of field) {
                if (typeof item === 'string') {
                    this._params.where.push(item);
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
        this._params.where.push(fieldName);
        this._params.where.push(exp);
        var paramName = '$' + fieldName;
        if (value !== null) {
            this._params.where.push(paramName);
            this._value[paramName] = value;

        }
        return this;
    }

    order(value) {
        this._params.order = value;
        return this;
    }

    limit(value) {
        this._params.limit = value;
        return this;
    }

    join(value) {
        this._params.join = value;
        return this;
    }

    subQuery(query) {
        this._params.query = query;
        return this;
    }

    makeWhere() {
        if (this._params.where.length > 0) {
            return ' WHERE ' + this._params.where.join(' ');

        }
        return '';
    }

    makeOrder() {
        if (this._params.order !== '') {
            return ' ORDER BY ' + this._params.order;
        }
        return '';
    }

    makeLimit() {
        if (Array.isArray(this._params.limit) && this._params.limit.length > 0) {
            return ' LIMIT ' + this._params.limit.join(',');
        }
        return '';
    }

    makeSubSql() {
        if (this._params.query instanceof Query) {
            return '(' + this._params.query.makeSql() + ')';
        }
        return '';
    }

    makeTableName() {
        return this._table;
    }

    makeJoin() {
        return this._params.join;
    }

    makeSql() {
        var sql = `SELECT ${this._params.field} FROM ${this.makeJoin()} ${this.makeSubSql()} ${this.makeTableName()} ${this.makeWhere()} ${this.makeOrder()} ${this.makeLimit()}`;
        // console.log(sql);
        return sql;
    }

    async get(id = null) {
        if (id) {
            this.addWhere(this._pk, id);
        }
        var result = await this._db.get(this.makeSql(), this._value);
        if (result) {
            if (this._result) {
                return new this._result(result);
            }
            return result;
        }
        return null;
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
        var result = await this._db.all(this.makeSql(), this._value);
        if (this._result) {
            return result.map((item) => {
                return new this._result(item);
            });
        }
        return result;
    }

    async select() {
        return await this.all();
    }

    async page(p = 1, pageSize = 10) {
        this._params.limit = [(p - 1) * pageSize, pageSize];
        return await this.all();
    }

    async count(field = '*') {
        this._params.field = 'COUNT(' + field + ') as num';
        var result = await this.get();
        return result ? result['num'] : 0;
    }

    async sum(field = '*') {
        this._params.field = 'sum(' + field + ') as num';
        var result = await this.get();
        return result ? result['num'] : 0;
    }

    async avg(field = '*') {
        this._params.field = 'avg(' + field + ') as num';
        var result = await this.get();
        return result ? result['num'] : 0;
    }

    async max(field = '*') {
        this._params.field = 'max(' + field + ') as num';
        var result = await this.get();
        return result ? result['num'] : 0;
    }

    async min(field = '*') {
        this._params.field = 'min(' + field + ') as num';
        var result = await this.get();
    }

    async delete() {
        var sql = `DELETE FROM ${this.makeTableName()} ${this.makeWhere()}`;
        return await this._db.exec(sql, this._value);
    }

    makeUpdateSql() {
        var set = [];
        this.where(this._pk, this._data[this._pk]);
        var data = { ...this._data };
        delete data[this._pk];
        for (var key in data) {
            set.push(key + '=$' + key);
            this._value['$' + key] = data[key];
        }
        set = set.join(',');
        return `UPDATE ${this._table} SET ${set} ${this.makeWhere()};`
    }
    async update(data = null) {
        if (data) {
            this._data = data;
        }
        var sql = this.makeUpdateSql();
        return await this._db.run(sql, this._value);
    }

    makeInsertSql() {
        var keys = [];
        var values = [];
        for (var key in this._data) {
            keys.push(key);
            values.push('$' + key);
            this._value['$' + key] = this._data[key];
        }
        keys = keys.join('","');
        values = values.join(',');
        return `INSERT INTO '${this._table}' ("${keys}") VALUES (${values});`;
    }

    async insert(data = null) {
        if (data) {
            this._data = data;
        }
        var sql = this.makeInsertSql();
        return await this._db.prepare(sql, this._value);
    }

    async save(data = null) {
        if (data) {
            this._data = data;
        }
        if (this._data[this._pk]) {
            return await this.update();
        }
        return await this.insert();
    }

    async add(data = null) {
        return await this.insert(data);
    }

    async delete() {
        var sql = `DELETE FROM ${this._table} ${this.makeWhere()}`;
        return await this._db.run(sql, this._value);
    }

}

class Sqlite {
    _db = null;
    constructor(path) {
        this._db = new sqlite3.Database(path);
    }

    async run(sql, params = []) {
        // console.log(sql, params);
        return await new Promise((resolve, reject) => {
            this._db.run(sql, params, function (err) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(err);
            });
        })
    }

    async prepare(sql, params = []) {
        // console.log(sql, params);
        return await new Promise((resolve, reject) => {
            var stmt = this._db.prepare(sql);
            stmt.run(params, function (err) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            })
        })
    }

    async exec(sql, callback = null) {
        // console.log(sql);
        var result = await new Promise((resolve, reject) => {
            this._db.exec(sql, (err) => {
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

    each(sql, params, callback, complete) {
        // console.log(sql, params);
        this._db.each(sql, params, callback, complete);
    }

    async get(sql, params = {}, callback = null) {
        // console.log(sql, params);
        var result = await new Promise((resolve, reject) => {
            this._db.get(sql, params, (err, row) => {
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

    async all(sql, params = [], callback = null) {
        // console.log(sql, params);
        var self = this;
        var result = await new Promise((resolve, reject) => {
            self._db.all(sql, params, (err, rows) => {
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