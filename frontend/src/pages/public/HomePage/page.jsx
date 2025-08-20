import HeroSection from "components/public/home_page/HeroSection";
import LookingFor from "components/public/home_page/LookingFor";
import WelcomeToGhouraf from "components/public/home_page/WelcomeToGhouraf";
import WhyUseGhouraf from "components/public/home_page/WhyUseGhouraf";


export default function Home(){
    return(
        <>
            <HeroSection/>
            <WelcomeToGhouraf/>
            <WhyUseGhouraf/>
            <LookingFor/>
        </>
    );
}