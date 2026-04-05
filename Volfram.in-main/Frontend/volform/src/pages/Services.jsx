import { Link } from "react-router-dom";

const services = [
  {
    title: "Steam Generation",
    description: "Reliable and efficient steam boiler systems engineered for high uptime.",
    features: ["Electric, Gas and Oil Fired Options", "High Pressure Solutions", "Smart Boiler Controls"],
  },
  {
    title: "Boiler House Accessories",
    description: "Complete accessories to improve safety, automation and system performance.",
    features: ["Safety Valves & Gauges", "Control Panels", "Feed Water Systems"],
  },
  {
    title: "Steam Distribution",
    description: "Low-loss steam routing with precise pressure and temperature management.",
    features: ["Piping & Valving", "Steam Traps", "Pressure Reducing Stations"],
  },
  {
    title: "Customized Package Solutions",
    description: "Built-to-process solutions for specific plant requirements and constraints.",
    features: ["Turnkey Packages", "Retrofit & Upgrade", "Performance Optimization"],
  },
  {
    title: "Instrumentation & Monitoring",
    description: "Real-time control and data visibility for better operational decisions.",
    features: ["Pressure Transmitters", "Data Logging", "Remote Monitoring"],
  },
  {
    title: "Maintenance & Support",
    description: "Preventive, corrective and emergency support to keep systems stable.",
    features: ["Planned Maintenance", "On-call Support", "Operator Assistance"],
  },
];

export default function Services() {
  return (
    <div className="page-shell">
      <section className="hero-section py-20 md:py-24">
        <div className="container-custom relative z-10">
          <span className="badge-industrial mb-4">Our Services</span>
          <h1 className="max-w-4xl text-4xl leading-tight text-white md:text-6xl md:leading-tight">Comprehensive Steam Engineering Services</h1>
          <p className="mt-6 max-w-3xl text-lg text-slate-100">
            From generation to distribution and control, we deliver complete support for efficient and safe steam operations.
          </p>
          <img src="/Services/image1.png" alt="" />
        </div>
      </section>
      <section>
          <div className="container-custom">
            <h2 className="text-3xl text-primary">Our Expertise</h2>
            <p className="mt-4 text-lg text-text-secondary">
              With decades of experience, our team of engineers and technicians are experts in steam system design, installation and maintenance. We understand the unique challenges of steam applications across industries and are committed to delivering solutions that optimize performance, reduce costs and ensure safety.
            </p>
            <img src="/Services/image2.png" alt="" />
          </div>
      </section>

      <section className="section-white">
        <div className="container-custom grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <article key={service.title} className="card">
              <h2 className="text-2xl text-primary">{service.title}</h2>
              <p className="mt-3">{service.description}</p>
              <ul className="mt-4 space-y-2 text-sm text-text-secondary">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <span className="mt-1.5 inline-block h-1.5 w-1.5 rounded-full bg-accent" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="section-gradient py-14">
        <div className="container-custom flex flex-col items-start justify-between gap-5 md:flex-row md:items-center">
          <div>
            <h2 className="text-3xl text-white">Need A Custom Steam Solution?</h2>
            <p className="subtext mt-2">Share your process challenge and our engineers will recommend the right service mix.</p>
          </div>
          <Link to="/contact" className="btn-outline-white">Request Consultation</Link>
        </div>
      
      </section>
    </div>
  );
}
