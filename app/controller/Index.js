class Index {

    ctx = null;
    next = null;

    constructor(ctx, next) {
        this.ctx = ctx;
        this.next = next;
    }

    async index(Helper) {
        if (!Helper.installed()) {
            return '<script>window.location.href="/install";</script>';
        }

        return 'Hello World!';
    }
}

module.exports = Index;