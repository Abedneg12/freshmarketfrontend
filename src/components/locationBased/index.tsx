"use client";

import React from "react";
import { MapPinIcon, StoreIcon, ClockIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useAppSelector } from "@/lib/redux/hooks";

const LocationBasedPage = () => {
  const { data: nearbyStore, loading: storesLoading } = useAppSelector(
    (state) => state.store
  );
  const { permission, error: locationError } = useAppSelector(
    (state) => state.location
  );

  if (permission === "denied") {
    return (
      <section className="py-16 bg-white text-center">
        <div className="container mx-auto px-4">
          <h3 className="text-x1 font-medium text-gray-700 mb-2">
            Akses Lokasi Ditolak
          </h3>
          <p className="text-gray-500 mb-6">
            Kami tidak dapat merekomendasikan toko terdekat tanpa izin lokasi Anda.
            <br />
            Silakan aktifkan izin lokasi di pengaturan browser Anda.
          </p>
          {locationError && (
            <p className="text-sm text-red-500">
              Detail Error: {locationError}
            </p>
          )}
        </div>
      </section>
    );
  }

  if (storesLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <svg
          className="animate-spin h-8 w-8 text-green-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <span className="ml-2 text-gray-600">
          Mencari toko di dekat Anda...
        </span>
      </div>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Toko di dekat Anda
          </h2>
          <p className="text-gray-600 max-w-2x1 mx-auto">
            Kami menemukan beberapa lokasi untuk melayani Anda.
          </p>
        </div>

        {nearbyStore.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {nearbyStore.map((store) => (
              <div
                key={store.id}
                className="bg-white rounded-lg overflow-hidden shadow border border-gray-200"
              >
                <div className="relative w-full h-48">
                  <Image
                    src={store.imageUrl ? store.imageUrl : "/placeholder.png"}
                    alt={store.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-lg text-gray-800 mb-2">
                    {store.name}
                  </h3>
                  <div className="flex items-start mb-2">
                    <MapPinIcon className="h-5 w-5 text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
                    <p className="text-gray-600">{store.address}</p>
                  </div>
                  <div className="flex items-center mb-2">
                    <StoreIcon className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0" />
                    <p className="text-gray-600">
                      {store.distanceKm.toFixed(2)} km
                    </p>
                  </div>
                  <div className="flex items-center mb-4">
                    <ClockIcon className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0" />
                    <p className="text-gray-600">10:00 - 22:00</p>
                  </div>
                  <Link
                    href={`/store/${store.id}`}
                    className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-full w-full transition-colors text-center block"
                  >
                    Belanja di Toko ini
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <h3 className="text-x1 font-medium text-gray-700 mb-2">
              Tidak Ada Toko Ditemukan
            </h3>
            <p className="text-gray-500">
              Maaf, sepertinya belum ada toko melayani lokasi Anda saat ini.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default LocationBasedPage;
