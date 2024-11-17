const express = require("express");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const speakeasy = require("speakeasy");
const QRCode = require("qrcode");
const User = require("../models/User");

const router = express.Router();

router.post("/register", async (req, res) => {
  const { username, password, firstName, lastName, age, gender } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).send("Username already exists!");

    const hashedPassword = await bcrypt.hash(password, 10);
    const tempSecret = speakeasy.generateSecret();
    const qrCode = await QRCode.toDataURL(tempSecret.otpauth_url);

    const newUser = new User({
      username,
      password: hashedPassword,
      firstName,
      lastName,
      age,
      gender,
      twoFactorAuth: { tempSecret: tempSecret.base32 },
    });

    await newUser.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "xxxonee@gmail.com",
        pass: "qwem dcye capf dotp",
      },
    });

    const mailOptions = {
      from: "xxxonee@gmail.com",
      to: username,
      subject: "Welcome to Our Service!",
      text: `Hi ${firstName},\n\nWelcome to our platform! Set up 2FA with the QR Code:\n\n${qrCode}`,
      html: `<p>Hi ${firstName},</p><p>Welcome to our platform! Set up 2FA by scanning this QR Code:</p><img src="${qrCode}" />`,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).send("Registration successful! Check your email for 2FA setup.");
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error.");
  }
});

router.post("/login", async (req, res) => {
  const { username, password, twoFactorCode } = req.body;

  try {
      const user = await User.findOne({ username });
      if (!user) return res.status(400).json({ message: "Invalid credentials!" });

      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) {
        user.failedLoginAttempts += 1;
        user.lastFailedLogin = new Date();

        if (user.failedLoginAttempts >= 3) {
          const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: "xxxonee@gmail.com",
              pass: "qwem dcye capf dotp",
            },
          });

          const mailOptions = {
            from: "xxxonee@gmail.com",
            to: username,
            subject: "Failed Login Attempts",
            text: `User ${username} has failed to log in 3 times!`,
          };

          await transporter.sendMail(mailOptions);
        }

        await user.save();
        return res.status(400).json({ message: "Invalid credentials!" });
      }

      if (user.twoFactorAuth && user.twoFactorAuth.tempSecret) {
          const secret = user.twoFactorAuth.tempSecret;
          const is2FACodeValid = speakeasy.totp.verify({
              secret,
              encoding: "base32",
              token: twoFactorCode,
          });

          if (!is2FACodeValid) return res.status(400).json({ message: "Invalid 2FA code!" });
      }

      req.session.user = {
          id: user._id,
          role: user.role,
      };

      res.status(200).json({
          message: "Login successful!",
          role: user.role,
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;
