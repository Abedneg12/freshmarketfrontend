import React, { useState } from 'react';
import { AdminTable } from './components/AdminTable';
import { PlusIcon } from 'lucide-react';
export default function AdminsPage() {
  const [showForm, setShowForm] = useState(false);
  const handleAddAdmin = () => {
    setShowForm(true);
  };
  const handleEditAdmin = (admin: any) => {
    // In a real app, this would populate the form with admin data
    setShowForm(true);
  };
  const handleDeleteAdmin = (adminId: string) => {
    // In a real app, this would delete the admin
    alert(`Admin ${adminId} would be deleted`);
  };
  return <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Admin Account Management
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage store admin accounts and permissions.
          </p>
        </div>
        <div className="mt-4 flex md:mt-0">
          <button type="button" onClick={handleAddAdmin} className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Add Admin
          </button>
        </div>
      </div>
      {showForm ? <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
          <h3 className="text-lg leading-6 font-medium text-black mb-4">
            Add New Admin
          </h3>
          <form>
            <div className="text-black grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-black">
                  Full Name
                </label>
                <input type="text" name="name" id="name" className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-black">
                  Email Address
                </label>
                <input type="email" name="email" id="email" className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border" />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-black">
                  Password
                </label>
                <input type="password" name="password" id="password" className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border" />
              </div>
              <div>
                <label htmlFor="stores" className="block text-sm font-medium text-black">
                  Assigned Stores
                </label>
                <select id="stores" name="stores" multiple className="text-black mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm">
                  <option value="1">Toko pusat</option>
                  <option value="2">Toko cabang</option>
                  <option value="3">Toko Jakbar</option>
                  <option value="4">Toko Jaktim</option>
                  <option value="5">toko Jakpus</option>
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  Hold Ctrl/Cmd to select multiple stores
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button type="button" onClick={() => setShowForm(false)} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 mr-3">
                Cancel
              </button>
              <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                Add Admin
              </button>
            </div>
          </form>
        </div> : <AdminTable onEdit={handleEditAdmin} onDelete={handleDeleteAdmin} />}
    </div>;
};