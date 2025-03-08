import { pool } from "../config/database.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendVerificationEmail } from "../utils/helpers.js";

class UserAuthController {
  async login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        type: "error",
        message: "Please provide email and password"
      });
    }

    const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email
    ]);

    if (users.length === 0) {
      return res.status(400).json({
        type: "error",
        message: "User not found. Please Register."
      });
    }

    const user = users[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ type: "error", message: "Invalid Email or Password" });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name , role : user.role},
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      type: "success",
      message: "Login Successful",
      accessToken: token
    });
  }

  async register(req, res) {
    const { name, email, phone, password } = req.body;

    const [existingUsers] = await pool.query(
      "SELECT * FROM users WHERE email = ? OR phone = ?",
      [email, phone]
    );

    if (existingUsers.length > 0) {
      return res
        .status(400)
        .json({ type: "info", message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const [result] = await pool.query(
      "INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)",
      [name, email, phone, hashedPassword]
    );

    const mailSuccess = await sendVerificationEmail(
      result.insertId,
      name,
      email
    );

    if (!mailSuccess) {
      return res.status(500).json({
        type: "error",
        message: "Error sending verification email"
      });
    }

    res.status(201).json({
      type: "success",
      message: "User registered successfully. Please verify your email.",
      data: {
        id: result.insertId,
        name,
        email,
        phone
      }
    });
  }

  async verifyEmail(req, res) {
    const { token } = req.body;

    try {
      // Verify JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;

      // Update user as verified
      await pool.query("UPDATE users SET verified = 1 WHERE id = ?", [userId]);

      res.status(200).json({
        message: "Email verified successfully! You can now log in."
      });
    } catch (error) {
      res.status(400).json({ message: "Invalid or expired token." });
    }
  }
}

const userAuthController = new UserAuthController();

export default userAuthController;
