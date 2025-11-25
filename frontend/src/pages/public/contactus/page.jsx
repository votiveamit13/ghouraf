import heroImage from "assets/img/ghouraf/hero-section.jpg";
import { FiPhoneCall } from "react-icons/fi";
import { TfiEmail } from "react-icons/tfi";
import { PiMapPinLine } from "react-icons/pi";
import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export default function ContactUs() {
    const apiUrl = process.env.REACT_APP_API_URL;
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        subject: "",
        message: "",
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            const res = await axios.post(`${apiUrl}/sendMessage`, formData);

            toast.success(res.data.message || "Message sent successfully!");
            setFormData({
                fullName: "",
                email: "",
                subject: "",
                message: "",
            });
        } catch (err) {
            if (err.response?.status === 422 && err.response.data?.errors) {
                const fieldErrors = {};
                Object.entries(err.response.data.errors).forEach(([key, messages]) => {
            fieldErrors[key] = messages[0];
        });
                setErrors(fieldErrors);
            } else {
                toast.error(err.response?.data?.message || "Something went wrong!");
            }
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="w-full">
            <section
                className="relative h-[300px] bg-cover bg-center flex items-center justify-center"
                style={{
                    backgroundImage: `url(${heroImage})`,
                }}
            >
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="relative z-10 text-center px-4">
                    <h1 className="text-white text-3xl sm:text-5xl font-bold">Contact Us</h1>
                </div>
            </section>

            <section className="py-16 md:px-6 px-3 flex justify-center">
                <div className="bg-white shadow-lg rounded-[20px] w-full max-w-5xl grid grid-cols-1 md:grid-cols-5 gap-8">
                    <div className="md:col-span-2 border-r p-5">
                        <h2 className="text-xl font-semibold mb-5 text-black">Contact Info</h2>
                        <ul className="space-y-4 text-gray-700">
                            {/* <li className="flex gap-3">
                                <span className="text-[#A321A6] text-lg"><FiPhoneCall /></span>
                                <span className="text-[#464D61]">(012) 345-6789</span>
                            </li> */}
                            <li className="flex gap-3">
                                <span className="text-[#A321A6] text-lg"><TfiEmail /></span>
                                <span className="text-[#464D61]">
                                    support@ghouraf.com <br /> info@ghouraf.com
                                </span>
                            </li>
                            {/* <li className="flex gap-3">
                                <span className="text-[#A321A6] text-lg"><PiMapPinLine /></span>
                                <span className="text-[#464D61]">Your Address Will Goes Here 452005</span>
                            </li> */}
                        </ul>
                    </div>

                    <div className="md:col-span-3 p-5">
                        <h2 className="text-xl font-semibold mb-5 text-black">Send Message</h2>
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <input
                                        type="text"
                                        name="fullName"
                                        placeholder="Full name"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        className="w-full border-[1px] border-[#D7D7D7] rounded-[5px] px-3 py-2"
                                    />
                                    {errors.fullName && (
                                        <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                                    )}
                                </div>
                                <div>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Email address"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full border-[1px] border-[#D7D7D7] rounded-[5px] px-3 py-2"
                                    />
                                    {errors.email && (
                                        <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <input
                                    type="text"
                                    name="subject"
                                    placeholder="Subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className="w-full border-[1px] border-[#D7D7D7] rounded-[5px] px-3 py-2"
                                />
                                {errors.subject && (
                                    <p className="text-red-500 text-sm mt-1">{errors.subject}</p>
                                )}
                            </div>

                            <div>
                                <textarea
                                    rows="4"
                                    name="message"
                                    placeholder="Message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="w-full border-[1px] border-[#D7D7D7] rounded-[5px] px-3 py-2"
                                ></textarea>
                                {errors.message && (
                                    <p className="text-red-500 text-sm mt-1">{errors.message}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-[#565ABF] text-[16px] font-semibold text-white px-4 py-[15px] rounded-[4px] transition disabled:opacity-50"
                            >
                                {loading ? "Sending..." : "Send Message"}
                            </button>
                        </form>
                    </div>
                </div>
            </section>

{/* 
            <section className="w-full h-[400px]">
                <iframe
                    title="flatmate"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3023.983414225663!2d-74.00594168459462!3d40.712783779330735!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzDCsDQyJzQ2LjAiTiA3NMKwMDAnMjAuMCJX!5e0!3m2!1sen!2sus!4v1614321762757!5m2!1sen!2sus"
                    width="100%"
                    height="100%"
                    allowFullScreen=""
                    loading="lazy"
                    className="rounded-t-md"
                ></iframe>
            </section> */}
        </div>
    );
}
