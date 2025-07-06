import React, { useEffect, useState } from 'react';
import { XIcon, PlusIcon, ImageIcon } from 'lucide-react';
import { Market } from '@/lib/interface/market';
import { apiUrl, tempToken } from '@/pages/config';
import { Category } from '@/lib/interface/category.type';
import axios from 'axios';
import { InventoryStock, Product } from '@/lib/interface/product.type';

// Define the shape of the data that onSubmit will receive
interface ProductFormData {
  name: string;
  categoryId: string;
  basePrice: string; // Keep as string here, convert to number in parent
  description: string;
  images: string[];
  storeAllocations: InventoryStock[];
}

interface ProductFormProps {
  // THIS IS THE CRUCIAL CHANGE:
  // onSubmit should now accept ProductFormData, not React.FormEvent
  onSubmit: (data: ProductFormData) => void;
  onCancel: () => void;
  isEditing: boolean;
  editingProduct?: Product | null;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  onSubmit,
  onCancel,
  isEditing,
  editingProduct,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [storeAllocations, setStoreAllocations] = useState<InventoryStock[]>([]);
  const [selectedStore, setSelectedStore] = useState('');
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [basePrice, setBasePrice] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [quantity, setQuantity] = useState('');

  const markets = [{
    id: 1,
    name: 'Downtown Grocery'
  }, {
    id: 2,
    name: 'Westside Market'
  }, {
    id: 3,
    name: 'Northside Pantry'
  }];

  useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name || '');
      setCategoryId(editingProduct.category?.id?.toString() || '');
      setBasePrice(editingProduct.basePrice?.toString() || '');
      setDescription(editingProduct.description || '');
      setImages(editingProduct.images?.map(img => img.imageUrl) || []);
      setStoreAllocations(editingProduct.storeAllocation || []);
    }
  }, [editingProduct]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // You are correctly handling image previews here.
      // For actual submission, you might need to upload these files
      // to a server and get their URLs, or encode them (e.g., base64).
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setImages(prev => [...prev, ...newImages]);
    }
  };
  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const addStoreAllocation = () => {
    if (selectedStore && quantity && !isNaN(parseInt(quantity))) {
      const store = markets.find(m => String(m.id) === selectedStore);
      if (store) {
        setStoreAllocations(prev => [...prev, {
          storeId: store.id,
          quantity: parseInt(quantity),
          type: 'IN',
        } as InventoryStock]);
      }
      setSelectedStore('');
      setQuantity('');
    }
  };
  const removeStoreAllocation = (storeId: number) => {
    setStoreAllocations(prev => prev.filter(allocation => allocation.storeId !== storeId));
  };

  const handleSubmit = () => {
    onSubmit({
      name,
      categoryId,
      basePrice,
      description,
      images, // `images` state already holds the URLs/base64 strings
      storeAllocations,
    });
  };

  useEffect(() => {
    const fetchCaregories = async () => {
      try {
        const res = await axios.get(
          `${apiUrl}/category`,
          {
            headers: {
              Authorization: `Bearer ${tempToken}`
            }
          }
        );
        setCategories(res.data as Category[]);
      } catch (error) {
        alert('Failed to fetch Categories');
        console.error('Failed to fetch Categories:', error);
        setCategories([]);
      }
    };

    const fetchMarket = async () => {
      try {
        const res = await axios.get(
          `${apiUrl}/category`, // This should likely be `${apiUrl}/market`
          {
            headers: {
              Authorization: `Bearer ${tempToken}`
            }
          }
        );
      } catch (error) {
        alert('Failed to fetch Markets');
        console.error('Failed to fetch Markets:', error);
      }
    };

    fetchCaregories();
  }, []);

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="p-6 space-y-6">
        <h3 className="text-lg font-medium text-gray-900 border-b pb-4">
          {isEditing ? 'Edit Product' : 'Add New Product'}
        </h3>
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-8">
          {/* Basic Information */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Product Name
              </label>
              <input type="text"
                name="name"
                id="name"
                value={name}
                onChange={e => setName(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm" />
            </div>
            <div>
              <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                id="categoryId"
                name="categoryId"
                value={categoryId}
                onChange={e => setCategoryId(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm">
                <option value="">Select category</option>
                {categories.map(category => <option key={category.id} value={category.id}>
                  {category.name}
                </option>)}
              </select>
            </div>
            <div>
              <label htmlFor="basePrice" className="block text-sm font-medium text-gray-700">
                Price
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="number"
                  name="basePrice"
                  id="basePrice"
                  value={basePrice}
                  onChange={e => setBasePrice(e.target.value)}
                  step="0.01" className="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm" placeholder="0.00" />
              </div>
            </div>
          </div>
          {/* Product Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Product Images
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
              {images.map((image, index) => <div key={index} className="relative group">
                <img src={isEditing ? `${apiUrl}${image}` : image} alt={`Product ${index + 1}`} className="h-24 w-24 object-cover rounded-lg" />
                <button type="button" onClick={() => removeImage(index)} className="absolute -top-2 right-5 bg-red-100 rounded-full p-1 text-red-600 hover:bg-red-200">
                  <XIcon className="h-4 w-4" />
                </button>
              </div>)}
              <label className="h-24 w-24 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 cursor-pointer">
                <input
                  type="file"
                  name="images"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="sr-only"
                />
                <ImageIcon className="h-8 w-8 text-gray-400" />
              </label>
            </div>
          </div>
          {/* Product Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <input
              type="text"
              name="description"
              id="description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm" placeholder="Enter product description..." />
          </div>
          {isEditing && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-4">
                Store Allocation
              </h4>
              {/* Current Allocations */}
              <div className="mb-4 space-y-2">
                {storeAllocations.map(allocation => {
                  const store = markets.find(s => s.id === allocation.storeId);
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
                  <select name="store" id="store" value={selectedStore} onChange={e => setSelectedStore(e.target.value)} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm">
                    <option value="">Select store</option>
                    {markets.filter(store => !storeAllocations.some(a => a.storeId === store.id)).map(store => <option key={store.id} value={store.id}>
                      {store.name}
                    </option>)}
                  </select>
                </div>
                <div>
                  <input name="quantity" id="quantity" type="number" value={quantity} onChange={e => setQuantity(e.target.value)} placeholder="Enter quantity" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm" />
                </div>
                <div>
                  <button type="button" onClick={addStoreAllocation} disabled={!selectedStore || !quantity} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-300 disabled:cursor-not-allowed">
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Add Allocation
                  </button>
                </div>
              </div>
            </div>
          )}
          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button type="button" onClick={onCancel} className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
              {isEditing ? 'Update Product' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};