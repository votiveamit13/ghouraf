import { useEffect, useMemo, useState } from "react";
import { FaArrowRightLong, FaArrowLeftLong } from "react-icons/fa6";
import { Country, State, City } from "country-state-city";
import locales from "locale-codes";

export default function RoomWantedAd() {
    const apiUrl = process.env.REACT_APP_API_URL;
    const [allLocales, setAllLocales] = useState([]);
    const [isPreview, setIsPreview] = useState(false);
    const [formData, setFormData] = useState({
        propertyType: "",
        roomSize: "",
        country: "",
        state: "",
        city: "",
        zip: "",
        budget: "",
        budgetType: "",
        moveInDate: "",
        period: "",
        amenities: [],
        name: "",
        age: "",
        gender: "",
        occupation: "",
        smoke: "",
        pets: "",
        language: "",
        roommatePref: "",
        title: "",
        description: "",
        teamUp: false,
    });
    const [images, setImages] = useState([]);
    const countries = Country.getAllCountries();
    const cities = useMemo(() => {
        if (!formData.country) return [];
        const states = State.getStatesOfCountry(formData.country);
        return states.flatMap((s) =>
            City.getCitiesOfState(formData.country, s.isoCode)
        );
    }, [formData.country]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === "checkbox" && name === "amenities") {
            setFormData((prev) => ({
                ...prev,
                amenities: checked
                    ? [...prev.amenities, value]
                    : prev.amenities.filter((a) => a !== value),
            }));
        } else if (type === "checkbox") {
            setFormData((prev) => ({ ...prev, [name]: checked }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    useEffect(() => {
        setAllLocales(locales.all);
    }, []);

    const handleImageChange = (e) => {
        setImages(Array.from(e.target.files));
    };

    const handleSubmit = async () => {

        const formDataToSend = new FormData();

        Object.entries(formData).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                value.forEach((v) => formDataToSend.append(`${key}[]`, v));
            } else {
                formDataToSend.append(key, value);
            }
        });

        images.forEach((file) => formDataToSend.append("photos", file));


        try {
            const res = await fetch(`${apiUrl}createspacewanted`, {
                method: "POST",
                body: formDataToSend,
            });

            const data = await res.json();

            if (res.ok) {
                alert("Ad posted successfully!");
                console.log("Response:", data);
            } else {
                alert("Error: " + data.message);
            }
        } catch (err) {
            console.error(err);
            alert("Something went wrong.");
        }
    };



    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <div className="bg-gradient-to-r from-[#565ABF] to-[#A321A6] py-5">
                <h1 className="text-center text-white text-2xl font-semibold">
                    Post A Space Wanted Ad
                </h1>
            </div>

            <div className="w-full container px-8 space-y-8 mt-6">
                {isPreview ? (
                    <>
                        <div className="bg-white rounded-lg shadow-xl border border-gray-200">
                            <div className="bg-[#565ABF] text-white px-4 py-3 rounded-t-lg font-semibold">
                                Preview Ad
                            </div>
                            <div className="px-4 py-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <p><strong>Property Type:</strong> {formData.propertyType}</p>
                                <p><strong>Room Size:</strong> {formData.roomSize}</p>
                                <p className="md:col-span-2">
                                    <strong>Location:</strong> {formData.city}, {formData.state}, {formData.country} ({formData.zip})
                                </p>
                                <p><strong>Budget:</strong> {formData.budget} ({formData.budgetType})</p>
                                <p><strong>Move-in Date:</strong> {formData.moveInDate}</p>
                                <p className="md:col-span-2">
                                    <strong>Amenities:</strong>{" "}
                                    {formData.amenities.length > 0 ? formData.amenities.join(", ") : "None"}
                                </p>
                                <p className="md:col-span-2">
                                    <strong>Name:</strong> {formData.name} ({formData.age} years, {formData.gender})
                                </p>
                                <p><strong>Occupation:</strong> {formData.occupation}</p>
                                <p><strong>Smoking:</strong> {formData.smoke}</p>
                                <p><strong>Pets:</strong> {formData.pets}</p>
                                <p><strong>Roommate Preference:</strong> {formData.roommatePref}</p>
                                <p className="md:col-span-2">
                                    <strong>Description:</strong> {formData.description}
                                </p>
                                <p><strong>Team Up:</strong> {formData.teamUp ? "Yes" : "No"}</p>
                            </div>
                        </div>

                        <div className="flex justify-between mt-5 mb-5">
                            <button
                                onClick={() => setIsPreview(false)}
                                className="bg-gray-300 text-black font-medium px-4 py-3 rounded-[6px] flex items-center gap-2"
                            >
                                <FaArrowLeftLong /> Back to Edit
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="bg-[#565ABF] text-white font-medium px-5 py-3 rounded-[6px] flex items-center gap-2"
                            >
                                Publish <FaArrowRightLong />
                            </button>

                        </div>
                    </>
                ) : (
                    <>
                        <div className="bg-white rounded-lg shadow-xl border border-gray-200 ">
                            <div className="bg-[#565ABF] text-white px-4 py-3 rounded-t-lg font-semibold">
                                Basic Details
                            </div>
                            <div className="px-4 py-3 grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-gray-700">Property Type</label>
                                    <select
                                        className="w-full border-[1px] border-[#D7D7D7] rounded-[14px] form-control"
                                        name="propertyType"
                                        value={formData.propertyType}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select</option>
                                        <option value="Room">Room</option>
                                        <option value="Apartment">Apartment</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-700">Room Sizes</label>
                                    <select
                                        className="w-full border-[1px] border-[#D7D7D7] rounded-[14px] form-control"
                                        name="roomSize"
                                        value={formData.roomSize}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select</option>
                                        <option>1RK</option>
                                        <option>1BHK</option>
                                        <option>2BHK</option>
                                        <option>3BHK</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-700">Country</label>
                                    <select
                                        name="country"
                                        value={formData.country}
                                        onChange={handleChange}
                                        className="w-full border-[1px] border-[#D7D7D7] rounded-[14px] form-control"
                                    >
                                        <option value="">Select Country</option>
                                        {countries.map((c) => (
                                            <option key={c.isoCode} value={c.isoCode}>
                                                {c.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-700">State</label>
    <select
        name="state"
        value={formData.state}
        onChange={(e) => {
            handleChange(e);
            setFormData(prev => ({ ...prev, city: "" })); 
        }}
        disabled={!formData.country}
        className="w-full border-[1px] border-[#D7D7D7] rounded-[14px] form-control"
    >
        <option value="">Select State</option>
        {State.getStatesOfCountry(formData.country).map((s) => (
            <option key={s.isoCode} value={s.isoCode}>
                {s.name}
            </option>
        ))}
    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-700">Preferred City</label>
                                    <select
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        disabled={!formData.state}
                                        className="w-full border-[1px] border-[#D7D7D7] rounded-[14px] form-control"
                                    >
 <option value="">Select City</option>
        {City.getCitiesOfState(formData.country, formData.state).map((c) => (
            <option key={c.name} value={c.name}>
                {c.name}
            </option>
        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-gray-700">Zip Code</label>
                                    <input
                                        type="text"
                                        name="zip"
                                        value={formData.zip}
                                        onChange={handleChange}
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
                                            name="budget"
                                            value={formData.budget}
                                            onChange={handleChange}
                                            placeholder="Total rental amount you can afford"
                                            className="w-full border-[1px] border-[#D7D7D7] rounded-[14px] form-control"
                                        />
                                    </div>
                                    <div className="flex items-end gap-6">
                                        <label className="flex items-center gap-2 text-sm">
                                            <input
                                                type="radio"
                                                name="budgetType"
                                                value="Per Month"
                                                checked={formData.budgetType === "Per Month"}
                                                onChange={handleChange}
                                            />
                                            Per Month
                                        </label>
                                        <label className="flex items-center gap-2 text-sm">
                                            <input
                                                type="radio"
                                                name="budgetType"
                                                value="Per Week"
                                                checked={formData.budgetType === "Per Week"}
                                                onChange={handleChange}
                                            />
                                            Per Week
                                        </label>
                                    </div>
                                </div>

                                <div className="px-4 py-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-700">Move-in Date</label>
                                        <input
                                            type="date"
                                            name="moveInDate"
                                            value={formData.moveInDate}
                                            onChange={handleChange}
                                            className="w-full border-[1px] border-[#D7D7D7] rounded-[14px] form-control"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700">
                                            Duration of stay
                                        </label>
                                        <select
                                            name="period"
                                            value={formData.period}
                                            onChange={handleChange}
                                            className="w-full border-[1px] border-[#D7D7D7] rounded-[14px] form-control"
                                        >
                                            <option value="">Select</option>
                                            <option value="3 months">3 months</option>
                                            <option value="6 months">6 months</option>
                                            <option value="1 year">1 year</option>
                                        </select>
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
                                            <label key={amenity} className="flex items-center gap-2 px-3 py-2">
                                                <input
                                                    type="checkbox"
                                                    name="amenities"
                                                    value={amenity}
                                                    checked={formData.amenities.includes(amenity)}
                                                    onChange={handleChange}
                                                />
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
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Full Name"
                                        className="w-full border-[1px] border-[#D7D7D7] rounded-[14px] form-control"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-1">Age</label>
                                    <input
                                        type="number"
                                        name="age"
                                        value={formData.age}
                                        onChange={handleChange}
                                        placeholder="Age"
                                        className="w-full border-[1px] border-[#D7D7D7] rounded-[14px] form-control"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 mb-1">Gender</label>
                                    <select
                                        className="w-full border-[1px] border-[#D7D7D7] rounded-[14px] form-control"
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-1">Occupation</label>
                                    <select
                                        name="occupation"
                                        value={formData.occupation}
                                        onChange={handleChange}
                                        className="w-full border-[1px] border-[#D7D7D7] rounded-[14px] form-control"
                                    >
                                        <option value="">Select</option>
                                        <option value="Student">Student</option>
                                        <option value="Professionals">Professionals</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-1">Do You Smoke?</label>
                                    <select
                                        className="w-full border-[1px] border-[#D7D7D7] rounded-[14px] form-control"
                                        name="smoke"
                                        value={formData.smoke}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select</option>
                                        <option value="Yes">Yes</option>
                                        <option value="No">No</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-1">Do You Have Any Pets?</label>
                                    <select
                                        className="w-full border-[1px] border-[#D7D7D7] rounded-[14px] form-control"
                                        name="pets"
                                        value={formData.pets}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select</option>
                                        <option value="Yes">Yes</option>
                                        <option value="No">No</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-1">
                                        Your Preferred Language
                                    </label>
                                    <select
                                        name="language"
                                        value={formData.language}
                                        onChange={handleChange}
                                        placeholder="Age"
                                        className="w-full border-[1px] border-[#D7D7D7] rounded-[14px] form-control"
                                    >
                                        <option value="">Select Language</option>
                                        {allLocales.map((locale) => (
                                            <option key={locale.tag} value={locale.tag}>
                                                {locale.name} ({locale.tag})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-1">Roommate Preference</label>
                                    <select
                                        className="w-full border-[1px] border-[#D7D7D7] rounded-[14px] form-control"
                                        name="roommatePref"
                                        value={formData.roommatePref}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-gray-700 mb-1">
                                        Title
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}

                                        className="w-full border-[1px] border-[#D7D7D7] rounded-[14px] form-control"

                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-gray-700 mb-1">
                                        Description
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        placeholder="Please write what exactly you are looking for..."
                                        className="w-full border-[1px] border-[#D7D7D7] rounded-[14px] form-control"
                                        rows={4}
                                    ></textarea>
                                </div>

                                <div className="md:col-span-2 mb-4">
                                    <label className="block text-gray-700 mb-1">Upload Photos</label>

                                    <div className="flex items-center gap-4 border-[1px] border-[#D7D7D7] w-1/2 rounded-[14px] relative overflow-hidden">
                                        {/* Hidden input (real file picker) */}
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                        />

                                        {/* Fake button UI (styled same as your original) */}
                                        <button
                                            type="button"
                                            className="bg-black text-white px-4 py-3 rounded-lg pointer-events-none"
                                        >
                                            Choose file
                                        </button>

                                        {/* Show selected file count or placeholder text */}
                                        <span className="text-gray-500 truncate">
                                            {images.length > 0
                                                ? `${images.length} file${images.length > 1 ? "s" : ""} selected`
                                                : "No file chosen"}
                                        </span>
                                    </div>

                                    {/* Image previews */}
                                    {images.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-3">
                                            {images.map((img, i) => (
                                                <img
                                                    key={i}
                                                    src={URL.createObjectURL(img)}
                                                    alt="preview"
                                                    className="w-20 h-20 object-cover rounded-md border"
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>

                            </div>
                        </div>

                        <div>
                            <label className="text-black text-lg">TEAM UP</label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    name="teamUp"
                                    checked={formData.teamUp}
                                    onChange={handleChange}
                                />

                                <span className="text-[14px] text-[#1C1C1E]">
                                    I/we are also interested in Team Up ?
                                </span>
                            </div>
                            <span className="text-sm text[#696974]">Tick this if you might like to Buddy Up with other room seekers to find a whole apartment<br />
                                or house together and start a brand new roomshare.</span>
                        </div>

                        <div className="flex justify-end mb-6">
                            <button className="bg-[#565ABF] text-white font-medium px-4 py-3 rounded-[6px] flex items-center gap-2" onClick={() => setIsPreview(true)}>
                                Preview & Publish <FaArrowRightLong />
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
