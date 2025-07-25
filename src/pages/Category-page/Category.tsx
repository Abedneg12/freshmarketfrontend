import React, { useEffect, useState } from 'react';
import { CategoryForm } from '@/components/category/CategoryForm';
import { PlusIcon, SearchIcon } from 'lucide-react';
import { DataTable } from '@/components/common/DataTable';
import { Category } from '@/lib/interface/category.type';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { fetchCategory } from '@/lib/redux/slice/categorySlice';

export default function CategoryPage() {
  const { token } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Get categories from redux
  const categories = useAppSelector(state => state.category.data);

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
  const handleDeleteCategory = (categoryId: string | number) => {
    alert(`Category ${categoryId} would be deleted`);
  };
  const handleFormCancel = () => {
    setShowForm(false);
  };

  const columns = [
    { label: 'Name', accessor: 'name' },
    { label: 'Product', accessor: 'Product', render: (row: Category) => Number(row.products?.length) },
  ];

  return (
    <div className="text-gray-900 space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Category Management
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage product category
          </p>
        </div>
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
      </div>
      {showForm ? (
        <CategoryForm onCancel={handleFormCancel} isEditing={isEditing} editingCategory={editingCategory ?? undefined} />
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
            data={categories}
            onEdit={handleEditCategory}
            onDelete={handleDeleteCategory}
            searchQuery={searchQuery}
            filterFn={(category, search) => category.name.toLowerCase().includes(search.toLowerCase())}
          />
        </>
      )}
    </div>
  );
}