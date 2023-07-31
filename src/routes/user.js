const router = require('express').Router();
const ctrls = require('../controllers/user');
const uploadCloud = require('../middlewares/upload');
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken');

//[verifyAccessToken, isAdmin], 
router.get('/', [verifyAccessToken, isAdmin], ctrls.getAllUser);
router.post('/register', ctrls.register)
router.post('/login', ctrls.login);
router.get('/account', verifyAccessToken, ctrls.getAccount);
router.put('/current/pass', verifyAccessToken, ctrls.updatePassUser);
router.put('/current', verifyAccessToken, ctrls.updateUser);
router.put('/current/avatar', verifyAccessToken, uploadCloud.single('avatar'), ctrls.updateUserAvatar);

// router.post('/refreshtoken', ctrls.refreshAccessToken)
router.get('/logout', ctrls.logout);
// router.get('/forgotpassword', ctrls.forgotPassword);
// router.put('/reset-password/', ctrls.resetPassword);
// router.get('/current', verifyAccessToken, ctrls.getCurrentUser)

router.delete('/:id', [verifyAccessToken, isAdmin], ctrls.deleteUser);
router.put('/:id', [verifyAccessToken, isAdmin], ctrls.updateUser)
module.exports = router 
