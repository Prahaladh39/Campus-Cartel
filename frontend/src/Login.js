import React, { useState } from "react";
import { auth, db } from "./FirebaseConfig"; // Firebase connection
import { signInWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setProgress(30);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      setProgress(70);
      const user = userCredential.user;

      // Store login details in Firestore under "login" collection
      await addDoc(collection(db, "login"), {
        email: user.email,
        userId: user.uid,
        timestamp: serverTimestamp(),
      });

      toast.success("Login successful!", {
        position: "top-right",
        autoClose: 3000,
      });
      setTimeout(() => {
        setProgress(100); // Complete progress
        navigate("/home"); // Redirect after slight delay
      }, 1000);
    } catch (error) {
      setProgress(0); // Reset progress on error
      toast.error("Invalid credentials. Try again.");
    }
  };

  return (
    <div className="login-container">
      <ToastContainer />
      <div className="login-caption">
        <h1>Welcome to Campus Cartel</h1>
        <p>Buy, Sell & Connect with Students Easily</p>
      </div>
      <div className="login-form">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
          <Link to="/reset">Forget Password</Link>
        </form>
      </div>
    </div>
  );
};
export default Login;
