
const categoryModel = require('../models/category');
const asyncHandler = require('express-async-handler');
const productModel = require('../models/product')



const getCategory = asyncHandler(async (req, res) => {
    let result = await categoryModel.findCategory();
    if (result) {
        return res.status(200).json({
            success: true,
            data: result,
        });
    }
    return res.status(200).json({
        success: false,
    });
})
const createCategory = asyncHandler(async (req, res) => {
    const { name, block } = req.body;
    if (!name || !block) return res.status(404).json({
        success: false
    });
    await categoryModel.create(name, block);
    return res.status(200).json({
        data: {
            success: true,
            mes: 'Thêm thành công'
        }
    });
})
const delCategory = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const reCat = await categoryModel.del(id);
    if (reCat > 0) {
        return res.status(200).json({
            data: { success: true, mes: 'Đã xóa id : ' + id }
        });
    }
    return res.status(404).json({ success: false });
})
const updateCategory = asyncHandler(async (req, res) => {
    const { name, block, id } = req.body;
    console.log(name, block, id);
    if (!name || !block) return res.status(404).json({
        success: false
    });
    let re = await categoryModel.update(id, req.body);
    if (re > 0) {
        return res.status(200).json({
            data: {
                success: true,
                mes: 'Cập nhật thành công'
            }
        });
    }
    return res.status(404).json({ success: false });
})
const getProByCat = asyncHandler(async (req, res) => {
    let result = await categoryModel.countProByCat();
    if (result) {
        return res.status(200).json({
            success: true,
            data: result,
        });
    }
    return res.status(200).json({
        success: false,
    });
})

module.exports = { updateCategory, getCategory, getProByCat, createCategory, delCategory }