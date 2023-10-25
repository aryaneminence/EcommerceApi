const User = require('../Model/UserSchema');
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cloudinary = require('cloudinary').v2;
const authorizationToken=require('../Middleware/auth')
const {SECRETKEY} = require('../config');
const {getAllUsersAggregation}=require('../aggregations/user')
const uploadMiddleware = require('../Middleware/multer');

const updateProfile = async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
    const { cloudinary } = req;
      const result = await cloudinary.uploader.upload(req.file.buffer, {
        folder: 'Uploads',
      });
  
      res.json({
        public_id: result.public_id,
        secure_url: result.secure_url,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  

const getAllUsers = async (req, res) => {
    try {
        const agreegationPipeline = getAllUsersAggregation();
        const users = await User.aggregate(agreegationPipeline);
        res.json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

const deleteUser= async (req, res) => {
    try {
        const userId = req.user.userId;
        await User.findByIdAndDelete(userId);
        res.status(201).json({ message: "user Deleted Successfully" });
    } catch (error) {
        console.log('error in delete api', error);
        res.status(500).json({ message: "error in delete api" });
    }
};

const updateUser=async (req, res) => {
    const { userId, username, password } = req.body;
    console.log(userId,username)
    const existinguser = await User.findOne({ _id: userId });
    console.log('Existing User:', existinguser); 
    try {
        if (!existinguser) {
            res.status(404).json({ message: "User not found" });
        }

        if (username) {
            existinguser.username = username;
        }
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            existinguser.password = hashedPassword;
        }
        await existinguser.save();
        res.json({ message: "data updated successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "error" });
    }
};


const loginUser= async (req, res) => {
    const { username, password } = req.body;

    try {
        const existingUser = await User.findOne({ username });
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, existingUser.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }

        const token = jwt.sign({ userId: existingUser._id, username: existingUser.username }, SECRETKEY);

        res.json({ token: "login successful" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const signupUser=async (req, res) => {
    try {
        const { username, password } = req.body;
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ message: "Username already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            password: hashedPassword
        });

        await newUser.save();

        const token = jwt.sign({ userId: newUser._id, username: newUser.username }, SECRETKEY);
        res.status(201).json({ message: "Signup successful", token });

    } catch (error) {
        console.log(error, "error in signup api");
        res.status(500).json({ message: error.message || "Internal Server Error" });
    }
};

module.exports = {
  deleteUser,
  signupUser,
  loginUser,
  updateUser,
  getAllUsers,
  updateProfile
}
