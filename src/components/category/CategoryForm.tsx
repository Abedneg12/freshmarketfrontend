import React, { useState } from 'react';
import axios from 'axios';
import { apiUrl, tempToken } from '@/pages/config';

export const CategoryForm = ({
  onCancel,
  isEditing,
  editingCategory, // Pass the category object when editing
  onSuccess,       // Optional: callback to refresh list
}: {
  onCancel: () => void;
  isEditing: boolean;
  editingCategory?: { id: number; name: string };
  onSuccess?: () => void;
}) => {
  const [name, setName] = useState(editingCategory?.name || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEditing && editingCategory) {
        await axios.put(
          `${apiUrl}/category/${editingCategory.id}`,
          { name },
          {
            headers: {
              Authorization: `Bearer ${tempToken}`,
              'Content-Type': 'application/json',
            },
          }
        );
        alert('Category updated!');
      } else {
        await axios.post(
          `${apiUrl}/category`,
          { name },
          {
            headers: {
              Authorization: `Bearer ${tempToken}`,
              'Content-Type': 'application/json',
            },
          }
        );
        alert('Category created!');
      }
      setName('');
      onCancel();
      onSuccess && onSuccess();
    } catch (err) {
      alert('Failed to save category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
      <h3 className="text-lg leading-6 font-medium text-black mb-4">
        {isEditing ? 'Edit Category' : 'Add New Category'}
      </h3>
      <form onSubmit={handleSubmit}>
        <div className="text-black grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-black">
              Category Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={name}
              onChange={e => setName(e.target.value)}
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
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            disabled={loading}
          >
            {loading ? 'Saving...' : isEditing ? 'Update Category' : 'Add Category'}
          </button>
        </div>
      </form>
    </div>
  );
};