export default function RoomWantedAd() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <div className="bg-gradient-to-r from-[#565ABF] to-[#A321A6] py-5">
                <h1 className="text-center text-white text-2xl font-semibold">
                    Post A Room Wanted Ad
                </h1>
            </div>

            <div className="max-w-4xl mx-auto space-y-8 mt-6">
                <div className="bg-white rounded-lg shadow-xl border border-gray-200 ">
                    <div className="bg-[#565ABF] text-white px-4 py-3 rounded-t-lg font-semibold">
                        Basic Details
                    </div>
                    <div className="px-4 py-3 grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-gray-700">Property Type</label>
                            <select className="w-full border-[1px] border-[#D7D7D7] rounded-[14px] form-control">
                                <option>Room</option>
                                <option>Apartment</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-700">Room Sizes</label>
                            <select className="w-full border-[1px] border-[#D7D7D7] rounded-[14px] form-control">
                                <option>A small or large room</option>
                                <option>Large</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-700">Country</label>
                            <input
                                type="text"
                                className="w-full border-[1px] border-[#D7D7D7] rounded-[14px] form-control"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Preferred City</label>
                            <input
                                type="text"
                                className="w-full border-[1px] border-[#D7D7D7] rounded-[14px] form-control"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Nearby Landmarks</label>
                            <input
                                type="text"
                                className="w-full border-[1px] border-[#D7D7D7] rounded-[14px] form-control"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Zip Code</label>
                            <input
                                type="text"
                                className="w-full border-[1px] border-[#D7D7D7] rounded-[14px] form-control"
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-xl border border-gray-200">
                    <div className="bg-[#565ABF] text-white px-4 py-3 rounded-t-lg font-semibold">
                        Budget & Requirements
                    </div>
                    <div>
                        <div className="px-4 py-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-700">Your Budget</label>
                                <input
                                    type="text"
                                    placeholder="total rental amount you can afford"
                                    className="w-full border-[1px] border-[#D7D7D7] rounded-[14px] form-control"
                                />
                            </div>
                            <div className="flex items-end gap-6">
                                <label className="flex items-center gap-2 text-sm">
                                    <input type="radio" name="budget" defaultChecked />
                                    Per Month
                                </label>
                                <label className="flex items-center gap-2 text-sm">
                                    <input type="radio" name="budget" />
                                    Per Week
                                </label>
                            </div>
                        </div>

                        <div className="px-4 py-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-700">Move-in Date</label>
                                <input
                                    type="date"
                                    className="w-full border-[1px] border-[#D7D7D7] rounded-[14px] form-control"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700">
                                    Period Accommodation Needed For
                                </label>
                                <input
                                    type="text"
                                    className="w-full border-[1px] border-[#D7D7D7] rounded-[14px] form-control"
                                />
                            </div>
                        </div>

                        <div className="px-4 py-2 mb-4">
                            <label className="block text-gray-700 mb-2">Amenities</label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                {[
                                    "Furnished",
                                    "Shared living room",
                                    "Washing machine",
                                    "Yard/patio",
                                    "Balcony/roof terrace",
                                    "Parking",
                                    "Garage",
                                    "Disabled access",
                                    "Internet",
                                    "Private bathroom",
                                ].map((amenity) => (
                                    <label
                                        key={amenity}
                                        className="flex items-center gap-2 px-3 py-2"
                                    >
                                        <input type="checkbox" />
                                        {amenity}
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-xl border border-gray-200">
                    <div className="bg-[#565ABF] text-white px-4 py-3 rounded-t-lg font-semibold">
                        Personal Info
                    </div>
                    <div className="px-4 py-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 mb-1">Full Name</label>
                            <input
                                type="text"
                                placeholder="Full Name"
                                className="w-full border-[1px] border-[#D7D7D7] rounded-[14px] form-control"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-1">Age</label>
                            <input
                                type="number"
                                placeholder="Age"
                                className="w-full border-[1px] border-[#D7D7D7] rounded-[14px] form-control"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 mb-1">Gender</label>
                            <select className="w-full border-[1px] border-[#D7D7D7] rounded-[14px] form-control">
                                <option>Male</option>
                                <option>Female</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-1">Occupation</label>
                            <input
                                type="text"
                                className="w-full border-[1px] border-[#D7D7D7] rounded-[14px] form-control"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-1">Do You Smoke?</label>
                            <select className="w-full border-[1px] border-[#D7D7D7] rounded-[14px] form-control">
                                <option>Yes</option>
                                <option>No</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-1">Do You Have Any Pets?</label>
                            <select className="w-full border-[1px] border-[#D7D7D7] rounded-[14px] form-control">
                                <option>Yes</option>
                                <option>No</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-1">
                                Your Preferred Language
                            </label>
                            <input
                                type="text"
                                placeholder="Age"
                                className="w-full border-[1px] border-[#D7D7D7] rounded-[14px] form-control"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-1">Roommate Preference</label>
                            <select className="w-full border-[1px] border-[#D7D7D7] rounded-[14px] form-control">
                                <option>Male</option>
                                <option>Female</option>
                            </select>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-gray-700 mb-1">
                                What exactly you are looking for
                            </label>
                            <textarea
                                placeholder="Please write what exactly you are looking for..."
                                className="w-full border-[1px] border-[#D7D7D7] rounded-[14px] form-control"
                                rows={4}
                            ></textarea>
                        </div>

                        <div className="md:col-span-2 mb-4">
                            <label className="block text-gray-700 mb-1">Upload Photos</label>
                            <div className="flex items-center gap-4 border-[1px] border-[#D7D7D7] w-1/2 rounded-[14px]">
                                <button className="bg-black text-white px-4 py-3 rounded-lg">
                                    Choose file
                                </button>
                                <span className="text-gray-500">No file chosen</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <label className="text-black text-lg">TEAM UP</label>
                    <div className="flex items-start gap-3">
                        <input type="checkbox" className="mt-1" />
                        <span className="text-[14px] text-[#1C1C1E]">
                            I/we are also interested in Team Up ?
                        </span>
                    </div>
                    <span className="text-sm text[#696974]">Tick this if you might like to Buddy Up with other room seekers to find a whole apartment<br />
                        or house together and start a brand new roomshare.</span>
                </div>

                <div className="flex justify-end mb-6">
                    <button className="bg-[#565ABF] text-white font-medium px-4 py-3 rounded-[6px]">
                        Preview & Publish →
                    </button>
                </div>
            </div>
        </div>
    );
}
