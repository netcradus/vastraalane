import React, { useState } from "react";
import "../scss/_GirlsWatch.scss";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import CustomModal from "../Sidebar/CustomModal";

// ✅ Import all images
import RolexOyster from "../assets/Role_x Oyster Perpetual Date.png";
import Rolex2284 from "../assets/ROLE X_FOR HER 2284.png";
import RadoDiastar from "../assets/Rad_o diastar open heart.png";
import OmegaSeamaster from "../assets/Omeg a Seamaster Aqua Terra Blue Japanese Automatic 2298 - Copy.png";
import WomenWatch78 from "../assets/WOMENWATCH78.jpg";
import TommyHilfiger from "../assets/Tommy_Hilfiger Decker - J1458.png";
import JustCavalli2264 from "../assets/JUST CAVALLI FOR HER 2264.png";
import JustCavalli2263 from "../assets/JUST CAVALLI FOR HER 2263 - Copy (2).png";
import JustCavalli2262 from "../assets/JUST CAVALLI FOR HER 2262.png";
import Fossil2283 from "../assets/FOSSI_L WATCH FOR HER 2283.png";
import FossilGrant from "../assets/Fossi l Grant Skeleton Automatic (SilverGreen).png";
import Emporio2314 from "../assets/Emporio Arman_i_For her 2314.png";
import Emporio2311 from "../assets/Emporio Arman_i For her_2311 - Copy.png";
import Emporio2325 from "../assets/Emporio Arman_i For her 2325.png";
import Emporio2324 from "../assets/Emporio Arman_i For her 2324 - Copy.png";
import Emporio2322 from "../assets/Emporio Arman_i For her 2322 - Copy.png";
import Emporio2321 from "../assets/Emporio Arman_i For her 2321 - Copy.png";
import Emporio2319 from "../assets/Emporio Arman_i For her 2319.png";
import Emporio2318 from "../assets/Emporio Arman_i For her 2318 - Copy.png";
import Emporio2317 from "../assets/Emporio Arman_i For her 2317 - Copy.png";
import Emporio2316 from "../assets/Emporio Arman_i For her 2316 - Copy.png";
import Emporio2315 from "../assets/Emporio Arman_i For her 2315.png";
import Emporio2312 from "../assets/Emporio Arman_i For her 2312.png";
import Emporio2310 from "../assets/Emporio Arman_i For her 2310.png";
import Emporio2316Copy from "../assets/Emporio Arman_i For her 231 6 - Copy.png";
import EmporioAR1143A from "../assets/Emporio Arman_i AR1143 - J1456 - Copy.png";
import EmporioAR1143B from "../assets/Emporio Arman_i AR1143 - J1455 - Copy.png";
import Emporio2323 from "../assets/Empori o Arman_i For her 2323 white dial - Copy.png";

const girlsWatches = [
  { name: "Role_x Oyster Perpetual Date", image: RolexOyster, price: "₹1999" },
  { name: "ROLE X_FOR HER 2284", image: Rolex2284, price: "₹1000" },
  { name: "Rad_o diastar open heart", image: RadoDiastar, price: "₹1799" },
  { name: "Omeg a Seamaster Aqua Terra Blue Japanese Automatic 2298", image: OmegaSeamaster, price: "₹1399" },
  { name: "WOMENWATCH78", image: WomenWatch78, price: "₹2400" },
  { name: "Tommy_Hilfiger Decker - J1458", image: TommyHilfiger, price: "₹1850" },
  { name: "JUST CAVALLI FOR HER 2264", image: JustCavalli2264, price: "₹2500" },
  { name: "JUST CAVALLI FOR HER 2263 ", image: JustCavalli2263, price: "₹2500" },
  { name: "JUST CAVALLI FOR HER 2262", image: JustCavalli2262, price: "₹1,000" },
  { name: "FOSSI_L WATCH FOR HER 2283", image: Fossil2283, price: "₹1,500" },
  { name: "Fossi l Grant Skeleton Automatic (SilverGreen)", image: FossilGrant, price: "₹2,000" },
  { name: "Emporio Arman_i_For her 2314", image: Emporio2314, price: "₹3,000" },
  { name: "Emporio Arman_i For her_2311 ", image: Emporio2311, price: "₹2,000" },
  { name: "Emporio Arman_i For her 2325", image: Emporio2325, price: "₹3,000" },
  { name: "Emporio Arman_i For her 2324 ", image: Emporio2324, price: "₹3,500" },
  { name: "Emporio Arman_i For her 2322 ", image: Emporio2322, price: "₹2,000" },
  { name: "Emporio Arman_i For her 2321 ", image: Emporio2321, price: "₹2,500" },
  { name: "Emporio Arman_i For her 2319", image: Emporio2319, price: "₹3,500" },
  { name: "Emporio Arman_i For her 2318 ", image: Emporio2318, price: "₹1,500" },
  { name: "Emporio Arman_i For her 2317 ", image: Emporio2317, price: "₹2,500" },
  { name: "Emporio Arman_i For her 2316 ", image: Emporio2316, price: "₹2,800" },
  { name: "Emporio Arman_i For her 2315", image: Emporio2315, price: "₹2,800" },
  { name: "Emporio Arman_i For her 2312", image: Emporio2312, price: "₹3,000" },
  { name: "Emporio Arman_i For her 2310", image: Emporio2310, price: "₹2,800" },
  { name: "Emporio Arman_i For her 231 6 ", image: Emporio2316Copy, price: "₹2,500" },
  { name: "Emporio Arman_i AR1143 - J1456 ", image: EmporioAR1143A, price: "₹3,000" },
  { name: "Emporio Arman_i AR1143 - J1455", image: EmporioAR1143B, price: "₹2,500" },
  { name: "Empori o Arman_i For her 2323 white dial", image: Emporio2323, price: "₹3,000" },
];
const priceIncrement = Number(process.env.REACT_APP_PRODUCT_PRICE);
const girlsWatchesList = girlsWatches.map((watch, index) => {
  const numericPrice = Number(watch.price.replace(/[₹,]/g, ""));
  const updatedPrice = numericPrice + priceIncrement;
  return {
    ...watch,
    id: index + 1,
    price: `₹${updatedPrice.toLocaleString("en-IN")}`
  };
});

const GirlsWatch = () => {
  const [selectedWatch, setSelectedWatch] = useState(null);
  const { addToCart, addToWishlist, wishlist } = useCart();
  const [popup, setPopup] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const showPopup = (message) => {
    setPopup(message);
    setTimeout(() => setPopup(""), 2000);
  };

  const getNumericPrice = (priceStr) => {
    if (!priceStr) return 0;
    return Number(priceStr.toString().replace(/[^0-9.]/g, ""));
  };

  const handleAddToCart = (watch) => {
    const cartItem = {
      id: watch.id,
      name: watch.name,
      price: getNumericPrice(watch.price),
      quantity: 1,
      image: watch.image,
    };
    addToCart(cartItem);
    showPopup(`✅ ${watch.name} added to cart!`);
  };

  const handleWishlist = (watch) => {
    addToWishlist(watch);
    showPopup(
      wishlist.some((w) => w.id === watch.id)
        ? `${watch.name} removed from Wishlist!`
        : `${watch.name} added to Wishlist!`
    );
  };

  const handleBuyNow = () => {
    if (selectedWatch) {
      setShowConfirm(true);
    }
  };

  const confirmPurchase = () => {
    setShowConfirm(false);
    navigate("/customer-details", { state: { product: selectedWatch } });
  };

  const relatedItems = selectedWatch
    ? girlsWatchesList.filter((watch) => watch.id !== selectedWatch.id).slice(0, 4)
    : [];

  if (selectedWatch) {
    return (
      <div className="product-detail-page">
        <div className="detail-container">
          <div className="detail-content">
            <div className="detail-left">
              <img
                src={selectedWatch.image}
                alt={selectedWatch.name}
                className="detail-image"
              />
            </div>

            <div className="detail-right">
              <h2>{selectedWatch.name}</h2>
              <p className="price">{selectedWatch.price}</p>
              <p>Shipping calculated at checkout.</p>

              <div className="quantity-selector">
                <label>Quantity:</label>
                <input type="number" min="1" defaultValue="1" />
              </div>

              <div className="product-actions">
                <button
                  className="btn-cart"
                  onClick={() => handleAddToCart(selectedWatch)}
                >
                  Add to Cart
                </button>
                <button className="btn-buy" onClick={handleBuyNow}>
                  Buy Now
                </button>
                <button
                  className="btn-wishlist"
                  onClick={() => handleWishlist(selectedWatch)}
                >
                  {wishlist.some((w) => w.id === selectedWatch.id)
                    ? "Remove from Wishlist"
                    : "♡ Wishlist"}
                </button>
              </div>

              <h3 className="related-title">Related Items</h3>
              <div className="related-items-grid">
                {relatedItems.map((item) => (
                  <div
                    className="related-card"
                    key={item.id}
                    onClick={() => setSelectedWatch(item)}
                  >
                    <img src={item.image} alt={item.name} />
                    <p className="related-name">{item.name}</p>
                    <p className="related-price">{item.price}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {popup && <div className="popup">{popup}</div>}

        <CustomModal
          isOpen={showConfirm}
          onClose={() => setShowConfirm(false)}
          onConfirm={confirmPurchase}
          product={selectedWatch}
        />
      </div>
    );
  }

  return (
    <div className="products-container">
      <h2 className="products-title">Girls Watches Collection</h2>
      <div className="products-grid">
        {girlsWatchesList.map((watch) => (
          <div
            className="product-card"
            key={watch.id}
            onClick={() => setSelectedWatch(watch)}
          >
            <img src={watch.image} alt={watch.name} className="product-image" />
            <h3 className="product-name">{watch.name}</h3>
            <p className="product-price">{watch.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GirlsWatch;