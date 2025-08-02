"use client";
import React, { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { IAddress } from "@/lib/interface/address";
import { LoaderIcon } from "lucide-react";
import "leaflet/dist/leaflet.css";
import { useDebounce } from "use-debounce";

// Buat komponen peta menjadi dinamis
const MapWithNoSSR = dynamic(
  () => import("../../../components/common/MapPicker"),
  {
    ssr: false,
    loading: () => (
      <div className="flex justify-center items-center h-full">
        <LoaderIcon className="h-8 w-8 animate-spin" />
      </div>
    ),
  }
);

interface AddressFormProps {
  address?: IAddress | null;
  onClose: () => void;
  onSave: (data: Partial<IAddress>) => void;
  isLoading: boolean;
}

export default function AddressForm({
  address,
  onClose,
  onSave,
  isLoading,
}: AddressFormProps) {
  const [formData, setFormData] = useState({
    label: "",
    recipient: "",
    phone: "",
    addressLine: "",
    city: "",
    province: "",
    postalCode: "",
    latitude: -6.2088,
    longitude: 106.8456,
    isMain: false,
  });

  const [cityQuery, setCityQuery] = useState("");
  const [debouncedCityQuery] = useDebounce(cityQuery, 700);

  useEffect(() => {
    if (address) {
      setFormData({ ...address });
    }
  }, [address]);

  useEffect(() => {
    if (debouncedCityQuery) {
      const fetchCoordinates = async () => {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?city=${debouncedCityQuery}&format=json&limit=1`
          );
          const data = await response.json();
          if (data && data.length > 0) {
            const { lat, lon } = data[0];
            setFormData((prev) => ({
              ...prev,
              latitude: parseFloat(lat),
              longitude: parseFloat(lon),
            }));
          }
        } catch (error) {
          console.error("Failed to fetch coordinates:", error);
        }
      };
      fetchCoordinates();
    }
  }, [debouncedCityQuery]);

  const handleLocationSelect = (lat: number, lng: number) => {
    setFormData((prev) => ({ ...prev, latitude: lat, longitude: lng }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === "checkbox";
    const finalValue = isCheckbox
      ? (e.target as HTMLInputElement).checked
      : value;

    setFormData((prev) => ({ ...prev, [name]: finalValue }));
    if (name === "city") {
      setCityQuery(value);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="bg-white rounded-lg p-6 w-full border border-gray-200 shadow-sm">
      <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-4">
        {address ? "Edit Address" : "Add New Address"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Label Alamat
            </label>
            <input
              type="text"
              name="label"
              value={formData.label}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-md text-black"
              placeholder="Contoh: Rumah, Kantor"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Penerima
            </label>
            <input
              type="text"
              name="recipient"
              value={formData.recipient}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-md text-black"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nomor Telepon
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-md text-black"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Detail Alamat
            </label>
            <textarea
              name="addressLine"
              value={formData.addressLine}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-md text-black"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kota/Kabupaten
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-md text-black"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Provinsi
            </label>
            <input
              type="text"
              name="province"
              value={formData.province}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-md text-black"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kode Pos
            </label>
            <input
              type="text"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-md text-black"
              required
            />
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="text-md font-semibold text-gray-800">
            Tentukan Lokasi di Peta
          </h3>
          <div className="relative h-[500px] mt-2 rounded-lg overflow-hidden z-0 border">
            <MapWithNoSSR
              latitude={formData.latitude}
              longitude={formData.longitude}
              onLocationSelect={handleLocationSelect}
            />
          </div>
          <p className="text-xs text-gray-500 text-center">
            Klik peta untuk menandai lokasi Anda
          </p>
        </div>
        <div className="flex items-center">
          <input
            id="isMain"
            name="isMain"
            type="checkbox"
            checked={formData.isMain}
            onChange={handleChange}
            className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
          />
          <label htmlFor="isMain" className="ml-2 block text-sm text-gray-900">
            Jadikan alamat utama
          </label>
        </div>
        <div className="flex justify-end space-x-4 pt-4 border-t mt-6">
          <button
            type="button"
            onClick={onClose}
            className="bg-white text-gray-800 px-6 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 font-semibold transition"
          >
            Batal
          </button>
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 flex items-center min-w-[120px] justify-center font-semibold transition"
            disabled={isLoading}
          >
            {isLoading ? (
              <LoaderIcon className="animate-spin h-5 w-5" />
            ) : address ? (
              "Simpan Perubahan"
            ) : (
              "Simpan Alamat"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
