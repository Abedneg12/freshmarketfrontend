// pages/InventoryPage.tsx

import React, { useEffect, useState } from 'react';
import { ProductForm } from '../../app/components/product/ProductForm';
import { PlusIcon, SearchIcon } from 'lucide-react';
import { DataTable } from '@/app/components/common/DataTable';
import { apiUrl, tempToken } from '../config';
import { Product, StoreStock } from '../../lib/interface/product.type';
import axios from 'axios';
import { Category } from '@/lib/interface/category.type';

export default function InventoryPage() {
  const [showProductForm, setShowProductForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleAddProduct = () => {
    setIsEditing(false);
    setEditingProduct(null);
    setShowProductForm(true);
  };

  const handleEditProduct = (product: Product) => {
    setIsEditing(true);
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleDeleteProduct = async (productId: string | number) => {
    alert(`Product ${productId} would be deleted`);
    try {
      await axios.delete(`${apiUrl}/product/${productId}`, {
        headers: {
          Authorization: `Bearer ${tempToken}`,
          'Content-Type': 'application/json',
        },
      });
      fetchProducts();
    } catch (err) {
      alert(`Fail to delete product`);
    }
  };

  const handleFormSubmit = async (formData: FormData) => {
    try {
      let keptImageUrls: string[] = [];
      const keptImagesJson = formData.get('keptImageUrls') as string;
      if (keptImagesJson) {
        keptImageUrls = JSON.parse(keptImagesJson);
        formData.delete('keptImageUrls'); // Remove from formData after parsing
      }

      let imagesToDelete: string[] = [];
      const imagesToDeleteJson = formData.get('imagesToDelete') as string;
      if (imagesToDeleteJson) {
        imagesToDelete = JSON.parse(imagesToDeleteJson);
        formData.delete('imagesToDelete'); // Remove from formData
      }

      let storeAllocations: StoreStock[] = [];
      const storeAllocationsJson = formData.get('storeAllocations') as string;
      if (storeAllocationsJson) {
        storeAllocations = JSON.parse(storeAllocationsJson);
        formData.delete('storeAllocations'); // Remove from formData
      }

      if (isEditing && editingProduct) {
        formData.append('keptImageUrls', JSON.stringify(keptImageUrls));
        formData.append('imagesToDelete', JSON.stringify(imagesToDelete));
        formData.append('storeAllocations', JSON.stringify(storeAllocations));

        await axios.put(
          `${apiUrl}/product/${editingProduct.id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${tempToken}`,
            }
          }
        );
        alert('Product updated');

        if (editingProduct.id && storeAllocations.length > 0) {
          const adjustmentPromises = storeAllocations.map(async (allocation: StoreStock) => {
            await axios.post(
              `${apiUrl}/inventory/stock`,
              {
                productId: editingProduct.id,
                storeId: allocation.storeId,
                quantity: allocation.quantity,
                type: allocation.type,
              },
              { headers: { Authorization: `Bearer ${tempToken}` } }
            );
          });
          await Promise.all(adjustmentPromises);
          alert('Stock adjustments applied successfully');
        }

      } else {
        if (storeAllocations.length > 0) {
          formData.append('storeAllocations', JSON.stringify(storeAllocations));
        }
        const res = await axios.post(
          `${apiUrl}/product`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${tempToken}`,
            }
          }
        );
        alert('Product added');

        const newProductId = (res.data as Product).id;
        if (newProductId && storeAllocations.length > 0) {
          const allocationPromises = storeAllocations.map(async (allocation: StoreStock) => {
            await axios.post(
              `${apiUrl}/inventory/stock`,
              {
                productId: newProductId,
                storeId: allocation.storeId,
                quantity: allocation.quantity,
                type: allocation.type,
              },
              { headers: { Authorization: `Bearer ${tempToken}` } }
            );
          });
          await Promise.all(allocationPromises);
          alert('Initial stock allocated successfully');
        }
      }

      setShowProductForm(false);
      fetchProducts();
    } catch (err) {
      alert('Failed to save product');
      console.error('Save product error:', err);
    }
  };

  const handleFormCancel = () => {
    setShowProductForm(false);
  };

  const [products, setProducts] = useState<Product[]>([]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        `${apiUrl}/product`,
        {
          headers: {
            Authorization: `Bearer ${tempToken}`
          }
        }
      );
      setProducts(res.data as Product[]);
    } catch (error) {
      alert('Failed to fetch Products');
      console.error('Failed to fetch Products:', error);
      setProducts([]);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

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

  const columns = [
    {
      label: "Product",
      accessor: "name",
      render: (product: Product) => (
        <div className="flex items-center">
          <img
            src={`${apiUrl}${product.images?.[0]?.imageUrl}`}
            alt={product.name}
            className="h-10 w-10 rounded-full object-cover"
          />
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{product.name}</div>
          </div>
        </div>
      ),
    },
    {
      label: "Category",
      accessor: "category",
      render: (product: Product) => product.category?.name || "-"
    },
    {
      label: "Price",
      accessor: "price",
      render: (product: Product) => `Rp.${product.basePrice}`,
    },
    {
      label: "Total Stock",
      accessor: "totalStock",
      render: (product: Product) => `${product.stocks?.reduce((total, stock) => total + stock.quantity, 0) || 0}`,
    },
    {
      label: "Store Distribution",
      accessor: "stores",
      render: (product: Product) => (
        <div className="space-y-1">
          {product.stocks?.map((storeStock: StoreStock, idx: number) => {
            return (
              <div key={idx} className="flex space-x-2">
                <span>{storeStock?.store.name}:</span>
                <span>{storeStock?.quantity}</span>
              </div>
            );
          })}
        </div>
      ),
    },
  ];

  return (
    <div className="text-black space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Inventory Management
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage products and stock levels across all stores.
          </p>
        </div>
        <div className="mt-4 flex md:mt-0">
          <button
            type="button"
            onClick={handleAddProduct}
            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Add Product
          </button>
        </div>
      </div>
      {showProductForm ? (
        <ProductForm
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          isEditing={isEditing}
          editingProduct={editingProduct}
        />
      ) : (
        <DataTable
          columns={columns}
          data={products}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
          searchQuery={searchQuery}
          filterFn={(product, search) => {
            const matchesSearch =
              product.name.toLowerCase().includes(search.toLowerCase());
            const matchesCategory =
              selectedCategory === "" ||
              product.category.name === selectedCategory;
            return matchesSearch && matchesCategory;
          }}
        />
      )}
    </div>
  );
}