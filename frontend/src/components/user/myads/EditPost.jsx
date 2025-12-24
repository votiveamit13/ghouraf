"use client";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Country, State, City } from "country-state-city";
import { FiPlusCircle, FiX } from "react-icons/fi";
import locales from "locale-codes";

const PROPERTY_TYPES = ["Room", "Apartment"];
const BUDGET_TYPES = ["Month", "Week"];
const PERSONAL_INFO_TYPES = ["Landlord", "Agent", "Flatmate"];
const ROOMS_AVAILABLE_FOR = ["any gender", "male", "female"];
const BEDROOMS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const AMENITIES_LIST = [
  "Fully Furnished",
  "High-Speed Wi-Fi",
  "Air Conditioning & Heating",
  "In-unit Washing Machine",
  "24/7 Security & Doorman",
  "Parking",
  "Living room",
];

const SPACEWANTED_PROPERTY_TYPES = ["Room", "Apartment"];
const SPACEWANTED_BUDGET_TYPES = ["Month", "Week"];
const SPACEWANTED_PERIODS = ["Short term", "Long term"];
const SPACEWANTED_MOVE_IN_DATES = ["As soon as possible", "In a week time", "In a month time"];
const SPACEWANTED_GENDERS = ["male", "female"];
const SPACEWANTED_OCCUPATIONS = ["Student", "Professional"];
const SPACEWANTED_SMOKE_OPTIONS = ["Yes", "No", "Sometimes"];
const SPACEWANTED_PETS_OPTIONS = ["Yes", "No"];
const SPACEWANTED_AMENITIES = [
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
];

const TEAMUP_BUDGET_TYPES = ["Month", "Week"];
const TEAMUP_PERIODS = ["Short Term", "Long Term"];
const TEAMUP_GENDERS = ["any gender", "male", "female"];
const TEAMUP_OCCUPATION_PREFERENCES = ["Student", "Professional"];
const TEAMUP_AMENITIES = [
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
];

export default function EditPost({ show, onClose, ad, onUpdated }) {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [photos, setPhotos] = useState([]);
  const [featured, setFeatured] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [allLocales, setAllLocales] = useState([]);
  
  const apiUrl = process.env.REACT_APP_API_URL;
  const fileInputRef = useRef(null);
  const featuredInputRef = useRef(null);

  useEffect(() => {
    setCountries(Country.getAllCountries());
    setAllLocales(locales.all);
  }, []);

  useEffect(() => {
    if (ad && show) {
      console.log("Initializing ad data:", ad);
      
      if (ad.postCategory === "Space") {
        const processedData = {
          title: ad.title || "",
          propertyType: ad.propertyType || "",
          budget: ad.budget || "",
          budgetType: ad.budgetType || "",
          personalInfo: ad.personalInfo || "",
          size: ad.size || "",
          furnishing: ad.furnishing?.toString() || "",
          smoking: ad.smoking?.toString() || "",
          roomsAvailableFor: ad.roomsAvailableFor || "",
          bedrooms: ad.bedrooms || "",
          country: ad.country || "",
          state: ad.state || "",
          city: ad.city || "",
          location: ad.location || "",
          description: ad.description || "",
          amenities: ad.amenities || [],
        };

        console.log("Processed Space data:", processedData);
        setFormData(processedData);
        
        if (ad.photos && ad.photos.length > 0) {
          const existingPhotos = ad.photos.map(photo => ({
            id: photo.id || Math.random().toString(),
            url: typeof photo === 'string' ? photo : photo.url,
            isExisting: true
          }));
          setPhotos(existingPhotos);
        }
        
        if (ad.featuredImage) {
          setFeatured({
            url: ad.featuredImage,
            isExisting: true
          });
        }
      } else if (ad.postCategory === "Spacewanted") {
        const processedData = {
          title: ad.title || "",
          propertyType: ad.propertyType || "",
          roomSize: ad.roomSize || "",
          country: ad.country || "",
          state: ad.state || "",
          city: ad.city || "",
          budget: ad.budget || "",
          budgetType: ad.budgetType || "",
          moveInDate: ad.moveInDate || "",
          period: ad.period || "",
          amenities: ad.amenities || [],
          name: ad.name || "",
          age: ad.age || "",
          gender: ad.gender || "",
          occupation: ad.occupation || "",
          smoke: ad.smoke || "",
          pets: ad.pets || "",
          description: ad.description || "",
          teamUp: ad.teamUp || false,
        };

        console.log("Processed Spacewanted data:", processedData);
        setFormData(processedData);
        
        if (ad.photos && ad.photos.length > 0) {
          const existingPhotos = ad.photos.map(photo => ({
            id: photo.id || Math.random().toString(),
            url: typeof photo === 'string' ? photo : photo.url,
            isExisting: true
          }));
          setPhotos(existingPhotos);
        }
      } else if (ad.postCategory === "Teamup") {
        const processedData = {
          title: ad.title || "",
          country: ad.country || "",
          state: ad.state || "",
          city: ad.city || "",
          budget: ad.budget || "",
          budgetType: ad.budgetType || "",
          period: ad.period || "",
          amenities: ad.amenities || [],
          firstName: ad.firstName || "",
          lastName: ad.lastName || "",
          age: ad.age || "",
          gender: ad.gender || "",
          minAge: ad.minAge || "",
          maxAge: ad.maxAge || "",
          occupationPreference: ad.occupationPreference || "",
          occupation: ad.occupation || "",
          smoke: ad.smoke?.toString() || "",
          pets: ad.pets?.toString() || "",
          petsPreference: ad.petsPreference?.toString() || "",
          language: ad.language || "",
          description: ad.description || "",
          buddyDescription: ad.buddyDescription || "",
        };

        console.log("Processed Teamup data:", processedData);
        setFormData(processedData);
        
        if (ad.photos && ad.photos.length > 0) {
          const existingPhotos = ad.photos.map(photo => ({
            id: photo.id || Math.random().toString(),
            url: typeof photo === 'string' ? photo : photo.url,
            isExisting: true
          }));
          setPhotos(existingPhotos);
        }
      } else {
        const photos = (ad.photos || []).map((p) =>
          typeof p === "string" ? { url: p } : { ...p }
        );
        const featured = ad.featuredImage ? { url: ad.featuredImage } : null;
        setFormData({ ...ad, photos, featuredImageObj: featured });
      }
    }
  }, [ad, show]);

  useEffect(() => {
    if (formData.country) {
      const countryStates = State.getStatesOfCountry(formData.country);
      console.log("Loaded states for country:", formData.country, countryStates);
      setStates(countryStates);
    } else {
      setStates([]);
    }
    setCities([]);
  }, [formData.country]);

  useEffect(() => {
    if (formData.state && formData.country) {
      const stateCities = City.getCitiesOfState(formData.country, formData.state);
      console.log("Loaded cities for state:", formData.state, stateCities);
      setCities(stateCities);
      
      if (stateCities.length === 0 && formData.city && formData.city !== "NA") {
        setFormData(prev => ({
          ...prev,
          city: "NA"
        }));
      }
    } else {
      setCities([]);
    }
  }, [formData.state, formData.country]);

  const validateSpaceForm = () => {
    const newErrors = {};

    if (!formData.title?.trim()) {
      newErrors.title = ["Title is required"];
    } else if (formData.title.length < 3) {
      newErrors.title = ["Title should be at least 3 characters"];
    } else if (formData.title.length > 100) {
      newErrors.title = ["Title cannot exceed 100 characters"];
    }

    if (!formData.propertyType) {
      newErrors.propertyType = ["Property Type is required"];
    }

    if (!formData.budget) {
      newErrors.budget = ["Budget is required"];
    } else if (Number(formData.budget) <= 0) {
      newErrors.budget = ["Budget must be greater than 0"];
    } else if (Number(formData.budget) > 100000) {
      newErrors.budget = ["Budget cannot exceed 1,00,000"];
    }

    if (!formData.budgetType) {
      newErrors.budgetType = ["Budget Type is required"];
    }

    if (!formData.personalInfo) {
      newErrors.personalInfo = ["Personal Info is required"];
    }

    if (!formData.size || formData.size <= 0) {
      newErrors.size = ["Size must be greater than 0"];
    }

    if (formData.furnishing === "") {
      newErrors.furnishing = ["Furnishing is required"];
    }

    if (!formData.roomsAvailableFor) {
      newErrors.roomsAvailableFor = ["Property Available is required"];
    }

    if (!formData.bedrooms) {
      newErrors.bedrooms = ["Number of bedrooms is required"];
    }

    if (!formData.country) {
      newErrors.country = ["Country is required"];
    }
    if (!formData.state) {
      newErrors.state = ["State is required"];
    }
    if (cities.length > 0 && !formData.city) {
      newErrors.city = ["City is required"];
    } else if (cities.length === 0 && !formData.city && formData.city !== "NA") {
      newErrors.city = ["City is required"];
    }

    if (!formData.description?.trim() || formData.description.length < 5) {
      newErrors.description = ["Description must be at least 5 characters"];
    }

    if (!formData.amenities || formData.amenities.length === 0) {
      newErrors.amenities = ["At least one amenity is required"];
    }

    if (!featured) {
      newErrors.featuredImage = ["Featured image is required"];
    }

    console.log("Validation errors:", newErrors);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSpaceWantedForm = () => {
    const newErrors = {};

    if (!formData.title?.trim()) {
      newErrors.title = ["Title is required"];
    } else if (formData.title.length < 3) {
      newErrors.title = ["Title should be at least 3 characters"];
    } else if (formData.title.length > 100) {
      newErrors.title = ["Title cannot exceed 100 characters"];
    }

    if (!formData.description?.trim()) {
      newErrors.description = ["Description is required"];
    } else if (formData.description.length < 5) {
      newErrors.description = ["Description must be at least 5 characters"];
    }

    if (!formData.propertyType) {
      newErrors.propertyType = ["Space Wanted Type is required"];
    }

    if (!formData.roomSize) {
      newErrors.roomSize = ["Space Size is required"];
    }

    if (!formData.country) {
      newErrors.country = ["Country is required"];
    }
    if (!formData.state) {
      newErrors.state = ["State is required"];
    }
    if (cities.length > 0 && !formData.city) {
      newErrors.city = ["City is required"];
    } else if (cities.length === 0 && !formData.city && formData.city !== "NA") {
      newErrors.city = ["City is required"];
    }

    if (!formData.budget) {
      newErrors.budget = ["Budget is required"];
    } else if (Number(formData.budget) <= 0) {
      newErrors.budget = ["Budget must be greater than 0"];
    } else if (Number(formData.budget) > 100000) {
      newErrors.budget = ["Budget cannot exceed 1,00,000"];
    }

    if (!formData.budgetType) {
      newErrors.budgetType = ["Budget Type is required"];
    }

    if (!formData.period) {
      newErrors.period = ["Duration of stay is required"];
    }

    if (!formData.name?.trim()) {
      newErrors.name = ["Name is required"];
    }
    if (!formData.age) {
      newErrors.age = ["Age is required"];
    } else if (formData.age < 18) {
      newErrors.age = ["Age must be at least 18"];
    } else if (formData.age > 100) {
      newErrors.age = ["Age cannot exceed 100"];
    }
    if (!SPACEWANTED_GENDERS.includes(formData.gender)) {
      newErrors.gender = ["Gender must be either 'male' or 'female'"];
    }
    if (!SPACEWANTED_OCCUPATIONS.includes(formData.occupation)) {
      newErrors.occupation = ["Occupation must be 'Student' or 'Professional'"];
    }
    if (!SPACEWANTED_SMOKE_OPTIONS.includes(formData.smoke)) {
      newErrors.smoke = ["Smoke must be 'Yes', 'No' or 'Sometimes'"];
    }
    if (!SPACEWANTED_PETS_OPTIONS.includes(formData.pets)) {
      newErrors.pets = ["Pets must be 'Yes' or 'No'"];
    }

    console.log("Spacewanted validation errors:", newErrors);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateTeamUpForm = () => {
    const newErrors = {};

    if (!formData.title?.trim()) {
      newErrors.title = ["Title is required"];
    }

    if (!formData.country) {
      newErrors.country = ["Country is required"];
    }
    if (!formData.state) {
      newErrors.state = ["State is required"];
    }
    if (cities.length > 0 && !formData.city) {
      newErrors.city = ["City is required"];
    } else if (cities.length === 0 && !formData.city && formData.city !== "NA") {
      newErrors.city = ["City is required"];
    }

    if (!formData.budget) {
      newErrors.budget = ["Budget is required"];
    } else if (Number(formData.budget) <= 0) {
      newErrors.budget = ["Budget must be greater than 0"];
    } else if (Number(formData.budget) > 100000) {
      newErrors.budget = ["Budget cannot exceed 1,00,000"];
    }

    if (!formData.budgetType) {
      newErrors.budgetType = ["Select budget type"];
    }

    if (!formData.firstName?.trim()) {
      newErrors.firstName = ["First name is required"];
    }
    if (!formData.lastName?.trim()) {
      newErrors.lastName = ["Last name is required"];
    }
    if (!formData.gender) {
      newErrors.gender = ["Gender is required"];
    }
    if (!formData.age) {
      newErrors.age = ["Age is required"];
    }

    if (!formData.smoke) {
      newErrors.smoke = ["Select smoking category"];
    }
    if (!formData.pets) {
      newErrors.pets = ["Select pet category"];
    }
    if (!formData.petsPreference) {
      newErrors.petsPreference = ["Select pet preference category"];
    }

    if (!formData.amenities || formData.amenities.length === 0) {
      newErrors.amenities = ["Select at least one interest"];
    }

    if (!formData.description?.trim()) {
      newErrors.description = ["Description is required"];
    }

    if (!photos || photos.length === 0) {
      newErrors.photos = ["Please upload at least one photo"];
    }

    console.log("Teamup validation errors:", newErrors);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    let processedValue = value;
    
    if (ad?.postCategory === "Space" && (name === "size" || name === "budget") && type === "text") {
      processedValue = value.replace(/[^0-9]/g, "");
    }
    
    if (ad?.postCategory === "Spacewanted" && (name === "roomSize" || name === "budget" || name === "age") && type === "text") {
      processedValue = value.replace(/[^0-9]/g, "");
    }
    
    if (ad?.postCategory === "Teamup" && (name === "minAge" || name === "maxAge" || name === "age" || name === "budget") && type === "text") {
      processedValue = value.replace(/[^0-9]/g, "");
    }
    
    if (type === "checkbox" && name === "amenities") {
      setFormData(prev => ({
        ...prev,
        amenities: checked
          ? [...prev.amenities, value]
          : prev.amenities.filter(a => a !== value)
      }));
      setErrors(prev => ({ ...prev, amenities: undefined }));
      return;
    }

    if ((ad?.postCategory === "Space" && (name === "furnishing" || name === "smoking")) || 
        (ad?.postCategory === "Spacewanted" && name === "teamUp") ||
        (ad?.postCategory === "Teamup" && (name === "smoke" || name === "pets" || name === "petsPreference"))) {
      processedValue = type === "checkbox" ? checked : value;
    }

    if (name === "country") {
      setFormData(prev => ({
        ...prev,
        country: value,
        state: "",
        city: ""
      }));
      setErrors(prev => ({ ...prev, country: undefined, state: undefined, city: undefined }));
      return;
    }

    if (name === "state") {
      const newCities = City.getCitiesOfState(formData.country, value);
      setFormData(prev => ({
        ...prev,
        state: value,
        city: newCities.length === 0 ? "NA" : (formData.city === "NA" ? "" : formData.city)
      }));
      setErrors(prev => ({ ...prev, state: undefined, city: undefined }));
      return;
    }

    if (name === "city") {
      setFormData(prev => ({
        ...prev,
        city: value
      }));
      setErrors(prev => ({ ...prev, city: undefined }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));

    setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleFeaturedUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFeatured({ file, url: URL.createObjectURL(file), isNew: true });
      setErrors(prev => ({ ...prev, featuredImage: undefined }));
    }
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    const newPhotos = files.map(file => ({
      file,
      url: URL.createObjectURL(file),
      isNew: true
    }));
    setPhotos(prev => [...prev, ...newPhotos]);
    setErrors(prev => ({ ...prev, photos: undefined }));
  };

  const removePhoto = (index) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const removeFeatured = () => {
    setFeatured(null);
  };

  const getPhotoUrl = (photo) => {
    return photo.url;
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  
  let isValid = false;
  if (ad?.postCategory === "Space") {
    isValid = validateSpaceForm();
  } else if (ad?.postCategory === "Spacewanted") {
    isValid = validateSpaceWantedForm();
  } else if (ad?.postCategory === "Teamup") {
    isValid = validateTeamUpForm();
  } else {
    isValid = true;
  }

  if (!isValid) {
    return;
  }

  setIsSubmitting(true);
  try {
    const token = localStorage.getItem("token");
    const formPayload = new FormData();

    let endpoint = `${apiUrl}my-ads/${ad._id}`;
    
    if (ad.postCategory === "Space") {
      endpoint = `${apiUrl}spaces/${ad._id}`;
    } else if (ad.postCategory === "Spacewanted") {
      endpoint = `${apiUrl}spacewanted/${ad._id}`;
    } else if (ad.postCategory === "Teamup") {
      endpoint = `${apiUrl}teamup/${ad._id}`;
    }

    formPayload.append("postCategory", ad.postCategory);

    if (ad.postCategory === "Space") {
      const processedData = {
        ...formData,
        furnishing: formData.furnishing === "true",
        smoking: formData.smoking === "true",
        bedrooms: parseInt(formData.bedrooms, 10),
        budget: parseFloat(formData.budget),
        size: parseFloat(formData.size)
      };

      Object.keys(processedData).forEach(key => {
        if (key === "amenities") {
          processedData.amenities.forEach(a => formPayload.append("amenities[]", a));
        } else if (!["photos", "featuredImage"].includes(key)) {
          formPayload.append(key, processedData[key]);
        }
      });

      if (featured?.file) {
        formPayload.append("featuredImage", featured.file);
      } else if (featured?.isExisting) {
        formPayload.append("existingFeaturedImage", featured.url); 
      }

    } else if (ad.postCategory === "Spacewanted") {
      const processedData = {
        ...formData,
        age: parseInt(formData.age, 10),
        budget: parseFloat(formData.budget),
        roomSize: parseFloat(formData.roomSize)
      };

      Object.keys(processedData).forEach(key => {
        if (key === "amenities") {
          processedData.amenities.forEach(a => formPayload.append("amenities[]", a));
        } else if (!["photos"].includes(key)) {
          formPayload.append(key, processedData[key]);
        }
      });

    } else if (ad.postCategory === "Teamup") {
      const processedData = {
        ...formData,
        age: parseInt(formData.age, 10),
        budget: parseFloat(formData.budget),
        minAge: formData.minAge ? parseInt(formData.minAge, 10) : null,
        maxAge: formData.maxAge ? parseInt(formData.maxAge, 10) : null,
        smoke: formData.smoke === "true",
        pets: formData.pets === "true",
        petsPreference: formData.petsPreference === "true",
      };

      Object.keys(processedData).forEach(key => {
        if (key === "amenities") {
          processedData.amenities.forEach(a => formPayload.append("amenities[]", a));
        } else if (!["photos"].includes(key)) {
          formPayload.append(key, processedData[key]);
        }
      });
    }

    photos.forEach(photo => {
      if (photo.file) {
        formPayload.append("photos", photo.file);
      } else if (photo.isExisting) {
        formPayload.append("existingPhotos", photo.url); 
      }
    });

    console.log("Sending update request to:", endpoint);
    
    const response = await axios.put(endpoint, formPayload, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    toast.success("Your post was edited successfully! This post will undergo a review process and will be published once approved.");
    onUpdated?.();
    onClose?.();

  } catch (err) {
    console.error("Update error:", err);
    
    if (err.response?.status === 404) {
      try {
        console.log("Specific endpoint failed, trying generic endpoint...");
        const token = localStorage.getItem("token");
        const genericEndpoint = `${apiUrl}my-ads/${ad._id}`;
        
        const fallbackFormPayload = new FormData();
        
        fallbackFormPayload.append("postCategory", ad.postCategory);
        
        Object.keys(formData).forEach(key => {
          if (key === "amenities" && Array.isArray(formData.amenities)) {
            formData.amenities.forEach(a => fallbackFormPayload.append("amenities[]", a));
          } else if (!["photos", "featuredImage"].includes(key)) {
            fallbackFormPayload.append(key, formData[key]);
          }
        });
        
        photos.forEach(photo => {
          if (photo.file) {
            fallbackFormPayload.append("photos", photo.file);
          } else if (photo.isExisting) {
            fallbackFormPayload.append("existingPhotos", photo.url); 
          }
        });
        
        if (ad.postCategory === "Space") {
          if (featured?.file) {
            fallbackFormPayload.append("featuredImage", featured.file);
          } else if (featured?.isExisting) {
            fallbackFormPayload.append("existingFeaturedImage", featured.url); 
          }
        }

        const response = await axios.put(genericEndpoint, fallbackFormPayload, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
        
        toast.success(
  "Your post was edited successfully! This post will undergo a review process and will be published once approved."
);
        onUpdated?.();
        onClose?.();
        return;
      } catch (fallbackErr) {
        console.error("Fallback update error:", fallbackErr);
        if (fallbackErr.response?.status === 422) {
          const backendErrors = fallbackErr.response.data.errors || {};
          setErrors(backendErrors);
        } else {
          toast.error(fallbackErr.response?.data?.message || "Failed to update ad");
        }
      }
    } else if (err.response?.status === 422) {
      const backendErrors = err.response.data.errors || {};
      setErrors(backendErrors);
    } else {
      toast.error(err.response?.data?.message || "Failed to update ad");
    }
  } finally {
    setIsSubmitting(false);
  }
};

  if (!show || !ad) return null;

  const inputClass = "border border-gray-300 rounded-lg p-2.5 w-full text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none";
  const errorClass = "border-red-500 focus:ring-red-500 focus:border-red-500";

  const Field = ({ label, children, error }) => (
    <div className="flex flex-col space-y-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {children}
      {error && <div className="text-red-500 text-sm mt-1">{error[0]}</div>}
    </div>
  );

  const renderLocationFields = () => (
    <>
      <Field label="Country" error={errors.country}>
        <select
          name="country"
          value={formData.country || ""}
          onChange={handleChange}
          className={`${inputClass} ${errors.country ? errorClass : ''}`}
        >
          <option value="">Select Country</option>
          {countries.map((c) => (
            <option key={c.isoCode} value={c.isoCode}>
              {c.name}
            </option>
          ))}
        </select>
      </Field>
      
      <Field label="State" error={errors.state}>
        <select
          name="state"
          value={formData.state || ""}
          onChange={handleChange}
          disabled={!formData.country}
          className={`${inputClass} ${errors.state ? errorClass : ''} ${!formData.country ? 'bg-gray-100 cursor-not-allowed' : ''}`}
        >
          <option value="">Select State</option>
          {states.map((s) => (
            <option key={s.isoCode} value={s.isoCode}>
              {s.name}
            </option>
          ))}
        </select>
      </Field>
      
      <Field label="City" error={errors.city}>
        <select
          name="city"
          value={formData.city || ""}
          onChange={handleChange}
          className={`${inputClass} ${errors.city ? errorClass : ''}`}
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
      </Field>
    </>
  );

  const renderPhotoPreview = () => {
    const photosToShow = photos;
    if (!photosToShow.length) return null;
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
        {photosToShow.map((p, i) => (
          <div key={i} className="relative group">
            <img
              src={getPhotoUrl(p)}
              alt=""
              className="w-full h-40 object-cover rounded-lg border"
            />
            <button
              type="button"
              onClick={() => removePhoto(i)}
              className="absolute top-2 right-2 bg-black/60 text-white rounded-full px-2 py-1 text-sm opacity-0 group-hover:opacity-100 transition"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    );
  };

  /** ---------- UPDATED SPACE FIELDS ---------- */
  const renderSpaceFields = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label="Title" error={errors.title}>
          <input
            type="text"
            name="title"
            value={formData.title || ""}
            onChange={handleChange}
            className={`${inputClass} ${errors.title ? errorClass : ''}`}
            placeholder="Ad name"
          />
        </Field>

        <Field label="Property Type" error={errors.propertyType}>
          <select
            name="propertyType"
            value={formData.propertyType || ""}
            onChange={handleChange}
            className={`${inputClass} ${errors.propertyType ? errorClass : ''}`}
          >
            <option value="">Select Property Type</option>
            {PROPERTY_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </Field>

        <Field label="Budget" error={errors.budget}>
          <div className="space-y-2">
            <div className="flex gap-4">
              {BUDGET_TYPES.map(type => (
                <label key={type} className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="budgetType"
                    value={type}
                    checked={formData.budgetType === type}
                    onChange={handleChange}
                  />
                  Per {type}
                </label>
              ))}
            </div>
            <input
              type="text"
              name="budget"
              value={formData.budget || ""}
              onChange={handleChange}
              className={`${inputClass} ${errors.budget ? errorClass : ''}`}
              placeholder="Enter your budget"
            />
          </div>
        </Field>

        <Field label="Personal Info" error={errors.personalInfo}>
          <select
            name="personalInfo"
            value={formData.personalInfo || ""}
            onChange={handleChange}
            className={`${inputClass} ${errors.personalInfo ? errorClass : ''}`}
          >
            <option value="">Select</option>
            {PERSONAL_INFO_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </Field>

        <Field label="Size of Apartment (m²)" error={errors.size}>
          <input
            type="text"
            name="size"
            value={formData.size || ""}
            onChange={handleChange}
            className={`${inputClass} ${errors.size ? errorClass : ''}`}
            placeholder="m²"
          />
        </Field>

        <Field label="Furnishing" error={errors.furnishing}>
          <select
            name="furnishing"
            value={formData.furnishing || ""}
            onChange={handleChange}
            className={`${inputClass} ${errors.furnishing ? errorClass : ''}`}
          >
            <option value="">Select Furnishing</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </Field>

        <Field label="Smoking" error={errors.smoking}>
          <select
            name="smoking"
            value={formData.smoking || ""}
            onChange={handleChange}
            className={`${inputClass} ${errors.smoking ? errorClass : ''}`}
          >
            <option value="">Indifferent</option>
            <option value="true">Allowed</option>
            <option value="false">Not Allowed</option>
          </select>
        </Field>

        <Field label="Property Available" error={errors.roomsAvailableFor}>
          <select
            name="roomsAvailableFor"
            value={formData.roomsAvailableFor || ""}
            onChange={handleChange}
            className={`${inputClass} ${errors.roomsAvailableFor ? errorClass : ''}`}
          >
            <option value="">Select</option>
            {ROOMS_AVAILABLE_FOR.map(type => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Number of bedrooms" error={errors.bedrooms}>
          <select
            name="bedrooms"
            value={formData.bedrooms || ""}
            onChange={handleChange}
            className={`${inputClass} ${errors.bedrooms ? errorClass : ''}`}
          >
            <option value="">Select</option>
            {BEDROOMS.map(num => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
        </Field>

        {renderLocationFields()}

        <Field label="Location">
          <input
            type="text"
            name="location"
            value={formData.location || ""}
            onChange={handleChange}
            className={inputClass}
            placeholder="Your Location"
          />
        </Field>

        <div className="md:col-span-2">
          <Field label="Description" error={errors.description}>
            <textarea
              name="description"
              rows={4}
              value={formData.description || ""}
              onChange={handleChange}
              className={`${inputClass} resize-none ${errors.description ? errorClass : ''}`}
              placeholder="Ad description"
            />
          </Field>
        </div>

        <div className="md:col-span-2">
          <Field label="Amenities" error={errors.amenities}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {AMENITIES_LIST.map(amenity => (
                <label key={amenity} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="amenities"
                    value={amenity}
                    checked={formData.amenities?.includes(amenity) || false}
                    onChange={handleChange}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-700">{amenity}</span>
                </label>
              ))}
            </div>
          </Field>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <Field label="Featured Image" error={errors.featuredImage}>
          <div className="flex items-center gap-4">
            {featured ? (
              <div className="relative">
                <img src={getPhotoUrl(featured)} className="w-48 h-32 object-cover rounded-md border" alt="featured" />
                <button type="button" onClick={removeFeatured} className="absolute top-1 right-1 bg-black/60 text-white rounded-full px-2 py-1 text-sm">✕</button>
              </div>
            ) : (
              <div className="w-48 h-32 bg-gray-100 flex items-center justify-center rounded-md">
                <span className="text-sm text-gray-500">No image</span>
              </div>
            )}
            <div>
              <input type="file" accept="image/*" ref={featuredInputRef} onChange={handleFeaturedUpload} className="hidden" />
              <button type="button" onClick={() => featuredInputRef.current?.click()} className="border px-3 py-2 rounded bg-white text-sm hover:bg-gray-100">
                {featured ? "Replace" : "Upload Featured"}
              </button>
            </div>
          </div>
        </Field>

        <Field label="Gallery Photos">
          {renderPhotoPreview()}
          <input type="file" accept="image/*" multiple ref={fileInputRef} onChange={handlePhotoUpload} className="hidden" />
          <button type="button" onClick={() => fileInputRef.current?.click()} className="border px-3 py-2 rounded bg-white text-sm hover:bg-gray-100">
            + Add Photos
          </button>
        </Field>
      </div>
    </>
  );

  /** ---------- UPDATED SPACE WANTED FIELDS ---------- */
  const renderSpaceWantedFields = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label="Title" error={errors.title}>
          <input
            type="text"
            name="title"
            value={formData.title || ""}
            onChange={handleChange}
            className={`${inputClass} ${errors.title ? errorClass : ''}`}
            placeholder="Ad title"
          />
        </Field>

        <Field label="Space Wanted Type" error={errors.propertyType}>
          <select
            name="propertyType"
            value={formData.propertyType || ""}
            onChange={handleChange}
            className={`${inputClass} ${errors.propertyType ? errorClass : ''}`}
          >
            <option value="">Select</option>
            {SPACEWANTED_PROPERTY_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </Field>

        <Field label="Space Size (m²)" error={errors.roomSize}>
          <input
            type="text"
            name="roomSize"
            value={formData.roomSize || ""}
            onChange={handleChange}
            className={`${inputClass} ${errors.roomSize ? errorClass : ''}`}
            placeholder="Size in m²"
          />
        </Field>

        {renderLocationFields()}

        <Field label="Budget" error={errors.budget}>
          <div className="space-y-2">
            <div className="flex gap-4">
              {SPACEWANTED_BUDGET_TYPES.map(type => (
                <label key={type} className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="budgetType"
                    value={type}
                    checked={formData.budgetType === type}
                    onChange={handleChange}
                  />
                  Per {type}
                </label>
              ))}
            </div>
            <input
              type="text"
              name="budget"
              value={formData.budget || ""}
              onChange={handleChange}
              className={`${inputClass} ${errors.budget ? errorClass : ''}`}
              placeholder="Enter budget"
            />
          </div>
        </Field>

        <Field label="Move-in Date" error={errors.moveInDate}>
          <select
            name="moveInDate"
            value={formData.moveInDate || ""}
            onChange={handleChange}
            className={`${inputClass} ${errors.moveInDate ? errorClass : ''}`}
          >
            <option value="">Select</option>
            {SPACEWANTED_MOVE_IN_DATES.map(date => (
              <option key={date} value={date}>{date}</option>
            ))}
          </select>
        </Field>

        <Field label="Duration of Stay" error={errors.period}>
          <select
            name="period"
            value={formData.period || ""}
            onChange={handleChange}
            className={`${inputClass} ${errors.period ? errorClass : ''}`}
          >
            <option value="">Select</option>
            {SPACEWANTED_PERIODS.map(period => (
              <option key={period} value={period}>{period}</option>
            ))}
          </select>
        </Field>

        <Field label="Full Name" error={errors.name}>
          <input
            type="text"
            name="name"
            value={formData.name || ""}
            onChange={handleChange}
            className={`${inputClass} ${errors.name ? errorClass : ''}`}
            placeholder="Full Name"
          />
        </Field>

        <Field label="Age" error={errors.age}>
          <input
            type="text"
            name="age"
            value={formData.age || ""}
            onChange={handleChange}
            className={`${inputClass} ${errors.age ? errorClass : ''}`}
            placeholder="Enter age"
          />
        </Field>

        <Field label="Gender" error={errors.gender}>
          <select
            name="gender"
            value={formData.gender || ""}
            onChange={handleChange}
            className={`${inputClass} ${errors.gender ? errorClass : ''}`}
          >
            <option value="">Select</option>
            {SPACEWANTED_GENDERS.map(gender => (
              <option key={gender} value={gender}>{gender}</option>
            ))}
          </select>
        </Field>

        <Field label="Occupation" error={errors.occupation}>
          <select
            name="occupation"
            value={formData.occupation || ""}
            onChange={handleChange}
            className={`${inputClass} ${errors.occupation ? errorClass : ''}`}
          >
            <option value="">Select</option>
            {SPACEWANTED_OCCUPATIONS.map(occupation => (
              <option key={occupation} value={occupation}>{occupation}</option>
            ))}
          </select>
        </Field>

        <Field label="Do You Smoke?" error={errors.smoke}>
          <select
            name="smoke"
            value={formData.smoke || ""}
            onChange={handleChange}
            className={`${inputClass} ${errors.smoke ? errorClass : ''}`}
          >
            <option value="">Select</option>
            {SPACEWANTED_SMOKE_OPTIONS.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </Field>

        <Field label="Do You Have Any Pets?" error={errors.pets}>
          <select
            name="pets"
            value={formData.pets || ""}
            onChange={handleChange}
            className={`${inputClass} ${errors.pets ? errorClass : ''}`}
          >
            <option value="">Select</option>
            {SPACEWANTED_PETS_OPTIONS.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </Field>

        <div className="md:col-span-2">
          <Field label="Amenities" error={errors.amenities}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {SPACEWANTED_AMENITIES.map(amenity => (
                <label key={amenity} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="amenities"
                    value={amenity}
                    checked={formData.amenities?.includes(amenity) || false}
                    onChange={handleChange}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-700">{amenity}</span>
                </label>
              ))}
            </div>
          </Field>
        </div>

        <div className="md:col-span-2">
          <Field label="Description" error={errors.description}>
            <textarea
              name="description"
              rows={4}
              value={formData.description || ""}
              onChange={handleChange}
              className={`${inputClass} resize-none ${errors.description ? errorClass : ''}`}
              placeholder="Please write what exactly you are looking for..."
            />
          </Field>
        </div>

        <div className="md:col-span-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="teamUp"
              checked={formData.teamUp || false}
              onChange={handleChange}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-sm text-gray-700">
              I/we are also interested in Team Up?
            </span>
          </label>
          <p className="text-sm text-gray-500 mt-1">
            Tick this if you might like to Buddy Up with other room seekers to find a whole apartment or house together.
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <Field label="Gallery Photos">
          {renderPhotoPreview()}
          <input type="file" accept="image/*" multiple ref={fileInputRef} onChange={handlePhotoUpload} className="hidden" />
          <button type="button" onClick={() => fileInputRef.current?.click()} className="border px-3 py-2 rounded bg-white text-sm hover:bg-gray-100">
            + Add Photos
          </button>
        </Field>
      </div>
    </>
  );

  /** ---------- UPDATED TEAM UP FIELDS ---------- */
  const renderTeamUpFields = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label="Post Title" error={errors.title}>
          <input
            type="text"
            name="title"
            value={formData.title || ""}
            onChange={handleChange}
            className={`${inputClass} ${errors.title ? errorClass : ''}`}
            placeholder="e.g., “Looking for flatmate to share 2BHK”"
          />
        </Field>

        {renderLocationFields()}

        <Field label="First Name" error={errors.firstName}>
          <input
            type="text"
            name="firstName"
            value={formData.firstName || ""}
            onChange={handleChange}
            className={`${inputClass} ${errors.firstName ? errorClass : ''}`}
            placeholder="Enter your first name"
          />
        </Field>

        <Field label="Last Name" error={errors.lastName}>
          <input
            type="text"
            name="lastName"
            value={formData.lastName || ""}
            onChange={handleChange}
            className={`${inputClass} ${errors.lastName ? errorClass : ''}`}
            placeholder="Enter your last name"
          />
        </Field>

        <Field label="Gender" error={errors.gender}>
          <input
            type="text"
            name="gender"
            value={formData.gender || ""}
            onChange={handleChange}
            className={`${inputClass} ${errors.gender ? errorClass : ''}`}
          />
        </Field>

        <Field label="Age" error={errors.age}>
          <input
            type="text"
            name="age"
            value={formData.age || ""}
            onChange={handleChange}
            className={`${inputClass} ${errors.age ? errorClass : ''}`}
            placeholder="Age"
          />
        </Field>

        <Field label="Occupation">
          <input
            type="text"
            name="occupation"
            value={formData.occupation || ""}
            onChange={handleChange}
            className={inputClass}
          />
        </Field>

        <Field label="Do You Have Any Pets?" error={errors.pets}>
          <select
            name="pets"
            value={formData.pets || ""}
            onChange={handleChange}
            className={`${inputClass} ${errors.pets ? errorClass : ''}`}
          >
            <option value="">Select</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </Field>

        <Field label="Your Language">
          <select
            name="language"
            value={formData.language || ""}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="">Select Language</option>
            {allLocales.map((locale) => (
              <option key={locale.tag} value={locale.tag}>
                {locale.name} ({locale.tag})
              </option>
            ))}
          </select>
        </Field>

        <Field label="Your Budget" error={errors.budget}>
          <input
            type="text"
            name="budget"
            value={formData.budget || ""}
            onChange={handleChange}
            className={`${inputClass} ${errors.budget ? errorClass : ''}`}
            placeholder="Total budget range for the flat"
          />
        </Field>

        <Field label="Budget Type" error={errors.budgetType}>
          <div className="flex gap-4">
            {TEAMUP_BUDGET_TYPES.map(type => (
              <label key={type} className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="budgetType"
                  value={type}
                  checked={formData.budgetType === type}
                  onChange={handleChange}
                />
                Per {type}
              </label>
            ))}
          </div>
        </Field>

        <Field label="Duration of Stay">
          <select
            name="period"
            value={formData.period || ""}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="">Select</option>
            {TEAMUP_PERIODS.map(period => (
              <option key={period} value={period}>{period}</option>
            ))}
          </select>
        </Field>

        <div className="md:col-span-2">
          <Field label="Interests" error={errors.amenities}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {TEAMUP_AMENITIES.map(amenity => (
                <label key={amenity} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="amenities"
                    value={amenity}
                    checked={formData.amenities?.includes(amenity) || false}
                    onChange={handleChange}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-700">{amenity}</span>
                </label>
              ))}
            </div>
          </Field>
        </div>

        <Field label="Age Range">
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Min"
              name="minAge"
              value={formData.minAge || ""}
              onChange={handleChange}
              className={`${inputClass} text-gray-500`}
            />
            <input
              type="text"
              placeholder="Max"
              name="maxAge"
              value={formData.maxAge || ""}
              onChange={handleChange}
              className={`${inputClass} text-gray-500`}
            />
          </div>
        </Field>

        <Field label="Occupation Type">
          <select
            name="occupationPreference"
            value={formData.occupationPreference || ""}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="">Select</option>
            {TEAMUP_OCCUPATION_PREFERENCES.map(occupation => (
              <option key={occupation} value={occupation}>{occupation}</option>
            ))}
          </select>
        </Field>

        <Field label="Smoking?" error={errors.smoke}>
          <select
            name="smoke"
            value={formData.smoke || ""}
            onChange={handleChange}
            className={`${inputClass} ${errors.smoke ? errorClass : ''}`}
          >
            <option value="">Select</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </Field>

        <Field label="Pets?" error={errors.petsPreference}>
          <select
            name="petsPreference"
            value={formData.petsPreference || ""}
            onChange={handleChange}
            className={`${inputClass} ${errors.petsPreference ? errorClass : ''}`}
          >
            <option value="">Select</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </Field>

        <div className="md:col-span-2">
          <Field label="Description" error={errors.description}>
            <textarea
              name="description"
              rows={4}
              value={formData.description || ""}
              onChange={handleChange}
              className={`${inputClass} resize-none ${errors.description ? errorClass : ''}`}
              placeholder="Please write about yourself..."
            />
          </Field>
        </div>

        <div className="md:col-span-2">
          <Field label="Buddy Up (additional description)">
            <textarea
              name="buddyDescription"
              rows={4}
              value={formData.buddyDescription || ""}
              onChange={handleChange}
              className={`${inputClass} resize-none`}
              placeholder="Enter your description..."
            />
          </Field>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <Field label="Upload Photos" error={errors.photos}>
          {renderPhotoPreview()}
          <input type="file" accept="image/*" multiple ref={fileInputRef} onChange={handlePhotoUpload} className="hidden" />
          <button type="button" onClick={() => fileInputRef.current?.click()} className="border px-3 py-2 rounded bg-white text-sm hover:bg-gray-100">
            + Add Photos
          </button>
        </Field>
      </div>
    </>
  );

  const renderFields = () => {
    switch (ad.postCategory) {
      case "Space":
        return renderSpaceFields();
      case "Spacewanted":
        return renderSpaceWantedFields();
      case "Teamup":
        return renderTeamUpFields();
      default:
        return <p>No editable fields for this post type.</p>;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-2xl shadow-xl w-[95%] max-w-6xl max-h-[94vh] overflow-y-auto relative p-3">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold"
        >
          ×
        </button>
        <h2 className="text-2xl font-semibold text-indigo-600 mb-4 text-center">
          Edit {ad.postCategory} Ad
        </h2>
        <form className="px-4" onSubmit={handleSubmit}>{renderFields()}</form>
        <div className="flex justify-end mt-4 mb-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-indigo-600 text-white px-4 py-2.5 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSubmit}
          >
            {isSubmitting ? "Updating..." : "Save Changes →"}
          </button>
        </div>
      </div>
    </div>
  );
}