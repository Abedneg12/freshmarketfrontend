import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { MapPinIcon } from 'lucide-react';
import { ProductGrid } from '../../components/catalog/ProductGrid';
import { Market } from '@/lib/interface/market';
import axios from 'axios';
import { apiUrl } from '@/pages/config';

export default function StoreDetail() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const [store, setStore] = useState<Market | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    if (id) {
      axios.get<Market>(`${apiUrl}/stores/${id}`)
        .then(res => {
          setStore(res.data);
          setLoading(false);
        })
        .catch(() => {
          setStore(null);
          setLoading(false);
        });
    } else {
      setStore(null);
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 animate-pulse">
        <div className="h-64 bg-gray-200 rounded-lg mb-8"></div>
        <div className="h-8 bg-gray-200 w-1/3 rounded mb-4"></div>
        <div className="h-4 bg-gray-200 w-2/3 rounded mb-8"></div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="container mx-auto px-4 py-16 text-center bg-white">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Market Not Found
        </h2>
        <p className="text-gray-600 mb-6">
          Sorry, we couldn't find the market you're looking for.
        </p>
        <Link href="/" className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-medium transition-colors">
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Market Hero */}
      <div className="relative h-64 overflow-hidden">
        <img src={store.imageUrl || '/placeholder-market.jpg'} alt={store.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold text-white mb-2">{store.name}</h1>
            <div className="flex items-center text-white">
              <MapPinIcon className="h-5 w-5 mr-2" />
              <span>{store.address}</span>
              {store.distanceKm !== undefined && (
                <span className="ml-4">{store.distanceKm} km away</span>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        {/* Market Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="font-medium text-gray-900 mb-2">Address</h3>
            <p className="text-gray-600 mb-4">{store.address}</p>
            <h3 className="font-medium text-gray-900 mb-2">Location</h3>
            <p className="text-gray-600">
              Latitude: {store.latitude}, Longitude: {store.longitude}
            </p>
            <h3 className="font-medium text-gray-900 mt-4 mb-2">Created At</h3>
            <p className="text-gray-600">{new Date(store.createdAt).toLocaleString()}</p>
          </div>
        </div>
        {/* Market Products */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Market Products</h2>
          </div>
          <ProductGrid category="all" searchTerm="" filters={{ sortBy: 'popular' }}/>
        </div>
      </div>
    </div>
  );
}