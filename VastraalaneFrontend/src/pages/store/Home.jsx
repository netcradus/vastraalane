import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Truck, Undo2, WalletCards } from "lucide-react";
import { useCategories, useFeaturedProducts, useProducts } from "../../hooks/useProducts";
import { ProductGrid } from "../../components/product/ProductGrid";
import { Badge } from "../../components/ui/Badge";
import { useParallaxScene } from "../../hooks/useParallaxScene";
import discoverCollectionVideo from "../../Videos/discoverCollection.mp4";
import signatureStoryVideo from "../../Videos/video 2.mp4";
import perfumesVideo from "../../Videos/Pefumes.mp4";
import WatchesVideo from "../../Videos/watches.mp4";

import watchesImage from "../../Videos/WomensWatch.jpg";
import heroImage from "../../Videos/Handbags.jpeg";
import campaignImage from "../../Videos/Tracks.jpeg";
import customerImageOne from "../../Videos/1.jpeg";
import customerImageTwo from "../../Videos/2.jpeg";
import shirtsImage from "../../Videos/TShirts.jpeg";
import loafersImage from "../../Videos/Loafers.jpeg";
import specsImage from "../../Videos/Specs.png";
import handbagsImage from "../../Videos/Handbags.jpeg";
import perfumesImage from "../../Videos/Perfumes.jpeg";
import tracksImage from "../../Videos/Tracks.jpeg";
import flipflopImage from "../../Videos/Flipflop.jpeg";
import mensWatchImage from "../../Videos/MensWatch.jpeg";
import luxuryWatchImage from "../../Videos/LW.jpeg";
import sportswearImage from "../../Videos/MS.jpeg";

const trustItems = [
  { icon: Truck, title: "Free Shipping" },
  { icon: Undo2, title: "Easy Returns" },
  { icon: ShieldCheck, title: "Secure Payments" },
  { icon: WalletCards, title: "Flexible Checkout" },
];

const categoryThemes = {
  loafers: "from-[#d8c3a5] via-[#f6eee3] to-[#baa285]",
  shoes: "from-[#d4c2b0] via-[#f8f2ea] to-[#9f7e69]",
  perfumes: "from-[#f1d8c3] via-[#fff4ec] to-[#d5ae6f]",
  handbags: "from-[#cab8a2] via-[#f6ede2] to-[#8d6e63]",
  watches: "from-[#d9cfbf] via-[#faf6ef] to-[#8a7963]",
  shirts: "from-[#d7dce3] via-[#f7f9fb] to-[#a5b0bf]",
  sunglasses: "from-[#c9c5c0] via-[#f5f2ed] to-[#80756d]",
  default: "from-[#e7dccf] via-[#faf6f0] to-[#cbbba6]",
};

function getCategoryTheme(slug = "") {
  if (slug.includes("loafer")) return categoryThemes.loafers;
  if (slug.includes("shoe")) return categoryThemes.shoes;
  if (slug.includes("perfume")) return categoryThemes.perfumes;
  if (slug.includes("bag")) return categoryThemes.handbags;
  if (slug.includes("watch")) return categoryThemes.watches;
  if (slug.includes("shirt")) return categoryThemes.shirts;
  if (slug.includes("sunglass")) return categoryThemes.sunglasses;
  return categoryThemes.default;
}

function getCategoryAsset(slug = "") {
  if (slug.includes("cordset") || slug.includes("track")) return tracksImage;
  if (slug.includes("girls-sandals") || slug.includes("jutti") || slug.includes("flipflop")) return flipflopImage;
  if (slug.includes("bag")) return handbagsImage;
  if (slug.includes("jeans") || slug.includes("trouser")) return sportswearImage;
  if (slug.includes("loafer")) return loafersImage;
  if (slug.includes("watch")) return luxuryWatchImage;
  if (slug.includes("perfume")) return perfumesImage;
  if (slug.includes("shirt")) return shirtsImage;
  if (slug.includes("shoe")) return heroImage;
  if (slug.includes("sunglass") || slug.includes("spec")) return specsImage;
  return mensWatchImage;
}

function resolveCategoryImage(category) {
  if (category?.image) {
    return category.image;
  }

  return getCategoryAsset(category?.slug || "");
}

export default function Home() {
  const pageRef = useRef(null);
  const featuredQuery = useFeaturedProducts();
  const catalogQuery = useProducts({ limit: 24 });
  const categoriesQuery = useCategories();
  useParallaxScene(pageRef);

  return (
    <div ref={pageRef} className="space-y-14 pb-16 md:space-y-20 md:pb-20">
      <section className="relative -mt-14 min-h-[100svh] overflow-hidden bg-ink text-white sm:-mt-16" data-reveal>
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={discoverCollectionVideo}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-label="Discover collection campaign video"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/88 via-ink/45 to-ink/10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(213,174,111,0.32),transparent_28%),linear-gradient(180deg,rgba(31,26,23,0.18),rgba(31,26,23,0.42))]" />

        <div className="container-shell relative z-10 flex min-h-[100svh] items-end pb-12 pt-32 sm:pb-16 md:items-center md:pt-36">
          <div className="max-w-3xl">
            <Badge className="w-fit border-white/15 bg-white/10 text-gold">Discover Collection</Badge>
            <motion.h1
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.08 } },
              }}
              className="mt-5 font-display text-[clamp(3rem,9vw,7rem)] leading-[0.9] tracking-tight md:mt-6"
            >
              {"Modern silhouettes for every story".split(" ").map((word) => (
                <motion.span
                  key={word}
                  variants={{ hidden: { y: 40, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
                  className="mr-3 inline-block"
                >
                  {word}
                </motion.span>
              ))}
            </motion.h1>
            <p className="mt-5 max-w-2xl text-[clamp(1rem,1.6vw,1.22rem)] leading-8 text-white/78 md:mt-6 md:leading-9">
              Discover statement pieces, elevated essentials, and trend-forward collections designed to make everyday dressing feel more refined.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
              <Link
                to="/products"
                className="button-3d inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-ink shadow-card transition duration-300 hover:-translate-y-0.5 hover:bg-mist"
              >
                Shop Now
              </Link>
              <Link
                to="/category/all"
                className="button-3d inline-flex items-center justify-center rounded-full border border-white/25 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-ink"
              >
                View Collections
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container-shell" data-reveal>
        <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-clay">Featured categories</p>
            <h2 className="section-title mt-2">Explore by mood and moment</h2>
          </div>
          <Link to="/category/all" className="inline-flex items-center gap-2 text-sm font-semibold text-clay">
            View all <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-[var(--grid-gap)] sm:grid-cols-2 xl:grid-cols-3">
          {(categoriesQuery.data?.items || []).slice(0, 6).map((category) => (
            <Link
              key={category._id}
              to={`/category/${category.slug}`}
              className="group floating-3d-soft overflow-hidden rounded-[2rem] bg-white/80 p-4 shadow-card sm:p-5 lg:p-6"
            >
              <div
                className={`relative aspect-[16/11] overflow-hidden rounded-[1.5rem] bg-gradient-to-br ${getCategoryTheme(category.slug)}`}
              >
                <div className="media-3d-frame h-full">
                  <img
                    src={resolveCategoryImage(category)}
                    alt={category.name}
                    loading="lazy"
                    className="media-3d-surface h-full w-full rounded-[1.25rem] object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/10 to-transparent" />
                <div className="absolute inset-x-4 bottom-4 rounded-[1.25rem] bg-white/88 p-4 backdrop-blur">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-clay">Category</div>
                  <div className="mt-2 font-display text-2xl text-ink">{category.name}</div>
                  <div className="mt-1 text-sm text-ink/60">{category.productCount || 0} products</div>
                </div>
                <div className="absolute right-4 top-4 rounded-full border border-white/60 bg-white/70 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-ink">
                  Explore
                </div>
              </div>
              <div className="mt-5 flex items-center justify-between gap-3">
                <div>
                  <h3 className="font-display text-2xl">{category.name}</h3>
                  <p className="text-sm text-ink/60">{category.productCount || 0} items</p>
                </div>
                <span className="rounded-full bg-clay px-4 py-2 text-xs uppercase tracking-[0.2em] text-white">
                  Explore
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="container-shell" data-reveal>
        <div className="mb-8 flex items-end justify-between sm:mb-10">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-clay">Trending now</p>
            <h2 className="section-title mt-2">Fresh arrivals curated for the season</h2>
          </div>
        </div>
        <ProductGrid
          products={featuredQuery.data?.items}
          isLoading={featuredQuery.isLoading}
          isError={featuredQuery.isError}
          errorMessage="Featured products could not be loaded right now."
          emptyMessage="No featured products are available right now."
        />
      </section>

      <section className="container-shell" data-reveal>
        <div className="grid gap-8 rounded-[2rem] bg-white/80 p-5 shadow-card sm:p-6 lg:grid-cols-2 lg:gap-10 lg:rounded-[3rem] lg:p-12">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-clay">Limited-time edit</p>
            <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl md:text-5xl">A quieter luxury mood, with sharper tailoring.</h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-ink/70">
              Explore standout pieces selected to bring sharper silhouettes, richer textures, and a more premium wardrobe mood to your collection.
            </p>
            <p className="mt-4 max-w-xl text-sm leading-7 text-ink/70">
              Build a wardrobe around elevated essentials, statement layers, and pieces that move easily from everyday wear into sharper, styled looks.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.75rem] bg-mist p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-clay">Style Focus</p>
                <p className="mt-3 text-sm leading-7 text-ink/70">Relaxed tailoring, sport-luxe textures, and versatile statement pieces.</p>
              </div>
              <div className="rounded-[1.75rem] bg-ink p-5 text-white">
                <p className="text-xs uppercase tracking-[0.2em] text-gold">This Week</p>
                <p className="mt-3 text-sm leading-7 text-white/75">Fresh edits for footwear, bags, tracksuits, and standout accessories.</p>
              </div>
            </div>
            <div className="mt-6 rounded-[1.75rem] border border-ink/10 bg-white p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-clay">Why This Edit Works</p>
              <p className="mt-3 text-sm leading-7 text-ink/70">
                Clean neutrals, athletic tailoring, and luxury-inspired textures make this collection easier to mix, layer, and wear across seasons.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/category/cordset-and-tracksuit" className="button-3d inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white px-6 py-3 text-sm font-semibold text-ink transition hover:bg-mist">
                Explore Tracksuits
              </Link>
            </div>
          </div>
          <div className="media-3d-frame floating-3d overflow-visible rounded-[2rem] bg-gradient-to-br from-mist to-white p-4 sm:p-6">
            <img
              src={campaignImage}
              alt="Campaign banner"
              loading="lazy"
              className="media-3d-surface h-full w-full rounded-[1.5rem] object-cover"
            />
          </div>
        </div>
      </section>

      <section className="container-shell" data-reveal>
        <div className="parallax-scene relative overflow-hidden rounded-[3rem] bg-black shadow-card" data-parallax-scene>
          <video
            className="parallax-layer h-[380px] w-full object-cover sm:h-[440px] lg:h-[520px]"
            src={WatchesVideo}
            autoPlay
            muted
            loop
            playsInline
            data-parallax-layer
            data-speed="0.14"
            data-depth="-24"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/35 to-black/10" />
          <div className="absolute inset-0 flex items-end">
            <div className="max-w-3xl p-5 text-white sm:p-8 md:p-10 lg:p-14">
              <p className="text-xs uppercase tracking-[0.24em] text-gold">Featured Campaign</p>
              <h2 className="mt-4 font-display text-3xl leading-tight sm:text-4xl md:text-5xl lg:text-6xl">
                A more cinematic banner for a sharper first impression.
              </h2>
              <p className="mt-5 max-w-2xl text-sm leading-8 text-white/75 md:text-base">
                Motion-led storytelling gives the storefront a stronger luxury feel and helps the page flow more naturally between curated edits and product discovery.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
                <Link to="/products" className="button-3d inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-ink transition hover:bg-mist">
                  Explore All Products <ArrowRight size={16} />
                </Link>
                <Link to="/category/all" className="button-3d inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-ink">
                  Browse Categories
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-shell" data-reveal>
        <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr] lg:gap-6">
          <div className="relative overflow-hidden rounded-[3rem] bg-ink shadow-card">
            <video
              className="h-full min-h-[300px] w-full object-cover sm:min-h-[360px] lg:min-h-[420px]"
              src={perfumesVideo}
              autoPlay
              muted
              loop
              playsInline
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-8 md:p-10">
              <p className="text-xs uppercase tracking-[0.24em] text-gold">Editorial Motion</p>
              <h2 className="mt-3 max-w-xl font-display text-3xl leading-tight sm:text-4xl md:text-5xl">
                Movement, texture, and a stronger first impression.
              </h2>
              <p className="mt-4 max-w-lg text-sm leading-7 text-white/70">
                A more editorial presentation helps the store feel confident, modern, and visually richer from the first interaction.
              </p>
            </div>
          </div>

          <div className="grid gap-6">
            <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#eee4d5] to-[#cdb69a] p-4 shadow-card">
              <img src={watchesImage} alt="Curated collection" loading="lazy" className="media-3d-surface h-[180px] w-full rounded-[2rem] object-cover sm:h-[200px]" />
              <div className="px-3 pb-2 pt-5">
                <p className="text-xs uppercase tracking-[0.24em] text-clay">Spotlight</p>
                <h3 className="mt-2 font-display text-3xl text-ink">Cinematic product stories</h3>
                <p className="mt-3 text-sm leading-7 text-ink/70">
                  Rich visuals create a stronger first impression and a more premium mood across the storefront.
                </p>
              </div>
            </div>

            <div className="rounded-[2.5rem] bg-forest px-6 py-7 text-white shadow-card sm:px-7 sm:py-8">
              <p className="text-xs uppercase tracking-[0.24em] text-gold">Discover</p>
              <h3 className="mt-2 font-display text-3xl">From category browsing to full-collection exploration.</h3>
              <p className="mt-3 text-sm leading-7 text-white/75">
                Move from curated highlights into deeper browsing with category pages, larger listings, and a smoother product discovery flow.
              </p>
              <Link to="/products" className="button-3d mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-forest transition hover:bg-mist">
                Explore the Catalog <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container-shell" data-reveal>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          <div className="overflow-hidden rounded-[2.5rem] bg-white/80 p-4 shadow-card">
            <img src={customerImageOne} alt="Style story" loading="lazy" className="media-3d-surface h-56 w-full rounded-[2rem] object-cover sm:h-64" />
            <div className="px-2 pb-2 pt-5">
              <p className="text-xs uppercase tracking-[0.24em] text-clay">Wardrobe Edit</p>
              <h3 className="mt-2 font-display text-3xl text-ink">Smart layers with easy structure</h3>
            </div>
          </div>

          <div className="overflow-hidden rounded-[2.5rem] bg-white/80 p-4 shadow-card">
            <img src={loafersImage} alt="Loafers collection" loading="lazy" className="media-3d-surface h-56 w-full rounded-[2rem] object-cover sm:h-64" />
            <div className="px-2 pb-2 pt-5">
              <p className="text-xs uppercase tracking-[0.24em] text-clay">Footwear Focus</p>
              <h3 className="mt-2 font-display text-3xl text-ink">Classic lines, sharper finishing</h3>
            </div>
          </div>

          <div className="overflow-hidden rounded-[2.5rem] bg-white/80 p-4 shadow-card sm:col-span-2 xl:col-span-1">
            <img src={customerImageTwo} alt="Accessories collection" loading="lazy" className="media-3d-surface h-56 w-full rounded-[2rem] object-cover sm:h-64" />
            <div className="px-2 pb-2 pt-5">
              <p className="text-xs uppercase tracking-[0.24em] text-clay">Accessories</p>
              <h3 className="mt-2 font-display text-3xl text-ink">Finishing pieces that change the mood</h3>
            </div>
          </div>
        </div>
      </section>

      <section className="container-shell" data-reveal>
        <div className="mb-10">
          <p className="text-xs uppercase tracking-[0.2em] text-clay">Catalog preview</p>
          <h2 className="section-title mt-2">A broader look at the collection</h2>
        </div>
        <ProductGrid
          products={catalogQuery.data?.items}
          isLoading={catalogQuery.isLoading}
          isError={catalogQuery.isError}
          errorMessage="The catalog preview could not be loaded right now."
          emptyMessage="No products are available in the catalog preview right now."
        />
        <div className="mt-8 flex justify-center">
          <Link to="/products" className="button-3d inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:bg-clay">
            Explore More <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <section className="container-shell" data-reveal>
        <div className="grid gap-4 rounded-[2.5rem] bg-ink p-5 text-white sm:p-6 md:grid-cols-2 xl:grid-cols-4">
          {trustItems.map((item) => (
            <div key={item.title} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
              <item.icon size={18} className="text-gold" />
              <h3 className="mt-4 font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-white/60">Confidence-building commerce details, styled to feel premium.</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden bg-ink text-white shadow-card" data-reveal>
        <video
          className="h-[420px] w-full object-cover sm:h-[520px] lg:h-[640px]"
          src={signatureStoryVideo}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-label="Vastraalane signature collection video"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/82 via-ink/38 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_25%,rgba(213,174,111,0.28),transparent_30%)]" />
        <div className="container-shell absolute inset-0 flex items-end pb-10 sm:pb-14 lg:items-center">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-gold">Vastraalane Story</p>
            <h2 className="mt-4 font-display text-[clamp(2.4rem,7vw,5.8rem)] leading-[0.92]">
              Style in motion, made for the next drop.
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-8 text-white/76 sm:text-base">
              Explore a richer visual edit built around texture, movement, and statement pieces across the collection.
            </p>
            <Link
              to="/products"
              className="button-3d mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-ink transition hover:bg-mist"
            >
              Discover More <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
