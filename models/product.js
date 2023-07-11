const db = require('../config/connectdb');

async function allProduct(query) {
    return new Promise((resolve, reject) => {
        db.query(
            query,
            function (err, results, fields) {
                resolve(results);
            }
        );
    })

}
async function findAllBanner() {
    return new Promise((resolve, reject) => {
        db.query(
            'SELECT * FROM banner',
            function (err, results) {
                resolve(results);
            }
        );
    })
}
async function findAllTopView() {
    return new Promise((resolve, reject) => {
        db.query(
            'SELECT * FROM product ORDER BY view desc limit 10',
            function (err, results) {
                resolve(results);
            }
        );
    })
}
async function findAllNew() {
    return new Promise((resolve, reject) => {
        db.query(
            'SELECT * FROM product ORDER BY publish_date desc limit 10',
            function (err, results) {
                resolve(results);
            }
        );
    })
}
async function findOneProduct(id) {
    return new Promise((resolve, reject) => {
        db.query(
            `SELECT * FROM product WHERE id = ${id}`,
            function (err, results) {
                resolve(results);
            }
        );
    })
}
const countProduct = (query) => {
    return new Promise((resolve, reject) => {
        db.query(
            query,
            function (err, results) {
                resolve(results);
            }
        );
    })
}
module.exports = { allProduct, findAllBanner, findAllTopView, findAllNew, countProduct, findOneProduct }