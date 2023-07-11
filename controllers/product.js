
const productModel = require('../models/product')
const cloudinary = require('cloudinary').v2;
const asyncHandler = require('express-async-handler');



const createProduct = asyncHandler(async (req, res) => {
    const { name, desciption, publish_date, price, category_id,
        number_of_page, quantity, created_at, feature } = req.body
    if (!req.file) {
        next(new Error('No file uploaded!'));
        return;
    }
    if (!name || !desciption || !publish_date || !price || !category_id ||
        !number_of_page || !quantity || !created_at || !feature) {
        if (req.file) cloudinary.uploader.destroy(req.file.filename)
    }

    res.json({ secure_url: req.file.path });
})
const getProduct = asyncHandler(async (req, res) => {
    const { page, sort, filterMaxPrice, filterMinPrice, category, search, limit } = req.query;

    let qs = '';
    let whereClause = '';
    const li = +limit || 10;
    let conditions = [];

    if (page) {
        const offset = (+req.query.page > 0 ? (+req.query.page - 1) * li : 0);
        qs = ` LIMIT ${offset},${li}`;
    } else {
        const offset = 0
        qs = ` LIMIT ${offset},${li}`;
    }
    if (sort) {
        qs = `order by price ${req.query.sort}` + qs
    }
    if (filterMinPrice && filterMaxPrice > filterMinPrice) {
        conditions.push(`price > ${filterMinPrice} AND price < ${filterMaxPrice}`);
    }
    if (category) {
        conditions.push(`category_id = ${category}`);
    }
    if (search) {
        conditions.push(`name LIKE '%${search}%'`);
    }

    if (conditions.length > 0) {
        whereClause = `WHERE ${conditions.join(' AND ')}`;
    }

    const query = `SELECT * FROM product ${whereClause} ${qs}`;
    const result = await productModel.allProduct(query);

    const queryCount = query.slice(0, query.indexOf('LIMIT'));

    const total = await productModel.countProduct(queryCount);

    return res.status(200).json({
        success: true,
        data: { data: result, total: total.length },
    });
});
const getBanner = asyncHandler(async (req, res) => {
    let result = await productModel.findAllBanner();
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

const getTopView = asyncHandler(async (req, res) => {
    let result = await productModel.findAllTopView();
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
const getTopNew = asyncHandler(async (req, res) => {
    let result = await productModel.findAllNew();
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

const getProductDetail = asyncHandler(async (req, res) => {
    let id = req.params.id;
    let result = await productModel.findOneProduct(id);
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
module.exports = { getProduct, createProduct, getBanner, getTopView, getTopNew, getProductDetail }