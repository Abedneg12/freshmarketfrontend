"use client";
import { Hero } from "@/pages/Hero";
import { BestSellers } from "@/pages/BestSellers";
import { Discounts } from "@/pages/Discounts";
import { LocationBased } from "@/pages/LocationBased";

interface HomeProps {
  userLocation: {
    lat: number;
    lng: number;
  } | null;
  locationError: string | null;
}
export default function Home ({ userLocation, locationError }: HomeProps) {
  return (
    <>
      <Hero />
      <BestSellers />
      <Discounts />
      <LocationBased userLocation={userLocation} locationError={locationError}/>
    </>
  );
}
