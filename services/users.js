const User = require('../models/user');
const bcrypt = require('bcryptjs');
const { verifyPassword, nomalizeUser, nomalizeUsers } = require('./calculator');

class UserService {
  getUser(id) {
    return User.findById(id).lean();
  }

  async getAllUsers(queryObj = {}) {
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((e) => (queryObj[e] = undefined));
    const users = await User.find(queryObj).lean();
    return nomalizeUsers(users);
  }

  async createUser(params) {
    const { password, confirmedPassword } = params;
    const error = verifyPassword(password, confirmedPassword);
    if (error) {
      return { user: {}, error };
    }

    const hashed = await bcrypt.hash(password, 12);
    return {
      user: await User.create({ ...params, password: hashed }),
      error,
    };
  }

  deleteUser(id) {
    return User.deleteOne({ _id: id });
  }

  updateUser(id, params) {
    return User.findByIdAndUpdate(id, params, {
      new: true,
      runValidators: true,
    });
  }

  async findUser(query) {
    const user = User.findOne(query).lean();
    return nomalizeUser(user);
  }

  async login(email, password) {
    const user = await User.findOne({ email }).lean();
    return await bcrypt.compare(password, user.password);
  }
}

const userServiceInstance = new UserService();
module.exports.userService = userServiceInstance;
