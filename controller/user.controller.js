const bcrypt = require("bcrypt");
const User = require("../model/userModel");
const Account = require("../model/accountModel");
const jwt = require("jsonwebtoken");
const cloudinary = require("../Utils/cloudnarry");

require('dotenv').config()

const Sign_Up = async (req, res) => {
  try {
    const { userName, firstName, lastName, password } = req.body;
    // console.log("object: " + userName, firstName, lastName, password);

    if (!userName || !firstName || !lastName || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const existingUser = await User.findOne({ userName });
    // console.log("existingUser: " + existingUser);

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashPassword = bcrypt.hashSync(password, 10);

    const newUser = new User({ userName, firstName, lastName, password: hashPassword });
    await newUser.save();

    const newAccount = new Account({ userId: newUser._id, balance: Math.floor(Math.random()* 10000) });
    await newAccount.save();



    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: "24h" });

    res
    .cookie("token", token, { httpOnly: true, expiresIn: "24h" })
    .status(201)
    .json({ message: "User registered successfully",token:token })
  } catch (error) {
    console.error("Error in Sign_Up:", error);
    res.status(500).json({ error: error.message });
  }
};

const signIn = async (req, res) => {
  try {
    const { userName, password } = req.body;

    if (!userName || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ userName });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const { password: _, ...other } = user._doc;
    const token = jwt.sign({ userId: other._id }, process.env.JWT_SECRET, { expiresIn: "24h" });

    res
      .cookie("token", token, { httpOnly: true, expiresIn: "24h" })
      .status(200)
      .json({ message: "Login successful", user: other,token, success: true });
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getUserData = async(req, res) =>{
  const id = req.params.id
  try{
    const user = await User.findById({_id: id},"-password");
    if(!user){
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  }catch(error){
    console.error("Error in getUserData:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
const updateUserProfile = async (req, res) => {
  try {
    const { id, ...updateFields } = req.body; 
    console.log("Updating user profile",req.body);

    // If a profile picture is provided, upload it to Cloudinary
    if (updateFields.profilePicture) {
      const result = await cloudinary.uploader.upload(updateFields.profilePicture, { folder: "users" });
      updateFields.profilePicture = result.secure_url;
    }

    // FIX: Pass `updateFields` directly
    const updatedUser = await User.findByIdAndUpdate(id, updateFields, { new: true }).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user: updatedUser });
  } catch (error) {
    console.error("Error in updateUserProfile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


const signOut = async (req, res) => {
  res.clearCookie("token", { httpOnly: true, secure: true, sameSite: "None" })
     .status(200)
     .json({ message: "Logged out successfully" });
};



module.exports = { Sign_Up, signIn, getUserData, updateUserProfile, signOut};


