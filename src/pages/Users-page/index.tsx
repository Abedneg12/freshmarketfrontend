import React, { useState, useEffect } from 'react';
import { SearchIcon } from 'lucide-react';
import { apiUrl } from '../../config';
import axios from 'axios';
import { DataTable } from '@/components/common/DataTable';
import { useAppSelector } from '@/lib/redux/hooks';
import { Admin } from '@/lib/interface/admins.type';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function UsersPage() {
  const { token } = useAppSelector((state) => state.auth);
  const [searchQuery, setSearchQuery] = useState('');
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
    setIsLoading(true);
    try {
      const res = await axios.get<Admin[]>(
        `${apiUrl}/super-admin/users`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );
      setAdmins(res.data);
    } catch (error) {
      console.error('Failed to fetch admins:', error);
      setAdmins([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAdmins();
    }
  }, [token]);

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
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div>
            <label htmlFor="search" className="sr-only">
              Search Users
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
                placeholder="Search User"
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
      )}
    </div>
  );
}