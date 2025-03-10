const jwt = require("jsonwebtoken");
require('dotenv').config();

const verifyToken = (token, secretKey) => {
  return jwt.verify(token, secretKey);
};

const authenticate = (req, res, next) => {
  console.log(req.headers, "Request Headers");
  const authHeader = req.headers.authorization;
  console.log(authHeader, "authHeader");

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "User is not authenticated",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = verifyToken(token, "JWT_SECRET");

    req.user = payload;

    next();
  } catch (e) {
    return res.status(401).json({
      success: false,
      message: "invalid token",
    });
  }
};

module.exports = authenticate;
