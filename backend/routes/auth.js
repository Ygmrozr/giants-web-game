import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashed = await bcrypt.hash(password, 12);

    const newUser = new User({
      username,
      email,
      passwordHash: hashed,
    });

    const saved = await newUser.save();
    res.status(201).json({ message: "Kullanıcı oluşturuldu!", user: saved });
  } catch (err) {
    res.status(500).json({ error: "Kayıt başarısız!", details: err });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "Kullanıcı bulunamadı!" });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(400).json({ error: "Şifre yanlış!" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ message: "Giriş başarılı!", token, user });
  } catch (err) {
    res.status(500).json({ error: "Giriş başarısız!" });
  }
});

export default router;