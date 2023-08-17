const router = require('express').Router();
const ctrls = require('../controllers/comment');
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken');

router.get('/', ctrls.getComments);
router.post('', verifyAccessToken, ctrls.create);
router.post('/like', ctrls.createLike);
router.get('/admin', [verifyAccessToken, isAdmin], ctrls.getAllComments);
router.put('/admin', [verifyAccessToken, isAdmin], ctrls.updateComment);
router.delete('/admin/:id', [verifyAccessToken, isAdmin], ctrls.delComment);
module.exports = router


