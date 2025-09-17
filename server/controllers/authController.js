import bcrypt from "bcryptjs";
import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";


// generate jwt token 
const generateToken = (userid) => {
  return jwt.sign({ id:userid }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
}

// register user
const registerUser=async (req, res) => {
    const { name, email, password,profileImageUrl,adminInviteToken } = req.body;
    try {
        // check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
        }
// determine user role :admin if correct token is provided else user
        let role = "member";
        if (adminInviteToken && adminInviteToken === process.env.ADMIN_INVITE_TOKEN) {
            role = "admin";
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        // create user
        const user = await User.create({
        name,
        email,
        password: hashedPassword,
        profileImageUrl,
        role,
        });

        // return user data with jwt
        res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        profileImageUrl: user.profileImageUrl,
        role: user.role,
        token: generateToken(user._id),
        })
        
    } catch (error) {
        res.status(500).json({ message:"Server error",error: error.message });
    }
    }

// login user
const loginUser=async (req, res) => {
  try {
    const { email, password } = req.body;
    // check if user exists 
    const user=await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    // check if password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    // return user data with jwt
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profileImageUrl: user.profileImageUrl,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message:"Server error",error: error.message });
    
  }
}

// get user profile
const getUserProfile=async (req, res) => {
  try {
    const user=await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message:"Server error",error: error.message });
  }
}
// update user profile
const updateUserProfile=async (req, res) => {
  try {
  
    const user=await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.name=req.body.name || user.name;
    user.email=req.body.email || user.email;
    user.profileImageUrl=req.body.profileImageUrl || user.profileImageUrl;
    // check if password is provided and hash it
    if (req.body.password) {
      user.password=await bcrypt.hash(req.body.password, 10);
    }
    const updatedUser=await user.save();
    // save user  
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      profileImageUrl: updatedUser.profileImageUrl,
      role: updatedUser.role,
      token:generateToken(updatedUser._id),
    });
  } catch (error) {
    res.status(500).json({ message:"Server error",error: error.message });
  }
}

export { registerUser, loginUser, getUserProfile, updateUserProfile };