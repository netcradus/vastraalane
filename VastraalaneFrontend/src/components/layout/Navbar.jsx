import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Heart, LogOut, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import { useCartStore } from "../../store/cartStore";
import { useWishlistStore } from "../../store/wishlistStore";
import { useAuthStore } from "../../store/authStore";
import { SearchOverlay } from "../product/SearchOverlay";
import { authService } from "../../services/authService";

const links = [
  { to: "/", label: "Home" },
  { to: "/category/all", label: "Categories" },
  { to: "/sale", label: "Sale" },
  { to: "/about", label: "About" },
];

export function Navbar() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const cartCount = useCartStore((state) => state.items.length);
  const openCart = useCartStore((state) => state.open);
  const wishlistCount = useWishlistStore((state) => state.items.length);
  const logout = useAuthStore((state) => state.logout);
  const resetCart = useCartStore((state) => state.resetForLogout);
  const resetWishlist = useWishlistStore((state) => state.resetForLogout);

  useEffect(() => {
    if (!mobileOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileOpen]);

  async function handleLogout() {
    try {
      await authService.logout();
    } catch (error) {
      // Clearing local session still gives the user a reliable logout path.
    } finally {
      resetCart();
      resetWishlist();
      logout();
      setMobileOpen(false);
      toast.success("Logged out successfully");
      navigate("/login");
    }
  }

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 border-b border-white/50 bg-white/65 shadow-[0_16px_36px_rgba(31,26,23,0.08)] backdrop-blur-2xl"
        style={{ transform: "translateZ(30px)" }}
      >
        <div className="container-shell flex min-h-[5.5rem] items-center justify-between gap-4 py-3">
          <Link to="/" className="flex items-center font-display">
            <img
              src="/images/logo.png"
              alt="Vastraalane logo"
              className="h-16 w-16 object-contain sm:h-20 sm:w-20"
            />
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `relative text-sm font-medium ${isActive ? "text-clay" : "text-ink/70"}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button className="icon-button-3d rounded-full p-3 hover:bg-ink/5" onClick={() => setSearchOpen(true)}>
              <Search size={18} />
            </button>
            <button
              className="icon-button-3d relative rounded-full p-3 hover:bg-ink/5"
              onClick={() => {
                if (!user) {
                  toast("Please login to view your wishlist.");
                  navigate("/login");
                  return;
                }
                navigate("/account/wishlist");
              }}
            >
              <Heart size={18} />
              {user && !!wishlistCount && (
                <span className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-clay text-[10px] text-white">
                  {wishlistCount}
                </span>
              )}
            </button>
            <button
              className="icon-button-3d relative rounded-full p-3 hover:bg-ink/5"
              onClick={() => {
                if (!user) {
                  toast("Please login to access your cart.");
                  navigate("/login");
                  return;
                }
                openCart();
              }}
            >
              <ShoppingBag size={18} />
              {user && !!cartCount && (
                <span className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-forest text-[10px] text-white">
                  {cartCount}
                </span>
              )}
            </button>
            <Link to={user ? "/account/profile" : "/login"} className="icon-button-3d rounded-full p-3 hover:bg-ink/5">
              <User size={18} />
            </Link>
            {user ? (
              <button
                className="button-3d hidden items-center gap-2 rounded-full border border-ink/10 px-4 py-2 text-sm font-semibold text-ink transition hover:bg-ink hover:text-white md:inline-flex"
                onClick={handleLogout}
              >
                <LogOut size={16} />
                Logout
              </button>
            ) : null}
            <button
              className="icon-button-3d rounded-full p-3 hover:bg-ink/5 md:hidden"
              onClick={() => setMobileOpen((value) => !value)}
              aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {mobileOpen ? (
          <>
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-ink/25 backdrop-blur-[2px] md:hidden"
              onClick={() => setMobileOpen(false)}
              aria-label="Close mobile menu"
            />
            <motion.div
              initial={{ opacity: 0, y: -20, scaleY: 0.92 }}
              animate={{ opacity: 1, y: 0, scaleY: 1 }}
              exit={{ opacity: 0, y: -20, scaleY: 0.92 }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              className="mobile-nav-panel fixed inset-x-4 top-[5.75rem] z-50 rounded-[2rem] border border-white/50 bg-white/88 p-5 text-ink backdrop-blur-2xl md:hidden"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="font-display text-xl">Menu</span>
                <button className="icon-button-3d rounded-full p-2 hover:bg-ink/5" onClick={() => setMobileOpen(false)}>
                  <X size={18} />
                </button>
              </div>
              <div className="flex flex-col gap-2">
                {links.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `rounded-[1.25rem] px-4 py-3 text-sm font-medium transition ${
                        isActive ? "bg-ink text-white" : "bg-black/[0.03] hover:bg-black/[0.06]"
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
                {user ? (
                  <>
                    <NavLink
                      to="/account/profile"
                      onClick={() => setMobileOpen(false)}
                      className="rounded-[1.25rem] bg-black/[0.03] px-4 py-3 text-sm font-medium transition hover:bg-black/[0.06]"
                    >
                      My Account
                    </NavLink>
                    <button
                      className="button-3d mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white"
                      onClick={handleLogout}
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </>
                ) : (
                  <NavLink
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="button-3d mt-2 inline-flex items-center justify-center rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white"
                  >
                    Login
                  </NavLink>
                )}
              </div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
