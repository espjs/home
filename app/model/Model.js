class Model {

    _tableName = '';
    _data = {};

    constructor(data) {
        this._tableName = this.getTableName();
        this._data = data;
    }

    static db() {
        const db = require(global.CORE_DIR + "/db/Database");
        return db();
    }

    static getTableName() {
        return this.name.replace(/([^\b][A-Z])/g, "_$1").toLowerCase();
    }

    static where(...params) {
        return this.query().where(...params);
    }

    static order(...params) {
        return this.query().order(...params);
    }

    static async all() {
        this.query().all();
    }

    static async get(id) {
        return await this.query().get(id);
    }

    static query() {
        return this.db().query(this.getTableName());
    }

}

module.exports = Model;