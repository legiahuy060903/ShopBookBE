const router = require('express').Router();
const ctrls = require('../controllers/category');
// // const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken');

router.get('/', ctrls.getCategory);
router.get('/chart/pie', ctrls.getProByCat);
// // router.use(verifyAccessToken, isAdmin);
// // router.post('/', ctrls.createCategory)
// // router.put('/:cid', ctrls.updateCategory)
// // router.delete('/:cid', ctrls.deleteCategory)

module.exports = router;