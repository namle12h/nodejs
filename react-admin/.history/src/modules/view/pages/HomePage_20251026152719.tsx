import React, { useState } from "react";
import Header from "../../../shared/components/Header";
import Footer from "../../../shared/components/Footer";
import HeroCarousel from "./Sider";
import ServicePage from "./ServicePage";
import BookingPage from "../components/BookingPage";
import AboutSection from "../components/AboutSection";
import Testimonials from "../components/Testimonials";
import { Title } from "react-head";
import BookingButtonFixed from "../components/ButtonBooking";
import BookingModal from "../components/BookingModal";
import SpinWheelPopup from "./SpinWheelPopup";

const HomePage: React.FC = () => {
  const [open, setOpen] = useState(false);
  return (
    <>

      <Title>Home | My Website</Title>
      <Header />
      <HeroCarousel />
      <ServicePage />
      <BookingPage />
      <AboutSection />
      <Testimonials />
      <BookingModal open={open} onClose={() => setOpen(false)} />
      <BookingButtonFixed onClick={() => setOpen(true)} // 👈 Khi click nút thì mở modal
        color="red" />
      <SpinWheelPopup />
      <Footer />
    </>
  );
};

export default HomePage;
