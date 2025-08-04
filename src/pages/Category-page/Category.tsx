'use client';

import React, { useEffect, useState } from 'react';
import { CategoryForm } from '@/components/category/CategoryForm';
import { PlusIcon, SearchIcon } from 'lucide-react';
import { DataTable } from '@/components/common/DataTable';
import { Category } from '@/lib/interface/category.type';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { fetchCategory } from '@/lib/redux/slice/categorySlice';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import axios from 'axios';
import { apiUrl } from '@/config';
import { toast } from 'react-toastify';
import { useAuthGuard } from '@/lib/hooks/useAuthGuard';

export default function CategoryPage() {
  useAuthGuard({ requiredRole: ["SUPER_ADMIN", "STORE_ADMIN"], redirectTo: "/login" });
  const { token, user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const { data: categories, loading } = useAppSelector(state => state.category);
  const [deleteTargetId, setDeleteTargetId] = useState<string | number | null>(null);
  const isStoreAdmin = user?.role === "STORE_ADMIN";

  useEffect(() => {
    dispatch(fetchCategory());
  }, [dispatch]);

  const handleAddCategory = () => {
    setIsEditing(false);
    setEditingCategory(null);
    setShowForm(true);
  };

  const handleEditCategory = (category: Category) => {
    setIsEditing(true);
    setEditingCategory(category);
    setShowForm(true);
  };

  // This function now just opens the confirmation modal
  const handleDeleteCategory = (categoryId: string | number) => {
    setDeleteTargetId(categoryId);
  };

  // This function executes the deletion after confirmation
  const confirmDeleteCategory = async () => {
    if (!deleteTargetId) return;
    try {
      await axios.delete(`${apiUrl}/category/${deleteTargetId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success(`Category ${deleteTargetId} deleted successfully.`);
      dispatch(fetchCategory()); // Re-fetch categories after deletion
    } catch (err: any) {
      console.error('Failed to delete category:', err);
      toast.error(`Failed to delete category: ${err.response?.data?.message || err.message}`);
    } finally {
      setDeleteTargetId(null); // Close the modal
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    dispatch(fetchCategory());
  };

  const columns = [
    { label: 'Name', accessor: 'name' },
    { label: 'Product Count', accessor: 'products', render: (row: Category) => row.products?.length || 0 },
  ];

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="text-gray-900 space-y-6">
        <div className="md:flex md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Category Management
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage product categories for your stores.
            </p>
          </div>
          {!isStoreAdmin && (
            <div className="mt-4 flex md:mt-0">
              <button
                type="button"
                onClick={handleAddCategory}
                className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                Add Category
              </button>
            </div>
          )}
        </div>
        {showForm ? (
          <CategoryForm onCancel={handleFormCancel} isEditing={isEditing} editingCategory={editingCategory ?? undefined} />
        ) : loading ? (
          <LoadingSpinner />
        ) : (
          <>
            <div>
              <label htmlFor="search" className="sr-only">
                Search Category
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  name="search"
                  id="search"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="focus:ring-green-500 focus:border-green-500 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 sm:text-sm"
                  placeholder="Search Categories"
                />
              </div>
            </div>
            <DataTable
              columns={columns}
              data={filteredCategories}
              onEdit={isStoreAdmin ? undefined : handleEditCategory}
              onDelete={isStoreAdmin ? undefined : handleDeleteCategory}
            />
          </>
        )}
      </div>
      {/* --- Confirmation Modal --- */}
      {deleteTargetId !== null && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 text-gray-900">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-2">Confirm Deletion</h2>
            <p className="mb-4 text-gray-700">
              Are you sure you want to delete category with ID: {deleteTargetId}? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteTargetId(null)}
                className="px-3 py-1 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteCategory}
                className="px-3 py-1 rounded-md bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}