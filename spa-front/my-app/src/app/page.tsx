import '@ant-design/v5-patch-for-react-19';
import Header from "./components/Header";
import HeroCarousel from "./components/Slider";
import FeaturedServices from './components/service';
import BookingForm from './components/BookingForm';
import AboutSection from './components/AboutSection';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
export default function Home() {
  return (
    <>
      <Header/>
      <HeroCarousel/>
      <FeaturedServices/>
      <BookingForm/>
      <AboutSection/>
      <Testimonials/>
      <Footer/>
    </>
  );
}
