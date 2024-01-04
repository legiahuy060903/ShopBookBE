const jwt = require('jsonwebtoken');

const generateAccessToken = (uid, role) => {
    return jwt.sign({ id: uid, role: role }, process.env.JWT_SECRET, { expiresIn: '10h' })
}
const generateRefreshToken = (uid, role) => {
    return jwt.sign({ id: uid, role: role }, process.env.JWT_SECRET, { expiresIn: '7d' })
}
module.exports = { generateAccessToken, generateRefreshToken }