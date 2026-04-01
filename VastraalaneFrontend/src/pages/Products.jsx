import React, { useState } from "react";
import "../scss/_products.scss";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import CustomModal from "../Sidebar/CustomModal"; 

// ✅ Import images
import MichaelTote45 from "../assets/Michael_kors eliza small tote with carry bag 45.png";
import MichaelTote456 from "../assets/Michael_kors eliza small tote with carry bag 546.png";
import COAC_H201 from "../assets/COAC_H sling bag with folding box 201.png";
import COAC_H200 from "../assets/COAC_H sling bag with folding box 200.png";
import COAC_H198 from "../assets/COAC_H sling bag with folding box 198.png";
import BossIce0618 from "../assets/Boss ice 0618.png";
import Prada21GreyBlue from "../assets/prada_21_grey_blue.png";
import GucciWhiteTshirt from "../assets/Gucc i White Premium Round Neck Printed T-shirt F2666-WH1.png";
import BalmainTrackSuit from "../assets/Balmai n Paris Black Imported Premium Track Suit With Brand Carry Bag F2574-BL.png";
import GucciBlackTshirt from "../assets/Gucc i Black Premium Round Neck Printed T-shirt F2666-BL2.png";
import GucciBeigeTshirt from "../assets/Gucc i Beige Premium Round Neck Printed T-shirt F2666-BE2.png";
import LouisVuitton from "../assets/Louis_vuitton_silver_blue_2608.png";
import DiorWMNS from "../assets/Dior_WMNS_8875_Black_Blue_DC.png";
import BalenciagaPink from "../assets/Balenciaga.58185 pink shaded.png";
import BurberryBrown from "../assets/Burberr_y Tb Smooth Leather Tote Bag With Dust Bag (Brown).png";
import BurberryBlack from "../assets/Burberr_y Tb Smooth Leather Tote Bag With Dust Bag (Black).png";
import TagHeuer from "../assets/Tag_Heuer Watche.png";
import BirkenstockSkyBlue from "../assets/Birkenstock Arizona Sky Blue Suede - Copy (2).png";
import ZaraGreyPant from "../assets/Zar a Grey Stripes Premium Classic Linen Pant.png";
import TommyJeansDarkBlue from "../assets/TOMY-VS-JEANS-DARK-BLUE.png";
import TommyShirt2 from "../assets/shirt2.jpg";
import CalvinShirt from "../assets/shirt1.jpg";
import RalphPoloPink from "../assets/Ralph_Lauren Polo Pink Oxford Lycra Embroidery Logo Premium Shirt F2757-PI - Copy.png";
import AdidasTrackBeige from "../assets/Adida s Premium Logo Designer Track Beige (312).png";
import AdidasTrackBeige2 from "../assets/Adida s Premium Logo Designer Track Beige (3122).png";
import RolexCouple from "../assets/Rolex_Couple_Oyster_Perpetual_Day-Date_Twotone_Rose_Gold-Black.png";
import DavidBeckham from "../assets/_David_becham_70066.png";
import LoroPiana from "../assets/Loro piana loafers2.png";
import MyBurberry from "../assets/_My_Burberry_England_Gift_Set_of_4.png";
import TommyHilfiger from "../assets/Tommy_Hilfiger Teal Polo.jpg";
import Crocs from "../assets/Croc s literide Black White - Copy.png";
import AlexanderMcQueen from "../assets/ALEXANDER MCQUEEN PREMIUM WHITE SNEAKER.png";
import Birkenstock from "../assets/BIRKENSTOCK ARIZONA EVA BLACK - Copy (2).png";
import CoachEspadrille from "../assets/Coach_Collins_Espadrille_In_Signature_Denim_With_OG_Box_&_Carry_Bag_888-21_Denim - Copy.jpg";

// ✅ Product List
const productList = [
  { name: "Michael Kors Eliza Tote 45", image: MichaelTote45, price: 4500, category: "Bags" },
  { name: "Michael Kors Eliza Tote 456", image: MichaelTote456, price: 2600, category: "Bags" },
  { name: "COAC_H Sling Bag 201", image: COAC_H201, price: 2789.0, category: "Bags" },
  { name: "COAC_H Sling Bag 200", image: COAC_H200, price: 2560, category: "Bags" },
  { name: "COAC_H Sling Bag 198", image: COAC_H198, price: 2200, category: "Bags" },
  { name: "Boss Ice 0618", image: BossIce0618, price: 1500, category: "Accessories" },
  { name: "Prada 21 Grey Blue", image: Prada21GreyBlue, price: 2000, category: "Bags" },
  { name: "Gucci White Tshirt", image: GucciWhiteTshirt, price: 1800, category: "Clothing" },
  { name: "Balmain Track Suit", image: BalmainTrackSuit, price: 2000, category: "Clothing" },
  { name: "Gucci Black Tshirt", image: GucciBlackTshirt, price: 1900, category: "Clothing" },
  { name: "Gucci Beige Tshirt", image: GucciBeigeTshirt, price: 1700, category: "Clothing" },
  { name: "Louis Vuitton Silver Blue", image: LouisVuitton, price: 1200, category: "Bags" },
  { name: "Dior WMNS 8875", image: DiorWMNS, price: 5000, category: "Shoes" },
  { name: "Balenciaga Pink 58185", image: BalenciagaPink, price: 2000, category: "Clothing" },
  { name: "Burberry Tote Brown", image: BurberryBrown, price: 2300, category: "Bags" },
  { name: "Burberry Tote Black", image: BurberryBlack, price: 1500, category: "Bags" },
  { name: "Tag Heuer Watch", image: TagHeuer, price: 1500, category: "Accessories" },
  { name: "Birkenstock Arizona Sky Blue", image: BirkenstockSkyBlue, price: 1600, category: "Sandals" },
  { name: "air max 1 flip flop grey green", image: ZaraGreyPant, price: 2200, category: "Clothing" },
  { name: "Tommy Jeans Dark Blue", image: TommyJeansDarkBlue, price: 2500, category: "Clothing" },
  { name: "Toomy Hilfiger Shirt", image: TommyShirt2, price: 1800, category: "Clothing" },
  { name: "Calvin Klein C_K Shirt", image: CalvinShirt, price: 2000, category: "Clothing" },
  { name: "Ralph Lauren Polo Pink", image: RalphPoloPink, price: 2400, category: "Clothing" },
  { name: "Adidas Track Beige 312", image: AdidasTrackBeige, price: 3500, category: "Clothing" },
  { name: "Adidas Track Beige 3122", image: AdidasTrackBeige2, price: 3600, category: "Clothing" },
  { name: "Rolex Couple", image: RolexCouple, price: 2000, category: "Accessories" },
  { name: "David Beckham 70066", image: DavidBeckham, price: 1800, category: "Fragrance" },
  { name: "Loro Piana Loafers", image: LoroPiana, price: 8000, category: "Shoes" },
  { name: "My Burberry Gift Set", image: MyBurberry, price: 3000, category: "Fragrance" },
  { name: "Tommy Hilfiger Teal Polo", image: TommyHilfiger, price: 2500, category: "Clothing" },
  { name: "Crocs Literide Black White", image: Crocs, price: 1200, category: "Shoes" },
  { name: "Alexander McQueen White Sneaker", image: AlexanderMcQueen, price: 3800, category: "Shoes" },
  { name: "Birkenstock Arizona Black", image: Birkenstock, price: 1500, category: "Sandals" },
  { name: "Coach Espadrille", image: CoachEspadrille, price: 3000, category: "Shoes" },
];

const priceIncrement = Number(process.env.REACT_APP_PRODUCT_PRICE) || 0;
const updatedProductList = productList.map(product => ({
  ...product,
  price: product.price + priceIncrement
}));

const Products = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(20000);
  const [sortOrder, setSortOrder] = useState("featured");
  const [quantity, setQuantity] = useState(1);
  const [popup, setPopup] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const { addToCart, wishlist, setWishlist } = useCart();
  const navigate = useNavigate();

  const showPopup = (message) => {
    setPopup(message);
    setTimeout(() => setPopup(""), 2000);
  };

  const handleAddToCart = (product) => {
    addToCart({ ...product, quantity });
    showPopup("Product added to Cart!");
  };

  const handleAddToWishlist = (product) => {
    setWishlist([...wishlist, product]);
    showPopup("Product added to Wishlist!");
  };

  // ✅ Open confirmation modal
  const handleBuyNow = (product) => {
    setSelectedProduct(product);
    setShowConfirm(true);
  };

  // ✅ Confirm navigation
  const confirmPurchase = () => {
    setShowConfirm(false);
    navigate("/customer-details", { state: { product: selectedProduct } });
  };

  const incrementQty = () => setQuantity((prev) => prev + 1);
  const decrementQty = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const filteredProducts = updatedProductList
    .filter(
      (p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) &&
        p.price >= minPrice &&
        p.price <= maxPrice
    )
    .sort((a, b) => {
      if (sortOrder === "low-high") return a.price - b.price;
      if (sortOrder === "high-low") return b.price - a.price;
      return 0;
    });

  const relatedProducts = selectedProduct
    ? updatedProductList.filter(
        (p) =>
          p.category === selectedProduct.category &&
          p.name !== selectedProduct.name
      )
    : [];

  // ✅ Product Detail Page
  if (selectedProduct) {
    return (
      <div className="products-page">
        {popup && <div className="popup">{popup}</div>}

        <div className="product-detail-expanded">
          {/* Left: Image + Actions */}
          <div className="product-detail-left">
            <img
              src={selectedProduct.image}
              alt={selectedProduct.name}
              className="product-image-large"
            />

            <div className="product-actions-side">
              {/* Quantity */}
              <div className="quantity-selector">
                <label>Quantity:</label>
                <div className="quantity-box">
                  <button onClick={decrementQty}>-</button>
                  <input type="number" value={quantity} readOnly />
                  <button onClick={incrementQty}>+</button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="product-actions">
                <button
                  className="btn-wishlist"
                  onClick={() => handleAddToWishlist(selectedProduct)}
                >
                  ♡ Wishlist
                </button>
                <button
                  className="btn-add-cart"
                  onClick={() => handleAddToCart(selectedProduct)}
                >
                  Add to Cart
                </button>
                <button
                  className="btn-buy-now"
                  onClick={() => handleBuyNow(selectedProduct)}
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="product-detail-right">
            <h2>{selectedProduct.name}</h2>
            <p className="product-price">₹{selectedProduct.price}</p>
            {selectedProduct.description && <p>{selectedProduct.description}</p>}

            <ul className="product-points">
              <li>✔ 7 Days Easy Return</li>
              <li>✔ Free Shipping on orders above ₹2000</li>
              <li>✔ 100% Authentic Products</li>
              <li>✔ Cash on Delivery Available</li>
              <li>✔ Warranty Included (if applicable)</li>
            </ul>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="related-products">
            <h3>Related Products</h3>
            <div className="related-grid">
              {relatedProducts.map((product, index) => (
                <div
                  key={index}
                  className="related-card"
                  onClick={() => setSelectedProduct(product)}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="related-image"
                  />
                  <h4>{product.name}</h4>
                  <p>₹{product.price}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Confirmation Modal */}
        <CustomModal
          isOpen={showConfirm}
          onClose={() => setShowConfirm(false)}
          onConfirm={confirmPurchase}
          product={selectedProduct}
        />
      </div>
    );
  }

  // ✅ Product Grid Page
  return (
    <div className="products-page">
      {popup && <div className="popup">{popup}</div>}
      <h2>Your Online Style Hub</h2>

      <div className="products-filters">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="price-box">
          <label>PRICE</label>
          <div className="price-range">
            <span>₹{minPrice.toFixed(2)}</span>
            <input
              type="range"
              min={0}
              max={20000}
              value={minPrice}
              onChange={(e) => setMinPrice(Number(e.target.value))}
            />
            <input
              type="range"
              min={0}
              max={20000}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
            />
            <span>₹{maxPrice.toFixed(2)}</span>
          </div>
        </div>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="featured">Featured</option>
          <option value="low-high">Price: Low to High</option>
          <option value="high-low">Price: High to Low</option>
        </select>
      </div>

      <div className="product-grid">
        {filteredProducts.map((product, index) => (
          <div
            key={index}
            className="product-card"
            onClick={() => setSelectedProduct(product)}
          >
            <img
              src={product.image}
              alt={product.name}
              className="product-image"
            />
            <h3>{product.name}</h3>
            <p>₹{product.price}</p>
          </div>
        ))}
      </div>

      {/* Confirmation Modal */}
      <CustomModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={confirmPurchase}
        product={selectedProduct}
      />
    </div>
  );
};

export default Products;
