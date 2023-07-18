
const { createComment, findByProduct, countCmByPd, getCommentsByParentId, findLikeAndUpdate, findLikeByProduct } = require('../models/comment');
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
        const total = await countCmByPd(product_id);
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
            const result = { comments, ...total };
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
module.exports = { create, getComments, createLike };