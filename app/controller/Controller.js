module.exports = class Controller {

    ctx = null;
    next = null;
    constructor(ctx, next) {
        this.ctx = ctx;
        this.next = next;
    }

    success(body) {
        this.ctx.body = body;
    }

    error(message, code = 500) {
        this.ctx.status = code;
        this.ctx.body = message;
    }

    json(body) {
        this.ctx.body = body;
        this.ctx.headers['Content-Type'] = 'application/json';
    }

    view(path) {
        var fs = require('fs');
        return fs.readFileSync(global.APP_DIR + '/view/' + path + '.html', 'utf8');
    }

}