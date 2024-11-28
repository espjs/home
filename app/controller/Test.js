const Controller = require('./Controller');

class Test extends Controller {

    async index() {
        var User = require('../model/User');
        var Device = require('../model/Device');
        var Test = require('../model/Test');
        var result = await User.where('id in (1,2,3)').order('id desc').page(2, 1);
        console.log('page: ', result);

        result = await User.where('id', 1).find();
        console.log('find: ', result);

        result = await User.where('id in (1,2,3)').order('id desc').select();
        console.log('in: ', result);

        result = await Device.query().count('id');
        console.log('count: ', result);

        result = await Device.query().sum('id');
        console.log('sum: ', result);

        result = await Device.query().max('id');
        console.log('max: ', result);

        result = await Device.query().avg('id');
        console.log('avg: ', result);

        var device = new Device({
            id: 11,
            name: 'test_name_12345678',
            template: 'test_template',
            code: 'test_code',
            config: 'test_config',
            status: 'test_status',
            value: 'test_value',
            sort: 1,
        });
        await device.save();


        var device = await Device.add({
            name: 'test_name',
            template: 'test_template',
            code: 'test_code',
            config: 'test_config',
            status: 'test_status',
            value: 'test_value',
            sort: 1,
            create_time: '2024-11-28 23:09:26',
            update_time: '2024-11-28 23:09:26'
        });
        console.log('device: ', device);
        console.log('device.update_time: ', device.update_time);

        // Device.delete(device.id);

        return this.json(device);
    }
}

module.exports = Test;