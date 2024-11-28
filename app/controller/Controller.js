module.exports = class Controller {

    ctx = null;
    next = null;
    constructor(ctx, next) {
        this.ctx = ctx;
        this.next = next;
    }

    status(code = 200) {
        this.ctx.response.status = code;
        return this;
    }

    success(body) {
        return body;
    }

    error(message, code = 500) {
        this.ctx.response.status = code;
        return message;
    }

    json(body, code = 200) {
        this.ctx.response.status = code;
        this.ctx.set('Content-Type', 'application/json; charset=utf-8');
        var result = JSON.stringify(body);
        return result;
    }

    view(path, code = 200) {
        var fs = require('fs');
        this.ctx.response.status = code;
        this.ctx.set('Content-Type', 'text/html; charset=utf-8');
        var template = fs.readFileSync(global.APP_DIR + '/view/' + path + '.html', 'utf8')
        return template;
    }

}