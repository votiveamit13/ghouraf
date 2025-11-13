import { useEffect, useState } from "react";
import axios from "axios";

export default function Advice() {
  const [advice, setAdvice] = useState(null);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchAdvice = async () => {
      try {
        const res = await axios.get(`${apiUrl}policies/Advice`);
        setAdvice(res.data);
      } catch (err) {
        console.error("Error fetching advice:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdvice();
  }, [apiUrl]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading Advice...
      </div>
    );
  }

  if (!advice) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Advice not available.
      </div>
    );
  }

  return (
    <div className="container user-layout mt-5 mb-8">
      <h1 className="text-3xl font-semibold text-black mb-6 text-center">
        {advice.title}
      </h1>
      <div
        className="prose max-w-none text-black"
        dangerouslySetInnerHTML={{ __html: advice.content }}
      />
      <p className="text-sm text-gray-400 mt-8 text-right">
        Last updated: {new Date(advice.updatedAt).toLocaleDateString()}
      </p>
    </div>
  );
}
