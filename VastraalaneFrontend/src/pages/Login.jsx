

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import config from "../config"; // Make sure config.js is inside src/

// const Login = () => {
//   const navigate = useNavigate();
//   const [isLogin, setIsLogin] = useState(true); // Toggle between login/signup
//   const [formData, setFormData] = useState({
//     username: "",
//     email: "",
//     password: "",
//   });

//   // Toggle between Login and Signup
//   const toggleForm = () => {
//     setIsLogin(!isLogin);
//     setFormData({ username: "", email: "", password: "" });
//   };

//   // Handle input changes
//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   // Handle form submission
//   const handleSubmit = async () => {
//     const { username, email, password } = formData;

//     if (!email || !password || (!isLogin && !username)) {
//       alert("Please fill in all required fields");
//       return;
//     }

//     try {
//       if (isLogin) {
//         // Login API
//         const res = await axios.post(
//           `${config.API_URL}/api/auth/login`,
//           { email, password },
//           { headers: { "Content-Type": "application/json" } }
//         );
//         localStorage.setItem("token", res.data.token);
//         navigate("/account");
//       } else {
//         // Signup API
//         const res = await axios.post(
//           `${config.API_URL}/api/auth/signup`,
//           { username, email, password },
//           { headers: { "Content-Type": "application/json" } }
//         );
//         alert("Signup successful! Please login.");
//         setIsLogin(true);
//         setFormData({ username: "", email: "", password: "" });
//       }
//     } catch (err) {
//       console.error("Error:", err.response ? err.response.data : err);
//       alert(
//         err.response && err.response.data.message
//           ? err.response.data.message
//           : isLogin
//           ? "Login failed"
//           : "Signup failed"
//       );
//     }
//   };

//   return (
//     <div style={{ padding: "50px", maxWidth: "400px", margin: "0 auto" }}>
//       <h2>{isLogin ? "Login" : "Signup"}</h2>

//       {/* Show username input only for Signup */}
//       {!isLogin && (
//         <input
//           type="text"
//           name="username"
//           placeholder="Username"
//           value={formData.username}
//           onChange={handleChange}
//         />
//       )}

//       <input
//         type="email"
//         name="email"
//         placeholder="Email"
//         value={formData.email}
//         onChange={handleChange}
//       />
//       <input
//         type="password"
//         name="password"
//         placeholder="Password"
//         value={formData.password}
//         onChange={handleChange}
//       />

//       <button onClick={handleSubmit}>
//         {isLogin ? "Login" : "Signup"}
//       </button>

//       <p style={{ marginTop: "15px" }}>
//         {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
//         <span
//           style={{ color: "blue", cursor: "pointer" }}
//           onClick={toggleForm}
//         >
//           {isLogin ? "Signup" : "Login"}
//         </span>
//       </p>
//     </div>
//   );
// };

// export default Login;


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../config";
import { FaBars, FaTimes } from "react-icons/fa"; // Hamburger icons
import "../scss/_Login.scss";

const Login = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false); // Hamburger menu state
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setFormData({ username: "", email: "", password: "" });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const { username, email, password } = formData;
    if (!email || !password || (!isLogin && !username)) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      if (isLogin) {
        const res = await axios.post(
          `${config.API_URL}/api/auth/login`,
          { email, password },
          { headers: { "Content-Type": "application/json" } }
        );
        localStorage.setItem("token", res.data.token);
        navigate("/account");
      } else {
        await axios.post(
          `${config.API_URL}/api/auth/signup`,
          { username, email, password },
          { headers: { "Content-Type": "application/json" } }
        );
        alert("Signup successful! Please login.");
        setIsLogin(true);
        setFormData({ username: "", email: "", password: "" });
      }
    } catch (err) {
      console.error("Error:", err.response ? err.response.data : err);
      alert(err.response?.data?.message || (isLogin ? "Login failed" : "Signup failed"));
    }
  };

  return (
    <div className="login-page">
      {/* Navbar
      <nav className="navbar">
        <div className="logo" onClick={() => navigate("/")}>
          Vastraaalane Logo
        </div>
        <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </div>
        <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
          <li onClick={() => navigate("/")}>Home</li>
          <li onClick={() => navigate("/products")}>Products</li>
          <li onClick={() => navigate("/category")}>Category</li>
          <li onClick={() => navigate("/login")}>Login</li>
        </ul>
      </nav> */}

      {/* Auth Form */}
      <div className="auth-container">
        <h2>{isLogin ? "Login" : "Signup"}</h2>
        {!isLogin && (
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
          />
        )}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />
        <button onClick={handleSubmit}>{isLogin ? "Login" : "Signup"}</button>
        <p className="toggle-text">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <span onClick={toggleForm}>{isLogin ? "Signup" : "Login"}</span>
        </p>
      </div>

      
    </div>
  );
};

export default Login;
