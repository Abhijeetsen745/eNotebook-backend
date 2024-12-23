import express from "express";
import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";
import fetchUser from "../Middleware/fetchuser.js";

const router = express.Router();

//signup
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    //validation
    if (!name || !email || !password)
      return res.status(400).json({ error: "All field are required" });

    if (!email.includes("@"))
      return res.status(400).json({ error: "Please enter valid email" });

    const user = await User.findOne({ email });

    if (user) {
      res.status(400).json({ error: "User already exists" });
    }

    //hashing and salting of password using bcryptjs
    const salt = await bcrypt.genSalt(10);

    //hashing
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    console.log(newUser);
    res.status(201).json({ success: "Signup Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

//login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    //* Validation
    if (!email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }
    //* Email Validation
    if (!email.includes("@")) {
      return res.status(400).json({ error: "Please enter a valid email" });
    }
    //* Find Unique User with email
    const user = await User.findOne({ email });
    console.log(user);

    //* if user not exists with that email
    if (!user) {
      res.status(400).json({ error: "User Not Found" });
    }

    //* matching user password to hash password with bcrypt.compare()
    const doMatch = await bcrypt.compare(password, user.password);

    //* if match password then generate token
    if (doMatch) {
      const token = jwt.sign({ userId: user.id },"" + process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      res.status(201).json({ token });
    } else {
      res.status(404).json({ error: "Email And Password Not Found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error");
  }
});

//getUser
router.get('/getuser',fetchUser,async (req,res) => {
    try {
        const userId = req.userId
        console.log("getuser Id", userId)
        const user = await User.findById(userId).select('-password')
        res.send(user)
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal server error")
    }
})

export default router;
