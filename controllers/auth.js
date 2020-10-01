const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const catchError = require('../utils/catchError');
const { userService } = require('../services/users');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');
const { promisify } = require('./utils');

const JWT_SECRET = 'H00ngNhung';

const signToken = (id) => jwt.sign({ id }, JWT_SECRET, { expiresIn: '1h' });

module.exports.signup = catchError(async (req, res) => {
  const { firstName, email, password, confirmedPassword } = req.body;
  const user = await userService.createUser({
    firstName,
    email,
    password,
    confirmedPassword,
  });

  const token = signToken(user.id);

  res.json({
    user,
    token,
  });
});

module.exports.signin = catchError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    next(new AppError('Please provide email and password', 400));
  }

  const isauthenticated = await userService.login(email, password);

  if (!user || !isauthenticated) {
    next(new AppError('Incorrect email or password', 401));
  }

  const token = signToken(user.id);

  res.json({
    status: 'success',
    token,
  });
});

module.exports.protect = catchError(async (req, res, next) => {
  // 1. Get token and check of it's there.
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in. Please login to get access', 401)
    );
  }

  // 2. Verification token
  const decoded = promisify(jwt.verify)(token, JWT_SECRET);
  // jwt.verify(token, JWT_SECRET, (error, decoded) => {
  //   if (error && error.name === 'JsonWebTokenError') {
  //     next(new AppError('Invalid token. Please login again!'));
  //   } else if (error && error.name === 'TokenExpiredError') {
  //     next(new AppError('Expired token. Please login again!'));
  //   }
  // });
  // 3. Check the user still exists
  const currentUser = await userService.getUser(decoded.id);
  if (!freshUser) {
    next(new AppError('User does not exist', 401));
  }

  // 4. Check if the user changed password after the token was issued.

  req.user = currentUser; // grant access to protected route
  next();
});

module.exports.restrictTo = (...roles) => (req, res, next) => {
  if (roles.includes(req.user.role)) {
    next();
  }

  return next(new AppError('You are not granted to do this action!'));
};

module.exports.forgotPassword = catchError(async (req, res, next) => {
  // 1. Get user
  const user = await userService.findUser({ email: req.body.email });

  if (!user) {
    next(new AppError('There is no user with email address', 404));
  }

  // 2. Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3. Send it to the user's email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request
   with your new password and passwordConfirmed to ${resetURL}.\n`;

  try {
    await sendEmail({
      email: 'nhungast@gmail.com',
      subject: 'Your password reset token, valid for 5 min',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email',
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        'There was an error sending the email. Please try again later!',
        500
      )
    );
  }
});

module.exports.resetPassword = catchError(async (req, res, next) => {
  // 1. Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  const user = await userService.findUser({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2. If the token has not expired and there is user, set the new password
  if (!user) {
    return next(new AppError('Token is invalid or expired', 400));
  }

  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3. Update changedPasswordAt property for the user.

  // 4. Log the user in, send jwt.
  const token = signToken(user.id);

  res.json({
    status: 'success',
    token,
  });
});

module.exports.updatePassword = catchError(async (req, res, next) => {
  // 1. Get the user from collection
  // 2. Check if the POSTed current password is correct.
  // 3. If so, update password.
  // 4. Log user in, send jwt.
});
