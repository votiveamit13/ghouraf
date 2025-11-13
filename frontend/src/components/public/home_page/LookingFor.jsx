import { FaArrowRight } from "react-icons/fa";
import houseImg from "assets/img/ghouraf/houseImg.png";
import propertyImg from "assets/img/ghouraf/propertyImg.png";
import { useNavigate } from "react-router-dom";

export default function LookingFor() {
  const navigate = useNavigate();
  return (
    <section className="w-full bg-white py-16">
      <div className="flex flex-col md:flex-row justify-center items-center gap-8 px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between bg-[#565ABF] text-white rounded-[16px] p-5 w-full md:w-[500px]">
          <div className="w-full lg:w-2/3 lg:text-left">
            <h3 className="text-[20px] text-white font-semibold mb-3">
              Looking For The <br /> New Room?
            </h3>
            <p className="text-sm mb-3">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut.
            </p>
            <button className="bg-white text-black px-4 py-2 rounded-[12px] font-medium flex items-center gap-2 md:mx-0 shadow"
              onClick={() => navigate("/user/place-wanted-ad")}
            >
              Get Started <FaArrowRight className="text-sm" />
            </button>
          </div>
          <div className="mt-6 lg:mt-0 flex justify-center lg:justify-end w-full lg:w-1/3">
            <img
              src={houseImg}
              alt="House"
              className="w-28 sm:w-36 md:w-40 lg:w-48 xl:w-52 object-contain"
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-between bg-[#A321A6] text-white rounded-[16px] p-5 w-full md:w-[500px]">
          <div className="w-full lg:w-2/3 lg:text-left">
            <h3 className="text-lg text-white font-semibold mb-3">
              Want To Add <br /> Your Property?
            </h3>
            <p className="text-sm mb-3">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut.
            </p>
            <button className="bg-white text-black px-4 py-2 rounded-[12px] font-medium flex items-center gap-2 md:mx-0 shadow"
              onClick={() => navigate("user/post-an-space")}
            >
              Get Started <FaArrowRight className="text-sm" />
            </button>
          </div>
          <div className="mt-6 lg:mt-0 flex justify-center lg:justify-end w-full lg:w-1/3">
          <img
            src={propertyImg}
            alt="Property"
            className="w-28 sm:w-36 md:w-40 lg:w-48 xl:w-52 object-contain"
          />
          </div>
        </div>

      </div>
    </section>
  );
}
