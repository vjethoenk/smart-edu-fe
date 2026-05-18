import FeaturedCourses from "./components/FeaturedCourses";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import WhyChooseSection from "./components/WhyChooseSection";

export default function HomePage() {
  return (
    <div>
      <Hero />
      <WhyChooseSection />
      <FeaturedCourses />
      <Footer />
    </div>
  );
}
