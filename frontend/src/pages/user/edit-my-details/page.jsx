import Loader from "components/common/Loader";
import DetailsForm from "components/user/editmydetails/DetailsForm";
import ProfileEdit from "components/user/editmydetails/ProfileEdit";
import { useAuth } from "context/AuthContext";
import { Navigate } from "react-router-dom";
export default function EditMyDetails() {
    const { user, loading } = useAuth();

    if (loading) return <Loader fullScreen />;
    if (!user) return <Navigate to="/" replace />;
  const initialProfile = {
    photo: "https://via.placeholder.com/150",
    gender: `${user.profile?.gender}`,
    age: 28,
    mobile: "+33 123 456 789",
    dob: `${user.profile?.dob}`,
  };

    const handleSaveProfile = (data) => {
    console.log("Updated profile:", data);
    // 🔜 Call your API here (FormData for photo upload)
  };
    const handleSave = (data) => {
        console.log("Form submitted:", data);
        // 🔜 Call API here
    };
    return (
        <>
            <div className="container px-4 mt-5 mb-8">
                <h2 className="text-[25px] font-bold text-black">Edit my details - <span className="text-[#A321A6]">{user.profile?.firstName}</span></h2>
                <div className="mt-4">
                    <DetailsForm
                        title="Change Your Name"
                        fields={[
                            { label: "First Name", name: "firstName", placeholder: "First Name", type: "text", value: `${user.profile?.firstName}` },
                            { label: "Last Name", name: "lastName", placeholder: "Last Name", type: "text", value: `${user.profile?.lastName}` },
                            { label: "Your Password", name: "password", placeholder: "Your Password", type: "password" },
                        ]}
                        onSubmit={handleSave}
                    />
                    <DetailsForm
                        title="Change Email Address"
                        fields={[
                            { label: "Email", name: "email", placeholder: "Your Email", type: "text", value: `${user.email}` },
                            { label: "Confirm Email", name: "confirmEmail", placeholder: "Your Confirm Email", type: "text" },
                            { label: "Your Password", name: "password", placeholder: "Your Password", type: "password" },
                        ]}
                        onSubmit={handleSave}
                    />
                                        <DetailsForm
                        title="Change Your Password"
                        fields={[
                            { label: "Your current password", name: "currentPassword", placeholder: "Current Password", type: "text"},
                            { label: "Choose new password", name: "newPassword", placeholder: "New Password", type: "text" },
                            { label: "Confirm new password", name: "confirmPassword", placeholder: "Confirm New Password", type: "password" },
                        ]}
                        onSubmit={handleSave}
                    />
                    <ProfileEdit initialData={initialProfile} onSave={handleSaveProfile} />
                </div>
            </div>
        </>
    );
}