
const productModel = require('../models/product')
const cloudinary = require('cloudinary').v2;
const asyncHandler = require('express-async-handler');



const createProduct = asyncHandler(async (req, res) => {
    const { ...body } = req.body;
    const thumbnail = req.files.thumbnail[0];
    const slide = req.files.slide;
    body.thumbnail = thumbnail.path;
    const resultID = await productModel.createProduct(body);
    if (resultID) {
        if (slide) {
            let arrImg = slide.map((item) => ([resultID, item.path]));
            const result = await productModel.createProductImage(arrImg);
            if (result) return res.status(200).json({
                success: true,
                data: 'Thêm sản phẩm thành công',
            });
            else {
                return res.status(404).json({
                    success: false,
                    data: 'Có lỗi xảy ra',
                });
            }
        } else {
            return res.status(200).json({
                success: true,
                data: 'Thêm sản phẩm thành công',
            });
        }
    }
})

const getProduct = asyncHandler(async (req, res) => {
    const { page, sort, filterMaxPrice, filterMinPrice, category, sort_category, quantity, search, created_at, limit } = req.query;

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

    if (sort_category) {
        qs = `order by p.category_id ${req.query.sort_category}` + qs;
    } else if (quantity) {
        qs = `order by p.quantity ${req.query.quantity}` + qs
    } else if (sort) {
        qs = `order by p.price ${req.query.sort}` + qs
    } else if (created_at) {
        qs = `order by p.created_at ${req.query.created_at}` + qs
    }


    if (filterMinPrice && filterMaxPrice > filterMinPrice) {
        conditions.push(`p.price > ${filterMinPrice} AND p.price < ${filterMaxPrice}`);
    }
    if (category) {
        conditions.push(`p.category_id = ${category}`);
    }
    if (search) {
        conditions.push(`p.name LIKE '%${search}%'`);
    }

    if (conditions.length > 0) {
        whereClause = `AND ${conditions.join(' AND ')}`;
    }

    const query = `SELECT p.*, c.name as name_category FROM product p JOIN category c WHERE c.id = p.category_id ${whereClause} ${qs}`;
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
const getTopSold = asyncHandler(async (req, res) => {
    let result = await productModel.findTopSold();
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
module.exports = { getProduct, createProduct, getBanner, getTopView, getTopSold, getTopNew, getProductDetail }