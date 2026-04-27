import customerCareImage from "../../Videos/PS.jpg";
import supportImage from "../../Videos/3.jpeg";

export default function CustomerCare() {
  return (
    <div className="container-shell py-12">
      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[3rem] bg-white/85 p-8 shadow-card lg:p-12">
          <p className="text-xs uppercase tracking-[0.2em] text-clay">Customer Care</p>
          <h1 className="mt-4 font-display text-5xl text-ink">We&apos;re here to help with anything you need.</h1>
          <p className="mt-6 text-base leading-8 text-ink/70">
            Have any questions or need more information about our products? Either way, you&apos;re in the right spot to contact us.
          </p>

          <div className="mt-8 rounded-[2rem] bg-mist p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-clay">Contact Us</p>
            <a href="mailto:info@vastraalane.com" className="mt-4 inline-block text-lg font-semibold text-ink transition hover:text-clay">
              info@vastraalane.com
            </a>
            <p className="mt-3 text-sm leading-7 text-ink/70">Monday - Saturday: 10:00 AM - 8:00 PM</p>
          </div>

          <div className="mt-6 rounded-[2rem] bg-ink p-6 text-white">
            <p className="text-xs uppercase tracking-[0.2em] text-gold">Support Promise</p>
            <p className="mt-4 text-sm leading-7 text-white/75">
              We aim to respond with clarity, helpful guidance, and the right assistance for product, order, and shopping queries.
            </p>
          </div>
        </div>

        <div className="grid gap-6">
          <div className="overflow-hidden rounded-[3rem] bg-white/80 p-6 shadow-card">
            <img
              src={customerCareImage}
              alt="Vastraalane customer care hero"
              className="h-[380px] w-full rounded-[2.25rem] object-cover"
            />
          </div>
          <div className="overflow-hidden rounded-[3rem] bg-white/80 p-6 shadow-card">
            <img
              src={supportImage}
              alt="Vastraalane support details"
              className="h-[220px] w-full rounded-[2.25rem] object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
