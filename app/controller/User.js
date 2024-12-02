const Controller = require('./Controller');

class User extends Controller {

    async index() {

    }

    async login(User, Helper, ctx) {
        var params = ctx.request.body;
        var user = await User.where('username', params.username).get();
        if (!user) {
            return this.error('用户不存在');
        }

        if (user.password != Helper.md5(params.password)) {
            return this.error('密码错误');
        }

        if (user.status !== '正常') {
            return this.error('用户已被禁用');
        }

        if (!user.token) {
            user.token = Helper.makeToken();
            user.save({
                token: user.token
            });
        }

        return this.success({ token: user.token });
    }
}

module.exports = User;