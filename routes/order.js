const router = require('express').Router();
const ctrls = require('../controllers/order');


router.post('', ctrls.CreOrder);
router.get('', ctrls.getAllOrder);
module.exports = router 