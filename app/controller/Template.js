const Controller = require('./Controller');

class Template extends Controller {

    async index(Template) {
        return Template.query().order('sort asc').all();
    }

    async update(Template, Helper, id, ctx) {
        var data = {
            id,
            ...ctx.body,
            update_time: Helper.getTime()
        };
        var entity = new Template(data);
        await entity.save();
        return this.success(entity);
    }

    async add(Template, Helper, ctx) {
        var exists = Template.where('name', ctx.body.name).find();
        if (exists) {
            return this.json({ message: '名字已存在!' }, 400);
        }

        var data = { ...ctx.body };
        data.create_time = Helper.getTime();
        data.update_time = data.create_time;
        var entity = Template.add(data);
        return this.success(entity);
    }

    async delete(Template, id) {
        Template.delete(id);
        return this.success('ok');
    }
}

module.exports = Template;