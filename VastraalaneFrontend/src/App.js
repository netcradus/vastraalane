
// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "slick-carousel/slick/slick.css"; 

import Layout from "./components/Layout";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Products from "./pages/Products";

import ProductDetail from "./pages/ProductDetail";
import ProductList from "./pages/ProductList";
import NewArrivals from "./pages/NewArrivals";
import CategoryPage from "./components/CategoryPage";
import AccountPage from "./pages/AccountPage";
import CustomerCare from "./pages/CustomerCare";
import About from "./pages/About";
import TermsConditions from "./pages/TermsConditions";

// ✅ Category pages
import FlipFlops from "./data/FlipFlops";
import GirlsWatch from "./data/girlsWatch";
import Handbags from "./data/handbags";
import Loafers from "./data/loafers";
import LuxuryWatch from "./data/luxuryWatch";
import Sunglasses from "./data/sunglasses";
import Trousers from "./data/trousers";
import Tshirts from "./data/tshirts";
import Perfumes from "./data/perfumes";
import MenShoes from "./data/menshoes";
import TrackSuit from './data/trackSuit';

// Sidebar pages
import ShirtsPage from "./Sidebar/ShirtsPage";
import LoafersPage from "./Sidebar/LoafersPage";
import ShoesPage from "./Sidebar/shoesPage";
import LuxuryPage from "./Sidebar/LuxuryPage";
import JeansPage from "./Sidebar/JeansPage";
import HandbagPage from "./Sidebar/HandbagPage";
import PerfumePage from "./Sidebar/PerfumePage";
import SunglassesPage from "./Sidebar/SunglassesPage";
import CordsetPage from "./Sidebar/CordsetPage";
import SandalsPage from "./Sidebar/SandalsPage";

// Cart Context and Page
import CartPage from "./pages/CartPage";
import { CartProvider } from "./context/CartContext";

// Product Render page
import ProductRender from "./pages/ProductRender";
import Login from "./pages/Login"; // import karo
import CustomerForm from "./pages/CustomerForm"; // Adjust path if needed
import ThankYou from "./Sidebar/ThankYou";         // Adjust path if needed


function App() {
  return (
    <CartProvider>
      <Router>
        <Navbar />
        <main style={{ minHeight: "80vh" }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            
            
           <Route path="/login" element={<Login />} />

            <Route path="/product-detail" element={<ProductDetail />} /> 
            <Route path="/product-list" element={<ProductList />} />
            <Route path="/new-arrivals" element={<NewArrivals />} />

            {/* Category Pages */}
            <Route path="/flipflops" element={<FlipFlops />} />
            <Route path="/girls-watch" element={<GirlsWatch />} />
            <Route path="/handbags" element={<Handbags />} />
            <Route path="/loafers" element={<Loafers />} />
            <Route path="/luxury-watch" element={<LuxuryWatch />} />
            <Route path="/sunglasses" element={<Sunglasses />} />
            <Route path="/trousers" element={<Trousers />} />
            <Route path="/tshirts" element={<Tshirts />} /> 
            <Route path="/perfume" element={<Perfumes />} />
            <Route path="/perfumes" element={<Perfumes />} />
            <Route path="/menshoes" element={<MenShoes />} />
            <Route path="/product/:id" element={<ProductRender />} />
            <Route path="/tracksuit" element={<TrackSuit />} />
            <Route path="/category" element={<CategoryPage />} />

            {/* Sidebar Pages */}
            

      <Route path="/" element={<Layout />}>
         <Route path="/shirts" element={<ShirtsPage />} />
            <Route path="/loafers-page" element={<LoafersPage />} />
            <Route path="/shoes-page" element={<ShoesPage />} />
            <Route path="/Luxury-page" element={<LuxuryPage />} />
            <Route path="/jeans-page" element={<JeansPage />} />
            <Route path="/handbag-page" element={<HandbagPage />} />
            <Route path="/perfume-page" element={<PerfumePage />} />
            <Route path="/sunglasse-page" element={<SunglassesPage />} />
            <Route path="/cordset-page" element={<CordsetPage />} />
            <Route path="/Sandals-page" element={<SandalsPage />} />
            <Route path="/account" element={<AccountPage/>} />
        </Route>
              <Route path="/about" element={<About />} />
              <Route path="/support" element={<CustomerCare />} />
              <Route path="/terms" element={<TermsConditions />} />

            {/* Cart */}
            <Route path="/cart" element={<CartPage />} />

              <Route path="/customer-details" element={<CustomerForm />} />
    <Route path="/thank-you" element={<ThankYou />} />

          </Routes>
        </main>
        <Footer />
      </Router>
    </CartProvider>
  );
}

export default App;

