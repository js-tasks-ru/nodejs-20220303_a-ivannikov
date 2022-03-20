const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

const waiters = new Map();

router.get('/subscribe', async (ctx, next) => {
    const id = `${ctx.socket.remoteAddress}:${ctx.socket.remotePort}`;

    const data = await new Promise(resolve => {
        waiters.set(id, resolve);
    });

    if (data.message) {
        ctx.body = data.message;
    } else {
        ctx.status = 204;
    }

    waiters.delete(id);
});

const isMessageNotEmpty = (ctx) => ctx.request.body.message?.length > 0;

router.post('/publish', async (ctx, next) => {
    if (isMessageNotEmpty(ctx)) {
        for (const resolve of waiters.values()) {
            resolve(ctx.request.body);
        }

        ctx.body = 'Message sent';
    } else {
        ctx.body = 'Empty message ignored';
    }
});

app.use(router.routes());

module.exports = app;
