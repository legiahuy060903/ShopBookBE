const router = require('express').Router();
const ctrls = require('../controllers/order');
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken');
router.post('', ctrls.CreOrder);
router.put('/user', verifyAccessToken, ctrls.updateOrder);
router.put('', [verifyAccessToken, isAdmin], ctrls.updateOrder);
router.get('', ctrls.getAllOrder);
router.get('/detail', ctrls.getAllOrderAndDetail);
router.post('/paypal', ctrls.paypalPost);
router.post('/capture', ctrls.capture);
router.delete('/:id', ctrls.delOrder);
module.exports = router;


