const db = require('../config/connectdb');
const pool = require('../config/connectPromise');
const { cloudinary } = require('../utils/cloudinary');


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
async function findTopSold() {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM
  (SELECT * FROM product ORDER BY sold DESC LIMIT 10) 
  AS subquery ORDER BY sold ASC`,
            function (err, results) {
                if (err) console.log(err);
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
// async function findAllRandom() {
//     const countQuery = 'SELECT COUNT(id) AS total FROM product WHERE block = 1';
//     let count = ((await pool.query(countQuery))[0])[0].COUNT;
//     console.log(count);
// }
async function findOneProduct(id) {
    let qs = `SELECT p.*, c.name as name_category, GROUP_CONCAT(DISTINCT  i.url) AS images FROM product p  JOIN category c LEFT JOIN image i ON p.id = i.product_id  WHERE p.id = ${id}`
    let data = (await pool.query(qs))[0];
    const con = { view: ++data[0].view, id: data[0].id };
    await pool.query(`UPDATE product SET view = ? WHERE id = ?`, [con.view, con.id])
    return data
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
const createProduct = (data) => {
    return new Promise((resolve, reject) => {
        db.query(
            `INSERT INTO product SET ?`, data,
            function (err, result) {
                if (err) console.log(err);
                resolve(result?.insertId);
            }
        );
    })
}

const createProductImage = (data) => {
    return new Promise((resolve, reject) => {
        db.query(
            `INSERT INTO image (product_id,url) VALUES ? `, [data],
            function (err, result) {
                if (err) console.log(err);
                resolve(result?.affectedRows);
            }
        );
    })
}
const delProduct = async (id) => {
    let arrImg = await findImgProduct(id);
    if (arrImg && arrImg?.length > 0) {
        arrImg.forEach((item) => {
            destroyImg(item);
        });
    }
    const deleteImageQuery = `DELETE FROM image WHERE product_id = ?`;
    const deleteCommentQuery = `DELETE FROM comment WHERE product_id = ?`;
    const deleteLikeCommentQuery = `DELETE FROM like_comment WHERE product_id = ?`;
    const deleteOrderDetailQuery = `DELETE FROM order_detail WHERE product_id = ?`;
    const deleteProductQuery = `DELETE FROM product WHERE id = ?`;
    await Promise.all([pool.query(deleteOrderDetailQuery, id), pool.query(deleteImageQuery, id),
    pool.query(deleteLikeCommentQuery, id), pool.query(deleteCommentQuery, id)]);
    return await pool.query(deleteProductQuery, id)
}


const findImgProduct = async (id) => {
    let data = (await findOneProduct(id))[0];
    let arrImg = [data.thumbnail]
    if (data.images && data.images?.length > 0) {
        arrImg.push(...data?.images?.split(','))
    }
    return arrImg
}

const destroyImg = async (url) => {
    const start = url.lastIndexOf('book/');
    const end = url.lastIndexOf('.');
    const publicId = url.substring(start, end);
    await cloudinary.uploader.destroy(publicId);
}
const delImg = (id) => {
    return new Promise((resolve, reject) => {
        db.query(
            'DELETE FROM image WHERE id = ?', id,
            function (err, results, fields) {
                reject(err)
                resolve(results);
            }
        );
    })
}
const findIdUpdate = (id, body) => {
    return new Promise((resolve, reject) => {
        db.query("UPDATE product SET ? WHERE id = ?", [body, id], function (err, data) {
            if (err) throw new Error(err);
            else resolve(data);
        });
    });
}

module.exports = {
    destroyImg, findImgProduct, findIdUpdate,
    delImg, allProduct, findAllBanner, findAllTopView,
    findAllNew, countProduct, findOneProduct, findTopSold,
    createProduct, createProductImage, delProduct
}