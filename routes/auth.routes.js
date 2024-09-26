//packages
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

//Local imports
const UserModel = require("../model/User.model");
const SLAT_ROUNDS = Number(process.env.SLAT_ROUNDS);

//Parent Router
let authRouter = router;

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
    if (user) return res.json({ message: "User already exists" });
    //registering the new user
    let newUser = await UserModel.create({
      userName,
      email,
      password: await hashPassword(password),
      gender,
    })
    //saving the new user
    await newUser.save();
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
    if (!user) return res.json({ message: "User not found" });
    //checking if the password is correct
    let isMatch = await bcrypt.compare(password, user.password);
    //checking if the password is correct
    if (!isMatch) return res.json({ message: "Invalid credentials" });
    //sending the response;
    res.json({ message: "Login successful"});
  } catch (error) {
    res.json({ message: error.message });
  }
});


//exporting the parent routes
module.exports = authRouter;
