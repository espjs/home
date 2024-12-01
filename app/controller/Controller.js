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

    success(data) {
        return this.json(data);
    }

    redirect(url) {
        this.ctx.response.redirect(url);
        return '';
    }

    error(message, code = 400) {
        return this.json(message, code);
    }

    json(body, code = 200) {
        this.ctx.response.status = code;
        this.ctx.set('Content-Type', 'application/json; charset=utf-8');
        var result = JSON.stringify(body);
        return result;
    }

    view(path, code = 200) {
        this.ctx.response.status = code;
        this.ctx.set('Content-Type', 'text/html; charset=utf-8');
        var path = global.APP_DIR + '/view/' + path + '.html';
        var fs = require('fs');
        if (fs.existsSync(path)) {
            return fs.readFileSync(path, 'utf8');
        }
        return '模板不存在!';
    }

}