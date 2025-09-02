import heroImage from "assets/img/ghouraf/hero-section.jpg";
import flatmate1 from "assets/img/ghouraf/flatmate1.jpg";
import flatmate2 from "assets/img/ghouraf/flatmate2.jpg";
import flatmate3 from "assets/img/ghouraf/flatmate3.jpg";
import { Img } from "react-image";
import { FaArrowRight } from "react-icons/fa";
import houseImg from "assets/img/ghouraf/houseImg.png";
import propertyImg from "assets/img/ghouraf/propertyImg.png";
import aboutIcon1 from "assets/img/ghouraf/aboutIcon1.png";
import aboutIcon2 from "assets/img/ghouraf/aboutIcon2.png";
import aboutIcon3 from "assets/img/ghouraf/aboutIcon3.png";
import aboutIcon4 from "assets/img/ghouraf/aboutIcon4.png";

export default function AboutUs() {
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
                        <h4 className="text-black text-lg font-semibold mb-4">What is Ghouraf?</h4>
                        <ul className="list-disc pl-4 space-y-4 text-[#1A1A1A]">
                            <li>
                                Ghouraf is a new platform that allows you to find the room, apartment, or
                                flatmate that is right for you.
                            </li>
                            <li>
                                Ghouraf was created with the goal to give people the ability to live their
                                dreams more comfortably as they better adapt to the growing demands,
                                concerns and changes of the world.
                            </li>
                            <li>
                                Ghouraf hopes to help people find more affordable and decent places to live
                                in.
                            </li>
                            <li>
                                Ghouraf is not a real estate agency but rather an online stage where
                                tenants, landlords and agents can interact.
                            </li>
                            <li>
                                Ghouraf allows users to place an ad for a room or an apartment, as well as,
                                it lets people looking for these apartments or rooms to place an ad
                                themselves.
                            </li>
                        </ul>

                    </div>

                    <div className="w-full md:w-1/2">
                        <div className="grid grid-cols-2 gap-6 w-full">
                            <Img
                                src={flatmate1}
                                alt="Flatmate 1"
                                className="w-full md:h-64 h-55 object-cover rounded-xl shadow-md"
                            />
                            <Img
                                src={flatmate2}
                                alt="Flatmate 2"
                                className="w-full md:h-64 h-55 object-cover rounded-xl shadow-md"
                            />
                            <Img
                                src={flatmate3}
                                alt="Flatmate 3"
                                className="w-full md:h-64 h-55 object-cover rounded-xl shadow-md"
                            />
                            <Img
                                src={flatmate3}
                                alt="Flatmate 4"
                                className="w-full md:h-64 h-55 object-cover rounded-xl shadow-md"
                            />
                        </div>
                    </div>
                </div>
            </section>
            <section className="w-full bg-white py-2 mb-6">
                <div className="container mx-auto sm:px-6 md:px-12 lg:px-20">
                    <div className="w-full mb-4">
                        <h2 className="text-3xl md:text-4xl font-bold mb-3 text-black text-center">
                            Why Use <span className="text-[#A321A6]">Ghouraf?</span>
                        </h2>
                        <p className="text-black text-center md:px-[300px] px-[0px] leading-[1.5rem]">Lorem ipsum dolor sit amet consectetur adipisicing elit aspernatur illum vel sunt libero voluptatum repudiandae veniam maxime tenetur.</p>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                        <div className="flex md:flex-row flex-col gap-6 mb-4 md:w-[70%] w-full">
                            <div className="flex-1 bg-[#565ABF] text-white rounded-[15px] px-4 py-3">
                                Ghouraf allows you to find the right apartment
                                to rent or share
                            </div>
                            <div className="flex-1 bg-[#565ABF] text-white rounded-[15px] px-4 py-3">
                                Ghouraf helps you find the right Room for you
                            </div>
                        </div>
                        <div className="flex md:flex-row flex-col gap-6 mb-4 md:w-[70%] w-full">
                            <div className="flex-1 bg-[#565ABF] text-white rounded-[15px] px-4 py-3">
                                Ghouraf makes finding likeminded people to
                                share a place with much easier and faster.
                            </div>
                            <div className="flex-1 bg-[#565ABF] text-white rounded-[15px] px-4 py-3">
                                Ghouraf helps Landlords find you
                            </div>
                        </div>
                    </div>
                    <div className="md:w-[82%] w-full mx-auto text-center md:mt-6 mt-5 px-4 py-4 rounded-[16px] bg-black flex md:flex-row flex-col justify-between text-white md:gap-y-0 gap-y-6">
                        <div className="flex  items-end gap-2">
                            <div>
                                <Img
                                    src={aboutIcon1}
                                    alt="Ghouraf"
                                    className="w-[55px] h-[55px] object-cover shadow-md"
                                />
                            </div>
                            <div className="text-left">
                                <p className="text-[30px] font-bold leading-[1.5rem]">1050+</p>
                                <span>Happy Customers</span>
                            </div>
                        </div>
                        <div className="flex items-end gap-2">
                            <div>
                                <Img
                                    src={aboutIcon2}
                                    alt="Ghouraf"
                                    className="w-[55px] h-[55px] object-cover shadow-md"
                                />
                            </div>
                            <div className="text-left">
                                <p className="text-[30px] font-bold leading-[1.5rem]">25+</p>
                                <span>Awards Won</span>
                            </div>
                        </div>
                        <div className="flex items-end gap-2">
                            <div>
                                <Img
                                    src={aboutIcon3}
                                    alt="Ghouraf"
                                    className="w-[55px] h-[55px] object-cover shadow-md"
                                />
                            </div>
                            <div className="text-left">
                                <p className="text-[30px] font-bold leading-[1.5rem]">50,000+</p>
                                <span>Projects Listed</span>
                            </div>
                        </div>
                        <div className="flex items-end gap-2">
                            <div>
                                <Img
                                    src={aboutIcon4}
                                    alt="Ghouraf"
                                    className="w-[55px] h-[55px] object-cover shadow-md"
                                />
                            </div>
                            <div className="text-left">
                                <p className="text-[30px] font-bold leading-[1.5rem]">100+</p>
                                <span>Satisfied Feedback</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="w-full bg-white py-4 mb-6">
                <div className="flex flex-col md:flex-row justify-center items-center gap-8 px-4">

                    <div className="flex flex-col md:flex-row items-center justify-between bg-[#565ABF] text-white rounded-[16px] p-5 w-full md:w-[500px]">
                        <div className="max-w-3xl md:text-left">
                            <h3 className="text-lg text-white font-semibold mb-3">
                                Looking For The <br /> New Room?
                            </h3>
                            <p className="text-sm mb-3">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut.
                            </p>
                            <button className="bg-white text-black px-4 py-2 rounded-[12px] font-medium flex items-center gap-2 md:mx-0 shadow">
                                Get Started <FaArrowRight className="text-sm" />
                            </button>
                        </div>
                        <img
                            src={houseImg}
                            alt="House"
                            className="w-32 md:w-25 md:ml-6 mt-6 md:mt-0"
                        />
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-between bg-[#A321A6] text-white rounded-[16px] p-5 w-full md:w-[500px]">
                        <div className="max-w-sm md:text-left">
                            <h3 className="text-lg text-white font-semibold mb-3">
                                Want To Add <br /> Your Property?
                            </h3>
                            <p className="text-sm mb-3">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut.
                            </p>
                            <button className="bg-white text-black px-4 py-2 rounded-[12px] font-medium flex items-center gap-2 md:mx-0 shadow">
                                Get Started <FaArrowRight className="text-sm" />
                            </button>
                        </div>
                        <img
                            src={propertyImg}
                            alt="Property"
                            className="w-32 md:w-25 md:ml-6 mt-6 md:mt-0"
                        />
                    </div>

                </div>
            </section>
        </>
    );
}