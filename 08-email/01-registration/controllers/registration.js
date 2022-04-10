const { v4: uuid } = require('uuid');
const User = require('../models/User');
const Session = require('../models/Session');
const sendMail = require('../libs/sendMail');

module.exports.register = async (ctx, next) => {
    const { email, displayName, password } = ctx.request.body;

    try {
        const user = new User({
            email: email,
            displayName: displayName,
            verificationToken: uuid()
        });

        await user.setPassword(password);

        await user.save();

        await sendMail({
            to: email,
            subject: 'Ссылка для подтверждения регистрации',
            locals: {
                token: user.verificationToken,
            },
            template: 'confirmation',
        });
    } catch (e) {
        if (e.errors) {
            ctx.status = 400;
            ctx.body = {
                errors: Object.keys(e.errors).reduce((errors, key) => {
                    errors[key] = e.errors[key].message;
                    return errors;
                }, {})
            };
            return;
        }
        throw e;
    }

    ctx.body = { status: 'ok' };
};

module.exports.confirm = async (ctx, next) => {
    const { verificationToken } = ctx.request.body;

    const user = await User.findOne({ verificationToken: verificationToken });
    if (!user) {
        ctx.status = 400;
        ctx.body = { error: 'Ссылка подтверждения недействительна или устарела' };
        return;
    }

    user.verificationToken = undefined;
    await user.save();

    const token = uuid();

    const sesison = await Session.create({
        token: token,
        lastVisit: new Date(),
        user: user,
    });

    ctx.body = { token: token };
};
