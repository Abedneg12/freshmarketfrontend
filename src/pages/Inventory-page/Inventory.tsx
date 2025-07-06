import React, { useEffect, useState } from 'react';
import { ProductForm } from '../../app/components/product/ProductForm';
import { PlusIcon, SearchIcon } from 'lucide-react';
import { DataTable } from '@/app/components/common/DataTable';
import { apiUrl, tempToken } from '../config';
import { InventoryStock, Product } from '../../lib/interface/product.type';
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
  const handleDeleteProduct = (productId: string | number) => {
    // In a real app, this would delete the product
    alert(`Product ${productId} would be deleted`);
  };
  const handleFormSubmit = async (data: {
    name: string;
    categoryId: string;
    basePrice: string;
    description: string;
    images: string[];
    storeAllocations: InventoryStock[];
  }) => {
    try {
      if (isEditing && editingProduct) {
        // Prepare product data for update
        const productUpdatePayload = {
          name: data.name,
          categoryId: data.categoryId,
          basePrice: parseFloat(data.basePrice), // Convert back to number
          description: data.description,
          images: data.images.map(imageUrl => ({ imageUrl })), // Reformat if needed for your backend
        };
        
        await axios.put(
          `${apiUrl}/product/${editingProduct.id}`,
          productUpdatePayload,
          { headers: { Authorization: `Bearer ${tempToken}` } }
        );
        alert('Product updated');

        // Handle store allocations separately using the received storeAllocations
        if (editingProduct.id) {
          const allocationPromises = data.storeAllocations.map(async (allocation: InventoryStock) => {
            // Check if allocation already exists (if your API needs to differentiate create/update)
            // For simplicity, assuming these are new or updated allocations for this example
            await axios.post(
              `${apiUrl}/inventory/stock`,
              {
                productId: editingProduct.id,
                storeId: allocation.storeId,
                quantity: allocation.quantity,
                type: allocation.type, // 'IN' or whatever is relevant
              },
              { headers: { Authorization: `Bearer ${tempToken}` } }
            );
          });
          await Promise.all(allocationPromises);
          alert('Stock updated successfully');
        }

      } else {
        // Add product
        const newProductPayload = {
          name: data.name,
          categoryId: data.categoryId,
          basePrice: parseFloat(data.basePrice),
          description: data.description,
          images: data.images.map(imageUrl => ({ imageUrl })),
          storeAllocation: data.storeAllocations, // Pass allocations for new product if your API supports it
        };

        await axios.post(
          `${apiUrl}/product`,
          newProductPayload,
          { headers: { Authorization: `Bearer ${tempToken}` } }
        );
        alert('Product added');
      }
      setShowProductForm(false);
      // Optionally, refresh product list here
    } catch (err) {
      alert('Failed to save product');
      console.error(err); // Log the error for debugging
    }
  };
  const handleFormCancel = () => {
    setShowProductForm(false);
  };

  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
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
    fetchProducts();
  }, []);

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
          {product.storeAllocation?.map((store: any, idx: number) => (
            <div key={idx} className="flex justify-between">
              <span>{store.name}:</span>
              <span>{store.stock}</span>
            </div>
          ))}
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
          editingProduct={editingProduct} // Pass the product here
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