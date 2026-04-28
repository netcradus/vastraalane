export default function TermsConditions() {
  return (
    <div className="container-shell py-12">
      <div className="mx-auto max-w-5xl rounded-[3rem] bg-white/85 p-8 shadow-card lg:p-12">
        <p className="text-xs uppercase tracking-[0.2em] text-clay">Terms & Conditions</p>
        <h1 className="mt-4 font-display text-5xl text-ink">Please read these terms carefully before using our services.</h1>

        <div className="mt-10 grid gap-8 text-sm leading-8 text-ink/75">
          <section>
            <h2 className="font-display text-3xl text-ink">General</h2>
            <p className="mt-3">
              Welcome to Vastraalane! By accessing or using our website, you agree to comply with and be bound by the following terms and conditions.
            </p>
          </section>

          <section>
            <h2 className="font-display text-3xl text-ink">Ordering Policy</h2>
            <p className="mt-3">Orders once placed cannot be modified.</p>
            <p>Ensure your shipping address and contact details are accurate.</p>
            <p>In case of suspected fraudulent transactions, we may cancel orders.</p>
          </section>

          <section>
            <h2 className="font-display text-3xl text-ink">Payment Policy</h2>
            <p className="mt-3">We accept all major credit/debit cards, UPI, and net banking.</p>
            <p>Cash on Delivery (COD) may be available in select locations.</p>
            <p>Payments must be made in full before shipping.</p>
          </section>

          <section>
            <h2 className="font-display text-3xl text-ink">Shipping Policy</h2>
            <p className="mt-3">Standard delivery timeline: 5–7 business days and may vary by location.</p>
            <p>Delays due to unforeseen circumstances such as strikes or weather are not our liability.</p>
            <p>Shipping charges, if applicable, will be displayed at checkout.</p>
          </section>

          <section>
            <h2 className="font-display text-3xl text-ink">Return & Refund Policy</h2>
            <p className="mt-3">Returns are accepted within 7 days if the product is unused and tags remain intact.</p>
            <p>Customized items are non-returnable.</p>
            <p>Refunds are processed within 7–10 business days after product inspection.</p>
          </section>

          <section>
            <h2 className="font-display text-3xl text-ink">Liability Disclaimer</h2>
            <p className="mt-3">
              Vastraalane shall not be held responsible for any indirect, incidental, or consequential damages arising out of the use of our products or website.
            </p>
          </section>

          <section>
            <h2 className="font-display text-3xl text-ink">Governing Law</h2>
            <p className="mt-3">
              These terms and conditions shall be governed by the laws of India. Any disputes will be subject to the jurisdiction of courts in Delhi, India.
            </p>
          </section>

          <section>
            <h2 className="font-display text-3xl text-ink">Contact Us</h2>
            <p className="mt-3">Email: info@vastraalane.com</p>
            <p>Working Hours: Mon–Sat (10 AM – 8 PM)</p>
          </section>
        </div>
      </div>
    </div>
  );
}
