import { useState } from "react";

const events = [
  {
    title: "Boiler India 2022",
    img: [
      "/images/event1/img1.jpg",
      "/images/event1/img2.jpg",
      "/images/event1/img3.jpg",
      "/images/event1/img4.jpg",
    ],
    meta: "Mumbai, India",
    text: "Global conclave connecting Indian and international boiler industries for sustainable steam progress.",
  },
  {
    title: "Boiler World Expo Africa 2023",
    img: [
      "/images/event2/img1.jpg",
      "/images/event2/img2.jpg",
      "/images/event2/img3.jpg",
    ],
    meta: "Africa",
    text: "Expert networking, technical discussions and collaboration around practical steam innovation.",
  },
  {
    title: "Boiler India Expo 2024",
    img: [
      "/images/event3/img1.jpg",
      "/images/event3/img2.jpg",
    ],
    meta: "Mumbai, India",
    text: "Successful launch of Volfram Smart Boiler Controller with strong industry response.",
  },
];

const videos = [
  ["00:17", "Volfram Solid Fuel Fired Boiler"],
  ["00:25", "Volfram Casted Moisture Separator"],
  ["00:45", "Volfram Condensate Recovery System"],
  ["01:53", "V-wise Smart Boiler Controller"],
];

export default function Events() {
  const [selectedImages, setSelectedImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openGallery = (images, index = 0) => {
    setSelectedImages(images);
    setCurrentIndex(index);
  };

  const closeGallery = () => {
    setSelectedImages([]);
    setCurrentIndex(0);
  };

  const nextImage = () => {
    setCurrentIndex((prev) =>
      prev === selectedImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? selectedImages.length - 1 : prev - 1
    );
  };

  return (
    <div className="page-shell">
      
      {/* HERO */}
      <section className="hero-section py-20 md:py-24">
        <div className="container-custom relative z-10">
          <span className="badge-industrial mb-4">Events & Highlights</span>
          <h1 className="max-w-4xl text-4xl leading-tight text-white md:text-6xl">
            Where Industry Meets Steam Innovation
          </h1>
          <p className="mt-6 max-w-3xl text-lg text-slate-100">
            Stay connected with Volfram showcases, expos and product demonstration highlights.
          </p>
        </div>
      </section>

      {/* EVENTS */}
      <section className="section-white">
        <div className="container-custom">
          <h2 className="text-3xl md:text-4xl">Major Expos</h2>

          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            {events.map((event) => (
              <article key={event.title} className="card">

                {/* IMAGE ALBUM */}
                <div className="mb-4 grid grid-cols-2 gap-2">
                  {event.img.slice(0, 3).map((image, index) => (
                    <div
                      key={index}
                      className="relative cursor-pointer"
                      onClick={() => openGallery(event.img, index)}
                    >
                      <img
                        src={image}
                        className="aspect-video w-full rounded-md object-cover hover:scale-105 transition"
                      />

                      {/* +X OVERLAY */}
                      {index === 2 && event.img.length > 3 && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-bold text-lg rounded-md">
                          +{event.img.length - 3}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <p className="badge-industrial">{event.meta}</p>
                <h3 className="mt-3 text-xl text-primary">{event.title}</h3>
                <p className="mt-3">{event.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* VIDEO SECTION */}
      <section className="section-light">
        <div className="container-custom">
          <h2 className="text-3xl md:text-4xl">Video Library</h2>

          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
            {videos.map(([duration, title]) => (
              <div key={title} className="card flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-secondary">{duration}</p>
                  <p className="mt-1 font-medium text-text-primary">{title}</p>
                </div>
                <button className="btn-outline-primary px-4 py-2">
                  Watch
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FULLSCREEN GALLERY MODAL */}
      {selectedImages.length > 0 && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
          
          {/* CLOSE BUTTON */}
          <button
            onClick={closeGallery}
            className="absolute top-5 right-5 text-white text-3xl"
          >
            ✕
          </button>

          {/* PREV */}
          <button
            onClick={prevImage}
            className="absolute left-5 text-white text-3xl"
          >
            ‹
          </button>

          {/* IMAGE */}
          <img
            src={selectedImages[currentIndex]}
            className="max-h-[80vh] max-w-[90%] rounded-lg"
          />

          {/* NEXT */}
          <button
            onClick={nextImage}
            className="absolute right-5 text-white text-3xl"
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}