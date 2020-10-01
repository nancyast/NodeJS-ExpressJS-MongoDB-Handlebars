const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('home', { layout: false });
});

router
  .route('/signin')
  .get((req, res, next) => {
    res.render('signin', { layout: false });
  })
  .post(authController.signin);

router.route('/signup').post(authController.signup);

module.exports = router;
