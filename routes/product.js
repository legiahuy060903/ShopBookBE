const router = require('express').Router();
const ctrls = require('../controllers/product');
const uploadCloud = require('../middlewares/upload');
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken');


router.post('/', uploadCloud.single('thumbnail'), ctrls.createProduct)
router.get('/', ctrls.getProduct);

router.get('/banner', ctrls.getBanner);
router.get('/top_sold', ctrls.getTopSold);
router.get('/topview', ctrls.getTopView);
router.get('/topnew', ctrls.getTopNew);
router.get('/detail/:id', ctrls.getProductDetail);
// router.get('/', ctrls.getProducts);
// router.put('/ratings', verifyAccessToken, ctrls.ratings);
// router.use(verifyAccessToken, isAdmin);
// router.put('/:pid', ctrls.updateProduct)
// router.delete('/:pid', ctrls.deleteProduct)







module.exports = router 