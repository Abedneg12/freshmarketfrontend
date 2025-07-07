import React, { useState } from 'react';
import axios from 'axios';
import { apiUrl, tempToken } from '@/pages/config';
import { useRouter } from 'next/navigation';

const apiBaseUrl = apiUrl;

export const DiscountForm = ({ onCancel, isEditing }: { onCancel: () => void; isEditing: boolean }) => {
  const [discountType, setDiscountType] = useState('PERCENTAGE');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);

    const storeId = Number(formData.get('storeId'));
    const value = formData.get('value') as string;
    const startDate = formData.get('startDate') as string;
    const endDate = formData.get('endDate') as string;
    const productId = formData.get('productId') as string;
    const minPurchase = Number(formData.get('minPurchase'));
    const maxDiscount = Number(formData.get('maxDiscount'));

    let Url = '';
    let payload: any = {};

    if (discountType === 'BUY1GET1') {
      Url = `${apiBaseUrl}/discount/bogo`;
      payload = { productId, storeId, value, startDate, endDate };
    } else if (discountType === 'PERCENTAGE') {
      Url = `${apiBaseUrl}/discount/product`;
      payload = { productId, storeId, value, startDate, endDate };
    } else if (discountType === 'VOUCHER') {
      Url = `${apiBaseUrl}/discount/voucher`;
      payload = { storeId, value, minPurchase, maxDiscount, startDate, endDate };
    }

    try {
      await axios.post(Url, payload, {
        headers: {
          Authorization: `Bearer ${tempToken}`,
          'Content-Type': 'application/json',
        },
      });
      alert('Discount created!');
      onCancel();
    } catch (err) {
      alert('Failed to create discount');
    }
  };

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
              <option value="VOUCHER">Voucher</option>
            </select>
          </div>
          {/* Store ID */}
          <div>
            <label htmlFor="storeId" className="block text-sm font-medium text-black">
              Store ID
            </label>
            <input
              type="number"
              name="storeId"
              id="storeId"
              className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
            />
          </div>
          {/* Value */}
          <div>
            <label htmlFor="value" className="block text-sm font-medium text-black">
              Value
            </label>
            <input
              type="text"
              name="value"
              id="value"
              className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
            />
          </div>
          {/* Product ID */}
          {(discountType === 'BUY1GET1' || discountType === 'PERCENTAGE') && (
            <div>
              <label htmlFor="productId" className="block text-sm font-medium text-black">
                Product ID
              </label>
              <input
                type="text"
                name="productId"
                id="productId"
                className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
              />
            </div>
          )}
          {/* Voucher fields */}
          {discountType === 'VOUCHER' && (
            <>
              <div>
                <label htmlFor="minPurchase" className="block text-sm font-medium text-black">
                  Minimum Purchase
                </label>
                <input
                  type="number"
                  name="minPurchase"
                  id="minPurchase"
                  className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
                />
              </div>
              <div>
                <label htmlFor="maxDiscount" className="block text-sm font-medium text-black">
                  Maximum Discount
                </label>
                <input
                  type="number"
                  name="maxDiscount"
                  id="maxDiscount"
                  className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
                />
              </div>
            </>
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