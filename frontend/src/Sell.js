import React, { useState } from "react";
import { Link } from "react-router"; // Import Firebase configuration
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
//ddcr1kgvx
//833544518865692
// 1Kr8cQIoxSm75KtuJhD_suyOO6w
const Sell = () => {
  const [formData, setFormData] = useState({
    id: uuidv4(),
    category: "",
    title: "",
    price: "",
    description: "",
    seller: { name: "", contact: "" },
    images: [],
    uploadDate: serverTimestamp(),
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "sellerName" || name === "sellerContact") {
      setFormData((prev) => ({
        ...prev,
        seller: {
          ...prev.seller,
          [name === "sellerName" ? "name" : "contact"]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length + imageFiles.length > 4) {
      toast.error("You can only upload up to 4 images!");
      return;
    }

    setImageFiles((prevImages) => [...prevImages, ...files]);
  };

  const uploadImagesToCloudinary = async () => {
    const urls = [];
    for (const file of imageFiles) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "Prahaladh");
      formData.append("cloud_name", "ddcr1kgvx");

      try {
        const res = await axios.post(
          "https://api.cloudinary.com/v1_1/ddcr1kgvx/image/upload",
          formData
        );
        urls.push(res.data.secure_url);
      } catch (error) {
        toast.error("Image upload failed!");
      }
    }
    return urls;
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (
      !formData.category ||
      !formData.title ||
      !formData.price ||
      !formData.seller.name ||
      !formData.seller.contact
    ) {
      toast.error("Please fill all required fields!");
      return;
    }

    if (!/^\d{10}$/.test(formData.seller.contact)) {
      toast.error("Seller contact must be exactly 10 digits!");
      return;
    }

    setUploading(true);
    toast.info("Uploading...");

    try {
      const imageUrls = await uploadImagesToCloudinary();
      const updatedData = { ...formData, images: imageUrls };
      await addDoc(collection(db, "Seller"), updatedData);

      toast.success("Product uploaded successfully!");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      toast.error("Failed to upload product!");
    } finally {
      setUploading(false);
    }
  };
  return (
    <>
      <nav className="navbar">
        <Link className="logo" to="/home">
          CAMPUS <span>CARTEL</span>
        </Link>
      </nav>
      <div className="head">
        <div className="collection-header">
          <hr className="line" />
          <h1>Welcome To Sellers Hub</h1>
          <hr className="line" />
        </div>
        <p className="h-p">
          Turn Your Clutter into Cash – Sell with Campus Cartel!
        </p>
      </div>
      <div className="sell-container">
        <div className="sell-note">
          <h1 className="sh2">
            Launching your product on Campus Cartel is soooo easy! 🚀
          </h1>
          <p className="sp">
            List your item in just a few clicks and connect with buyers
            instantly. Selling has never been this simple!
          </p>
        </div>
        <div className="sell-steps">
          <div className="step-box">
            <h3>Step 1</h3>
            <p>Give details about the product</p>
          </div>
          <div className="step-box">
            <h3>Step 2</h3>
            <p>Launch the product</p>
          </div>
          <div className="step-box">
            <h3>Step 3</h3>
            <p>Wait for the buyer to buy!</p>
          </div>
        </div>
      </div>
      <div className="guidelines-container">
        <h2 className="image-upload-heading">Image Upload Guidelines</h2>
        <p className="guidelines-text">
          For the best display quality, please upload images in a{" "}
          <strong>3:4 aspect ratio</strong>
          (e.g., <strong>300x400px, 600x800px</strong>, etc.). This ensures that
          your product images fit perfectly on our platform.
        </p>
      </div>
      <div className="upload-container">
        <ToastContainer position="top-center" autoClose={3000} />
        <h2>Upload Product Details</h2>
        <form onSubmit={handleUpload}>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            <option value="books">Books</option>
            <option value="electronics">Electronics</option>
            <option value="fashion">Fashion</option>
            <option value="sports">Sports</option>
            <option value="lab">Lab Supplies</option>
            <option value="miscellaneous">Miscellaneous</option>
          </select>
          <input
            type="text"
            name="title"
            placeholder="Product Title"
            value={formData.title}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="sellerName"
            placeholder="Seller Name"
            value={formData.seller.name}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="sellerContact"
            placeholder="Seller Contact (10 Digits)"
            value={formData.seller.contact}
            onChange={handleChange}
            required
            maxLength="10"
          />
          <p className=".sp">Choose upto 4 images</p>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
          />
          <div className="image-preview">
            {imageFiles.map((file, index) => (
              <img
                key={index}
                src={URL.createObjectURL(file)}
                alt={`preview-${index}`}
              />
            ))}
          </div>
          <button type="submit" disabled={uploading}>
            {uploading ? "Uploading..." : "Upload Product"}
          </button>
        </form>
      </div>
    </>
  );
};
export default Sell;
