import { useState, useEffect } from "react";
import { MdOutlineLayers } from "react-icons/md";
import { FiLayers, FiPlusCircle } from "react-icons/fi";
import { PiRocket } from "react-icons/pi";
import { FiCheck } from "react-icons/fi";
import heroImage from "assets/img/ghouraf/hero-section.jpg";
import { FaArrowRightLong } from "react-icons/fa6";
import "react-phone-input-2/lib/style.css";
import { Country, State, City } from "country-state-city";
import { Numbers } from "../../../constants/numbers";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import PromoteAdModal from "components/user/PromoteAd";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import PromotionPaymentModal from "components/user/PromotionPaymentModal"; 


function StepHeader({ step }) {
  const steps = [
    { id: 1, title: "Steps 01", subtitle: "Ads Information", icon: MdOutlineLayers },
    { id: 2, title: "Steps 02", subtitle: "Description, Features & Images", icon: FiLayers },
    { id: 3, title: "Steps 03", subtitle: "Ad Preview", icon: PiRocket },
  ];

  return (
    <div className="relative rounded-t-2xl border border-slate-200 bg-white w-full">
      <div className="flex items-center py-4 gap-4 ml-4">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          const isDone = step > s.id;
          const isActive = step === s.id;

          return (
            <div key={s.id} className="flex-1 flex items-center gap-3">
              <div
                className={[
                  "flex items-center justify-center rounded-full w-14 h-14 shrink-0",
                  isActive
                    ? "bg-gradient-to-br from-[#A321A6] to-[#7B2BBE] text-white"
                    : isDone
                      ? "bg-[#22c55e] text-white"
                      : "bg-[#cfd6e0] text-white",
                ].join(" ")}
              >
                {isDone ? <FiCheck size={22} /> : <Icon size={22} />}
              </div>

              <div className="leading-tight">
                <div className="text-slate-900 font-semibold">{s.title}</div>
                <div
                  className={[
                    "text-sm",
                    isActive ? "text-slate-700" : "text-slate-400",
                  ].join(" ")}
                >
                  {s.subtitle}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="h-px bg-[#E8EEF7]" />
      <div
        className="absolute bottom-0 h-[3px] bg-[#A321A6] rounded-full transition-all duration-300 px-6"
        style={{
          left: `${(step - 1) * (100 / steps.length)}%`,
          width: `${100 / steps.length}%`,
        }}
      />
    </div>
  );
}

const validateStep2 = (formData, featured, errors) => {
  const stepErrors = {};

  if (!formData.description?.trim() || formData.description.length < 5) {
    stepErrors.description = ["Description must be at least 5 characters"];
  }
  if (!formData.amenities || formData.amenities.length === 0) {
    stepErrors.amenities = ["At least one amenity is required"];
  }
  if (!featured) {
    stepErrors.featuredImage = ["Featured image is required"];
  }

  return { ...errors, ...stepErrors };
};

export default function PostSpace() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [photos, setPhotos] = useState([]);
  const [featured, setFeatured] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const apiUrl = process.env.REACT_APP_API_URL;
  const [showPromoteModal, setShowPromoteModal] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);
  const [selectedPlanForPayment, setSelectedPlanForPayment] = useState("10"); 
  const [clientSecret, setClientSecret] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [promotionLoading, setPromotionLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    propertyType: "",
    budget: "",
    budgetType: "",
    personalInfo: "",
    size: "",
    furnishing: "",
    smoking: "",
    roomsAvailableFor: "",
    bedrooms: "",
    country: "",
    state: "",
    city: "",
    location: "",
    description: "",
    amenities: [],
    featuredImage: "",
    photos: [],
  });
  const formPayload = new FormData();
  formPayload.append("furnishing", formData.furnishing === "true");
  formPayload.append("smoking", formData.smoking === "true");

  const countries = Country.getAllCountries();
  const states = formData.country ? State.getStatesOfCountry(formData.country) : [];
  const cities = formData.state ? City.getCitiesOfState(formData.country, formData.state) : [];

  const validateStep1 = (formData, errors) => {
    const stepErrors = {};

    if (!formData.title) stepErrors.title = ["Title is required"];
    if (!formData.propertyType) stepErrors.propertyType = ["Property Type is required"];
    if (!formData.budgetType) stepErrors.budgetType = ["Budget Type is required"];
    if (!formData.budget) {
      stepErrors.budget = ["Budget is required"];
    } else if (Number(formData.budget) <= 0) {
      stepErrors.budget = ["Budget must be greater than 0"];
    } else if (Number(formData.budget) > 100000) {
      stepErrors.budget = ["Budget cannot exceed 1,00,000"];
    }

    if (!formData.personalInfo) stepErrors.personalInfo = ["Personal Info is required"];
    if (!formData.size || formData.size <= 0) stepErrors.size = ["Size must be greater than 0"];
    if (formData.furnishing === "") stepErrors.furnishing = ["Furnishing is required"];
    // if (formData.smoking === "") stepErrors.smoking = ["Smoking preference is required"];
    if (!formData.roomsAvailableFor) stepErrors.roomsAvailableFor = ["Property Available is required"];
    if (!formData.bedrooms) stepErrors.bedrooms = ["Number of bedrooms is required"];
    if (!formData.country) stepErrors.country = ["Country is required"];
    if (!formData.state) stepErrors.state = ["State is required"];
    if (cities.length > 0 && !formData.city) {
      stepErrors.city = ["City is required"];
    } else if (cities.length === 0 && !formData.city && formData.city !== "NA") {
      formData.city = "NA";
    }

    return { ...errors, ...stepErrors };
  };

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      setErrors({});
    }
  }, [formData, featured, photos]);

  const handleChange = (eOrName, value) => {
    let name, val;

    if (typeof eOrName === "string") {
      name = eOrName;
      val = value;
      if (name === "state") {
        const newStates = State.getStatesOfCountry(formData.country);
        const newCities = City.getCitiesOfState(formData.country, value);

        setFormData((prev) => ({
          ...prev,
          state: val,
          city: newCities.length === 0 ? "NA" : ""
        }));
        setErrors((prev) => ({ ...prev, city: undefined }));
        return;
      }
    } else if (eOrName?.target) {
      const { name: targetName, value: targetValue, type, checked } = eOrName.target;
      name = targetName;

      if ((name === "size" || name === "budget") && type === "text") {
        val = targetValue.replace(/[^0-9]/g, "");
      } else if (type === "checkbox" && name === "amenities") {
        setFormData((prev) => ({
          ...prev,
          amenities: checked
            ? [...prev.amenities, targetValue]
            : prev.amenities.filter((a) => a !== targetValue),
        }));
        setErrors((prev) => ({ ...prev, [name]: undefined }));
        return;
      } else if (type === "checkbox") {
        val = checked;
      } else {
        val = targetValue;
      }
    } else {
      console.warn("Invalid handleChange call:", eOrName);
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: val,
    }));

    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleFeaturedUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFeatured(file);
    }
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    setPhotos((prev) => [...prev, ...files]);
  };

  const removePhoto = (index) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const hasErrors = (errorObj) => {
    return Object.keys(errorObj).length > 0;
  };

  const next = () => {
    let stepErrors = {};

    switch (step) {
      case 1:
        stepErrors = validateStep1(formData, errors, cities);
        break;
      case 2:
        stepErrors = validateStep2(formData, featured, errors);
        break;
      default:
        break;
    }

    setErrors(stepErrors);

    if (!hasErrors(stepErrors)) {
      setStep((s) => Math.min(3, s + 1));
    } else {
      const firstErrorField = Object.keys(stepErrors)[0];
      const errorElement = document.querySelector(`[name="${firstErrorField}"]`);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        errorElement.focus();
      }
    }
  };

  const prev = () => {
    setStep((s) => Math.max(1, s - 1));
    setErrors({});
  };

  useEffect(() => {
    if (formData.state && cities.length === 0 && formData.city !== "NA") {
      setFormData(prev => ({
        ...prev,
        city: "NA"
      }));
    }
  }, [cities, formData.state, formData.city]);

  const handlePublish = async () => {
    setIsSubmitting(true);
    try {
      const formPayload = new FormData();
      // console.log("Submitting form with data:", formData);
      // console.log("Featured image:", featured ? featured.name : "None");
      // console.log("Photos count:", photos.length);
      // console.log(typeof formData.furnishing, formData.furnishing);
      // console.log(typeof formData.smoking, formData.smoking);

      const processedData = {
        ...formData,
        furnishing: formData.furnishing === "true",
        smoking: formData.smoking === "true",
        bedrooms: parseInt(formData.bedrooms, 10),
        budget: parseFloat(formData.budget),
        size: parseFloat(formData.size)
      };

      // console.log("Processed bedrooms:", processedData.bedrooms, typeof processedData.bedrooms);

      Object.keys(processedData).forEach((key) => {
        if (key === "amenities") {
          processedData.amenities.forEach((a) => formPayload.append("amenities[]", a));
        } else if (!["photos", "featuredImage"].includes(key)) {
          if (key === "bedrooms" || key === "budget" || key === "size") {
            formPayload.append(key, processedData[key].toString());
          } else {
            formPayload.append(key, processedData[key]);
          }
        }
      });

      if (featured) {
        formPayload.append("featuredImage", featured);
      }

      photos.forEach((photo) => {
        formPayload.append("photos", photo);
      });

      // console.log("Processed data:", processedData);
      for (let [key, value] of formPayload.entries()) {
        console.log(key, value, typeof value);
      }

      const res = await axios.post(`${apiUrl}createspaces`, formPayload, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      navigate("/user/thank-you", {
        state: {
          title: "Your ad was successfully submitted",
          subtitle: "This post will undergo a review process and will be published once approved.",
          goBackPath: "/user/post-an-space",
        }
      });
      setErrors({});
      setFormData({
        title: "",
        propertyType: "",
        budget: "",
        budgetType: "",
        personalInfo: "",
        size: "",
        furnishing: "",
        smoking: "",
        roomsAvailableFor: "",
        bedrooms: "",
        country: "",
        state: "",
        city: "",
        location: "",
        description: "",
        amenities: [],
      });
      setFeatured(null);
      setPhotos([]);
      setStep(1);

    } catch (err) {
      if (err.response?.status === 422) {
        const backendErrors = err.response.data.errors || {};
        setErrors(backendErrors);

        const firstErrorField = Object.keys(backendErrors)[0];
        const errorElement = document.querySelector(`[name="${firstErrorField}"]`);
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          errorElement.focus();
        }
        console.error("Validation errors:", backendErrors);
      } else {
        toast.error(err.response?.data?.message || "Server Error");
        console.error("Server error:", err.response?.data);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

const initiatePromotionPayment = async (planShort) => {
  const planKey = planShort === "30" ? "30_days" : "10_days";
  setPromotionLoading(true);

  try {
    const formPayload = new FormData();

    const processedData = {
      ...formData,
      furnishing: formData.furnishing === "true",
      smoking: formData.smoking === "true",
      bedrooms: parseInt(formData.bedrooms, 10),
      budget: parseFloat(formData.budget || 0),
      size: parseFloat(formData.size || 0),
    };

    Object.keys(processedData).forEach((key) => {
      if (key === "amenities") {
        processedData.amenities.forEach((a) => formPayload.append("amenities[]", a));
      } else if (!["photos", "featuredImage"].includes(key)) {
        if (key === "bedrooms" || key === "budget" || key === "size") {
          formPayload.append(key, processedData[key].toString());
        } else {
          formPayload.append(key, processedData[key]);
        }
      }
    });

    if (featured) formPayload.append("featuredImage", featured);
    photos.forEach((photo) => formPayload.append("photos", photo));

    formPayload.append("promote", "true");
    formPayload.append("plan", planKey);

    const res = await axios.post(`${apiUrl}createspaces`, formPayload, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const { clientSecret } = res.data;
    if (!clientSecret) throw new Error("No clientSecret returned from server");

    setSelectedPlanForPayment(planShort);
    setClientSecret(clientSecret);
    setShowPaymentModal(true);
  } catch (err) {
    console.error("Promotion init error:", err.response?.data || err.message);
    toast.error(err.response?.data?.message || "Failed to initiate promotion payment");
  } finally {
    setPromotionLoading(false);
  }
};


  const getPhotoUrl = (photo) => {
    return typeof photo === 'string' ? photo : URL.createObjectURL(photo);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div
        className="py-5 text-white text-center text-2xl font-semibold"
        style={{
          backgroundImage: `linear-gradient(90deg, #565ABF, #A321A6), url(${heroImage})`,
          backgroundBlendMode: "overlay",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        Post A Space
      </div>

      <div className="max-w-4xl w-full mx-auto mt-6 mb-16">
        {!previewMode && <StepHeader step={step} />}

        <div className="bg-white rounded-b-2xl shadow-sm border border-t-0 border-slate-200 p-4">
          {step === 1 && (
            <div className="row g-4">
              <div className="col-md-6 mb-2">
                <label className="form-label text-black">Title</label>
                <input
                  type="text"
                  className={`form-control`}
                  placeholder="Ad name"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                />
                {errors.title && <div className="text-red-500 text-sm mt-1">{errors.title[0]}</div>}
              </div>

              <div className="col-md-6 mb-2">
                <label className="form-label text-black">Property Type</label>
                <select
                  className={`form-control`}
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleChange}
                >
                  <option value="">Select Property Type</option>
                  <option value="Room">Room</option>
                  <option value="Apartment">Apartment</option>
                </select>
                {errors.propertyType && <div className="text-red-500 text-sm mt-1">{errors.propertyType[0]}</div>}
              </div>

              <div className="col-md-6 mb-2">
                <div className="flex gap-6 mb-2">
                  <div>
                    <label className="form-label text-black">Budget</label>
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
                  </div>

                </div>
                {errors.budgetType && <div className="text-red-500 text-sm mt-1">{errors.budgetType[0]}</div>}
                <input
                  type="text"
                  name="budget"
                  placeholder="Enter your budget"
                  className={`form-control`}
                  value={formData.budget}
                  onChange={handleChange}
                />
                {errors.budget && <small className="text-danger">{errors.budget[0]}</small>}

              </div>

              <div className="col-md-6 mb-2">
                <label className="form-label text-black">Personal Info</label>
                <select
                  className={`form-control`}
                  name="personalInfo"
                  value={formData.personalInfo}
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  <option value="Landlord">Landlord</option>
                  <option value="Agent">Agent</option>
                  <option value="Flatmate">Flatmate</option>
                </select>
                {errors.personalInfo && <div className="text-red-500 text-sm mt-1">{errors.personalInfo[0]}</div>}
              </div>

              <div className="col-md-6 mb-2">
                <label className="form-label text-black">Size of Apartment</label>
                <input
                  type="text"
                  className={`form-control`}
                  placeholder="m²"
                  name="size"
                  value={formData.size}
                  onChange={handleChange}
                />
                {errors.size && <div className="text-red-500 text-sm mt-1">{errors.size[0]}</div>}
              </div>

              <div className="col-md-6 mb-2">
                <label className="form-label text-black">Furnishing</label>
                <select
                  className={`form-control`}
                  name="furnishing"
                  value={formData.furnishing}
                  onChange={handleChange}
                >
                  <option value="">Select Furnishing</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
                {errors.furnishing && <div className="text-red-500 text-sm mt-1">{errors.furnishing[0]}</div>}
              </div>

              <div className="col-md-6 mb-2">
                <label className="form-label text-black">Smoking</label>
                <select
                  className={`form-control`}
                  name="smoking"
                  value={formData.smoking}
                  onChange={handleChange}
                >
                  <option value="">In different</option>
                  <option value="true">Allowed</option>
                  <option value="false">Not Allowed</option>
                </select>
                {errors.smoking && <div className="text-red-500 text-sm mt-1">{errors.smoking[0]}</div>}
              </div>

              <div className="col-md-6 mb-2">
                <label className="form-label text-black">Property Available</label>
                <select
                  className={`form-control`}
                  name="roomsAvailableFor"
                  value={formData.roomsAvailableFor}
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  <option value="any gender">Any Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
                {errors.roomsAvailableFor && <div className="text-red-500 text-sm mt-1">{errors.roomsAvailableFor[0]}</div>}
              </div>

              <div className="col-md-6 mb-2">
                <label className="form-label text-black">Number of bedrooms</label>
                <select
                  className={`form-control`}
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  {Numbers.map((num) => (
                    <option key={num.value} value={num.value}>
                      {num.label}
                    </option>
                  ))}
                </select>
                {errors.bedrooms && <div className="text-red-500 text-sm mt-1">{errors.bedrooms[0]}</div>}
              </div>

              <div className="col-md-6 mb-2">
                <label className="form-label text-black">Country</label>
                <select
                  className={`form-control`}
                  name="country"
                  value={formData.country}
                  onChange={(e) => {
                    handleChange("country", e.target.value);
                    handleChange("state", "");
                    handleChange("city", "");
                  }}
                >
                  <option value="">Select Country</option>
                  {countries.map((c) => (
                    <option key={c.isoCode} value={c.isoCode}>
                      {c.name}
                    </option>
                  ))}
                </select>
                {errors.country && <div className="text-red-500 text-sm mt-1">{errors.country[0]}</div>}
              </div>

              <div className="col-md-6 mb-2">
                <label className="form-label text-black">State</label>
                <select
                  className={`form-control`}
                  name="state"
                  value={formData.state}
                  onChange={(e) => {
                    handleChange("state", e.target.value);
                    handleChange("city", "");
                  }}
                  disabled={!formData.country}
                >
                  <option value="">Select State</option>
                  {states.map((s) => (
                    <option key={s.isoCode} value={s.isoCode}>
                      {s.name}
                    </option>
                  ))}
                </select>
                {errors.state && <div className="text-red-500 text-sm mt-1">{errors.state[0]}</div>}
              </div>

              <div className="col-md-6 mb-2">
                <label className="form-label text-black">City</label>
                <select
                  name="city"
                  value={cities.length === 0 ? "NA" : formData.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                  className="form-control"
                >
                  {cities.length > 0 ? (
                    <>
                      <option value="">Select City</option>
                      {cities.map((city) => (
                        <option key={city.name} value={city.name}>
                          {city.name}
                        </option>
                      ))}
                    </>
                  ) : (
                    <option value="NA">No City Available</option>
                  )}
                </select>
                {errors.city && <div className="text-red-500 text-sm mt-1">{errors.city[0]}</div>}
              </div>

              <div className="col-md-12">
                <label className="form-label text-black">Location</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Your Location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="mb-5">
              <div className="mb-4">
                <label className="form-label text-black">Description</label>
                <textarea
                  className={`form-control`}
                  placeholder="Ad description"
                  rows={4}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                />
                {errors.description && <div className="text-red-500 text-sm mt-1">{errors.description[0]}</div>}
              </div>

              <div className="mb-4">
                <label className="form-label text-black">Amenities</label>
                <div className="d-flex flex-wrap gap-3 items-center">
                  {[
                    "Fully Furnished",
                    "High-Speed Wi-Fi",
                    "Air Conditioning & Heating",
                    "In-unit Washing Machine",
                    "24/7 Security & Doorman",
                    "Parking",
                    "Living room",
                  ].map((item) => (
                    <div key={item} className="form-check d-flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id={item}
                        value={item}
                        checked={formData.amenities.includes(item)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData((prev) => ({
                              ...prev,
                              amenities: [...prev.amenities, item],
                            }));
                          } else {
                            setFormData((prev) => ({
                              ...prev,
                              amenities: prev.amenities.filter((a) => a !== item),
                            }));
                          }
                        }}
                      />
                      <label className="form-check-label" htmlFor={item}>
                        {item}
                      </label>
                    </div>
                  ))}
                </div>
                {errors.amenities && <div className="text-red-500 text-sm mt-1">{errors.amenities[0]}</div>}
              </div>

              <div className="mb-4">
                <label className="form-label text-black">Upload Featured Image</label>
                <div
                  className="border-2 border-dashed rounded d-flex align-items-center justify-content-center position-relative"
                  style={{ width: "120px", height: "120px", cursor: "pointer" }}
                  onClick={() => !featured && document.getElementById("featuredInput").click()}
                >
                  {featured ? (
                    <>
                      <img
                        src={getPhotoUrl(featured)}
                        alt="Featured"
                        className="img-fluid rounded"
                        style={{ maxHeight: "100%", objectFit: "cover" }}
                      />
                      <button
                        type="button"
                        className="btn btn-sm btn-danger position-absolute top-0 end-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFeatured(null);
                        }}
                      >
                        ×
                      </button>
                    </>
                  ) : (
                    <div
                      className="border rounded-[6px] bg-[#F5F7FA] d-flex align-items-center justify-content-center m-2"
                      style={{
                        width: "100px",
                        height: "100px",
                        cursor: "pointer",
                        color: "#6c757d",
                      }}
                    >
                      <span><FiPlusCircle size={20} /></span>
                    </div>
                  )}
                </div>
                {errors.featuredImage && <div className="text-red-500 text-sm mt-1">{errors.featuredImage[0]}</div>}

                <input
                  id="featuredInput"
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleFeaturedUpload}
                />
              </div>

              <div className="mb-4">
                <label className="form-label text-black">Upload Photos</label>
                <div
                  className="border-2 border-dashed rounded d-flex flex-wrap align-items-center p-2"
                  style={{ minHeight: "120px" }}
                >
                  {photos.map((photo, index) => (
                    <div
                      key={index}
                      className="position-relative m-2"
                      style={{
                        width: "100px",
                        height: "100px",
                        overflow: "hidden",
                        borderRadius: "8px",
                      }}
                    >
                      <img
                        src={getPhotoUrl(photo)}
                        alt="Preview"
                        className="img-fluid w-100 h-100"
                        style={{ objectFit: "cover" }}
                      />
                      <button
                        type="button"
                        className="btn btn-sm btn-danger position-absolute top-0 end-0"
                        onClick={() => removePhoto(index)}
                      >
                        ×
                      </button>
                    </div>
                  ))}

                  <div
                    className="border rounded-[6px] bg-[#F5F7FA] d-flex align-items-center justify-content-center m-2"
                    style={{
                      width: "100px",
                      height: "100px",
                      cursor: "pointer",
                      color: "#6c757d",
                    }}
                    onClick={() => document.getElementById("photosInput").click()}
                  >
                    <span><FiPlusCircle size={20} /></span>
                  </div>
                  <input
                    id="photosInput"
                    type="file"
                    accept="image/*"
                    multiple
                    hidden
                    onChange={handlePhotoUpload}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h4 className="mb-4 font-semibold text-xl">Preview Your Ad</h4>
              <h5 className="mb-2 font-semibold">Step 1: Basic Information</h5>
              <div className="mb-2"><strong>Title:</strong> {formData.title}</div>
              <div className="mb-2"><strong>Property Type:</strong> {formData.propertyType}</div>
              <div className="mb-2"><strong>Budget:</strong> {formData.budget} {formData.budgetType}</div>
              <div className="mb-2"><strong>Personal Info:</strong> {formData.personalInfo}</div>
              <div className="mb-2"><strong>Size:</strong> {formData.size} m²</div>
              <div className="mb-2"><strong>Furnishing:</strong> {formData.furnishing === "true" ? "Yes" : "No"}</div>
              <div className="mb-2"><strong>Smoking:</strong> {formData.smoking === "true" ? "Allowed" : "Not Allowed"}</div>
              <div className="mb-2"><strong>Rooms available for:</strong> {formData.roomsAvailableFor}</div>
              <div className="mb-2"><strong>Bedrooms:</strong> {formData.bedrooms}</div>
              <div className="mb-2"><strong>Country:</strong> {countries.find(c => c.isoCode === formData.country)?.name}</div>
              <div className="mb-2"><strong>State:</strong> {states.find(s => s.isoCode === formData.state)?.name}</div>
              <div className="mb-2"><strong>City:</strong> {formData.city}</div>
              <div className="mb-2"><strong>Location:</strong> {formData.location}</div>

              <h5 className="mt-4 mb-2 font-semibold">Step 2: Description & Images</h5>
              <div className="mb-2"><strong>Description:</strong> {formData.description}</div>
              {formData.amenities?.length > 0 && (
                <div className="mb-2">
                  <strong>Amenities:</strong> {formData.amenities.join(", ")}
                </div>
              )}
              {featured && (
                <div className="mb-3">
                  <strong>Featured Image:</strong>
                  <img src={getPhotoUrl(featured)} alt="Featured" className="w-32 rounded mt-2" />
                </div>
              )}
              {photos.length > 0 && (
                <div className="mb-3">
                  <strong>Photos ({photos.length}):</strong>
                  <div className="d-flex flex-wrap gap-2 mt-2">
                    {photos.map((photo, index) => (
                      <img key={index} src={getPhotoUrl(photo)} alt="Preview" className="w-24 h-24 object-cover rounded" />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="mt-6">
            {step === 3 ? (
              <div className="d-flex justify-content-end align-items-center">
                <div className="d-flex gap-3">
                  <button
                    onClick={prev}
                    className="px-4 py-2 rounded-[6px] border border-slate-200 text-slate-600 font-semibold"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setShowPromoteModal(true)}
                    disabled={isSubmitting}
                    className="px-4 py-3 rounded-[6px] bg-[#565ABF] text-white hover:opacity-95 flex items-center gap-2 font-semibold disabled:opacity-50"
                  >
                    {isSubmitting ? "Publishing..." : "Publish"} <FaArrowRightLong />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-end gap-4">
                {step > 1 && (
                  <button
                    onClick={prev}
                    className="px-4 py-2 rounded-[6px] border border-slate-200 text-slate-600 font-semibold"
                  >
                    Previous
                  </button>
                )}
                <button
                  onClick={next}
                  className="px-4 py-3 rounded-[6px] bg-[#565ABF] text-white hover:opacity-95 flex items-center gap-2 font-semibold"
                >
                  Next Steps <FaArrowRightLong />
                </button>
              </div>
            )}
<PromoteAdModal
  show={showPromoteModal}
  onClose={() => setShowPromoteModal(false)}
  onPublishNormally={() => {
    setShowPromoteModal(false);
    handlePublish();
  }}
  onProceedToPayment={(planShort) => {
    // planShort e.g. "10" or "30"
    setShowPromoteModal(false);
    initiatePromotionPayment(planShort);
  }}
  loading={promotionLoading}
/>

{/* Payment modal (Stripe Elements) */}
{clientSecret && showPaymentModal && (
  <Elements stripe={stripePromise} options={{ clientSecret }}>
    <PromotionPaymentModal
      clientSecret={clientSecret}
      onClose={() => {
        setShowPaymentModal(false);
        setClientSecret(null);
      }}
      onSuccess={() => {
        setShowPaymentModal(false);
        setClientSecret(null);
        toast.success("Payment successful! Your promoted ad will be live soon.");
        navigate("/user/thank-you", {
          state: {
            title: "Payment successful",
            subtitle: "Your promoted ad will go live after verification.",
            goBackPath: "/user/post-an-space",
          }
        });
      }}
    />
  </Elements>
)}

          </div>
        </div>
      </div>
    </div>
  );
}