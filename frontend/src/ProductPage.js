import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  getDoc,
  doc,
} from "firebase/firestore";
import { db, auth } from "./FirebaseConfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { load } from "@cashfreepayments/cashfree-js";
function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState("");
  const addToCart = async (product) => {
    const user = auth.currentUser;

    if (!user) {
      toast.success("Please log in to add items to cart");
      return;
    }

    try {
      const cartRef = collection(db, "users", user.uid, "cart");
      const docRef = doc(cartRef, product.id.toString());
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        toast.success("Item already exists in the cart!");
      } else {
        await setDoc(docRef, {
          title: product.title || "Unknown Product",
          price: product.price || "0",
          image:
            product.images && product.images.length > 0
              ? product.images[0]
              : "https://via.placeholder.com/150", // Fallback image
          timestamp: new Date(),
        });
        toast.success("Added to Cart!");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.success("Failed to add to cart. Please try again.");
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const q = query(collection(db, "Seller"), where("id", "==", id));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          toast.error("No product found!");
        } else {
          const fetchedProduct = querySnapshot.docs[0].data();
          setProduct(fetchedProduct);
          setMainImage(fetchedProduct?.images[0]);
        }
      } catch (error) {
        toast.error("Error fetching product");
      }
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  if (loading) return <h2>Loading...</h2>;
  if (!product) return <h2>No product found.</h2>;

  const handleBuyNow = async () => {
    const user = auth.currentUser;
    if (!user) {
      toast.error("Please log in to proceed with the payment");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/create-order", {
        order_id: `ORDER_${Date.now()}`, // Unique order ID
        order_amount: product.price,
        order_currency: "INR",
        customer_details: {
          customer_id: user.uid,
          customer_email: user.email,
          customer_phone: product.seller.contact || "9999999999",
        },
      });

      if (response.data.payment_session_id) {
        const cashfree = await load({ mode: "sandbox" }); // Use "production" for live payments

        cashfree.checkout({
          paymentSessionId: response.data.payment_session_id,
          redirectTarget: "_modal",
        });
      } else {
        toast.error("Failed to initiate payment");
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <>
      <nav className="navbar">
        <Link className="logo" to="/home">
          CAMPUS <span>CARTEL</span>
        </Link>
      </nav>
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="product-wrapper1">
        <div className="image-section1">
          <img src={mainImage} alt={product.title} className="main-image1" />
          <div className="thumbnail-container1">
            {product.images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Thumbnail ${index + 1}`}
                className="thumbnail1"
                onClick={() => setMainImage(img)}
              />
            ))}
          </div>
        </div>

        <div className="details-section1">
          <h1 className="product-title1">{product.title}</h1>
          <p className="product-description1">{product.description}</p>
          <p className="product-price1">₹{product.price}</p>
          <div className="seller-info1">
            <p>
              <span className="seller-name1">
                Seller: {product.seller.name}
              </span>
            </p>
            <p>
              Contact:{" "}
              <span className="contact-info1">{product.seller.contact}</span>
            </p>
          </div>
          <div className="buttons1">
            <button className="buy-now1" onClick={handleBuyNow}>
              Buy Now
            </button>
            <button className="add-to-cart1" onClick={() => addToCart(product)}>
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductPage;
