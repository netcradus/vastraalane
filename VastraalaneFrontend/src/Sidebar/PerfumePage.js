import React, { useState } from "react";
import "../scss/_PerfumePage.scss";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import CustomModal from "../Sidebar/CustomModal"; // ✅ same modal as tracksuits
import ProductGallery from "../components/ProductGallery";

// 🔽 Import all perfume images
import AcquaDiGio from "../assets/_ACQUA_DI_GIO_GIORGIO_ARMAN_white.png";
import CalvinKlein from "../assets/_Calvin_Klein_Gift_Set_4.png";
import DolceBlue from "../assets/_Dolce_Gabbana_Blue_Pour_Homme_Gift_Set_of_3.png";
import DolceTheOnlyOne from "../assets/_Dolce_Gabbana_The__Only_One_Gift_Set_of_3.png";
import MyBurberry from "../assets/_My_Burberry_England_Gift_Set_of_4.png";
import TomFord from "../assets/_Tom_Ford_EDP_Gift_Set_of_4.png";
import Valentino from "../assets/_Valentino_Uomo_Born_in_Roma_EDT_Gift_Set_of_3.png";
import VipBlack from "../assets/212 VIP BLACKk.png";
import VipSexy from "../assets/212_SEXY_MEN_EAU_DE_TOILETTE_1.png";
import AcquaPerfume from "../assets/ACQUA_DI_GIO_GIOR perfume - Copy (3).jpg";
import ArmanBecause from "../assets/ARMAN_I because its YOU - Copy (3).png";
import ArmanLove from "../assets/ARMAN-I IN LOVE WITH - Copy (2).png";
import AzzaroElixir from "../assets/AZZARO FOREVER WANTED ELIXIR - Copy (2).png";
import AzzaroSilver from "../assets/AZZARO WANTED EDP SILVER - Copy (3).png";
import AzzaroTonic from "../assets/AZZARO WANTED TONIC EDT - Copy (3).png";
import AzzaroWanted from "../assets/AZZARO_WANTED BY PERFUME - Copy (2).jpg";
import Bvlgari from "../assets/Bvlgari Omnia Gift set of 3.png";
import CalvinPerfume from "../assets/CALVIN PERFUME.jpg";
import CalvinEdt from "../assets/CALVIN_KLAIN_EDTT - Copy.png";
import Chloe from "../assets/Chloe Eau De Parfum Gift Set Of 4.png";
import GoodGirl from "../assets/COROLINA HERRERA GOOD GIRL ITS SO GOOD TO BE BAD - Copy.png";
import Darcy from "../assets/Darcy perfumes de marly paris - Copy.png";
import Denver from "../assets/DENVER78.jpg";
import DiorAddict from "../assets/DIOR_ADDICT_EAU_FRAICHE - Copy.png";
import Engage from "../assets/ENGAGE78 - Copy.jpg";
import GioArman from "../assets/GIO_GIORGIO_ARMAN.jpg";
import GiorgioSi from "../assets/Giorgio si - Copy.png";
import Givenchy from "../assets/Givenchy Irresistible Gift Set of 3 - Copy (2).png";
import Invictus from "../assets/INVICTUS INTENSE - Copy.png";
import MaisonMargiela from "../assets/Maison Margiela Paris Replica Gift Set of 4.png";
import MyBurberryEDP from "../assets/MY_BURBERRY_EAU_DE_PURFUME - Copy.png";
import Narciso from "../assets/NARCISO RODRIGIGUEZ FOR HER EDT.png";
import Paco from "../assets/Paco Rabanne 1 Million Gift Set of 3.png";
import Twilly from "../assets/TWILLY dHermes.png";
import VersaceEros from "../assets/Versace eros gift set of 4.png";
import VictoriaSecret from "../assets/Victoria Secret EDP Gift Set of 4.png";
import YslRed from "../assets/YSL BLACL OPIUM OVER RED.png";
import YslLibre from "../assets/YSL LIBRE EDP Intense.png";
import YslOpium from "../assets/YSL_BLACK_OPIUM_EAU_DE_PARFUME.jpg";
import YslParis from "../assets/YSL_MON PARIS-EDP.png";

// ✅ Perfume products array with old price & discount
const perfumes = [
  { id: 1, name: "Luxury Perfume – Aqua White Edition", price: "₹2498", oldPrice: "₹5000", discount: "10% off", image: AcquaDiGio },
  { id: 2, name: "Premium Gift Set – Classic Collection", price: "₹2599", oldPrice: "₹4500", discount: "11% off", image: CalvinKlein },
  { id: 3, name: "Luxury Gift Set – Blue Homme Edition", price: "₹2499", oldPrice: "₹5500", discount: "9% off", image: DolceBlue },
  { id: 4, name: "Luxury Gift Set – Elegant Edition", price: "₹2500", oldPrice: "₹5200", discount: "8% off", image: DolceTheOnlyOne },
  { id: 5, name: "Premium Gift Set – Classic England", price: "₹4200", oldPrice: "₹5800", discount: "10% off", image: MyBurberry },
  { id: 6, name: "Luxury Gift Set – Signature Collection", price: "₹2599", oldPrice: "₹9000", discount: "11% off", image: TomFord },
  { id: 7, name: "Premium Gift Set – Roma Edition", price: "₹2499", oldPrice: "₹6000", discount: "8% off", image: Valentino },

  { id: 8, name: "Signature Perfume – VIP Black Edition", price: "₹1500", oldPrice: "₹4000", discount: "13% off", image: VipBlack },
  { id: 9, name: "Signature Perfume – Sexy Night Edition", price: "₹2499", oldPrice: "₹4200", discount: "12% off", image: VipSexy },

  { id: 10, name: "Luxury Perfume – Aqua Classic", price: "₹2499", oldPrice: "₹4800", discount: "10% off", image: AcquaPerfume },
  { id: 11, name: "Premium Perfume – Because You Edition", price: "₹1000", oldPrice: "₹4500", discount: "9% off", image: ArmanBecause },
  { id: 12, name: "Premium Perfume – Love Essence", price: "₹2599", oldPrice: "₹4600", discount: "9% off", image: ArmanLove },

  { id: 13, name: "Luxury Perfume – Elixir Edition", price: "₹2689", oldPrice: "₹5000", discount: "8% off", image: AzzaroElixir },
  { id: 14, name: "Luxury Perfume – Silver Edition", price: "₹2900", oldPrice: "₹4400", discount: "9% off", image: AzzaroSilver },
  { id: 15, name: "Luxury Perfume – Tonic Edition", price: "₹2500", oldPrice: "₹4300", discount: "9% off", image: AzzaroTonic },
  { id: 16, name: "Luxury Perfume – Wanted Edition", price: "₹2499", oldPrice: "₹5200", discount: "10% off", image: AzzaroWanted },

  { id: 17, name: "Premium Gift Set – Omnia Collection", price: "₹2800", oldPrice: "₹6500", discount: "8% off", image: Bvlgari },
  { id: 18, name: "Premium Perfume – Classic Edition", price: "₹3000", oldPrice: "₹3400", discount: "12% off", image: CalvinPerfume },
  { id: 19, name: "Premium Perfume – EDT Edition", price: "₹1200", oldPrice: "₹3600", discount: "11% off", image: CalvinEdt },

  { id: 20, name: "Luxury Gift Set – Floral Collection", price: "₹2500", oldPrice: "₹7000", discount: "7% off", image: Chloe },
  { id: 21, name: "Luxury Perfume – Good Girl Edition", price: "₹1700", oldPrice: "₹6000", discount: "5% off", image: GoodGirl },
  { id: 22, name: "Luxury Perfume – Darcy Signature", price: "₹5300", oldPrice: "₹1800", discount: "8% off", image: Darcy },

  { id: 23, name: "Daily Perfume – Classic 78", price: "₹800", oldPrice: "₹1000", discount: "20% off", image: Denver },
  { id: 24, name: "Luxury Perfume – Fresh Edition", price: "₹3500", oldPrice: "₹8000", discount: "6% off", image: DiorAddict },
  { id: 25, name: "Daily Perfume – Engage Edition", price: "₹500", oldPrice: "₹700", discount: "28% off", image: Engage },

  { id: 26, name: "Luxury Perfume – Gio Classic", price: "₹2900", oldPrice: "₹5200", discount: "6% off", image: GioArman },
  { id: 27, name: "Luxury Perfume – SI Edition", price: "₹2499", oldPrice: "₹5500", discount: "7% off", image: GiorgioSi },

  { id: 28, name: "Luxury Gift Set – Irresistible Collection", price: "₹2450", oldPrice: "₹6800", discount: "6% off", image: Givenchy },
  { id: 29, name: "Luxury Perfume – Intense Edition", price: "₹2000", oldPrice: "₹2500", discount: "8% off", image: Invictus },

  { id: 30, name: "Luxury Gift Set – Replica Collection", price: "₹3000", oldPrice: "₹7500", discount: "7% off", image: MaisonMargiela },
  { id: 31, name: "Premium Perfume – Classic Eau De Parfum", price: "₹2600", oldPrice: "₹6000", discount: "7% off", image: MyBurberryEDP },

  { id: 32, name: "Luxury Perfume – For Her Edition", price: "₹2500", oldPrice: "₹5800", discount: "7% off", image: Narciso },
  { id: 33, name: "Luxury Gift Set – Million Collection", price: "₹3900", oldPrice: "₹7000", discount: "7% off", image: Paco },

  { id: 34, name: "Luxury Perfume – Twilly Edition", price: "₹6000", oldPrice: "₹3000", discount: "7% off", image: Twilly },
  { id: 35, name: "Luxury Gift Set – Eros Collection", price: "₹2590", oldPrice: "₹7200", discount: "6% off", image: VersaceEros },
  { id: 36, name: "Premium Gift Set – Secret Collection", price: "₹2500", oldPrice: "₹6200", discount: "6% off", image: VictoriaSecret },

  { id: 37, name: "Luxury Perfume – Red Edition", price: "₹2300", oldPrice: "₹7800", discount: "6% off", image: YslRed },
  { id: 38, name: "Luxury Perfume – Libre Intense", price: "₹2200", oldPrice: "₹7700", discount: "6% off", image: YslLibre },
  { id: 39, name: "Luxury Perfume – Black Opium Style", price: "₹1000", oldPrice: "₹7500", discount: "6% off", image: YslOpium },
  { id: 40, name: "Luxury Perfume – Paris Edition", price: "₹2400", oldPrice: "₹7900", discount: "6% off", image: YslParis },
];

const priceIncrement = Number(process.env.REACT_APP_PRODUCT_PRICE);
const perfumeList = perfumes.map(perfume => {
  const numericPrice = Number(perfume.price.replace(/[₹,]/g, ""));
  const updatedPrice = numericPrice + priceIncrement;
  return {
    ...perfume,
    price: `₹${updatedPrice.toLocaleString("en-IN")}`
  };
});

const PerfumePage = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { addToCart, addToWishlist, wishlist } = useCart();
  const navigate = useNavigate();

  const [showConfirm, setShowConfirm] = useState(false);

  const handleProductClick = (prod) => setSelectedProduct(prod);

  // ✅ Related products logic
  const relatedProducts = selectedProduct
    ? perfumeList.filter((p) => p.id !== selectedProduct.id)
    : [];

  // ✅ helper to clean price
  const getNumericPrice = (priceStr) => {
    if (!priceStr) return 0;
    return Number(priceStr.toString().replace(/[^0-9.]/g, "")); 
  };

  // ✅ Buy Now opens modal
  const handleBuyNow = () => {
    if (!selectedProduct) return;
    setShowConfirm(true);
  };

  // ✅ Confirm purchase navigates
  const confirmPurchase = () => {
    setShowConfirm(false);
    navigate("/customer-details", {
      state: { 
        product: { 
          ...selectedProduct, 
          price: getNumericPrice(selectedProduct.price), 
          quantity: 1 
        } 
      },
    });
  };

  return (
    <div className="perfume-page">
      {!selectedProduct ? (
        <>
          <h2 className="page-title">Perfume Collection</h2>
          <div className="perfume-grid">
            {perfumeList.map((prod) => (
              <div
                key={prod.id}
                className="perfume-card"
                onClick={() => handleProductClick(prod)}
              >
                <div className="perfume-image">
                  <img src={prod.image} alt={prod.name} />
                </div>
                <h4>{prod.name}</h4>
                <p className="old-price">{prod.oldPrice}</p>
                <p className="current-price">{prod.price}</p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="perfume-details">
          <div className="details-container">
            <div className="details-image">
              <ProductGallery product={selectedProduct} />
            </div>
            <div className="details-info">
              <h2>{selectedProduct.name}</h2>
              <p className="old-price">{selectedProduct.oldPrice}</p>
              <p className="current-price">{selectedProduct.price}</p>

              {/* ✅ Buttons with working logic */}
              <div className="product-action-buttons">
                <button className="buy-btn" onClick={handleBuyNow}>
                  Buy Now
                </button>
                <button
                  className="cart-btn"
                  onClick={() =>
                    addToCart({
                      id: selectedProduct.id,
                      name: selectedProduct.name,
                      price: getNumericPrice(selectedProduct.price),
                      quantity: 1,
                      image: selectedProduct.image,
                    })
                  }
                >
                  Add to Cart
                </button>
                <button
                  className="wishlist-btn"
                  onClick={() => addToWishlist(selectedProduct)}
                >
                  {wishlist.some((w) => w.id === selectedProduct.id)
                    ? "Remove from Wishlist"
                    : "Wishlist"}
                </button>
              </div>

              <div className="policy-box">
                <h3>Why Shop With Us?</h3>
                <ul>
                  <li>✔ 7 Days Easy Exchange Policy</li>
                  <li>✔ Free Shipping on All Orders</li>
                  <li>✔ Good Quality Material</li>
                  <li>✔ Secure Online Payments</li>
                  <li>✔ 24/7 Customer Support</li>
                </ul>
              </div>
            </div>
          </div>

          {/* ✅ Related Products */}
          {relatedProducts.length > 0 && (
            <>
              <h3>Related Products</h3>
              <div className="related-grid">
                {relatedProducts.map((p) => (
                  <div
                    key={p.id}
                    className="related-card"
                    onClick={() => handleProductClick(p)}
                  >
                    <img src={p.image} alt={p.name} />
                    <h4>{p.name}</h4>
                    <p className="current-price">{p.price}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* ✅ Confirmation Modal */}
      <CustomModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={confirmPurchase}
        product={selectedProduct}
      />
    </div>
  );
};

export default PerfumePage;
