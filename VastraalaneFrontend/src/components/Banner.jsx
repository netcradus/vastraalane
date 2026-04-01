import React from "react";
import "../scss/_banner.scss";
import shoesVideo from "../assets/SHOESVIDEO.mp4";

const Banner = ({ onShopNow }) => {
  return (
    <div className="banner">
      {/* <video autoPlay loop muted className="banner-video">
        <source src={shoesVideo} type="video/mp4" />
      </video> */}
      <video 
  autoPlay 
  loop 
  muted 
  playsInline   // <-- important for mobile
  className="banner-video"
>
  <source src={shoesVideo} type="video/mp4" />
</video>
      <div className="banner-content">
        <h1>Step Into Style</h1>
        <button className="shop-now" onClick={onShopNow}>
          Shop Now
        </button>
      </div>
    </div>
  );
};

export default Banner;
