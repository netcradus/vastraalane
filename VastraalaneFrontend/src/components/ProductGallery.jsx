import React, { useEffect, useState } from "react";
import { getPrimaryProductImage, normalizeProductImages } from "../utils/productImages";
import "../scss/_productGallery.scss";

const ProductGallery = ({ product, className = "" }) => {
  const images = normalizeProductImages(product);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
  }, [product?._id, product?.identityKey, product?.slug, product?.name]);

  if (!images.length) {
    return (
      <div className={`product-gallery ${className}`.trim()}>
        <div className="product-gallery__empty">Image unavailable</div>
      </div>
    );
  }

  const safeIndex = Math.min(activeIndex, images.length - 1);
  const currentImage = images[safeIndex] || getPrimaryProductImage(product);

  const moveBy = (step) => {
    setActiveIndex((previous) => {
      const nextIndex = previous + step;
      if (nextIndex < 0) return images.length - 1;
      if (nextIndex >= images.length) return 0;
      return nextIndex;
    });
  };

  return (
    <div className={`product-gallery ${className}`.trim()}>
      <div className="product-gallery__stage">
        <img
          src={currentImage}
          alt={`${product?.name || "Product"} view ${safeIndex + 1}`}
          className="product-gallery__main-image"
        />
        {images.length > 1 && (
          <>
            <button
              type="button"
              className="product-gallery__nav product-gallery__nav--prev"
              onClick={() => moveBy(-1)}
              aria-label="Previous product image"
            >
              {"<"}
            </button>
            <button
              type="button"
              className="product-gallery__nav product-gallery__nav--next"
              onClick={() => moveBy(1)}
              aria-label="Next product image"
            >
              {">"}
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="product-gallery__thumbs">
          {images.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              className={`product-gallery__thumb ${index === safeIndex ? "is-active" : ""}`}
              onClick={() => setActiveIndex(index)}
            >
              <img src={image} alt={`${product?.name || "Product"} thumbnail ${index + 1}`} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;
