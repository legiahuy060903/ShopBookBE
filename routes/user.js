const router = require('express').Router();
const ctrls = require('../controllers/user');
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken');


router.get('/', ctrls.getAllUser)
router.post('/register', ctrls.register)
router.post('/login', ctrls.login);
router.get('/account', verifyAccessToken, ctrls.getAccount)
// router.post('/refreshtoken', ctrls.refreshAccessToken)
router.get('/logout', ctrls.logout);
// router.get('/forgotpassword', ctrls.forgotPassword);
// router.put('/reset-password/', ctrls.resetPassword);
// router.get('/current', verifyAccessToken, ctrls.getCurrentUser)

// router.delete('/', [verifyAccessToken, isAdmin], ctrls.deleteUser)
// router.put('/current', [verifyAccessToken], ctrls.updateUser)
// router.put('/:uid', [verifyAccessToken, isAdmin], ctrls.updateUserByAdmin)
module.exports = router 