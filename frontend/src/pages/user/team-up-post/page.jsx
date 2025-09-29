import { useEffect, useMemo, useState } from "react";
import { FaArrowRightLong, FaArrowLeftLong } from "react-icons/fa6";
import { Country, State, City } from "country-state-city";
import locales from "locale-codes";

export default function TeamUpAd() {
    const [isPreview, setIsPreview] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        country: "",
        state: "",
        city: "",
        zip: "",
        budget: "",
        budgetType: "",
        moveInDate: "",
        period: "",
        amenities: [],
        firstName: "",
        lastName: "",
        age: "",
        gender: "",
        minAge: "",
        maxAge: "",
        occupationPreference: "",
        occupation: "",
        smoke: "",
        pets: "",
        petsPreference: "",
        language: "",
        languagePreference: "",
        roommatePref: "",
        description: "",
        buddyDescription: "",
    });
    const countries = Country.getAllCountries();
    const [allLocales, setAllLocales] = useState([]);

    const states = useMemo(() => {
        if (!formData.country) return [];
        return State.getStatesOfCountry(formData.country);
    }, [formData.country]);

    const cities = useMemo(() => {
        if (!formData.state || !formData.country) return [];
        return City.getCitiesOfState(formData.country, formData.state);
    }, [formData.country, formData.state]);

    useEffect(() => {
        setAllLocales(locales.all);
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === "checkbox" && name === "amenities") {
            setFormData((prev) => ({
                ...prev,
                amenities: checked
                    ? [...prev.amenities, value]
                    : prev.amenities.filter((a) => a !== value),
            }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };


    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <div className="bg-gradient-to-r from-[#565ABF] to-[#A321A6] py-5">
                <h1 className="text-center text-white text-2xl font-semibold">
                    Looking for Flatmate
                </h1>
            </div>

            <div className="w-full container px-8 space-y-8 mt-6">
                {isPreview ? (
                    <>
                        <div className="bg-white rounded-lg shadow-xl border border-gray-200">
                            <div className="bg-[#565ABF] text-white px-4 py-3 rounded-t-lg font-semibold">
                                Preview Ad
                            </div>
                            <div className="p-4 space-y-6 text-gray-800">

                                <div>
                                    <h3 className="text-lg font-semibold mb-2 text-[#565ABF]">Basic Details</h3>
                                    <p><strong>Title:</strong> {formData.title}</p>
                                    <p><strong>Location:</strong> {formData.city}, {formData.state}, {formData.country}</p>
                                    <p><strong>Zip Code:</strong> {formData.zip}</p>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold mb-2 text-[#565ABF]">Budget & Requirements</h3>
                                    <p><strong>Budget:</strong> {formData.budget} ({formData.budgetType})</p>
                                    <p><strong>Move-in Date:</strong> {formData.moveInDate}</p>
                                    <p><strong>Duration of Stay:</strong> {formData.period}</p>
                                    <p><strong>Amenities:</strong> {formData.amenities.join(", ") || "None"}</p>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold mb-2 text-[#565ABF]">Lifestyle Preferences</h3>
                                    <p><strong>Gender:</strong> {formData.gender}</p>
                                    <p><strong>Age Range:</strong> {formData.ageRange}</p>
                                    <p><strong>Occupation Type:</strong> {formData.occupationPreference}</p>
                                    <p><strong>Smoking:</strong> {formData.smoke}</p>
                                    <p><strong>Pets Allowed:</strong> {formData.petsPreference}</p>
                                    <p><strong>Roommate Preference:</strong> {formData.roommatePref}</p>
                                    <p><strong>Preferred Language:</strong> {formData.languagePreference}</p>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold mb-2 text-[#565ABF]">About You</h3>
                                    <p><strong>Full Name:</strong> {formData.firstName} {formData.lastName}</p>
                                    <p><strong>Age:</strong> {formData.age}</p>
                                    <p><strong>Occupation:</strong> {formData.occupation}</p>
                                    <p><strong>Do you have pets?:</strong> {formData.pets}</p>
                                    <p><strong>Language:</strong> {formData.language}</p>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold mb-2 text-[#565ABF]">Ad Details (Optional)</h3>
                                    <p><strong>Description:</strong> {formData.description || "N/A"}</p>
                                    <p><strong>Buddy Up Description:</strong> {formData.buddyDescription || "N/A"}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between mt-5 mb-5">
                            <button
                                onClick={() => setIsPreview(false)}
                                className="bg-gray-300 text-black font-medium px-4 py-3 rounded-[6px] flex items-center gap-2"
                            >
                                <FaArrowLeftLong /> Back to Edit
                            </button>
                            <button className="bg-[#565ABF] text-white font-medium px-5 py-3 rounded-[6px] flex items-center gap-2">
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
                                    <label className="block text-gray-700">Post Title</label>
                                    <input
                                        type="text"
                                        placeholder="e.g., “Looking for flatmate to share 2BHK in Pune city centre”"
                                        className="w-full border-[1px] border-[#D7D7D7] rounded-[14px] truncate form-control"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                    />
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
                                        onChange={handleChange}
                                        disabled={!formData.country}
                                        className="w-full border-[1px] border-[#D7D7D7] rounded-[14px] form-control"
                                    >
                                        <option value="">Select State</option>
                                        {states.map((s) => (
                                            <option key={s.isoCode} value={s.isoCode}>
                                                {s.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-700">City</label>
                                    <select
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        disabled={!formData.country}
                                        className="w-full border-[1px] border-[#D7D7D7] rounded-[14px] form-control"
                                    >
                                        <option value="">Select City</option>
                                        {cities.map((city) => (
                                            <option key={city.name} value={city.name}>
                                                {city.name}
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
                                            placeholder="Total budget range for the flat"
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
                                Lifestyle Preferences
                            </div>
                            <div className="px-4 py-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-700 mb-1">Gender</label>
                                    <select
                                        className="w-full border-[1px] border-[#D7D7D7] rounded-[14px] form-control"
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-1">Age Range</label>
                                    <div className="flex space-x-2">
                                        <input
                                            type="number"
                                            min="0"
                                            placeholder="Min"
                                            name="minAge"
                                            value={formData.minAge}
                                            onChange={handleChange}
                                            onKeyDown={(e) => {
                                                if (e.key === '-' || e.key === 'Minus') {
                                                    e.preventDefault();
                                                }
                                            }}
                                            className="border-[1px] border-[#D1D5DB] p-2 w-full rounded-[10px] text-[#948E8E]"
                                        />
                                        <input
                                            type="number"
                                            min="0"
                                            placeholder="Max"
                                            name="maxAge"
                                            value={formData.maxAge}
                                            onChange={handleChange}
                                            onKeyDown={(e) => {
                                                if (e.key === '-' || e.key === 'Minus') {
                                                    e.preventDefault();
                                                }
                                            }}
                                            className="border-[1px] border-[#D1D5DB] p-2 w-full rounded-[10px] text-[#948E8E]"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-1">Occupation Type</label>
                                    <select
                                        name="occupationPreference"
                                        value={formData.occupationPreference}
                                        onChange={handleChange}
                                        className="w-full border-[1px] border-[#D7D7D7] rounded-[14px] form-control"
                                    >
                                        <option value="">Select</option>
                                        <option value="Student">Student</option>
                                        <option value="Professionals">Professionals</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-1">Smoking?</label>
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
                                    <label className="block text-gray-700 mb-1">Pets?</label>
                                    <select
                                        className="w-full border-[1px] border-[#D7D7D7] rounded-[14px] form-control"
                                        name="petsPreference"
                                        value={formData.petsPreference}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select</option>
                                        <option value="Yes">Yes</option>
                                        <option value="No">No</option>
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
                                <div>
                                    <label className="block text-gray-700 mb-1">
                                        Your Preferred Language
                                    </label>
                                    <select
                                        name="languagePreference"
                                        value={formData.languagePreference}
                                        onChange={handleChange}
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
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-xl border border-gray-200">
                            <div className="bg-[#565ABF] text-white px-4 py-3 rounded-t-lg font-semibold">
                                About You
                            </div>
                            <div className="px-4 py-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-700 mb-1">First Name</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        placeholder="Enter your first name"
                                        className="w-full border-[1px] border-[#D7D7D7] rounded-[14px] form-control"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-1">Last Name</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        placeholder="Enter your last name"
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
                                        min="0"
                                        onKeyDown={(e) => {
                                            if (e.key === '-' || e.key === 'Minus') {
                                                e.preventDefault();
                                            }
                                        }}
                                        className="w-full border-[1px] border-[#D7D7D7] rounded-[14px] form-control"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 mb-1">Occupation</label>
                                    <input
                                        type="text"
                                        name="occupation"
                                        value={formData.occupation}
                                        onChange={handleChange}
                                        className="w-full border-[1px] border-[#D7D7D7] rounded-[14px] form-control"
                                    />
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

                        <div className="bg-white rounded-lg shadow-xl border border-gray-200">
                            <div className="bg-[#565ABF] text-white px-4 py-3 rounded-t-lg font-semibold">
                                Ad details
                            </div>
                            <div className="px-4 py-3 grid grid-cols-1 md:grid-cols-1 gap-4">
                                <div>
                                    <label className="block text-gray-700 mb-1">Description</label>
                                    <textarea
                                        className="w-full border-[1px] border-[#D7D7D7] rounded-[14px] form-control"
                                        name="description"
                                        placeholder="Please write what exactly you are looking for..."
                                        rows={5}
                                        value={formData.description}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-1">Buddy Up (additional description)</label>
                                    <textarea
                                        className="w-full border-[1px] border-[#D7D7D7] rounded-[14px] form-control"
                                        name="buddyDescription"
                                        placeholder="Enter your description..."
                                        rows={5}
                                        value={formData.description}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
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
