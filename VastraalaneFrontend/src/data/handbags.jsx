import React, { useState } from "react";
import "../scss/_handbags.scss";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import CustomModal from "../Sidebar/CustomModal";
import ProductGallery from "../components/ProductGallery";

// ✅ Import all handbag images
import BurberryBlack from "../assets/Burberr_y Tb Smooth Leather Tote Bag With Dust Bag (Black).png";
import BurberryBrown from "../assets/Burberr_y Tb Smooth Leather Tote Bag With Dust Bag (Brown).png";
import Coach198 from "../assets/COAC_H sling bag with folding box 198.png";
import Coach200 from "../assets/COAC_H sling bag with folding box 200.png";
import Coach201 from "../assets/COAC_H sling bag with folding box 201.png";
import CoachBeige from "../assets/Coach_Dempsey_Tote_22_In_Signature_Jacquard_With_Stripe_And_Coach_Patch_With_OG_Box_&_Dust_Bag_(Beige-5638) - Copy (2).png";
import CoachBlue from "../assets/Coach_Dempsey_Tote_22_In_Signature_Jacquard_With_Stripe_And_Coach_Patch_With_OG_Box_&_Dust_Bag_(Blue-5638)) - Copy (2).png";
import GirlsPurse1 from "../assets/girlspurse1.jpg";
import GucciApricotBlack from "../assets/Gucci_GG_Supreme_Medium_Dionysus_Bag_In_Apricot_Black_With_OG_Box_&_Dust_Bag_50247_Apricot_Black - Copy (2).png";
import GucciApricotBrown from "../assets/Gucci_GG_Supreme_Medium_Dionysus_Bag_In_Apricot_Brown_With_OG_Box_&_Dust_Bag_50247_Apricot_Brown - Copy.png";
import Handbag78 from "../assets/HANDBAG78 - Copy.jpg";
import LouisBlue from "../assets/Louis_Vuitton_Keepall_Bandouliere_50_Blue_Transparent_Travel_Duffle_Bag_With_Dust_Bag_(L-810).png";
import LouisNeon from "../assets/Louis_Vuitton_Keepall_Bandouliere_50_Neon_Transparent_Travel_Duffle_Bag_With_Dust_Bag_(L-810).png";
import MKEliza45 from "../assets/Michael_kors eliza small tote with carry bag 45.png";
import MKEliza546 from "../assets/Michael_kors eliza small tote with carry bag 546.png";
import MKBeigeBrown from "../assets/Michael_Kors_MK_Medium_Backpack_Beige_Brown_With_Dust_Bag_21050_Beige_Brown - Copy.jpg";
import MKParker from "../assets/Michael_Kors_Parker_Medium_Logo_Shoulder_Bag_With_Dust_Bag_&_OG_Box_22319_Beige_Brown.png";
import MKSullivanBeige from "../assets/Micheal_Kors_MK_Sullivan_Zipper_Tote_Bag_Beige_Brown_With_Dustbag_3910_Beige_Brown.jpg";
import MKSullivanCoffee from "../assets/Micheal_Kors_MK_Sullivan_Zipper_Tote_Bag_Coffee_Brown_With_Dustbag_3910_Coffee_Brown - Copy.jpg";

// ✅ Products array
const handbags = [
  { id: 1, name: "Premium Leather Tote – Black Edition", price: "₹3999", oldPrice: "₹6999", discount: "16% off", image: BurberryBlack },

  { id: 2, name: "Premium Leather Tote – Brown Edition", price: "₹4500", oldPrice: "₹8000", discount: "14% off", image: BurberryBrown },

  { id: 3, name: "Premium Sling Bag – Model 198", price: "₹3500", oldPrice: "₹34000", discount: "18% off", image: Coach198 },

  { id: 4, name: "Premium Sling Bag – Model 200", price: "₹3500", oldPrice: "₹3899", discount: "20% off", image: Coach200 },

  { id: 5, name: "Premium Sling Bag – Model 201", price: "₹3199", oldPrice: "₹55500", discount: "19% off", image: Coach201 },

  { id: 6, name: "Luxury Tote – Beige Edition", price: "₹2200", oldPrice: "₹4500", discount: "15% off", image: CoachBeige },

  { id: 7, name: "Luxury Tote – Blue Edition", price: "₹2100", oldPrice: "₹3000", discount: "16% off", image: CoachBlue },

  { id: 8, name: "Trendy Handbag – Everyday Style", price: "₹2791", oldPrice: "₹3000", discount: "17% off", image: GirlsPurse1 },

  { id: 9, name: "Luxury Handbag – Apricot Black Edition", price: "₹5500", oldPrice: "₹6500", discount: "15% off", image: GucciApricotBlack },

  { id: 10, name: "Luxury Handbag – Apricot Brown Edition", price: "₹5600", oldPrice: "₹6600", discount: "15% off", image: GucciApricotBrown },

  { id: 11, name: "Premium Handbag – Classic 78", price: "₹6000", oldPrice: "₹8500", discount: "16% off", image: Handbag78 },

  { id: 12, name: "Luxury Travel Bag – Blue Edition", price: "₹2000", oldPrice: "₹8000", discount: "15% off", image: LouisBlue },

  { id: 13, name: "Luxury Travel Bag – Neon Edition", price: "₹2500", oldPrice: "₹7000", discount: "15% off", image: LouisNeon },

  { id: 14, name: "Premium Tote – Classic 45", price: "₹2500", oldPrice: "₹3000", discount: "16% off", image: MKEliza45 },

  { id: 15, name: "Premium Tote – Classic 546", price: "₹2600", oldPrice: "₹3100", discount: "16% off", image: MKEliza546 },

  { id: 16, name: "Premium Backpack – Medium Edition", price: "₹2800", oldPrice: "₹3300", discount: "15% off", image: MKBeigeBrown },

  { id: 17, name: "Luxury Shoulder Bag – Classic Edition", price: "₹2900", oldPrice: "₹3500", discount: "14% off", image: MKParker },

  { id: 18, name: "Premium Tote – Beige Edition", price: "₹2700", oldPrice: "₹3200", discount: "14% off", image: MKSullivanBeige },

  { id: 19, name: "Premium Tote – Coffee Edition", price: "₹2799", oldPrice: "₹3100", discount: "14% off", image: MKSullivanCoffee },
];
const priceIncrement = Number(process.env.REACT_APP_PRODUCT_PRICE);
const handbagsList = handbags.map(handbag => {
  const numericPrice = Number(handbag.price.replace(/[₹,]/g, ""));
  const updatedPrice = numericPrice + priceIncrement;
  return {
    ...handbag,
    price: `₹${updatedPrice.toLocaleString("en-IN")}`
  };
});

const getNumericPrice = (priceStr) => Number(priceStr.replace(/[^0-9.]/g, ""));

const Handbags = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { addToCart } = useCart();
  const [popup, setPopup] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const showPopup = (message) => {
    setPopup(message);
    setTimeout(() => setPopup(""), 2000);
  };

  const handleAddToCart = (product) => {
    const cartItem = {
      id: product.id,
      name: product.name,
      price: getNumericPrice(product.price),
      quantity: 1,
      image: product.image,
    };
    addToCart(cartItem);
    showPopup(`✅ ${product.name} added to cart!`);
  };

  const handleBuyNow = () => {
    if (selectedProduct) {
      setShowConfirm(true);
    }
  };

  const confirmPurchase = () => {
    setShowConfirm(false);
    navigate("/customer-details", { state: { product: selectedProduct } });
  };

  return (
    <div className="handbags-container">
      <h2 className="section-title">Luxury Handbags Collection</h2>

      {!selectedProduct ? (
        <div className="handbags-grid">
          {handbagsList.map((product) => (
            <div
              key={product.id}
              className="handbags-card"
              onClick={() => setSelectedProduct(product)}
            >
              <img src={product.image} alt={product.name} className="handbags-image" />
              <h3 className="handbags-name">{product.name}</h3>
              <p className="handbags-price">
                {product.price} <span className="old-price">{product.oldPrice}</span>
              </p>
              <p className="discount">{product.discount}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="product-detail">
          <div className="detail-main">
            <ProductGallery product={selectedProduct} />

            <div className="detail-info">
              <h2>{selectedProduct.name}</h2>
              <p className="handbags-price">
                {selectedProduct.price} <span className="old-price">{selectedProduct.oldPrice}</span>
              </p>
              <p className="discount">{selectedProduct.discount}</p>

              <ul className="product-highlights">
                <li>✅ 7 Days Return Policy</li>
                <li>✅ Premium Quality Material</li>
                <li>✅ Free & Fast Delivery</li>
                <li>✅ Secure Payment Options</li>
              </ul>

              <div className="product-actions">
                <button className="btn-cart" onClick={() => handleAddToCart(selectedProduct)}>Add to Cart</button>
                <button className="btn-wishlist">Wishlist</button>
                <button className="btn-buy" onClick={handleBuyNow}>Buy Now</button>
              </div>
            </div>
          </div>

          <div className="related-section">
            <h3 className="related-title">Related Items</h3>
            <div className="related-items">
              {handbagsList
                .filter((p) => p.id !== selectedProduct.id)
                .slice(0, 4)
                .map((item) => (
                  <div
                    key={item.id}
                    className="handbags-card"
                    onClick={() => setSelectedProduct(item)}
                  >
                    <img src={item.image} alt={item.name} className="handbags-image" />
                    <h3 className="handbags-name">{item.name}</h3>
                    <p className="handbags-price">
                      {item.price} <span className="old-price">{item.oldPrice}</span>
                    </p>
                    <p className="discount">{item.discount}</p>
                  </div>
                ))}
            </div>
          </div>

          {popup && <div className="popup">{popup}</div>}

          {showConfirm && (
            <CustomModal
              isOpen={showConfirm}
              onClose={() => setShowConfirm(false)}
              onConfirm={confirmPurchase}
              product={selectedProduct}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Handbags;
