import React, { useState, useEffect } from 'react';
import { PlusIcon, SearchIcon } from 'lucide-react';
import { apiUrl, tempToken } from '../config';
import axios from 'axios';
import { DataTable } from '@/app/components/common/DataTable';
import { Market } from '@/lib/interface/market';

// Define the Admin and AdminStoreAssignment interfaces
interface AdminStoreAssignment {
  id: number;
  storeId: number;
  userId: number;
  store: {
    id: number;
    name: string;
  };
}

interface Admin {
  id: number;
  fullName: string;
  email: string;
  role: string;
  isVerified: boolean;
  StoreAdminAssignment: AdminStoreAssignment[];
}

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const [admins, setAdmins] = useState<Admin[]>([]);

  const handleDeleteAdmin = async (adminId: string | number) => {
    if (!window.confirm(`Are you sure you want to delete admin with ID: ${adminId}?`)) {
      return;
    }
    try {
      await axios.delete(`${apiUrl}/super-admin/store-admins/${adminId}`, {
        headers: {
          Authorization: `Bearer ${tempToken}`,
        },
      });
      alert(`Admin ${adminId} deleted successfully.`);
      fetchAdmins();
    } catch (err: any) {
      console.error('Failed to delete admin:', err);
      alert(`Failed to delete admin: ${err.response?.data?.message || err.message}`);
    }
  };

  const columns = [
    { label: 'Name', accessor: 'fullName' },
    { label: 'Email', accessor: 'email' },
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
            Authorization: `Bearer ${tempToken}`,
          }
        }
      );
      setAdmins(res.data);
    } catch (error) {
      console.error('Failed to fetch admins:', error);
      setAdmins([]);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

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
      </div>
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
            searchQuery={searchQuery}
            filterFn={(admin, search) =>
              admin.fullName.toLowerCase().includes(search.toLowerCase()) ||
              admin.email.toLowerCase().includes(search.toLowerCase()) ||
              admin.role.toLowerCase().includes(search.toLowerCase())
            }
          />
        </>
    </div>
  );
}