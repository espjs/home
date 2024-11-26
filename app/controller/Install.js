const Controller = require('./Controller');
class Install extends Controller {
    async index(Helper) {
        if (!Helper.installed()) {
            return this.view('install');
        }
        return '<script>window.location.href="/";</script>';
    }

    async config(ctx, Helper) {

        var result = {
            status: 200,
            message: ''
        };
        if (Helper.installed()) {
            result.status = 404;
            result.message = '安装程序已经完成, 请勿重复操作';
            return result;
        }

        var data = ctx.request.body;

        var sqlFile = global.APP_DIR + '/install.sql';
        var sql = require('fs').readFileSync(sqlFile, 'utf-8');
        data.password = Helper.md5(data.password);
        sql = sql.replace('{$username}', data.username);
        sql = sql.replace('{$password}', data.password);
        var error = Helper.db().exec(sql);
        if (error) {
            console.log(error);
        }
        result = {
            status: 200,
            message: 'ok'
        };;
        return result;
    }
}

module.exports = Install;