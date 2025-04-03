import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { db } from "./FirebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Products = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const q = query(
          collection(db, "Seller"),
          where("category", "==", category.trim().toLowerCase())
        );
        const querySnapshot = await getDocs(q);
        const items = querySnapshot.docs.map((doc) => ({
          id: doc.data().id, 
          ...doc.data(),
        }));

        if (items.length === 0) {
          toast.warn("No products found in this category.");
        }
        setProducts(items);
      } catch (error) {
        toast.error("Error fetching products: " + error.message);
      }
      setLoading(false);
    };

    fetchProducts();
  }, [category]);

  return (
    <>
      <nav className="navbar">
        <Link className="logo" to="/home">
          CAMPUS <span>CARTEL</span>
        </Link>
      </nav>
      <div className="preview-container">
        <h2>Products in {category}</h2>
        {loading ? (
          <p>Loading...</p>
        ) : products.length === 0 ? (
          <p>No products found in this category.</p>
        ) : (
          <div className="grid-container">
            {products.slice(0, 15).map((product) => (
              <Link
                to={`/products/${category}/${product.id}`}
                key={product.id}
                className="product-card"
              >
                <div className="image-container">
                  {product.isHot && <span className="hot-badge">HOT</span>}
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="product-image"
                    />
                  ) : (
                    <div className="placeholder"></div>
                  )}
                </div>
                <div className="product-info">
                  <h3 className="product-title">{product.title}</h3>
                  <p className="product-description">
                    {product.description.length > 60
                      ? `${product.description.substring(0, 60)}...`
                      : product.description}
                  </p>
                  <p className="product-price">₹{product.price}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
        <ToastContainer position="top-center" autoClose={2000} />
      </div>
    </>
  );
};

export default Products;
