"use client";
import { useEffect, useState } from "react";
import "preline/preline";
// import property1 from "../../../../assets/img/ghouraf/property1.png";
// import property2 from "../../../../assets/img/ghouraf/property2.png";
// import property3 from "../../../../assets/img/ghouraf/property3.jpg";
// import property4 from "../../../../assets/img/ghouraf/property4.jpg";
// import property5 from "../../../../assets/img/ghouraf/property5.jpg";
// import property6 from "../../../../assets/img/ghouraf/property6.jpg";
// import property7 from "../../../../assets/img/ghouraf/property7.png";
// import property8 from "../../../../assets/img/ghouraf/property8.jpg";
import agent1 from "../../../../assets/img/ghouraf/agent1.jpg";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import { TfiEmail, TfiLocationPin } from "react-icons/tfi";
import { BiCheckShield } from "react-icons/bi";
import { BsFlag } from "react-icons/bs";
import { useParams } from "react-router-dom";
import Loader from "components/common/Loader";
import { getFullLocation } from "utils/locationHelper";

export default function DetailPage() {
  const { id } = useParams();
  const apiUrl = process.env.REACT_APP_API_URL;
  const [space, setSpace] = useState(null);
  const [showTeamUp, setShowTeamUp] = useState(false);
  const locationString = getFullLocation(space.city, space.state, space.country);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchSpace = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${apiUrl}spaces/${id}`);
        const data = await res.json();

        if (data.success) {
          setSpace(data.data);
        } else {
          console.error("Space not found");
        }
      } catch (err) {
        console.error("Error fetching space:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSpace();
  }, [id, apiUrl]);

  const interestedPeople = [
    {
      id: 1,
      name: "Trish Hanson",
      role: "Works in IT, looking for non-smoker",
      avatar: agent1,
    },
    {
      id: 2,
      name: "Alex Martinez",
      role: "Software engineer, tidy and easy-going, prefers quiet evenings.",
      avatar: agent1,
    },
    {
      id: 3,
      name: "Emma Lewis",
      role: "Works in hospitality, loves cooking, very social.",
      avatar: agent1,
    },
    {
      id: 4,
      name: "Emma Lewis",
      role: "Works in hospitality, loves cooking, very social.",
      avatar: agent1,
    },
    {
      id: 5,
      name: "Emma Lewis",
      role: "Works in hospitality, loves cooking, very social.",
      avatar: agent1,
    },
    {
      id: 6,
      name: "Emma Lewis",
      role: "Works in hospitality, loves cooking, very social.",
      avatar: agent1,
    },
  ];

  if (loading) {
    return <Loader fullScreen />;
  }

  if (!space) {
    return <div className="container mt-10 text-center">No space found.</div>;
  }

  const images = [
    space.featuredImage,
    ...(space.photos?.map((p) => p.url) || []),
  ];

  return (
    <>
      <div className="container px-4 mt-5">
        <button className="text-sm px-4 py-2 font-medium text-black flex items-center gap-2 border-[1px] border-[#AACCEE] rounded-[2px]">
          <FaArrowLeftLong />  Back to Ads
        </button>
      </div>

      <div className="container px-4 mt-4 grid grid-cols-1 md:grid-cols-4 gap-6">
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
                          src={`${src}`}
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
                        src={`${src}`}
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

          <div className="bg-white shadow-xl border border-[#D7D7D7] rounded-[15px] p-4 space-y-3">
            <h2 className="text-[20px] text-black font-semibold">
              {space.title}
            </h2>
            <p className="text-[18px] text-black font-semibold mt-0">${space.budget} / {space.budgetType}</p>
            <p className="text-[16px] text-black flex items-center gap-2"><TfiLocationPin /> {locationString}</p>
            <p className="text-black text-[16px]">
              {space.description}
            </p>
          </div>

          {space.amenities?.length > 0 && (
            <div className="g-white shadow-xl border border-[#D7D7D7] rounded-[15px] space-y-3">
              <h3 className="font-medium bg-[#565ABF] px-4 py-3 text-white rounded-t-[15px]">
                Amenities
              </h3>
              <div className="flex flex-wrap gap-6 text-sm p-4">
                {space.amenities.map((amenity, idx) => (
                  <span key={idx} className="text-black">
                    <span className="text-[#198754] text-[22px]">✔</span>{" "}
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="g-white shadow-xl border border-[#D7D7D7] rounded-[15px] space-y-3">
            <h3 className="font-medium bg-[#565ABF] px-4 py-3 text-white rounded-t-[15px]">Availability</h3>
            <div className="px-4 py-3 mt-0">
              <table className="text-sm w-full text-black">
                <tbody>
                  <tr>
                    <td className="py-1 w-40 font-medium">Available</td>
                    <td>Yes</td>
                  </tr>
                  {/* <tr>
                    <td className="py-1 w-40 font-medium">Minimum term</td>
                    <td>None</td>
                  </tr>
                  <tr>
                    <td className="py-1 w-40 font-medium">Maximum term</td>
                    <td>None</td>
                  </tr> */}
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
                    <td>{space.roomsAvailableFor}</td>
                  </tr>
                  {/* <tr>
                    <td className="py-1 w-40 font-medium">References</td>
                    <td>No</td>
                  </tr> */}
                  {/* <tr>
                    <td className="py-1 w-40 font-medium">Occupation</td>
                    <td>No preference</td>
                  </tr> */}
                  <tr>
                    <td className="py-1 w-40 font-medium">Smoking</td>
                   <td>{space.smoking ? "Allowed" : "Not Allowed"}</td>
                  </tr>
                  {/* <tr>
                    <td className="py-1 w-40 font-medium">Couples OK</td>
                    <td>No</td>
                  </tr> */}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-span-1 space-y-4">
          <div className="bg-white shadow-xl border border-[#D7D7D7] rounded-[4px] p-5 text-center">
            <img
              src={
                space.user?.profile?.photo
                  ? `${space.user.profile.photo}`
                  : agent1
              }
              alt="user"
              className="w-20 h-20 rounded-full mx-auto object-cover"
            />
            <h3 className="mt-2 font-semibold text-black mb-1">{space.user?.profile?.firstName} {space.user?.profile?.lastName}</h3>
            <p className="text-sm text-black mb-1">{space.personalInfo}</p>
            <p className="text-sm text-black mb-1">Location: {locationString}</p>
            <p className="text-sm text-black mb-1">Member since: <span className="text-[#565ABF]">{new Date(space.user?.createdAt).toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            })}</span></p>
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

          <button
            className="bg-[#565ABF] text-white font-semibold mt-5 py-3 px-4 rounded-[12px]"
            onClick={() => setShowTeamUp(true)}
          >
            Request to Team Up
          </button>

        </div>
      </div>

      {showTeamUp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl relative">
            <div className="flex relative justify-center items-center border-b px-5 py-3 bg-[#565ABF] rounded-t-lg">
              <h2 className="text-white text-[20px] font-semibold text-center">Team Up for This Apartment</h2>
              <button
                onClick={() => setShowTeamUp(false)}
                className="bg-black px-[6px] py-[0px] rounded-full text-white text-xl absolute right-[-10px] top-[-10px]"
              >
                ×
              </button>
            </div>

            <div className="p-4 max-h-[70vh] overflow-y-auto">
              <p className="text-gray-600 border-b pb-3 mb-4">
                These people have shown interest in sharing this apartment.  <br />
                Connect and find your perfect match.
              </p>

              <ul className="space-y-4">
                {interestedPeople.map((person) => (
                  <li
                    key={person.id}
                    className="flex justify-between items-center border-b pb-3"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={person.avatar}
                        alt={person.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="font-medium text-black">{person.name}</h4>
                        <p className="text-sm text-black">{person.role}</p>
                      </div>
                    </div>
                    <button className="flex items-center gap-2 bg-black text-white text-sm px-4 py-[12px] rounded-[5px]">
                      Message <FaArrowRightLong />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 border-t text-center">
              <button
                className="bg-[#008000] text-white px-4 py-2 rounded-[12px] font-medium"
                onClick={() => setShowTeamUp(false)}
              >
                I’m Interested
              </button>
            </div>
          </div>
        </div>
      )}

    </>

  );
}
