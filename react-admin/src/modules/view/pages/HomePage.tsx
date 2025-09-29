import React from "react";
import Header from "../../../shared/components/Header";
import Footer from "../../../shared/components/Footer";
import HeroCarousel from "./Sider";
import ServicePage from "./ServicePage";
import BookingPage from "../components/BookingPage";
import AboutSection from "../components/AboutSection";
import Testimonials from "../components/Testimonials";
import {  Title } from "react-head";

const HomePage: React.FC = () => {
  console.log("✅ HomePage mounted");

  return (
    <>

      <Title>Home | My Website</Title>
      <Header />
      <HeroCarousel />
      <ServicePage />
      <BookingPage />
      <AboutSection />
      <Testimonials />
      <Footer />
    </>
  );
};

export default HomePage;
