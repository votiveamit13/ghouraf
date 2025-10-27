"use client";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Country, State, City } from "country-state-city";

const PROPERTY_TYPES = ["Room", "Apartment"];
const BUDGET_TYPES = ["Month", "Week"];
const GENDER_PREF = ["Any Gender", "Male", "Female"];
const BEDROOMS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const PERIODS = ["Month", "Week"];
const OCCUPATIONS = ["Student", "Professional"];

export default function EditPost({ show, onClose, ad, onUpdated }) {
  const [formData, setFormData] = useState({});
  const apiUrl = process.env.REACT_APP_API_URL;
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const fileInputRef = useRef(null);
  const featuredInputRef = useRef(null);

  useEffect(() => {
    if (ad) {
      const photos = (ad.photos || []).map((p) =>
        typeof p === "string" ? { url: p } : { ...p }
      );
      const featured = ad.featuredImage ? { url: ad.featuredImage } : null;
      setFormData({ ...ad, photos, featuredImageObj: featured });
    }
  }, [ad]);

  useEffect(() => setCountries(Country.getAllCountries()), []);

  useEffect(() => {
    if (formData.country) {
      const countryObj = countries.find(
        (c) => c.name === formData.country || c.isoCode === formData.country
      );
      if (countryObj) setStates(State.getStatesOfCountry(countryObj.isoCode));
      else setStates([]);
    } else setStates([]);
    setCities([]);
  }, [formData.country, countries]);

  useEffect(() => {
    if (formData.state && formData.country) {
      const countryObj = countries.find(
        (c) => c.name === formData.country || c.isoCode === formData.country
      );
      const stateObj = states.find(
        (s) => s.name === formData.state || s.isoCode === formData.state
      );
      if (countryObj && stateObj)
        setCities(City.getCitiesOfState(countryObj.isoCode, stateObj.isoCode));
      else setCities([]);
    } else setCities([]);
  }, [formData.state, formData.country, states, countries]);

  if (!show || !ad) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const removePhoto = (index) =>
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));

  const removeFeatured = () =>
    setFormData((prev) => ({
      ...prev,
      featuredImageObj: null,
      featuredImage: "",
    }));

  const onFilesSelected = (files) => {
    if (!files?.length) return;
    const newPhotos = Array.from(files).map((file) => ({
      file,
      url: URL.createObjectURL(file),
      isNew: true,
    }));
    setFormData((prev) => ({
      ...prev,
      photos: [...(prev.photos || []), ...newPhotos],
    }));
  };

  const onFeaturedSelected = (file) => {
    if (!file) return;
    const obj = { file, url: URL.createObjectURL(file), isNew: true };
    setFormData((prev) => ({ ...prev, featuredImageObj: obj }));
  };

  const triggerFileInput = () => fileInputRef.current?.click();
  const triggerFeaturedInput = () => featuredInputRef.current?.click();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const form = new FormData();

      Object.keys(formData).forEach((key) => {
        if (["photos", "featuredImageObj"].includes(key)) return;
        if (formData[key] != null) form.append(key, formData[key]);
      });

      if (formData.featuredImageObj?.file)
        form.append("featuredImage", formData.featuredImageObj.file);
      else if (formData.featuredImageObj?.url)
        form.append("featuredImage", formData.featuredImageObj.url);

      (formData.photos || []).forEach((p) => {
        if (p.file) form.append("photos", p.file);
        else if (p.url) form.append("existingPhotos", p.url);
      });

      await axios.put(`${apiUrl}my-ads/${ad._id}`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Ad updated successfully!");
      onUpdated?.();
      onClose?.();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update ad");
    }
  };

  /** ---------- Reusable UI Helpers ---------- */
  const Field = ({ label, children }) => (
    <div className="flex flex-col space-y-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {children}
    </div>
  );

  const inputClass =
    "border border-gray-300 rounded-lg p-2.5 w-full text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none";

  const renderLocationFields = () => (
    <>
      <Field label="Country">
        <select
          name="country"
          value={formData.country || ""}
          onChange={handleChange}
          className={inputClass}
        >
          <option value="">Select Country</option>
          {countries.map((c) => (
            <option key={c.isoCode} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
      </Field>
      <Field label="State">
        <select
          name="state"
          value={formData.state || ""}
          onChange={handleChange}
          className={inputClass}
        >
          <option value="">Select State</option>
          {states.map((s) => (
            <option key={s.isoCode} value={s.name}>
              {s.name}
            </option>
          ))}
        </select>
      </Field>
      <Field label="City">
        <select
          name="city"
          value={formData.city || ""}
          onChange={handleChange}
          className={inputClass}
        >
          <option value="">Select City</option>
          {cities.map((city) => (
            <option key={city.name} value={city.name}>
              {city.name}
            </option>
          ))}
        </select>
      </Field>
    </>
  );

  const renderPhotoPreview = () => {
    const photos = formData.photos || [];
    if (!photos.length) return null;
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
        {photos.map((p, i) => (
          <div key={i} className="relative group">
            <img
              src={p.url}
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

  /** ---------- SPACE FIELDS ---------- */
  const renderSpaceFields = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label="Title">
          <input name="title" value={formData.title || ""} onChange={handleChange} className={inputClass} />
        </Field>
        <Field label="Property Type">
          <select name="propertyType" value={formData.propertyType || ""} onChange={handleChange} className={inputClass}>
            <option value="">Select Type</option>
            {PROPERTY_TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </Field>
        <Field label="Budget">
          <input name="budget" value={formData.budget || ""} onChange={handleChange} className={inputClass} />
        </Field>
        <Field label="Budget Type">
          <select name="budgetType" value={formData.budgetType || ""} onChange={handleChange} className={inputClass}>
            <option value="">Select</option>
            {BUDGET_TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </Field>
        <Field label="Rooms Available For">
          <select name="roomsAvailableFor" value={formData.roomsAvailableFor || ""} onChange={handleChange} className={inputClass}>
            <option value="">Select</option>
            {GENDER_PREF.map((t) => <option key={t}>{t}</option>)}
          </select>
        </Field>
        <Field label="Bedrooms">
          <select name="bedrooms" value={formData.bedrooms || ""} onChange={handleChange} className={inputClass}>
            <option value="">Select</option>
            {BEDROOMS.map((b) => <option key={b}>{b}</option>)}
          </select>
        </Field>
        {renderLocationFields()}
        <Field label="Description">
          <textarea name="description" rows={4} value={formData.description || ""} onChange={handleChange} className={`${inputClass} resize-none`} />
        </Field>
      </div>

      <div className="mt-6 space-y-4">
        <Field label="Featured Image">
          <div className="flex items-center gap-4">
            {formData.featuredImageObj ? (
              <div className="relative">
                <img src={formData.featuredImageObj.url} className="w-48 h-32 object-cover rounded-md border" alt="featured" />
                <button type="button" onClick={removeFeatured} className="absolute top-1 right-1 bg-black/60 text-white rounded-full px-2 py-1 text-sm">✕</button>
              </div>
            ) : (
              <div className="w-48 h-32 bg-gray-100 flex items-center justify-center rounded-md">
                <span className="text-sm text-gray-500">No image</span>
              </div>
            )}
            <div>
              <input type="file" accept="image/*" ref={featuredInputRef} onChange={(e) => onFeaturedSelected(e.target.files?.[0])} className="hidden" />
              <button type="button" onClick={triggerFeaturedInput} className="border px-3 py-2 rounded bg-white text-sm hover:bg-gray-100">
                {formData.featuredImageObj ? "Replace" : "Upload Featured"}
              </button>
            </div>
          </div>
        </Field>

        <Field label="Gallery Photos">
          {renderPhotoPreview()}
          <input type="file" accept="image/*" multiple ref={fileInputRef} onChange={(e) => onFilesSelected(e.target.files)} className="hidden" />
          <button type="button" onClick={triggerFileInput} className="border px-3 py-2 rounded bg-white text-sm hover:bg-gray-100">
            + Add Photos
          </button>
        </Field>
      </div>
    </>
  );

  /** ---------- SPACE WANTED ---------- */
  const renderSpaceWantedFields = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label="Title"><input name="title" value={formData.title || ""} onChange={handleChange} className={inputClass} /></Field>
        <Field label="Property Type"><select name="propertyType" value={formData.propertyType || ""} onChange={handleChange} className={inputClass}>{PROPERTY_TYPES.map((t) => <option key={t}>{t}</option>)}</select></Field>
        <Field label="Budget"><input name="budget" value={formData.budget || ""} onChange={handleChange} className={inputClass} /></Field>
        <Field label="Budget Type"><select name="budgetType" value={formData.budgetType || ""} onChange={handleChange} className={inputClass}>{BUDGET_TYPES.map((t) => <option key={t}>{t}</option>)}</select></Field>
        <Field label="Period"><select name="period" value={formData.period || ""} onChange={handleChange} className={inputClass}>{PERIODS.map((t) => <option key={t}>{t}</option>)}</select></Field>
        <Field label="Name"><input name="name" value={formData.name || ""} onChange={handleChange} className={inputClass} /></Field>
        <Field label="Age"><input type="number" name="age" value={formData.age || ""} onChange={handleChange} className={inputClass} /></Field>
        <Field label="Gender"><select name="gender" value={formData.gender || ""} onChange={handleChange} className={inputClass}>{GENDER_PREF.map((t) => <option key={t}>{t}</option>)}</select></Field>
        <Field label="Occupation"><select name="occupation" value={formData.occupation || ""} onChange={handleChange} className={inputClass}>{OCCUPATIONS.map((t) => <option key={t}>{t}</option>)}</select></Field>
        {renderLocationFields()}
        <Field label="Description">
          <textarea name="description" rows={4} value={formData.description || ""} onChange={handleChange} className={`${inputClass} resize-none`} />
        </Field>
      </div>
      <div className="mt-6 space-y-4">
        <Field label="Gallery Photos">
          {renderPhotoPreview()}
          <input type="file" accept="image/*" multiple ref={fileInputRef} onChange={(e) => onFilesSelected(e.target.files)} className="hidden" />
          <button type="button" onClick={triggerFileInput} className="border px-3 py-2 rounded bg-white text-sm hover:bg-gray-100">
            + Add Photos
          </button>
        </Field>
      </div>
    </>
  );

  /** ---------- TEAM UP ---------- */
  const renderTeamUpFields = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label="Title"><input name="title" value={formData.title || ""} onChange={handleChange} className={inputClass} /></Field>
        <Field label="First Name"><input name="firstName" value={formData.firstName || ""} onChange={handleChange} className={inputClass} /></Field>
        <Field label="Last Name"><input name="lastName" value={formData.lastName || ""} onChange={handleChange} className={inputClass} /></Field>
        <Field label="Budget"><input name="budget" value={formData.budget || ""} onChange={handleChange} className={inputClass} /></Field>
        <Field label="Budget Type"><select name="budgetType" value={formData.budgetType || ""} onChange={handleChange} className={inputClass}>{BUDGET_TYPES.map((t) => <option key={t}>{t}</option>)}</select></Field>
        <Field label="Gender"><select name="gender" value={formData.gender || ""} onChange={handleChange} className={inputClass}>{GENDER_PREF.map((t) => <option key={t}>{t}</option>)}</select></Field>
        <Field label="Occupation"><select name="occupation" value={formData.occupation || ""} onChange={handleChange} className={inputClass}>{OCCUPATIONS.map((t) => <option key={t}>{t}</option>)}</select></Field>
        {renderLocationFields()}
        <Field label="Min Age"><input type="number" name="minAge" value={formData.minAge || ""} onChange={handleChange} className={inputClass} /></Field>
        <Field label="Max Age"><input type="number" name="maxAge" value={formData.maxAge || ""} onChange={handleChange} className={inputClass} /></Field>
        <Field label="Language"><input name="language" value={formData.language || ""} onChange={handleChange} className={inputClass} /></Field>
        <Field label="Roommate Preference"><select name="roommatePref" value={formData.roommatePref || ""} onChange={handleChange} className={inputClass}>{GENDER_PREF.map((t) => <option key={t}>{t}</option>)}</select></Field>
        <Field label="Description">
          <textarea name="description" rows={4} value={formData.description || ""} onChange={handleChange} className={`${inputClass} resize-none`} />
        </Field>
        <Field label="Buddy Description">
          <textarea name="buddyDescription" rows={4} value={formData.buddyDescription || ""} onChange={handleChange} className={`${inputClass} resize-none`} />
        </Field>
      </div>
      <div className="mt-6 space-y-4">
        <Field label="Gallery Photos">
          {renderPhotoPreview()}
          <input type="file" accept="image/*" multiple ref={fileInputRef} onChange={(e) => onFilesSelected(e.target.files)} className="hidden" />
          <button type="button" onClick={triggerFileInput} className="border px-3 py-2 rounded bg-white text-sm hover:bg-gray-100">
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
            className="bg-indigo-600 text-white px-4 py-2.5 rounded-lg hover:bg-indigo-700"
            onClick={handleSubmit}
          >
            Save Changes →
          </button>
        </div>
      </div>
    </div>
  );
}
