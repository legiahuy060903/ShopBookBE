const db = require('../config/connectdb');

async function createComment(data) {
    return new Promise((resolve, reject) => {
        db.query(
            'INSERT INTO comment SET ?', data,
            function (err, result) {
                if (err) console.log(err);
                resolve(result?.insertId);
            }
        );
    })
}

async function findByProduct(product_id, off, limit) {
    let qs = `SELECT * FROM comment WHERE product_id = ${product_id} and parent_id = -1 order by created_at desc LIMIT ${off},${limit}`;
    return new Promise((resolve, reject) => {
        db.query(
            qs, function (err, result) {
                if (err) reject(err);
                resolve(result);
            }
        );
    })
}
async function findLikeByProduct(product_id, comment_id) {
    let qs = `SELECT * FROM like_comment WHERE product_id = ${product_id} and comment_id = ${comment_id}`;
    return new Promise((resolve, reject) => {
        db.query(
            qs, function (err, result) {
                if (err) reject(err);
                resolve(result);
            }
        );
    })
}

async function findLikeAndUpdate(product_id, user_id, comment_id, like_comment = 1) {
    let data = [product_id, user_id, comment_id, like_comment];
    let qs = 'SELECT * FROM like_comment WHERE product_id = ? and user_id = ? and comment_id = ? and like_comment = 1';
    return new Promise((resolve, reject) => {
        db.query(qs, data, function (err, result) {
            if (err) {
                reject(err);
            } else {
                if (result?.length > 0) {
                    db.query(
                        'DELETE FROM like_comment WHERE product_id = ? and user_id = ? and comment_id = ? and like_comment = 1', data,
                        function (err, update) {
                            if (err) console.log('DELETE', err);
                            resolve(update.affectedRows);
                        }
                    );
                } else {
                    db.query(
                        'INSERT INTO like_comment (product_id,user_id,comment_id,like_comment) VALUES  (?,?,?,?)', data,
                        function (err, create) {
                            if (err) console.log('insert', err);
                            resolve(create.affectedRows);
                        }
                    );
                }
            }
        });
    });
}

const getCommentsByParentId = (parentId) => {
    const query = `SELECT * FROM comment WHERE parent_id = ${parentId} order by created_at desc`;
    return new Promise((resolve, reject) => {
        db.query(
            query, function (err, result) {
                if (err) console.log(err);
                resolve(result);
            }
        );
    })
};
async function countCmByPd(product_id,) {
    let qs = `SELECT COUNT(product_id) as total FROM comment WHERE product_id = ${product_id} and parent_id = -1 GROUP BY product_id`;
    return new Promise((resolve, reject) => {
        db.query(
            qs, function (err, result) {
                if (err) reject(err);
                resolve(result[0]);
            }
        );
    })
}
module.exports = { createComment, findByProduct, countCmByPd, findLikeAndUpdate, getCommentsByParentId, findLikeByProduct };