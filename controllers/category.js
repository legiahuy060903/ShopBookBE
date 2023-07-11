
const categoryModel = require('../models/category');
const asyncHandler = require('express-async-handler');




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

module.exports = { getCategory }