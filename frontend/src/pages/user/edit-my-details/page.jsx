import Loader from "components/common/Loader";
import DetailsForm from "components/user/editmydetails/DetailsForm";
import ProfileEdit from "components/user/editmydetails/ProfileEdit";
import { useAuth } from "context/AuthContext";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export default function EditMyDetails() {
    const { user, loading, token } = useAuth();
  const apiUrl = process.env.REACT_APP_API_URL;
    if (loading) return <Loader fullScreen />;
    if (!user) return <Navigate to="/" replace />;
    const initialProfile = {
        photo: `${user.profile?.photo}`,
        gender: `${user.profile?.gender}`,
        // age: 28,
        mobile: `${user.profile?.mobile || ""}`,
        dob: `${user.profile?.dob}`,
    };


const handleSaveProfile = async (data) => {
  try {
    const formData = new FormData();

    for (const key in data) {
      if (key !== "age") {
        formData.append(key, data[key]);
      }
    }

    formData.append("section", "profile");
    const res = await axios.put(`${apiUrl}/auth/profile`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("Profile Updated:", res.data);
    toast.success("Profile Updated");
  } catch (err) {
    console.error("Profile update failed:", err.response?.data || err.message);
    toast.error(err.message);
  }
};

    const handleSave = async (data, section) => {
        try{
            const res = await axios.put(`${apiUrl}/auth/profile`,
                { ...data, section},
                { headers: { Authorization: `Bearer ${token}`}}
            );
            console.log("Updated", res.data);
            toast.success("Updated successfully")
        } catch (err) {
            console.error("Update failed", err.response?.data || err.message);
            const errorMsg = err.response?.data?.message || err.message || "Something went wrong";
    toast.error(errorMsg);
        }
    };
    return (
        <>
            <div className="container user-layout mt-5 mb-8">
                <h2 className="text-[25px] font-bold text-black">Edit my details - <span className="text-[#A321A6]">{user.profile?.firstName}</span></h2>
                <div className="mt-4">
                    <DetailsForm
                        title="Change Your Name"
                        fields={[
                            { label: "First Name", name: "firstName", placeholder: "First Name", type: "text", value: `${user.profile?.firstName}` },
                            { label: "Last Name", name: "lastName", placeholder: "Last Name", type: "text", value: `${user.profile?.lastName}` },
                            { label: "Your Password", name: "password", placeholder: "Your Password", type: "password" },
                        ]}
                        onSubmit={(data) => handleSave(data, "name")}
                        userEmail={user.email}
                    />
                    <DetailsForm
                        title="Change Email Address"
                        fields={[
                            { label: "Email", name: "email", placeholder: "Your Email", type: "text", value: `${user.email}` },
                            { label: "Confirm Email", name: "confirmEmail", placeholder: "Your Confirm Email", type: "text" },
                            { label: "Your Password", name: "password", placeholder: "Your Password", type: "password" },
                        ]}
                        onSubmit={(data) => handleSave(data, "email")}
                        userEmail={user.email}
                    />
                    <DetailsForm
                        title="Change Your Password"
                        fields={[
                            { label: "Your current password", name: "currentPassword", placeholder: "Current Password", type: "password" },
                            { label: "Choose new password", name: "newPassword", placeholder: "New Password", type: "password" },
                            { label: "Confirm new password", name: "confirmPassword", placeholder: "Confirm New Password", type: "password" },
                        ]}
                        onSubmit={(data) => handleSave(data, "password")}
                        userEmail={user.email}
                    />
                    <ProfileEdit initialData={initialProfile} onSave={handleSaveProfile} />
                </div>
            </div>
        </>
    );
}