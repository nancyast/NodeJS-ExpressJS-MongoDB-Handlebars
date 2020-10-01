const mongoose = require('mongoose');
const crypto = require('crypto');
// const slugify = require('slugify');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'A user must have a first name'],
  },
  lastName: {
    type: String,
    required: [true, 'A user must have a last name'],
  },
  slug: String,
  dob: String,
  gender: String,
  email: String,
  country: String,
  zipCode: String,
  address: String,
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'leader'],
    default: 'user',
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  // roles: [
  //   // child reference
  //   {
  //     type: mongoose.Schema.ObjectId,
  //     ref: 'Role', // manager or employee or systemAdmin
  //   },
  // ],
});

// DOCUMENT middleware runs only before create() and save()

// userSchema.pre('save', function (next) {
//   console.log('Will save the document');
//   next();
// });

// userSchema.post('save', function (doc, next) {
//   console.log('Saved the doc');
//   next();
// });

// QUERY middleware
// userSchema.pre(/^find/, function (next) {
//   console.log(this); // this is query object;
//   next();
// });

// userSchema.post(/^find/, function (docs, next) {
//   console.log(docs);
//   next();
// });

// AGGREGATION midleware
// userSchema.pre('aggregate', function (next) {
//   console.log(this.pipeline()); // aggregation object
//   next();
// });

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
