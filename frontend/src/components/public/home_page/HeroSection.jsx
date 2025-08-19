import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import heroImage from "assets/img/ghouraf/hero-section.jpg";

export default function HeroSection() {
  const [activeTab, setActiveTab] = useState("spaces");

  return (
    <section
      className="relative h-auto bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage: `url(${heroImage})`,
      }}
    >
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative z-10 text-center px-4 max-w-3xl mt-[65px]">
        <h1 className="text-white text-3xl sm:text-5xl font-bold mb-2">
          Welcome! Let’s get started
        </h1>
        <p className="text-white text-lg sm:text-xl mb-6">
          Find the right home for you
        </p>

<div className="flex justify-center">
  <div className="flex lg:w-[60%] md:w-[60%] w-[80%] rounded-tl-[12px] rounded-tr-[12px] overflow-hidden shadow-lg">
    <button
      onClick={() => setActiveTab("spaces")}
      className={`flex-1 whitespace-nowrap lg:py-4 md:py-4 lg:px-4 md:px-4 py-2 px-2 text-sm font-semibold transition ${
        activeTab === "spaces"
          ? "bg-[#565ABF] text-white"
          : "bg-black text-white"
      }`}
    >
      Spaces
    </button>

    <button
      onClick={() => setActiveTab("place wanted")}
      className={`flex-1 whitespace-nowrap lg:py-4 md:py-4 lg:px-4 md:px-4 py-2 px-2 text-sm font-semibold transition border-l border-white/80 ${
        activeTab === "place wanted"
          ? "bg-[#565ABF] text-white"
          : "bg-black text-white"
      }`}
    >
      Place Wanted
    </button>

    <button
      onClick={() => setActiveTab("team up")}
      className={`flex-1 whitespace-nowrap lg:py-4 md:py-4 lg:px-4 md:px-4 py-2 px-2 text-sm font-semibold transition border-l border-white/80 ${
        activeTab === "team up"
          ? "bg-[#565ABF] text-white"
          : "bg-black text-white"
      }`}
    >
      Team Up
    </button>
  </div>
</div>

        <div className="flex items-center bg-white rounded-full overflow-hidden max-w-3xl mx-auto shadow-lg mb-8">
          <input
            type="text"
            placeholder="Enter Location, Area or Postcode"
            className="flex-grow px-4 text-[#A321A6] placeholder-[#A321A6] outline-none text-sm sm:text-base"
          />
          <button className="bg-[#A321A6] hover:from-purple-700 hover:to-pink-700 p-3 rounded-full text-white transition m-1">
            <FiSearch className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
