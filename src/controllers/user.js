const { generateAccessToken, generateRefreshToken } = require('../middlewares/jwt');
const User = require('../models/user');
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
        const newrefreshToken = generateRefreshToken(isAccount.id, isAccount.role);
        await User.updateToken(isAccount.id, newrefreshToken);
        res.cookie('refreshToken', newrefreshToken, { maxAge: 3 * 24 * 60 * 60 * 1000 })
        return res.status(200).json({
            accessToken,
            success: true,
            account: data,
        })
    } else {
        return res.status(200).json({
            success: false,
            message: 'Sai thông tin tài khoản'
        })
    }
})
const getAllUser = asyncHandler(async (req, res) => {
    const { page, limit, sort, val_sort, search } = req.query;

    let qs = '';
    const page_current = page || 1;
    const li = limit || 10;
    const offset = (page_current > 0 ? (page_current - 1) * li : 0);

    qs = ` LIMIT ${offset},${li}`;

    if (sort || val_sort) {
        qs = ` ORDER BY ${sort} ${val_sort} ` + qs
    }
    if (search) {
        qs = ` where name like '%${search}%' OR email like '%${search}%'  OR phone  like '%${search}%' ` + qs
    }
    const result = await User.find(qs);

    return res.status(200).json({
        success: false,
        data: result
    })

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
    // if (!cookie || !cookie?.refreshToken) throw new Error("No refresh token in cookie");
    // await User.updateRefreshToken(cookie.refreshToken);
    // res.clearCookie('refreshToken', {
    //     httpOnly: true,
    //     secure: true
    // })
    return res.status(200).json({
        success: true,
        data: 'Logout is done !'
    })
});
const updateUserAvatar = asyncHandler(async (req, res) => {
    const { id } = req.user;
    const file = req.file.path;
    if (file) {
        const data = { avatar: file };
        await User.updateUser(data, id);
        return res.status(200).json({
            success: true,
            data: { url: file, mes: 'Cập nhật thành công' }
        });
    }
    return res.status(200).json({
        data: { success: false }
    })
})
const updateUser = asyncHandler(async (req, res) => {
    const { id, role } = req.user;
    if (+role === 1) {
        let id = req.params.id;
        const user = await User.updateUser(req.body, id);
        if (user.affectedRows > 0) {
            return res.status(200).json({
                data: { success: true, mes: 'Cập nhật thành công' }
            })
        }
        return res.status(404).json({
            success: false,
            message: 'Có lỗi xảy ra'
        });
    }
    const u = await User.updateUser(req.body, id);
    if (u.affectedRows > 0) {
        return res.status(200).json({
            success: true,
            data: 'Cập nhật thành công'
        })
    }
    return res.status(404).json({
        success: false,
        message: 'Có lỗi xảy ra'
    });
})
const updatePassUser = asyncHandler(async (req, res) => {
    const { id } = req.user;
    const { pass_current, password } = req.body;
    const is = await User.findByIdAndPass(id, pass_current);
    if (is) {
        let body = { password: password }
        const u = await User.updateUser(body, id);
        if (u.affectedRows > 0) {
            return res.status(200).json({
                success: true,
                data: { success: true, mes: 'Cập nhật thành công' }
            })
        }
    } else {
        return res.status(200).json({
            success: true,
            data: { success: false, mes: 'Sai thông tin' }
        })
    }
})
const deleteUser = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const re = await User.findAndDelete(id);
    if (re > 0) {
        return res.status(200).json({
            data: {
                success: true,
                mes: 'Đã xóa tài khoản trên !'
            }
        });
    }
    res.status(404).json({
        success: false
    });
})


module.exports = { deleteUser, getAllUser, register, login, getAccount, logout, updateUser, updateUserAvatar, updatePassUser }
