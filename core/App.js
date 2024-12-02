const Koa = require('koa');
const config = require('../app/config/all');
const staticFile = require('koa-static');
const bodyParser = require('koa-bodyparser');
const Router = require('./Router');

module.exports = class App {

    koa = null;

    constructor() {
        global.ROOT_DIR = process.cwd().replace('\\', '/');
        global.APP_DIR = global.ROOT_DIR + '/app';
        global.CORE_DIR = global.ROOT_DIR + '/core';
        global.PUBLIC_DIR = global.ROOT_DIR + '/public';
        global.DATA_DIR = global.ROOT_DIR + '/data';
    }

    run(port) {
        this.koa = new Koa();
        this.koa.use(staticFile(global.PUBLIC_DIR));
        this.koa.use(bodyParser());
        this.koa.use(Router.router);
        this.koa.listen(port, () => {
            console.log('Server is running on port http://localhost:' + port);
        })
    }

}