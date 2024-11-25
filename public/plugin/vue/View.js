import Module from "./Module.js";
class View {
    static create(page) {
        var config = typeof page === 'string' ? Module.load(page) : page;
        var app = Vue.createApp(config)
        app.use(ElementPlus);
        app.mount(document.body);
        return app;
    }
}

export default View;