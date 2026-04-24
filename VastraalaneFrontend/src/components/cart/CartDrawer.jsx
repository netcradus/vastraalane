import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useCartStore } from "../../store/cartStore";
import { formatPrice } from "../../utils/formatPrice";

export function CartDrawer() {
  const { isOpen, close, items, updateQuantity, removeItem } = useCartStore();
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = items.length ? 15000 : 0;

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const { body, documentElement } = document;
    const previousBodyOverflow = body.style.overflow;
    const previousBodyTouchAction = body.style.touchAction;
    const previousHtmlOverflow = documentElement.style.overflow;
    const previousHtmlOverscroll = documentElement.style.overscrollBehavior;

    body.style.overflow = "hidden";
    body.style.touchAction = "none";
    documentElement.style.overflow = "hidden";
    documentElement.style.overscrollBehavior = "none";

    return () => {
      body.style.overflow = previousBodyOverflow;
      body.style.touchAction = previousBodyTouchAction;
      documentElement.style.overflow = previousHtmlOverflow;
      documentElement.style.overscrollBehavior = previousHtmlOverscroll;
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-ink/40 backdrop-blur-[2px]"
            onClick={close}
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            className="fixed inset-y-0 right-0 z-50 flex h-[100dvh] w-full max-w-md flex-col overflow-hidden bg-white p-4 shadow-[0_24px_60px_rgba(31,26,23,0.22)] overscroll-none sm:p-6"
          >
            <div className="mb-4 flex items-center justify-between sm:mb-6">
              <h3 className="font-display text-3xl">Your cart</h3>
              <button type="button" onClick={close}>
                Close
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-hidden">
              <div className="flex h-full min-h-0 flex-col">
                <div className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain pr-1 pb-4">
                  {items.length ? (
                    items.map((item) => (
                      <div key={item.key} className="rounded-[1.5rem] border border-ink/10 p-4">
                        <div className="flex items-start gap-4">
                          <Link
                            to={`/product/${item.productId}`}
                            onClick={close}
                            className="block shrink-0 overflow-hidden rounded-2xl"
                            aria-label={`View ${item.name}`}
                          >
                            <img
                              src={item.image || "https://placehold.co/200x240/f4ede1/1f1a17?text=Item"}
                              alt={item.name}
                              loading="lazy"
                              className="h-24 w-20 rounded-2xl object-cover"
                            />
                          </Link>

                          <div className="flex min-w-0 flex-1 flex-col">
                            <Link
                              to={`/product/${item.productId}`}
                              onClick={close}
                              className="transition hover:text-clay"
                            >
                              <h4 className="font-semibold leading-6">{item.name}</h4>
                            </Link>
                            <p className="mt-1 text-sm text-ink/60">
                              {item.size || "Standard"}
                              {item.color ? ` • ${item.color}` : ""}
                            </p>
                            <p className="mt-2 text-clay">{formatPrice(item.price)}</p>

                            <div className="mt-3 flex items-center gap-3">
                              <button
                                type="button"
                                className="icon-button-3d rounded-full px-3 py-1 hover:bg-ink/5"
                                onClick={() => updateQuantity(item.key, item.quantity - 1)}
                              >
                                -
                              </button>
                              <span>{item.quantity}</span>
                              <button
                                type="button"
                                className="icon-button-3d rounded-full px-3 py-1 hover:bg-ink/5"
                                onClick={() => updateQuantity(item.key, item.quantity + 1)}
                              >
                                +
                              </button>
                              <button
                                type="button"
                                className="ml-auto text-sm text-red-600"
                                onClick={() => removeItem(item.key)}
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-[1.5rem] border border-dashed border-ink/10 bg-mist/60 p-6 text-sm text-ink/60">
                      Your cart is empty.
                    </div>
                  )}
                </div>

                <div className="cart-drawer-summary mt-3 border-t border-ink/10 bg-white pt-4">
                  <div className="rounded-[1.5rem] border border-white/60 bg-mist p-4 shadow-[0_-10px_24px_rgba(255,255,255,0.85)] sm:p-5">
                    <div className="flex items-center justify-between text-sm">
                      <span>Subtotal</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-sm">
                      <span>Estimated shipping</span>
                      <span>{formatPrice(shipping)}</span>
                    </div>
                    <div className="mt-4 flex items-center justify-between font-semibold">
                      <span>Total</span>
                      <span>{formatPrice(subtotal + shipping)}</span>
                    </div>
                    <Link
                      to="/checkout"
                      onClick={close}
                      className="button-3d mt-4 inline-flex w-full items-center justify-center rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-clay"
                    >
                      Checkout
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
