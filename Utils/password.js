// const bcrypt = require('bcryptjs');

// // Generate a random password
// const generatePassword = () => {
//   return Math.random().toString(36).slice(-8); // Simple random string generator
// };

// // Hash a password
// const hashPassword = async (password) => {
//   const salt = await bcrypt.genSalt(10);
//   return bcrypt.hash(password, salt);
// };

// // Compare a password
// const comparePassword = async (password, hashedPassword) => {
//   return bcrypt.compare(password, hashedPassword);
// };

// module.exports = {
//   generatePassword,
//   hashPassword,
//   comparePassword
// };

const bcrypt = require('bcryptjs');

// Generate a random 6-digit password containing only numbers
const generatePassword = () => {
  return Math.floor(100000 + Math.random() * 900000); // Generates a random 6-digit number
};

// Hash a password
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// Compare a password
const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

module.exports = {
  generatePassword,
  hashPassword,
  comparePassword
};
