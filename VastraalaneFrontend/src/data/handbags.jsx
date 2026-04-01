import React, { useState } from "react";
import "../scss/_handbags.scss";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import CustomModal from "../Sidebar/CustomModal";

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
  { id: 1, name: "Burberry Leather Tote (Black)", price: "₹2,000", oldPrice: "₹50,000", discount: "16% off", image: BurberryBlack },
  { id: 2, name: "Burberry Leather Tote (Brown)", price: "₹1,500", oldPrice: "₹48,000", discount: "14% off", image: BurberryBrown },
  { id: 3, name: "Coach Sling Bag 198", price: "₹18,00", oldPrice: "₹22,000", discount: "18% off", image: Coach198 },
  { id: 4, name: "Coach Sling Bag 200", price: "₹2500", oldPrice: "₹23,000", discount: "20% off", image: Coach200 },
  { id: 5, name: "Coach Sling Bag 201", price: "₹2789.0", oldPrice: "₹23,500", discount: "19% off", image: Coach201 },
  { id: 6, name: "Coach Dempsey Tote Beige", price: "₹22,00", oldPrice: "₹26,000", discount: "15% off", image: CoachBeige },
  { id: 7, name: "Coach Dempsey Tote Blue", price: "₹22,50", oldPrice: "₹27,000", discount: "16% off", image: CoachBlue },
  { id: 8, name: "Trendy Girls Purse", price: "₹2500", oldPrice: "₹9,000", discount: "17% off", image: GirlsPurse1 },
  { id: 9, name: "Gucci Dionysus Apricot Black", price: "₹5000", oldPrice: "₹65,000", discount: "15% off", image: GucciApricotBlack },
  { id: 10, name: "Gucci Dionysus Apricot Brown", price: "₹5000", oldPrice: "₹66,000", discount: "15% off", image: GucciApricotBrown },
  { id: 11, name: "Handbag Classic 78", price: "₹2,000", oldPrice: "₹9,500", discount: "16% off", image: Handbag78 },
  { id: 12, name: "Louis Vuitton Keepall Blue", price: "₹6000", oldPrice: "₹80,000", discount: "15% off", image: LouisBlue },
  { id: 13, name: "Louis Vuitton Keepall Neon", price: "₹1500", oldPrice: "₹79,000", discount: "15% off", image: LouisNeon },
  { id: 14, name: "Michael Kors Eliza Tote (45)", price: "₹2000", oldPrice: "₹30,000", discount: "16% off", image: MKEliza45 },
  { id: 15, name: "Michael Kors Eliza Tote (546)", price: "₹2000", oldPrice: "₹31,000", discount: "16% off", image: MKEliza546 },
  { id: 16, name: "Michael Kors Medium Backpack", price: "₹2000", oldPrice: "₹33,000", discount: "15% off", image: MKBeigeBrown },
  { id: 17, name: "Michael Kors Parker Shoulder Bag", price: "₹3000", oldPrice: "₹35,000", discount: "14% off", image: MKParker },
  { id: 18, name: "Michael Kors Sullivan Tote Beige", price: "₹2500", oldPrice: "₹32,000", discount: "14% off", image: MKSullivanBeige },
  { id: 19, name: "Michael Kors Sullivan Tote Coffee", price: "₹2000", oldPrice: "₹31,500", discount: "14% off", image: MKSullivanCoffee },
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
            <img src={selectedProduct.image} alt={selectedProduct.name} className="detail-image" />

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
