import aboutImage from "../../Videos/Handbags.jpeg";
import aboutImageSecondary from "../../Videos/Perfumes.jpeg";

export default function About() {
  return (
    <div className="container-shell py-12">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[3rem] bg-white/80 p-8 shadow-card lg:p-12">
          <p className="text-xs uppercase tracking-[0.2em] text-clay">About Vastraalane</p>
          <h1 className="mt-4 font-display text-5xl text-ink">Style-led collections designed for everyday confidence.</h1>
          <p className="mt-6 text-base leading-8 text-ink/70">
            Vastraalane brings together fashion, accessories, footwear, fragrances, and statement pieces in one curated shopping destination.
            Every collection is presented with a premium visual language so browsing feels polished, elegant, and easy.
          </p>
          <p className="mt-4 text-base leading-8 text-ink/70">
            Our focus is simple: better style, smoother shopping, and dependable customer care. From trending edits to everyday essentials,
            Vastraalane is designed to help shoppers discover pieces that feel current, wearable, and memorable.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-[2rem] bg-mist p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-clay">Customer Care</p>
              <p className="mt-3 text-sm leading-7 text-ink/70">Monday - Saturday</p>
              <p className="text-sm leading-7 text-ink/70">10:00 AM - 8:00 PM</p>
              <a href="mailto:info@vastraalane.com" className="text-sm leading-7 text-ink/70 transition hover:text-clay">
                info@vastraalane.com
              </a>
            </div>
            <div className="rounded-[2rem] bg-ink p-5 text-white">
              <p className="text-xs uppercase tracking-[0.2em] text-gold">Our Promise</p>
              <p className="mt-3 text-sm leading-7 text-white/75">
                Carefully presented collections, accessible service, and a shopping experience built around clarity and trust.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          <div className="overflow-hidden rounded-[3rem] bg-gradient-to-br from-mist to-white p-6 shadow-card">
            <img
              src={aboutImage}
              alt="Vastraalane collection"
              className="h-[420px] w-full rounded-[2.25rem] object-cover"
            />
          </div>
          <div className="overflow-hidden rounded-[3rem] bg-white/80 p-6 shadow-card">
            <img
              src={aboutImageSecondary}
              alt="Vastraalane fragrances"
              className="h-[220px] w-full rounded-[2.25rem] object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
