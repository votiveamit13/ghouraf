import whyuse1 from "assets/img/ghouraf/whyuse1.png";
import whyuse2 from "assets/img/ghouraf/whyuse2.png";
import whyuse3 from "assets/img/ghouraf/whyuse3.png";

export default function WhyUseGhouraf() {
  return (
    <section className="w-full bg-gradient-to-b from-[#565ABF] to-[#A321A6] py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
          Why Use Ghouraf
        </h2>
        <h3 className="text-sm md:text-base font-medium text-white mb-12">
          Aliquam lacinia diam quis lacus euismod
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl p-4 shadow-md text-center">
            <img src={whyuse1} alt="ghouraf" className="mx-auto mb-3 w-20 h-20 object-contain" />
            <h5 className="font-semibold text-lg text-black mb-3">We're the busiest</h5>
            <p className="text-black text-sm leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-md text-center">
            <img src={whyuse2} alt="ghouraf" className="mx-auto mb-3 w-20 h-20 object-contain" />
            <h5 className="font-semibold text-lg mb-3 text-black">Safety</h5>
            <p className="text-black text-sm leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-md text-center">
            <img src={whyuse3} alt="ghouraf" className="mx-auto mb-3 w-20 h-20 object-contain" />
            <h5 className="font-semibold text-lg mb-3 text-black">We&apos;re all about people</h5>
            <p className="text-black text-sm leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
