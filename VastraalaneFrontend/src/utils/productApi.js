import axios from "axios";

const PAGE_SIZE = 100;

export async function fetchAllProducts(apiBase, extraParams = {}) {
  const firstRes = await axios.get(`${apiBase}/api/products`, {
    params: { page: 1, limit: PAGE_SIZE, ...extraParams },
  });

  const firstData = firstRes.data || {};
  const firstProducts = firstData.products || [];
  const totalPages = Number(firstData.totalPages || 1);

  if (totalPages <= 1) {
    return {
      products: firstProducts,
      totalItems: Number(firstData.totalItems || firstProducts.length),
    };
  }

  const requests = [];
  for (let page = 2; page <= totalPages; page += 1) {
    requests.push(
      axios.get(`${apiBase}/api/products`, {
        params: { page, limit: PAGE_SIZE, ...extraParams },
      })
    );
  }

  const responses = await Promise.all(requests);
  const restProducts = responses.flatMap((response) => response.data?.products || []);
  const products = [...firstProducts, ...restProducts];

  return {
    products,
    totalItems: Number(firstData.totalItems || products.length),
  };
}

export function buildCategoryCounts(products) {
  const counts = new Map();

  for (const product of products) {
    const category = product.category;
    if (!category) continue;
    counts.set(category, (counts.get(category) || 0) + 1);
  }

  return Array.from(counts.entries())
    .map(([category, count]) => ({ _id: category, count }))
    .sort((a, b) => b.count - a.count || a._id.localeCompare(b._id));
}
