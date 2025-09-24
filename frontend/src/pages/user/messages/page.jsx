import React from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { CiSearch } from "react-icons/ci";
import { GoDotFill } from "react-icons/go";
import { RiDeleteBinLine } from "react-icons/ri";
import { TbSend2 } from "react-icons/tb";

export default function Messages() {
  const chats = [
    { name: "Esther Howard", subtitle: "Microsoft", time: "1m" },
    { name: "Devon Lane", subtitle: "New Mexico", time: "5m" },
    { name: "Annette Black", subtitle: "2464 Royal Ln, Mesa...", time: "1h" },
    { name: "Marvin McKinney", subtitle: "Amet minim mollit...", time: "2d" },
    { name: "Theresa Webb", subtitle: "177", time: "1w" },
    { name: "Dianne Russell", subtitle: "Women's White Handbag", time: "1w" },
    { name: "Cameron Williamson", subtitle: "2 hours", time: "1m" },
    { name: "Albert Flores", subtitle: "Okay Wilson. I'm okay...", time: "2h" },
    { name: "Guy Hawkins", subtitle: "Marketing Officer", time: "2m" },
  ];

  return (
    <div className="container">
      <div className="mt-5 mb-8 h-[550px] w-full bg-white flex border rounded-lg shadow-sm">
        <div className="w-1/4 border-r flex flex-col">
          <div className="p-3 border-b">
            <h1 className="mb-3 text-black font-semibold text-[20px]">Message</h1>
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search"
                className="w-full px-3 py-2 pr-10 rounded-[5px] border-[1px] border-[#A1A1A1] text-sm bg-white"
              />
              <CiSearch size={25} className="absolute right-3 top-1/2 -translate-y-1/2 text-black" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar">
            {chats.map((chat, idx) => (
              <div
                key={idx}
                className={`flex items-center gap-3 px-4 py-3 cursor-pointer ${idx === 0 ? "bg-black text-white" : "hover:bg-gray-100"
                  }`}
              >
                <div className="relative">
                  <img
                    src={`https://i.pravatar.cc/40?img=${idx + 1}`}
                    alt={chat.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <GoDotFill fill="#27C200" className="absolute right-[-3px] bottom-[-4px]" />
                </div>
                <div className="flex-1">
                  <h4
                    className={`text-sm font-medium ${idx === 0 ? "text-white" : "text-gray-800"
                      }`}
                  >
                    {chat.name}
                  </h4>
                  <p
                    className={`text-xs truncate w-40 ${idx === 0 ? "text-gray-300" : "text-gray-500"
                      }`}
                  >
                    {chat.subtitle}
                  </p>
                </div>
                <span
                  className={`text-xs ${idx === 0 ? "text-gray-300" : "text-gray-400"
                    }`}
                >
                  {chat.time}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <div className="flex justify-between items-center px-3 border-b">
            <div className="flex items-center py-3">
              <img
                src="https://i.pravatar.cc/40?img=1"
                alt="Esther"
                className="w-10 h-10 rounded-full mr-3"
              />
              <div>
                <h3 className="font-medium text-gray-800">Esther Howard</h3>
                <p className="text-xs text-[#636A80] flex items-center gap-1"><GoDotFill size={20} fill="#27C200" /> Active Now</p>
              </div>
            </div>
            <div>
              <RiDeleteBinLine size={25} fill="black" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar px-3 py-2 space-y-6 bg-gray-50">
            <div className="flex items-start gap-3">
              <img
                src="https://i.pravatar.cc/35?img=1"
                alt="Esther"
                className="w-8 h-8 rounded-full"
              />
              <div>
                <div className="bg-[#D7D7D740] px-4 py-2 rounded-lg text-sm text-gray-700 max-w-md">
                  <p className="font-semibold">Esther Howard</p>
                  <p className="leading-[20px]">Hello Jenny, I want to buy your property but it’s too much expensive.</p>
                </div>
                <span className="text-xs text-gray-400">3:10 PM</span>
              </div>
            </div>

            <div className="flex items-start justify-end gap-2">
              <div className="text-right">
                <div className="bg-[#F3F6FF] px-4 py-2 rounded-lg text-sm text-gray-800 max-w-md">
                  <p className="font-semibold">Jenny Wilson</p>
                  <p className="leading-[20px] text-left">
                    Hey Esther, Sorry I can’t lower the price. It’s already very
                    low and right now I can’t lower it further.
                  </p>
                </div>
                <span className="text-xs text-gray-400">3:14 PM</span>
              </div>
              <img
                src="https://i.pravatar.cc/35?img=11"
                alt="Jenny"
                className="w-8 h-8 rounded-full"
              />
            </div>

            <div className="flex items-start gap-2">
              <img
                src="https://i.pravatar.cc/35?img=1"
                alt="Esther"
                className="w-8 h-8 rounded-full"
              />
              <div>
                <div className="bg-[#D7D7D740] px-4 py-2 rounded-lg text-sm text-gray-700 max-w-md">
                  <p className="font-semibold">Esther Howard</p>
                  <p className="leading-[20px]">
                    Okay Wilson. I’m okay with price, can you tell me about your
                    property specification and information?
                  </p>
                </div>
                <span className="text-xs text-gray-400">3:15 PM</span>
              </div>
            </div>

            <div className="flex items-start justify-end gap-2">
              <div className="text-right">
                <div className="bg-[#F3F6FF] px-4 py-2 rounded-lg text-sm text-gray-800 max-w-md">
                  <p className="font-semibold">Jenny Wilson</p>
                  <p className="leading-[20px] text-left">
                    Sure Esther. The property includes [Insert specifications here,
                    e.g., size, location, features].
                  </p>
                </div>
                <span className="text-xs text-gray-400">3:16 PM</span>
              </div>
              <img
                src="https://i.pravatar.cc/35?img=11"
                alt="Jenny"
                className="w-8 h-8 rounded-full"
              />
            </div>
          </div>

          <div className="flex items-center border-t p-3 gap-2">
            <div className="relative flex-1">
              <AiOutlinePlus size={30} className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Type your message..."
                className="w-full pl-[35px] pr-4 py-2 text-[15px]"
              />
            </div>

            <button className="bg-black text-white px-3 py-2 rounded-[5px] flex items-center justify-center">
              <TbSend2 size={28} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
