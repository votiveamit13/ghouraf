"use client";
import { useEffect } from "react";
import "preline/preline";
import property1 from "../../../../assets/img/ghouraf/property1.png";
import property2 from "../../../../assets/img/ghouraf/property2.png";
import property3 from "../../../../assets/img/ghouraf/property3.jpg";
import property4 from "../../../../assets/img/ghouraf/property4.jpg";
import property5 from "../../../../assets/img/ghouraf/property5.jpg";
import property6 from "../../../../assets/img/ghouraf/property6.jpg";
import property7 from "../../../../assets/img/ghouraf/property7.png";
import property8 from "../../../../assets/img/ghouraf/property8.jpg";
import agent1 from "../../../../assets/img/ghouraf/agent1.jpg";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { FaArrowLeftLong } from "react-icons/fa6";
import { TfiEmail, TfiLocationPin } from "react-icons/tfi";
import { BiCheckShield } from "react-icons/bi";
import { BsFlag } from "react-icons/bs";

export default function DetailPage() {
    useEffect(() => {
        if (typeof window !== "undefined") {
            window.HSCarousel?.autoInit();

            const carousel = document.querySelector("[data-hs-carousel]");
            if (!carousel) return;

            const handleChange = () => {
                const activeThumb = carousel.querySelector(
                    ".hs-carousel-pagination-item .hs-carousel-active"
                );
                if (activeThumb) {
                    activeThumb.scrollIntoView({
                        behavior: "smooth",
                        inline: "center",
                        block: "nearest",
                    });
                }
            };

            carousel.addEventListener("carouselChange", handleChange);

            return () => {
                carousel.removeEventListener("carouselChange", handleChange);
            };
        }
    }, []);


    const images = [
        property1,
        property2,
        property3,
        property4,
        property1,
        property5,
        property6,
        property3,
        property7,
        property2,
        property8,
    ];

    return (
        <>
            <div className="container px-4 mt-6">
                <button className="text-sm px-4 py-2 font-medium text-black flex items-center gap-2 border-[1px] border-[#AACCEE] rounded-[2px]">
                    <FaArrowLeftLong />  Back to Ads
                </button>
            </div>

            <div className="container px-4 mt-4 mb-10 grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="col-span-3 space-y-6">
                    <div
                        data-hs-carousel='{
                            "loadingClasses": "opacity-0",
                            "isAutoPlay": true,
                            "interval": 3000
                        }'
                        className="relative"
                    >
                        <div className="hs-carousel flex flex-col gap-2">
                            <div className="relative grow overflow-hidden min-h-96 bg-white rounded-[10px]">
                                <div className="hs-carousel-body absolute top-0 bottom-0 start-0 flex flex-nowrap transition-transform duration-700 opacity-0">
                                    {images.map((src, idx) => (
                                        <div className="hs-carousel-slide" key={idx}>
                                            <div className="flex justify-center h-full bg-gray-100">
                                                <img
                                                    src={src}
                                                    alt={`Slide ${idx + 1}`}
                                                    className="object-cover w-full h-fill"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="relative flex items-center">
                                <button
                                    type="button"
                                    className="hs-carousel-prev mr-1 left-0 z-10 inline-flex justify-center items-center w-8 h-8 bg-[#565ABF] shadow rounded-full text-white"
                                >
                                    <MdKeyboardArrowLeft size={20} />
                                </button>

                                <div
                                    className="flex mt-2 gap-2 overflow-x-auto w-full no-scrollbar"
                                    data-hs-carousel-pagination
                                >
                                    {images.map((src, idx) => (
                                        <div
                                            key={idx}
                                            className="hs-carousel-pagination-item shrink-0 size-20 cursor-pointer rounded-md overflow-hidden"
                                        >
                                            <img
                                                src={src}
                                                alt={`Thumbnail ${idx + 1}`}
                                                className="object-cover w-full h-full border border-gray-200 rounded-md transition-all hs-carousel-active:border-2 hs-carousel-active:border-blue-500"
                                            />
                                        </div>
                                    ))}
                                </div>

                                <button
                                    type="button"
                                    className="hs-carousel-next ml-1 right-0 z-10 inline-flex justify-center items-center w-8 h-8 bg-[#565ABF] shadow rounded-full text-white"
                                >
                                    <MdKeyboardArrowRight size={20} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white shadow-xl border border-[#D7D7D7] rounded-[15px] p-4 space-y-3">
                        <h2 className="text-[20px] text-black font-semibold">
                            1bed/1bath fully furnished UES
                        </h2>
                        <p className="text-[18px] text-black font-semibold mt-0">$2300 / month</p>
                        <p className="text-[16px] text-black flex items-center gap-2"><TfiLocationPin/> Location</p>
                        <p className="text-black text-[16px]">
Spacious and fully furnished 1-bedroom apartment located in the heart of the Upper East Side. Bright living room with large windows, updated kitchen with modern appliances, and comfortable bedroom with ample closet space.
                        </p>
                        <p className="text-black text-[16px]">
                            Please. Provide. Your. Name. And. Your callback phone. Number Room. Available to Rent. In. Quiet. Clean. House. Quiet. Working. Older. Male. Preferred Proof. Of. Income. And. Identification. Required and. Must. Be Verified Prior. To. Move. In. Dates. If. Interested Please Leave. Your. Callback Phone. Contact. Number.
                        </p>
                    </div>

                    <div className="g-white shadow-xl border border-[#D7D7D7] rounded-[15px] space-y-3">
                        <h3 className="font-medium bg-[#565ABF] px-4 py-3 text-white rounded-t-[15px]">Amenities</h3>
                        <div className="flex flex-wrap gap-6 text-sm p-4">
                            {[
                                "Fully furnished",
                                "High-speed Wi-Fi",
                                "Air Conditioning & Heating",
                                "In-unit Washing Machine",
                                "24/7 Security & Doorman",
                                "Parking",
                                "Living room",
                            ].map((amenity, idx) => (
                                <span
                                    key={idx}
                                    className="text-black"
                                >
                                    <span className="text-[#198754] text-[22px]">✔</span> {amenity}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="g-white shadow-xl border border-[#D7D7D7] rounded-[15px] space-y-3">
                        <h3 className="font-medium bg-[#565ABF] px-4 py-3 text-white rounded-t-[15px]">Availability</h3>
                        <div className="px-4 py-3 mt-0">
                        <table className="text-sm w-full text-black">
                            <tbody>
                                <tr>
                                    <td className="py-1 w-40 font-medium">Available</td>
                                    <td>Now</td>
                                </tr>
                                <tr>
                                    <td className="py-1 w-40 font-medium">Minimum term</td>
                                    <td>None</td>
                                </tr>
                                <tr>
                                    <td className="py-1 w-40 font-medium">Maximum term</td>
                                    <td>None</td>
                                </tr>
                            </tbody>
                        </table>
                        </div>
                    </div>

                    <div className="g-white mb-6 shadow-xl border border-[#D7D7D7] rounded-[15px] space-y-3">
                        <h3 className="font-medium bg-[#565ABF] px-4 py-3 text-white rounded-t-[15px]">New roommate preferences</h3>
                        <div className="px-4 py-3 mt-0">
                        <table className="text-sm w-full text-black">
                            <tbody>
                                <tr>
                                    <td className="py-1 w-40 font-medium">Gender</td>
                                    <td>No preference</td>
                                </tr>
                                                                <tr>
                                    <td className="py-1 w-40 font-medium">References</td>
                                    <td>No</td>
                                </tr>
                                <tr>
                                    <td className="py-1 w-40 font-medium">Occupation</td>
                                    <td>No preference</td>
                                </tr>
                                <tr>
                                    <td className="py-1 w-40 font-medium">Smoking</td>
                                    <td>No</td>
                                </tr>
                                <tr>
                                    <td className="py-1 w-40 font-medium">Couples OK</td>
                                    <td>No</td>
                                </tr>
                            </tbody>
                        </table>
                        </div>
                    </div>
                </div>

                <div className="col-span-1 space-y-4">
                    <div className="bg-white shadow-xl border border-[#D7D7D7] rounded-[4px] p-5 text-center">
                        <img
                            src={agent1}
                            alt="user"
                            className="w-20 h-20 rounded-full mx-auto"
                        />
                        <h3 className="mt-2 font-semibold text-black mb-1">Jhon</h3>
                        <p className="text-sm text-black mb-1">live-out landlord</p>
                                                <p className="text-sm text-black mb-1">Location:</p>
                        <p className="text-sm text-black mb-1">Member since: <span className="text-[#565ABF]">Jan 2025</span></p>
                        <button className="mt-3 w-full bg-[#565ABF] flex items-center justify-center gap-2 text-white py-2 rounded-[5px]">
                            <TfiEmail /> Message
                        </button>
                    </div>

                    <div className="bg-white shadow-xl border border-[#D7D7D7] rounded-[4px]">
                        <h4 className="text-[18px] font-medium text-black border-b flex items-center gap-2 px-4 py-3"><BiCheckShield color="#198754" size={20}/>Stay safe</h4>
                        <p className="text-[18px] text-black px-4 py-3">
                            <span className="text-[#565ABF]">TIP</span>: Always view before you pay any money.
                        </p>
                        <div className="px-4 mt-0 mb-4">
                        <button className="flex items-center gap-2 rounded-[5px] text-black px-3 py-2 border-[1px] border-[#B6B6BC]"><BsFlag />Report this ad</button>
                        </div>
                    </div>

                    <button className="bg-[#565ABF] text-white font-semibold mt-5 py-3 px-4 rounded-[12px]">
                        Request to Team Up
                    </button>
                </div>
            </div>
        </>

    );
}
