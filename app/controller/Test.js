const Controller = require('./Controller');

class Test extends Controller {

    async index(Helper) {
        var User = require('../model/User');
        var result = await User.where('id in (1,2,3)').order('id desc').page(2, 1);
        console.log(result);
        result = await User.where('id', 1).find();
        console.log(result);
        result = await User.where('id in (1,2,3)').order('id desc').select();
        console.log(result);

        var Device = require('../model/Device');
        result = await Device.query().count('id');
        console.log(result);

        result = await Device.query().sum('id');
        console.log(result);

        return this.view('index');
    }
}

module.exports = Test;