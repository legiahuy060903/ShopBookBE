const db = require('../config/connectdb');
const pool = require('../config/connectPromise');

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
async function getOrderAndDetail(qs) {
    const detailOrder = async (id) => {
        let detail = (await pool.query(`SELECT od.*, p.thumbnail AS thumb FROM order_detail od JOIN product p ON od.product_id = p.id WHERE od.order_id = ?`, id))[0];
        return detail;
    };
    let orders = (await pool.query('SELECT * FROM orders ' + qs))[0];
    let cut = qs.slice(0, qs.indexOf("LIMIT"));
    let total = ((await pool.query('SELECT count(id) as total FROM orders ' + cut))[0])[0].total;
    for (let i = 0; i < orders.length; i++) {
        const details = await detailOrder(orders[i].id);
        orders[i].detail = details;
    }

    return { data: orders, total: total };
}
const findAndDelete = async (id) => {
    await pool.query(`DELETE FROM order_detail WHERE order_id = ${id}`)
    const r = (await pool.query(`DELETE FROM orders WHERE id = ${id}`))[0];
    return r.affectedRows
}
async function findAllOrder() {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * from orders`, function (err, result) {
            if (err) console.log(err);
            resolve(result);
        });
    })
}
const findAndUpdate = async (id, body) => {
    console.log(id, body);
    const r = (await pool.query(`UPDATE orders SET ? WHERE id = ?`, [body, id]))[0];
    return r.affectedRows
}


module.exports = { findAndUpdate, createOrder, createOrderDetail, getOrder, findAllOrder, getOrderAndDetail, findAndDelete };
