import { useState } from "react";
import Header from "components/admin/Headers/Header";
import { Room_Numbers } from "constants/roomNumbers";
import { RoomSize } from "constants/roomSize";
import { PropertyType } from "constants/propertyType";
import { Numbers } from "constants/numbers";

export default function CreatePost() {
  const [postType, setPostType] = useState("");
  const [formData, setFormData] = useState({
    city: "",
    state: "",
    zip: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      postType,
    };

    console.log("Submitting:", payload);
  };

  const renderFormFields = () => {
    switch (postType) {
      case "Rooms for Rent":
        return (
          <>
            <div className="flex justify-between w-full px-3 gap-5">
              <div className="w-full">
                <label className="block text-xs font-bold mb-2">I have</label>
                <select className="w-full border rounded-[12px] py-[15px] px-3 mb-3">
                  {Room_Numbers.map((number) => (
                    <option key={number.value} value={number.value}>
                      {number.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-full">
                <label className="block text-xs font-bold mb-2">
                  Room Size
                </label>
                <select className="w-full border rounded-[12px] py-[15px] px-3 mb-3">
                  {RoomSize.map((size) => (
                    <option key={size.value} value={size.value}>
                      {size.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-full">
                <label className="block text-xs font-bold mb-2">
                  Property Type
                </label>
                <select className="w-full border rounded-[12px] py-[15px] px-3 mb-3">
                  .<option>Select property type</option>
                  {PropertyType.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-between w-full px-3 py-3 gap-5">
              <div className="w-full">
                <label className="block text-xs font-bold mb-2">
                  There are already(Occupants)
                </label>
                <select className="w-full border rounded-[12px] py-[15px] px-3 mb-3">
                  {Numbers.map((number) => (
                    <option key={number.value} value={number.value}>
                      {number.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-full">
                <label className="block text-xs font-bold mb-2">
                  Address of property(Street)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 247 East 14th Street"
                  className="w-full border rounded-[12px] py-[12px] px-3 mb-3"
                />
              </div>
              <div className="w-full">
                <label className="block text-xs font-bold mb-2">Area</label>
                <input
                  type="text"
                  placeholder="Enter area name"
                  className="w-full border rounded-[12px] py-[12px] px-3 mb-3"
                />
              </div>
            </div>
            <div className="flex justify-between w-full px-3 py-3 gap-5">
              <div className="w-1/2">
                <label className="block text-xs font-bold mb-2">ZIP Code</label>
                <input
                  type="text"
                  placeholder="e.g. 10001"
                  className="w-full border rounded-[12px] py-[12px] px-3 mb-3"
                />
              </div>
              <div className="flex w-full px-3 gap-12">
                <label className="block text-xs font-bold mb-2">
                  Living Room?
                </label>
                <div>
                  <div class="flex align-center">
                    <input
                      id="default-yes"
                      type="radio"
                      value=""
                      name="default-radio-living"
                      className="w-4 h-4 text-blue-600 bg-gray-100"
                    />
                    <label
                      for="default-yes"
                      className="ms-2 text-sm font-medium"
                    >
                      Yes, there is a shared living room
                    </label>
                  </div>
                  <div class="flex align-center">
                    <input
                      checked
                      id="default-no"
                      type="radio"
                      value=""
                      name="default-radio-living"
                      className="w-4 h-4 text-blue-600 bg-gray-100 "
                    />
                    <label
                      for="default-no"
                      className="ms-2 text-sm font-medium"
                    >
                      No
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-between w-full px-3 py-3 gap-5">
              <div className="flex w-1/2 gap-8">
                <label className="block text-xs font-bold mb-2">
                  Amenities
                </label>
                <div>
                  <div class="flex align-center">
                    <input
                      id="default-checkbox"
                      type="checkbox"
                      value=""
                      class="w-4 h-4 text-blue-600 bg-gray-100"
                    />
                    <label
                      for="default-checkbox"
                      class="ms-2 text-sm font-medium"
                    >
                      Parking
                    </label>
                  </div>
                  <div class="flex align-center">
                    <input
                      id="checked-checkbox"
                      type="checkbox"
                      value=""
                      class="w-4 h-4 text-blue-600 bg-gray-100"
                    />
                    <label
                      for="checked-checkbox"
                      class="ms-2 text-sm font-medium"
                    >
                      Balcony/roof terrace
                    </label>
                  </div>
                  <div class="flex align-center">
                    <input
                      id="default-checkbox"
                      type="checkbox"
                      value=""
                      class="w-4 h-4 text-blue-600 bg-gray-100"
                    />
                    <label
                      for="default-checkbox"
                      class="ms-2 text-sm font-medium"
                    >
                      Yard/patio
                    </label>
                  </div>
                  <div class="flex align-center">
                    <input
                      id="default-checkbox"
                      type="checkbox"
                      value=""
                      class="w-4 h-4 text-blue-600 bg-gray-100"
                    />
                    <label
                      for="default-checkbox"
                      class="ms-2 text-sm font-medium"
                    >
                      Disabled access
                    </label>
                  </div>
                  <div class="flex align-center">
                    <input
                      id="default-checkbox"
                      type="checkbox"
                      value=""
                      class="w-4 h-4 text-blue-600 bg-gray-100"
                    />
                    <label
                      for="default-checkbox"
                      class="ms-2 text-sm font-medium"
                    >
                      Garage
                    </label>
                  </div>
                </div>
              </div>
              <div className="flex w-full px-3 gap-8">
                <label className="block text-xs font-bold mb-2">I am a</label>
                <div>
                  <div class="flex align-center">
                    <input
                      id="default-redident"
                      type="radio"
                      value=""
                      name="default-radio-iam"
                      className="w-4 h-4 text-blue-600 bg-gray-100"
                    />
                    <label
                      for="default-redident"
                      className="ms-2 text-sm font-medium"
                    >
                      Resident Landlord
                    </label>
                    <span className="ms-2 text-sm font-medium text-gray-400">
                      (I own the property and live there)
                    </span>
                  </div>
                  <div class="flex align-center">
                    <input
                      checked
                      id="default-liveout"
                      type="radio"
                      value=""
                      name="default-radio-iam"
                      className="w-4 h-4 text-blue-600 bg-gray-100 "
                    />
                    <label
                      for="default-liveout"
                      className="ms-2 text-sm font-medium"
                    >
                      Live out landlord
                    </label>
                    <span className="ms-2 text-sm font-medium text-gray-400">
                      (I own the property but don't live there)
                    </span>
                  </div>
                  <div class="flex align-center">
                    <input
                      id="default-tenant"
                      type="radio"
                      value=""
                      name="default-radio-iam"
                      className="w-4 h-4 text-blue-600 bg-gray-100"
                    />
                    <label
                      for="default-tenant"
                      className="ms-2 text-sm font-medium"
                    >
                      Current tenant/roommate{" "}
                    </label>
                    <span className="ms-2 text-sm font-medium text-gray-400">
                      (I am living in the property)
                    </span>
                  </div>
                  <div class="flex align-center">
                    <input
                      checked
                      id="default-agent"
                      type="radio"
                      value=""
                      name="default-radio-iam"
                      className="w-4 h-4 text-blue-600 bg-gray-100 "
                    />
                    <label
                      for="default-agent"
                      className="ms-2 text-sm font-medium"
                    >
                      Real Estate Agent or Broker
                    </label>
                    <span className="ms-2 text-sm font-medium text-gray-400">
                      (I am advertising on a landlord's behalf)
                    </span>
                  </div>
                  <div class="flex align-center">
                    <input
                      checked
                      id="default-former"
                      type="radio"
                      value=""
                      name="default-radio-iam"
                      className="w-4 h-4 text-blue-600 bg-gray-100 "
                    />
                    <label
                      for="default-former"
                      className="ms-2 text-sm font-medium"
                    >
                      Former roommate{" "}
                    </label>
                    <span className="ms-2 text-sm font-medium text-gray-400">
                      (I am moving out and need someone to replace me)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </>
        );

      case "looking for a room":
        return (
          <>
            <div className="w-full md:w-1/2 px-3 mb-6">
              <label className="block text-xs font-bold mb-2">Bedrooms</label>
              <input
                name="bedrooms"
                onChange={handleChange}
                className="w-full border rounded-[12px] py-[15px] px-3 mb-3"
                placeholder="Number of bedrooms"
              />
            </div>
            <div className="w-full md:w-1/2 px-3 mb-6">
              <label className="block text-xs font-bold mb-2">Bathrooms</label>
              <input
                name="bathrooms"
                onChange={handleChange}
                className="w-full border rounded-[12px] py-[15px] px-3 mb-3"
                placeholder="Number of bathrooms"
              />
            </div>
          </>
        );

      case "team up":
        return (
          <>
            <div className="w-full md:w-1/2 px-3 mb-6">
              <label className="block text-xs font-bold mb-2">
                Budget Range
              </label>
              <input
                name="budget"
                onChange={handleChange}
                className="w-full border rounded-[12px] py-[15px] px-3 mb-3"
                placeholder="Enter budget"
              />
            </div>
            <div className="w-full md:w-1/2 px-3 mb-6">
              <label className="block text-xs font-bold mb-2">
                Preferred Location
              </label>
              <input
                name="preferredLocation"
                onChange={handleChange}
                className="w-full border rounded-[12px] py-[15px] px-3 mb-3"
                placeholder="Enter preferred location"
              />
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Header />
      <div className="px-[40px] mt-[-8%] w-full position-relative">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-3 py-3 border-b border-gray-200 d-flex justify-between">
            <h3 className="text-lg font-semibold text-gray-800">Create Post</h3>
          </div>
          <form className="w-full" onSubmit={handleSubmit}>
            <div className="flex justify-between w-full px-3 py-3 gap-5">
              <div className="w-full">
                <label className="block text-xs font-bold mb-2">
                  Select Post Type
                </label>
                <select
                  value={postType}
                  onChange={(e) => setPostType(e.target.value)}
                  className="w-full border rounded-[12px] py-[15px] px-3 mb-2"
                >
                  <option value="">Select post type</option>
                  <option value="Rooms for Rent">Offering a Room/Apartment</option>
                  <option value="looking for a room">
                    Looking for a Room
                  </option>
                  <option value="team up">Team Up to Find a Place Together</option>
                </select>
              </div>
            </div>

            <div className="flex flex-wrap -mx-3 px-3">
              {renderFormFields()}
            </div>

            <div className="px-3 py-3">
              <button
                type="submit"
                className="bg-blue-600 text-white px-5 py-2 rounded-lg"
              >
                Submit Post
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
