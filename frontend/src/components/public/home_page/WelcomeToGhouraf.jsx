import { GoArrowUpRight } from "react-icons/go";
import { FaPhoneAlt } from "react-icons/fa";
import { Img } from "react-image";
import flatmate1 from "assets/img/ghouraf/flatmate1.jpg";
import flatmate2 from "assets/img/ghouraf/flatmate2.jpg";
import flatmate3 from "assets/img/ghouraf/flatmate3.jpg";

export default function WelcomeToGhouraf() {
  return (
    <section className="w-full bg-white py-16">
      <div className="container mx-auto sm:px-6 md:px-12 lg:px-20 flex flex-col md:flex-row items-center gap-12">
        <div className="flex md:flex-row items-center justify-center gap-6">
          <div className="flex w-full md:w-1/2 items-center justify-center">
            <Img
              src={flatmate1}
              alt="Flatmate 3"
              className="w-full md:w-[100%] lg:h-80 md:h-80 sm:h-50 object-fit rounded-xl shadow-md"
            />
          </div>
          <div className="flex flex-col gap-6 w-full md:w-1/2">
            <Img
              src={flatmate2}
              alt="Flatmate 1"
              className="w-full lg:h-64 md:h-64 sm:h-34 object-fit rounded-xl shadow-md"
            />
            <Img
              src={flatmate3}
              alt="Flatmate 2"
              className="w-full lg:h-64 md:h-64 sm:h-34 object-fit rounded-xl shadow-md"
            />
          </div>
        </div>

        <div className="w-full md:w-1/2">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            Welcome to <span className="text-[#A321A6]">Ghouraf.</span>
          </h2>
          <h3 className="text-lg font-semibold mb-4">
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

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <button className="px-5 py-3 bg-black text-white rounded-[12px] flex items-center gap-2 hover:bg-gray-900 transition w-full sm:w-auto justify-center">
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
