import { useState } from "react";
import { FiChevronRight } from "react-icons/fi";
import heroImage from "assets/img/ghouraf/hero-section.jpg";

const faqData = [
  {
    question: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    answer:
      "Aenean quis aliquet lacus. Aliquam fermentum mauris sed suscipit viverra. Mauris nec tempus justo. Fusce cursus arcu non massa cursus, ac efficitur ligula scelerisque. Nunc eleifend turpis id ligula porttitor congue in id ipsum. In vitae quam in lacus cursus porttitor. Ut condimentum massa neque, et tristique libero interdum nec.",
  },
  {
    question: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    answer:
      "Aenean quis aliquet lacus. Aliquam fermentum mauris sed suscipit viverra. Mauris nec tempus justo. Fusce cursus arcu non massa cursus, ac efficitur ligula scelerisque. Nunc eleifend turpis id ligula porttitor congue in id ipsum. In vitae quam in lacus cursus porttitor. Ut condimentum massa neque, et tristique libero interdum nec.",
  },
  {
    question: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    answer:
      "Aenean quis aliquet lacus. Aliquam fermentum mauris sed suscipit viverra. Mauris nec tempus justo. Fusce cursus arcu non massa cursus, ac efficitur ligula scelerisque. Nunc eleifend turpis id ligula porttitor congue in id ipsum. In vitae quam in lacus cursus porttitor. Ut condimentum massa neque, et tristique libero interdum nec.",
  },
  {
    question: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    answer:
      "Aenean quis aliquet lacus. Aliquam fermentum mauris sed suscipit viverra. Mauris nec tempus justo. Fusce cursus arcu non massa cursus, ac efficitur ligula scelerisque. Nunc eleifend turpis id ligula porttitor congue in id ipsum. In vitae quam in lacus cursus porttitor. Ut condimentum massa neque, et tristique libero interdum nec.",
  },
  {
    question: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    answer:
      "Aenean quis aliquet lacus. Aliquam fermentum mauris sed suscipit viverra. Mauris nec tempus justo. Fusce cursus arcu non massa cursus, ac efficitur ligula scelerisque. Nunc eleifend turpis id ligula porttitor congue in id ipsum. In vitae quam in lacus cursus porttitor. Ut condimentum massa neque, et tristique libero interdum nec.",
  },
];

export default function Faqs() {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFaq = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
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
          <h1 className="text-white text-3xl sm:text-5xl font-bold">FAQ’s</h1>
        </div>
      </section>

      <section className="py-16 md:px-6 px-3 flex justify-center">
        <div className="w-full max-w-4xl space-y-4">
          {faqData.map((faq, index) => (
            <div
              key={index}
              className="border-[1px] border-[#D7D7D7] rounded-[16px] bg-white shadow-sm"
            >
              <button
                className="w-full flex justify-between items-center px-4 py-3 text-left text-black font-semibold"
                onClick={() => toggleFaq(index)}
              >
                {faq.question}
                <span
                  className={`flex items-center justify-center md:w-6 md:h-6 w-8 rounded-full text-white text-lg transition ${
                    activeIndex === index ? "bg-[#A321A6]" : "bg-[#565ABF]"
                  }`}
                >
                  <FiChevronRight
                    className={`transition-transform ${
                      activeIndex === index ? "rotate-90" : ""
                    }`}
                  />
                </span>
              </button>
              {activeIndex === index && (
                <div className="px-4 pb-4 text-black text-sm leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
