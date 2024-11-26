class Model {

    table = '';
    constructor() {
        this.table = this.constructor.name.replace(/([^\b][A-Z])/g, "_$1").toLowerCase();
    }

    static db() {
        const db = require(global.CORE_DIR + "/db/Database");
        return db();
    }

    static getTableName() {
        return this.name.replace(/([^\b][A-Z])/g, "_$1").toLowerCase();
    }

    static async get(id) {
        var table = this.getTableName();
        console.log(table);
        return await this.db().get(`SELECT * FROM ${table} WHERE id = ?`, [id]);
    }

    static query() {
        return new Query(this.getTableName());
    }

}

class Query {

    table = '';
    pk = 'id';

    constructor(table) {
        this.table = table;
    }
    params = {
        'where': [],
        'order': [],
        'limit': [],
        'offset': [],
    }

    where(key, value) {
        this.params.where.push([key, value]);
        return this;
    }

    order(key, value) {

    }
    limit(value) {

    }

    offset(value) {

    }

    async get() {

    }

    async all() {

    }

    async save(data) {

    }

    async delete() {

    }
}

module.exports = Model;