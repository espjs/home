const config = require(global.APP_DIR + "/config/model");
class Model {

    _tableName = '';
    _data = {};
    _pk = 'id';

    constructor(data = null) {
        if (!this._tableName) {
            this._tableName = this.getTableName();
        }

        if (data) {
            this._data = data;
            for (var key in this._data) {
                this.defineProperty(key);

            }
        }
    }

    db() {
        const db = require(global.CORE_DIR + "/db/Database");
        return db();
    }

    getTableName() {
        return this.constructor.name.replace(/([^\b][A-Z])/g, "_$1").toLowerCase();
    }

    get data() {
        return this._data;
    }

    set data(data) {
        this._data = data;
    }

    static where(...params) {
        return this.query().where(...params);
    }

    static order(...params) {
        return this.query().order(...params);
    }

    static async get(id) {
        var data = await this.query().get(id);
        if (data) {
            return data;
        }
        return null;
    }

    pk(pk) {
        this._pk = pk;
        return this;
    }

    _query() {
        var query = this.db().query(this._tableName).pk(this._pk);
        if (config.result == 'model') {
            query.result(this.constructor);
        }
        return query;
    }

    static query() {
        var query = (new this)._query();
        return query;
    }

    toJSON() {
        return this._data;
    }

    defineProperty(key) {
        Object.defineProperty(this, key, {
            get: function () {
                return this._data[key];
            },
            set: function (value) {
                this._data[key] = value;
            }
        })
    }

    save(data = null) {
        if (data) {
            this._data = { ...this._data, ...data };
        }
        var result = this._query().save(this._data);
        return result;
    }

    static async add(data = null) {
        if (data) {
            this._data = { ...this._data, ...data };
        }
        var id = await this.query().add(this._data);
        if (id) {
            return await this.get(id);
        }
        return null;
    }

    static async delete(id) {
        return await this.query().where((new this)._pk, id).delete();
    }

}

module.exports = Model;