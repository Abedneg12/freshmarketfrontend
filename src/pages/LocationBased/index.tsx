import React, { useEffect, useState } from 'react';
import { MapPinIcon, StoreIcon, ClockIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
interface Store {
  id: number;
  name: string;
  address: string;
  distance: string;
  hours: string;
  image: string;
}
interface LocationBasedProps {
  userLocation: {
    lat: number;
    lng: number;
  } | null;
  locationError: string | null;
}
export const LocationBased = ({
  userLocation,
  locationError
}: LocationBasedProps) => {
  const [nearbyStores, setNearbyStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  useEffect(() => {
    if (userLocation) {
      setIsLoading(true);
      // Simulating API call with Indonesian store locations
      setTimeout(() => {
        setNearbyStores([{
          id: 1,
          name: 'FreshMart Grand Indonesia',
          address: 'Grand Indonesia Mall, West Mall Lt. 3A, Jl. M.H. Thamrin No.1',
          distance: '0.8 km',
          hours: '10:00 - 22:00',
          image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80'
        }, {
          id: 2,
          name: 'FreshMart Plaza Indonesia',
          address: 'Plaza Indonesia Lt. LG, Jl. M.H. Thamrin No.28-30',
          distance: '1.2 km',
          hours: '10:00 - 22:00',
          image: 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80'
        }, {
          id: 3,
          name: 'FreshMart Sarinah',
          address: 'Sarinah Building Lt. B1, Jl. M.H. Thamrin No.11',
          distance: '1.5 km',
          hours: '08:00 - 21:00',
          image: 'https://images.unsplash.com/photo-1604719312566-8912e9667d9f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80'
        }, {
          id: 4,
          name: 'FreshMart Citywalk Sudirman',
          address: 'Citywalk Sudirman Lt. 2, Jl. K.H. Mas Mansyur No.121',
          distance: '2.1 km',
          hours: '10:00 - 21:00',
          image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80'
        }]);
        setIsLoading(false);
      }, 1000);
    }
  }, [userLocation]);
  return <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Stores Near You
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We have multiple locations to serve you better. Find your nearest
            FreshMart store.
          </p>
        </div>
        {locationError && <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">{locationError}</p>
              </div>
            </div>
          </div>}
        {isLoading ? <div className="flex justify-center items-center py-10">
            <svg className="animate-spin h-8 w-8 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="ml-2 text-gray-600">
              Locating stores near you...
            </span>
          </div> : <>
            {nearbyStores.length > 0 ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {nearbyStores.map(store => <div key={store.id} className="bg-white rounded-lg overflow-hidden shadow border border-gray-200">
                    <img src={store.image} alt={store.name} className="w-full h-48 object-cover" />
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
                        <p className="text-gray-600">{store.distance} away</p>
                      </div>
                      <div className="flex items-center mb-4">
                        <ClockIcon className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0" />
                        <p className="text-gray-600">{store.hours}</p>
                      </div>
                      <Link href={`/store/${store.id}`}>
                        <a className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-full w-full transition-colors text-center">
                          Shop This Store
                        </a>
                      </Link>
                    </div>
                  </div>)}
              </div> : !locationError ? <div className="text-center py-10">
                <div className="flex justify-center mb-4">
                  <MapPinIcon className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-medium text-gray-700 mb-2">
                  Location Access Required
                </h3>
                <p className="text-gray-500 mb-6">{locationError}</p>
                <button data-retry-location className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-full transition-colors" onClick={() => {
            // This will trigger the retry in App.tsx
            if (navigator.permissions) {
              navigator.permissions.query({
                name: 'geolocation'
              }).then(result => {
                if (result.state === 'denied') {
                  window.location.href = 'chrome://settings/content/location';
                }
              });
            }
          }}>
                  Retry Location Access
                </button>
              </div> : null}
          </>}
      </div>
    </section>;
};