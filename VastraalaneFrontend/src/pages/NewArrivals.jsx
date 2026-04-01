import React, { useState } from "react";
import "../scss/_newArrivals.scss";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import CustomModal from "../Sidebar/CustomModal"; // ✅ import modal

// 📂 Perfume & Gift Sets
import ACQUA_DI_GIO_GIORGIO_ARMAN_white from "../assets/_ACQUA_DI_GIO_GIORGIO_ARMAN_white.png";
import Calvin_Klein_Gift_Set_4 from "../assets/_Calvin_Klein_Gift_Set_4.png";
import David_becham_70066 from "../assets/_David_becham_70066.png";
import Dolce_and_gabbana_5011 from "../assets/_Dolce_and_gabbana_5011.png";
import Dolce_Gabbana_Blue_Pour_Homme_Gift_Set_of_3 from "../assets/_Dolce_Gabbana_Blue_Pour_Homme_Gift_Set_of_3.png";
import Dolce_Gabbana_The_Only_One_Gift_Set_of_3 from "../assets/_Dolce_Gabbana_The__Only_One_Gift_Set_of_3.png";
import Gucci_10318 from "../assets/_Gucci_10318_.png";
import Marc_jacobs_515 from "../assets/_Marc_jacobs_515.png";
import My_Burberry_England_Gift_Set_of_4 from "../assets/_My_Burberry_England_Gift_Set_of_4.png";
import Tom_ford_23533 from "../assets/_Tom_ford_23533.png";
import Tom_Ford_EDP_Gift_Set_of_4 from "../assets/_Tom_Ford_EDP_Gift_Set_of_4.png";
import Valentino_Uomo_Born_in_Roma_EDT_Gift_Set_of_3 from "../assets/_Valentino_Uomo_Born_in_Roma_EDT_Gift_Set_of_3.png";
import VIP_BLACK from "../assets/212 VIP BLACKk.png";
import SEXY_MEN_EAU_DE_TOILETTE_1 from "../assets/212_SEXY_MEN_EAU_DE_TOILETTE_1.png";

// 📂 Shoes & Trackpants
import Adapt_Automax_Full_Black_Shoes from "../assets/Adapt_Automax_Full_Black_Shoes.jpg";
import adida_Copy_2 from "../assets/adida - Copy (2).jpg";
import Adidas_s_Beige_Classic_Embroidery_Logo_Premium_Trackpant_Copy from "../assets/Adida s Beige Classic Embroidery Logo Premium Trackpant - Copy.png";
import Adidas_s_Black_Classic_Embroidery_Logo_Premium_Trackpant_Copy_2 from "../assets/Adida s Black Classic Embroidery Logo Premium Trackpant - Copy (2).png";
import Adidas_s_Black_Embroidery_Logo_Premium_Trackpant_Copy_2 from "../assets/Adida s Black Embroidery Logo Premium Trackpant - Copy (2).png";

// 📂 Yeezy, Adidas, Jordan, Airforce
import Adidas_s_Dark_Grey_Embroidery_Logo_Premium_Trackpant from "../assets/Adida s Dark Grey Embroidery Logo Premium Trackpant.png";
import Adidas_s_Light_Grey_Embroidery_Logo_Premium_Trackpant from "../assets/Adida s Light Grey Embroidery Logo Premium Trackpant.png";
import Adidas_s_Olive_Embroidery_Logo_Premium_Trackpant from "../assets/Adida s Olive Embroidery Logo Premium Trackpant.png";
import Adidas_s_Premium_Logo_Designer_Track_Bege_312 from "../assets/Adida s Premium Logo Designer Track Beige (312).png";
import Adidas_s_Red_Logo_Print_Premium_Imported_Tracksuit from "../assets/Adida s Red Logo Print Premium Imported Tracksuit.png";
import Adidas_ss_Yeezy_Boost_350_V2_Carbon_Beluga_SEMI_UA_With_All_Accesories from "../assets/Adida s Premium Logo Designer Track Beige (312).png";
import Adidas_Yeezy_Boost_350_V2_Bone_White_SEMI_UA_With_All_Accesories_Copy_2 from "../assets/Adidass Yeezy 350 V2 Bone White SEMI UA With All Accesories - Copy (2).png";
import Adidas_Yeezy_Boost_350_V2_Beluga_SEMI_UA_With_All_Accesories from "../assets/Adidass Yeezy Boost 350 V2 Beluga SEMI UA With All Accesories.png";
import Adidas_Yeezy_Boost_350_V2_Oreo_SEMI_UA_With_All_Accesories_Copy_2 from "../assets/Adidass Yeezy Boost 350 V2 Beluga SEMI UA With All Accesories.png";
import Adidas_Yeezy_Slides_Bone_Ua from "../assets/Adiddas Yeezy Slides Bone Ua.png";
import Adidas_Yeezy_Slides_flax_Ua_Copy_2 from "../assets/Adiddas Yeezy Slides flax Uaa - Copy (2).png";
import Aididas_Foam_Runner_Onyx_Ua_Copy_3 from "../assets/Aidddas Foam Runner Onyx Ua - Copy (3).png";
import Air_Jordan_Navy_Blue_Premium_Oversized_Cord_Set_Copy_3 from "../assets/Air Jordan Navy Blue Premium Oversized Cord Set - Copy (3).png";
import air_max_1_flip_flop_grey_green_Copy_2 from "../assets/air max 1 flip flop grey green - Copy (2).png";
import airforce_1_milky_white_pure_leather_Copy from "../assets/airforce 1 milky white pure leather - Copy.png";
import ALEXANDER_MCQUEEN_PREMIUM_WHITE_SNEAKER from "../assets/ALEXANDER MCQUEEN PREMIUM WHITE SNEAKER.png";
import ALEXANDER_MCQUEEN_PREMIUM_WHITE_SNEAKER_Copy_2 from "../assets/ALEXANDER MCQUEEN PREMIUM WHITE SNEAKERR - Copy (2).png";

// 📂 Armani & Others
import Armani_i_Exchange_Premium_Imported_Polo_T_shirt_Cotton_Matty_Fabric_Black_2373_Copy from "../assets/Arman i Exchange Premium Imported Polo T shirt Cotton Matty Fabric Black 2373 - Copy (3).jpg";
import Balmain_28015_brown_Copy from "../assets/Balmain_28015_brown - Copy.png";
import Balmain_28015_tiger_brown from "../assets/Balmain_28015_tiger_brown.png";
import Balmain_28015_tiger_green from "../assets/Balmain_28015_tiger_green.png";
import BG11 from "../assets/BG11.png";
import Birkenstock_Arizona_black_grey_split from "../assets/Birkenstock Arizona black grey split.png";
import BIRKENSTOCK_ARIZONA_EVA_BLACK_Copy_2 from "../assets/BIRKENSTOCK ARIZONA EVA BLACK - Copy (2).png";
import BIRKENSTOCK_ARIZONA_EVA_BLUE from "../assets/BIRKENSTOCK ARIZONA EVA BLUE.png";

import BIRKENSTOCK_ARIZONA_EVA_GREY from "../assets/BIRKENSTOCK ARIZONA EVA GREY.png";
import Birkenstock_arizona_Ivory_Leather from "../assets/Birkenstock arizona Ivory Leather.png";
import Birkenstock_Arizona_Leather_Brown_Copy from "../assets/Birkenstock Arizona Leather Brown - Copy.jpg";
import Birkenstock_Arizona_Leather_Dark_Navy from "../assets/Birkenstock Arizona Leather Dark Navy.png";
import Birkenstock_Arizona_Sky_Blue_Suede_Copy_2 from "../assets/Birkenstock Arizona Sky Blue Suede - Copy (2).png";
import Birkenstock_Arizona_Sky_Blue_Suede_Copy from "../assets/Birkenstock Arizona Sky Blue Suede - Copy.png";
import Birkenstock_Arizona_Suede from "../assets/Birkenstock Arizona Suede.png";
import Birkenstock_boston_Dark_Grey_Copy_2 from "../assets/Birkenstock boston Dark Grey - Copy (2).png";

import Birkenstock_boston_tan_Suede from "../assets/Birkenstock boston tan suede.png";
import Birkenstock_brown_ramses_Copy_2 from "../assets/Birkenstock brown ramses - Copy (2).png";

// ✅ Array of products
const newArrivals = [
  // 📂 Perfume & Gift Sets
  { name: "ACQUA DI GIO GIORGIO", image: ACQUA_DI_GIO_GIORGIO_ARMAN_white, price: 2790, oldPrice: 15000 },
  { name: "Calvin Klein Gift Set", image: Calvin_Klein_Gift_Set_4, price: 1100.0, oldPrice: 14500 },
  { name: "David Beckham", image: David_becham_70066, price: 1278.0, oldPrice: 13000 },
  { name: "Dolce and Gabbana", image: Dolce_and_gabbana_5011, price: 1289.0, oldPrice: 15000 },
  { name: "Dolce & Gabbana Blue Pour Homme", image: Dolce_Gabbana_Blue_Pour_Homme_Gift_Set_of_3, price: 1459.0, oldPrice: 17700 },
  { name: "Dolce & Gabbana The Only One", image: Dolce_Gabbana_The_Only_One_Gift_Set_of_3, price: 1595.0, oldPrice: 18890 },
  { name: "Gucci_10318", image: Gucci_10318, price: 1400, oldPrice: 18000 },
  { name: "Marc Jacobs", image: Marc_jacobs_515, price: 1155, oldPrice: 15000 },
  { name: "My Burberry England", image: My_Burberry_England_Gift_Set_of_4, price: 1560, oldPrice: 190 },
  { name: "Tom Ford", image: Tom_ford_23533, price: 1780, oldPrice: 2210 },
  { name: "Tom Ford EDP Gift Set", image: Tom_Ford_EDP_Gift_Set_of_4, price: 2000, oldPrice: 240000 },
  { name: "Valentino Uomo Born in Roma", image: Valentino_Uomo_Born_in_Roma_EDT_Gift_Set_of_3, price: 1840, oldPrice: 22000 },
  { name: "212 VIP Black", image: VIP_BLACK, price: 1343.0, oldPrice: 16000 },
  { name: "212 Sexy Men Eau De Toilette", image: SEXY_MEN_EAU_DE_TOILETTE_1, price: 1400, oldPrice: 1800 },

  // 📂 Shoes & Trackpants
  { name: "Adapt Automax Full Black Shoes", image: Adapt_Automax_Full_Black_Shoes, price: 2500, oldPrice: 3000 },
  { name: "Adidas Copy 2", image: adida_Copy_2, price: 2789, oldPrice: 4500 },
  { name: "Adidas Beige Trackpant", image: Adidas_s_Beige_Classic_Embroidery_Logo_Premium_Trackpant_Copy, price: 1890, oldPrice: 4520 },
  { name: "Adidas Black Trackpant", image: Adidas_s_Black_Classic_Embroidery_Logo_Premium_Trackpant_Copy_2, price: 1795, oldPrice: 7830 },
  { name: "Adidas Black Embroidery Trackpant", image: Adidas_s_Black_Embroidery_Logo_Premium_Trackpant_Copy_2, price: 1800, oldPrice: 6235 },
  { name: "Adidas Dark Grey Trackpant", image: Adidas_s_Dark_Grey_Embroidery_Logo_Premium_Trackpant, price: 1295, oldPrice: 1300 },
  { name: "Adidas Light Grey Trackpant", image: Adidas_s_Light_Grey_Embroidery_Logo_Premium_Trackpant, price: 1190, oldPrice: 4120 },
  { name: "Adidas Olive Trackpant", image: Adidas_s_Olive_Embroidery_Logo_Premium_Trackpant, price: 1295, oldPrice: 5130 },
  { name: "Adidas Premium Logo Track Beige", image: Adidas_s_Premium_Logo_Designer_Track_Bege_312, price: 1110, oldPrice: 5150 },
  { name: "Adidas Red Tracksuit", image: Adidas_s_Red_Logo_Print_Premium_Imported_Tracksuit, price: 1430, oldPrice: 5170 },

  // 📂 Yeezy, Jordan, Airforce
  { name: "Yeezy Boost 350 V2 Carbon Beluga", image: Adidas_ss_Yeezy_Boost_350_V2_Carbon_Beluga_SEMI_UA_With_All_Accesories, price: 2580, oldPrice: 2600 },
  { name: "Yeezy Boost 350 V2 Bone White", image: Adidas_Yeezy_Boost_350_V2_Bone_White_SEMI_UA_With_All_Accesories_Copy_2, price: 2330, oldPrice: 3980 },
  { name: "Yeezy Boost 350 V2 Beluga", image: Adidas_Yeezy_Boost_350_V2_Beluga_SEMI_UA_With_All_Accesories, price: 2400, oldPrice: 2900 },
  { name: "Yeezy Boost 350 V2 Oreo", image: Adidas_Yeezy_Boost_350_V2_Oreo_SEMI_UA_With_All_Accesories_Copy_2, price: 2500, oldPrice: 3400 },
  { name: "Yeezy Slides Bone Ua", image: Adidas_Yeezy_Slides_Bone_Ua, price: 1200, oldPrice: 1600 },
  { name: "Yeezy Slides Flax Ua", image: Adidas_Yeezy_Slides_flax_Ua_Copy_2, price: 1389.00, oldPrice: 3170 },
  { name: "Foam Runner Onyx Ua", image: Aididas_Foam_Runner_Onyx_Ua_Copy_3, price: 2140, oldPrice: 2880 },
  { name: "Air Jordan Navy Blue Cord Set", image: Air_Jordan_Navy_Blue_Premium_Oversized_Cord_Set_Copy_3, price: 3200, oldPrice: 2250 },
  { name: "Air Max 1 Flip Flop Grey Green", image: air_max_1_flip_flop_grey_green_Copy_2, price: 1800, oldPrice: 1230 },
  { name: "Airforce 1 Milky White Leather", image: airforce_1_milky_white_pure_leather_Copy, price: 1150, oldPrice: 1990 },
  { name: "Alexander McQueen White Sneaker", image: ALEXANDER_MCQUEEN_PREMIUM_WHITE_SNEAKER, price: 2500, oldPrice: 2770 },
  { name: "Alexander McQueen Sneaker Copy", image: ALEXANDER_MCQUEEN_PREMIUM_WHITE_SNEAKER_Copy_2, price: 2000, oldPrice: 25000 },

  // 📂 Armani & Balmain & Birkenstock
  { name: "Armani Exchange Black Polo", image: Armani_i_Exchange_Premium_Imported_Polo_T_shirt_Cotton_Matty_Fabric_Black_2373_Copy, price: 1600, oldPrice: 2000 },
  { name: "Balmain Brown", image: Balmain_28015_brown_Copy, price: 1500, oldPrice: 3000 },
  { name: "Balmain Tiger Brown", image: Balmain_28015_tiger_brown, price: 1555, oldPrice: 7200 },
  { name: "Balmain Tiger Green", image: Balmain_28015_tiger_green, price: 1160, oldPrice: 8210 },
  { name: "BG11", image: BG11, price: 1640, oldPrice: 1980 },
  { name: "Birkenstock Black Grey Split", image: Birkenstock_Arizona_black_grey_split, price: 1200, oldPrice: 4130 },
  { name: "Birkenstock EVA Black", image: BIRKENSTOCK_ARIZONA_EVA_BLACK_Copy_2, price: 1210, oldPrice: 1445.0 },
  { name: "Birkenstock EVA Blue", image: BIRKENSTOCK_ARIZONA_EVA_BLUE, price: 1159.00, oldPrice: 1500 },
  { name: "Birkenstock EVA Grey", image: BIRKENSTOCK_ARIZONA_EVA_GREY, price: 1200, oldPrice: 1600 },
  { name: "Birkenstock Arizona Ivory Leather", image: Birkenstock_arizona_Ivory_Leather, price: 1300, oldPrice: 1700 },
  { name: "Birkenstock Leather Brown", image: Birkenstock_Arizona_Leather_Brown_Copy, price: 1250, oldPrice: 1600 },
  { name: "Birkenstock Leather Dark Navy", image: Birkenstock_Arizona_Leather_Dark_Navy, price: 1300, oldPrice: 1700 },
  { name: "Birkenstock Sky Blue Suede", image: Birkenstock_Arizona_Sky_Blue_Suede_Copy_2, price: 1350, oldPrice: 1750 },
  { name: "Birkenstock Sky Blue Suede Copy", image: Birkenstock_Arizona_Sky_Blue_Suede_Copy, price: 1400, oldPrice: 1800 },
  { name: "Birkenstock Suede", image: Birkenstock_Arizona_Suede, price: 1450, oldPrice: 3000 },
  { name: "Birkenstock Boston Dark Grey", image: Birkenstock_boston_Dark_Grey_Copy_2, price: 1500, oldPrice: 2700 },
  { name: "Birkenstock Boston Tan Suede", image: Birkenstock_boston_tan_Suede, price: 2155, oldPrice: 2710 },
  { name: "Birkenstock Brown Ramses", image: Birkenstock_brown_ramses_Copy_2, price: 1160, oldPrice: 2220 },
];
// ... all your imports

const priceIncrement = Number(process.env.REACT_APP_PRODUCT_PRICE);
const newArrivalsList = newArrivals.map((newArrival) => ({
  ...newArrival,
  price: newArrival.price + priceIncrement,
}));

const NewArrivals = () => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [popup, setPopup] = useState("");
  const [selectedSize, setSelectedSize] = useState("M");
  const [wishlist, setWishlist] = useState([]);

  // ✅ Confirmation modal state
  const [showConfirm, setShowConfirm] = useState(false);

  // Product click
  const handleClick = (product) => {
    setSelectedProduct(product);
    setQuantity(1);
  };

  const handleBack = () => setSelectedProduct(null);

  const incrementQty = () => setQuantity((prev) => prev + 1);
  const decrementQty = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleAddToCart = (product) => {
    const cartItem = {
      ...product,
      size: selectedSize,
      quantity: Number(quantity),
      image: product.image,
    };
    addToCart(cartItem);
    showPopup("Product added to Cart!");
  };

  const handleAddToWishlist = (product) => {
    setWishlist([...wishlist, product]);
    showPopup("Product added to Wishlist!");
  };

  // ✅ Buy Now → opens confirmation modal
  const handleBuyNow = () => {
    setShowConfirm(true);
  };

  // ✅ Confirm purchase → navigate
  const confirmPurchase = () => {
    setShowConfirm(false);
    navigate("/customer-details", {
      state: { product: { ...selectedProduct, size: selectedSize, quantity } },
    });
  };

  const showPopup = (message) => {
    setPopup(message);
    setTimeout(() => setPopup(""), 2000);
  };

  if (selectedProduct) {
    return (
      <div className="product-detail-page">
        {popup && <div className="popup">{popup}</div>}

        <button className="back-btn" onClick={handleBack}>
          ← Back
        </button>

        <div className="detail-content">
          <div className="detail-left">
            <img
              src={selectedProduct.image}
              alt={selectedProduct.name}
              className="detail-image"
            />
          </div>

          <div className="detail-right">
            <h2>{selectedProduct.name}</h2>
            <p className="price">
              ₹{selectedProduct.price}{" "}
              <span className="old-price">₹{selectedProduct.oldPrice}</span>
            </p>

            <div className="size-selector">
              <label>Size:</label>
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
              >
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
              </select>
            </div>

            <div className="quantity-selector">
              <label>Quantity:</label>
              <div className="quantity-box">
                <button onClick={decrementQty}>-</button>
                <input type="number" value={quantity} readOnly />
                <button onClick={incrementQty}>+</button>
              </div>
            </div>

            <div className="product-actions">
              <button
                className="btn-wishlist"
                onClick={() => handleAddToWishlist(selectedProduct)}
              >
                ♡ Wishlist
              </button>
              <button
                className="btn-cart"
                onClick={() => handleAddToCart(selectedProduct)}
              >
                Add to Cart
              </button>
              <button className="btn-buy" onClick={handleBuyNow}>
                Buy Now
              </button>
            </div>

            <ul className="product-features">
              <li>7 Days Return Policy</li>
              <li>Free Shipping Available</li>
              <li>100% Original Product</li>
              <li>Pay on Delivery Available</li>
              <li>Customer Support 24/7</li>
            </ul>
          </div>
        </div>

        {/* ✅ Confirmation Modal */}
        <CustomModal
          isOpen={showConfirm}
          onClose={() => setShowConfirm(false)}
          onConfirm={confirmPurchase}
          product={selectedProduct}
        />
      </div>
    );
  }

  return (
    <div className="new-arrivals">
      {popup && <div className="popup">{popup}</div>}
      <h2>New Arrivals</h2>
      <div className="products-grid">
        {newArrivalsList.map((item, index) => (
          <div
            className="product-card"
            key={index}
            onClick={() => handleClick(item)}
          >
            <img src={item.image} alt={item.name} />
            <h3>{item.name}</h3>
            <p className="old-price">₹{item.oldPrice}</p>
            <p className="price">₹{item.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewArrivals;
