class Index {

    ctx = null;
    next = null;

    constructor(ctx, next) {
        this.ctx = ctx;
        this.next = next;
    }

    async index(name = 123, message = "sdfsdfsd") {
        this.ctx.body = 'Hello ' + name + ' ' + message;
    }
}

module.exports = Index;