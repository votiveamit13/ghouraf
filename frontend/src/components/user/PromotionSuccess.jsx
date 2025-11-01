// PaymentSuccess.jsx
import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export default function PaymentSuccess() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const spaceId = params.get("spaceId");
    const days = params.get("days");

    if (spaceId && days) {
      axios
        .get(`${process.env.REACT_APP_API_URL}spaces/promote-success?spaceId=${spaceId}&days=${days}`)
        .then(() => {
          toast.success("Payment successful! Your ad is now promoted.");
          navigate("/user/thank-you", {
            state: {
              title: "Your ad was successfully submitted",
              subtitle: "This post will undergo a review process and will be published once approved.",
          goBackPath: "/user/post-an-space",
            },
          });
        })
        .catch(() => toast.error("Failed to mark as promoted"));
    }
  }, []);

  return <div className="text-center py-5">Verifying your payment...</div>;
}