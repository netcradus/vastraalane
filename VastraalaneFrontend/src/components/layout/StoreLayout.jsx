import { useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { CartDrawer } from "../cart/CartDrawer";

export function StoreLayout() {
  const location = useLocation();
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) {
      return undefined;
    }

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const observed = new WeakSet();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting || prefersReducedMotion) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      {
        threshold: 0.18,
        rootMargin: "0px 0px -10% 0px",
      }
    );

    const observeReveals = () => {
      root.querySelectorAll("[data-reveal]").forEach((element) => {
        if (!observed.has(element)) {
          observed.add(element);
          if (prefersReducedMotion) {
            element.classList.add("is-visible");
          } else {
            observer.observe(element);
          }
        }
      });
    };

    observeReveals();

    const mutationObserver = new MutationObserver(() => {
      observeReveals();
    });

    mutationObserver.observe(root, {
      childList: true,
      subtree: true,
    });

    return () => {
      mutationObserver.disconnect();
      observer.disconnect();
    };
  }, [location.pathname]);

  return (
    <div ref={rootRef} className="store-scene min-h-screen">
      <Navbar />
      <main className="store-main">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
}
