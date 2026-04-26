import { useMemo, useState } from "react";

const categories = ["All", "Brochures", "Manuals", "Guides", "Certificates"];

const resources = [
  { title: "Steam Boiler Solutions Brochure", type: "Brochures", size: "2.4 MB" },
  { title: "Condensate Recovery System Brochure", type: "Brochures", size: "1.9 MB" },
  { title: "Smart Boiler Controller Manual", type: "Manuals", size: "4.8 MB" },
  { title: "Steam Distribution Installation Guide", type: "Guides", size: "3.1 MB" },
  { title: "Safety Compliance Checklist", type: "Guides", size: "1.4 MB" },
  { title: "Quality Certification Documents", type: "Certificates", size: "0.9 MB" },
];

export default function Downloads() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filtered = useMemo(() => {
    if (selectedCategory === "All") {
      return resources;
    }
    return resources.filter((item) => item.type === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="page-shell">
      <section className="hero-section py-20 md:py-24">
        <div className="container-custom relative z-10">
          <span className="badge-industrial mb-4">Downloads</span>
          <h1 className="max-w-4xl text-4xl leading-tight text-white md:text-6xl md:leading-tight">Technical Resource Center</h1>
          <p className="mt-6 max-w-3xl text-lg text-slate-100">
            Access brochures, manuals and key technical documents for faster decision-making.
          </p>
        </div>
      </section>

      <section className="section-white">
        <div className="container-custom">
          <div className="mb-8 flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? "btn-primary px-4 py-2" : "btn-outline-primary px-4 py-2"}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item) => (
              <article key={item.title} className="card">
                <p className="text-sm font-semibold text-secondary">{item.type}</p>
                <h2 className="mt-2 text-xl text-primary">{item.title}</h2>
                <p className="mt-2 text-sm">File size: {item.size}</p>
                <button className="btn-outline-primary mt-5 px-4 py-2">Download</button>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
