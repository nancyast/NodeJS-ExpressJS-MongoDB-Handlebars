const User = require('../models/user');
const catchError = require('../utils/catchError');
const { userService } = require('../services/users');

module.exports.getAllUsers = catchError(async (req, res) => {
  const users = await userService.getAllUsers(req.query);
  res.render('users', { users });
});

module.exports.renderCreateUserPage = catchError(async (req, res) => {
  res.render('createUser');
});

module.exports.renderEditUserPage = catchError(async (req, res) => {
  const user = await userService.getUser(req.params.id);
  if (!user) {
  }
  res.render('editUser', { user });
});

// module.exports.getUser = catchError(async (req, res) => {
//   if (!req.params.id) {
//     return res.status(400).json({
//       error: {
//         message: 'Missing ID',
//       },
//     });
//   }
//   const userService = new UserService(req.query);
//   const user = await userService.getUser(req.params.id);

//   if (!user) {
//     throw new AppError({
//       status: 404,
//       message: 'No user found with that ID',
//     });
//   }

//   res.render('editUser', { user });
//   res.status(404).send();
// });

module.exports.updateUser = catchError(async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404);
    }

    const updated = await userService.updateUser(req.params.id, req.body);
    res.status(200).json(updated);
  } catch (error) {
    res.send(404);
  }
});

module.exports.createUser = catchError(async (req, res) => {
  const { user, error } = await userService.createUser(req.body);

  if (error) {
    res.status(400).json(error);
  } else {
    res.status(201).json(user);
  }
});

module.exports.deleteUser = catchError(async (req, res) => {
  const deleted = await userService.deleteUser(req.params.id);

  res.json(deleted);
});
