const base = "https://api-m.sandbox.paypal.com";
const axios = require('axios');
const { CLIENT_ID, APP_SECRET } = process.env;
const asyncHandler = require('express-async-handler');
const { createOrder, createOrderDetail,
    getOrder, findAllOrder, getOrderAndDetail, findAndDelete, findAndUpdate } = require('../models/order');
const { baseURL, paypal } = require('../utils/paypal');
const { generateAccessToken, capturePayment } = require('../services/paypal');

const CreOrder = asyncHandler(async (req, res) => {
    const { user_id, address: address, name: nameReceiver, phone, payment } = req.body.data;
    let user = { user_id, address, phoneReceiver: +phone, nameReceiver, payment: payment || 0 };
    user.total = req.body?.cart.reduce((a, b) => {
        return a + (b.quantity * b.cart.price);
    }, 0);

    const order_id = await createOrder(user);
    if (order_id) {
        const cart = req.body?.cart.map(item => ([+item.cart.id, item.cart.name, +item.cart.price, +item.quantity, order_id]));
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
const getAllOrderAndDetail = asyncHandler(async (req, res) => {
    const { page, sort_create_at, sort_total, sort_pay, sort_status, limit, search, user_id, filter_status } = req.query;
    let li = limit || 10;
    let page_current = +page || 1;
    let qs = '';
    let conditions = [];
    const offset = (page_current > 0 ? (page_current - 1) * li : 0);
    qs = ` LIMIT ${offset}, ${li} `;


    if (sort_status) {
        qs = `ORDER BY status ${sort_status}` + qs
    } else if (sort_total) {
        qs = `ORDER BY total ${sort_total}` + qs
    } else if (sort_pay) {
        qs = `ORDER BY payment ${sort_pay}` + qs
    } else {
        qs = `ORDER BY created_at ${sort_create_at || 'desc'}` + qs;
    }
    if (search) {
        conditions.push(` nameReceiver LIKE '%${search}%' OR phoneReceiver LIKE '%${search}%' OR address LIKE '%${search}%' `)
    }
    if (user_id) {
        conditions.push(` user_id= ${user_id} AND status = ${filter_status}`);
    }
    if (conditions.length > 0) {
        qs = `where ${conditions.join(' AND ')} ` + qs;
    }

    let data = await getOrderAndDetail(qs);
    return res.status(200).json({
        success: true,
        data: data,
    });
})
const delOrder = asyncHandler(async (req, res) => {
    let result = await findAndDelete(req.params.id);
    if (result) {
        return res.status(200).json({
            data: {
                success: true,
                mes: 'Đã xóa đơn hàng'
            }
        });
    }
    res.status(404).json({
        success: false,
        message: 'Lỗi đơn hàng'
    });
})
const updateOrder = asyncHandler(async (req, res) => {
    const { id, ...rest } = req.body;
    console.log(id, rest);
    let result = await findAndUpdate(id, rest);
    if (result) {
        return res.status(200).json({
            data: {
                success: true,
                mes: 'Cập nhật thành công'
            }
        });
    }
    res.status(404).json({
        success: false,
        message: 'Lỗi đơn hàng'
    });
})


module.exports = { updateOrder, CreOrder, getAllOrder, paypalPost, capture, getAllOrderAndDetail, delOrder }