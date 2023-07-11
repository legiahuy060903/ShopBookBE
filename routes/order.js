const router = require('express').Router();
const ctrls = require('../controllers/order');


router.post('', ctrls.CreOrder)
module.exports = router 