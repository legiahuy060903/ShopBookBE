const router = require('express').Router();
const ctrls = require('../controllers/order');
router.post('', ctrls.CreOrder);
router.get('', ctrls.getAllOrder);
router.post('/paypal', ctrls.paypalPost);
router.post('/capture', ctrls.capture);
module.exports = router;


