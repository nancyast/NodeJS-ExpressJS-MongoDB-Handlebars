const verifyPassword = (password, confirmedPassword) => {
  return password === confirmedPassword
    ? null
    : 'Password and confirm password does not match';
};

const nomalizeUsers = (users) => {
  return users.map((user) => nomalizeUser(user));
};

const nomalizeUser = (user) => {
  const { _id, password, ...properties } = user;
  return {
    id: _id,
    ...properties,
  };
};

module.exports = {
  nomalizeUser,
  nomalizeUsers,
  verifyPassword,
};
