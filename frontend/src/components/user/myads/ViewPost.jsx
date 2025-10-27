import PhotoSlider from "components/common/Slider";

export default function ViewPost({ show, onClose, ad }) {
  if (!show || !ad) return null;

  const renderField = (label, value) => {
    if (!value && value !== 0) return null;
    return (
      <tr className="border-b border-gray-200">
        <th className="text-left py-2 pr-4 font-semibold text-gray-700 whitespace-nowrap w-[35%]">
          {label}
        </th>
        <td className="py-2 text-gray-800">{String(value)}</td>
      </tr>
    );
  };

  const renderContent = () => {
    switch (ad.postCategory) {
      case "Space":
        return (
          <table className="w-full border-collapse">
            <tbody>
              {renderField("Property Type", ad.propertyType)}
              {renderField("Budget", `$${ad.budget} / ${ad.budgetType}`)}
              {renderField("Personal Info", ad.personalInfo)}
              {renderField("Size", ad.size)}
              {renderField("Furnishing", ad.furnishing ? "Yes" : "No")}
              {renderField("Smoking", ad.smoking ? "Yes" : "No")}
              {renderField("Rooms Available For", ad.roomsAvailableFor)}
              {renderField("Bedrooms", ad.bedrooms)}
              {renderField("Country", ad.country)}
              {renderField("State", ad.state)}
              {renderField("City", ad.city)}
              {renderField("Location", ad.location)}
              {renderField("Description", ad.description)}
              {renderField("Amenities", ad.amenities?.join(", "))}
              {renderField("Status", ad.available ? "Available" : "Unavailable")}
            </tbody>
          </table>
        );

      case "Spacewanted":
        return (
          <table className="w-full border-collapse">
            <tbody>
              {renderField("Property Type", ad.propertyType)}
              {renderField("Room Size", ad.roomSize)}
              {renderField("Budget", `$${ad.budget} / ${ad.budgetType}`)}
              {renderField(
                "Move-in Date",
                ad.moveInDate
                  ? new Date(ad.moveInDate).toLocaleDateString()
                  : ""
              )}
              {renderField("Period", ad.period)}
              {renderField("Name", ad.name)}
              {renderField("Age", ad.age)}
              {renderField("Gender", ad.gender)}
              {renderField("Occupation", ad.occupation)}
              {renderField("Roommate Preference", ad.roommatePref)}
              {renderField("Description", ad.description)}
              {renderField("Amenities", ad.amenities?.join(", "))}
              {renderField("Status", ad.available ? "Available" : "Unavailable")}
            </tbody>
          </table>
        );

      case "Teamup":
        return (
          <table className="w-full border-collapse">
            <tbody>
              {renderField("Budget", `$${ad.budget} / ${ad.budgetType}`)}
              {renderField("Name", `${ad.firstName} ${ad.lastName}`)}
              {renderField("Gender", ad.gender)}
              {renderField("Occupation", ad.occupation)}
              {renderField("Preferred Roommate", ad.roommatePref)}
              {renderField("Smoking", ad.smoke ? "Yes" : "No")}
              {renderField("Pets", ad.pets ? "Yes" : "No")}
              {renderField("Language", ad.language)}
              {renderField("Description", ad.description)}
              {renderField("Buddy Description", ad.buddyDescription)}
              {renderField("Amenities", ad.amenities?.join(", "))}
              {renderField("Status", ad.available ? "Available" : "Unavailable")}
            </tbody>
          </table>
        );

      default:
        return <p className="text-gray-500">No details available.</p>;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-2xl shadow-xl w-[90%] max-w-4xl max-h-[90vh] overflow-y-auto relative p-4">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-xl font-semibold text-gray-800">{ad.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <PhotoSlider featuredImage={ad.featuredImage} photos={ad.photos} />
          </div>

          <div className="text-sm sm:text-base">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
}