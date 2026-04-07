import axios from "axios";

export const MAX_PAGE_SIZE = 100;

export async function fetchProductsPage(apiBase, params = {}) {
  const response = await axios.get(`${apiBase}/api/products`, {
    params,
  });

  return response.data || {};
}

export async function fetchCategoryProductsPage(apiBase, categoryId, params = {}) {
  const response = await axios.get(`${apiBase}/api/products/category/${categoryId}`, {
    params,
  });

  return response.data || {};
}

export async function fetchCategories(apiBase) {
  const response = await axios.get(`${apiBase}/api/products/categories`);
  return response.data || {};
}

export async function fetchCategory(apiBase, categoryId) {
  const response = await axios.get(`${apiBase}/api/products/categories/${categoryId}`);
  return response.data || {};
}

export async function fetchAllProducts(apiBase, extraParams = {}) {
  const firstData = await fetchProductsPage(apiBase, {
    page: 1,
    limit: MAX_PAGE_SIZE,
    ...extraParams,
  });

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
      fetchProductsPage(apiBase, {
        page,
        limit: MAX_PAGE_SIZE,
        ...extraParams,
      })
    );
  }

  const responses = await Promise.all(requests);
  const restProducts = responses.flatMap((response) => response.products || []);
  const products = [...firstProducts, ...restProducts];

  return {
    products,
    totalItems: Number(firstData.totalItems || products.length),
  };
}
