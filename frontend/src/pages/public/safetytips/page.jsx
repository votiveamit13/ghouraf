import { useEffect, useState } from "react";
import axios from "axios";

export default function SafetyTips() {
  const [safetyTips, setSafetyTips] = useState(null);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchSafetyTips = async () => {
      try {
        const res = await axios.get(`${apiUrl}policies/Safety`);
        setSafetyTips(res.data);
      } catch (err) {
        console.error("Error fetching safety tips:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSafetyTips();
  }, [apiUrl]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading Safety & Tips...
      </div>
    );
  }

  if (!safetyTips) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Safety & Tips not available.
      </div>
    );
  }

  return (
    <div className="container user-layout mt-5 mb-8">
      <h1 className="text-3xl font-semibold text-black mb-6 text-center">
        {safetyTips.title}
      </h1>
      <div
        className="max-w-none text-black"
        dangerouslySetInnerHTML={{ __html: safetyTips.content }}
      />
      <p className="text-sm text-gray-400 mt-8 text-right">
        Last updated: {new Date(safetyTips.updatedAt).toLocaleDateString()}
      </p>
    </div>
  );
}
