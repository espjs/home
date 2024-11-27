const Controller = require('./Controller');

class Index extends Controller {

    async index(Helper) {
        if (!Helper.installed()) {
            return '<script>window.location.href="/install";</script>';
        }
        return this.view('index');
    }
}

module.exports = Index;