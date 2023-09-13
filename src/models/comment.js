const db = require('../config/connectdb');
const pool = require('../config/connectPromise');
async function createComment(data) {
    const re = (await pool.query('INSERT INTO comment SET ?', data))[0]
    return re.insertId
}
async function countCmByPd(product_id) {
    let qs = `SELECT COUNT(product_id) as total FROM comment WHERE product_id = ${product_id} and parent_id = -1 and block = 1 GROUP BY product_id`;

    const [total] = (await pool.query(qs))[0];
    return total;

}
async function findByProduct(product_id, off, limit) {
    let qs = `SELECT * FROM comment WHERE product_id = ${product_id} and parent_id = -1 and block = 1 order by created_at desc LIMIT ${off},${limit}`;
    return (await pool.query(qs))[0];
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


const getCommentsByParentId = async (parentId) => {
    const query = `SELECT * FROM comment WHERE parent_id = ${parentId} and block = 1 order by created_at desc`;
    return (await pool.query(query))[0];
};
async function findLikeByProduct(product_id, comment_id) {
    let qs = `SELECT * FROM like_comment WHERE product_id = ${product_id} and comment_id = ${comment_id}`;
    return (await pool.query(qs))[0];
}

const findAllComment = async (qs) => {
    let query = `SELECT * FROM comment where parent_id = -1 ` + qs;
    let parent = (await pool.query(query))[0];
    let cut = qs.slice(0, qs.indexOf("LIMIT"));
    let total = ((await pool.query('SELECT count(id) as total  FROM comment where parent_id = -1' + cut))[0])[0].total;
    const data = await Promise.all(parent.map(async (item) => {
        const result = await getCommentsByParentId(item.id);
        const like_comment = await findLikeByProduct(item.product_id, item.id);
        if (result) item.reply = result;
        if (like_comment) item.like = like_comment;
        return item;
    }))
    return { data: data, total }
}
const findAndDelete = async (id) => {
    const like = `DELETE FROM like_comment WHERE comment_id = ?`;
    const child = `DELETE FROM comment WHERE parent_id = ?`;
    const parent = `DELETE FROM comment WHERE id = ?`;
    await Promise.all([pool.query(like, id), pool.query(child, id)]);
    let re = (await pool.query(parent, id))[0]
    return re.affectedRows;
}
const findAndUpdate = async (data) => {
    const { id, ...rest } = data;
    const re = (await pool.query("UPDATE comment SET ? WHERE id = ?", [rest, id]))[0];
    return re?.affectedRows;
}
module.exports = { findAndDelete, findAndUpdate, findAllComment, createComment, findByProduct, countCmByPd, findLikeAndUpdate, getCommentsByParentId, findLikeByProduct };