class Device {

    async index() {
        return 'list';
    }

    async add() {
        return 'add';
    }

    async update(id) {
        return 'update';
    }


    async detail(id) {
        return 'detail: ' + id;
    }

    async delete(id) {
        return 'delete: ' + id;
    }

    async helloWorld() {
        return 'hello';
    }
}

module.exports = Device;