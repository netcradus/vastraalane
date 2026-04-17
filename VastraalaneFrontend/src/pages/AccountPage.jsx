import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../config";
import { useAuth } from "../context/AuthContext";
import "../scss/_account.scss";

const AccountPage = () => {
  const { user, token, logout, refreshProfile, setUser } = useAuth();
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        navigate("/login");
        return;
      }

      const profile = user || (await refreshProfile(token));
      if (!profile) {
        alert("Unauthorized or token expired. Please login again.");
        navigate("/login");
        return;
      }

      setFormData(profile);
    };

    fetchUser();
  }, [navigate, refreshProfile, token, user]);

  if (!user) return <p>Loading user data...</p>;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const res = await axios.put(
        `${config.API_URL}/api/auth/profile`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Profile updated successfully!");
      setUser(res.data);
      setFormData(res.data);
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile.");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
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
          <button type="button" className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
