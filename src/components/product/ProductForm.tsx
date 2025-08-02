import React, { useEffect, useState } from 'react';
import { XIcon, PlusIcon, ImageIcon, MinusIcon } from 'lucide-react';
import { Market } from '@/lib/interface/market';
import { apiUrl } from '@/config';
import { Category } from '@/lib/interface/category.type';
import axios from 'axios';
import { Product, StoreStock } from '@/lib/interface/product.type';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { fetchMarket } from '@/lib/redux/slice/storeSlice';
import { fetchRecommendations } from '@/lib/redux/slice/nearestStoreSlice';

interface ProductFormProps {
  onSubmit: (formData: FormData) => void;
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
  const { token } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const { data: markets, loading: storesLoading } = useAppSelector((state) => state.Market);
  const [categories, setCategories] = useState<Category[]>([]);
  const [storeAllocations, setStoreAllocations] = useState<StoreStock[]>([]);
  const [selectedStore, setSelectedStore] = useState('');
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [basePrice, setBasePrice] = useState('');
  const [description, setDescription] = useState('');

  // Image states:
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]); // URLs of images already on the server 
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]); // Actual File objects for newly added images
  const [previewImageUrls, setPreviewImageUrls] = useState<string[]>([]); // For immediate display (URL.createObjectURL or full existing URLs)
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]); // URLs of existing images to be removed (just the filename/path part)

  const [quantity, setQuantity] = useState('');
  const [transactionType, setTransactionType] = useState<'IN' | 'OUT'>('IN');

  useEffect(() => {
    dispatch(fetchMarket());
    console.log(markets);
    if (editingProduct) {
      setName(editingProduct.name || '');
      setCategoryId(editingProduct.category?.id?.toString() || '');
      setBasePrice(editingProduct.basePrice?.toString() || '');
      setDescription(editingProduct.description || '');

      // Initialize existing image URLs and generate previews for them
      const initialExistingImageUrls = editingProduct.images?.map(img => img.imageUrl) || [];
      setExistingImageUrls(initialExistingImageUrls);
      setPreviewImageUrls(initialExistingImageUrls.map(url => `${url}`)); // Prepend apiUrl for display
      setNewImageFiles([]); // Clear any new files when switching to edit mode
      setImagesToDelete([]); // Clear deletions when starting a new edit session
      setStoreAllocations([]);
    } else {
      // Clear all states for adding a new product
      setName('');
      setCategoryId('');
      setBasePrice('');
      setDescription('');
      setExistingImageUrls([]);
      setNewImageFiles([]);
      setPreviewImageUrls([]);
      setImagesToDelete([]);
      setStoreAllocations([]);
      setSelectedStore('');
      setQuantity('');
      setTransactionType('IN');
    }
  }, [editingProduct]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const filesArray = Array.from(files);
      setNewImageFiles(prev => [...prev, ...filesArray]);
      const newPreviews = filesArray.map(file => URL.createObjectURL(file));
      setPreviewImageUrls(prev => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (indexToRemove: number) => {
    // Determine if the image being removed is an existing one or a newly added one
    const existingImagesCount = existingImageUrls.length;

    if (indexToRemove < existingImagesCount) {
      const imageUrl = existingImageUrls[indexToRemove];
      setExistingImageUrls(prev => prev.filter((_, i) => i !== indexToRemove));
      setImagesToDelete(prev => [...prev, imageUrl]);
      setPreviewImageUrls(prev => prev.filter((_, i) => i !== indexToRemove));
    } else {
      // Newly added image (File object)
      const newFileIndex = indexToRemove - existingImagesCount;
      const fileToRevokeUrl = previewImageUrls[indexToRemove]; 

      setNewImageFiles(prev => prev.filter((_, i) => i !== newFileIndex));
      setPreviewImageUrls(prev => prev.filter((_, i) => i !== indexToRemove));
      URL.revokeObjectURL(fileToRevokeUrl); // Clean up memory
    }
  };

  const handleStockAdjustment = () => {
    const qty = parseInt(quantity);
    if (selectedStore && quantity && !isNaN(qty) && qty > 0) {
      const store = markets.find(m => String(m.id) === selectedStore);
      if (store) {
        setStoreAllocations(prev => [...prev, {
          storeId: store.id,
          quantity: qty,
          type: transactionType,
        } as StoreStock]);
      }
      setSelectedStore('');
      setQuantity('');
    }
  };

  const removeStoreAllocation = (index: number) => {
    setStoreAllocations(prev => prev.filter((_, i) => i !== index));
  };

  // This function will now create and pass a FormData object
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission

    const formData = new FormData();
    formData.append('name', name);
    formData.append('categoryId', categoryId);
    formData.append('basePrice', basePrice);
    formData.append('description', description);

    if (existingImageUrls.length > 0) {
      formData.append('keptImageUrls', JSON.stringify(existingImageUrls));
    }
    if (imagesToDelete.length > 0) {
      formData.append('imagesToDelete', JSON.stringify(imagesToDelete));
    }
    newImageFiles.forEach((file) => {
      formData.append(`images`, file); // Use 'images' as the key
    });
    if (storeAllocations.length > 0) {
      formData.append('storeAllocations', JSON.stringify(storeAllocations));
    }
    onSubmit(formData); // Pass the FormData object to the parent
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          `${apiUrl}/category`,
          {
            headers: {
              Authorization: `Bearer ${token}`
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
    fetchCategories();
    dispatch(fetchMarket());
  }, [dispatch]);

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="p-6 space-y-6">
        <h3 className="text-lg font-medium text-gray-900 border-b pb-4">
          {isEditing ? 'Edit Product' : 'Add New Product'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-8">
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
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
              {previewImageUrls.map((image, index) => (
                <div key={image} className="relative group">
                  <img src={image} alt={`Product ${index + 1}`} className="h-24 w-24 object-cover rounded-lg" />
                  <button type="button" onClick={() => removeImage(index)} className="absolute -top-2 right-5 bg-red-100 rounded-full p-1 text-red-600 hover:bg-red-200">
                    <XIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}
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
                Store Stock Adjustments
              </h4>
              <div className="mb-4 space-y-2">
                <p className="text-sm font-medium text-gray-700">Current Stock Levels:</p>
                {editingProduct?.stocks?.map(market => {
                  const currentStock = editingProduct?.stocks?.find(s => s.storeId === market.storeId);
                  return (
                    <div key={`current-stock-${market.id}`} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                      <span className="text-sm text-gray-700">{market.store.name}</span>
                      <span className="text-sm text-gray-600">
                        {currentStock ? currentStock.quantity : 0} units
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* New Stock Adjustment */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 items-end">
                <div>
                  <label htmlFor="selectStore" className="block text-sm font-medium text-gray-700">
                    Store
                  </label>
                  <select name="store" id="selectStore" value={selectedStore} onChange={e => setSelectedStore(e.target.value)} className="block w-full rounded-md border-gray-30-0 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm">
                    <option value="">Select store</option>
                    {markets.map(store => <option key={store.id} value={store.id}>
                      {store.name}
                    </option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="transactionType" className="block text-sm font-medium text-gray-700">
                    Type
                  </label>
                  <select
                    id="transactionType"
                    value={transactionType}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setTransactionType(e.target.value as 'IN' | 'OUT')}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                  >
                    <option value="IN">Add Stock</option>
                    <option value="OUT">Remove Stock</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                    Quantity
                  </label>
                  <input name="quantity" id="quantity" type="number" value={quantity} onChange={e => setQuantity(e.target.value)} placeholder="Enter quantity" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm" />
                </div>
                <div>
                  <button type="button" onClick={handleStockAdjustment} disabled={!selectedStore || !quantity || parseInt(quantity) <= 0} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-300 disabled:cursor-not-allowed">
                    {transactionType === 'IN' ? (
                      <PlusIcon className="h-4 w-4 mr-2" />
                    ) : (
                      <MinusIcon className="h-4 w-4 mr-2" />
                    )}
                    {transactionType === 'IN' ? 'Add Stock' : 'Remove Stock'}
                  </button>
                </div>
              </div>

              {/* List of pending adjustments */}
              {storeAllocations.length > 0 && (
                <div className="mt-4">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Pending Adjustments:</h5>
                  <div className="space-y-2">
                    {storeAllocations.map((allocation, index) => {
                      const store = markets.find(m => m.id === allocation.storeId);
                      return (
                        <div key={`${allocation.storeId}-${allocation.type}-${index}`} className="flex items-center justify-between bg-blue-50 p-3 rounded-md">
                          <span className="text-sm text-gray-700">
                            {store?.name}: {allocation.type === 'IN' ? '+' : '-'} {allocation.quantity} units
                          </span>
                          <button type="button" onClick={() => setStoreAllocations(prev => prev.filter((_, i) => i !== index))} className="text-red-600 hover:text-red-800">
                            <XIcon className="h-4 w-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
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