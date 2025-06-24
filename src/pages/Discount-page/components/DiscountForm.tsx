import React, { useState } from 'react';
import { XIcon, PlusIcon, ImageIcon } from 'lucide-react';
interface DiscountFormProps {
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isEditing: boolean;
}
interface StoreAllocation {
  storeId: string;
  quantity: number;
}
export const DiscountForm: React.FC<DiscountFormProps> = ({
  onSubmit,
  onCancel,
  isEditing
}) => {
  const [images, setImages] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [storeAllocations, setStoreAllocations] = useState<StoreAllocation[]>([]);
  const [selectedStore, setSelectedStore] = useState('');
  const [quantity, setQuantity] = useState('');
  const stores = [{
    id: '1',
    name: 'Downtown Grocery'
  }, {
    id: '2',
    name: 'Westside Market'
  }, {
    id: '3',
    name: 'Northside Pantry'
  }];
  const categories = ['Produce', 'Dairy', 'Bakery', 'Meat', 'Frozen', 'Beverages', 'Snacks', 'Canned Goods'];
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setImages(prev => [...prev, ...newImages]);
    }
  };
  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };
  const addStoreAllocation = () => {
    if (selectedStore && quantity) {
      setStoreAllocations(prev => [...prev, {
        storeId: selectedStore,
        quantity: parseInt(quantity)
      }]);
      setSelectedStore('');
      setQuantity('');
    }
  };
  const removeStoreAllocation = (storeId: string) => {
    setStoreAllocations(prev => prev.filter(allocation => allocation.storeId !== storeId));
  };
  return <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="p-6 space-y-6">
        <h3 className="text-lg font-medium text-gray-900 border-b pb-4">
          {isEditing ? 'Edit Discount' : 'Add New Discount'}
        </h3>
        <form onSubmit={onSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Discount Name
              </label>
              <input type="text" name="name" id="name" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm" />
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select id="category" name="category" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm">
                <option value="">Select category</option>
                {categories.map(category => <option key={category} value={category}>
                    {category}
                  </option>)}
              </select>
            </div>
            <div>
              <label htmlFor="sku" className="block text-sm font-medium text-gray-700">
                SKU
              </label>
              <input type="text" name="sku" id="sku" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm" />
            </div>
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Price
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input type="number" name="price" id="price" step="0.01" className="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm" placeholder="0.00" />
              </div>
            </div>
          </div>
          {/* Discount Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Discount Images
            </label>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
              {images.map((image, index) => <div key={index} className="relative group">
                  <img src={image} alt={`Discount ${index + 1}`} className="h-24 w-24 object-cover rounded-lg" />
                  <button type="button" onClick={() => removeImage(index)} className="absolute -top-2 -right-2 bg-red-100 rounded-full p-1 text-red-600 hover:bg-red-200">
                    <XIcon className="h-4 w-4" />
                  </button>
                </div>)}
              <label className="h-24 w-24 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 cursor-pointer">
                <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="sr-only" />
                <ImageIcon className="h-8 w-8 text-gray-400" />
              </label>
            </div>
          </div>
          {/* Discount Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea id="description" rows={4} value={description} onChange={e => setDescription(e.target.value)} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm" placeholder="Enter Discount description..." />
          </div>
          {/* Store Allocation */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-4">
              Store Allocation
            </h4>
            {/* Current Allocations */}
            <div className="mb-4 space-y-2">
              {storeAllocations.map(allocation => {
              const store = stores.find(s => s.id === allocation.storeId);
              return <div key={allocation.storeId} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                    <span className="text-sm text-gray-700">{store?.name}</span>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-600">
                        {allocation.quantity} units
                      </span>
                      <button type="button" onClick={() => removeStoreAllocation(allocation.storeId)} className="text-red-600 hover:text-red-800">
                        <XIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>;
            })}
            </div>
            {/* Add New Allocation */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <select value={selectedStore} onChange={e => setSelectedStore(e.target.value)} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm">
                  <option value="">Select store</option>
                  {stores.filter(store => !storeAllocations.some(a => a.storeId === store.id)).map(store => <option key={store.id} value={store.id}>
                        {store.name}
                      </option>)}
                </select>
              </div>
              <div>
                <input type="number" value={quantity} onChange={e => setQuantity(e.target.value)} placeholder="Enter quantity" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm" />
              </div>
              <div>
                <button type="button" onClick={addStoreAllocation} disabled={!selectedStore || !quantity} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-300 disabled:cursor-not-allowed">
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Allocation
                </button>
              </div>
            </div>
          </div>
          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button type="button" onClick={onCancel} className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
              {isEditing ? 'Update Discount' : 'Add Discount'}
            </button>
          </div>
        </form>
      </div>
    </div>;
};