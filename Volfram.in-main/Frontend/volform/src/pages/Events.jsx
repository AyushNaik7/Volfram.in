import { useMemo, useState } from "react";

const eventGallery = [
  "/Events/image.png",
  "/Events/image copy.png",
  ...Array.from({ length: 88 }, (_, index) => `/Events/image copy ${index + 2}.png`),
];

const events = [
  {
    id: "annual-2025",
    title: "Annual Conference 2025-26",
    date: "5th April, 2025",
    location: "Mumbai, India",
    description:
      "Volfram Annual Conference celebrated our technical growth, stronger partner collaborations, and customer-focused steam innovation milestones.",
    images: eventGallery.slice(0, 18),
  },
  {
    id: "boiler-india-2024",
    title: "Boiler India 2024",
    date: "Trade Exhibition",
    location: "Mumbai, India",
    description:
      "Our team showcased process boiler automation, steam accessories, and smarter plant reliability strategies to industry leaders and EPC teams.",
    images: eventGallery.slice(18, 36),
  },
  {
    id: "chemtech-2024",
    title: "Chemtech 2024",
    date: "Industrial Expo",
    location: "Mumbai, India",
    description:
      "At Chemtech, we demonstrated compact steam solutions and live controls for chemical process operations requiring high uptime and efficiency.",
    images: eventGallery.slice(36, 54),
  },
  {
    id: "annual-2024",
    title: "Annual Conference 2024-25",
    date: "6th April, 2024",
    location: "Mumbai, India",
    description:
      "An internal strategy and celebration event focused on execution quality, engineering excellence, and customer-first service commitments.",
    images: eventGallery.slice(54, 72),
  },
  {
    id: "boiler-world",
    title: "Boiler World Expo",
    date: "Global Connect",
    location: "Industry Pavilion",
    description:
      "A global networking platform where we engaged with boiler professionals to exchange ideas around performance, safety, and sustainability.",
    images: eventGallery.slice(72, 90),
  },
];

const toImageSrc = (path) => encodeURI(path);

export default function Events() {
  const initialSlides = useMemo(
    () => Object.fromEntries(events.map((event) => [event.id, 0])),
    []
  );

  const [slides, setSlides] = useState(initialSlides);
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

  const nextGalleryImage = () => {
    setCurrentIndex((prev) =>
      prev === selectedImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevGalleryImage = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? selectedImages.length - 1 : prev - 1
    );
  };

  const changeEventSlide = (eventId, eventImages, direction) => {
    setSlides((prev) => {
      const previous = prev[eventId] ?? 0;
      const updated =
        direction === "next"
          ? (previous + 1) % eventImages.length
          : (previous - 1 + eventImages.length) % eventImages.length;

      return { ...prev, [eventId]: updated };
    });
  };

  return (
    <div className="page-shell">
      <section className="hero-section py-20 md:py-24">
        <div className="container-custom relative z-10">
          <span className="badge-industrial mb-4">Events & Highlights</span>
          <h1 className="max-w-4xl text-4xl leading-tight text-white md:text-6xl">
            Exhibition & Conference Timeline
          </h1>
          <p className="mt-6 max-w-3xl text-lg text-slate-100">
            Old-format inspired events feed with alternating sections and multi-image
            sliders for every event showcase.
          </p>
        </div>
      </section>

      <section className="bg-[#f1f3f6]">
        {events.map((event, eventIndex) => {
          const isAlternate = eventIndex % 2 === 1;
          const activeIndex = slides[event.id] ?? 0;
          const activeImage = event.images[activeIndex];

          return (
            <article
              key={event.id}
              className="grid min-h-[360px] grid-cols-1 border-b border-slate-300/50 md:grid-cols-2"
            >
              <div
                className={`relative overflow-hidden bg-slate-200 ${
                  isAlternate ? "md:order-2" : ""
                }`}
              >
                <img
                  src={toImageSrc(activeImage)}
                  alt={event.title}
                  className="h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/5 to-transparent" />

                <div className="absolute left-6 top-6 md:left-10 md:top-10">
                  <h3 className="text-3xl font-semibold uppercase tracking-[0.08em] text-white/22 md:text-5xl">
                    {event.title}
                  </h3>
                  <p className="mt-1 text-2xl font-semibold text-white/24 md:text-4xl">
                    {event.date}
                  </p>
                </div>

                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-4 md:bottom-6 md:left-6 md:right-6">
                  <button
                    type="button"
                    onClick={() => changeEventSlide(event.id, event.images, "prev")}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/85 text-xl font-bold text-primary transition hover:bg-white"
                    aria-label={`Previous image for ${event.title}`}
                  >
                    {"<"}
                  </button>

                  <div className="flex flex-1 justify-center gap-2 overflow-x-auto px-1 py-1">
                    {event.images.slice(0, 7).map((image, thumbIndex) => {
                      const selected = thumbIndex === activeIndex;

                      return (
                        <button
                          key={`${event.id}-${thumbIndex}`}
                          type="button"
                          onClick={() =>
                            setSlides((prev) => ({ ...prev, [event.id]: thumbIndex }))
                          }
                          className={`h-12 w-16 shrink-0 overflow-hidden rounded border-2 transition ${
                            selected
                              ? "border-white"
                              : "border-transparent opacity-85 hover:opacity-100"
                          }`}
                          aria-label={`Select image ${thumbIndex + 1} for ${event.title}`}
                        >
                          <img
                            src={toImageSrc(image)}
                            alt={`${event.title} thumbnail ${thumbIndex + 1}`}
                            className="h-full w-full object-cover"
                          />
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={() => changeEventSlide(event.id, event.images, "next")}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/85 text-xl font-bold text-primary transition hover:bg-white"
                    aria-label={`Next image for ${event.title}`}
                  >
                    {">"}
                  </button>
                </div>
              </div>

              <div
                className={`flex items-center justify-center px-8 py-10 md:px-14 ${
                  isAlternate ? "md:order-1" : ""
                }`}
              >
                <div className="max-w-md text-center md:text-left">
                  <h4 className="text-3xl text-primary">{event.title}</h4>
                  <p className="mt-2 text-sm font-semibold uppercase tracking-[0.08em] text-secondary">
                    {event.location} | {event.date}
                  </p>
                  <p className="mt-5 leading-relaxed text-text-secondary">
                    {event.description}
                  </p>

                  <button
                    type="button"
                    onClick={() => openGallery(event.images, activeIndex)}
                    className="btn-primary mt-6 px-5 py-2 text-sm"
                  >
                    View More
                  </button>

                  <div className="mt-5 flex items-center justify-center gap-3 md:justify-start">
                    {[
                      ["IG", "Instagram"],
                      ["FB", "Facebook"],
                      ["IN", "LinkedIn"],
                    ].map(([short, label]) => (
                      <span
                        key={short}
                        title={label}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-700 text-[11px] font-bold text-white"
                      >
                        {short}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      {selectedImages.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 px-3">
          <button
            type="button"
            onClick={closeGallery}
            className="absolute right-4 top-4 text-4xl text-white"
            aria-label="Close gallery"
          >
            X
          </button>

          <button
            type="button"
            onClick={prevGalleryImage}
            className="absolute left-4 rounded-full bg-white/20 px-3 py-2 text-3xl text-white"
            aria-label="Previous gallery image"
          >
            {"<"}
          </button>

          <img
            src={toImageSrc(selectedImages[currentIndex])}
            alt="Selected event"
            className="max-h-[84vh] max-w-[92vw] rounded-lg object-contain"
          />

          <button
            type="button"
            onClick={nextGalleryImage}
            className="absolute right-4 rounded-full bg-white/20 px-3 py-2 text-3xl text-white"
            aria-label="Next gallery image"
          >
            {">"}
          </button>
        </div>
      )}
    </div>
  );
}
