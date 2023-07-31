const router = require('express').Router();
const ctrls = require('../controllers/category');
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken');

router.get('/', ctrls.getCategory);
router.get('/chart/pie', ctrls.getProByCat);
// // router.use(verifyAccessToken, isAdmin);
router.post('/', [verifyAccessToken, isAdmin], ctrls.createCategory)
router.put('/', [verifyAccessToken, isAdmin], ctrls.updateCategory)
router.delete('/:id', ctrls.delCategory)

module.exports = router;