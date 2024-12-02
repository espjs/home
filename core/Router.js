const fs = require('fs');
module.exports = class Router {
    static async router(ctx, next) {
        var [controller, action] = Router.parseRouter(ctx, next);
        if (controller === null || !controller[action]) {
            ctx.body = '404';
            ctx.status = 404;
            return;
        }

        var paramsList = Router.paramsInjection(controller[action], ctx, next);

        try {
            var result = await controller[action](...paramsList);
            if (result !== undefined) {
                ctx.body = result;
            }
        } catch (e) {
            console.log(e);
            ctx.body = e.message;
            ctx.status = 500;
            return;
        }
    }

    static paramsInjection(func, ctx, next) {
        var params = ctx.request.query;

        var code = func.toString();
        var paramsArray = code.match(/\((.*?)\)/)[1].split(',');
        var paramsList = [];
        for (var i = 0; i < paramsArray.length; i++) {
            var [paramName, def] = paramsArray[i].split('=').map(item => item.trim());
            if (def !== undefined) {
                def = JSON.parse(def);
            }

            switch (true) {
                case 'ctx' == paramName:
                    paramsList.push(ctx);
                    break;
                case 'next' == paramName:
                    paramsList.push(next);
                    break;
                case 'db' == paramName:
                    if (typeof params['db'] === 'undefined') {
                        var db = require('./db/Database');
                        paramsList.push(db());
                    } else {
                        paramsList.push(params['db']);
                    }
                    break;
                case 'id' == paramName:
                    if (typeof params['id'] === 'undefined') {
                        var id = ctx.request.path.match(/\/(\d+)$/);
                        if (id) {
                            paramsList.push(id[1]);
                        } else {
                            paramsList.push(def);
                        }
                    } else {
                        paramsList.push(params['id']);
                    }
                    break;
                default:
                    if (params[paramName] !== undefined) {
                        paramsList.push(params[paramName]);
                    } else {
                        var model = global.APP_DIR + '/model/' + paramName + '.js';
                        if (fs.existsSync(model)) {
                            paramsList.push(require(model));
                            continue;
                        }

                        var injectionPath = global.APP_DIR + '/injection/' + paramName + '.js';
                        if (fs.existsSync(injectionPath)) {
                            paramsList.push(require(injectionPath));
                            continue;
                        }

                        paramsList.push(def);

                    }
                    break;
            }

        }
        return paramsList;
    }

    static parseRouter(ctx, next) {
        var controller = 'Index';
        var action = 'index';

        var [, queryController, queryAction] = ctx.request.path.split('/')
        if (queryController) {
            controller = Router.parseControllerName(queryController);
        }
        if (queryAction) {
            action = Router.parseActionName(queryAction);
        }

        var controllerPath = global.APP_DIR + '/controller/' + controller + '.js';

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

    static parseControllerName(str) {
        var result = str.replace(/_(\w)/g, function (all, letter) {
            return letter.toUpperCase();
        });
        result = result.substring(0, 1).toUpperCase() + result.substring(1);
        return result;
    }

    static parseActionName(str) {
        var result = str.replace(/_(\w)/g, function (all, letter) {
            return letter.toUpperCase();
        });
        return result;
    }
}