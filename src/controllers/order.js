const base = "https://api-m.sandbox.paypal.com";
const axios = require('axios');
const { CLIENT_ID, APP_SECRET } = process.env;
const asyncHandler = require('express-async-handler');
const { createOrder, createOrderDetail, getOrder, findAllOrder } = require('../models/order');
const { baseURL, paypal } = require('../utils/paypal');
const { generateAccessToken, capturePayment } = require('../services/paypal');

const CreOrder = asyncHandler(async (req, res) => {
    const { user_id, address: address, name: nameReceiver, phone, payment } = req.body.data;
    const user = { user_id, address, phoneReceiver: +phone, nameReceiver, payment: payment || 0 };
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

const getAllOrder = asyncHandler(async (req, res) => {
    let data = await findAllOrder();
    if (data) {
        return res.status(200).json({
            success: true,
            data: data,
        });
    }
    res.status(404).json({
        success: false,
        message: 'Lỗi đơn hàng'
    });
})



const paypalPost = asyncHandler(async (req, res) => {

    let total = (req.body.reduce((a, b) => {
        return a + b.quantity * (b.cart.price / 23000);
    }, 0)).toFixed(2).toString();

    try {
        const accessToken = await generateAccessToken();
        const url = `${base}/v2/checkout/orders`;
        const headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
        };
        const data = {
            intent: 'CAPTURE',
            purchase_units: [
                {
                    amount: {
                        currency_code: 'USD',
                        value: total,
                        breakdown: {
                            item_total: { value: total, currency_code: 'USD' }
                        }
                    },
                },
            ],
        };

        const response = await axios.post(url, data, { headers });
        return res.status(200).json({
            success: true,
            data: response.data,
        });
    } catch (error) {
        const errorMessage = error.response ? error.response.data : 'An error occurred';
        return res.status(500).json({
            success: false,
            error: errorMessage,
        });
    }
});

const capture = asyncHandler(async (req, res) => {
    const { orderID } = req.body;
    const captureData = await capturePayment(orderID);
    res.json(captureData);
})

module.exports = { CreOrder, getAllOrder, paypalPost, capture }