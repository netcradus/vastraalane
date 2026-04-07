import React from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import "../scss/_productSlider.scss";

import trouser from "../assets/Louis Vuitton Black Beige Monogram Imported Premium Tracksuit With Carry Bag - Copy.png";
import promoVideo from "../Videos/MS.jpeg";
import promoShirt from "../Videos/TShirts.jpeg";
import promoPerfumes from "../Videos/Perfumes.jpeg";
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
    className: "slick-slider",
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
          {products.map((item) => (
            <div className="product-card" key={item.path}>
              <Link to={item.path}>
                <div className="media-wrap">
                  <img src={item.img} alt={item.name} loading="lazy" className="slide-media" />
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
