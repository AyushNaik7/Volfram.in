import aboutImage from "../assets/hero.png";

const topCards = [
  {
    title: "Safety",
    text: "We believe that life is precious. The most important thing for us is to ensure that our business operations and products are safe for people.",
  },
  {
    title: "Customer Service Excellence",
    text: "We are defined by our unwavering commitment towards providing our customers with excellent service.",
  },
  {
    title: "Integrity & Compliance",
    text: "We work in a complex industry and know that an approach based on integrity and full compliance will provide us with a sustainable business in the long term.",
  },
  {
    title: "Innovation",
    text: "We are aware of the ever-changing needs of our customers and are focused on developing new products to meet the needs of the future.",
  },
];

const visionPoints = [
  "Putting the Customer First",
  "Helping Customer Improving Efficiency",
  "Critical Needs Powerful Solutions",
  "Reliable Products Measurable Impact",
];

const purposePoints = [
  "To deliver an outstanding, sustainable, efficient steam systems to our customers",
  "To provide exceptional service to our customers",
  "To build a bright and secure future for everyone involved in our business",
];

const commitmentPoints = [
  "We are always positive and helpful",
  "We always go the extra mile for our customers",
  "We always look ahead and search for ways to provide a better, safer and more efficient products and services",
  "We believe our customers are for life",
];

const passionPoints = [
  "Designing simple reliable solutions",
  "Keep innovating and improving the products",
];

function TextPanel({ title, points, tone = "dark" }) {
  const panelClass = tone === "dark" ? "bg-primary text-white" : "bg-[#b8d0f2] text-primary";
  const textClass = tone === "dark" ? "text-slate-100" : "text-primary";
  return (
    <div className={`${panelClass} h-full p-8 md:p-14`}>
      <h3 className="font-heading text-3xl font-semibold uppercase tracking-wide">{title}</h3>
      <div className="mt-4 h-[1px] w-56 bg-current/35" />
      <ul className="mt-6 space-y-4">
        {points.map((point) => (
          <li key={point} className={`text-sm leading-relaxed md:text-base ${textClass}`}>
            • {point}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function AboutUs() {
  return (
    <div className="page-shell">
      <section className="bg-primary py-18 text-white md:py-22">
        <div className="container-custom text-center">
          <h1 className="text-4xl text-white md:text-6xl">About Volfram</h1>
          <p className="mx-auto mt-8 max-w-3xl text-lg text-slate-100">
            We are fully committed to providing you with customer service excellence.
            <br className="hidden md:block" />
            It is fundamental to our approach.
          </p>
          <p className="mx-auto mt-10 max-w-4xl text-lg text-slate-100">
            We do this by listening to you. Sounds simple, does not it ?
            <br className="hidden md:block" />
            But if we understand what you need, we can easily deliver a tailored service and products to meet your requirements.
          </p>

          <div className="mt-14 grid grid-cols-1 gap-6 text-left md:grid-cols-2">
            {topCards.map((card) => (
              <article key={card.title} className="border-t border-white/35 pt-5">
                <h2 className="text-2xl text-white">{card.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-100">{card.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-white py-0">
        <img src={"/AboutUs/image.png"} alt="Volfram team" className="h-[800px] w-full object-cover" />
      </section>

      <section className="section-white py-14">
        <div className="container-custom text-center">
          <h2 className="text-4xl font-semibold uppercase tracking-wide text-primary md:text-5xl">Delivering Vision</h2>
          <div className="mx-auto mt-6 max-w-3xl space-y-2">
            {visionPoints.map((point) => (
              <p key={point} className="text-2xl text-text-secondary md:text-3xl">{point}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="section-white py-0">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <TextPanel title="Our Purpose" points={purposePoints} tone="dark" />
          <img src={"/AboutUs/imagecopy.png"} alt="Volfram presentation" className="h-[800px] w-full object-cover" />
        </div>
      </section>

      <section className="section-white py-0">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <img src={"/AboutUs/imagecopy2.png"} alt="Volfram commitment" className="h-[800px] w-full object-cover md:order-1" />
          <div className="md:order-2">
            <TextPanel title="Our Commitment" points={commitmentPoints} tone="light" />
          </div>
        </div>
      </section>

      <section className="section-white py-0">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <TextPanel title="Our Passion" points={passionPoints} tone="dark" />
          <img src={"/AboutUs/imagecopy3.png"} alt="Volfram annual meet" className="h-[800px] w-full object-cover" />
        </div>
      </section>
    </div>
  );
}
