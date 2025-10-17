import Header from "../../../../components/admin/Headers/Header";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate, useLocation } from "react-router-dom";
import defaultImage from "assets/img/ghouraf/default-avatar.png";

export default function ViewDetails() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const user = state?.user;

    if (!user) return <p>No user selected</p>;

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    return (
        <>
            <Header />
            <div className="px-[40px] mt-[-8%] w-full fluid position-relative">
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="px-3 py-[20px] border-b border-gray-200 d-flex justify-between">
                        <h3 className="text-lg font-semibold text-gray-800">View Details</h3>
                        <button
                            className="d-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
                            onClick={() => navigate("/admin/user-management")}
                        >
                            <FaArrowLeftLong /> Back
                        </button>
                    </div>

                    <div className="row g-3 p-4">
                        <div className="col-md-12 text-center mb-4">
                            <img
                                src={user?.profile?.photo || defaultImage}
                                alt="Profile"
                                className="w-24 h-24 rounded-circle object-cover border shadow-sm"
                            />
                        </div>

                        <div className="col-md-6 mb-3">
                            <div className="d-flex border-bottom pb-2">
                                <span className="fw-semibold me-2 text-gray-600">First Name:</span>
                                <span>{user?.profile?.firstName || "-"}</span>
                            </div>
                        </div>

                        <div className="col-md-6 mb-3">
                            <div className="d-flex border-bottom pb-2">
                                <span className="fw-semibold me-2 text-gray-600">Last Name:</span>
                                <span>{user?.profile?.lastName || "-"}</span>
                            </div>
                        </div>

                        <div className="col-md-6 mb-3">
                            <div className="d-flex border-bottom pb-2">
                                <span className="fw-semibold me-2 text-gray-600">Mobile:</span>
                                <span>{user?.profile?.mobile || "-"}</span>
                            </div>
                        </div>

                        <div className="col-md-6 mb-3">
                            <div className="d-flex border-bottom pb-2">
                                <span className="fw-semibold me-2 text-gray-600">Email:</span>
                                <span>{user?.email || "-"}</span>
                            </div>
                        </div>

                        <div className="col-md-4 mb-3">
                            <div className="d-flex border-bottom pb-2">
                                <span className="fw-semibold me-2 text-gray-600">Age:</span>
                                <span>{user?.profile?.age || "-"}</span>
                            </div>
                        </div>

                        <div className="col-md-4 mb-3">
                            <div className="d-flex border-bottom pb-2">
                                <span className="fw-semibold me-2 text-gray-600">Gender:</span>
                                <span>{user?.profile?.gender || "-"}</span>
                            </div>
                        </div>

                        <div className="col-md-4 mb-3">
                            <div className="d-flex border-bottom pb-2">
                                <span className="fw-semibold me-2 text-gray-600">Date of Birth:</span>
                                <span>{formatDate(user?.profile?.dob) || "-"}</span>
                            </div>
                        </div>
                        <div className="px-4 w-full mb-4">
                            <div className="col-md-12 d-flex align-items-center border-bottom pb-2">
                                <input
                                    type="checkbox"
                                    className="form-check-input me-2"
                                    checked={user?.termsAccepted}
                                    readOnly
                                />
                                <label className="form-check-label">Terms Accepted</label>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}
