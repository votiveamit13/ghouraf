import heroImage from "assets/img/ghouraf/hero-section.jpg";
import flatmate1 from "assets/img/ghouraf/flatmate1.jpg";
import flatmate2 from "assets/img/ghouraf/flatmate2.jpg";
import flatmate3 from "assets/img/ghouraf/flatmate3.jpg";
import { FaHome, FaUserFriends } from "react-icons/fa";
import { MdOutlineApartment, MdRealEstateAgent, MdMeetingRoom } from "react-icons/md";
import { AiOutlineFileSearch } from "react-icons/ai";
import { PiUserCircle } from "react-icons/pi";
import { TbHomeSearch } from "react-icons/tb";
import { LiaUsersSolid } from "react-icons/lia";
import whyuse1 from "assets/img/ghouraf/whyuse1.png";
import whyuse2 from "assets/img/ghouraf/whyuse2.png";
import whyuse3 from "assets/img/ghouraf/whyuse3.png";

export default function AboutUs() {
    const features = [
        {
            icon: <MdOutlineApartment className="text-3xl text-white" />,
            title: "Find Apartments & Rooms",
            desc: "Ghouraf is a new platform that allows you to find the room, apartment, or flatmate that’s right for you.",
        },
        {
            icon: <FaUserFriends className="text-3xl text-white" />,
            title: "Created for People",
            desc: "Ghouraf was created with the goal to give people the ability to live their dreams more comfortably as they settle abroad in this growing demand, concerns and changes of the world.",
        },
        {
            icon: <FaHome className="text-3xl text-white" />,
            title: "Affordable Living",
            desc: "Ghouraf hopes to help people find more affordable and decent places to live in.",
        },
        {
            icon: <MdRealEstateAgent className="text-3xl text-white" />,
            title: "Not Just Real Estate",
            desc: "Ghouraf is not a real estate agency but rather an online stage where tenants, landlords and agents can interact.",
        },
        {
            icon: <AiOutlineFileSearch className="text-3xl text-white" />,
            title: "Post & Search Ads",
            desc: "Ghouraf allows users to place an ad for a room or an apartment, as well as, it helps people looking for these apartments or roommates to place an ad themselves.",
        },
    ];

    const uses = [
        {
            icon: <TbHomeSearch size={50} />,
            title: "Find Apartments",
            desc: "Ghouraf allows you to find the right apartment to rent or share",
        },
        {
            icon: <MdMeetingRoom size={50} />,
            title: "Find Rooms",
            desc: "Ghouraf helps you find the right Room for you",
        },
        {
            icon: <LiaUsersSolid size={50} />,
            title: "Meet Flatmates",
            desc: "Ghouraf makes finding likeminded people to share a place with much easier and faster.",
        },
        {
            icon: <PiUserCircle size={50} />,
            title: "For Landlords",
            desc: "Ghouraf helps Landlords find you",
        },
    ];

    return (
        <>
            <section
                className="relative h-[300px] bg-cover bg-center flex items-center justify-center"
                style={{
                    backgroundImage: `url(${heroImage})`,
                }}
            >
                <div className="absolute inset-0 bg-black/40"></div>

                <div className="relative z-10 text-center px-4 max-w-3xl mt-1/2">
                    <h1 className="text-white text-3xl sm:text-5xl font-bold mb-2">
                        About Us
                    </h1>
                </div>
            </section>
            <section className="w-full bg-white py-16">
                <div className="container mx-auto sm:px-6 md:px-12 lg:px-20 flex flex-col md:flex-row items-center gap-12">
                    <div className="w-full md:w-1/2">
                        <h2 className="text-3xl md:text-4xl font-bold mb-2 text-black">
                            Welcome to <span className="text-[#A321A6]">Ghouraf.</span>
                        </h2>
                        <h3 className="text-lg font-semibold mb-4 text-black">
                            Created by Flatmates for Flatmates
                        </h3>
                        <p className="mb-4 leading-relaxed text-[#1A1A1A]">
                            Ghouraf was found in 2019 to help fight the housing crisis in Lebanon. We hope to give people the ability to live their dreams more comfortably as they better adapt to the growing demands, concerns and changes of the world. Our goal is to help people to find more affordable and decent places to live in. Welcome to the platform.
                        </p>
                    </div>

                    <div className="w-full md:w-1/2">
                        <div className="grid grid-cols-2 gap-6 w-full">
                            <img
                                src={flatmate1}
                                alt="Flatmate 1"
                                className="w-full md:h-[155px] h-55 object-cover rounded-xl shadow-md"
                            />
                            <img
                                src={flatmate2}
                                alt="Flatmate 2"
                                className="w-full md:h-[155px] h-55 object-cover rounded-xl shadow-md"
                            />
                            <img
                                src={flatmate3}
                                alt="Flatmate 3"
                                className="w-full md:h-[155px] h-55 object-cover rounded-xl shadow-md"
                            />
                            <img
                                src={flatmate3}
                                alt="Flatmate 4"
                                className="w-full md:h-[155px] h-55 object-cover rounded-xl shadow-md"
                            />
                        </div>
                    </div>
                </div>
            </section>
            <section className="w-full bg-[#DDDBDB78] py-6">
                <div className="container mx-auto sm:px-6 md:px-12 lg:px-20">
                    <div className="w-full mb-5">
                        <h2 className="text-3xl md:text-4xl font-bold text-black text-center">
                            What is Ghouraf?
                        </h2>
                    </div>

                    <div className="flex flex-wrap justify-center gap-6 px-3">
                        {features.map((item, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-[20px] shadow p-4 text-center flex flex-col items-center w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]"
                            >
                                <div className="w-14 h-14 flex items-center justify-center rounded-full bg-[#4C52D6] mb-4">
                                    {item.icon}
                                </div>
                                <h3 className="font-semibold text-lg mb-2 text-black">{item.title}</h3>
                                <p className="text-[#1A1A1A] text-[16px] text-black">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            {/* <section className="w-full bg-white py-6 mb-6">
                <div className="container mx-auto sm:px-0 md:px-8 lg:px-20">
                    <div className="w-full mb-5">
                        <h2 className="text-3xl md:text-4xl font-bold text-black text-center">
                            Why use Ghouraf?
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {uses.map((item, index) => (
                            <div
                                key={index}
                                className="group rounded-[20px] border border-gray-200 shadow-xl p-5 flex flex-col items-center text-center transition-all duration-300 bg-[#FFFFFF] hover:bg-[#565ABF]"
                            >
                                <div className="mb-4 transition-colors duration-300 text-[#565ABF] group-hover:text-[#FFFFFF]">
                                    {item.icon}
                                </div>

                                <p className="font-semibold text-lg mb-3 text-[#565ABF] transition-colors duration-300 group-hover:text-white">
                                    {item.title}
                                </p>

                                <p className="text-[16px] text-[#1A1A1A] transition-colors duration-300 group-hover:text-white">
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section> */}
                <section className="w-full bg-white py-6 mb-6">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-black mb-2">
          Why Use Ghouraf
        </h2>
        <h3 className="text-sm md:text-base font-medium text-black mb-12">
          Aliquam lacinia diam quis lacus euismod
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xl p-4 text-center">
            <img src={whyuse1} alt="ghouraf" className="mx-auto mb-3 w-20 h-20 object-contain" />
            <h5 className="font-semibold text-lg text-black mb-3">We're the busiest</h5>
            <p className="text-black text-sm leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-xl text-center">
            <img src={whyuse2} alt="ghouraf" className="mx-auto mb-3 w-20 h-20 object-contain" />
            <h5 className="font-semibold text-lg mb-3 text-black">Safety</h5>
            <p className="text-black text-sm leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-xl text-center">
            <img src={whyuse3} alt="ghouraf" className="mx-auto mb-3 w-20 h-20 object-contain" />
            <h5 className="font-semibold text-lg mb-3 text-black">We&apos;re all about people</h5>
            <p className="text-black text-sm leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
        </div>
      </div>
    </section>
        </>
    );
}