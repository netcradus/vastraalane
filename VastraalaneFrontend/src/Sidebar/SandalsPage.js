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
  {
    id: 1,
    name: "Premium Sandals – Beige White Leather",
    image: AlexanderBeige,
    oldPrice: "₹18999",
    price: "₹1999",
    details: [
      "Premium leather material",
      "Includes box & carry bag",
      "Flat heel design",
      "Durable sole",
      "High-quality finish"
    ]
  },
  {
    id: 2,
    name: "Premium Sandals – Black Leather 1",
    image: AlexanderBlack1,
    oldPrice: "₹2200",
    price: "₹1999",
    details: [
      "Elegant black leather",
      "Includes box & carry bag",
      "Flat heel",
      "Comfortable fit",
      "Limited edition"
    ]
  },
  {
    id: 3,
    name: "Premium Sandals – Black Leather 2",
    image: AlexanderBlack2,
    oldPrice: "₹4000",
    price: "₹1999",
    details: [
      "High-quality black leather",
      "Includes box",
      "Flat heel design",
      "Soft inner lining",
      "Limited edition"
    ]
  },
  {
    id: 4,
    name: "Luxury Slingback – Black Edition",
    image: DiorBlack,
    oldPrice: "₹3499",
    price: "₹1999",
    details: [
      "Premium embroidery",
      "Includes box & dust bag",
      "Flat slingback design",
      "Premium comfort",
      "Elegant finish"
    ]
  },
  {
    id: 5,
    name: "Luxury Slingback – Grey Edition",
    image: DiorGrey,
    oldPrice: "₹3999",
    price: "₹1899",
    details: [
      "Elegant grey finish",
      "Includes box & dust bag",
      "Flat slingback",
      "Soft leather",
      "High quality"
    ]
  },
  {
    id: 6,
    name: "Luxury Slingback – Pink Edition",
    image: DiorPink,
    oldPrice: "₹4999",
    price: "₹1795",
    details: [
      "Feminine pink tone",
      "Includes box & dust bag",
      "Flat slingback",
      "Comfortable fit",
      "Premium quality"
    ]
  },
  {
    id: 7,
    name: "Luxury Heels – Black Pencil 1",
    image: Louboutin1,
    oldPrice: "₹7895",
    price: "₹1700",
    details: [
      "Glossy leather finish",
      "Includes box & dust bag",
      "High heel",
      "Elegant design",
      "Premium build"
    ]
  },
  {
    id: 8,
    name: "Luxury Heels – Black Pencil 2",
    image: Louboutin2,
    oldPrice: "₹1200",
    price: "₹999",
    details: [
      "Stylish black leather",
      "Includes box & dust bag",
      "High heel",
      "Comfortable fit",
      "Classic design"
    ]
  },
  {
    id: 9,
    name: "Premium Espadrille – Denim Edition",
    image: CoachDenim,
    oldPrice: "₹21400",
    price: "₹1999",
    details: [
      "Denim canvas upper",
      "Box included",
      "Comfortable espadrille",
      "Durable sole",
      "Classic finish"
    ]
  },
  {
    id: 10,
    name: "Premium Mule – Beige Edition",
    image: CoachBeige,
    oldPrice: "₹14009",
    price: "₹1199",
    details: [
      "Soft beige leather",
      "Includes box & carry bag",
      "Mule style",
      "Comfortable footbed",
      "Premium quality"
    ]
  },
  {
    id: 11,
    name: "Premium Mule – Black Edition",
    image: CoachBlack,
    oldPrice: "₹1600",
    price: "₹1999",
    details: [
      "Elegant black leather",
      "Includes box & carry bag",
      "Mule design",
      "Comfortable fit",
      "Premium finish"
    ]
  },
  {
    id: 12,
    name: "Luxury Slingback – Calfskin Black",
    image: DGBlack,
    oldPrice: "₹2600",
    price: "₹2189",
    details: [
      "Premium calfskin leather",
      "Includes box",
      "Flat slingback",
      "Durable sole",
      "High craftsmanship"
    ]
  },
  {
    id: 13,
    name: "Premium Sandals – Logo Edition",
    image: DGLogo,
    oldPrice: "₹2199",
    price: "₹1699",
    details: [
      "Signature design",
      "Premium leather",
      "Includes box & carry bag",
      "Flat design",
      "High-quality craftsmanship"
    ]
  },
  {
    id: 14,
    name: "Premium Espadrille – Blue Canvas",
    image: GucciBlue,
    oldPrice: "₹2570",
    price: "₹1599",
    details: [
      "Canvas upper",
      "Includes box & carry bag",
      "Flat espadrille",
      "Soft lining",
      "Premium finish"
    ]
  },
  {
    id: 15,
    name: "Luxury Loafer – Classic Style",
    image: GucciPrincetown,
    oldPrice: "₹18999",
    price: "₹1199",
    details: [
      "Classic loafer style",
      "Leather upper",
      "Includes box & dust bag",
      "Comfortable fit",
      "Premium craftsmanship"
    ]
  },
  {
    id: 16,
    name: "Premium Slides – Red Edition",
    image: GucciRed,
    oldPrice: "₹1899",
    price: "₹1239",
    details: [
      "Signature design",
      "Bright red finish",
      "Includes box & carry bag",
      "Comfortable slides",
      "Premium quality"
    ]
  },
  {
    id: 17,
    name: "Luxury Flats – Black Edition",
    image: HermesBlack,
    oldPrice: "₹29999",
    price: "₹1800",
    details: [
      "Premium leather",
      "Includes box & carry bag",
      "Slide-on design",
      "Comfortable fit",
      "High-quality finish"
    ]
  },
  {
    id: 18,
    name: "Luxury Flats – Maroon Edition",
    image: HermesMaroon,
    oldPrice: "₹29999",
    price: "₹2500",
    details: [
      "Premium leather",
      "Includes box & carry bag",
      "Slide-on flats",
      "Comfortable fit",
      "High quality"
    ]
  },
  {
    id: 19,
    name: "Luxury Flats – White Edition 1",
    image: HermesWhite1,
    oldPrice: "₹8999",
    price: "₹2089",
    details: [
      "Crisp white leather",
      "Includes box & carry bag",
      "Slide-on design",
      "Durable sole",
      "Premium finish"
    ]
  },
  {
    id: 20,
    name: "Luxury Flats – White Edition 2",
    image: HermesWhite2,
    oldPrice: "₹1999",
    price: "₹1899",
    details: [
      "Soft white leather",
      "Box & carry bag included",
      "Slide-on flats",
      "Comfortable fit",
      "Premium quality"
    ]
  },
  {
    id: 21,
    name: "Luxury Flats – Brown Edition",
    image: HermesBrown,
    oldPrice: "₹2999",
    price: "₹1999",
    details: [
      "Rich brown leather",
      "Includes box & carry bag",
      "Slide-on design",
      "Durable sole",
      "Premium finish"
    ]
  },
  {
    id: 22,
    name: "Luxury Flats – Fuchsia Pink",
    image: HermesFuchsia,
    oldPrice: "₹1999",
    price: "₹1999",
    details: [
      "Vibrant pink finish",
      "Includes box & carry bag",
      "Slide-on flats",
      "Comfortable fit",
      "Premium quality"
    ]
  },
  {
    id: 23,
    name: "Luxury Flats – Green Edition",
    image: HermesGreen,
    oldPrice: "₹2999",
    price: "₹1799",
    details: [
      "Elegant green leather",
      "Box & carry bag included",
      "Slide-on flats",
      "Comfortable fit",
      "High quality"
    ]
  },
  {
    id: 24,
    name: "Luxury Flats – Light Pink Edition",
    image: HermesPink,
    oldPrice: "₹2999",
    price: "₹1599",
    details: [
      "Soft pink leather",
      "Includes box & carry bag",
      "Slide-on design",
      "Comfortable fit",
      "Premium finish"
    ]
  }
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
