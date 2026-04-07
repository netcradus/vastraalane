export function normalizeProductImages(product) {
  return Array.from(
    new Set(
      [
        product?.image,
        product?.img,
        ...(Array.isArray(product?.images) ? product.images : []),
      ]
        .map((value) => String(value || "").trim())
        .filter(Boolean)
    )
  );
}

export function getPrimaryProductImage(product) {
  return normalizeProductImages(product)[0] || "";
}
