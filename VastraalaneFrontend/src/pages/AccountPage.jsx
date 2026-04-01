import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import config from "../config";
import "../scss/_account.scss";

const AccountPage = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await axios.get(`${config.API_URL}/api/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
        setFormData(res.data); // prefill form with user data
      } catch (err) {
        console.error("Error fetching user:", err);
        alert("Unauthorized or token expired. Please login again.");
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    fetchUser();
  }, [navigate]);

  if (!user) return <p>Loading user data...</p>;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `${config.API_URL}/api/auth/profile`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Profile updated successfully!");
      setUser(formData);
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile.");
    }
  };

  return (
    <div className="account-page">
      <h1>Account Details</h1>
      <h2>{user.fullName || user.username}</h2>

      <div className="profile-details">
        <h3>Edit Profile</h3>
        <div className="profile-form">
          <label>Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName || ""}
            onChange={handleChange}
          />

          <label>Mobile Number</label>
          <input
            type="text"
            name="mobile"
            value={formData.mobile || ""}
            onChange={handleChange}
          />

          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email || ""}
            onChange={handleChange}
          />

          <label>Gender</label>
          <input
            type="text"
            name="gender"
            value={formData.gender || ""}
            onChange={handleChange}
          />

          

          <label>Location</label>
          <input
            type="text"
            name="location"
            value={formData.location || ""}
            onChange={handleChange}
          />

          <label>Alternate Mobile</label>
          <input
            type="text"
            name="altMobile"
            value={formData.altMobile || ""}
            onChange={handleChange}
          />

          <button onClick={handleSave}>Save Changes</button>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
