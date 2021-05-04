const { Router } = require('express');
const UserController = require('./controllers/UserController');
const Auth = require('./middlewares/Auth');

const router = Router();
router.delete('/users/:id', UserController.remove)
router.post('/users', UserController.create);
router.post('/users/recovery', UserController.recoveryPassword);
router.put('/users',UserController.edit)
router.post('/users/changepassword', UserController.changePassword)
router.get('/users', Auth,UserController.index)
router.post('/users/login', UserController.login)
module.exports = router;