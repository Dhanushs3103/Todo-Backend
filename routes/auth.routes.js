//packages
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//Local imports
const TodoModel = require("../model/Todo.model");
const UserModel = require("../model/User.model");
const BlacklistedTokenModel = require("../model/BlacklistedToken.model");
const JWT_SECRET = process.env.JWT_SECRET;
const SLAT_ROUNDS = Number(process.env.SLAT_ROUNDS);
const authMiddleware = require("../middlewares/auth.middleware.js")

//Parent Router
let authRouter = router;

//function for generating the jwt token
async function generateToken(user_id) {
  try {
    let token = jwt.sign({ user_id }, JWT_SECRET, { expiresIn: "1d" });
    return token;
  } catch (error) {
    console.log(error.message);
    return null;
  }
}

async function hashPassword(password) {
  try {
    let hashedPassword = await bcrypt.hash(password, SLAT_ROUNDS);
    return hashedPassword;
  } catch (error) {
    console.log(error.message);
    return null;
  }
}

//Endpoint for registration
authRouter.post("/register", async (req, res) => {
  let { userName, email, password, gender } = req.body;
  try {
    let user = await UserModel.findOne({ email, userName });
    //checking if the user already exists
    if (user) return res.status(400).json({ message: "User already exists" });
    //registering the new user
    let newUser = await UserModel.create({
      userName,
      email,
      password: await hashPassword(password),
      gender,
    })
    //saving the new user
    await newUser.save();
    let token = await generateToken(newUser._id);
    res.header({"Authorization": `Bearer ${token}`});
    res.status(201).json({ message: "User created successfully"});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Endpoint for login
authRouter.post("/login", async (req, res) => {
  let { email, password } = req.body;
  try {
    //checking if the user exists
    let user = await UserModel.findOne({ email });
    //checking if the user exists
    if (!user) return res.status(400).json({ message: "User not found" });
    //checking if the password is correct
    let isMatch = await bcrypt.compare(password, user.password);
    //checking if the password is correct
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });
    //Token generation
    let token = await generateToken(user._id);
    // Sending the Token and response
    res.header({"Authorization": `Bearer ${token}`});
    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Endpoint for logout
authRouter.post("/logout", [authMiddleware], async (req, res) => {
    try {
        let token = req.headers.authorization.split(" ")[1];
        //checking if the token is available
        if(!token) return res.status(401).json({ message: "Token not found" });
        //adding the token to the blacklist
        let blacklistedToken = await BlacklistedTokenModel.create({ token });
        //saving the token
        await blacklistedToken.save();
        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
         res.status(500).json({ message: error.message });
    }
})

//exporting the parent routes
module.exports = authRouter;
