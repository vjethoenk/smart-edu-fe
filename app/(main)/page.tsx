import FeaturedCourses from "./components/FeaturedCourses";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import StepProgress from "./components/StepProgress";
import WhyChooseSection from "./components/WhyChooseSection";

export default function HomePage() {
  return (
    <div>
      <Hero />
      <WhyChooseSection />
      <FeaturedCourses />
      <StepProgress />
      <Footer />
    </div>
  );
}
