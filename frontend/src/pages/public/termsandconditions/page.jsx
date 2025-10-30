import { useEffect, useState } from "react";
import axios from "axios";

export default function TermsConditions() {
  const [policy, setPolicy] = useState(null);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        const res = await axios.get(`${apiUrl}policies/terms`);
        setPolicy(res.data);
      } catch (err) {
        console.error("Error fetching terms:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPolicy();
  }, [apiUrl]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading Terms & Conditions...
      </div>
    );
  }

  if (!policy) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Terms & Conditions not available.
      </div>
    );
  }

  return (
    <div className="container px-4 mt-5 mb-8">
      <h1 className="text-3xl font-semibold text-black mb-6 text-center">
        {policy.title}
      </h1>
      <div
        className="prose prose-indigo max-w-none text-black"
        dangerouslySetInnerHTML={{ __html: policy.content }}
      />
      <p className="text-sm text-gray-400 mt-8 text-right">
        Last updated: {new Date(policy.updatedAt).toLocaleDateString()}
      </p>
    </div>
  );
}
