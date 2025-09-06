import { useState } from "react";
import { TfiLayers } from "react-icons/tfi"; // step 1 & 2 icons
import { TbRocket } from "react-icons/tb"; // step 3 icon
import { FiCheck } from "react-icons/fi"; // check for completed
import heroImage from "assets/img/ghouraf/hero-section.jpg";

/* ---------- Step Header (exact UI) ---------- */
function StepHeader({ step }) {
  const steps = [
    { id: 1, title: "Steps 01", subtitle: "Ads Information", icon: TfiLayers },
    { id: 2, title: "Steps 02", subtitle: "Description, Features & Images", icon: TfiLayers },
    { id: 3, title: "Steps 03", subtitle: "Post Ads", icon: TbRocket },
  ];

  return (
    <div className="relative rounded-t-2xl border border-slate-200 bg-white">
      <div className="flex items-center px-6 py-4">
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

      {/* underline bar */}
      <div
        className="absolute bottom-0 h-[3px] bg-[#A321A6] rounded-full transition-all duration-300"
        style={{
          left: `${(step - 1) * (100 / steps.length)}%`,
          width: `${100 / steps.length}%`,
        }}
      />
    </div>
  );
}


/* ---------- Full Page ---------- */
export default function PostSpace() {
  const [step, setStep] = useState(1);
  const next = () => setStep((s) => Math.min(3, s + 1));
  const prev = () => setStep((s) => Math.max(1, s - 1));

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Hero */}
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

      {/* Card */}
      <div className="max-w-4xl w-full mx-auto mt-8 mb-16">
        <StepHeader step={step} />

        <div className="bg-white rounded-b-2xl shadow-sm border border-t-0 border-slate-200 p-8">
          {/* Step 1 */}
          {step === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <input
                type="text"
                placeholder="Ad Name"
                className="border rounded-lg p-3"
              />
              <select className="border rounded-lg p-3">
                <option>Flatshare</option>
                <option>Apartment</option>
              </select>
              <input
                type="number"
                placeholder="Enter your budget"
                className="border rounded-lg p-3"
              />
              <select className="border rounded-lg p-3">
                <option>Landlord</option>
                <option>Agent</option>
              </select>
              <input
                type="text"
                placeholder="Size of Apartment"
                className="border rounded-lg p-3"
              />
              <input
                type="text"
                placeholder="Furnishing"
                className="border rounded-lg p-3"
              />
              <input
                type="text"
                placeholder="Smoking"
                className="border rounded-lg p-3"
              />
              <input
                type="text"
                placeholder="Rooms available for"
                className="border rounded-lg p-3"
              />
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div>
              <textarea
                placeholder="Ad description"
                className="w-full border rounded-lg p-3"
                rows={4}
              />
              <div className="mt-6">
                <h3 className="text-sm font-medium mb-2">Amenities</h3>
                <div className="flex flex-wrap gap-3">
                  {[
                    "Fully Furnished",
                    "High-Speed Wi-Fi",
                    "Air Conditioning",
                    "Parking",
                  ].map((item) => (
                    <label
                      key={item}
                      className="flex items-center gap-2 border rounded-lg px-3 py-2 cursor-pointer"
                    >
                      <input type="checkbox" />
                      <span>{item}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="mt-6">
                <h3 className="text-sm font-medium mb-2">Upload Photos</h3>
                <input type="file" multiple className="block" />
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <input
                type="text"
                placeholder="Phone number"
                className="border rounded-lg p-3"
              />
              <input
                type="email"
                placeholder="Email address"
                className="border rounded-lg p-3"
              />
              <input
                type="text"
                placeholder="City"
                className="border rounded-lg p-3"
              />
              <input
                type="text"
                placeholder="Location"
                className="border rounded-lg p-3"
              />
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            {step > 1 ? (
              <button
                onClick={prev}
                className="px-5 py-2 rounded-lg border border-slate-200 text-slate-600"
              >
                Previous
              </button>
            ) : (
              <span />
            )}

            {step < 3 ? (
              <button
                onClick={next}
                className="px-6 py-2 rounded-lg bg-[#6E2BBE] text-white hover:opacity-95"
              >
                Next Steps →
              </button>
            ) : (
              <button className="px-6 py-2 rounded-lg bg-[#6E2BBE] text-white hover:opacity-95">
                Preview & Publish
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
