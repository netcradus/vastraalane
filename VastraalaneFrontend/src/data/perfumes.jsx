import React, { useState } from "react";
import "../scss/_perfume.scss";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import CustomModal from "../Sidebar/CustomModal"; // ✅ Import modal
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
  { id: 1, name: "_ACQUA_DI_GIO_GIORGIO_ARMAN_white", price: "₹2900", oldPrice: "₹5,000", discount: "10% off", image: AcquaDiGio },
  { id: 2, name: "_Calvin_Klein_Gift_Set_4", price: "₹2000", oldPrice: "₹4,500", discount: "11% off", image: CalvinKlein },
  { id: 3, name: "_Dolce_Gabbana_Blue_Pour_Homme_Gift_Set_of_3", price: "₹1900", oldPrice: "₹5,500", discount: "9% off", image: DolceBlue },
  { id: 4, name: "_Dolce_Gabbana_The__Only_One_Gift_Set_of_3", price: "₹1890", oldPrice: "₹5,200", discount: "8% off", image: DolceTheOnlyOne },
  { id: 5, name: "_My_Burberry_England_Gift_Set_of_4", price: "₹1567.0", oldPrice: "₹5,800", discount: "10% off", image: MyBurberry },
  { id: 6, name: "_Tom_Ford_EDP_Gift_Set_of_4", price: "₹2499.0", oldPrice: "₹9,000", discount: "11% off", image: TomFord },
  { id: 7, name: "_Valentino_Uomo_Born_in_Roma_EDT_Gift_Set_of_3", price: "₹2,500", oldPrice: "₹6,000", discount: "8% off", image: Valentino },
  { id: 8, name: "212 VIP BLACKk", price: "₹2,500", oldPrice: "₹4,000", discount: "13% off", image: VipBlack },
  { id: 9, name: "212_SEXY_MEN_EAU_DE_TOILETTE_1", price: "₹2,700", oldPrice: "₹4,200", discount: "12% off", image: VipSexy },
  { id: 10, name: "ACQUA_DI_GIO_GIOR perfume ", price: "₹2,300", oldPrice: "₹4,800", discount: "10% off", image: AcquaPerfume },
  { id: 11, name: "ARMAN_I because its YOU ", price: "₹2,100", oldPrice: "₹4,500", discount: "9% off", image: ArmanBecause },
  { id: 12, name: "ARMAN-I IN LOVE WITH ", price: "₹1,200", oldPrice: "₹4,600", discount: "9% off", image: ArmanLove },
  { id: 13, name: "AZZARO FOREVER WANTED ELIXIR ", price: "₹1,600", oldPrice: "₹5,000", discount: "8% off", image: AzzaroElixir },
  { id: 14, name: "AZZARO WANTED EDP SILVER ", price: "₹1,000", oldPrice: "₹4,400", discount: "9% off", image: AzzaroSilver },
  { id: 15, name: "AZZARO WANTED TONIC EDT ", price: "₹1,900", oldPrice: "₹4,300", discount: "9% off", image: AzzaroTonic },
  { id: 16, name: "AZZARO_WANTED BY PERFUME ", price: "₹1,700", oldPrice: "₹5,200", discount: "10% off", image: AzzaroWanted },
  { id: 17, name: "Bvlgari Omnia Gift set of 3", price: "₹1,000", oldPrice: "₹6,500", discount: "8% off", image: Bvlgari },
  { id: 18, name: "CALVIN PERFUME", price: "₹1200", oldPrice: "₹3,400", discount: "12% off", image: CalvinPerfume },
  { id: 19, name: "CALVIN_KLAIN_EDTT ", price: "₹1579.00", oldPrice: "₹3,600", discount: "11% off", image: CalvinEdt },
  { id: 20, name: "Chloe Eau De Parfum Gift Set Of 4", price: "₹1200.0", oldPrice: "₹7,000", discount: "7% off", image: Chloe },
  { id: 21, name: "COROLINA HERRERA GOOD GIRL ITS SO GOOD TO BE BAD ", price: "₹1500.00", oldPrice: "₹6,000", discount: "5% off", image: GoodGirl },
  { id: 22, name: "Darcy perfumes de marly paris ", price: "₹1300", oldPrice: "₹5,800", discount: "8% off", image: Darcy },
  { id: 23, name: "DENVER78", price: "₹800", oldPrice: "₹2,000", discount: "20% off", image: Denver },
  { id: 24, name: "DIOR_ADDICT_EAU_FRAICHE ", price: "₹1579.0", oldPrice: "₹8,000", discount: "6% off", image: DiorAddict },
  { id: 25, name: "ENGAGE78 ", price: "₹500", oldPrice: "₹789.0", discount: "28% off", image: Engage },
  { id: 26, name: "GIO_GIORGIO_ARMAN", price: "₹1900", oldPrice: "₹5,200", discount: "6% off", image: GioArman },
  { id: 27, name: "Giorgio si", price: "₹1100", oldPrice: "₹5,500", discount: "7% off", image: GiorgioSi },
  { id: 28, name: "Givenchy Irresistible Gift Set of 3 ", price: "₹1400", oldPrice: "₹6,800", discount: "6% off", image: Givenchy },
  { id: 29, name: "INVICTUS INTENSE ", price: "₹1600", oldPrice: "₹5,000", discount: "8% off", image: Invictus },
  { id: 30, name: "Maison Margiela Paris Replica Gift Set of 4", price: "₹1260.00", oldPrice: "₹7,500", discount: "7% off", image: MaisonMargiela },
  { id: 31, name: "MY_BURBERRY_EAU_DE_PURFUME ", price: "₹2,000", oldPrice: "₹5000", discount: "7% off", image: MyBurberryEDP },
  { id: 32, name: "NARCISO RODRIGIGUEZ FOR HER EDT", price: "₹2,400", oldPrice: "₹5,800", discount: "7% off", image: Narciso },
  { id: 33, name: "Paco Rabanne 1 Million Gift Set of 3", price: "₹2,500", oldPrice: "₹7,000", discount: "7% off", image: Paco },
  { id: 34, name: "TWILLY dHermes", price: "₹6,000", oldPrice: "₹2,500", discount: "7% off", image: Twilly },
  { id: 35, name: "Versace eros gift set of 4", price: "₹3,800", oldPrice: "₹7,200", discount: "6% off", image: VersaceEros },
  { id: 36, name: "Victoria Secret EDP Gift Set of 4", price: "₹3,800", oldPrice: "₹6,200", discount: "6% off", image: VictoriaSecret },
  { id: 37, name: "YSL BLACL OPIUM OVER RED", price: "₹1,300", oldPrice: "₹7,800", discount: "6% off", image: YslRed },
  { id: 38, name: "YSL LIBRE EDP Intense", price: "₹1,200", oldPrice: "₹7,700", discount: "6% off", image: YslLibre },
  { id: 39, name: "YSL_BLACK_OPIUM_EAU_DE_PARFUME", price: "₹1,000", oldPrice: "₹7,500", discount: "6% off", image: YslOpium },
  { id: 40, name: "YSL_MON PARIS-EDP", price: "₹1,400", oldPrice: "₹7,900", discount: "6% off", image: YslParis },
];

const priceIncrement = Number(process.env.REACT_APP_PRODUCT_PRICE);
const perfumesList = perfumes.map((perfume) => {
  const numericPrice = Number(perfume.price.replace(/[₹,]/g, ""));
  const updatedPrice = numericPrice + priceIncrement;

  return {
    ...perfume,
    price: `₹${updatedPrice.toLocaleString("en-IN")}`,
  };
});

const Perfumes = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { addToCart } = useCart();
  const [popup, setPopup] = useState("");
  const [showConfirm, setShowConfirm] = useState(false); // ✅ Confirmation modal
  const navigate = useNavigate();

  const showPopup = (message) => {
    setPopup(message);
    setTimeout(() => setPopup(""), 2000);
  };

  const handleAddToCart = (product) => {
    const payload = {
      id: product.id,
      name: product.name,
      price: parseFloat(product.price.replace("₹", "").replace(",", "")),
      quantity: 1,
      image: product.image,
    };

    addToCart(payload);
    showPopup(`${product.name} added to cart!`);
  };

  const handleBuyNow = () => {
    setShowConfirm(true); // ✅ Show modal
  };

  const confirmPurchase = () => {
    setShowConfirm(false);
    navigate("/customer-details", { state: { product: selectedProduct } });
  };

  return (
    <div className="perfumes-container">
      <h2 className="section-title">Luxury Perfumes Collection</h2>

      {!selectedProduct ? (
        <div className="perfumes-grid">
          {perfumesList.map((item) => (
            <div
              key={item.id}
              className="perfumes-card"
              onClick={() => setSelectedProduct(item)}
            >
              <img src={item.image} alt={item.name} className="perfumes-image" />
              <h3 className="perfumes-name">{item.name}</h3>
              <p className="perfumes-price">{item.price}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="product-detail">
          <img
            src={selectedProduct.image}
            alt={selectedProduct.name}
            className="detail-image"
          />

          <div className="detail-info">
            <div className="info-left">
              <h2>{selectedProduct.name}</h2>
              <p className="perfumes-price">
                {selectedProduct.price}{" "}
                <span className="old-price">{selectedProduct.oldPrice}</span>
              </p>
              <p className="discount">{selectedProduct.discount}</p>
            </div>

            <div className="info-right">
              <button
                className="btn-cart"
                onClick={() => handleAddToCart(selectedProduct)}
              >
                Add to Cart
              </button>
              <button className="btn-wishlist">Wishlist</button>
              <button className="btn-buy" onClick={handleBuyNow}>
                Buy Now
              </button>
            </div>

            <div className="extra-info">
              <p>✔ Pay on delivery available</p>
              <p>✔ Easy 15 days exchange available</p>
              <p>✔ 100% Original Products</p>
            </div>

            <div className="product-specs">
              <div className="specs-left">
                <h3>Product Details</h3>
                <ul>
                  <li>This set contains:</li>
                  <li>One Eau de Toilette</li>
                  <li>One Shower Gel</li>
                </ul>
              </div>

              <div className="specs-right">
                <h3>Specifications</h3>
                <ul>
                  <li>
                    <strong>Formulation:</strong> Spray
                  </li>
                  <li>
                    <strong>Fragrance:</strong> Fresh
                  </li>
                  <li>
                    <strong>Strength:</strong> Medium
                  </li>
                  <li>
                    <strong>Sustainable:</strong> Regular
                  </li>
                  <li>
                    <strong>Type:</strong> Eau de Toilette
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedProduct && (
        <div className="related-products">
          <h3>Related Products</h3>
          <div className="related-grid">
            {perfumesList
              .filter((item) => item.id !== selectedProduct.id)
              .slice(0, 8)
              .map((item) => (
                <div
                  key={item.id}
                  className="related-card"
                  onClick={() => setSelectedProduct(item)}
                >
                  <img src={item.image} alt={item.name} />
                  <h4>{item.name}</h4>
                  <p className="price">
                    {item.price}{" "}
                    <span className="old-price">{item.oldPrice}</span>
                  </p>
                </div>
              ))}
          </div>
        </div>
      )}

      {popup && <div className="popup">{popup}</div>}

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

export default Perfumes;
