import { useState } from "react";
import { MdOutlineLayers } from "react-icons/md";
import { FiLayers, FiPlusCircle } from "react-icons/fi";
import { PiRocket } from "react-icons/pi";
import { FiCheck } from "react-icons/fi";
import heroImage from "assets/img/ghouraf/hero-section.jpg";
import { FaArrowRightLong } from "react-icons/fa6";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

function StepHeader({ step }) {
  const steps = [
    { id: 1, title: "Steps 01", subtitle: "Ads Information", icon: MdOutlineLayers },
    { id: 2, title: "Steps 02", subtitle: "Description, Features & Images", icon: FiLayers },
    { id: 3, title: "Steps 03", subtitle: "Post Ads", icon: PiRocket },
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

export default function PostSpace() {
  const [step, setStep] = useState(1);
  const next = () => setStep((s) => Math.min(3, s + 1));
  const prev = () => setStep((s) => Math.max(1, s - 1));
  const [photos, setPhotos] = useState([]);
  const [featured, setFeatured] = useState(null);
  const [phone, setPhone] = useState("");
  const [backupPhone, setBackupPhone] = useState("");

  const handleFeaturedUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFeatured(URL.createObjectURL(file));
    }
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    const newPhotos = files.map((file) => ({
      id: Math.random(),
      url: URL.createObjectURL(file),
    }));
    setPhotos((prev) => [...prev, ...newPhotos]);
  };

  const removePhoto = (id) => {
    setPhotos((prev) => prev.filter((photo) => photo.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div
        className="py-5 text-white text-center text-2xl font-semibold"
        style={{
          backgroundImage: `linear-gradient(90deg, #565ABF, #A321A6), url(${heroImage})`,
          backgroundBlendMode: "overlay",
          backgroundSize: "cover",
        }}
      >
        Post A Space
      </div>

      <div className="max-w-4xl w-full mx-auto mt-6 mb-16">
        <StepHeader step={step} />

        <div className="bg-white rounded-b-2xl shadow-sm border border-t-0 border-slate-200 p-4">
          {step === 1 && (
            <>
              <div className="row g-4">
                <div className="col-md-6 mb-2">
                  <label className="form-label text-black">Title</label>
                  <input type="text" className="form-control" placeholder="Ad name" />
                </div>

                <div className="col-md-6 mb-2">
                  <label className="form-label text-black">Property Type</label>
                  <select className="form-control">
                    <option>Flatshare</option>
                    <option>Apartment</option>
                  </select>
                </div>

                <div className="col-md-6 mb-2">
                  <label className="form-label text-black">Budget</label>
                  <input type="number" className="form-control" placeholder="Enter your budget" />
                </div>

                <div className="col-md-6 mb-2">
                  <label className="form-label text-black">Personal Info</label>
                  <select className="form-control">
                    <option>Landlord</option>
                    <option>Agent</option>
                  </select>
                </div>

                <div className="col-md-6 mb-2">
                  <label className="form-label text-black">Size of Apartment</label>
                  <input type="text" className="form-control" placeholder="Sq ft" />
                </div>

                <div className="col-md-6 mb-2">
                  <label className="form-label text-black">Furnishing</label>
                  <input type="text" className="form-control" placeholder="Furnished" />
                </div>

                <div className="col-md-6 mb-2">
                  <label className="form-label text-black">Smoking</label>
                  <select className="form-control">
                    <option>Allowed</option>
                    <option>Not Allowed</option>
                  </select>
                </div>

                <div className="col-md-6 mb-2">
                  <label className="form-label text-black">Rooms available for</label>
                  <input type="text" className="form-control" placeholder="Any" />
                </div>

                <div className="col-md-6 mb-2">
                  <label className="form-label text-black">Number of bedrooms</label>
                  <input type="text" className="form-control" placeholder="Any" />
                </div>

                <div className="col-md-6 mb-2">
                  <label className="form-label text-black">Country</label>
                  <select className="form-control">
                    <option>Select...</option>
                  </select>
                </div>

                <div className="col-md-6 mb-2">
                  <label className="form-label text-black">City</label>
                  <select className="form-control">
                    <option>Select...</option>
                  </select>
                </div>

                <div className="col-md-6 mb-2">
                  <label className="form-label text-black">State</label>
                  <select className="form-control">
                    <option>Select...</option>
                  </select>
                </div>

                <div className="col-md-12">
                  <label className="form-label text-black">Location</label>
                  <input type="text" className="form-control" placeholder="Your Location" />
                </div>
              </div>
            </>

          )}

          {step === 2 && (
            <div className="mb-5">
              <div className="mb-4">
                <label className="form-label text-black">Description</label>
                <textarea
                  className="form-control"
                  placeholder="Ad description"
                  rows={4}
                />
              </div>

              <div className="mb-4">
                <label className="form-label text-black">Amenities</label>
                <div className="d-flex flex-wrap gap-3">
                  {[
                    "Fully Furnished",
                    "High-Speed Wi-Fi",
                    "Air Conditioning & Heating",
                    "In-unit Washing Machine",
                    "24/7 Security & Doorman",
                    "Parking",
                    "Living room",
                  ].map((item) => (
                    <div key={item} className="d-flex align-items-center gap-2">
                      <span className="text-[#198754] text-[22px]">✔</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
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
                        src={featured}
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
                      onClick={() => document.getElementById("photosInput").click()}
                    >
                      <span><FiPlusCircle size={20} /></span>
                    </div>
                  )}
                </div>

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
                  {photos.map((photo) => (
                    <div
                      key={photo.id}
                      className="position-relative m-2"
                      style={{
                        width: "100px",
                        height: "100px",
                        overflow: "hidden",
                        borderRadius: "8px",
                      }}
                    >
                      <img
                        src={photo.url}
                        alt="Preview"
                        className="img-fluid w-100 h-100"
                        style={{ objectFit: "cover" }}
                      />
                      <button
                        type="button"
                        className="btn btn-sm btn-danger position-absolute top-0 end-0"
                        onClick={() => removePhoto(photo.id)}
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
            <div className="row g-4">
              <div className="col-md-6 mb-2">
                <label className="form-label text-black">Phone Number</label>
                <PhoneInput
                  country={"us"}
                  value={phone}
                  onChange={setPhone}
                  inputClass="!w-full !h-[46px] !text-base !border form-control"
                  containerClass="!w-full"
                />
              </div>

              <div className="col-md-6 mb-2">
                <label className="form-label text-black">
                  Backup Phone Number <span className="text-muted">(Optional)</span>
                </label>
                <PhoneInput
                  country={"us"}
                  value={backupPhone}
                  onChange={setBackupPhone}
                  inputClass="!w-full !h-[46px] !text-base !border form-control"
                  containerClass="!w-full"
                />
              </div>

              <div className="col-md-6 mb-2">
                <label className="form-label text-black">Email Address</label>
                <input
                  type="email"
                  placeholder="Email address"
                  className="form-control"
                />
              </div>

              <div className="col-md-6 mb-2">
                <label className="form-label text-black">
                  Website Link <span className="text-muted">(Optional)</span>
                </label>
                <input
                  type="url"
                  placeholder="your website url"
                  className="form-control"
                />
              </div>

              <div className="col-md-6 mb-2">
                <label className="form-label text-black">Country</label>
                <select className="form-control">
                  <option>Select...</option>
                  <option>USA</option>
                  <option>India</option>
                </select>
              </div>

              <div className="col-md-3 mb-2">
                <label className="form-label text-black">City</label>
                <select className="form-control">
                  <option>Select...</option>
                </select>
              </div>

              <div className="col-md-3 mb-2">
                <label className="form-label text-black">
                  State <span className="text-muted">(Optional)</span>
                </label>
                <select className="form-control">
                  <option>Select...</option>
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label text-black">Location</label>
                <input
                  type="text"
                  placeholder="Your location"
                  className="form-control"
                />
              </div>

              <div className="col-md-6">
                <label className="form-label text-black">
                  Map Location <span className="text-muted">(Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="Map location"
                  className="form-control"
                />
              </div>
            </div>
          )}

          <div className="mt-6">
            {step === 3 ? (
              <div className="d-flex justify-content-between align-items-center">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="saveContactInfo"
                  />
                  <label
                    className="form-check-label text-muted"
                    htmlFor="saveContactInfo"
                  >
                    Save my contact information for faster posting
                  </label>
                </div>

                <div className="d-flex gap-3">
                  <button
                    onClick={prev}
                    className="px-4 py-2 rounded-[6px] border border-slate-200 text-slate-600"
                  >
                    Previous
                  </button>
                  <button className="px-4 py-3 rounded-[6px] bg-[#565ABF] text-white hover:opacity-95 flex items-center gap-2 font-semibold">
                    Preview & Publish <FaArrowRightLong />
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
          </div>

        </div>
      </div>
    </div>
  );
}
