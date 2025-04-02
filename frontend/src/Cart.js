import React, { useEffect, useState } from "react";
import { auth, db } from "./FirebaseConfig";
import { getDocs, collection, doc, deleteDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  // Fetch Cart Items
  useEffect(() => {
    const fetchCart = async () => {
      const user = auth.currentUser;
      if (!user) {
        toast.error("Please login to view your cart.");
        return;
      }

      try {
        const cartRef = collection(db, "users", user.uid, "cart");
        const cartSnapshot = await getDocs(cartRef);

        if (!cartSnapshot.empty) {
          const items = cartSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setCartItems(items);
        } else {
          setCartItems([]);
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };

    fetchCart();
  }, []);

  // Remove Item from Cart
  const removeFromCart = async (itemId) => {
    const user = auth.currentUser;
    if (!user) {
      toast.error("Please login to remove items.");
      return;
    }

    try {
      const itemRef = doc(db, "users", user.uid, "cart", itemId);
      await deleteDoc(itemRef);
      setCartItems((prevItems) =>
        prevItems.filter((item) => item.id !== itemId)
      );
      toast.success("Item removed from cart!");
    } catch (error) {
      console.error("Error removing item:", error);
      toast.success("Failed to remove item.");
    }
  };

  // Navigate to Product Page
  const goToProductPage = (category, productId) => {
    navigate(`/products/${category}/${productId}`);
  };

  return (
    <>
      <nav className="navbar">
        <Link className="logo" to="/home">
          CAMPUS <span>CARTEL</span>
        </Link>
      </nav>
      <ToastContainer position="top-center" autoClose={3000} />
      <div>
        <h1>Your Cart</h1>
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              {/* Clickable Card to Navigate to Product Page */}
              <div
                className="cart-card"
                onClick={() => goToProductPage(item.category, item.id)}
              >
                <img src={item.image} alt={item.title} />
                <h3>{item.title}</h3>
                <p>₹{item.price}</p>
              </div>
              {/* Remove Button */}
              <button
                className="remove-btn"
                onClick={() => removeFromCart(item.id)}
              >
                Remove
              </button>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default CartPage;
