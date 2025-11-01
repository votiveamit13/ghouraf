// components/PaymentSuccess.js
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function PaymentSuccess() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const spaceId = params.get("spaceId");
    
    // Show success message
    navigate("/user/thank-you", {
      state: {
        title: "Your promoted ad was successfully submitted!",
        subtitle: "Your payment was successful and your ad will be prominently featured. This post will undergo a review process and will be published once approved.",
        goBackPath: "/user/post-an-space",
      }
    });
  }, [params, navigate]);

  return <div className="p-10 text-center">Processing your payment...</div>;
}