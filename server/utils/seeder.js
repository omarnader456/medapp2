const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

mongoose.connect(process.env.MONGO_URI);

const usersToSeed = [
  {
    name: 'Omar Nader',
    email: 'omansour101@outlook.com',
    password: 'AdminAccount123@',
    role: 'admin',
    twoFactorEnabled: true,
  },
  {
    name: 'Dr.Smith',
    email: 'onmarsour@gmail.com',
    password: 'StrongPassword1@',
    role: 'doctor',
    twoFactorEnabled: true,
  },
  {
    name: 'Pat Jones',
    email: 'om2201668@tkh.edu.eg',
    password: 'WeakPassword1@',
    role: 'patient',
    twoFactorEnabled: true,
  },
  {
    name: 'Nurse Joy',
    email: 'maissaabuelella@yahoo.com',
    password: 'MediumPassword1@',
    role: 'nurse',
    twoFactorEnabled: true,
  },
];


const importData = async () => {
  try {
    const processedUsers = await Promise.all(
      usersToSeed.map(async (user) => {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        return user;
      })
    );

    await User.create(processedUsers);
    console.log('Data Imported...');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

const deleteData = async () => {
  try {
    await User.deleteMany();
    console.log('Data Destroyed...');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}