const bcrypt = require("bcrypt");
const User = require("../model/userModel");
const Account = require("../model/accountModel");
const jwt = require("jsonwebtoken");
require('dotenv').config()

const Sign_Up = async (req, res) => {
  try {
    const { userName, firstName, lastName, password } = req.body;
    console.log("object: " + userName, firstName, lastName, password);

    if (!userName || !firstName || !lastName || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const existingUser = await User.findOne({ userName });
    console.log("existingUser: " + existingUser);

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashPassword = bcrypt.hashSync(password, 10);

    const newUser = new User({ userName, firstName, lastName, password: hashPassword });
    await newUser.save();

    const newAccount = new Account({ userId: newUser._id, balance: Math.floor(Math.random()* 10000) });
    await newAccount.save();



    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: "24h" });
    console.log("Generated JWT token:", token);
    req.user = token;
    console.log("Provided some toke to Req.User :",req.user);

    res.status(201).json({ message: "User registered successfully",token:token });
  } catch (error) {
    console.error("Error in Sign_Up:", error);
    res.status(500).json({ error: error.message });
  }
};

const signIn = async(req, res) => {
    try {
      const { userName, password } = req.body;
      if (!userName ||!password) {
        return res.status(400).json({ message: "All fields are required" });
      }
      const user = await User.findOne({ userName });
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      const isMatch = bcrypt.compareSync(password, user.password);

      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      const { password: _, ...other } = user._doc;
      const token = jwt.sign({ userId: other._id }, process.env.JWT_SECRET, { expiresIn: "24h" });
      req.user = token;
      console.log("Provided some toke to Req.User :",req.user);
    console.log("Generated JWT token:", token);
      res.status(200).json({ message: "Login successful", user: other,token,success:true});
    } catch (error) {
      console.error("Error in login:", error);
      res.status(500).json({ error: error.message });
    }
  };

module.exports = { Sign_Up, signIn };


