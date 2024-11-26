const Controller = require('./Controller');

class Index extends Controller {

    async index(Helper) {
        if (!Helper.installed()) {
            return '<script>window.location.href="/install";</script>';
        }

        var User = require('../model/User');
        var admin = await User.get(1);
        console.log(admin);
        return this.view('index');
    }
}

module.exports = Index;