const db = require('../config/connectdb');
const asyncHandler = require('express-async-handler');
async function register(query) {
    return new Promise((resolve, reject) => {
        db.query(
            `INSERT INTO user`,
            function (err, results, fields) {
                resolve(results);
            }
        );
    })

}
async function findEmail(email) {
    return new Promise((resolve, reject) => {
        db.query(
            `select * from user where email =? `, email,
            function (err, results) {
                if (err) throw err;
                else resolve(results[0]);
            }
        );
    })
}
const findById = async (id) => {
    return new Promise((resolve, reject) => {
        db.query(
            `select id, name , email , address , avatar , role , phone,gender,date  from user where id = ? `, id,
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
            `select id from user where id = ? and password = ? `, [id, password],
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
            "UPDATE user SET refreshToken = ? WHERE id = ?",
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
            "UPDATE user SET refreshToken = '' WHERE refreshToken = ?",
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
            `select * from user where email = ? and password = ?`, [email, password],
            function (err, results) {
                if (err) throw err;
                else resolve(results[0]);
            }
        );
    })
}
const create = asyncHandler((user) => {
    return new Promise((resolve, reject) => {
        db.query("INSERT INTO user SET ?", user, function (err, data) {
            if (err) throw new Error('Lỗi xảy ra trong db');
            else resolve(data.affectedRows);
        });
    });
});
const updateUser = asyncHandler((user, id) => {
    return new Promise((resolve, reject) => {
        db.query("UPDATE user SET ? WHERE id = ?", [user, id], function (err, data) {
            if (err) throw new Error(err);
            else resolve(data);
        });
    });
});
module.exports = { register, findEmail, create, findEmailAndPassword, updateToken, findByIdAndPass, findById, updateRefreshToken, updateUser }