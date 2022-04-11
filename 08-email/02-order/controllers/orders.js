const Order = require('../models/Order');
const Product = require('../models/Product');
const sendMail = require('../libs/sendMail');

module.exports.checkout = async function checkout(ctx, next) {
    const { phone, product, address } = ctx.request.body;

    try {
        const order = new Order({
            user: ctx.user,
            product: product,
            phone: phone,
            address: address,
        });

        await order.save();

        await sendMail({
            to: ctx.user.email,
            subject: 'Подтверждение заказа',
            locals: {
                id: order._id,
                product: await Product.findById(order.product),
            },
            template: 'order-confirmation',
        });

        ctx.body = { order: order._id };
    } catch(e) {
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
};

module.exports.getOrdersList = async function ordersList(ctx, next) {
    ctx.body = { orders: await Order.find({user: ctx.user}) };
};
