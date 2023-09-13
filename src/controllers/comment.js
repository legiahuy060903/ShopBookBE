
const { createComment, findAndUpdate, findAndDelete, findByProduct, countCmByPd, getCommentsByParentId, findLikeAndUpdate, findLikeByProduct, findAllComment } = require('../models/comment');
const asyncHandler = require('express-async-handler');


const create = asyncHandler(async (req, res) => {
    const result = await createComment(req.body);
    if (result) {
        return res.status(200).json({
            success: true,
            data: { mes: 'Tạo bình luận' },
        });
    }
    return res.status(404).json({
        success: false
    });
});
const createLike = asyncHandler(async (req, res) => {
    const { product_id, user_id, comment_id, like_comment } = req.body;
    if (!product_id || !user_id || !comment_id) {
        return res.status(404).json({
            success: false,
            mes: 'Thieeus truong'
        });
    }

    let isLike = await findLikeAndUpdate(product_id, user_id, comment_id, like_comment);
    console.log(isLike);
    if (isLike) {
        return res.status(200).json({
            success: true,
            data: null,
        });
    }
});
const getComments = asyncHandler(async (req, res) => {
    const { product_id, page } = req.query;
    const li = 5;
    if (product_id) {
        const { total } = await countCmByPd(product_id);
        if (total) {
            const offset = page ? (page - 1) * 5 : 0;
            const data = await findByProduct(product_id, offset, li);
            const comments = await Promise.all(
                data.map(async (item) => {
                    const result = await getCommentsByParentId(item.id);
                    const like_comment = await findLikeByProduct(item.product_id, item.id);
                    if (result) item.reply = result;
                    if (like_comment) item.like = like_comment;
                    return item;
                })
            );
            const result = { comments, total: total };
            return res.status(200).json({
                success: true,
                data: result,
            });
        } else {
            return res.status(200).json({
                success: true,
                data: null,
            });
        }
    }
    return res.status(404).json({
        success: false,
    });
});
const getAllComments = asyncHandler(async (req, res) => {
    const { page, limit, sort, val_sort } = req.query;
    const li = limit || 10;
    let page_current = +page || 1;

    const offset = (page_current > 0 ? (page_current - 1) * li : 0);
    let qs = ` LIMIT ${offset},${li} `;
    if (sort || val_sort) {
        qs = ` ORDER BY ${sort} ${val_sort} ` + qs;
    }
    const re = await findAllComment(qs);
    return res.status(200).json({
        success: true,
        data: re,
    });
});
const delComment = asyncHandler(async (req, res) => {
    let result = await findAndDelete(req.params.id);
    if (result) {
        return res.status(200).json({
            data: {
                success: true,
                mes: 'Đã xóa bình luận trên'
            }
        });
    }
    res.status(404).json({
        success: false,
        message: 'Lỗi xảy ra'
    });
});
const updateComment = asyncHandler(async (req, res) => {
    let result = await findAndUpdate(req.body);
    if (result > 0) {
        return res.status(200).json({
            data: {
                success: true,
                mes: 'Cập nhật thành công'
            }
        });
    }
    res.status(404).json({
        success: false,
        message: 'Lỗi xảy ra'
    });
});
module.exports = { updateComment, getAllComments, create, getComments, createLike, delComment };