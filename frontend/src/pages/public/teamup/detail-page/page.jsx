"use client";
import { useEffect } from "react";
import "preline/preline";
import profile1 from "../../../../assets/img/ghouraf/profile1.jpg";
import profile2 from "../../../../assets/img/ghouraf/profile2.jpg";
import profile3 from "../../../../assets/img/ghouraf/profile3.jpg";
import profile4 from "../../../../assets/img/ghouraf/profile4.jpg";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { FaArrowLeftLong } from "react-icons/fa6";
import { TfiEmail } from "react-icons/tfi";
import { BiCheckShield } from "react-icons/bi";
import { BsFlag } from "react-icons/bs";
import { Link } from "react-router-dom";

export default function TeamUpDetailPage() {

    useEffect(() => {
        if (typeof window === "undefined") return;
        window.HSCarousel?.autoInit();

        const root = document.querySelector("[data-hs-carousel]");
        if (!root) {
            console.warn("No [data-hs-carousel] root found");
            return;
        }

        const body = root.querySelector(".hs-carousel-body");
        const viewport = body?.parentElement;
        const slides = Array.from(root.querySelectorAll(".hs-carousel-slide"));
        const pagination = root.querySelector(
            "[data-hs-carousel-pagination], .hs-carousel-pagination"
        );
        const thumbs = pagination ? Array.from(pagination.children) : [];

        if (!body || !viewport || slides.length === 0 || thumbs.length === 0) {
            console.warn("Carousel elements missing", {
                body: !!body,
                viewport: !!viewport,
                slidesCount: slides.length,
                thumbsCount: thumbs.length,
            });
            return;
        }

        const centerThumb = (thumbEl) => {
            if (!thumbEl) return;
            const container = pagination;
            const containerRect = container.getBoundingClientRect();
            const elRect = thumbEl.getBoundingClientRect();

            const delta =
                (elRect.left + elRect.width / 2) -
                (containerRect.left + containerRect.width / 2);

            container.scrollTo({
                left: Math.max(0, container.scrollLeft + delta),
                behavior: "smooth",
            });
        };

        let activeIndex = -1;
        const setActiveIndex = (idx) => {
            if (idx === activeIndex) return;
            activeIndex = idx;

            thumbs.forEach((t, i) => {
                t.classList.toggle("hs-carousel-active", i === idx);
                t.classList.toggle("active-thumb", i === idx);
            });

            centerThumb(thumbs[idx]);
        };

        const thresholds = Array.from({ length: 101 }, (_, i) => i / 100);
        const io = new IntersectionObserver(
            (entries) => {
                let best = null;
                for (const e of entries) {
                    if (!best || e.intersectionRatio > best.intersectionRatio) best = e;
                }
                if (!best) return;
                const index = slides.indexOf(best.target);
                if (index !== -1) setActiveIndex(index);
            },
            {
                root: viewport,
                threshold: thresholds,
            }
        );

        slides.forEach((s) => io.observe(s));

        const computeVisibleByOverlap = () => {
            const vp = viewport.getBoundingClientRect();
            let bestIdx = 0;
            let bestArea = -1;
            slides.forEach((s, i) => {
                const r = s.getBoundingClientRect();
                const overlapW = Math.max(
                    0,
                    Math.min(r.right, vp.right) - Math.max(r.left, vp.left)
                );
                const overlapH = Math.max(
                    0,
                    Math.min(r.bottom, vp.bottom) - Math.max(r.top, vp.top)
                );
                const area = overlapW * overlapH;
                if (area > bestArea) {
                    bestArea = area;
                    bestIdx = i;
                }
            });
            setActiveIndex(bestIdx);
        };

        setTimeout(() => {
            computeVisibleByOverlap();
        }, 120);

        const prev = root.querySelector(".hs-carousel-prev");
        const next = root.querySelector(".hs-carousel-next");
        const arrowHandler = () => setTimeout(computeVisibleByOverlap, 40);

        prev?.addEventListener("click", arrowHandler);
        next?.addEventListener("click", arrowHandler);
        window.addEventListener("resize", computeVisibleByOverlap);

        return () => {
            io.disconnect();
            prev?.removeEventListener("click", arrowHandler);
            next?.removeEventListener("click", arrowHandler);
            window.removeEventListener("resize", computeVisibleByOverlap);
        };
    }, []);


    const images = [
        profile1,
        profile2,
        profile3,
        profile4,
    ];

    return (
        <>
            <div className="container px-4 mt-5">
                <button className="text-sm px-4 py-2 font-medium text-black border-[1px] border-[#AACCEE] rounded-[2px]">
                    <Link to={`/place-wanted`} className="flex items-center gap-2">
                        <FaArrowLeftLong />  Back to Ads
                    </Link>
                </button>
            </div>

            <div className="container px-4 mt-4 grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="col-span-3 space-y-6">
                    <h2 className="text-[20px] text-black font-semibold">
                        Looking for flatmate to share 2BHK in pune city center
                    </h2>
                    <div className="flex gap-4">
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
                                                        className="object-cover w-full h-full"
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
                                        className="hs-carousel-pagination flex mt-2 gap-2 w-full overflow-hidden no-scrollbar scroll-smooth"
                                    >
                                        {images.map((src, idx) => (
                                            <div
                                                key={idx}
                                                className="hs-carousel-pagination-item shrink-0 size-20 cursor-pointer rounded-md overflow-hidden"
                                            >
                                                <img
                                                    src={src}
                                                    alt={`Thumbnail ${idx + 1}`}
                                                    className="object-cover w-full h-full border border-gray-200 rounded-md transition-all"
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
                        <div>
                            <p className="text-black text-[16px]">
                                Hi I’m John I’m 22 and graduated this year from MMU. I decided to stay in Manchester and am working full time as a TA at a primary school. I’m a tidy fun friendly person, loves to chill but also go for a drink and do activities together Just looking for a place where can make friends rather than just live in same place. Currently living in a house share how ever it’s fallen through and I really need to find somewhere by November Only requirement really is somewhere with parking Happy to go for a coffee or get a drink and talk more and make friends
                            </p>
                        </div>
                    </div>
                    <div className="bg-white shadow-xl border border-[#D7D7D7] rounded-[15px] p-4 space-y-3">
                        <h4 className="text-[18px] text-black font-semibold mt-0">John</h4>
                        <h5 className="text-[16px] text-black flex items-center gap-2">25, Male</h5>
                        <p>Total budget: $750 / Month</p>
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
                                        <td>8 Months</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="g-white shadow-xl border border-[#D7D7D7] rounded-[15px] space-y-3">
                        <h3 className="font-medium bg-[#565ABF] px-4 py-3 text-white rounded-t-[15px]">Looking in</h3>
                        <div className="flex flex-wrap gap-6 text-sm p-4">
                            {[
                                "Brixton",
                                "Chelsea & Fulham",
                                "Clapham, Battersea & Wandsworth",
                                "In-unit Washing Machine",
                                "Docklands",
                                "Hackney & Clapton",
                                "Tooting & Streatham",
                            ].map((amenity, idx) => (
                                <span
                                    key={idx}
                                    className="text-black"
                                >
                                    <span className="text-[#198754] text-[22px]">.</span> {amenity}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="g-white shadow-xl border border-[#D7D7D7] rounded-[15px] space-y-3">
                        <h3 className="font-medium bg-[#565ABF] px-4 py-3 text-white rounded-t-[15px]">Amenities required</h3>
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
                        <h3 className="font-medium bg-[#565ABF] px-4 py-3 text-white rounded-t-[15px]">About Me</h3>
                        <div className="px-4 py-3 mt-0">
                            <table className="text-sm w-full text-black">
                                <tbody>
                                    <tr>
                                        <td className="py-1 w-40 font-medium">Age</td>
                                        <td>33</td>
                                    </tr>
                                    <tr>
                                        <td className="py-1 w-40 font-medium">Smoker?</td>
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
                                        <td className="py-1 w-40 font-medium">Any pets?</td>
                                        <td>Yes</td>
                                    </tr>
                                    <tr>
                                        <td className="py-1 w-40 font-medium">Language</td>
                                        <td>English</td>
                                    </tr>
                                    <tr>
                                        <td className="py-1 w-40 font-medium">Occupation</td>
                                        <td>Professional</td>
                                    </tr>
                                    <tr>
                                        <td className="py-1 w-40 font-medium">Gender</td>
                                        <td>Male</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="g-white mb-6 shadow-xl border border-[#D7D7D7] rounded-[15px] space-y-3">
                        <h3 className="font-medium bg-[#565ABF] px-4 py-3 text-white rounded-t-[15px]">New household preferences</h3>
                        <div className="px-4 py-3 mt-0">
                            <table className="text-sm w-full text-black">
                                <tbody>
                                    <tr>
                                        <td className="py-1 w-40 font-medium">Smokers Ok?</td>
                                        <td>No</td>
                                    </tr>
                                    <tr>
                                        <td className="py-1 w-40 font-medium">Pets Ok?</td>
                                        <td>Yes</td>
                                    </tr>
                                    <tr>
                                        <td className="py-1 w-40 font-medium">Occupation</td>
                                        <td>Professionals</td>
                                    </tr>
                                    <tr>
                                        <td className="py-1 w-40 font-medium">Age Range</td>
                                        <td>20-29</td>
                                    </tr>
                                    <tr>
                                        <td className="py-1 w-40 font-medium">Gender</td>
                                        <td>Female</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="col-span-1 space-y-4">
                    <div className="bg-white shadow-xl border border-[#D7D7D7] rounded-[4px] p-5 text-center">
                        <img
                            src={profile1}
                            alt="user"
                            className="w-20 h-20 rounded-full mx-auto object-cover"
                        />
                        <h3 className="mt-2 font-semibold text-black mb-1">Jhon</h3>
                        <p className="text-sm text-black mb-1">Location:</p>
                        <p className="text-sm text-black mb-1">Member since: <span className="text-[#565ABF]">Jan 2025</span></p>
                        <button className="mt-3 w-full bg-[#565ABF] flex items-center justify-center gap-2 text-white py-2 rounded-[5px]">
                            <TfiEmail /> Message
                        </button>
                    </div>

                    <div className="bg-white shadow-xl border border-[#D7D7D7] rounded-[4px]">
                        <h4 className="text-[18px] font-medium text-black border-b flex items-center gap-2 px-4 py-3"><BiCheckShield color="#198754" size={20} />Stay safe</h4>
                        <p className="text-[18px] text-black px-4 py-3">
                            <span className="text-[#565ABF]">TIP</span>: Always view before you pay any money.
                        </p>
                        <div className="px-4 mt-0 mb-4">
                            <button className="flex items-center gap-2 rounded-[5px] text-black px-3 py-2 border-[1px] border-[#B6B6BC]"><BsFlag />Report this ad</button>
                        </div>
                    </div>
                </div>
            </div>

        </>

    );
}