const Controller = require('./Controller');

class Room extends Controller {

    async index(Room) {
        return Room.query().order('sort asc').all();
    }

    async update(Room, Helper, id, ctx) {
        var data = {
            id,
            name: ctx.body.name,
            update_time: Helper.getTime()
        };
        var entity = new Room(data);
        await entity.save();
        return this.success(entity);
    }

    async add(Room, Helper, ctx) {
        var exists = Room.where('name', ctx.body.name).find();
        if (exists) {
            return this.json({ message: '名字已存在!' }, 400);
        }

        var data = { name: ctx.body.name };
        data.create_time = Helper.getTime();
        data.update_time = data.create_time;
        var entity = Room.add(data);
        return this.success(entity);
    }

    async delete(Room, id) {
        Room.delete(id);
        return this.success('ok');
    }
}

module.exports = Room;