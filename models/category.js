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

module.exports = { findCategory }