const express = require('express');
const router = express.Router();
const userController = require('../controllers/users');
const authController = require('../controllers/auth');

router.get('/create', userController.renderCreateUserPage);

router.get('/edit/:id', userController.renderEditUserPage);

router
  .route('/')
  .get(userController.getAllUsers)
  // .get(authController.protect, userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  // .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'leader'),
    userController.deleteUser
  );

router.route('/forgotPassword').post(authController.forgotPassword);
router.route('/resetPassword/:token').patch(authController.resetPassword);
router
  .route('/updatePassword')
  .patch(authController.protect, authController.updatePassword);

module.exports = router;
