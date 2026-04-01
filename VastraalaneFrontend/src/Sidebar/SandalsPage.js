// SandalsPage.js
import React, { useState } from "react";
import "../scss/_SandalsPage.scss";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import CustomModal from "../Sidebar/CustomModal"; // ✅ same modal as perfume/tracksuits

// ✅ Import product images (keep your imports here...)
import AlexanderBeige from "../assets/Alexander_Mcqueen_Alex_Leather_For_Women_With_OG_Box_&_Carry_Bag_Beige_White_1892 copy.png";
import AlexanderBlack1 from "../assets/Alexander_Mcqueen_Alex_Leather_For_Women_With_OG_Box_&_Carry_Bag_Black_1892 - Copy (3).png";
import AlexanderBlack2 from "../assets/Alexander_Mcqueen_Alex_Leather_For_Women_With_OG_Box_&_Carry_Bag_Black_1892Copy.png";
import DiorBlack from "../assets/Christian_Dior_JAdior_Slingback_Black_Dior_Embroidery_Flat_With_OG_Box_Dust_Bag_&_Carry_Bag_5108_Black - Copy.png";
import DiorGrey from "../assets/Christian_Dior_JAdior_Slingback_Grey_Dior_Embroidery_Flat_With_OG_Box_Dust_Bag_&_Carry_Bag_5108_Grey - Copy.jpg";
import DiorPink from "../assets/Christian_Dior_JAdior_Slingback_Pink_Dior_Embroidery_Flat_With_OG_Box_Dust_Bag_&_Carry_Bag_5108_Pink.jpg";
import Louboutin1 from "../assets/Christian_Louboutin_Pencil_Heel_Glossy_Leather_Black_High_Quality_Heels_With_Dust_Bag_&_OG_Box_St-765 - Copy (2).png";
import Louboutin2 from "../assets/Christian_Louboutin_Pencil_Heel_Glossy_Leather_Black_High_Quality_Heels_With_Dust_Bag_&_OG_Box_St-765 - Copy.png";
import CoachDenim from "../assets/Coach_Collins_Espadrille_In_Signature_Denim_With_OG_Box_&_Carry_Bag_888-21_Denim - Copy.jpg";
import CoachBeige from "../assets/Coach_Samie_Mule_Beige_Loafers_For_Woman_With_OG_Box_&_Carry_Bag_886-28 - Copy.jpg";
import CoachBlack from "../assets/Coach_Samie_Mule_Black_Loafers_For_Woman_With_OG_Box_&_Carry_Bag_886-28 - Copy.jpg";
import DGBlack from "../assets/Dolce_&_Gabban_ DG_Polished_Calfskin_Slingback_Pumps_Black_933-DGG.png";
import DGLogo from "../assets/Dolce_&_Gabbana_D&G.jpg";
import GucciBlue from "../assets/Gucci_GG_Monogram_Canvas_Leather_Espadrilles_Blue_With_OG_Box_&_Carry_Bag_888-100_Blue - Copy.jpg";
import GucciPrincetown from "../assets/Gucci_princetown - Copy (2).jpg";
import GucciRed from "../assets/Gucci_Round_Interlocking_G_in_Rosso_Red_Leather_Shiny_Classic_Slides_With_OG_Box_&_Carry_Bag_1892 - Copy.jpg";
import HermesBlack from "../assets/Hermes Paris Oran Flats Croc Leather Black For Her With OG Box & Carry Bag Black Slide - Copy.jpg";
import HermesMaroon from "../assets/Hermes Paris Oran Flats Croc Leather White For Her With OG Box & Carry Bag Maroon Slideee.png";
import HermesWhite1 from "../assets/Hermes Paris Oran Flats Croc Leather White For Her With OG Box & Carry Bag White Slide - Copy (2).png";
import HermesWhite2 from "../assets/Hermes Paris Oran Flats Croc Leather White For Her With OG Box & Carry Bag White Slidee - Copy.png";
import HermesBrown from "../assets/Hermes Paris Oran Flats For Her With OG Box & Carry Bag Brown Slide H38 - Copy (2).png";
import HermesFuchsia from "../assets/Hermes Paris Oran Flats For Her With OG Box & Carry Bag Fuchsia Pink Slide H38-13 - Copy.png";
import HermesGreen from "../assets/Hermes Paris Oran Flats For Her With OG Box & Carry Bag Green Slide H38 - Copy (2).png";
import HermesPink from "../assets/Hermes Paris Oran Flats For Her With OG Box & Carry Bag Light Pink Slide H38-13.jpg";

// ✅ Product array
const sandalsProducts = [
  { id: 1, name: "Alexander Mcqueen Alex Leather Beige White", image: AlexanderBeige, oldPrice: "₹18,999", price: "₹1999", details: ["Premium leather material","Includes OG box & carry bag","Flat heel design","Durable sole","Authentic Alexander McQueen product"] },
  { id: 2, name: "Alexander Mcqueen Alex Leather Black 1", image: AlexanderBlack1, oldPrice: "₹2200", price: "₹1999", details: ["Elegant black leather","Includes OG box & carry bag","Flat heel","Comfortable fit","Limited edition"] },
  { id: 3, name: "Alexander Mcqueen Alex Leather Black 2", image: AlexanderBlack2, oldPrice: "₹4000", price: "₹1999", details: ["High-quality black leather","Includes OG box","Flat heel design","Soft inner lining","Limited edition"] },
  { id: 4, name: "Christian Dior JAdior Slingback Black", image: DiorBlack, oldPrice: "₹3499", price: "₹1999",  details: ["Iconic Dior embroidery","Includes OG box & dust bag","Flat slingback design","Premium comfort","Authentic Dior product"] },
  { id: 5, name: "Christian Dior JAdior Slingback Grey", image: DiorGrey, oldPrice: "₹3999", price: "₹1899",  details: ["Elegant grey embroidery","Includes OG box & dust bag","Flat slingback","Soft leather","High quality"] },
  { id: 6, name: "Christian Dior JAdior Slingback Pink", image: DiorPink, oldPrice: "₹4999", price: "₹1795",  details: ["Feminine pink tone","Includes OG box & dust bag","Flat slingback","Comfortable fit","Premium Dior quality"] },
  { id: 7, name: "Christian Louboutin Pencil Heel Black 1", image: Louboutin1, oldPrice: "₹7895", price: "₹1700", details: ["Glossy leather finish","Includes OG box & dust bag","High heel","Elegant design","Authentic Louboutin"] },
  { id: 8, name: "Christian Louboutin Pencil Heel Black 2", image: Louboutin2, oldPrice: "₹1200", price: "₹999.00",  details: ["Stylish black leather","Includes OG box & dust bag","High heel","Comfortable fit","Classic Louboutin design"] },
  { id: 9, name: "Coach Collins Espadrille Denim", image: CoachDenim, oldPrice: "₹21400", price: "₹1999",  details: ["Denim canvas upper","OG box included","Comfortable espadrille","Durable sole","Classic Coach signature"] },
  { id: 10, name: "Coach Samie Mule Beige", image: CoachBeige, oldPrice: "₹14,009", price: "₹1199",  details: ["Soft beige leather","Includes OG box & carry bag","Mule style","Comfortable footbed","Authentic Coach product"] },
  { id: 11, name: "Coach Samie Mule Black", image: CoachBlack, oldPrice: "₹1600.9", price: "₹1999",  details: ["Elegant black leather","Includes OG box & carry bag","Mule design","Comfortable fit","Authentic Coach product"] },
  { id: 12, name: "Dolce & Gabbana DG Polished Calfskin Slingback Black", image: DGBlack, oldPrice: "₹2600.0", price: "₹2189.00",  details: ["Premium calfskin leather","Includes OG box","Flat slingback","Durable sole","Authentic D&G"] },
  { id: 13, name: "Dolce & Gabbana DG Logo", image: DGLogo, oldPrice: "₹2199", price: "₹1699",  details: ["Signature D&G logo","Premium leather","Includes OG box & carry bag","Flat design","High-quality craftsmanship"] },
  { id: 14, name: "Gucci GG Monogram Canvas Leather Espadrilles Blue", image: GucciBlue, oldPrice: "₹2570", price: "₹1599.00",  details: ["Monogram canvas","Includes OG box & carry bag","Flat espadrille","Soft leather lining","Authentic Gucci"] },
  { id: 15, name: "Gucci Princetown", image: GucciPrincetown, oldPrice: "₹18,999", price: "₹1199",  details: ["Classic loafer style","Leather upper","Includes OG box & dust bag","Comfortable fit","Premium Gucci craftsmanship"] },
  { id: 16, name: "Gucci Round Interlocking G Rosso Red", image: GucciRed, oldPrice: "₹18,99", price: "₹1239",  details: ["Signature interlocking G","Bright red leather","Includes OG box & carry bag","Comfortable slides","Authentic Gucci"] },
  { id: 17, name: "Hermes Oran Flats Black", image: HermesBlack, oldPrice: "₹29999", price: "₹1800",  details: ["Premium croc leather","Includes OG box & carry bag","Slide-on design","Comfortable fit","Authentic Hermes"] },
  { id: 18, name: "Hermes Oran Flats Maroon", image: HermesMaroon, oldPrice: "₹29999", price: "₹2500",  details: ["Premium leather","Includes OG box & carry bag","Slide-on flats","Comfortable fit","High-quality Hermes"] },
  { id: 19, name: "Hermes Oran Flats White 1", image: HermesWhite1, oldPrice: "₹8999", price: "₹2089",  details: ["Crisp white leather","Includes OG box & carry bag","Slide-on design","Durable sole","Authentic Hermes"] },
  { id: 20, name: "Hermes Oran Flats White 2", image: HermesWhite2, oldPrice: "₹1999", price: "₹1899",  details: ["Soft white leather","OG box & carry bag included","Slide-on flats","Comfortable fit","Premium Hermes product"] },
  { id: 21, name: "Hermes Oran Flats Brown", image: HermesBrown, oldPrice: "₹2999", price: "₹1999",  details: ["Rich brown leather","Includes OG box & carry bag","Slide-on design","Durable sole","Authentic Hermes"] },
  { id: 22, name: "Hermes Oran Flats Fuchsia Pink", image: HermesFuchsia, oldPrice: "₹1999", price: "₹1,999",  details: ["Vibrant fuchsia leather","Includes OG box & carry bag","Slide-on flats","Comfortable fit","Premium Hermes"] },
  { id: 23, name: "Hermes Oran Flats Green", image: HermesGreen, oldPrice: "₹2999", price: "₹1799", details: ["Elegant green leather","OG box & carry bag included","Slide-on flats","Comfortable fit","High-quality Hermes"] },
  { id: 24, name: "Hermes Oran Flats Light Pink", image: HermesPink, oldPrice: "₹2,999", price: "₹1599",  details: ["Soft pink leather","Includes OG box & carry bag","Slide-on design","Comfortable fit","Authentic Hermes"] }
];


const priceIncrement = Number(process.env.REACT_APP_PRODUCT_PRICE);
const sandalsProductsList = sandalsProducts.map(sandalsProduct => {
  const numericPrice = Number(sandalsProduct.price.replace(/[₹,]/g, ""));
  const updatedPrice = numericPrice + priceIncrement;
  return {
    ...sandalsProduct,
    price: `₹${updatedPrice.toLocaleString("en-IN")}`
  };
});

const SandalsPage = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const { addToCart, addToWishlist, wishlist } = useCart();
  const navigate = useNavigate();

  // ✅ Price cleaner
  const getNumericPrice = (priceStr) => {
    if (!priceStr) return 0;
    return Number(priceStr.toString().replace(/[^0-9.]/g, ""));
  };

  // ✅ Related products filter
  const getRelatedProducts = (currentId) => {
    return sandalsProductsList.filter((p) => p.id !== currentId).slice(0, 4);
  };

  // ✅ Buy Now button
  const handleBuyNow = () => {
    if (!selectedSize) {
      alert("⚠️ Please select a size before buying!");
      return;
    }
    setShowConfirm(true);
  };

  // ✅ Confirm purchase → navigate to customer details
  const confirmPurchase = () => {
    setShowConfirm(false);
    navigate("/customer-details", {
      state: {
        product: {
          ...selectedProduct,
          price: getNumericPrice(selectedProduct.price),
          quantity: 1,
          size: selectedSize,
        },
      },
    });
  };

  if (selectedProduct) {
    const related = getRelatedProducts(selectedProduct.id);

    return (
      <div className="sandals-details">
        <div className="details-container">
          {/* Left: Image */}
          <div className="image-section">
            <img src={selectedProduct.image} alt={selectedProduct.name} />
          </div>

          {/* Right: Info */}
          <div className="info-section">
            <h2>{selectedProduct.name}</h2>
            <p>
              <span className="old-price">{selectedProduct.oldPrice}</span>{" "}
              <span className="price">{selectedProduct.price}</span>
            </p>

            {/* ✅ Sizes */}
            <h3>Select Size:</h3>
            <div className="sizes">
              {[36, 37, 38, 39, 40].map((size) => (
                <button
                  key={size}
                  className={`size-btn ${
                    selectedSize === size ? "active" : ""
                  }`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>

            {/* ✅ Product details */}
            <div className="product-details-box">
              <h3>Product Details</h3>
              <ul>
                {selectedProduct.details.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            </div>

            {/* ✅ Action buttons */}
            <div className="buttons">
              <button onClick={handleBuyNow}>Buy Now</button>

              <button
                onClick={() =>
                  addToCart({
                    id: selectedProduct.id,
                    name: selectedProduct.name,
                    price: getNumericPrice(selectedProduct.price),
                    quantity: 1,
                    image: selectedProduct.image,
                    size: selectedSize || "N/A",
                  })
                }
              >
                Add to Cart
              </button>

              <button onClick={() => addToWishlist(selectedProduct)}>
                {wishlist.some((w) => w.id === selectedProduct.id)
                  ? "Remove from Wishlist"
                  : "Wishlist"}
              </button>
            </div>
          </div>
        </div>

        {/* ✅ Related products */}
        <div className="related-products">
          <h3>Related Products</h3>
          <div className="related-grid">
            {related.map((product) => (
              <div
                key={product.id}
                className="related-card"
                onClick={() => {
                  setSelectedProduct(product);
                  setSelectedSize(null); // reset size
                }}
              >
                <img src={product.image} alt={product.name} />
                <h4>{product.name}</h4>
                <p>
                  <span className="old-price">{product.oldPrice}</span>{" "}
                  <span className="price">{product.price}</span>
                </p>
              </div>
            ))}
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
    <div className="sandals-page">
      <h2 className="page-title">Girls Sandals Collection</h2>
      <div className="products-grid">
        {sandalsProductsList.map((product) => (
          <div
            key={product.id}
            className="product-card"
            onClick={() => setSelectedProduct(product)}
          >
            <img src={product.image} alt={product.name} />
            <h4>{product.name}</h4>
            <p>
              <span className="old-price">{product.oldPrice}</span>{" "}
              <span className="price">{product.price}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SandalsPage;
