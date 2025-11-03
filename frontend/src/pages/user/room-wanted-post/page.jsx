import { useEffect, useMemo, useState } from "react";
import { FaArrowRightLong, FaArrowLeftLong } from "react-icons/fa6";
import { Country, State, City } from "country-state-city";
import locales from "locale-codes";
import { toast } from "react-toastify";
import { FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "context/AuthContext";

export default function RoomWantedAd() {
    const { user } = useAuth();
    const apiUrl = process.env.REACT_APP_API_URL;
    const navigate = useNavigate();
    const [allLocales, setAllLocales] = useState([]);
    const [isPreview, setIsPreview] = useState(false);
    const [formData, setFormData] = useState({
        propertyType: "",
        roomSize: "",
        country: "",
        state: "",
        city: "",
        // zip: "",
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
        // language: "",
        // roommatePref: "",
        title: "",
        description: "",
        teamUp: false,
    });
    const [images, setImages] = useState([]);
    const [errors, setErrors] = useState({});
    const countries = Country.getAllCountries();
    const cities = useMemo(() => {
        if (!formData.country) return [];
        const states = State.getStatesOfCountry(formData.country);
        return states.flatMap((s) =>
            City.getCitiesOfState(formData.country, s.isoCode)
        );
    }, [formData.country]);

    useEffect(() => {
  if (user?.profile) {
    setFormData((prev) => ({
      ...prev,
      name: `${user.profile.firstName || ""} ${user.profile.lastName || ""}`.trim(),
      age: user.profile.age || "",
      gender: user.profile.gender || "",
    }));
  }
}, [user]);

    useEffect(() => {
        setAllLocales(locales.all);
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData((prev) => {
            let newValue;

            if ((name === "age" || name === "budget" || name === "roomSize") && type === "text") {
                newValue = value.replace(/[^0-9]/g, "");
            } else if (type === "checkbox" && name === "amenities") {
                newValue = checked
                    ? [...prev.amenities, value]
                    : prev.amenities.filter((a) => a !== value);
            } else if (type === "checkbox") {
                newValue = checked;
            } else {
                newValue = value;
            }

            return { ...prev, [name]: newValue };
        });

        setErrors((prev) => ({ ...prev, [name]: undefined }));
    };



    const handleImageChange = (e) => {
        const newFiles = Array.from(e.target.files);
        setImages((prev) => [...prev, ...newFiles]);
    };

    const handleRemoveImage = (index) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title?.trim()) {
            newErrors.title = "Title is required";
        } else if (formData.title.length < 3) {
            newErrors.title = "Title should be at least 3 characters";
        } else if (formData.title.length > 100) {
            newErrors.title = "Title cannot exceed 100 characters";
        }

        if (!formData.description?.trim()) {
            newErrors.description = "Description is required";
        } else if (formData.description.length < 5) {
            newErrors.description = "Description must be at least 5 characters";
        }

        if (!formData.propertyType) newErrors.propertyType = "Space Wanted Type is required";
        if (!formData.roomSize) newErrors.roomSize = "Space Size is required";

        if (!formData.country) newErrors.country = "Country is required";
        if (!formData.state) newErrors.state = "State is required";
        const stateCities = formData.country && formData.state ?
            City.getCitiesOfState(formData.country, formData.state) : [];
        if (stateCities.length > 0 && !formData.city) {
            newErrors.city = "City is required";
        } else if (stateCities.length === 0 && !formData.city) {
            setFormData(prev => ({ ...prev, city: "NA" }));
        }
        // if (!formData.zip) newErrors.zip = "ZIP code is required";

        if (!formData.budget) {
            newErrors.budget = "Budget is required";
        } else if (Number(formData.budget) <= 0) {
            newErrors.budget = "Budget must be greater than 0";
        } else if (Number(formData.budget) > 100000) {
            newErrors.budget = "Budget cannot exceed 1,00,000";
        }

        if (!formData.budgetType) newErrors.budgetType = "Budget Type is required";
        if (!formData.period) newErrors.period = "Duration of stay is required";

        // if (!formData.amenities?.length) newErrors.amenities = "At least one amenity is required";

        if (!formData.name?.trim()) newErrors.name = "Name is required";
        if (!formData.age) {
            newErrors.age = "Age is required";
        } else if (formData.age < 18) {
            newErrors.age = "Age must be at least 18";
        } else if (formData.age > 100) {
            newErrors.age = "Age cannot exceed 100";
        }
        if (!["male", "female"].includes(formData.gender)) {
            newErrors.gender = "Gender must be either 'male' or 'female'";
        }
        if (!["Student", "Professional"].includes(formData.occupation)) {
            newErrors.occupation = "Occupation must be 'Student' or 'Professional'";
        }

        if (!["Yes", "No", "Sometimes"].includes(formData.smoke)) {
            newErrors.smoke = "Smoke must be 'Yes', 'No' 'Sometimes'";
        }
        if (!["Yes", "No"].includes(formData.pets)) {
            newErrors.pets = "Pets must be 'Yes' or 'No'";
        }

        // const allowedRoommatePrefs = ["any gender", "male", "female"];
        // if (!allowedRoommatePrefs.includes(formData.roommatePref)) {
        //     newErrors.roommatePref = `Roommate Preference must be one of: ${allowedRoommatePrefs.join(", ")}`;
        // }

        if (images.length) {
            images.forEach((img, i) => {
                if (!img.name) {
                    newErrors[`photos_${i}`] = "Photo file is required";
                }
            });
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handlePreview = () => {
        if (validateForm()) {
            setIsPreview(true);
        }
    };

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

    const handleSubmit = async () => {
        if (!validateForm()) {
            toast.error("Please fix the errors in the form");
            return;
        }

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
            const token = localStorage.getItem("token");
            const res = await fetch(`${apiUrl}createspacewanted`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formDataToSend,
            });

            const data = await res.json();
            if (res.ok) {
                toast.success("Ad posted successfully!");
                navigate("/user/thank-you", {
                    state: {
                        title: "Your ad was successfully submitted",
                        subtitle:
                            "This post will undergo a review process and will be published once approved.",
                        goBackPath: "/user/place-wanted-ad",
                    },
                });
            } else {
                if (data.errors && Array.isArray(data.errors)) {
                    data.errors.forEach((err) => toast.error(err));
                } else {
                    toast.error(data.message || "Something went wrong!");
                }
            }
        } catch (err) {
            toast.error("Something went wrong. Check console.");
            console.error(err);
        }
    };

    const getInputClass = (field) =>
        `w-full border-[1px] rounded-[14px] form-control`;

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
                                <p><strong>Space Wanted Type:</strong> {formData.propertyType}</p>
                                <p><strong>Room Size:</strong> {formData.roomSize}</p>
                                <p className="md:col-span-2">
                                    <strong>Location:</strong> {formData.city === "NA" ? "No City Available" : formData.city}, {formData.state}, {formData.country}
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
                                {/* <p><strong>Roommate Preference:</strong> {formData.roommatePref}</p> */}
                                <p className="md:col-span-2">
                                    <strong>Description:</strong> {formData.description}
                                </p>
                                <p><strong>Team Up:</strong> {formData.teamUp ? "Yes" : "No"}</p>
                                {images.length > 0 && (
                                    <div className="md:col-span-2 flex flex-wrap gap-2 mt-3">
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
                        <div className="bg-white rounded-lg shadow-xl border border-gray-200">
                            <div className="bg-[#565ABF] text-white px-4 py-3 rounded-t-lg font-semibold">
                                Basic Details
                            </div>
                            <div className="px-4 py-3 grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-gray-700">Space Wanted Type</label>
                                    <select
                                        className={getInputClass("propertyType")}
                                        name="propertyType"
                                        value={formData.propertyType}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select</option>
                                        <option value="Room">Room</option>
                                        <option value="Apartment">Apartment</option>
                                    </select>
                                    {errors.propertyType && <p className="text-red-500 text-sm mt-1">{errors.propertyType}</p>}
                                </div>

                                <div>
                                    <label className="block text-gray-700">Space Size</label>
                                    <input
                                        type="text"
                                        className={getInputClass("roomSize")}
                                        name="roomSize"
                                        placeholder="Size unit is in m2"
                                        value={formData.roomSize}
                                        onChange={handleChange}
                                    />
                                    {errors.roomSize && <p className="text-red-500 text-sm mt-1">{errors.roomSize}</p>}
                                </div>

                                <div>
                                    <label className="block text-gray-700">Country</label>
                                    <select
                                        name="country"
                                        value={formData.country}
                                        onChange={handleChange}
                                        className={getInputClass("country")}
                                    >
                                        <option value="">Select Country</option>
                                        {countries.map((c) => (
                                            <option key={c.isoCode} value={c.isoCode}>{c.name}</option>
                                        ))}
                                    </select>
                                    {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
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
                                        className={getInputClass("state")}
                                    >
                                        <option value="">Select State</option>
                                        {State.getStatesOfCountry(formData.country).map((s) => (
                                            <option key={s.isoCode} value={s.isoCode}>{s.name}</option>
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
                                        disabled={!formData.state}
                                        className={getInputClass("city")}
                                    >
                                        <option value="">Select City</option>
                                        {(() => {
                                            const stateCities = formData.country && formData.state ?
                                                City.getCitiesOfState(formData.country, formData.state) : [];

                                            if (stateCities.length === 0) {
                                                return <option value="NA">No City Available</option>;
                                            }

                                            return stateCities.map((c) => (
                                                <option key={c.name} value={c.name}>{c.name}</option>
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
                                        className={getInputClass("zip")}
                                    />
                                    {errors.zip && <p className="text-red-500 text-sm mt-1">{errors.zip}</p>}
                                </div> */}
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-xl border border-gray-200">
                            <div className="bg-[#565ABF] text-white px-4 py-3 rounded-t-lg font-semibold">
                                Budget & Requirements
                            </div>
                            <div className="px-4 py-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-700">Budget</label>
                                    <input
                                        type="text"
                                        name="budget"
                                        value={formData.budget}
                                        onChange={handleChange}
                                        className={getInputClass("budget")}
                                        placeholder="Enter budget"
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
                                <div>
                                    <label className="block text-gray-700">Move-in Date</label>
                                    <select
                                        name="moveInDate"
                                        value={formData.moveInDate}
                                        onChange={handleChange}
                                        className={getInputClass("moveInDate")}
                                    >
                                        <option value="">Select</option>
                                        <option value="As soon as possible">As soon as possible</option>
                                        <option value="In a week time">In a week time</option>
                                        <option value="In a month time">In a month time</option>
                                    </select>
                                    {errors.moveInDate && <p className="text-red-500 text-sm mt-1">{errors.moveInDate}</p>}
                                </div>
                                <div>
                                    <label className="block text-gray-700">Duration of stay</label>
                                    <select
                                        name="period"
                                        value={formData.period}
                                        onChange={handleChange}
                                        className={getInputClass("period")}
                                    >
                                        <option value="">Select</option>
                                        <option value="Short term">Short term (6 months or less)</option>
                                        <option value="Long term">Long term (7 months or more)</option>
                                    </select>
                                    {errors.period && <p className="text-red-500 text-sm mt-1">{errors.period}</p>}
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
                                        className={getInputClass("name")}
                                    />
                                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                                </div>

                                <div>
                                    <label className="block text-gray-700 mb-1">Age</label>
                                    <input
                                        type="text"
                                        name="age"
                                        value={formData.age}
                                        onChange={handleChange}
                                        className={getInputClass("age")}
                                        placeholder="Enter age"
                                    />
                                    {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
                                </div>

                                <div>
                                    <label className="block text-gray-700 mb-1">Gender</label>
                                    <input
                                        type="text"
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        className={getInputClass("gender")}
                                    />
                                    {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
                                </div>

                                <div>
                                    <label className="block text-gray-700 mb-1">Occupation</label>
                                    <select
                                        name="occupation"
                                        value={formData.occupation}
                                        onChange={handleChange}
                                        className={getInputClass("occupation")}
                                    >
                                        <option value="">Select</option>
                                        <option value="Student">Student</option>
                                        <option value="Professional">Professional</option>
                                    </select>
                                    {errors.occupation && <p className="text-red-500 text-sm mt-1">{errors.occupation}</p>}
                                </div>

                                <div>
                                    <label className="block text-gray-700 mb-1">Do You Smoke?</label>
                                    <select
                                        name="smoke"
                                        value={formData.smoke}
                                        onChange={handleChange}
                                        className={getInputClass("smoke")}
                                    >
                                        <option value="">Select</option>
                                        <option value="Yes">Yes</option>
                                        <option value="No">No</option>
                                        <option value="Sometimes">Sometimes</option>
                                    </select>
                                    {errors.smoke && <p className="text-red-500 text-sm mt-1">{errors.smoke}</p>}
                                </div>

                                <div>
                                    <label className="block text-gray-700 mb-1">Do You Have Any Pets?</label>
                                    <select
                                        name="pets"
                                        value={formData.pets}
                                        onChange={handleChange}
                                        className={getInputClass("pets")}
                                    >
                                        <option value="">Select</option>
                                        <option value="Yes">Yes</option>
                                        <option value="No">No</option>
                                    </select>
                                    {errors.pets && <p className="text-red-500 text-sm mt-1">{errors.pets}</p>}
                                </div>

                                {/* <div>
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
                                </div> */}

                                {/* <div>
                                    <label className="block text-gray-700 mb-1">Roommate Preference</label>
                                    <select
                                        name="roommatePref"
                                        value={formData.roommatePref}
                                        onChange={handleChange}
                                        className={getInputClass("roommatePref")}
                                    >
                                        <option value="">Select</option>
                                        <option value="any gender">Any Gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                    </select>
                                    {errors.roommatePref && <p className="text-red-500 text-sm mt-1">{errors.roommatePref}</p>}
                                </div> */}

                                <div className="md:col-span-2">
                                    <label className="block text-gray-700 mb-1">Title</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        className={getInputClass("title")}
                                    />
                                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-gray-700 mb-1">Description</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        placeholder="Please write what exactly you are looking for..."
                                        className={getInputClass("description")}
                                        rows={4}
                                    ></textarea>
                                    {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                                </div>

                                <div className="md:col-span-2 mb-4">
                                    <label className="block text-gray-700 mb-1">Upload Photos</label>
                                    <div className="flex items-center gap-4 border-[1px] border-[#D7D7D7] w-1/2 rounded-[14px] relative overflow-hidden">
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                        />
                                        <button type="button" className="bg-black text-white px-4 py-3 rounded-lg pointer-events-none">
                                            Choose file
                                        </button>
                                        <span className="text-gray-500 truncate">
                                            {images.length > 0
                                                ? `${images.length} file${images.length > 1 ? "s" : ""} selected`
                                                : "No file chosen"}
                                        </span>
                                    </div>
                                    {images.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-3">
                                            {images.map((img, i) => (
                                                <div key={i} className="relative">
                                                    <img
                                                        src={URL.createObjectURL(img)}
                                                        alt="preview"
                                                        className="w-20 h-20 object-cover rounded-md border"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveImage(i)}
                                                        className="absolute -top-2 -right-2 bg-black text-white rounded-full p-1 text-xs"
                                                    >
                                                        <FaTimes />
                                                    </button>
                                                </div>
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
                                    I/we are also interested in Team Up?
                                </span>
                            </div>
                            <span className="text-sm text-[#696974]">
                                Tick this if you might like to Buddy Up with other room seekers to find a whole apartment or house together.
                            </span>
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
