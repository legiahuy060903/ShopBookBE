

const asyncHandler = require('express-async-handler');
const { createOrder, createOrderDetail, getOrder } = require('../models/order');
const CreOrder = asyncHandler(async (req, res) => {
    const { user_id, address: address, name: nameReceiver, phone } = req.body.data;
    const user = { user_id, address, phoneReceiver: +phone, nameReceiver };
    const order_id = await createOrder(user);
    if (order_id) {
        const cart = req.body?.cart.map(item => ([+item.cart.id, item.cart.name, +item.cart.price, +item.quantity, +order_id]));
        const orderDetail = await createOrderDetail(cart);
        if (orderDetail) {
            const { ...data } = await getOrder(user_id, order_id);
            return res.status(200).json({
                success: true,
                data: data,
            });
        }
        res.status(404).json({
            success: false,
            message: 'Lỗi đơn hàng'
        });
    }
    res.status(404).json({
        success: false,
        message: 'Lỗi đơn hàng'
    });

})
module.exports = { CreOrder }