import { useState, useEffect } from "react";

const PhotoSlider = ({ featuredImage, photos = [] }) => {
  const allImages = [
    ...(featuredImage ? [{ url: featuredImage }] : []),
    ...photos,
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % allImages.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [allImages.length]);

  const prevSlide = () =>
    setCurrent(current === 0 ? allImages.length - 1 : current - 1);

  const nextSlide = () =>
    setCurrent(current === allImages.length - 1 ? 0 : current + 1);

  if (allImages.length === 0) return null;

  return (
    <div className="relative w-full h-64">
      <img
        src={allImages[current].url}
        alt={`Slide ${current + 1}`}
        className="w-full h-64 object-cover rounded-lg transition-all duration-500"
      />

      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-3 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
      >
        ‹
      </button>

      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-3 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
      >
        ›
      </button>

      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
        {allImages.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2 h-2 rounded-full ${
              i === current ? "bg-white" : "bg-gray-400"
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default PhotoSlider;
