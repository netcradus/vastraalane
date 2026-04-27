import { useQuery } from "@tanstack/react-query";
import { productService } from "../services/productService";

const LONG_CACHE_TIME = 5 * 60 * 1000;

export function useProducts(params, options = {}) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => productService.getProducts(params),
    staleTime: 60 * 1000,
    gcTime: LONG_CACHE_TIME,
    refetchOnWindowFocus: false,
    ...options,
  });
}

export function useFeaturedProducts() {
  return useQuery({
    queryKey: ["featured-products"],
    queryFn: productService.getFeatured,
    staleTime: 60 * 1000,
    gcTime: LONG_CACHE_TIME,
    refetchOnWindowFocus: false,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: productService.getCategories,
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
