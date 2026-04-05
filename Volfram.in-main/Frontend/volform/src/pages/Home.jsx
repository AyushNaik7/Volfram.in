import { Link } from "react-router-dom";

const highlights = [
  {
    duration: "00:57",
    title: "Volfram Auto Blow Down System",
    text: "Reliable TDS-based automatic blowdown control with real-time conductivity and temperature monitoring.",
  },
  {
    duration: "02:14",
    title: "Boiler India Exhibition 2022",
    text: "Global networking and innovation showcase focused on sustainable boiler industry growth.",
  },
  {
    duration: "01:42",
    title: "Boiler World Expo Africa 2023",
    text: "Industry collaboration, technical exchange and global steam engineering presence.",
  },
  {
    duration: "01:46",
    title: "Boiler India Expo 2024",
    text: "Launch of Smart Boiler Controller with excellent customer response and major booth footfall.",
  },
];

const sectors = [
  "Pharmaceutical & Chemical",
  "Food & Beverage",
  "Textile & Paper",
  "Oil & Gas",
];

const solutions = [
  {
    title: "Steam Generation",
    text: "Reliable and efficient steam boiler systems for steady, high-quality output.",
  },
  {
    title: "Boiler House Accessories",
    text: "From feed tank to automatic blowdown systems for complete boiler reliability.",
  },
  {
    title: "Steam Distribution",
    text: "Efficient pressure and temperature control for low-loss steam distribution.",
  },
  {
    title: "Customized Package Solutions",
    text: "Custom-built systems designed around your exact process and production requirements.",
  },
];

const products = [
  "Blow Down Controller",
  "Y Type Strainer",
  "Condensate Contamination Monitoring & Control System",
  "Fabricated Y Type Strainer",
  "Thermostatic Clean Steam Trap",
  "Steam Injector",
  "Moisture Separator",
  "Pressure Gauge",
  "Condensate Recovery Meter",
  "Globe Valves",
  "SS Safety Valve",
  "CI Ball Float Trap",
  "Piston Actuated Valve",
];

export default function Home() {
  return (
    
    <div className="page-shell">
      <img
              src="/Clients/homepage.png"
              alt="Boiler Room"
              className="h-full w-full object-cover object-center"
            />
      <section className="hero-section py-20 md:py-24">
        <div className="container-custom relative z-10">
          <div className="badge-industrial mb-5 color:white">Trusted Steam Engineering Since 2012</div>
          
          <h1 className="max-w-4xl text-4xl leading-tight text-white md:text-6xl md:leading-tight">
            Engineering Solutions For A Changing Industrial World
          </h1>
          <p className="mt-6 max-w-3xl text-lg text-slate-100 md:text-xl">
            We are Volfram. With 600+ happy customers and 422+ condensate recovery systems installed,
            we deliver dependable steam generation, distribution and control solutions.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Link to="/contact" className="btn-cta">
              Talk To Expert Team
            </Link>
            <Link to="/products" className="btn-outline-white">
              Explore Products
            </Link>
          </div>
        </div>
      </section>
      

      <section className="section-white">
        <div className="container-custom">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl">Industrial Confidence In Every Project</h2>
              <p className="mt-2 max-w-3xl">
                Smart controls, stable performance and field-proven support that plant teams can trust.
              </p>
            </div>
            <span className="badge-industrial">Glorious 12 Years Serving The Industry</span>
          </div>
          

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              ["600+", "Happy Customers Globally"],
              ["422+", "Condensate Recovery Systems"],
              ["12+", "Years Of Engineering Service"],
              ["3 Countries", "India, Bangladesh, Sri Lanka"],
            ].map(([value, label]) => (
              <article key={label} className="card text-center">
                <p className="text-3xl font-bold text-primary">{value}</p>
                <p className="mt-2 text-sm">{label}</p>
              </article>
            ))}

          </div>
        </div>
        
      </section>
      

      <section className="section-light">
        
        <div className="container-custom">
          <img
              src="/Clients/homepage2.png"
              alt="Boiler Room"
              className="h-full w-full object-cover object-center"
            />
            <br />
          <h2 className="text-3xl md:text-4xl">Recent Highlights</h2>
          <p className="mt-2 max-w-3xl">Events, product launches and field stories from the boiler world.</p>
          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
            {highlights.map((item) => (
              <article key={item.title} className="card">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  <span>{item.duration}</span>
                  <span>Video Highlight</span>
                </div>
                <h3 className="text-xl">{item.title}</h3>
                <p className="mt-3">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-dark">
        <div className="container-custom">
          <img
              src="/Clients/homepage3.png"
              alt="Boiler Room"
              className="h-full w-full object-cover object-center"
            />
            <br />
          <h2 className="text-3xl md:text-4xl">Together We Make Industry Efficient And Safe</h2>
          <p className="subtext mt-3 max-w-3xl">
            Specialized steam engineering for regulated and high-performance environments.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            {sectors.map((sector) => (
              <div key={sector} className="metric-card">
                <p className="text-base font-semibold text-white">{sector}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-white">
        <div className="container-custom">
          <h2 className="text-3xl md:text-4xl">Core Service Portfolio</h2>
          <p className="mt-2 max-w-3xl">Precision-built offerings to improve uptime, process stability and energy efficiency.</p>
          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
            {solutions.map((item) => (
              <article key={item.title} className="card">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-md bg-secondary/10 text-secondary">
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl text-primary">{item.title}</h3>
                <p className="mt-3">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-light">
        <div className="container-custom">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-3xl md:text-4xl">Products For Every Steam System</h2>
            <Link to="/products" className="btn-outline-primary">
              See Full Product Range
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((item) => (
              <div key={item} className="card py-4">
                <p className="font-medium text-text-primary">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-gradient py-14">
        <div className="container-custom flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl text-white">Build A Smarter Boiler House With Volfram</h2>
            <p className="subtext mt-2 max-w-3xl">
              No complexity, no guesswork. Get practical engineering and dependable support from concept to commissioning.
            </p>
          </div>
          <Link to="/contact" className="btn-outline-white">
            Start Your Project
          </Link>
        </div>
      </section>
    </div>
  );
}
