import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import Razorpay from "razorpay";
import dayjs from "dayjs";
import multer from "multer";
import path from "path";

export const sendVerificationEmail = async (userId, name, email) => {
  try {
    // Generate Verification Token
    const token = jwt.sign({ id: userId, email }, process.env.JWT_SECRET, {
      expiresIn: "1h"
    });

    // Verification Link
    const verificationLink = `${
      process.env.FRONTEND_URL
    }/api/verify-email?token=${encodeURIComponent(token)}`;

    // Email Content
    const mailOptions = {
      from: process.env.MAILER_USER,
      to: email,
      subject: "Welcome to Restobay - Verify Your Email",
      html: `
        <p>Hello ${name},</p>
        <p>Please click the link below to verify your email:</p>
        <a href="${verificationLink}">Verify Email</a>
        <p>This link will expire in 1 hour.</p>
      `
    };

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.MAILER_USER,
        pass: process.env.MAILER_PASSKEY
      }
    });

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Error sending verification email:", error);
    return false;
  }
};

export const razorpayHelper = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

export const getTablePrice = (bookingDate, startTime, endTime) => {
  const start = dayjs(`${bookingDate}T${startTime}`);
  const end = dayjs(`${bookingDate}T${endTime}`);

  if (!start.isValid() || !end.isValid()) return 0;

  const durationInHours = end.diff(start, "hour", true);
  const roundedHours = Math.ceil(durationInHours);

  return Math.max(roundedHours, 1) * 100;
};

// multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Make sure this directory exists
  },
  filename: (req, file, cb) => {
    cb(null, "image-" + file.originalname);
  }
});

// File filter to only allow images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Not an image! Please upload only images."), false);
  }
};

// Set up multer upload
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});
