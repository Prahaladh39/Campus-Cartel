import React, { useState } from "react";
import { auth } from "./FirebaseConfig"; // Import Firebase config
import { sendPasswordResetEmail, confirmPasswordReset } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(""); // OTP for verification
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetLinkSent, setResetLinkSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  // Simulating an OTP (In real app, use Firebase functions to send OTP via email)
  const generatedOtp = "123456";

  const handleResetRequest = async () => {
    if (!email) {
      toast.error("Please enter your email!");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setResetLinkSent(true);
      toast.success("OTP sent to your email!");
    } catch (error) {
      toast.error("Error sending OTP. Check email.");
    }
  };

  const handleVerifyOtp = () => {
    if (otp === generatedOtp) {
      setOtpVerified(true);
      toast.success("OTP verified! Enter new password.");
    } else {
      toast.error("Invalid OTP. Try again.");
    }
  };

  const handlePasswordReset = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long!");
      return;
    }
    try {
      await confirmPasswordReset(auth, otp, newPassword);
      toast.success("Password changed successfully!");
    } catch (error) {
      toast.error("Error updating password.");
    }
  };

  return (
    <div className="reset-container">
      <ToastContainer />
      <div className="reset-form">
        <h2>Reset Password</h2>
        {!resetLinkSent ? (
          <>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button onClick={handleResetRequest}>Send OTP</button>
          </>
        ) : !otpVerified ? (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <button onClick={handleVerifyOtp}>Verify OTP</button>
          </>
        ) : (
          <>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button onClick={handlePasswordReset}>Reset Password</button>
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
