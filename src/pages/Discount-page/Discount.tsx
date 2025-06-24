import React, { useState } from 'react';
import { DiscountTable } from './components/DiscountTable';
import { DiscountForm } from './components/DiscountForm';
import { PlusIcon, SearchIcon } from 'lucide-react';
export default function DiscountPage() {
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const categories = ['Produce', 'Dairy', 'Bakery', 'Meat', 'Frozen', 'Beverages', 'Snacks', 'Canned Goods'];
  const handleAddDiscount = () => {
    setIsEditing(false);
    setShowForm(true);
  };
  const handleEditDiscount = (Discount: any) => {
    setIsEditing(true);
    setShowForm(true);
  };
  const handleDeleteDiscount = (DiscountId: string) => {
    alert(`Discount ${DiscountId} would be deleted`);
  };
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowForm(false);
  };
  const handleFormCancel = () => {
    setShowForm(false);
  };
  return <div className=" text-gray-900 space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Discount Management
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage Discounts and other promostions for your store. Create, edit, and delete Discounts as needed.
          </p>
        </div>
        <div className="mt-4 flex md:mt-0">
          <button type="button" onClick={handleAddDiscount} className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Add Discount
          </button>
        </div>
      </div>
      {/* Search and Filter Section */}
      <div className="bg-white p-4 shadow rounded-lg">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="search" className="sr-only">
              Search Discounts
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input type="text" name="search" id="search" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="focus:ring-green-500 focus:border-green-500 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 sm:text-sm" placeholder="Search Discounts" />
            </div>
          </div>
          <div>
            <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md">
              <option value="">All Categories</option>
              {categories.map(category => <option key={category} value={category}>
                  {category}
                </option>)}
            </select>
          </div>
        </div>
      </div>
      {showForm ? <DiscountForm onSubmit={handleFormSubmit} onCancel={handleFormCancel} isEditing={isEditing} /> : <DiscountTable onEdit={handleEditDiscount} onDelete={handleDeleteDiscount} searchQuery={searchQuery} selectedCategory={selectedCategory} />}
    </div>;
};