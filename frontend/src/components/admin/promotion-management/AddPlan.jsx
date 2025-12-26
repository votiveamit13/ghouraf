import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "components/admin/Headers/Header";
import axios from "axios";
import { toast } from "react-toastify";
import { FaArrowLeftLong } from "react-icons/fa6";

export default function AddPlan() {
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem("authToken");

  const [formData, setFormData] = useState({
    plan: "",
    amountUSD: "",
    status: "active",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};
    if (!formData.plan) newErrors.plan = "Plan duration is required";
    if (!formData.amountUSD) newErrors.amountUSD = "Amount is required";

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      await axios.post(
        `${apiUrl}/admin`,
        {
          plan: Number(formData.plan),
          amountUSD: Number(formData.amountUSD),
          status: formData.status,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Promotion plan added successfully");
      navigate("/admin/promotion-management/payment-options");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add plan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header hideStatsOnMobile />

      <div className="px-[20px] md:px-[40px] mt-[-12%] md:mt-[-8%] mb-4">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-3 py-4 border-b flex justify-between">
            <h3 className="text-lg font-semibold">Add Promotion Plan</h3>
            <button
              onClick={() =>
                navigate("/admin/promotion-management/payment-options")
              }
              className="flex items-center gap-2 text-blue-600"
            >
              <FaArrowLeftLong /> Back
            </button>
          </div>

          <form className="p-4" onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="font-medium">Plan Duration (Days)</label>
              <input
                type="number"
                name="plan"
                className="form-control"
                placeholder="e.g. 10"
                value={formData.plan}
                onChange={handleChange}
              />
              {errors.plan && (
                <p className="text-red-500 text-sm">{errors.plan}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="font-medium">Amount (USD)</label>
              <input
                type="number"
                name="amountUSD"
                className="form-control"
                placeholder="e.g. 25"
                value={formData.amountUSD}
                onChange={handleChange}
              />
              {errors.amountUSD && (
                <p className="text-red-500 text-sm">{errors.amountUSD}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="font-medium">Status</label>
              <select
                name="status"
                className="form-control"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
              >
                {loading ? "Adding..." : "Add Plan"}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() =>
                  navigate("/admin/promotion-management/payment-options")
                }
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
