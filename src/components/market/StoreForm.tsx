"use client";
import { useState, useEffect } from "react";
import { LoaderIcon } from "lucide-react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Store } from "@/lib/interface/store.type";
import { useDebounce } from "use-debounce";

const markerIcon = new L.Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  shadowSize: [41, 41],
});

interface StoreFormProps {
  store?: Store | null;
  onSave: (data: Partial<Store>) => void;
  onCancel: () => void;
  isLoading: boolean;
}

function ChangeView({
  center,
  zoom,
}: {
  center: [number, number];
  zoom: number;
}) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
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
    latitude: -6.2088, // Default ke Jakarta
    longitude: 106.8456,
  });

  const [mapPosition, setMapPosition] = useState<[number, number]>([
    formData.latitude,
    formData.longitude,
  ]);

  const [cityQuery, setCityQuery] = useState("");
  const [debouncedCityQuery] = useDebounce(cityQuery, 1500);

  useEffect(() => {
    if (store) {
      setFormData({
        name: store.name,
        address: store.address,
        city: store.city || "",
        latitude: store.latitude,
        longitude: store.longitude,
      });
      setMapPosition([store.latitude, store.longitude]);
    }
  }, [store]);

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
            const newLat = parseFloat(lat);
            const newLon = parseFloat(lon);
            setFormData((prev) => ({
              ...prev,
              latitude: newLat,
              longitude: newLon,
            }));
            setMapPosition([newLat, newLon]);
          }
        } catch (error) {
          console.error("Failed to fetch coordinates:", error);
        }
      };
      fetchCoordinates();
    }
  }, [debouncedCityQuery]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "city") {
      setCityQuery(value);
    }
  };

  const handleMapClick = (e: L.LeafletMouseEvent) => {
    const { lat, lng } = e.latlng;
    setFormData((prev) => ({ ...prev, latitude: lat, longitude: lng }));
    setMapPosition([lat, lng]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="bg-white rounded-lg p-6 w-full border border-gray-200 shadow-sm">
      <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-4">
        {store ? "Edit Store" : "Add New Store"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Store Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded-md text-black focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
            required
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-md font-semibold text-gray-800">
            Store Location
          </h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Store Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-md text-black focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              placeholder="Enter the full store address"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-md text-black focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              placeholder="Example: Cirebon"
              required
            />
          </div>
          <div className="h-80 mt-2 rounded-lg overflow-hidden z-0 border">
            <MapContainer
              center={mapPosition}
              zoom={13}
              style={{ height: "100%", width: "100%" }}
              scrollWheelZoom={false}
            >
              <ChangeView center={mapPosition} zoom={13} />
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker
                position={[formData.latitude, formData.longitude]}
                icon={markerIcon}
              />
              <MapEvents onClick={handleMapClick} />
            </MapContainer>
          </div>
          <p className="text-xs text-gray-500 text-center">
            Click the map to select this location
          </p>
        </div>

        <div className="flex justify-end space-x-4 pt-4 border-t mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="bg-white text-gray-800 px-6 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 font-semibold transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 flex items-center min-w-[120px] justify-center font-semibold transition"
            disabled={isLoading}
          >
            {isLoading ? (
              <LoaderIcon className="animate-spin h-5 w-5" />
            ) : store ? (
              "Save Changes"
            ) : (
              "Add Store"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

const MapEvents = ({
  onClick,
}: {
  onClick: (e: L.LeafletMouseEvent) => void;
}) => {
  const map = useMap();

  useEffect(() => {
    map.on("click", onClick);

    return () => {
      map.off("click", onClick);
    };
  }, [map, onClick]);

  return null;
};
