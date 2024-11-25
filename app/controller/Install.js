const fs = require('fs');
class Install {
    constructor(ctx, next) {

    }

    async index() {
        var lock = fs.existsSync(global.ROOT_DIR + '/install.lock');
        if (!lock) {
            return fs.readFileSync(global.PUBLIC_DIR + '/install.html', 'utf-8');
        }
        return '<script>window.location.href="/";</script>';
    }

    async config(ctx, db, Helper) {
        var lockFile = global.ROOT_DIR + '/install.lock';
        var result = {
            status: 200,
            message: ''
        };
        var lock = fs.existsSync(lockFile);
        if (lock) {
            result.status = 404;
            result.message = '安装程序已经完成, 请勿重复操作';
            return result;
        }
        var data = ctx.request.body;

        var sqlFile = global.APP_DIR + '/install.sql';
        var sql = fs.readFileSync(sqlFile, 'utf-8');
        data.password = Helper.md5(data.password);
        sql = sql.replace('{$username}', data.username);
        sql = sql.replace('{$password}', data.password);
        console.log(sql);
        var error = db.exec(sql);
        if (error) {
            console.log(error);
        }
        fs.writeFileSync(lockFile, 'install.lock');
        result = {
            status: 200,
            message: 'ok'
        };;
        return result;
    }
}

module.exports = Install;