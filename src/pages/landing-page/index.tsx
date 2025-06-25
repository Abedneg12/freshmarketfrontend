"use client";
import Navbar from "@/component/navbar";
import Hero from "@/component/hero";
import BestSellers from "@/component/bestsellers";
import Discounts from "@/component/discount";
import LocationBased from "@/component/locationBased";
import Footer from "@/component/footer";

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <Hero />
      <BestSellers />
      <Discounts />
      <LocationBased />
      <Footer />
    </>
  );
}
