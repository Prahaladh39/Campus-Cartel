import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { db } from "./FirebaseConfig";
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  where,
} from "firebase/firestore";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import hero from "./Images/hero.png";
import img1 from "./Images/stack-of-books.png";
import img2 from "./Images/gadgets.png";
import img3 from "./Images/brand.png";
import img4 from "./Images/sports.png";
import img5 from "./Images/lab-equipment.png";
import img6 from "./Images/tickets.png";
import img7 from "./Images/Clog.avif";
import instagram from "./Images/instagram.webp";
import facebook from "./Images/facebook.png";
import linkedin from "./Images/linkedin.jpeg";
const Home = () => {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  useEffect(() => {
    const fetchRecentlyAdded = async () => {
      try {
        const productsRef = collection(db, "Seller");
        const q = query(productsRef, orderBy("uploadDate", "desc"));
        const querySnapshot = await getDocs(q);
        const productList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productList.slice(0, 8)); // Limit to 8 products
      } catch (error) {
        console.error("Error fetching products:", error);
      }
      setLoading(false);
    };

    fetchRecentlyAdded();
  }, []);
  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim() === "") {
      setSearchResults([]);
      return;
    }

    try {
      const productsRef = collection(db, "Seller");
      const q = query(
        productsRef,
        where("title", ">=", value),
        where("title", "<=", value + "\uf8ff"),
        limit(10)
      );

      const querySnapshot = await getDocs(q);
      const results = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSearchResults(results);
    } catch (error) {
      console.error("Error searching products:", error);
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSearchResults([]);
  };

  const images = [
    {
      img: img1,
      title: "Books And Stationery",
      path: "books",
    },
    {
      img: img2,
      title: "Electronics And Gadgets",
      path: "electronics",
    },
    {
      img: img3,
      title: "Fashion",
      path: "fashion",
    },
    {
      img: img4,
      title: "Sports",
      path: "sports",
    },
    {
      img: img5,
      title: " Lab Supplies ",
      path: "lab",
    },
    {
      img: img6,
      title: "Miscellaneous",
      path: "miscellaneous",
    },
  ];
  return (
    <>
      <nav className="navbar">
        <div className="logo">
          CAMPUS <span>CARTEL</span>
        </div>

        <div className="search-container">
          <input
            type="text"
            placeholder="Search Products..."
            className="search-bar"
            value={searchTerm}
            onChange={handleSearch}
          />
          {searchResults.length > 0 && (
            <div className="search-dropdown">
              {searchResults.map((product) => (
                <Link
                  key={product.id}
                  to={`/products/${product.category}/${product.id}`}
                  className="search-item"
                  onClick={clearSearch}
                >
                  <img
                    src={product.images ? product.images[0] : img1}
                    alt={product.title}
                    className="search-item-img"
                  />
                  <p>{product.title}</p>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className={`nav-links ${isMobileOpen ? "open" : ""}`}>
          <Link
            to="ProfilePage"
            className="cart-btn"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
          >
            Profile
          </Link>
          {/*isProfileOpen && (
            <div className="dropdown dropdown-profile">
              <Link to="ProfilePage">👤 Profile</Link>
            </div>
          )*/}

          <Link className="cart-btn" to="/cart">
            🛒 Cart
          </Link>
          <Link className="sell-btn" to="sell">
            Sell a Product
          </Link>
        </div>

        <div
          className="mobile-menu"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
        >
          ☰
        </div>
      </nav>
      <section className="hero" id="ho">
        <div className="hero-content">
          <h1>Welcome To Campus Cartel</h1>
          <p>
            A seamless marketplace for students to buy, sell, and trade
            pre-owned items effortlessly. Connect, chat, and make smart deals on
            campus!
          </p>
          <a className="h-btn" href="#collec">
            Shop Now!
          </a>
        </div>
        <div className="hero-image">
          <img src={hero} alt="Campus Cartel" />
        </div>
      </section>
      <section className="collection">
        <div className="collection-header">
          <hr className="line" />
          <h2 id="collec">Our Collection</h2>
          <hr className="line" />
        </div>
        <div className="collection-grid">
          {images.map((x, index) => (
            <Link
              key={index}
              className="collection-item"
              to={`/products/${x.path}`}
            >
              <img src={x.img} alt={`Collection Item ${index + 1}`} />
              <p>{x.title}</p>
            </Link>
          ))}
        </div>
      </section>
      <section>
        <div className="collection-header">
          <hr className="line" />
          <h2>Recently Added</h2>
          <hr className="line" />
        </div>
        <div className="recently-added-container">
          {loading ? (
            <p>Loading...</p>
          ) : products.length === 0 ? (
            <p>No new products available.</p>
          ) : (
            <div className="recent-products-grid">
              {products.map((product) => (
                <Link
                  to={`/products/${product.category}/${product.id}`}
                  key={product.id}
                  className="recent-product-card"
                >
                  <div className="recent-image-container">
                    {product.isHot && <span className="hot-badge">HOT</span>}
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className="recent-product-image"
                      />
                    ) : (
                      <div className="placeholder"></div>
                    )}
                  </div>
                  <div className="recent-product-info">
                    <h3 className="recent-product-title">{product.title}</h3>
                    <p className="recent-product-description">
                      {product.description.length > 60
                        ? `${product.description.substring(0, 30)}...`
                        : product.description}
                    </p>
                    <p className="recent-product-price">₹{product.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
        <ToastContainer position="top-center" autoClose={2000} />
      </section>
      <div className="how-it-works">
        <h2>
          It’s easy as <span>1,2,3</span>
        </h2>
        <p className="description">
          Discover great deals, connect with sellers, and complete your purchase
          seamlessly
        </p>

        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <h3>🔍 Browse Items</h3>
            <p>
              Find a variety of products listed by students across your campus.
            </p>
          </div>
          <div className="arrow">➝</div>

          <div className="step">
            <div className="step-number">2</div>
            <h3>💬 Chat with Seller</h3>
            <p>
              Ask questions and negotiate the price directly with the seller.
            </p>
          </div>

          <div className="arrow">➝</div>

          <div className="step">
            <div className="step-number">3</div>
            <h3>🤝 Meet & Close Deal</h3>
            <p>Exchange items in person and finalize the deal.</p>
          </div>
        </div>
      </div>
      <footer className="footer">
        {/* Left Section - Logo & Name */}
        <div className="footer-left">
          <div className="tr">
            <img src={img7} alt="Campus Cartel" className="logo" />
            <h2>
              Campus <span className="trr">Cartel</span>
            </h2>
          </div>

          <div className="social-icons">
            <a
              href="https://www.instagram.com/prahaladh_05/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={instagram} alt="Instagram" />
            </a>
            <a
              href="https://github.com/Prahaladh39"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={facebook} alt="Facebook" />
            </a>
            <a
              href="https://www.linkedin.com/in/s-l-n-prahaladh-3133b4338/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={linkedin} alt="LinkedIn" />
            </a>
          </div>
        </div>

        <div className="footer-right">
          <h3>Quick Links</h3>
          <ul>
            <li>
              <a href="#ho">Home</a>
            </li>
            <li>
              <a href="#collec">Categories</a>
            </li>
            <li>
              <Link to="/home/sell">Sell a Product</Link>
            </li>
          </ul>
        </div>
      </footer>
    </>
  );
};

export default Home;
