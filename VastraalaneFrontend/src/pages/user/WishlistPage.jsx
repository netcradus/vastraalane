import { useWishlistStore } from "../../store/wishlistStore";
import { WishlistGrid } from "../../components/wishlist/WishlistGrid";

export default function WishlistPage() {
  const items = useWishlistStore((state) => state.items);

  return (
    <div className="container-shell py-12">
      <div className="mb-8">
        <h1 className="font-display text-4xl">Wishlist</h1>
        <p className="mt-3 text-ink/60">Saved items persist locally and can later be synced to the backend for signed-in users.</p>
      </div>
      <WishlistGrid items={items} />
    </div>
  );
}
