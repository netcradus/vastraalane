
// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "slick-carousel/slick/slick.css"; 

import Layout from "./components/Layout";
import ScrollToTop from "./components/ScrollToTop";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Products from "./pages/Products";
import ProductList from "./pages/ProductList";
import NewArrivals from "./pages/NewArrivals";
import CategoryPage from "./components/CategoryPage";
import AccountPage from "./pages/AccountPage";
import CustomerCare from "./pages/CustomerCare";
import About from "./pages/About";
import TermsConditions from "./pages/TermsConditions";
import WishlistPage from "./pages/WishlistPage";

// âœ… Category pages
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
import DBCategoryPage from "./Sidebar/DBCategoryPage";

// Cart Context and Page
import CartPage from "./pages/CartPage";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";

// Product Render page
import ProductRender from "./pages/ProductRender";
import Login from "./pages/Login"; // import karo
import CustomerForm from "./pages/CustomerForm"; // Adjust path if needed
import ThankYou from "./Sidebar/ThankYou";         // Adjust path if needed


function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <ScrollToTop />
          <Navbar />
          <main style={{ minHeight: "80vh" }}>
            <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            
            
           <Route path="/login" element={<Login />} />

            <Route path="/product-detail" element={<Products />} /> 
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
            

      <Route element={<Layout />}>
            <Route path="/shirts" element={<DBCategoryPage category="Shirts & Tshirt" title="Shirts & T-Shirts Collection" />} />
            <Route path="/loafers-page" element={<DBCategoryPage category="Loafers" title="Loafers Collection" />} />
            <Route path="/shoes-page" element={<DBCategoryPage category="Shoes" title="Shoes Collection" />} />
            <Route path="/luxury-page" element={<DBCategoryPage category="Luxury Watch" title="Luxury Watch Collection" />} />
            <Route path="/jeans-page" element={<DBCategoryPage category="Jeans & Trouser & Trackpant" title="Jeans, Trouser & Trackpant Collection" />} />
            <Route path="/handbag-page" element={<DBCategoryPage category="HandBags and Bag" title="Handbags & Bags Collection" />} />
            <Route path="/perfume-page" element={<DBCategoryPage category="Perfumes" title="Perfume Collection" />} />
            <Route path="/sunglasse-page" element={<DBCategoryPage category="Sunglasses" title="Sunglasses Collection" />} />
            <Route path="/cordset-page" element={<DBCategoryPage category="Cordset & Tracksuit" title="Cordset & Tracksuit Collection" />} />
            <Route path="/sandals-page" element={<DBCategoryPage category="Girls Sandals and jutti" title="Girls Sandals & Jutti Collection" />} />
            <Route path="/account" element={<AccountPage/>} />
        </Route>
              <Route path="/about" element={<About />} />
              <Route path="/support" element={<CustomerCare />} />
              <Route path="/terms" element={<TermsConditions />} />

            {/* Cart */}
            <Route path="/cart" element={<CartPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />

              <Route path="/customer-details" element={<CustomerForm />} />
    <Route path="/thank-you" element={<ThankYou />} />

            </Routes>
          </main>
          <Footer />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
