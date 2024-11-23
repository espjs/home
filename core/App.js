const Koa = require('koa');
const fs = require('fs');
module.exports = class App {

    koa = null;

    constructor() {
        this.koa = new Koa();
        global.APP_PATH = process.cwd().replace('\\', '/') + '/app';
        global.CORE = process.cwd().replace('\\', '/') + '/core';
    }

    run(port) {
        this.koa.use(this.router);
        this.koa.listen(port, () => {
            console.log('Server is running on port http://localhost:' + port);
        })
    }

    async router(ctx, next) {
        var params = ctx.request.query;
        params['ctx'] = ctx;
        params['next'] = next;
        var [controller, action] = App.parseRouter(ctx, next);

        if (controller === null) {
            ctx.body = '404';
            ctx.status = 404;
            return;
        }

        var paramsList = App.getParams(controller[action], params);

        var result = await controller[action](...paramsList);
        if (result !== undefined) {
            ctx.body = result;
        }
    }

    static parseRouter(ctx, next) {
        var controller = 'Index';
        var action = 'index';

        var [, queryController, queryAction] = ctx.request.path.split('/')
        if (queryController) {
            controller = App.parseControllerName(queryController);
        }
        if (queryAction) {
            action = App.parseActionName(queryAction);
        }

        var controllerPath = global.APP_PATH + '/controller/' + controller + '.js';

        if (!fs.existsSync(controllerPath)) {
            return [null, null];
        }
        var controllerClass = require(controllerPath);
        var controller = new controllerClass(ctx, next);
        if (controller[action] === undefined) {
            return [controller, null];
        }

        console.log(ctx.method + ': ' + ctx.request.url);
        return [controller, action];
    }

    static getParams(func, params) {
        var code = func.toString();
        var paramsArray = code.match(/\((.*?)\)/)[1].split(',');
        var paramsList = [];
        for (var i = 0; i < paramsArray.length; i++) {
            var [paramName, def] = paramsArray[i].split('=').map(item => item.trim());
            if (def !== undefined) {
                def = JSON.parse(def);
            }
            if (params[paramName] !== undefined) {
                paramsList.push(params[paramName]);
            } else {
                paramsList.push(def);
            }
        }
        return paramsList;
    }

    static parseControllerName(str) {
        var result = str.replace(/_(\w)/g, function (all, letter) {
            return letter.toUpperCase();
        });
        result.substring(0, 1).toUpperCase() + result.substring(1);
        return result;
    }

    static parseActionName(str) {
        var result = str.replace(/_(\w)/g, function (all, letter) {
            return letter.toUpperCase();
        });
        return result;
    }
}