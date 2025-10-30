import { useEffect, useState } from "react";
import axios from "axios";

export default function PrivacyPolicy() {
  const [policy, setPolicy] = useState(null);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        const res = await axios.get(`${apiUrl}policies/Privacy`);
        setPolicy(res.data);
      } catch (err) {
        console.error("Error fetching policy:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPolicy();
  }, [apiUrl]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading Privacy Policy...
      </div>
    );
  }

  if (!policy) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Privacy Policy not available.
      </div>
    );
  }

  return (
    <div className="container px-4 mt-5 mb-8">
      <h1 className="text-3xl font-semibold text-black mb-6 text-center">
        {policy.title}
      </h1>
      <div
        className="max-w-none text-black"
        dangerouslySetInnerHTML={{ __html: policy.content }}
      />
      <p className="text-sm text-gray-400 mt-8 text-right">
        Last updated: {new Date(policy.updatedAt).toLocaleDateString()}
      </p>
    </div>
  );
}
