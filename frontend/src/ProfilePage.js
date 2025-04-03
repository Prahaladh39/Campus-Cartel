import React, { useEffect, useState } from "react";
import { auth, db } from "./FirebaseConfig";
import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { Link } from "react-router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [myListings, setMyListings] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [updatedProductData, setUpdatedProductData] = useState({});
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [updatedUserData, setUpdatedUserData] = useState({});

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (userData) {
      fetchListings();
    }
  }, [userData]);

  const fetchUserData = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          setUserData(userDoc.data());
          setUpdatedUserData(userDoc.data());
        } else {
          console.error("User document not found!");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
  };

  const fetchListings = async () => {
    try {
      const listingsRef = collection(db, "Seller");
      const listingsSnapshot = await getDocs(listingsRef);

      const filteredListings = listingsSnapshot.docs
        .filter((doc) => doc.data().seller?.contact === userData?.phone)
        .map((doc) => ({
          firestoreId: doc.id, // Firestore doc ID
          ...doc.data(),
        }));

      setMyListings(filteredListings);

      if (filteredListings.length === 0) {
        console.log("No listings found for your phone number.");
      }
    } catch (error) {
      console.error("Error fetching listings:", error);
    }
  };

  const handleEditProfileClick = () => {
    setIsEditingProfile(true);
  };

  const handleSaveProfileChanges = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, updatedUserData);
      toast.success("Profile updated successfully!");
      setIsEditingProfile(false);
      fetchUserData();
    } catch (error) {
      console.error("Error updating user profile:", error);
    }
  };

  const handleUserInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditProductClick = (product) => {
    setEditingProduct(product.firestoreId); // Use Firestore doc ID
    setUpdatedProductData(product);
  };

  const handleSaveProductChanges = async () => {
    try {
      if (!editingProduct) return;

      const productRef = doc(db, "Seller", editingProduct);

      const docSnap = await getDoc(productRef);
      if (!docSnap.exists()) {
        console.error("No document found with ID:", editingProduct);
        return;
      }

      await updateDoc(productRef, updatedProductData);
      toast.success("Product updated successfully!");
      setEditingProduct(null);
      fetchListings();
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "Seller", id));
      setMyListings(myListings.filter((item) => item.firestoreId !== id));
      toast.success("Product deleted successfully!");
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleProductInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProductData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <nav className="navbar">
        <Link className="logo" to="/home">
          CAMPUS <span>CARTEL</span>
        </Link>
      </nav>
      '
      <ToastContainer position="top-center" autoClose={3000} />
      <div>
        <h1 className="listing-h">Hello, {userData?.username || "User"}!</h1>
        <center>
          <h2>Your Profile</h2>
          {isEditingProfile ? (
            <div>
              <input
                type="text"
                name="username"
                value={updatedUserData.username || ""}
                onChange={handleUserInputChange}
              />
              <input
                type="text"
                name="phone"
                value={updatedUserData.phone || ""}
                onChange={handleUserInputChange}
              />
              <input
                type="text"
                name="email"
                value={updatedUserData.email || ""}
                onChange={handleUserInputChange}
              />
              <button onClick={handleSaveProfileChanges}>Save</button>
              <button onClick={() => setIsEditingProfile(false)}>Cancel</button>
            </div>
          ) : (
            <div>
              <p>Username: {userData?.username}</p>
              <p>Phone: {userData?.phone}</p>
              <p>Email: {userData?.email}</p>
              <button onClick={handleEditProfileClick}>Edit Profile</button>
            </div>
          )}
        </center>
        <center>
          <h2 className="listing-h">My Listings</h2>
        </center>

        {myListings.length > 0 ? (
          myListings.map((product) => (
            <div key={product.firestoreId}>
              {editingProduct === product.firestoreId ? (
                <>
                  <input
                    type="text"
                    name="title"
                    value={updatedProductData.title}
                    onChange={handleProductInputChange}
                  />
                  <input
                    type="text"
                    name="description"
                    value={updatedProductData.description}
                    onChange={handleProductInputChange}
                  />
                  <input
                    type="text"
                    name="price"
                    value={updatedProductData.price}
                    onChange={handleProductInputChange}
                  />
                  <button onClick={handleSaveProductChanges}>Save</button>
                  <button onClick={() => setEditingProduct(null)}>
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <div key={product.id} className="listing-card">
                    <img
                      src={product.images[0]}
                      alt="nothing"
                      className="listing-image"
                    />
                    <div className="listing-details">
                      <h3>{product.title}</h3>
                      <p>{product.description}</p>
                      <p className="price">Price: ₹{product.price}</p>
                      <div className="button-group">
                        <button
                          onClick={() => handleEditProductClick(product)}
                          className="edit-btn"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product.firestoreId)}
                          className="delete-btn"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))
        ) : (
          <p>No listings found</p>
        )}
      </div>
    </>
  );
};

export default ProfilePage;
