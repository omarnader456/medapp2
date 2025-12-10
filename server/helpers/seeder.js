const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const bcrypt = require('bcryptjs');
// FIX: Update import to use the new schema name
const User = require('../schemas/person');

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
    // Loop through users and create them one by one
    for (let i = 0; i < usersToSeed.length; i++) {
        let userData = usersToSeed[i];
        
        // Hash password
        const salt = await bcrypt.genSalt(10);
        userData.password = await bcrypt.hash(userData.password, salt);
        
        // Create user
        await User.create(userData);
        console.log(`Created user: ${userData.name}`);
    }

    console.log('Data Imported Successfully...');
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