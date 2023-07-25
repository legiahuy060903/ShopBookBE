const db = require('../config/connectdb');

async function findCategory() {
    return new Promise((resolve, reject) => {
        db.query(
            'SELECT * FROM category',
            function (err, results) {
                resolve(results);
            }
        );
    })
}
async function countProByCat() {
    return new Promise((resolve, reject) => {
        db.query(
            `SELECT c.name, COUNT(p.id) as Tong
                FROM category c
                JOIN product p ON c.id = p.category_id
                GROUP BY p.category_id;`,
            function (err, results) {
                resolve(results);
            }
        );
    })

}

module.exports = { findCategory, countProByCat }