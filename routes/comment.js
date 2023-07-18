const router = require('express').Router();
const ctrls = require('../controllers/comment');
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken');

router.get('/', ctrls.getComments);
router.post('', verifyAccessToken, ctrls.create);
router.post('/like', ctrls.createLike);

module.exports = router 