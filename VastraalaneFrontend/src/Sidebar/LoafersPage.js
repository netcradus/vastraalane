import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import CustomModal from "../Sidebar/CustomModal";
import "../scss/_LoafersPage.scss";

// ✅ Loafers images import
import Loafers1 from "../assets/Loro piana loaferrs.png";
import Loafers2 from "../assets/Loro piana loafers - Copy.png";
import Loafers3 from "../assets/Loro Piana Loafers 19051 Brown - Copy.jpg";
import Loafers4 from "../assets/Loro piana loafers.jpg";
import Loafers5 from "../assets/Loro piana loafers.png";
import Loafers6 from "../assets/Loro piana loafers1.png";
import Loafers7 from "../assets/Loro piana loafers2.png";
import Loafers8 from "../assets/Loro piana loafers3.png";
import Loafers9 from "../assets/Loro piana loafers4.jpg";
import Loafers10 from "../assets/Loro piana loaferss.jpg";
import Loafers11 from "../assets/Loro piana loafersss.jpg";
import Loafers12 from "../assets/Loro Piana_loafers.jpg";
import Loafers13 from "../assets/Loro Piano Loafers 19051 Beige - Copy.png";
import Loafers14 from "../assets/Loro Piano Loafers 19051 Blue - Copy.png";
import Loafers15 from "../assets/Loro Piano Loafers 19051 Green.png";
import Loafers16 from "../assets/Loro Piano Loafers 19051 Greyy - Copy.png";
import Loafers17 from "../assets/Loro Piano Loafers 19051 Greyy.png";
import Loafers18 from "../assets/Loro Piano Loafers 19051 Navy - Copy.png";
import Loafers19 from "../assets/LoroO piana loafers.png";

const loafers = [
  { id: 1, name: "Loro Piana Loafers 1", currentPrice: 3999, oldPrice: 30000, discount: "17% off", image: Loafers1 },
  { id: 2, name: "Loro Piana Loafers 2", currentPrice: 3999, oldPrice: 32000, discount: "19% off", image: Loafers2 },
  { id: 3, name: "Loro Piana Loafers 3", currentPrice: 3999, oldPrice: 33000, discount: "15% off", image: Loafers3 },
  { id: 4, name: "Loro Piana Loafers 4", currentPrice: 2900, oldPrice: 34000, discount: "14% off", image: Loafers4 },
  { id: 5, name: "Loro Piana Loafers 5", currentPrice: 2900, oldPrice: 31000, discount: "13% off", image: Loafers5 },
  { id: 6, name: "Loro Piana Loafers 6", currentPrice: 2550, oldPrice: 30500, discount: "16% off", image: Loafers6 },
  { id: 7, name: "Loro Piana Loafers 7", currentPrice: 2600, oldPrice: 32500, discount: "15% off", image: Loafers7 },
  { id: 8, name: "Loro Piana Loafers 8", currentPrice: 2800, oldPrice: 33500, discount: "15% off", image: Loafers8 },
  { id: 9, name: "Loro Piana Loafers 9", currentPrice: 2900, oldPrice: 34500, discount: "14% off", image: Loafers9 },
  { id: 10, name: "Loro Piana Loafers 10", currentPrice: 3000, oldPrice: 35000, discount: "14% off", image: Loafers10 },
  { id: 11, name: "Loro Piana Loafers 11", currentPrice: 3100, oldPrice: 36000, discount: "14% off", image: Loafers11 },
  { id: 12, name: "Loro Piana Loafers 12", currentPrice: 3200, oldPrice: 37000, discount: "14% off", image: Loafers12 },
  { id: 13, name: "Loro Piana Loafers 13", currentPrice: 3300, oldPrice: 38000, discount: "14% off", image: Loafers13 },
  { id: 14, name: "Loro Piana Loafers 14", currentPrice: 3400, oldPrice: 39000, discount: "14% off", image: Loafers14 },
  { id: 15, name: "Loro Piana Loafers 15", currentPrice: 3500, oldPrice: 40000, discount: "14% off", image: Loafers15 },
  { id: 16, name: "Loro Piana Loafers 16", currentPrice: 3600, oldPrice: 41000, discount: "14% off", image: Loafers16 },
  { id: 17, name: "Loro Piana Loafers 17", currentPrice: 2999, oldPrice: 42000, discount: "14% off", image: Loafers17 },
  { id: 18, name: "Loro Piana Loafers 18", currentPrice: 2999, oldPrice: 43000, discount: "14% off", image: Loafers18 },
  { id: 19, name: "Loro Piana Loafers 19", currentPrice: 3100, oldPrice: 44000, discount: "14% off", image: Loafers19 },
];

const priceIncrement = Number(process.env.REACT_APP_PRODUCT_PRICE);
const loafersList = loafers.map(loafer => ({
  ...loafer,
  price: loafer.currentPrice + priceIncrement
}));

const LoafersPage = () => {
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
    ? loafersList.filter((p) => p.id !== selectedProduct.id)
    : [];

  return (
    <div className="loafers-page">
      {!selectedProduct ? (
        <>
          <h2 className="page-title">Loafers Collection</h2>
          <div className="products-grid">
            {loafersList.map((prod) => (
              <div key={prod.id} className="product-card" onClick={() => handleProductClick(prod)}>
                <div className="product-image">
                  <img src={prod.image} alt={prod.name} />
                </div>
                <div className="product-info">
                  <h4>{prod.name}</h4>
                  <p className="old-price">₹{prod.oldPrice}</p>
                  <p className="current-price">₹{prod.currentPrice}</p>
                  <p className="discount">{prod.discount}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="product-details-page">
          <div className="main-product">
            <img src={selectedProduct.image} alt={selectedProduct.name} />
            <div className="product-details-info">
              <h2>{selectedProduct.name}</h2>
              <p className="old-price">₹{selectedProduct.oldPrice}</p>
              <p className="current-price">₹{selectedProduct.currentPrice}</p>
              <p className="discount">{selectedProduct.discount}</p>

              <div className="details-box">
                <h3>Product Details</h3>
                <ul>
                  <li>Available Sizes: 6, 7, 8, 9, 10</li>
                  <li>Premium Italian Leather – Smooth & Durable</li>
                  <li>7 Days Easy Exchange Policy</li>
                  <li>Free Shipping Across India</li>
                  <li>Comfortable Sole with Perfect Grip</li>
                  <li>Handcrafted Stitching & Fine Finish</li>
                  {/* <li>Warranty: 6 Months against manufacturing defects</li> */}
                  <li>Style: Casual & Formal Combination</li>
                </ul>
                <p className="description">
                  These luxurious Loro Piana loafers are handcrafted for ultimate comfort and style.
                  Perfect for any formal or casual outing, combining timeless design with modern comfort.
                </p>

                <div className="action-buttons">
                  <button className="buy-now" onClick={() => handleBuyNow(selectedProduct)}>Buy Now</button>
                  <button className="add-to-cart" onClick={() => handleAddToCart(selectedProduct)}>
                    Add to Cart
                  </button>
                  {/* <button className="wishlist">Add to Wishlist</button> */}
                </div>
              </div>
            </div>
          </div>

          {relatedProducts.length > 0 && (
            <>
              <h3>Related Products</h3>
              <div className="related-products-grid">
                {relatedProducts.map((p) => (
                  <div key={p.id} className="related-product-card" onClick={() => handleProductClick(p)}>
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

export default LoafersPage;
