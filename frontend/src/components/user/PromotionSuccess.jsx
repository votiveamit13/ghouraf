import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

export default function PromotionSuccess() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const markPromoted = async () => {
      const spaceId = params.get("spaceId");
      const days = params.get("days");

      if (!spaceId || !days) return;
      await axios.get(`${apiUrl}spaces/promote-success?spaceId=${spaceId}&days=${days}`);
      navigate("/user/thank-you", {
        state: {
          title: "Your ad was successfully submitted",
          subtitle: "This post will undergo a review process and will be published once approved.",
          goBackPath: "/user/post-an-space",
        },
      });
    };
    markPromoted();
  }, [params, navigate, apiUrl]);

  return <div className="p-10 text-center">Processing your promotion...</div>;
}
