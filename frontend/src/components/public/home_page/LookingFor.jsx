import { FaArrowRight } from "react-icons/fa";
import houseImg from "assets/img/ghouraf/houseImg.png";
import propertyImg from "assets/img/ghouraf/propertyImg.png";

export default function LookingFor() {
  return (
    <section className="w-full bg-white py-16">
      <div className="flex flex-col md:flex-row justify-center items-center gap-8 px-4">
        <div className="flex flex-col md:flex-row items-center justify-between bg-[#565ABF] text-white rounded-[16px] p-5 w-full md:w-[500px]">
          <div className="max-w-3xl">
            <h3 className="text-lg text-white font-semibold mb-3">
              Looking For The <br /> New Room?
            </h3>
            <p className="text-sm mb-3">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut.
            </p>
            <button className="bg-white text-black px-4 py-2 rounded-[12px] font-medium flex items-center gap-2 shadow">
              Get Started <FaArrowRight className="text-sm" />
            </button>
          </div>
          <img src={houseImg} alt="House" className="w-25 md:ml-6 mt-6 md:mt-0" />
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between bg-[#A321A6] text-white rounded-[16px] p-5 w-full md:w-[500px]">
          <div className="max-w-sm">
            <h3 className="text-lg text-white font-semibold mb-3">
              Want To Add <br /> Your Property?
            </h3>
            <p className="text-sm mb-3">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut.
            </p>
            <button className="bg-white text-black px-4 py-2 rounded-[12px] font-medium flex items-center gap-2 shadow">
              Get Started <FaArrowRight className="text-sm" />
            </button>
          </div>
          <img src={propertyImg} alt="Property" className="w-25 md:ml-6 mt-6 md:mt-0" />
        </div>

      </div>
    </section>
  );
}
