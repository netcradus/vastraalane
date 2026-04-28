import { Routes, Route, Navigate } from "react-router-dom";
import { StoreLayout } from "./components/layout/StoreLayout";
import { AdminLayout } from "./components/admin/AdminLayout";
import Home from "./pages/store/Home";
import CategoryPage from "./pages/store/CategoryPage";
import ProductDetail from "./pages/store/ProductDetail";
import Checkout from "./pages/store/Checkout";
import About from "./pages/store/About";
import AllProducts from "./pages/store/AllProducts";
import TermsConditions from "./pages/store/TermsConditions";
import CustomerCare from "./pages/store/CustomerCare";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Profile from "./pages/user/Profile";
import Orders from "./pages/user/Orders";
import WishlistPage from "./pages/user/WishlistPage";
import Settings from "./pages/user/Settings";
import AdminLogin from "./pages/admin/AdminLogin";
import ProductsAdmin from "./pages/admin/ProductsAdmin";
import AddProduct from "./pages/admin/AddProduct";
import EditProduct from "./pages/admin/EditProduct";
import OrdersAdmin from "./pages/admin/OrdersAdmin";
import UsersAdmin from "./pages/admin/UsersAdmin";
import CouponsAdmin from "./pages/admin/CouponsAdmin";
import NotFound from "./pages/store/NotFound";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { AdminRoute } from "./routes/AdminRoute";
import { useHydrateAuth } from "./hooks/useAuth";
import { ScrollToTop } from "./components/layout/ScrollToTop";
import { UserStoreSync } from "./components/layout/UserStoreSync";

export default function App() {
  useHydrateAuth();

  return (
    <>
      <ScrollToTop />
      <UserStoreSync />
      <Routes>
        <Route element={<StoreLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<AllProducts />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/customer-care" element={<CustomerCare />} />
          <Route path="/terms-conditions" element={<TermsConditions />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/account/profile" element={<Profile />} />
            <Route path="/account/orders" element={<Orders />} />
            <Route path="/account/wishlist" element={<WishlistPage />} />
            <Route path="/account/settings" element={<Settings />} />
          </Route>
        </Route>

        <Route path="/admin/login" element={<AdminLogin />} />

        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="products" replace />} />
            <Route path="products" element={<ProductsAdmin />} />
            <Route path="products/add" element={<AddProduct />} />
            <Route path="products/:id/edit" element={<EditProduct />} />
            <Route path="categories" element={<div className="rounded-[2rem] bg-white p-6 shadow-sm">Categories page scaffolded</div>} />
            <Route path="orders" element={<OrdersAdmin />} />
            <Route path="users" element={<UsersAdmin />} />
            <Route path="coupons" element={<CouponsAdmin />} />
            <Route path="settings" element={<div className="rounded-[2rem] bg-white p-6 shadow-sm">Settings scaffolded</div>} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
