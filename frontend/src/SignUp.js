import React, { useState } from "react";
import { Link, useNavigate } from "react-router"; // Import useNavigate for redirection
import { auth, db } from "./FirebaseConfig"; // Import Firebase
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc, setDoc, doc } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify"; // Import Toastify
import logo from "./logo.webp";
const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    rollNumber: "",
    year: "",
    email: "",
    password: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.username) newErrors.username = "Username is required";
    if (!formData.rollNumber) newErrors.rollNumber = "Roll number is required";
    if (!formData.year) newErrors.year = "Year is required";
    if (!formData.email.includes("@")) newErrors.email = "Invalid email";
    if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    if (!formData.phone.match(/^\d{10}$/))
      newErrors.phone = "Invalid phone number";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProgress(30);
    if (!validateForm()) return;

    try {
      // Create User in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      // Store User Data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        username: formData.username,
        rollNumber: formData.rollNumber,
        year: formData.year,
        email: formData.email,
        phone: formData.phone,
        uid: user.uid,
      });
      setProgress(70);
      toast.success("Signup successful! Redirecting...", { autoClose: 3000 });
      setTimeout(() => {
        setProgress(100); // Complete progress
        navigate("/home");
      }, 1000);
    } catch (error) {
      setProgress(0); // Reset progress on error
      toast.error(error.message);
    }
  };

  return (
    <>
      <h1 className="h">
        CAMPUS <span>CARTEL</span>
      </h1>
      <div className="signup-container">
        {/* Toast Notification */}
        <ToastContainer />

        {/* Left Section - Image */}
        <div className="signup-image">
          <img src={logo} alt="Signup" />
        </div>

        {/* Right Section - Form */}
        <div className="signup-form">
          <h2>Create an Account</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="username"
              placeholder="Username"
              onChange={handleChange}
            />
            {errors.username && <p className="error">{errors.username}</p>}

            <input
              type="text"
              name="rollNumber"
              placeholder="Roll Number"
              onChange={handleChange}
            />
            {errors.rollNumber && <p className="error">{errors.rollNumber}</p>}

            <input
              type="text"
              name="year"
              placeholder="Year"
              onChange={handleChange}
            />
            {errors.year && <p className="error">{errors.year}</p>}

            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
            />
            {errors.email && <p className="error">{errors.email}</p>}

            <input
              type="password"
              name="password"
              placeholder="Password (min 8 characters)"
              onChange={handleChange}
            />
            {errors.password && <p className="error">{errors.password}</p>}

            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              onChange={handleChange}
            />
            {errors.phone && <p className="error">{errors.phone}</p>}

            <button type="submit">Sign Up</button>

            <p className="login-link">
              Already have an account? <Link to="/login">Log in</Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Signup;
