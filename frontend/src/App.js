import React from "react";
import SignUp from "./SignUp";
import Login from "./Login";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router";
import Home from "./Home";
import Reset from "./Reset";
import Cart from "./Cart";
import Products from "./Products";
import Sell from "./Sell";
import ProductPage from "./ProductPage";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import ProfilePage from "./ProfilePage";

const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User is logged in:", user.uid);
  } else {
    console.log("No user is logged in.");
  }
});

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/reset" element={<Reset />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/products/:category" element={<Products />} />
          <Route path="/products/:category/:id" element={<ProductPage />} />
          <Route path="/home/sell" element={<Sell />} />
          <Route path="/home/ProfilePage" element={<ProfilePage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};
export default App;
