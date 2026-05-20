import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { useCartStore } from "../../store/cartStore";
import { useAuthStore } from "../../store/authStore";
import { Button } from "../../components/ui/Button";
import { formatPrice } from "../../utils/formatPrice";
import { orderService } from "../../services/orderService";

const schema = z.object({
  name: z.string().min(2),
  street: z.string().min(5),
  city: z.string().min(2),
  state: z.string().min(2),
  zip: z.string().min(4),
  country: z.string().min(2),
  phone: z.string().min(8),
});

function loadRazorpayScript() {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve(window.Razorpay);
      return;
    }

    const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(window.Razorpay), { once: true });
      existingScript.addEventListener("error", () => reject(new Error("Failed to load Razorpay SDK")), {
        once: true,
      });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(window.Razorpay);
    script.onerror = () => reject(new Error("Failed to load Razorpay SDK"));
    document.body.appendChild(script);
  });
}

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const cartItems = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const user = useAuthStore((state) => state.user);
  const [isPaying, setIsPaying] = useState(false);
  const [buyNowItems, setBuyNowItems] = useState([]);
  const isBuyNowMode = new URLSearchParams(location.search).get("mode") === "buy-now";
  const items = isBuyNowMode ? buyNowItems : cartItems;
  const shippingCost = 15000;
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal + shippingCost;

  useEffect(() => {
    if (!isBuyNowMode) {
      setBuyNowItems([]);
      return;
    }

    const rawBuyNowItems = sessionStorage.getItem("va-buy-now");
    if (!rawBuyNowItems) {
      setBuyNowItems([]);
      return;
    }

    try {
      const parsedItems = JSON.parse(rawBuyNowItems);
      setBuyNowItems(Array.isArray(parsedItems) ? parsedItems : []);
    } catch {
      setBuyNowItems([]);
    }
  }, [isBuyNowMode]);

  const orderItems = useMemo(
    () =>
      items.map((item) => ({
        product: item.productId,
        name: item.name,
        image: item.image,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        price: item.price,
      })),
    [items]
  );

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user?.name || "",
      street: "",
      city: "",
      state: "",
      zip: "",
      country: "India",
      phone: "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    if (!items.length) {
      toast.error(isBuyNowMode ? "No product is ready for direct checkout." : "Your cart is empty.");
      if (isBuyNowMode) {
        sessionStorage.removeItem("va-buy-now");
      }
      return;
    }

    if (!user) {
      toast.error("Please login before continuing to payment.");
      navigate("/login");
      return;
    }

    setIsPaying(true);

    try {
      const checkoutResponse = await orderService.create({
        items: orderItems,
        shippingAddress: values,
        shippingMethod: "standard",
        subtotal,
        shippingCost,
        discount: 0,
        coupon: "",
        total,
      });

      const { item: order, payment } = checkoutResponse;

      if (payment?.mock) {
        if (isBuyNowMode) {
          sessionStorage.removeItem("va-buy-now");
        } else {
          clearCart();
        }
        toast.success("Order placed. We received your details.");
        navigate("/account/orders");
        return;
      }

      const Razorpay = await loadRazorpayScript();
      const razorpay = new Razorpay({
        key: payment.keyId,
        amount: payment.amount,
        currency: payment.currency,
        name: "Vastraalane",
        description: `Order #${String(order._id).slice(-6).toUpperCase()}`,
        order_id: payment.razorpayOrderId,
        prefill: {
          name: values.name,
          contact: values.phone,
          email: user.email || "",
        },
        notes: {
          address: `${values.street}, ${values.city}, ${values.state}`,
        },
        theme: {
          color: "#9f5e3b",
        },
        handler: async (response) => {
          await orderService.verifyPayment({
            orderId: order._id,
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          });

          if (isBuyNowMode) {
            sessionStorage.removeItem("va-buy-now");
          } else {
            clearCart();
          }
          toast.success("Payment successful. Your order has been placed.");
          navigate("/account/orders");
        },
        modal: {
          ondismiss: () => {
            setIsPaying(false);
          },
        },
      });

      razorpay.on("payment.failed", (event) => {
        toast.error(event?.error?.description || "Payment failed. Please try again.");
        setIsPaying(false);
      });

      razorpay.open();
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message || "Unable to start Razorpay checkout.");
      setIsPaying(false);
    }
  });

  return (
    <div className="container-shell py-12">
      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <form onSubmit={onSubmit} className="glass-panel p-8">
          <h1 className="font-display text-4xl">Checkout</h1>
          <p className="mt-3 text-sm text-ink/60">
            Complete your shipping details and continue securely with Razorpay.
            {isBuyNowMode ? " You are checking out this product directly." : ""}
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {["name", "street", "city", "state", "zip", "country", "phone"].map((field) => (
              <label key={field} className={field === "street" ? "md:col-span-2" : ""}>
                <span className="mb-2 block text-sm font-medium capitalize">{field}</span>
                <input {...form.register(field)} className="w-full rounded-2xl border border-ink/10 bg-white px-4 py-3" />
                <span className="mt-1 block text-xs text-red-600">{form.formState.errors[field]?.message}</span>
              </label>
            ))}
          </div>
          <div className="mt-8 flex gap-3">
            <Button type="submit" disabled={form.formState.isSubmitting || isPaying || !items.length}>
              {form.formState.isSubmitting || isPaying ? "Opening Razorpay..." : "Pay with Razorpay"}
            </Button>
          </div>
        </form>

        <aside className="glass-panel h-fit p-6">
          <h2 className="font-display text-3xl">Order Summary</h2>
          <div className="mt-6 space-y-4">
            {items.map((item) => (
              <div key={item.key} className="flex items-center justify-between text-sm">
                <span>
                  {item.name} x {item.quantity}
                </span>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 space-y-2 border-t border-ink/10 pt-4 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{formatPrice(shippingCost)}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
