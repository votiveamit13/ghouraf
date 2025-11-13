import { GoArrowUpRight } from "react-icons/go";
import { FaPhoneAlt } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function WelcomeToGhouraf() {
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;

  const [images, setImages] = useState([null, null, null]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const { data } = await axios.get(`${apiUrl}admin/aboutussection-image`);
        const urls = [
          data.imagePath1 ? `${data.imagePath1}` : null,
          data.imagePath2 ? `${data.imagePath2}` : null,
          data.imagePath3 ? `${data.imagePath3}` : null,
        ];
        setImages(urls);
      } catch (error) {
        console.error("Error fetching About Us section images:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [apiUrl]);

  return (
    <section className="w-full bg-white py-16">
      <div className="container mx-auto sm:px-6 md:px-12 lg:px-20 flex flex-col md:flex-row items-center gap-12">
        <div className="flex md:flex-row items-center justify-center gap-6 w-full md:w-1/2">
          <div className="flex items-center justify-center w-full md:w-1/2">
            {loading ? (
              <div className="w-full h-80 bg-gray-100 animate-pulse rounded-xl" />
            ) : images[0] ? (
              <img
                src={images[0]}
                alt="About Us 1"
                className="w-full md:w-[100%] lg:h-80 md:h-44 sm:h-50 object-cover rounded-xl shadow-md"
              />
            ) : (
              <div className="w-full h-80 bg-gray-100 flex items-center justify-center rounded-xl text-gray-400">
                No Image
              </div>
            )}
          </div>

          <div className="flex flex-col gap-6 w-full md:w-1/2">
            {[images[1], images[2]].map((img, i) =>
              loading ? (
                <div
                  key={i}
                  className="w-full lg:h-64 md:h-64 sm:h-34 bg-gray-100 animate-pulse rounded-xl"
                />
              ) : img ? (
                <img
                  key={i}
                  src={img}
                  alt={`About Us ${i + 2}`}
                  className="w-full lg:h-64 md:h-44 sm:h-34 object-cover rounded-xl shadow-md"
                />
              ) : (
                <div
                  key={i}
                  className="w-full lg:h-64 md:h-64 sm:h-34 bg-gray-100 flex items-center justify-center rounded-xl text-gray-400"
                >
                  No Image
                </div>
              )
            )}
          </div>
        </div>

        <div className="w-full md:w-1/2">
          <h2 className="lg:text-4xl md:text-3xl text-3xl font-bold mb-2 text-black">
            Welcome to <span className="text-[#A321A6]">Ghouraf.</span>
          </h2>
          <h3 className="text-lg font-semibold mb-4 text-black">
            Created by Flatmates <br /> for Flatmates
          </h3>
          <p className="mb-5 leading-relaxed text-[#1A1A1A]">
            Ghouraf was found in 2019 to help fight the housing crisis in
            Lebanon. We hope to give people the ability to live their dreams
            more comfortably as they better adapt to the growing demands,
            concerns and changes of the world. Our goal is to help people to
            find more affordable and decent places to live in. Welcome to the
            platform.
          </p>

          <div className="flex lg:flex-row md:flex-col flex-col items-start gap-6">
            <button
              onClick={() => navigate("/about-us")}
              className="px-5 py-3 bg-black text-white rounded-[12px] flex items-center gap-2 hover:bg-gray-900 transition w-full sm:w-auto justify-center"
            >
              Read More
              <span>
                <GoArrowUpRight size={25} />
              </span>
            </button>
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-[#565ABF] flex items-center justify-center">
                <FaPhoneAlt className="text-white text-lg" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Need help?</p>
                <p className="font-semibold text-[#1A1A1A]">(012) 345–67890</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
