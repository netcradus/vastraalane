import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../scss/_JeansPage.scss";
import { useCart } from "../context/CartContext";
import CustomModal from "../Sidebar/CustomModal";

// Images import
import AdidasBeige from "../assets/Adida s Beige Classic Embroidery Logo Premium Trackpant - Copy.png";
import AdidasBlack1 from "../assets/Adida s Black Classic Embroidery Logo Premium Trackpant - Copy (2).png";
import AdidasBlack2 from "../assets/Adida s Black Embroidery Logo Premium Trackpant - Copy (2).png";
import AdidasDarkGrey from "../assets/Adida s Dark Grey Embroidery Logo Premium Trackpant.png";
import AdidasLightGrey from "../assets/Adida s Light Grey Embroidery Logo Premium Trackpant.png";
import AdidasOlive from "../assets/Adida s Olive Embroidery Logo Premium Trackpant.png";
import AdidasPremium1 from "../assets/Adida s Premium Logo Designer Track Beige (312).png";
import AdidasPremium2 from "../assets/Adida s Premium Logo Designer Track Beige (3122).png";
import ArmaniBlack from "../assets/Arman i Exchange Black Logo Patch Imported Trackpant With Carry Bag.png";
import ArmaniGrey from "../assets/Arman i Exchange Grey Logo Patch Imported Trackpant With Carry Bagg - Copy (2).png";
import NikeBlack from "../assets/Nik e Black Embroidery Logo Premium Trackpant.png";
import ZaraBlack from "../assets/Zar a Black Stripes Premium Classic Linen Pant.png";
import ZaraCream from "../assets/Zar a Cream Stripes Premium Classic Linen Pant.png";
import ZaraGrey from "../assets/Zar a Grey Stripes Premium Classic Linen Pant.png";
// ✅ Import Images
import AmirGreenish from "../assets/Amir i Greenish 1 Embroidery Work Logo Imported Denim - Copy (2).png";
import AmirSkyBlue3 from "../assets/Amir i Sky Blue 2 Embroidery Logo Imported Denim - Copy (3).png";
import AmirSkyBlue from "../assets/Amir i Sky Blue 2 Embroidery Logo Imported Denim - Copy.png";
import AtomDarkBlue from "../assets/aTOMY-VS-JEANS-DARK-BLUE - Copy (3).png";
import LoeweDenim3 from "../assets/amLoewe Blue Embroidery Logo Imported Denim - Copy (3).png";
import LoeweDenim2 from "../assets/Loewe Blue Embroidery Logo Imported Denim - Copy.png";
import LoeweDenim1 from "../assets/Loewe Blue Embroidery Logo Imported Denim.png";
import TrueReligion1 from "../assets/True Religion Imported Blue Super Premium Denim With Brand Box Packing And Carry Bag F2881-BU.png";
import DGJeans1 from "../assets/D&G PREMIUM BLUE DENIM JEANS REGULAR FIT LENGHT 39.png";
import EmporioJeans1 from "../assets/EMPORIO ARMAN-I PREMIUM BLUE DENIM JEANS REGULAR FIT LENGHT 39.png";
import TommyHilfiger1 from "../assets/Tommy_Hilfiger Imported Black Super Premium Denim F2656-BL.png";
import GucciJeans1 from "../assets/GUCC-I PREMIUM BLUE DENIM JEANS STRAIGHT FIT LENGHT 41.png";
import DolceGabbana1 from "../assets/Dolce&Gabbana Blue Raw Wash Pocket Logo Imported Hyperflex Denim.png";
import TrueReligion2 from "../assets/True Religion Imported Sky Super Premium Denim With Brand Box Packing And Carry Bag F2692-SK.png";


const jeans = [
  { id: 1, name: "Adidas Beige Classic Embroidery Logo Premium Trackpant", image: AdidasBeige, currentPrice: 3200, oldPrice: 12500, discount: "74% off" },
  { id: 2, name: "Adidas Black Classic Embroidery Logo Premium Trackpant", image: AdidasBlack1, currentPrice: 3000, oldPrice: 11000, discount: "72% off" },
  { id: 3, name: "Adidas Black Embroidery Logo Premium Trackpant", image: AdidasBlack2, currentPrice: 2200, oldPrice: 10500, discount: "72% off" },
  { id: 4, name: "Adidas Dark Grey Embroidery Logo Premium Trackpant", image: AdidasDarkGrey, currentPrice: 1000, oldPrice: 1200, discount: "74% off" },
  { id: 5, name: "Adidas Light Grey Embroidery Logo Premium Trackpant", image: AdidasLightGrey, currentPrice: 2800, oldPrice: 9500, discount: "71% off" },
  { id: 6, name: "Adidas Olive Embroidery Logo Premium Trackpant", image: AdidasOlive, currentPrice: 3300, oldPrice: 1200, discount: "73% off" },
  { id: 7, name: "Adidas Premium Logo Designer Track Beige (312)", image: AdidasPremium1, currentPrice: 2600, oldPrice: 3000, discount: "72% off" },
  { id: 8, name: "Adidas Premium Logo Designer Track Beige (3122)", image: AdidasPremium2, currentPrice: 1400, oldPrice: 1500, discount: "72% off" },
  { id: 9, name: "Armani Exchange Black Logo Patch Imported Trackpant", image: ArmaniBlack, currentPrice: 3200, oldPrice: 15000, discount: "72% off" },
  { id: 10, name: "Armani Exchange Grey Logo Patch Imported Trackpant", image: ArmaniGrey, currentPrice: 4000, oldPrice: 14500, discount: "72% off" },
  { id: 11, name: "Nike Black Embroidery Logo Premium Trackpant", image: NikeBlack, currentPrice: 3700, oldPrice: 13000, discount: "72% off" },
  { id: 13, name: "Zara Black Stripes Premium Classic Linen Pant", image: ZaraBlack, currentPrice: 2500, oldPrice: 9000, discount: "72% off" },
  { id: 14, name: "Zara Cream Stripes Premium Classic Linen Pant", image: ZaraCream, currentPrice: 2600, oldPrice: 9200, discount: "72% off" },
  { id: 15, name: "Zara Grey Stripes Premium Classic Linen Pant", image: ZaraGrey, currentPrice: 2700, oldPrice: 9400, discount: "72% off" },
  { id: 16, name: "Amir i Greenish 1 Embroidery Work Logo Imported Denim", image: AmirGreenish, oldPrice: 2200, currentPrice: 1180 },
  { id: 17, name: "Amir i Sky Blue 2 Embroidery Logo Imported Denim", image: AmirSkyBlue3, oldPrice: 2110, currentPrice: 1170 },
  { id: 18, name: "Amir i Sky Blue 2 Embroidery Logo Imported Denim", image: AmirSkyBlue, oldPrice: 1210, currentPrice: 1009 },
  { id: 19, name: "aTOMY VS Jeans Dark Blue", image: AtomDarkBlue, oldPrice: 950, currentPrice: 1160 },
  { id: 20, name: "Loewe Blue Embroidery Logo Imported Denim", image: LoeweDenim3, oldPrice: 1230, currentPrice: 2185 },
  { id: 21, name: "Loewe Blue Embroidery Logo Imported Denim", image: LoeweDenim2, oldPrice: 1230, currentPrice: 4180 },
  { id: 22, name: "Loewe Blue Embroidery Logo Imported Denim", image: LoeweDenim1, oldPrice: 3230, currentPrice: 6178 },
  { id: 23, name: "True Religion Imported Blue Super Premium Denim With Brand Box Packing And Carry Bag F2881-BU", image: TrueReligion1, oldPrice: 1500, currentPrice: 1999, category: "Denim" },
  { id: 24, name: "D&G PREMIUM BLUE DENIM JEANS REGULAR FIT LENGHT 39", image: DGJeans1, oldPrice: 2999, currentPrice: 3999, category: "Denim" },
  { id: 25, name: "EMPORIO ARMAN-I PREMIUM BLUE DENIM JEANS REGULAR FIT LENGHT 39", image: EmporioJeans1, oldPrice: 1299, currentPrice: 1499, category: "Denim" },
  { id: 26, name: "Tommy_Hilfiger Imported Black Super Premium Denim F2656-BL", image: TommyHilfiger1, oldPrice: 1389, currentPrice: 1699, category: "Denim" },
  { id: 27, name: "GUCC-I PREMIUM BLUE DENIM JEANS STRAIGHT FIT LENGHT 41", image: GucciJeans1, oldPrice: 2999, currentPrice: 9999, category: "Denim" },
  { id: 28, name: "Dolce&Gabbana Blue Raw Wash Pocket Logo Imported Hyperflex Denim", image: DolceGabbana1, oldPrice: 999, currentPrice: 1099, category: "Denim" },
  { id: 29, name: "True Religion Imported Sky Super Premium Denim With Brand Box Packing And Carry Bag F2692-SK", image: TrueReligion2, oldPrice: 799, currentPrice: 999, category: "Denim" }
];

// ... your imports and jeans data remain the same ...

const priceIncrement = Number(process.env.REACT_APP_PRODUCT_PRICE);
const jeansList = jeans.map(jean => ({
  ...jean,
  price: jean.currentPrice + priceIncrement
}));

const JeansPage = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showConfirm, setShowConfirm] = useState(false);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleProductClick = (prod) => setSelectedProduct(prod);

  const handleAddToCart = (product) => {
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.currentPrice,
      quantity: Number(quantity),
      size: product.size || null,
      image: product.image,
    };
    console.log("Cart payload:", cartItem);
    addToCart(cartItem);
  };

  const handleBuyNow = (product) => {
    setSelectedProduct(product);
    setShowConfirm(true);
  };

  const confirmBuyNow = () => {
    setShowConfirm(false);
    navigate("/customer-details", { state: { product: selectedProduct, quantity } });
  };

  const relatedProducts = selectedProduct
    ? jeansList.filter((p) => p.id !== selectedProduct.id)
    : [];

  return (
    <div className="jeans-page">
      {!selectedProduct ? (
        <>
          <h2 className="page-title">Jeans, Trousers & Trackpants Collection</h2>
          <div className="jeans-grid">
            {jeansList.map((prod) => (
              <div
                key={prod.id}
                className="jeans-card"
                onClick={() => handleProductClick(prod)}
              >
                <div className="jeans-image">
                  <img src={prod.image} alt={prod.name} />
                </div>
                <h4>{prod.name}</h4>
                <p className="old-price">₹{prod.oldPrice}</p>
                <p className="current-price">₹{prod.currentPrice}</p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="jeans-details">
          <div className="details-container">
            <div className="details-image">
              <img src={selectedProduct.image} alt={selectedProduct.name} />
            </div>
            <div className="details-info">
              <h2>{selectedProduct.name}</h2>
              <p className="old-price">₹{selectedProduct.oldPrice}</p>
              <p className="current-price">₹{selectedProduct.currentPrice}</p>

              <div className="product-action-buttons">
                <button className="buy-btn" onClick={() => handleBuyNow(selectedProduct)}>Buy Now</button>
                <button className="btn-add-cart" onClick={() => handleAddToCart(selectedProduct)}>Add to Cart</button>
                <button className="wishlist-btn">Wishlist</button>
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
                    <p className="current-price">₹{p.currentPrice}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Buy Now Confirmation Modal */}
      <CustomModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={confirmBuyNow}
        product={selectedProduct}
      />
    </div>
  );
};

export default JeansPage;
