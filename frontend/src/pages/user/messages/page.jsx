import React from "react";
import { FiSend } from "react-icons/fi";

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
    <div className="px-6">
    <div className="container mt-5 mb-8 h-screen w-full bg-white flex border rounded-lg shadow-sm">
      {/* Sidebar */}
      <div className="w-1/4 border-r flex flex-col">
        {/* Search */}
        <div className="p-3 border-b">
          <input
            type="text"
            placeholder="Search"
            className="w-full px-3 py-2 rounded-md text-sm bg-gray-100 focus:outline-none"
          />
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {chats.map((chat, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-3 px-4 py-3 cursor-pointer ${
                idx === 0 ? "bg-black text-white" : "hover:bg-gray-100"
              }`}
            >
              {/* avatar */}
              <img
                src={`https://i.pravatar.cc/40?img=${idx + 1}`}
                alt={chat.name}
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <h4
                  className={`text-sm font-medium ${
                    idx === 0 ? "text-white" : "text-gray-800"
                  }`}
                >
                  {chat.name}
                </h4>
                <p
                  className={`text-xs truncate w-40 ${
                    idx === 0 ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  {chat.subtitle}
                </p>
              </div>
              <span
                className={`text-xs ${
                  idx === 0 ? "text-gray-300" : "text-gray-400"
                }`}
              >
                {chat.time}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center px-5 py-3 border-b">
          <img
            src="https://i.pravatar.cc/40?img=1"
            alt="Esther"
            className="w-10 h-10 rounded-full mr-3"
          />
          <div>
            <h3 className="font-medium text-gray-800">Esther Howard</h3>
            <p className="text-xs text-green-500">Active Now</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50">
          {/* Incoming */}
          <div className="flex items-start gap-3">
            <img
              src="https://i.pravatar.cc/35?img=1"
              alt="Esther"
              className="w-8 h-8 rounded-full"
            />
            <div>
              <div className="bg-gray-100 px-4 py-2 rounded-lg text-sm text-gray-700 max-w-md">
                <p>Hello Jenny,</p>
                <p>I want to buy your property but it’s too much expensive.</p>
              </div>
              <span className="text-xs text-gray-400">3:10 PM</span>
            </div>
          </div>

          {/* Outgoing */}
          <div className="flex items-start justify-end gap-3">
            <div className="text-right">
              <div className="bg-indigo-50 px-4 py-2 rounded-lg text-sm text-gray-800 max-w-md">
                <p className="font-semibold">Jenny Wilson</p>
                <p>
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

          {/* Incoming */}
          <div className="flex items-start gap-3">
            <img
              src="https://i.pravatar.cc/35?img=1"
              alt="Esther"
              className="w-8 h-8 rounded-full"
            />
            <div>
              <div className="bg-gray-100 px-4 py-2 rounded-lg text-sm text-gray-700 max-w-md">
                <p>
                  Okay Wilson. I’m okay with price, can you tell me about your
                  property specification and information?
                </p>
              </div>
              <span className="text-xs text-gray-400">3:15 PM</span>
            </div>
          </div>

          {/* Outgoing */}
          <div className="flex items-start justify-end gap-3">
            <div className="text-right">
              <div className="bg-indigo-50 px-4 py-2 rounded-lg text-sm text-gray-800 max-w-md">
                <p className="font-semibold">Jenny Wilson</p>
                <p>
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

        {/* Input */}
        <div className="flex items-center border-t p-3 gap-2">
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 rounded-full bg-gray-100 focus:outline-none text-sm"
          />
          <button className="bg-black text-white p-3 rounded-full">
            <FiSend size={18} />
          </button>
        </div>
      </div>
    </div>
    </div>
  );
}
