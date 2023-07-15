const jwt = require('jsonwebtoken');

const generateAccessToken = (uid, role) => {
    return jwt.sign({ id: uid }, process.env.JWT_SECRET, { expiresIn: '10h' })
}
const generateRefreshToken = (uid) => {
    return jwt.sign({ id: uid }, process.env.JWT_SECRET, { expiresIn: '1h' })
}
module.exports = { generateAccessToken, generateRefreshToken }