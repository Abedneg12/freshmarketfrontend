import React, { useState, useEffect } from 'react';
import { PlusIcon, SearchIcon } from 'lucide-react';
import { apiUrl } from '../config';
import axios from 'axios';
import { DataTable } from '@/components/common/DataTable';
import { Market } from '@/lib/interface/market';
import { useAppSelector } from '@/lib/redux/hooks';
import { Admin, StoreAdminAssignment } from '@/lib/interface/admins.type';

export default function AdminsPage() {
  const { token } = useAppSelector((state) => state.auth);
  const [showForm, setShowForm] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedStoreIds, setSelectedStoreIds] = useState<number[]>([]);

  const [admins, setAdmins] = useState<Admin[]>([]);
  const [stores, setStores] = useState<Market[]>([]);

  useEffect(() => {
    if (editingAdmin) {
      setFullName(editingAdmin.fullName);
      setEmail(editingAdmin.email);
      setPassword('');
      setSelectedStoreIds(editingAdmin.StoreAdminAssignment.map(a => Number(a.storeId)));

    } else {
      setFullName('');
      setEmail('');
      setPassword('');
      setSelectedStoreIds([]);
    }
  }, [editingAdmin]);

  const handleAddAdmin = () => {
    setEditingAdmin(null);
    setShowForm(true);
  };

  const handleEditAdmin = (admin: Admin) => {
    setEditingAdmin(admin);
    setShowForm(true);
  };

  const handleDeleteAdmin = async (adminId: string | number) => {
    if (!window.confirm(`Are you sure you want to delete admin with ID: ${adminId}?`)) {
      return;
    }
    try {
      await axios.delete(`${apiUrl}/super-admin/store-admins/${adminId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert(`Admin ${adminId} deleted successfully.`);
      fetchAdmins();
    } catch (err: any) {
      console.error('Failed to delete admin:', err);
      alert(`Failed to delete admin: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const dataToSend = {
      fullName,
      email,
      ...(password && { password }),
      storeIds: selectedStoreIds,
    };

    try {
      if (editingAdmin) {
        await axios.put(`${apiUrl}/super-admin/store-admins/${editingAdmin.id}`, dataToSend, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        alert(`Admin updated successfully.`);
      } else {
        if (!dataToSend.password) {
          alert('Password is required for new admin accounts.');
          return;
        }
        await axios.post(`${apiUrl}/super-admin/store-admins`, dataToSend, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        alert(`Admin added successfully.`);
      }
      setShowForm(false);
      fetchAdmins();
    } catch (err: any) {
      console.error('Failed to save admin:', err);
      alert(`Failed to save admin: ${err.response?.data?.message || err.message}`);
    }
  };

  const columns = [
    { label: 'Name', accessor: 'fullName' },
    { label: 'Email', accessor: 'email' },
    { label: 'Role', accessor: 'role' },
    {
      label: 'Stores',
      accessor: 'StoreAdminAssignment',
      render: (admin: Admin) =>
        admin.StoreAdminAssignment && admin.StoreAdminAssignment.length > 0
          ? admin.StoreAdminAssignment.map((assignment: StoreAdminAssignment) => assignment.store.name).join(', ')
          : 'N/A'
    },
    {
      label: 'Status',
      accessor: 'isVerified',
      render: (admin: Admin) =>
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${admin.isVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {admin.isVerified ? 'Verified' : 'Not Verified'}
        </span>
    }
  ];

  const fetchAdmins = async () => {
    try {
      const res = await axios.get<Admin[]>(
        `${apiUrl}/super-admin/users`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );
      setAdmins(res.data.filter(user => user.role === 'STORE_ADMIN'));
    } catch (error) {
      console.error('Failed to fetch admins:', error);
      setAdmins([]);
    }
  };

  const fetchStores = async () => {
    try {
      const res = await axios.get<Market[]>(
        `${apiUrl}/stores/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );
      setStores(res.data);
    } catch (error) {
      console.error('Failed to fetch stores:', error);
      setStores([]);
    }
  };

  useEffect(() => {
    fetchAdmins();
    fetchStores();
  }, [showForm]);

  return (
    <div className="space-y-6">
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
      {showForm ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
          <h3 className="text-lg leading-6 font-medium text-black mb-4">
            {editingAdmin ? 'Edit Admin' : 'Add New Admin'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="text-black grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-black">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  type="text"
                  name="fullName"
                  id="fullName"
                  required
                  className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-black">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  name="email"
                  id="email"
                  required
                  className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
                  readOnly={!!editingAdmin}
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-black">
                  Password {editingAdmin ? '(Leave blank to keep current)' : <span className="text-red-500">*</span>}
                </label>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  name="password"
                  id="password"
                  {...(!editingAdmin && { required: true })}
                  className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
                />
              </div>
              <div>
                <label htmlFor="stores" className="block text-sm font-medium text-black">
                  Assigned Stores
                </label>
                <select
                  id="stores"
                  name="stores"
                  multiple
                  value={selectedStoreIds.map(String)}
                  onChange={(e) =>
                    setSelectedStoreIds(
                      Array.from(e.target.selectedOptions, (option) =>
                        parseInt(option.value)
                      )
                    )
                  }
                  className="text-black mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm h-48"
                >
                  {stores.map((store) => (
                    <option key={store.id} value={store.id}>
                      {store.name}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  Hold Ctrl/Cmd to select multiple stores
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 mr-3"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                {editingAdmin ? 'Update Admin' : 'Add Admin'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <>
          <div>
            <label htmlFor="search" className="sr-only">
              Search Admins
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
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-black focus:ring-green-500 focus:border-green-500 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 sm:text-sm"
                placeholder="Search Admin"
              />
            </div>
          </div>
          <DataTable
            columns={columns}
            data={admins}
            onEdit={handleEditAdmin}
            onDelete={handleDeleteAdmin}
            searchQuery={searchQuery}
            filterFn={(admin, search) =>
              admin.fullName.toLowerCase().includes(search.toLowerCase()) ||
              admin.email.toLowerCase().includes(search.toLowerCase()) ||
              admin.role.toLowerCase().includes(search.toLowerCase())
            }
          />
        </>
      )}
    </div>
  );
}