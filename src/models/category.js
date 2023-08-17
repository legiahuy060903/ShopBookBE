const db = require('../config/connectdb');
const pool = require('../config/connectPromise');
const { delProduct } = require('./product');
async function findCategory() {
    return new Promise((resolve, reject) => {
        db.query(
            'SELECT * FROM category where block = 1',
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
async function create(name, block) {
    return new Promise((resolve, reject) => {
        db.query(`insert into category (name,block) values (?,?)`, [name, block],
            function (err, results) {
                resolve(results);
            }
        );
    })
}
async function del(id) {
    const [row] = await pool.query('SELECT id FROM product WHERE category_id = ?', id);
    console.log(row);
    if (row && row.length > 0) {
        const [data] = await Promise.all(row.map(async (item) => await delProduct(item.id)));
        console.log(data);
    }
    let [de] = await pool.query(`DELETE FROM category WHERE id = ${id}`);
    return de?.affectedRows
}
async function update(id, data) {
    const [row] = await pool.query('UPDATE category SET ? WHERE id = ?', [data, id]);
    return row?.affectedRows
}
module.exports = { findCategory, countProByCat, create, del, update }