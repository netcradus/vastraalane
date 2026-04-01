import React from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import "../scss/_productSlider.scss";

// ✅ Import images & videos
import sunglassesImg from "../assets/Sunglasses0.jpg";
import perfume from "../assets/_My_Burberry_England_Gift_Set_of_4.png";
import loafer from "../assets/LOAFERS0.png";
import trouser from "../assets/Louis Vuitton Black Beige Monogram Imported Premium Tracksuit With Carry Bag - Copy.png";
import tracksuit from "../assets/TRACKSUIT0.png";
import girlsShoes from "../assets/SGIRLSHOES0.png";
import luxuryWatchImg from "../assets/LUXURYWATCH78.jpg";
import handbag from "../assets/SHANDBAG0.png";
import flipflop from "../assets/NIK_E AIR MAX 1 FLIP FLOP ALL BLACK.png";
import girlsWatchImg from "../assets/GIRLWATCH0.png";
import tshirt from "../assets/SHOWCASE0.png";

// Example video (replace with your .mp4 file in /assets/)
import promoVideo from "../Videos/MS.jpeg";
import promoShirt from "../Videos/TShirts.jpeg";
import promoPerfumes from "../Videos/Perfumes.jpeg";
import promoWatches from "../Videos/watches.mp4";
import promoLoafer from "../Videos/Loafers.jpeg";
import promoLadiesWatch from "../Videos/WomensWatch.jpg";
import promoMensWatch from "../Videos/MensWatch.jpeg";
import promoFlipflop from "../Videos/Flipflop.jpeg";
import promoSpecs from "../Videos/Specs.png";
import promoTracks from "../Videos/Tracks.jpeg";
import promoBags from "../Videos/Handbags.jpeg";

function ProductSlider() {
  const products = [
    { name: "Sunglasses", img: promoSpecs, path: "/sunglasses" },
    { name: "Perfumes", img: promoPerfumes, path: "/perfume" },
    { name: "Loafer", img: promoLoafer, path: "/loafers" },
    { name: "Trouser", img: trouser, path: "/trousers" },
    { name: "Tracksuit", img: promoTracks, path: "/tracksuit" },
    { name: "Mens Shoes", img: promoVideo, path: "/menshoes" },
    { name: "Luxury Watch", img: promoMensWatch, path: "/luxury-watch" },
    { name: "Handbags and Bags", img: promoBags, path: "/handbags" },
    { name: "Flipflop", img: promoFlipflop, path: "/flipflops" },
    { name: "Ladies Watches", img: promoLadiesWatch, path: "/girls-watch" },
    { name: "T-Shirt and Shirts", img: promoShirt, path: "/tshirts" },
  ];

  const settings = {
    className: "slick-slider", // allows us to target slick elements reliably
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 2,
    slidesToScroll: 2,
    autoplay: true,
    autoplaySpeed: 2500,
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 3, slidesToScroll: 1 } },
      { breakpoint: 992, settings: { slidesToShow: 3, slidesToScroll: 1 } },
      { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 1 } },
      { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };

  return (
    <div className="product-slider">
      <h2 className="slider-title">Featured Products</h2>

      <div className="slick-wrap">
        <Slider {...settings}>
          {products.map((item, index) => (
            <div className="product-card" key={index}>
              <Link to={item.path}>
                <div className="media-wrap">
                  {item.video ? (
                    <video
                      src={item.video}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="slide-media"
                    />
                  ) : (
                    <img
                      src={item.img}
                      alt={item.name}
                      loading="lazy"
                      className="slide-media"
                    />
                  )}
                </div>

                <h3>{item.name}</h3>
              </Link>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}

export default ProductSlider;
