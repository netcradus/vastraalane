import React from "react"; 
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Banner from "../components/Banner";
import ProductSlider from "../components/ProductSlider";
import VideoSection from "../components/VideoSection";
import ProductDetail from "../pages/ProductDetail";

import "../scss/_home.scss";
import "../scss/_navbar.scss";
import "../scss/_banner.scss";
import "../scss/_productSlider.scss";
import "../scss/_footer.scss";

function Home() {
  const navigate = useNavigate();

  // Shop Now button pe navigate
  const handleShopNow = () => {
    navigate("/new-arrivals");
  };

  return (
    <div className="home-container">
      <Navbar />
      {/* Pass function to Banner */}
      <Banner onShopNow={handleShopNow} />
      <ProductSlider />
      <VideoSection />   
      <ProductDetail />  
    </div>
  );
}

export default Home;
