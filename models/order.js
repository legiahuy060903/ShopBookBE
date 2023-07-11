const db = require('../config/connectdb');

async function createOrder(data) {
    return new Promise((resolve, reject) => {
        db.query(
            'INSERT INTO orders SET ?', data,
            function (err, result) {
                if (err) console.log(err);
                resolve(result?.insertId);
            }
        );
    })

}

async function createOrderDetail(data) {
    return new Promise((resolve, reject) => {
        db.query(' INSERT INTO order_detail (product_id,product_name, price, quantity, order_id) VALUES ? ', [data], function (err, result) {
            if (err) console.log(err);
            resolve(result);
        });
    })
}
async function getOrder(user_id, order_id) {
    return new Promise((resolve, reject) => {
        db.query(`SELECT orders.*,
        ( SELECT CONCAT('[', GROUP_CONCAT(
            CONCAT(' {"product_id":', product_id, ', "price":', price, ', "quantity": ', quantity, ',"product_name": "', product_name, '" }')
            ORDER BY order_detail.id SEPARATOR ','), ']')
             FROM order_detail WHERE order_detail.order_id = orders.id ) AS cart 
             FROM orders WHERE id = ${order_id} AND user_id = ${user_id}`, function (err, result) {
            if (err) console.log(err);
            resolve(result);
        });
    })
}




module.exports = { createOrder, createOrderDetail, getOrder };