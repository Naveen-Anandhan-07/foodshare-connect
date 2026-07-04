const jwt = require("jsonwebtoken");

// Creates a JWT token that stores the user's id and role (donor/receiver)
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

module.exports = generateToken;
