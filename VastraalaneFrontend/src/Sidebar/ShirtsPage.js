// sidebar/ShirtsPage.js
import React, { useState } from "react";
import "../scss/_ShirtsPage.scss";
import { useCart } from "../context/CartContext";
import CustomModal from "../Sidebar/CustomModal"; // ✅ Import confirmation modal

// 🔽 Images import
import VersaceBlue from "../assets/Versace Couture Petrol Blue Back Print Imported Polo T-Shirtt.png";
import VersaceOlive from "../assets/Versace Couture Olive Back Print Imported Pol0o T-Shirt.png";
import Tshirt2 from "../assets/tshirt2.jpg";
import Tshirt1 from "../assets/tshirt.jpg";
import TommyTeal from "../assets/Tommy_Hilfiger Teal Polo.jpg";
import TommyOffwhite from "../assets/Tommy_Hilfiger Off-white.jpg";
import TommyNavy from "../assets/Tommy_Hilfiger Navy Polo.jpg";
import TommyWhite from "../assets/Tommy Hilfige r Premium 220gsm Interlock Cotton Lycra Round Neck Tshirt White 2081.jpg";
import TommyBlack from "../assets/Tommy Hilfige r Black Premium Polo Tshirt With 240 Gsm Interlock Cotton Lycra Fabric With Collar Design Sleeve Logo 2569.png";
import RalphPink from "../assets/Ralph_Lauren Polo Pink Oxford Lycra Embroidery Logo Premium Shirt F2757-PI - Copy.png";
import RalphMustard from "../assets/Ralph_Lauren Polo Mustard Oxford Lycra Embroidery Logo Premium Shirt F2757-MU.png";
import RalphBlack from "../assets/Ralph_Lauren Polo Black Oxford Lycra Embroidery Logo Premium Shirt F2757-BL.png";
import RalphWine from "../assets/Ralph Lauren Cotton Wine Premium Shirt.png";
import RalphWhite from "../assets/Ralph Lauren Cotton White Premium Shirt.png";
import RalphMilange from "../assets/Ralph Lauren Cotton Milange Premium Shirt.png";
import RalphCottonBlack from "../assets/Ralph Lauren Cotton Black Premium Shirt.png";
import LacosteWhite1 from "../assets/Lacost e White Premium Cotton Lycra Pique fabric Polo Tshirt with Sleeves 2836.png";
import LacosteWhite2 from "../assets/Lacost e White Premium Cotton Lycra Pique fabric Polo Tshirt with Shoulder Strip Design and Embroidered Logo 2843.png";
import LacosteSky from "../assets/Lacost e Sky Premium Polo T shirt With 240 gsm interlock cotton lycra fabric and Collar Design with Embroidered Logo 2551 - Copy (2).jpg";
import LacosteOffwhite from "../assets/Lacost e Offwhite Premium Cotton Lycra Pique fabric Polo Tshirt with Front Printed Design and Embroidered Logo Zip Style 2841.jpg";
import LacosteNavy from "../assets/Lacost e Navy Premium Cotton Lycra Pique fabric Polo Tshirt with Collar Design and Embroidered Logo Pocket Style 2840 - Copy (2).png";
import LacosteMaroon from "../assets/Lacost e Maroon Premium Polo T shirt With 240 gsm interlock cotton lycra fabric and Collar Design with Embroidered Logo 2555.png";
import LacosteBlack from "../assets/Lacost e Black Premium Cotton Lycra Pique fabric Polo Tshirt with Sleeves Design and Embroidered Logo 2838 - Copy.png";
import LacosteBeige from "../assets/Lacost e Beige Premium Cotton Lycra Pique fabric Polo Tshirt with Collar Design and Embroidered Logo Pocket Style 2839 - Copy (2).png";
import GucciWhite from "../assets/Gucc i White Premium Round Neck Printed T-shirt F2666-WH1.png";
import GucciWhiteShirt from "../assets/Gucc i Monogram Premium White Shirt With Brand Box Packing and carry bag F2718-WH - Copy.jpg";
import GucciBlackShirt1 from "../assets/Gucc i Monogram Premium Black Shirt With Brand Box_Packing and carry bag F2718-BL - Copy (2).png";
import GucciBlackTshirt from "../assets/Gucc i Black Premium Round Neck Printed T-shirt F2666-BL2.png";
import GucciBeigeTshirt from "../assets/Gucc i Beige Premium Round Neck Printed T-shirt F2666-BE2.png";
import DolceWhite from "../assets/Dolce&Gabbana White Reflective Logo Shirt With Premium Box Packing.png";
import DolceBlack1 from "../assets/Dolce&Gabbana Black Reflective Logo Shirt With Premium Box Packing - Copy.png";
import DiorWhite from "../assets/Christian Dio r White Premium Imported Japanese Fabric Printed Tracksuit with Brand Box and Carry Bag 2639 - Copy.png";

// 🔽 Products array
const tshirts = [
  { id: 1, name: "Versace Couture Petrol Blue Back Print Imported Polo T-Shirt", price: "₹1740", oldPrice: "₹3,000", discount: "17% off", image: VersaceBlue },
  { id: 2, name: "Versace Couture Olive Back Print Imported Polo T-Shirt", price: "₹1800", oldPrice: "₹3,200", discount: "19% off", image: VersaceOlive },
  { id: 3, name: "Tommy Hilfiger T-Shirt 2", price: "₹1180", oldPrice: "₹1,500", discount: "20% off", image: Tshirt2 },
  { id: 4, name: "Tommy Hilfiger T-Shirt 1", price: "₹1,300", oldPrice: "₹1,600", discount: "19% off", image: Tshirt1 },
  { id: 5, name: "Tommy Hilfiger Teal Polo", price: "₹2700", oldPrice: "₹3,500", discount: "14% off", image: TommyTeal },
  { id: 6, name: "Tommy Hilfiger Off-white", price: "₹1799.00", oldPrice: "₹3,600", discount: "14% off", image: TommyOffwhite },
  { id: 7, name: "Tommy Hilfiger Navy Polo", price: "₹1799.0", oldPrice: "₹3,700", discount: "14% off", image: TommyNavy },
  { id: 8, name: "Tommy Hilfiger Premium White", price: "₹1740.00", oldPrice: "₹3,200", discount: "13% off", image: TommyWhite },
  { id: 9, name: "Tommy Hilfiger Premium Black", price: "₹1895.0", oldPrice: "₹3,300", discount: "12% off", image: TommyBlack },
  { id: 10, name: "Ralph Lauren Polo Pink Shirt", price: "₹1289.0", oldPrice: "₹4,000", discount: "15% off", image: RalphPink },
  { id: 11, name: "Ralph Lauren Polo Mustard Shirt", price: "₹1450", oldPrice: "₹4,100", discount: "16% off", image: RalphMustard },
  { id: 12, name: "Ralph Lauren Polo Black Shirt", price: "₹1500", oldPrice: "₹4,200", discount: "17% off", image: RalphBlack },
  { id: 13, name: "Ralph Lauren Cotton Wine Shirt", price: "₹1650", oldPrice: "₹4,300", discount: "17% off", image: RalphWine },
  { id: 14, name: "Ralph Lauren Cotton White Shirt", price: "₹3,600", oldPrice: "₹4,350", discount: "17% off", image: RalphWhite },
  { id: 15, name: "Ralph Lauren Cotton Milange Shirt", price: "₹2,650", oldPrice: "₹4,400", discount: "17% off", image: RalphMilange },
  { id: 16, name: "Ralph Lauren Cotton Black Shirt", price: "₹1,700", oldPrice: "₹4,450", discount: "17% off", image: RalphCottonBlack },
  { id: 17, name: "Lacoste White Premium Polo", price: "₹2,300", oldPrice: "₹4,000", discount: "18% off", image: LacosteWhite1 },
  { id: 18, name: "Lacoste White Shoulder Strip Polo", price: "₹1,350", oldPrice: "₹4,050", discount: "17% off", image: LacosteWhite2 },
  { id: 19, name: "Lacoste Sky Premium Polo", price: "₹1,400", oldPrice: "₹4,100", discount: "17% off", image: LacosteSky },
  { id: 20, name: "Lacoste Offwhite Premium Polo", price: "₹1,450", oldPrice: "₹4,150", discount: "17% off", image: LacosteOffwhite },
  { id: 21, name: "Lacoste Navy Premium Polo", price: "₹1789.00", oldPrice: "₹4,200", discount: "17% off", image: LacosteNavy },
  { id: 22, name: "Lacoste Maroon Premium Polo", price: "₹1789.0", oldPrice: "₹4,250", discount: "17% off", image: LacosteMaroon },
  { id: 23, name: "Lacoste Black Premium Polo", price: "₹1599.0", oldPrice: "₹4,300", discount: "17% off", image: LacosteBlack },
  { id: 24, name: "Lacoste Beige Premium Polo", price: "₹1999.0", oldPrice: "₹4,350", discount: "16% off", image: LacosteBeige },
  { id: 25, name: "Gucci White Premium T-Shirt", price: "₹1479.0", oldPrice: "₹4,600", discount: "13% off", image: GucciWhite },
  { id: 26, name: "Gucci Monogram White Shirt", price: "₹1899.0", oldPrice: "₹4,800", discount: "12% off", image: GucciWhiteShirt },
  { id: 27, name: "Gucci Monogram Black Shirt", price: "₹1489.0", oldPrice: "₹4,900", discount: "13% off", image: GucciBlackShirt1 },
  { id: 28, name: "Gucci Black Premium T-Shirt", price: "₹1589.0", oldPrice: "₹5,000", discount: "13% off", image: GucciBlackTshirt },
  { id: 29, name: "Gucci Beige Premium T-Shirt", price: "₹1499.0", oldPrice: "₹5,050", discount: "13% off", image: GucciBeigeTshirt },
  { id: 30, name: "Dolce & Gabbana White Premium Shirt", price: "₹1799.00", oldPrice: "₹5,200", discount: "13% off", image: DolceWhite },
  { id: 31, name: "Dolce & Gabbana Black Premium Shirt", price: "₹1150", oldPrice: "₹5,250", discount: "13% off", image: DolceBlack1 },
  { id: 32, name: "Christian Dior White Premium Shirt", price: "₹1700", oldPrice: "₹5,400", discount: "13% off", image: DiorWhite },
];
const priceIncrement = Number(process.env.REACT_APP_PRODUCT_PRICE);
const tshirtsList = tshirts.map((tshirt) => {
  const numericPrice = Number(tshirt.price.replace(/[₹,]/g, ""));
  const updatedPrice = numericPrice + priceIncrement;
  return {
    ...tshirt,
    price: `₹${updatedPrice.toLocaleString("en-IN")}`,
  };
});

const ShirtsPage = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false); // ✅ For Buy Now confirm modal
  const [showCustomerForm, setShowCustomerForm] = useState(false); // ✅ For customer details form

  // ✅ Cart & Wishlist from Context
  const { addToCart, addToWishlist, wishlist } = useCart();

  const handleProductClick = (prod) => {
    setSelectedProduct(prod);
  };

  // ✅ clean price helper (₹1999 -> 1999)
  const getNumericPrice = (priceStr) => {
    if (!priceStr) return 0;
    return Number(priceStr.toString().replace(/[^0-9.]/g, ""));
  };

  const handleBuyNow = () => {
    setShowConfirm(true);
  };

  const confirmBuyNow = () => {
    setShowConfirm(false);
    setShowCustomerForm(true);
  };

  const relatedProducts = selectedProduct
    ? tshirtsList.filter((p) => p.id !== selectedProduct.id)
    : [];

  return (
    <div className="category-page">
      <main className="products-section">
        {!selectedProduct ? (
          <>
            <h2 className="page-title">Shirts & T-Shirts Collection</h2>
            <div className="products-grid">
              {tshirtsList.map((prod) => (
                <div
                  key={prod.id}
                  className="product-card"
                  onClick={() => handleProductClick(prod)}
                >
                  <div className="product-image">
                    <img src={prod.image} alt={prod.name} />
                  </div>
                  <div className="product-info">
                    <h4>{prod.name}</h4>
                    <p className="old-price">{prod.oldPrice}</p>
                    <p className="current-price">{prod.price}</p>
                    <p className="discount">{prod.discount}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="product-details-page">
            {/* 🔹 Main Product Section */}
            <div className="main-product">
              <img src={selectedProduct.image} alt={selectedProduct.name} />
              <h2>{selectedProduct.name}</h2>
              <p className="old-price">{selectedProduct.oldPrice}</p>
              <p className="current-price">{selectedProduct.price}</p>
              <p className="discount">{selectedProduct.discount}</p>

              {/* 🔹 Action Buttons with logic */}
              <div className="action-buttons">
                <button className="buy-now" onClick={handleBuyNow}>
                  Buy Now
                </button>

                <button
                  className="add-cart"
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
                  className="wishlist"
                  onClick={() => addToWishlist(selectedProduct)}
                >
                  {wishlist.some((w) => w.id === selectedProduct.id)
                    ? "Remove from Wishlist"
                    : "Wishlist"}
                </button>
              </div>

              {/* 🔹 Product Features Points */}
              <ul className="product-points">
                <li>✅ 7 Days Return Policy</li>
                <li>✅ Premium Quality Fabric</li>
                <li>✅ 100% Original Product</li>
                <li>✅ Fast & Safe Delivery</li>
                <li>✅ Secure Payment Guarantee</li>
              </ul>
            </div>

            {/* 🔹 Related Products Section */}
            {relatedProducts.length > 0 && (
              <>
                <h3>Related Products</h3>
                <div className="related-products-grid">
                  {relatedProducts.map((p) => (
                    <div
                      key={p.id}
                      className="related-product-card"
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
      </main>

      {/* ✅ Confirmation Modal */}
      {showConfirm && (
        <CustomModal
          message={`Do you want to buy "${selectedProduct?.name}" now?`}
          onConfirm={confirmBuyNow}
          onCancel={() => setShowConfirm(false)}
        />
      )}

      {/* ✅ Customer Details Form */}
      {showCustomerForm && (
        <div className="customer-details-form">
          <h3>Enter Your Details</h3>
          <form>
            <input type="text" placeholder="Full Name" required />
            <input type="text" placeholder="Mobile Number" required />
            <input type="text" placeholder="Address" required />
            <button type="submit">Confirm Order</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ShirtsPage;
