import React, { useState, useEffect } from 'react';
import { PlusIcon, SearchIcon } from 'lucide-react';
import { apiUrl, tempToken } from '../config';
import axios from 'axios';
import router from 'next/router';
import { DataTable } from '@/app/components/common/DataTable';

export default function AdminsPage() {
  const [showForm, setShowForm] = useState(false);
  const handleAddAdmin = () => {
    setEditingAdmin(null);
    setShowForm(true);
  };
  const handleEditAdmin = (admin: Admin) => {
    setEditingAdmin(admin);
    setShowForm(true);
  };
  const handleDeleteAdmin = async (adminId: string | number) => {
    alert(`Admin ${adminId} would be deleted`);
    try {
      await axios.delete(`${apiUrl}/super-admin/store-admins/${adminId}`, {
        headers: {
          Authorization: `Bearer ${tempToken}`,
          'Content-Type': 'application/json',
        },
      });
      setRefresh(r => !r);
    } catch (err) {
      alert(`Fail to delete admin`);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // if (!auth.token) {
      //   toast.error('Authorization token missing');
      //   return;
      // }
      const formData = new FormData(e.currentTarget as HTMLFormElement);
      if (editingAdmin) {
        await axios.put(`${apiUrl}/super-admin/store-admins/${editingAdmin.id}`, formData, {
          headers: {
            Authorization: `Bearer ${tempToken}`,
            'Content-Type': 'application/json',
          },
        });
        alert(`Admin is updated`);
      } else {
        await axios.post(`${apiUrl}/super-admin/store-admins`, formData, {
          headers: {
            Authorization: `Bearer ${tempToken}`,
            'Content-Type': 'application/json',
          },
        });
        alert(`Admin is added`);
      }
      setShowForm(false);
    } catch (err) {
      alert(`Fail to add Admin`);
    }
  };

  const columns = [
    { label: 'Name', accessor: 'fullName' },
    { label: 'Email', accessor: 'email' },
    { label: 'Role', accessor: 'role' },
    {
      label: 'Stores',
      accessor: 'StoreAdminAssignment',
      render: (admin: any) =>
        admin.StoreAdminAssignment.map((store: any) => store.name).join(', ')
    },
    {
      label: 'Status',
      accessor: 'isVerified',
      render: (admin: any) =>
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${admin.isVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {admin.isVerified ? 'Verified' : 'Not Verified'}
        </span>
    }
  ];

  const [admins, setAdmins] = useState<Admin[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const res = await axios.get(
          `${apiUrl}/super-admin/users`,
          {
            headers: {
              Authorization: `Bearer ${tempToken}`,
            }
          }
        );
        setAdmins(res.data as Admin[]);
      } catch (error) {
        setAdmins([]);
      }
    };
    fetchAdmins();
  }, [showForm, refresh]);

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
      <form onSubmit={handleSubmit}>
        <div className="text-black grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-black">
              Full Name
            </label>
            <input defaultValue={editingAdmin ? editingAdmin.fullName : ''} type="text" name="fullName" id="fullName" className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-black">
              Email Address
            </label>
            <input defaultValue={editingAdmin ? editingAdmin.email : ''} type="email" name="email" id="email" className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border" />
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
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            {editingAdmin ? 'Update Admin' : 'Add Admin'}
          </button>
        </div>
      </form>
    </div> :
      <>
        <div>
          <label htmlFor="search" className="sr-only">
            Search Admins
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input type="text" name="search" id="search" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="text-black focus:ring-green-500 focus:border-green-500 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 sm:text-sm" placeholder="Search Admin" />
          </div>
        </div><DataTable
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
      </>}
  </div>;
};
