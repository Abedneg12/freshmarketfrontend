import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { apiUrl } from '@/config';
import { useRouter } from 'next/navigation';
import { Market } from '@/lib/interface/market';
import { Discount } from '@/lib/interface/discount.type';
import { useAppSelector } from '@/lib/redux/hooks';

// Define a minimal Product interface for the dropdown
interface Product {
  id: number;
  name: string;
}

export const DiscountForm = ({ onCancel, isEditing, editingDiscount }: { onCancel: () => void; isEditing: boolean; editingDiscount?: Discount | null }) => {
  const router = useRouter();
  const { token } = useAppSelector((state) => state.auth);
  // Form states
  const [discountType, setDiscountType] = useState('PERCENTAGE');
  const [selectedStoreId, setSelectedStoreId] = useState<number | ''>('');
  const [selectedValue, setSelectedValue] = useState('');
  const [selectedProductId, setSelectedProductId] = useState<number | ''>('');
  const [minPurchase, setMinPurchase] = useState<number | ''>('');
  const [maxDiscount, setMaxDiscount] = useState<number | ''>('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Data for select inputs
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);

  // Effect to fetch stores and products
  useEffect(() => {
    const fetchDropdownData = async () => {
      setLoadingData(true);
      setDataError(null);
      try {
        const productsRes = axios.get(`${apiUrl}/product`, { headers: { Authorization: `Bearer ${token}` } });
        setProducts((await productsRes).data as Product[]);
      } catch (err: any) {
        console.error('Failed to fetch dropdown data:', err);
        setDataError('Failed to load stores or products.');
      } finally {
        setLoadingData(false);
      }
    };
    fetchDropdownData();
  }, []);

  // Effect to populate form when in editing mode
  useEffect(() => {
    if (isEditing && editingDiscount) {
      console.log('Editing discount:', editingDiscount);
      setDiscountType(editingDiscount.type || 'PERCENTAGE');
      console.log(`discount type :`, editingDiscount.type);
      setSelectedStoreId(editingDiscount.storeId || '');
      setSelectedValue(editingDiscount.value || '');
      setSelectedProductId(editingDiscount.product?.id || '');
      setMinPurchase(editingDiscount.minPurchase || '');
      setMaxDiscount(editingDiscount.maxDiscount || '');
      setStartDate(editingDiscount.startDate ? new Date(editingDiscount.startDate).toISOString().split('T')[0] : '');
      setEndDate(editingDiscount.endDate ? new Date(editingDiscount.endDate).toISOString().split('T')[0] : '');
    } else {
      // Reset form for adding new discount
      //setDiscountType('PERCENTAGE');
      setSelectedStoreId('');
      setSelectedValue('');
      setSelectedProductId('');
      setMinPurchase('');
      setMaxDiscount('');
      setStartDate('');
      setEndDate('');
    }
  }, [isEditing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (discountType === "BUY1GET1" && !selectedProductId) {
      alert("Product is required for Buy 1 Get 1 discount.");
      return;
    }
    if ((discountType === "PERCENTAGE" || discountType === "NOMINAL")) {
      if (!selectedValue || isNaN(Number(selectedValue))) {
        alert("Discount value is required.");
        return;
      }
      if (discountType === "PERCENTAGE" && (Number(selectedValue) <= 0 || Number(selectedValue) > 100)) {
        alert("Percentage discount must be between 1 and 100.");
        return;
      }
    }

    let payload: any = {
      storeId: Number(selectedStoreId),
      startDate,
      endDate,
      type: discountType,
    };

    // BOGO
    if (discountType === 'BUY1GET1') {
      payload.productId = Number(selectedProductId);
    }
    // Percentage & Nominal
    if (discountType === 'PERCENTAGE' || discountType === 'NOMINAL') {
      payload.value = Number(selectedValue);
      if (selectedProductId) {
        payload.productId = Number(selectedProductId);
        // minPurchase is optional if productId is set
        if (minPurchase) payload.minPurchase = Number(minPurchase);
      } else {
        // minPurchase is required if no productId
        payload.minPurchase = Number(minPurchase);
      }
      if (discountType === 'PERCENTAGE' && maxDiscount !== '') {
        payload.maxDiscount = Number(maxDiscount);
      }
    }

    try {
      if (isEditing && editingDiscount?.id) {
        await axios.put(`${apiUrl}/discount/${editingDiscount.id}`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        alert('Discount updated!');
      } else {
        await axios.post(`${apiUrl}/discount`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        alert('Discount created!');
      }
      onCancel();
    } catch (err: any) {
      console.error('Failed to save discount:', err);
      alert(`Failed to save discount: ${err.response?.data?.message || err.message}`);
    }
  };

  if (loadingData) {
    return <div className="text-center text-gray-500 py-8">Loading form data...</div>;
  }

  if (dataError) {
    return <div className="text-center text-red-600 py-8">{dataError}</div>;
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
      <h3 className="text-lg leading-6 font-medium text-black mb-4">
        {isEditing ? 'Edit Discount' : 'Add New Discount'}
      </h3>
      <form onSubmit={handleSubmit}>
        <div className="text-black grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Discount Type */}
          <div>
            <label htmlFor="discountType" className="block text-sm font-medium text-black">
              Discount Type
            </label>
            <select
              id="discountType"
              name="discountType"
              value={discountType}
              onChange={e => setDiscountType(e.target.value)}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
            >
              <option value="PERCENTAGE">Percentage</option>
              <option value="BUY1GET1">Buy 1 Get 1</option>
              <option value="NOMINAL">Nominal</option>
            </select>
          </div>
          {/* Product Select */}
          {(discountType === 'BUY1GET1' || discountType === 'PERCENTAGE' || discountType === 'NOMINAL') && (
            <div>
              <label htmlFor="productId" className="block text-sm font-medium text-black">
                Product
              </label>
              <select
                id="productId"
                name="productId"
                value={selectedProductId}
                onChange={e => setSelectedProductId(Number(e.target.value))}
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              >
                <option value="">Select a product</option>
                {products.map(product => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Value */}
          {(discountType === 'PERCENTAGE' || discountType === 'NOMINAL') && (
            <div>
              <label htmlFor="value" className="block text-sm font-medium text-black">
                Value {discountType === 'PERCENTAGE' ? '(%)' : '(Nominal)'}
              </label>
              <input
                type="number"
                name="value"
                id="value"
                value={selectedValue}
                min={discountType === 'PERCENTAGE' ? 1 : 0}
                max={discountType === 'PERCENTAGE' ? 100 : undefined}
                onChange={e => {
                  const val = e.target.value;
                  if (discountType === 'PERCENTAGE' && Number(val) > 100) {
                    setSelectedValue('100');
                  } else {
                    setSelectedValue(val);
                  }
                }}
                className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
              />
              {discountType === 'PERCENTAGE' && Number(selectedValue) > 100 && (
                <p className="text-red-500 text-xs mt-1">Percentage cannot be more than 100.</p>
              )}
            </div>
          )}

          {/* minPurchase for cart-wide */}
          {(discountType === 'PERCENTAGE' || discountType === 'NOMINAL') && !selectedProductId && (
            <div>
              <label htmlFor="minPurchase" className="block text-sm font-medium text-black">
                Minimum Purchase
              </label>
              <input
                type="number"
                name="minPurchase"
                id="minPurchase"
                value={minPurchase}
                onChange={e => setMinPurchase(Number(e.target.value))}
                className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
              />
            </div>
          )}

          {/* maxDiscount for percentage */}
          {discountType === 'PERCENTAGE' && (
            <div>
              <label htmlFor="maxDiscount" className="block text-sm font-medium text-black">
                Maximum Discount
              </label>
              <input
                type="number"
                name="maxDiscount"
                id="maxDiscount"
                value={maxDiscount}
                onChange={e => setMaxDiscount(Number(e.target.value))}
                className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
              />
            </div>
          )}
          {/* Dates */}
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-black">
              Start Date
            </label>
            <input
              type="date"
              name="startDate"
              id="startDate"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              required
              className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
            />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-black">
              End Date
            </label>
            <input
              type="date"
              name="endDate"
              id="endDate"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              required
              className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 mr-3"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            {isEditing ? 'Update Discount' : 'Add Discount'}
          </button>
        </div>
      </form>
    </div>
  );
};