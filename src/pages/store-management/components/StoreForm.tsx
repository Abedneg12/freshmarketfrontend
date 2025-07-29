"use client";
import { useState, useEffect } from "react";
import { LoaderIcon } from "lucide-react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Store } from "@/lib/interface/store.type";

const markerIcon = new L.Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface StoreFormProps {
  store?: Store | null;
  onSave: (data: Partial<Store>) => void;
  onCancel: () => void;
  isLoading: boolean;
}

function LocationPicker({
  onLocationSelect,
  initialPosition,
}: {
  onLocationSelect: (lat: number, lng: number) => void;
  initialPosition: [number, number];
}) {
  const [position, setPosition] = useState<[number, number]>(initialPosition);
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      onLocationSelect(lat, lng);
    },
  });
  return position ? (
    <Marker position={position} icon={markerIcon}></Marker>
  ) : null;
}

export default function StoreForm({
  store,
  onSave,
  onCancel,
  isLoading,
}: StoreFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    latitude: -6.2088,
    longitude: 106.8456,
  });

  useEffect(() => {
    if (store) {
      setFormData({
        name: store.name,
        address: store.address,
        city: store.city || "",
        latitude: store.latitude,
        longitude: store.longitude,
      });
    }
  }, [store]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    setFormData((prev) => ({ ...prev, latitude: lat, longitude: lng }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="bg-white rounded-lg p-8 w-full max-w-2xl shadow-lg border">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {store ? "Edit Toko" : "Tambah Toko Baru"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nama Toko
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 w-full border p-2 rounded-md text-black"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Alamat Lengkap Toko
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="mt-1 w-full border p-2 rounded-md text-black"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Kota
          </label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="mt-1 w-full border p-2 rounded-md text-black"
            placeholder="Contoh: Jakarta Selatan"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Tentukan Lokasi di Peta
          </label>
          <div className="h-64 mt-2 rounded-lg overflow-hidden z-0">
            <MapContainer
              center={[formData.latitude, formData.longitude]}
              zoom={13}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <LocationPicker
                onLocationSelect={handleLocationSelect}
                initialPosition={[formData.latitude, formData.longitude]}
              />
            </MapContainer>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Latitude
            </label>
            <input
              type="number"
              name="latitude"
              value={formData.latitude}
              onChange={handleChange}
              step="any"
              className="mt-1 w-full border p-2 rounded-md text-black bg-gray-100"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Longitude
            </label>
            <input
              type="number"
              name="longitude"
              value={formData.longitude}
              onChange={handleChange}
              step="any"
              className="mt-1 w-full border p-2 rounded-md text-black bg-gray-100"
              readOnly
            />
          </div>
        </div>
        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
          >
            Batal
          </button>
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center min-w-[100px] justify-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <LoaderIcon className="animate-spin h-5 w-5" />
            ) : (
              "Simpan"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
