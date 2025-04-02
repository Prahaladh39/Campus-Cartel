require("dotenv").config();
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const admin = require("firebase-admin");
const app = express();
const crypto = require("crypto");
const { Cashfree } = require("cashfree-pg");
const axios = require("axios");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Initialize Firebase Admin SDK (Make sure to use your Firebase service account key)
const serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
// Store OTPs temporarily
const otpStore = new Map();

// Nodemailer setup (Use your Gmail or SMTP)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS, // Your app password (not the actual Gmail password)
  },
});

// Generate and send OTP
app.post("/send-otp", async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore.set(email, otp); // Store OTP in memory for verification

  // Send OTP email
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Campus Cartel: Password Reset OTP",
    text: `Your OTP for password reset is: ${otp}. It expires in 5 minutes.`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) return res.status(500).json({ error: "Failed to send OTP" });
    res.json({ message: "OTP sent successfully" });
  });
});

// Verify OTP and update password
app.post("/reset-password", async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const storedOtp = otpStore.get(email);

  if (!storedOtp || storedOtp !== otp) {
    return res.status(400).json({ error: "Invalid or expired OTP" });
  }

  try {
    // Get Firebase user by email
    const userRecord = await admin.auth().getUserByEmail(email);

    // Update password in Firebase Authentication
    await admin.auth().updateUser(userRecord.uid, { password: newPassword });

    otpStore.delete(email); // Remove OTP after use
    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to reset password" });
  }
});
Cashfree.XClientId = process.env.CLIENT_ID;
Cashfree.XClientSecret = process.env.CLIENT_SECRET;
Cashfree.XEnvironment = "SANDBOX";
function generateOrderId() {
  const uniqueId = crypto.randomBytes(16).toString("hex");
  const hash = crypto.createHash("sha256").update(uniqueId).digest("hex");
  return hash.substr(0, 12);
}
app.post("/create-order", async (req, res) => {
  try {
    const { order_id, order_amount, order_currency, customer_details } =
      req.body;

    const response = await axios.post(
      "https://sandbox.cashfree.com/pg/orders",
      {
        order_id,
        order_amount,
        order_currency,
        customer_details,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-client-id": process.env.CASHFREE_APP_ID, // ✅ Check if correct
          "x-client-secret": process.env.CASHFREE_SECRET_KEY, // ✅ Check if correct
          "x-api-version": "2023-08-01",
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error(
      "Cashfree Payment Error:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to create order" });
  }
});

app.post("/verify", async (req, res) => {
  try {
    const { orderId } = req.body;

    const response = await Cashfree.PGOrderFetchPayments("2023-08-01", orderId);
    res.json(response.data);
  } catch (error) {
    console.error("Verification Error:", error.response?.data || error);
    res.status(500).json({ error: "Failed to verify payment" });
  }
});
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
