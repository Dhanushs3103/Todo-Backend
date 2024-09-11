//packages
let express = require("express");
let jwt = require("jsonwebtoken");

//local imports
let JWT_SECRET = process.env.JWT_SECRET;
let BlacklistedTokenModel = require("../model/BlacklistedToken.model");

//Authentication middleware
async function authMiddleware(req, res, next) {
  try {
    // Checking if the authorization header is present
    let authHeader = req.headers["authorization"];

    if (!authHeader) {
      return res
        .status(401)
        .json({ message: "Authorization header not found" });
    }

    let token = authHeader.split(" ")[1]; // Split the Bearer token

    // Checking if the token is available
    if (!token) {
      return res.status(401).json({ message: "Token not found" });
    }

    // Checking if the token is blacklisted
    let blacklistedToken = await BlacklistedTokenModel.findOne({ token });
    if (blacklistedToken) {
      return res
        .status(401)
        .json({ message: "User not authenticated, please login" });
    }

    // Verifying the token
    let decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded) {
      return res
        .status(401)
        .json({ message: "User not authenticated, please login" });
    }

    // Storing user ID in the request object for later use
    req.body.user_id = decoded.user_id;
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
}

module.exports = authMiddleware;
