const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const User = require("../models/User");

router.get("/", (req, res) => {
  res.render("login"); // Make sure you have a login.ejs
});

router.post("/", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).send("Invalid credentials!");

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) return res.status(400).send("Invalid credentials!");

    // Set user in session after successful login
    req.session.user = user;
    res.redirect("/home"); // Redirect to home page after successful login
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error.");
  }
});

module.exports = router;
