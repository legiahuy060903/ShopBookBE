const router = require('express').Router();
const ctrls = require('../controllers/product');
const uploadCloud = require('../middlewares/upload');
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken');


router.post('', [verifyAccessToken, isAdmin], uploadCloud.fields([{ name: 'slide' }, { name: 'thumbnail' }]), ctrls.createProduct);
router.get('/', ctrls.getProduct);
router.get('/banner', ctrls.getBanner);
router.get('/top_sold', ctrls.getTopSold);
router.get('/topview', ctrls.getTopView);
router.get('/topnew', ctrls.getTopNew);
router.get('/detail/:id', ctrls.getProductDetail);
// router.get('/', ctrls.getProducts);
// router.put('/ratings', verifyAccessToken, ctrls.ratings);
// router.use(verifyAccessToken, isAdmin);
router.put('/:id', [verifyAccessToken, isAdmin], uploadCloud.fields([{ name: 'slide' }, { name: 'thumbnail' }]), ctrls.updateProduct)
router.delete('/img', [verifyAccessToken, isAdmin], ctrls.delImgProduct);
router.delete('/:id', [verifyAccessToken, isAdmin], ctrls.deleteProduct);


module.exports = router 
