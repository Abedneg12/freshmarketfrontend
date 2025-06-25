import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { fetchRecommendations } from "@/lib/redux/slice/storeSlice";
import Image from "next/image";
import Link from "next/link";

export default function LocationBased() {
  const dispatch = useAppDispatch();
  const { data, loading, error } = useAppSelector((s) => s.store);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) =>
          dispatch(
            fetchRecommendations({
              lat: coords.latitude,
              lng: coords.longitude,
            })
          ),
        () => dispatch(fetchRecommendations({ lat: -6.2, lng: 106.8 }))
      );
    } else {
      dispatch(fetchRecommendations({ lat: -6.2, lng: 106.8 }));
    }
  }, [dispatch]);

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-6x1 mx-auto px-4">
        <h2 className="text-2x1 font-bold mb-6">Stores Near You</h2>
        {loading && <p>Loading stores...</p>}
        {error && <p className="text-red-500">{error}</p>}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data.map((store) => (
            <div
              key={store.id}
              className="bg-white rounded-lg shadow overflow-hidden"
            >
              <div className="relative h-40">
                <Image
                  src={store.imageUrl}
                  alt={store.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold">{store.name}</h3>
                <p className="text-sm text-gray-500">{store.address}</p>
                <p className="text-sm text-green-700">
                  {store.distanceKm} km away
                </p>
                <Link
                  href={`/stores/${store.id}`}
                  className="mt-4 inline-block bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  Shop This Store
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
