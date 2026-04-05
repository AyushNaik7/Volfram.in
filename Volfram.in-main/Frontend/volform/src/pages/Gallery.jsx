import { useState } from "react";

const categories = ["All Projects", "Boilers", "Installations", "Controls", "Maintenance"];

const galleryItems = [
  {
    name: "Champion Gasket",
    sub: "Volfram Auto Blow Down System",
    image: "/Gallery/image.png", 
    category: "Installations",
  },
  {
    name:"Clean Science",
    sub: "Volfram Pressure Reducing Station",
    image: "/Gallery/image-copy.png",
    category: "Boilers",
  },
  {
    name:"IPMC",
    sub:"Volfram Pressure Reducing System",
    image:"/Gallery/image-copy-2.png",
    category:"Controls",

  },
  {
    name:"Cipla",
    sub:"Volfram Heating Cooling System",
    image:"/Gallery/image-copy-3.png",
    category:"Maintenance",
  },
  {
    name:"volfram",
    sub:"Volfram Pressure Reducing System",
    image:"/Gallery/image-copy-4.png",
    category:"Maintenance",
  },
  {
    name:"Pepsico Riyad",
    sub:"Volfram Strainer",
    image:"/Gallery/image-copy-5.png",
    category:"Boilers",
  },
  {
    name:"Indocount",
    sub:"Volfram Pressure Reducing System ",
    image:"/Gallery/image-copy-6.png",
    category:"Boilers",
  },
  {
    name:"Champion Gasket",
    sub:"Volfram Chimaney",
    image:"/Gallery/image-copy-7.png",
    category:"Boilers",
  },
  {
    name:"Pressure Reducing System",
    sub:"Volfram Pressure Reducing System",
    image:"/Gallery/image-copy-4.png",
    category:"Boilers",

  },
  {
    name:"Heating Cooling System",
    sub:"Volfram Heating Cooling System",
    image:"/Gallery/image-copy-3.png",
    category:"Boilers",
  },
  {
    name:"Strainer",
    sub:"Volfram Strainer",
    image:"/Gallery/image-copy-5.png",
    category:"Boilers",
  }
];

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState("All Projects");
  const [activeItem, setActiveItem] = useState(null);

  // ✅ Filtering logic
  const filteredItems =
    activeCategory === "All Projects"
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeCategory);

  return (
    <div className="page-shell">
      {/* HERO */}
      <section className="hero-section py-20 md:py-24">
        <div className="container-custom relative z-10">
          <span className="badge-industrial mb-4">Gallery</span>
          <h1 className="max-w-4xl text-4xl leading-tight text-white md:text-6xl md:leading-tight">
            Project & Installation Highlights
          </h1>
          <p className="mt-6 max-w-3xl text-lg text-slate-100">
            A glimpse into our field execution, plant integration and steam system modernization projects.
          </p>
        </div>
      </section>

      {/* FILTER */}
      <section className="section-white">
        <div className="container-custom">
          <div className="mb-8 flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={
                  activeCategory === category
                    ? "btn-primary px-4 py-2"
                    : "btn-outline-primary px-4 py-2"
                }
              >
                {category}
              </button>
            ))}
          </div>

          {/* GALLERY GRID */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
            {filteredItems.map((item, index) => (
              <article
                key={index}
                className="card cursor-pointer hover:scale-105 transition duration-300"
                onClick={() => setActiveItem(item)}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="mb-4 aspect-video w-full rounded-md object-cover"
                />
                <p className="text-sm font-semibold text-secondary">{item.category}</p>
                <h3 className="mt-2 text-lg">{item.name}</h3>
                <p className="text-muted">{item.sub}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* MODAL */}
      {activeItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setActiveItem(null)}
        >
          <div
            className="w-full max-w-2xl rounded-xl bg-white p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={activeItem.image}
              alt={activeItem.name}
              className="aspect-video w-full rounded-md object-cover"
            />

            <h2 className="mt-5 text-2xl text-primary">{activeItem.name}</h2>
            <p className="mt-2 text-muted">{activeItem.sub}</p>

            <button
              className="btn-primary mt-6"
              onClick={() => setActiveItem(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}