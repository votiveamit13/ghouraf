import { useEffect, useMemo, useState } from "react";
import { FaArrowRightLong, FaArrowLeftLong } from "react-icons/fa6";
import { Country, State, City } from "country-state-city";
import locales from "locale-codes";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "context/AuthContext";

export default function TeamUpAd() {
    const { user } = useAuth();
    const apiUrl = process.env.REACT_APP_API_URL;
    const navigate = useNavigate();
    const [isPreview, setIsPreview] = useState(false);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const initialFormData = {
        title: "",
        country: "",
        state: "",
        city: "",
        // zip: "",
        budget: "",
        budgetType: "",
        // moveInDate: "",
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
        // languagePreference: "",
        // roommatePref: "",
        description: "",
        buddyDescription: "",
    };
    const [formData, setFormData] = useState(initialFormData);
    const countries = Country.getAllCountries();
    const [allLocales, setAllLocales] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);

    useEffect(() => {
        if (user?.profile) {
            setFormData((prev) => ({
                ...prev,
                firstName: user.profile.firstName || "",
                lastName: user.profile.lastName || "",
                age: user.profile.age || "",
                gender: user.profile.gender || "",
            }));
        }
    }, [user]);


    const validateForm = () => {
        let newErrors = {};

        if (!formData.title.trim()) newErrors.title = "Title is required";
        if (!formData.country) newErrors.country = "Country is required";
        if (!formData.state) newErrors.state = "State is required";
        const stateCities = formData.country && formData.state ?
            City.getCitiesOfState(formData.country, formData.state) : [];

        if (stateCities.length > 0 && !formData.city) {
            newErrors.city = "City is required";
        } else if (stateCities.length === 0 && !formData.city) {
            // Auto-set to "NA" when no cities are available
            setFormData(prev => ({ ...prev, city: "NA" }));
        }
        // if (!formData.zip.trim()) newErrors.zip = "Zip code is required";
        if (!formData.budget) {
            newErrors.budget = "Budget is required";
        } else if (Number(formData.budget) <= 0) {
            newErrors.budget = "Budget must be greater than 0";
        } else if (Number(formData.budget) > 100000) {
            newErrors.budget = "Budget cannot exceed 1,00,000";
        }
        if (!formData.budgetType) newErrors.budgetType = "Select budget type";
        if (!formData.gender) newErrors.gender = "Gender is required";
        if (!formData.age) newErrors.age = "Age is required";
        if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
        if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
        if (!formData.amenities || formData.amenities.length === 0) {
            newErrors.amenities = "Select at least one amenity";
        }
        if (!formData.smoke) newErrors.smoke = "Select smoking category";
        if (!formData.pets) newErrors.pets = "Select pet category";
        if (!formData.petsPreference) newErrors.petsPreference = "Select pet preference category";
        // if (!formData.roommatePref) newErrors.roommatePref = "Select roommate preference";
        if (!formData.description) newErrors.description = "Description is required";
        if (!selectedFiles || selectedFiles.length === 0) {
            newErrors.photos = "Please upload at least one photo";
        }
        return newErrors;
    };

    const states = useMemo(() => {
        if (!formData.country) return [];
        return State.getStatesOfCountry(formData.country);
    }, [formData.country]);

    const cities = useMemo(() => {
        if (!formData.state || !formData.country) return [];
        return City.getCitiesOfState(formData.country, formData.state);
    }, [formData.country, formData.state]);

    useEffect(() => {
        if (formData.state) {
            const stateCities = City.getCitiesOfState(formData.country, formData.state);
            if (stateCities.length === 0 && formData.city !== "NA") {
                setFormData(prev => ({
                    ...prev,
                    city: "NA"
                }));
            } else if (stateCities.length > 0 && formData.city === "NA") {
                setFormData(prev => ({
                    ...prev,
                    city: ""
                }));
            }
        }
    }, [formData.country, formData.state, formData.city]);

    useEffect(() => {
        setAllLocales(locales.all);
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData((prev) => {
            let newValue;

            if (type === "checkbox" && name === "amenities") {
                newValue = checked
                    ? [...prev.amenities, value]
                    : prev.amenities.filter((a) => a !== value);
            } else if (
                (name === "minAge" || name === "maxAge" || name === "age" || name === "budget") &&
                type === "text"
            ) {
                newValue = value.replace(/[^0-9]/g, "");
            } else {
                newValue = value;
            }

            return { ...prev, [name]: newValue };
        });

        setErrors((prev) => ({ ...prev, [name]: undefined }));
    };



    const handleFileChange = (e) => {
        setSelectedFiles([...e.target.files]);
    };

    const handlePreview = () => {
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        setErrors({});
        setIsPreview(true);
    };


    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            setErrors({});

            const formPayload = new FormData();

            Object.keys(formData).forEach(key => {
                if (Array.isArray(formData[key])) {
                    formData[key].forEach(value => formPayload.append(key, value));
                } else {
                    formPayload.append(key, formData[key]);
                }
            });

            selectedFiles.forEach(file => {
                formPayload.append("photos", file);
            });

            // Log FormData values
            console.log("Submitting FormData:");
            for (let pair of formPayload.entries()) {
                console.log(pair[0], pair[1]);
            }

            const res = await fetch(`${apiUrl}createteamup`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: formPayload,
            });

            let data;
            try {
                data = await res.json();
            } catch (err) {
                throw new Error("Server returned non-JSON response");
            }

            if (!res.ok) {
                console.log("Server Response Errors:", data);
                if (data.errors) {
                    setErrors(data.errors);
                    console.log("Validation errors:", data.errors);
                } else {
                    toast.error(data.message || "Something went wrong");
                }
            } else {
                navigate("/user/thank-you", {
                    state: {
                        title: "Your ad was successfully submitted",
                        subtitle:
                            "This post will undergo a review process and will be published once approved.",
                        goBackPath: "/user/team-up-post",
                        viewAdsPath: "/team-up",
                    },
                });
                setFormData({ ...initialFormData });
                setSelectedFiles([]);
            }
        } catch (err) {
            console.error("Submit error:", err);
            toast.error(err.message || "Server error");
        } finally {
            setIsSubmitting(false);
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
                                    {/* <p><strong>Zip Code:</strong> {formData.zip}</p> */}
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold mb-2 text-[#565ABF]">Budget & Requirements</h3>
                                    <p><strong>Budget:</strong> {formData.budget} ({formData.budgetType})</p>
                                    {/* <p><strong>Move-in Date:</strong> {formData.moveInDate}</p> */}
                                    <p><strong>Duration of Stay:</strong> {formData.period}</p>
                                    <p><strong>Amenities:</strong> {formData.amenities.join(", ") || "None"}</p>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold mb-2 text-[#565ABF]">Lifestyle Preferences</h3>
                                    <p><strong>Gender:</strong> {formData.gender}</p>
                                    <p><strong>Age Range:</strong> {formData.minAge} - {formData.maxAge}</p>
                                    <p><strong>Occupation Type:</strong> {formData.occupationPreference}</p>
                                    <p><strong>Smoking:</strong> {formData.smoke === "true" ? "Yes" : "No"}</p>
                                    <p><strong>Pets Allowed:</strong> {formData.petsPreference === "true" ? "Yes" : "No"}</p>
                                    {/* <p><strong>Roommate Preference:</strong> {formData.roommatePref}</p> */}
                                    {/* <p><strong>Preferred Language:</strong> {formData.languagePreference}</p> */}
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold mb-2 text-[#565ABF]">About You</h3>
                                    <p><strong>Full Name:</strong> {formData.firstName} {formData.lastName}</p>
                                    <p><strong>Age:</strong> {formData.age}</p>
                                    <p><strong>Occupation:</strong> {formData.occupation}</p>
                                    <p><strong>Do you have pets?:</strong> {formData.pets === "true" ? "Yes" : "No"}</p>
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
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="bg-[#565ABF] text-white font-medium px-5 py-3 rounded-[6px] flex items-center gap-2">
                                {isSubmitting ? "Publishing..." : "Publish"} <FaArrowRightLong />
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
                                        placeholder="e.g., “Looking for flatmate to share 2BHK”"
                                        className="w-full border-[1px] border-[#D7D7D7] rounded-[14px] truncate form-control"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                    />
                                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
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
                                    {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
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
                                    {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
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
                                        {(() => {
                                            const stateCities = formData.country && formData.state ?
                                                City.getCitiesOfState(formData.country, formData.state) : [];

                                            if (stateCities.length === 0) {
                                                return <option value="NA">No City Available</option>;
                                            }

                                            return stateCities.map((city) => (
                                                <option key={city.name} value={city.name}>
                                                    {city.name}
                                                </option>
                                            ));
                                        })()}
                                    </select>
                                    {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                                </div>
                                {/* <div>
                                    <label className="block text-gray-700">Zip Code</label>
                                    <input
                                        type="text"
                                        name="zip"
                                        value={formData.zip}
                                        onChange={handleChange}
                                        className="w-full border-[1px] border-[#D7D7D7] rounded-[14px] form-control"
                                    />
                                    {errors.zip && <p className="text-red-500 text-sm mt-1">{errors.zip}</p>}
                                </div> */}
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
                                    {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
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
                                    {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-1">Gender</label>
                                    <input
                                        type="text"
                                        className="w-full border-[1px] border-[#D7D7D7] rounded-[14px] form-control"
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                    />
                                    {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-1">Age</label>
                                    <input
                                        type="text"
                                        name="age"
                                        value={formData.age}
                                        onChange={handleChange}
                                        placeholder="Age"
                                        className="w-full border-[1px] border-[#D7D7D7] rounded-[14px] form-control"
                                    />
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
                                        <option value="Professional">Professional</option>
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
                                        <option value={true}>Yes</option>
                                        <option value={false}>No</option>
                                    </select>
                                    {errors.pets && <p className="text-red-500 text-sm mt-1">{errors.pets}</p>}
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-1">
                                        Your Language
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

                                    <div className="flex items-center gap-4 border-[1px] border-[#D7D7D7] w-1/2 rounded-[14px] relative overflow-hidden">
                                        <input
                                            type="file"
                                            name="photos"
                                            accept="image/*"
                                            multiple
                                            onChange={handleFileChange}
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                        />

                                        <button
                                            type="button"
                                            className="bg-black text-white px-4 py-3 rounded-lg pointer-events-none"
                                        >
                                            Choose file
                                        </button>

                                        <span className="text-gray-500 truncate">
                                            {selectedFiles.length > 0
                                                ? `${selectedFiles.length} file(s) selected`
                                                : "No file chosen"}
                                        </span>

                                    </div>
                                    {errors.photos && <p className="text-red-500 text-sm mt-1">{errors.photos}</p>}
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
                                        {errors.budget && <p className="text-red-500 text-sm mt-1">{errors.budget}</p>}
                                    </div>
                                    <div className="flex items-end gap-6">
                                        <label className="flex items-center gap-2 text-sm">
                                            <input
                                                type="radio"
                                                name="budgetType"
                                                value="Month"
                                                checked={formData.budgetType === "Month"}
                                                onChange={handleChange}
                                            />
                                            Per Month
                                        </label>
                                        <label className="flex items-center gap-2 text-sm">
                                            <input
                                                type="radio"
                                                name="budgetType"
                                                value="Week"
                                                checked={formData.budgetType === "Week"}
                                                onChange={handleChange}
                                            />
                                            Per Week
                                        </label>
                                        {errors.budgetType && <p className="text-red-500 text-sm mt-1">{errors.budgetType}</p>}
                                    </div>
                                </div>

                                <div className="px-4 py-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* <div>
                                        <label className="block text-gray-700">Move-in Date</label>
                                        <input
                                            type="date"
                                            name="moveInDate"
                                            value={formData.moveInDate}
                                            onChange={handleChange}
                                            className="w-full border-[1px] border-[#D7D7D7] rounded-[14px] form-control"
                                        />
                                    </div> */}
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
                                            <option value="Short Term">Short Term</option>
                                            <option value="Long Term">Long Term</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="px-4 py-2 mb-4">
                                    <label className="block text-gray-700 mb-2">Interests</label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                        {[
                                            "Sports",
                                            "Music",
                                            "Movies & TV",
                                            "Reading",
                                            "Photography",
                                            "Going out",
                                            "Hiking & Nature",
                                            "Outdoor Activities & Adventures",
                                            "Fitness & Gym / Working out",
                                            "Walking Around Town/ Exploring the City",
                                            "Jogging / Running",
                                            "Science & Technology",
                                            "Art",
                                            "Traveling",
                                            "Cooking & Food",
                                            "Volunteering / Community Work",
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
                                    {errors.amenities && <p className="text-red-500 text-sm mt-1">{errors.amenities}</p>}
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-xl border border-gray-200">
                            <div className="bg-[#565ABF] text-white px-4 py-3 rounded-t-lg font-semibold">
                                Flatmate Preferences
                            </div>
                            <div className="px-4 py-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-700 mb-1">Age Range</label>
                                    <div className="flex space-x-2">
                                        <input
                                            type="text"
                                            placeholder="Min"
                                            name="minAge"
                                            value={formData.minAge}
                                            onChange={handleChange}
                                            onKeyDown={(e) => {
                                                if (
                                                    e.key === "e" || e.key === "E" || e.key === "+" || e.key === "-" || e.key === "."
                                                ) {
                                                    e.preventDefault();
                                                }
                                            }}
                                            min="10"
                                            max="99"
                                            maxLength={2}
                                            className="border-[1px] border-[#D1D5DB] p-2 w-full rounded-[10px] text-[#948E8E]"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Max"
                                            name="maxAge"
                                            value={formData.maxAge}
                                            onChange={handleChange}
                                            onKeyDown={(e) => {
                                                if (
                                                    e.key === "e" || e.key === "E" || e.key === "+" || e.key === "-" || e.key === "."
                                                ) {
                                                    e.preventDefault();
                                                }
                                            }}
                                            min="10"
                                            max="99"
                                            maxLength={2}
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
                                        <option value="Professional">Professional</option>
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
                                        <option value={true}>Yes</option>
                                        <option value={false}>No</option>
                                    </select>
                                    {errors.smoke && <p className="text-red-500 text-sm mt-1">{errors.smoke}</p>}
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
                                        <option value={true}>Yes</option>
                                        <option value={false}>No</option>
                                    </select>
                                    {errors.petsPreference && <p className="text-red-500 text-sm mt-1">{errors.petsPreference}</p>}
                                </div>
                                {/* <div>
                                    <label className="block text-gray-700 mb-1">Roommate Preference</label>
                                    <select
                                        className="w-full border-[1px] border-[#D7D7D7] rounded-[14px] form-control"
                                        name="roommatePref"
                                        value={formData.roommatePref}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select</option>
                                        <option value="any gender">Any Gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                    </select>
                                    {errors.roommatePref && <p className="text-red-500 text-sm mt-1">{errors.roommatePref}</p>}
                                </div> */}
                                {/* <div>
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
                                </div> */}
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
                                        placeholder="Please write about yourself..."
                                        rows={5}
                                        value={formData.description}
                                        onChange={handleChange}
                                    />
                                    {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-1">Buddy Up (additional description)</label>
                                    <textarea
                                        className="w-full border-[1px] border-[#D7D7D7] rounded-[14px] form-control"
                                        name="buddyDescription"
                                        placeholder="Enter your description..."
                                        rows={5}
                                        value={formData.buddyDescription}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end mb-6">
                            <button
                                className="bg-[#565ABF] text-white font-medium px-4 py-3 rounded-[6px] flex items-center gap-2"
                                onClick={handlePreview}
                            >
                                Preview & Publish <FaArrowRightLong />
                            </button>

                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
