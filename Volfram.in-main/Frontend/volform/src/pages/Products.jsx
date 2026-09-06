import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchSectionImages } from "../services/api";

const categories = [
  {
    title: "Steam Generation",
    items: ["Electric Steam Boilers", "Gas Fired Steam Boilers", "Oil Fired Steam Boilers", "Compact Steam Generators"],
  },
  {
    title: "Boiler House Accessories",
    items: ["Pressure Gauges", "Safety Valves", "Feed Water Systems", "Steam Traps"],
  },
  {
    title: "Steam Distribution",
    items: ["Control Valves", "Moisture Separators", "Condensate Recovery Meters", "Pressure Stations"],
  },
  {
    title: "Control & Instrumentation",
    items: ["Smart Boiler Controller", "Pressure Transmitters", "Data Logging Modules", "Monitoring Systems"],
  },
  {
    title: "Customized Solutions",
    items: ["Turnkey Steam Packages", "Retrofit Kits", "Pharma-Grade Systems", "Process Optimization"],
  },
];

export default function Products() {
  const [productImages, setProductImages] = useState([]);

  useEffect(() => {
    fetchSectionImages('products')
      .then(setProductImages)
      .catch(error => console.error('Failed to load product images:', error));
  }, []);

  const API_URL = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:7000';

  return (
    <div className="page-shell">
      <section className="hero-section py-20 md:py-24">
        <div className="container-custom relative z-10">
          <span className="badge-industrial mb-4">Products</span>
          <h1 className="max-w-4xl text-4xl leading-tight text-white md:text-6xl md:leading-tight">Products For Every Steam System</h1>
          <p className="mt-6 max-w-3xl text-lg text-slate-100">
            Standard and custom-engineered product lines to build safe, efficient and measurable steam operations.
          </p>
        </div>
      </section>

      {productImages.length > 0 && (
        <section className="section-white">
          <div className="container-custom">
            <h2 className="text-3xl text-primary">Product highlights</h2>
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {productImages.map(image => (
                <figure key={image._id} className="overflow-hidden rounded-md border border-slate-200 bg-white">
                  <img src={`${API_URL}${image.imageUrl}`} alt={image.caption || 'Product'} className="h-56 w-full object-cover" />
                  {image.caption && <figcaption className="p-3 text-sm font-semibold text-primary">{image.caption}</figcaption>}
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section-light">
        <div className="container-custom grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <article key={category.title} className="card">
              <h2 className="text-2xl text-primary">{category.title}</h2>
              <ul className="mt-4 space-y-2 text-sm text-text-secondary">
                {category.items.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-1.5 inline-block h-1.5 w-1.5 rounded-full bg-secondary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="section-white">
        <div className="container-custom grid grid-cols-1 gap-6 md:grid-cols-2">
          <article className="card">
            <h2 className="text-3xl">Distribution Partnerships</h2>
            <p className="mt-3">Principal Distributor for India, Bangladesh and Sri Lanka.</p>
            <div className="mt-5 space-y-3 text-sm">
              <p className="rounded-md bg-slate-50 p-3"><span className="font-semibold text-primary">Walchem:</span> Process controllers and analytical instrumentation.</p>
              <p className="rounded-md bg-slate-50 p-3"><span className="font-semibold text-primary">Pyxis Lab:</span> Precision measurement and process reliability tools.</p>
            </div>
          </article>

          <article className="card">
            <h2 className="text-3xl">Need Product Selection Help?</h2>
            <p className="mt-3">Get engineer-backed recommendations for your exact pressure, capacity and control needs.</p>
            <Link to="/contact" className="btn-primary mt-6">Get Product Consultation</Link>
          </article>
        </div>
      </section>
    </div>
  );
}
