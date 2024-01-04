const db = require('../config/connectdb');
const pool = require('../config/connectPromise');
const asyncHandler = require('express-async-handler');
async function register(query) {
    return new Promise((resolve, reject) => {
        db.query(
            `INSERT INTO account`,
            function (err, results, fields) {
                resolve(results);
            }
        );
    })

}
async function findEmail(email) {
    return new Promise((resolve, reject) => {
        db.query(
            `select * from account where email =? `, email,
            function (err, results) {
                if (err) throw err;
                else resolve(results[0]);
            }
        );
    })
}
async function find(qs) {
    let user = (await pool.query('SELECT * FROM account ' + qs))[0];
    let cut = qs.slice(0, qs.indexOf("LIMIT"));
    let total = ((await pool.query('SELECT count(id) as total FROM account ' + cut))[0])[0].total;
    const all = (await pool.query('SELECT * from account'))[0];
    const dataExport = all.map(item => {
        delete item.refreshToken
        delete item.role
        delete item.id
        return item
    });
    return { data: user, total: total, export: dataExport };
}
const findById = async (id) => {
    return new Promise((resolve, reject) => {
        db.query(
            `select id, name , email , address , avatar , role , phone,gender,date  from account where id = ? `, id,
            function (err, results) {
                if (err) reject(err);
                else resolve(results[0]);
            }
        );
    })
}
const findByIdAndPass = async (id, password) => {
    return new Promise((resolve, reject) => {
        db.query(
            `select id from account where id = ? and password = ? `, [id, password],
            function (err, results) {
                if (err) reject(err);
                else resolve(results[0]);
            }
        );
    })
}
const updateToken = (id, token) => {
    return new Promise((resolve, reject) => {
        db.query(
            "UPDATE account SET refreshToken = ? WHERE id = ?",
            [token, id],
            function (err, data) {
                if (err) throw err;
                else resolve(data);
            }
        );
    });
};
const updateRefreshToken = (t) => {
    return new Promise((resolve, reject) => {
        db.query(
            "UPDATE account SET refreshToken = '' WHERE refreshToken = ?",
            t,
            function (err, data) {
                if (err) throw err;
                else resolve(data);
            }
        );
    });
};
async function findEmailAndPassword(email, password) {
    return new Promise((resolve, reject) => {
        db.query(
            `select * from account where email = ? and password = ?`, [email, password],
            function (err, results) {
                if (err) throw err;
                else resolve(results[0]);
            }
        );
    })
}
const create = asyncHandler((user) => {
    return new Promise((resolve, reject) => {
        db.query("INSERT INTO account SET ?", user, function (err, data) {
            if (err) throw new Error('Lỗi xảy ra trong db');
            else resolve(data.affectedRows);
        });
    });
});
const updateUser = asyncHandler((user, id) => {
    return new Promise((resolve, reject) => {
        db.query("UPDATE account SET ? WHERE id = ?", [user, id], function (err, data) {
            if (err) throw new Error(err);
            else resolve(data);
        });
    });
});
const findAndDelete = async (id) => {
    const deleteLikeCommentQuery = `DELETE FROM like_comment WHERE user_id = ?`;
    const deleteCommentQuery = `DELETE FROM comment WHERE user_id = ?`;
    const deleteOrderDetailQuery = `DELETE FROM orders WHERE user_id = ?`;
    const idOrder = (await pool.query('SELECT id from orders where user_id = ?', id))[0].map(item => item.id);
    if (idOrder && idOrder?.length > 0) {
        idOrder.forEach(async (idOr) => {
            await pool.query('DELETE FROM order_detail where order_id = ?', idOr);
        });
    }
    await Promise.all([pool.query(deleteOrderDetailQuery, id),
    pool.query(deleteLikeCommentQuery, id), pool.query(deleteCommentQuery, id)]);

    let re = (await pool.query('DELETE FROM account where id = ?', id))[0];
    return re.affectedRows
}

module.exports = { findAndDelete, find, register, findEmail, create, findEmailAndPassword, updateToken, findByIdAndPass, findById, updateRefreshToken, updateUser }