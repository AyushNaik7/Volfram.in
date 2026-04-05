import { useState } from "react";

const sectors = [
  { name: "Pharmaceutical & Chemical", count: "170+" },
  { name: "Food & Beverage", count: "140+" },
  { name: "Textile & Paper", count: "155+" },
  { name: "Oil & Gas", count: "135+" },
];

const photo = [
  { img: "/Clients/image-copy-2.png" },
  { img: "/Clients/image-copy-3.png" },
  { img: "/Clients/image-copy-4.png" },
  { img: "/Clients/image-copy-5.png" },
  { img: "/Clients/image-copy-6.png" },
  { img: "/Clients/image-copy-7.png" },
  { img: "/Clients/image-copy-8.png" },
  { img: "/Clients/image-copy-9.png" },
  { img: "/Clients/image-copy-10.png" },
  { img: "/Clients/image-copy-11.png" },
  { img: "/Clients/image-copy-12.png" },
  { img: "/Clients/image-copy-13.png" },
  { img: "/Clients/image-copy-14.png" },
  { img: "/Clients/image-copy-15.png" },
  { img: "/Clients/image-copy-16.png" },
  { img: "/Clients/image-copy-17.png" },
  { img: "/Clients/image-copy-18.png" },
  { img: "/Clients/image-copy-19.png" },
  {
    img: "/Clients/image.png",
  },
  { img: "/Clients/img1.png",},
  {img: "/Clients/img2.png",},
  {img: "/Clients/img3.png",},
  {img: "/Clients/img4.png",},
  {
    img: "/Clients/img5.png",
  }
  ,{img: "/Clients/img6.png",}
  ,
  {img: "/Clients/img8.png"},
  {img: "/Clients/img9.png"},
  {img: "/Clients/img10.png"},
  {img: "/Clients/img11.png"},
  {img: "/Clients/img12.png"},
  {img: "/Clients/img13.png"},
  { img: "/Clients/img14.png"},
  {img:"/Clients/Screenshot1.png"},
  {img:"/Clients/Screenshot2.png"},
  {img:"/Clients/Screenshot3.png"},
  {img:"/Clients/Screenshot4.png"},
  {img:"/Clients/Screenshot5.png"},
  {img:"/Clients/Screenshot6.png"},
  {img:"/Clients/Screenshot7.png"},
  {img:"/Clients/Screenshot8.png"},
  {img:"/Clients/Screenshot9.png"},
  {img:"/Clients/Screenshot10.png"},
  {img:"/Clients/Screenshot11.png"},
  {img:"/Clients/Screenshot12.png"},
  {img:"/Clients/Screenshot13.png"},
  {img:"/Clients/Screenshot14.png"},
  {img:"/Clients/Screenshot15.png"},
  {img:"/Clients/Screenshot16.png"},
  {img:"/Clients/Screenshot17.png"},
  {img:"/Clients/Screenshot18.png"},
  {img:"/Clients/Screenshot19.png"},
  {img:"/Clients/Screenshot20.png"},
  {img:"/Clients/Screenshot21.png"},
  {img:"/Clients/Screenshot22.png"},
  {img:"/Clients/Screenshot23.png"},
  {img:"/Clients/Screenshot24.png"},
  {img:"/Clients/Screenshot25.png"},
  {img:"/Clients/Screenshot26.png"},
  {img:"/Clients/Screenshot27.png"},
  {img:"/Clients/Screenshot28.png"},
  {img:"/Clients/Screenshot29.png"},
  {img:"/Clients/Screenshot30.png"},
  {img:"/Clients/Screenshot31.png"},
  {img:"/Clients/Screenshot32.png"},
  {img:"/Clients/Screenshot33.png"},  
  {img:"/Clients/Screenshot34.png"}


];

const testimonials = [
  {
    company: "Process Plant, Pune",
    quote:
      "Volfram improved our steam reliability and helped reduce unplanned stoppages significantly.",
  },
  {
    company: "Food Manufacturing Unit",
    quote:
      "Strong technical depth and practical recommendations. Execution quality was excellent.",
  },
  {
    company: "Pharma Utilities Team",
    quote:
      "Their instrumentation and control approach gave us better visibility and stable operation.",
  },
];

export default function Clients() {
  return (
    <div className="page-shell">
      
      {/* HERO SECTION */}
      <section className="hero-section py-20 md:py-24">
        <div className="container-custom relative z-10">
          <span className="badge-industrial mb-4">Our Clients</span>

          <h1 className="max-w-4xl text-4xl leading-tight text-white md:text-6xl">
            Trusted By 600+ Customers
          </h1>

          <p className="mt-6 max-w-3xl text-lg text-slate-100">
            We support production-critical industries with dependable steam
            systems and responsive service.
          </p>
        </div>
      </section>

      {/* METRICS */}
      <section className="section-dark">
        <div className="container-custom grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            ["600+", "Happy Customers"],
            ["422+", "Condensate Systems"],
            ["12+", "Years Of Service"],
            ["99%", "Customer Retention"],
          ].map(([value, label]) => (
            <div
              key={label}
              className="metric-card text-center hover:scale-105 transition"
            >
              <p className="text-3xl font-bold text-white">{value}</p>
              <p className="subtext mt-1 text-sm">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* INDUSTRIES */}
      <section className="section-white">
        <div className="container-custom">
          <h2 className="text-3xl md:text-4xl">
            Industries We Serve
          </h2>

          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
            {sectors.map((sector) => (
              <article
                key={sector.name}
                className="card text-center hover:shadow-xl transition"
              >
                <p className="text-3xl font-bold text-primary">
                  {sector.count}
                </p>
                <h3 className="mt-2 text-lg">{sector.name}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CLIENT LOGOS */}
      <section className="section-white">
        <div className="container-custom">
          <h2 className="text-5xl md:text-5xl">
            Some of Our Valued Clients
          </h2>

          <div className="mt-8 grid grid-cols-4 gap-4 md:grid-cols-4 lg:grid-cols-6">
            {photo.map((item, index) => (
              <div
                key={index}
                className="bg-white p-3 rounded-xl shadow-sm hover:shadow-lg transition"
              >
                <img
                  src={item.img}
                  alt={`client-${index}`}
                  className="w-full h-40 object-contain whitescale hover:whitescale-0 transition duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section-light">
        <div className="container-custom">
          <h2 className="text-3xl md:text-4xl">
            What Clients Say
          </h2>

          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
            {testimonials.map((item) => (
              <article
                key={item.company}
                className="card hover:shadow-xl transition"
              >
                <p className="italic text-text-primary">
                  "{item.quote}"
                </p>

                <p className="mt-4 text-sm font-semibold text-secondary">
                  {item.company}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}