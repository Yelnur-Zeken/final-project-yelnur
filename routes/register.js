const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.get("/", (req, res) => {
  res.render("register"); 
});

router.post("/", async (req, res) => {
  const { username, password, firstName, lastName, age, gender } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).send("Username already exists!");

    // Hash password and save user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      password: hashedPassword,
      firstName,
      lastName,
      age,
      gender,
    });

    await newUser.save();

    
    res.redirect("/login");
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error.");
  }
});

module.exports = router;
