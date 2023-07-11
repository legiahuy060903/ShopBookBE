const { generateAccessToken, generateRefreshToken } = require('../middlewares/jwt');
const User = require('../models/user');
// const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler');

const register = asyncHandler(async (req, res) => {
    const { email, password, name, phone, address } = req.body
    if (!email || !password || !name || !phone)
        return res.status(400).json({
            success: false,
            message: 'Missing inputs'
        })

    const user = await User.findEmail(email);
    if (user) return res.status(403).json({
        success: false,
        message: 'Đã tồn tại email trên'
    })
    else {
        const newUser = await User.create(req.body);
        if (+newUser === 1) {
            return res.status(200).json({
                success: newUser ? true : false,
                message: newUser ? 'Đăng kí thành công' : 'Có lỗi xảy ra'
            })
        }
        res.status(404).json({
            success: false,
            message: 'Có lỗi xảy ra'
        })
    }
})
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
        return res.status(404).json({
            success: false,
            message: 'Missing inputs'
        })
    const isAccount = await User.findEmailAndPassword(email, password);
    if (isAccount) {
        const { password, created_at, refreshToken, ...data } = isAccount;
        const accessToken = generateAccessToken(isAccount.id, isAccount.role);
        const newrefreshToken = generateRefreshToken(isAccount.id);
        await User.updateToken(isAccount.id, newrefreshToken);
        res.cookie('refreshToken', newrefreshToken, { httpOnly: true, maxAge: 3 * 24 * 60 * 60 * 1000 })
        return res.status(200).json({
            accessToken,
            success: true,
            account: data,
        })
    } else {
        return res.status(403).json({
            success: false,
            message: 'Sai thông tin tài khoản'
        })
    }
})
const getAllUser = asyncHandler(async (req, res) => {
    // const result = await User.find().select('-refreshToken -password -role')
    // return res.status(200).json({
    //     success: true,
    //     users: result
    // })
})
const getAccount = asyncHandler(async (req, res) => {
    const { id } = req.user;
    const user = await User.findById(id);
    if (user) return res.status(200).json({
        success: true,
        data: user
    })
    res.status(401).json({
        success: false,
        message: 'lllllllllllllll'
    })
})
const logout = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie || !cookie.refreshToken) throw new Error("No refresh token in cookie");
    await User.updateRefreshToken(cookie.refreshToken);
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true
    })
    return res.status(200).json({
        success: true,
        data: 'Logout is done !'
    })
})
module.exports = { getAllUser, register, login, getAccount, logout }
