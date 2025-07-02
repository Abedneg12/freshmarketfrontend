"use client";
import { Hero } from "@/pages/Hero-page";
import { BestSellers } from "@/pages/BestSellers-page";
import { Discounts } from "@/pages/Discounts-page";
import { LocationBased } from "@/pages/LocationBased-page";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";

import { fetchRecommendations } from "@/lib/redux/slice/storeSlice";
import { setLocationSuccess, setLocationError } from "@/lib/redux/slice/locationSlice";

export default function Home () {
  const dispatch = useAppDispatch();
  const {coordinates, permission} = useAppSelector(state => state.location);

  useEffect(() => {
    if (permission === "idle") {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const {latitude, longitude} = position.coords;
          dispatch(setLocationSuccess({lat: latitude, lng: longitude}));
        },
        (error) => {
          dispatch(setLocationError(error.message));
        }
      );
    }
  }, [dispatch, permission]);

  useEffect(() => {
    if (coordinates) {
      dispatch(fetchRecommendations(coordinates));
    }
  }, [coordinates, dispatch]);
  return (
    <>
      <Hero />
      <BestSellers />
      <Discounts />
      <LocationBased />
    </>
  );
}