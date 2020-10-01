const fs = require('fs');
const mongoose = require('mongoose');
const User = require('../models/userModel');

mongoose
  .connect(
    'mongodb+srv://nhungast:H00ngNhung@cluster0-k13ut.mongodb.net/natours?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log('DB connect successfully!');
  });

const users = fs.readFileSync(`${__dirname}/user_simple.json`, 'utf-8');

const importData = async () => {
  try {
    await User.create(JSON.parse(users));
    console.log('Users were successfully created');
  } catch (error) {
    console.log(error);
  }
};

const deleteData = async () => {
  try {
    await User.deleteMany();
    console.log('Users were successfully deleted');
  } catch (error) {
    console.log(error);
  }
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
