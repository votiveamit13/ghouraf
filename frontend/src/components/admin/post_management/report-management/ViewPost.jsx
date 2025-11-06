import React from "react";

export default function ViewPostModal({ show, report, onClose }) {
  if (!show || !report?.postId) return null;

  const post = report.postId;
  const postType = report.postType;

  const renderField = (label, value) => (
    <p><strong>{label}:</strong> {value ?? "N/A"}</p>
  );

  const renderSpace = () => (
    <>
      {renderField("Title", post.title)}
      {renderField("Property Type", post.propertyType)}
      {renderField("Budget", `$${post.budget} ${post.budgetType}`)}
      {renderField("Location", `${post.city}, ${post.state}, ${post.country}`)}
      {renderField("Rooms Available For", post.roomsAvailableFor)}
      {renderField("Bedrooms", post.bedrooms)}
      {renderField("Description", post.description)}
      {renderField("Amenities", post.amenities?.join(", "))}
      {renderField("Status", post.status)}
      {renderField("Available", post.available ? "Yes" : "No")}
    </>
  );

  const renderSpaceWanted = () => (
    <>
      {renderField("Title", post.title)}
      {renderField("Property Type", post.propertyType)}
      {renderField("Budget", `$${post.budget} ${post.budgetType}`)}
      {renderField("Location", `${post.city}, ${post.state}, ${post.country}`)}
      {renderField("Room Size", post.roomSize)}
      {renderField("Move In Date", post.moveInDate || "N/A")}
      {renderField("Period", post.period)}
      {renderField("Description", post.description)}
      {renderField("Occupation", post.occupation)}
      {renderField("Gender", post.gender)}
      {renderField("Status", post.status)}
      {renderField("Available", post.available ? "Yes" : "No")}
    </>
  );

  const renderTeamUp = () => (
    <>
      {renderField("Title", post.title)}
      {renderField("Budget", `$${post.budget} ${post.budgetType}`)}
      {renderField("Location", `${post.city}, ${post.state}, ${post.country}`)}
      {renderField("Age Range", `${post.minAge || "?"} - ${post.maxAge || "?"}`)}
      {renderField("Occupation Preference", post.occupationPreference)}
      {renderField("Description", post.description)}
      {renderField("Buddy Description", post.buddyDescription)}
      {renderField("Smokes", post.smoke ? "Yes" : "No")}
      {renderField("Pets", post.pets ? "Yes" : "No")}
      {renderField("Status", post.status)}
      {renderField("Available", post.available ? "Yes" : "No")}
    </>
  );

  const renderPostDetails = () => {
    switch (postType) {
      case "Space":
        return renderSpace();
      case "SpaceWanted":
        return renderSpaceWanted();
      case "TeamUp":
        return renderTeamUp();
      default:
        return <p>Unknown post type.</p>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-[650px] max-h-[90vh] rounded-lg shadow-2xl overflow-hidden flex flex-col">
        <div className="flex justify-between items-center px-4 py-3 border-b bg-gray-100">
          <h2 className="text-lg font-bold text-gray-800">Post Details</h2>
          <button
            className="text-gray-500 hover:text-gray-700 text-xl"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-3 text-sm space-y-2">
          {renderPostDetails()}
          {post.photos?.length > 0 && (
            <div className="mt-3">
              <strong>Photos:</strong>
              <div className="flex flex-wrap gap-2 mt-2">
                {post.photos.map((photo, i) => (
                  <img
                    key={i}
                    src={photo.url}
                    alt={`Photo ${i + 1}`}
                    className="w-24 h-24 object-cover rounded border"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
