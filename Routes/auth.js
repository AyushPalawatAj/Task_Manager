const jwt = require("jsonwebtoken");
// const config = require("../config"); // Assuming your secret key is stored in config.js

const authenticateToken = (req, res, next) => {
  // Extract token from Authorization header
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Remove "Bearer " prefix

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: Missing access token" });
  }

  // Verify token using secret key
  jwt.verify(token, "tomAYU" , (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Forbidden: Invalid or expired token" });
    }

    // Attach user data to request object
    req.user = user;

    next(); // Proceed to next middleware
  });
};

module.exports = { authenticateToken };
