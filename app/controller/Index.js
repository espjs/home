const Controller = require('./Controller');

class Index extends Controller {

    async index(Helper) {
        if (!Helper.installed()) {
            return this.redirect('/install');
        }
        return this.view('index');
    }
}

module.exports = Index;