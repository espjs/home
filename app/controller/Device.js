const Controller = require('./Controller');

class Device extends Controller {

    async index(Device) {
        var result = await Device.query()
            .field('id,name,value,status')
            .order('sort asc').all();
        return this.success(result);
    }

    async detail(Device, id) {
        var entity = await Device.get(id);
        console.log(entity);
        return this.success(entity);
    }

    async update(Device, Helper, id, ctx) {
        var data = {
            id,
            ...ctx.body,
            update_time: Helper.getTime()
        };
        var entity = new Device(data);
        await entity.save();

        return this.success(entity);
    }

    async add(Device, Helper, ctx) {
        if (!ctx.body.name) {
            return this.error('名称不能为空!');
        }
        var exists = Device.where('name', ctx.body.name).find();
        if (exists) {
            return this.json({ message: '名字已存在!' }, 400);
        }

        var data = { ...ctx.body };
        data.create_time = Helper.getTime();
        data.update_time = data.create_time;
        var entity = await Device.add(data);
        return this.success(entity);
    }

    async delete(Device, id) {
        Device.delete(id);
        return this.success('ok');
    }
}

module.exports = Device;