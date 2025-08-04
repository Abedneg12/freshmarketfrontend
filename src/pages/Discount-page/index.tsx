import React, { useEffect, useState } from 'react';
import { DiscountForm } from '../../components/discount/DiscountForm';
import { PlusIcon, SearchIcon } from 'lucide-react';
import { apiUrl } from '../../config';
import { DataTable } from '@/components/common/DataTable';
import axios from 'axios';
import { Discount } from '@/lib/interface/discount.type';
import { useAppSelector } from '@/lib/redux/hooks';
import { useAuthGuard } from '@/middlewares/useAuthGuard';

export default function DiscountPage() {
  useAuthGuard({ requiredRole: ["SUPER_ADMIN", "STORE_ADMIN"], redirectTo: "/login" });
  const { token } = useAppSelector((state) => state.auth);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null);

  const [discounts, setDiscounts] = useState<Discount[]>([]);

  const fetchDiscounts = async () => {
    try {
      const res = await axios.get(
        `${apiUrl}/discount`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDiscounts(res.data as Discount[]);
    } catch (error) {
      alert('Failed to fetch discounts');
      setDiscounts([]);
      console.error('Failed to fetch discounts:', error);
    }
  };

  useEffect(() => {
    if (token) fetchDiscounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showForm, token]);

  const handleAddDiscount = () => {
    setIsEditing(false);
    setEditingDiscount(null);
    setShowForm(true);
  };

  const handleEditDiscount = (discount: Discount) => {
    setIsEditing(true);
    setEditingDiscount(discount);
    setShowForm(true);
  };

  const handleDeleteDiscount = async (discountId: string | number) => {
    if (!window.confirm(`Are you sure you want to delete discount ${discountId}?`)) return;
    try {
      await axios.delete(`${apiUrl}/discount/${discountId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDiscounts((prev) => prev.filter((d) => d.id !== discountId));
      alert(`Discount ${discountId} deleted successfully.`);
    } catch (error) {
      alert(`Failed to delete discount ${discountId}.`);
      console.error('Failed to delete discount:', error);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingDiscount(null);
  };

  const columns = [
    { label: 'Type', accessor: 'type' },
    { label: 'Product', accessor: 'product', render: (row: Discount) => row.product?.name || '-' },
    {
      label: 'Value',
      accessor: 'value',
      render: (row: Discount) =>
        Number(row.value)
          ? `${row.value} ${row.type === 'PERCENTAGE' ? '%' : ''}`
          : 'N/A',
    },
    {
      label: 'Start Date',
      accessor: 'startDate',
      render: (row: Discount) =>
        row.startDate ? new Date(row.startDate).toLocaleDateString() : '-',
    },
    {
      label: 'End Date',
      accessor: 'endDate',
      render: (row: Discount) =>
        row.endDate ? new Date(row.endDate).toLocaleDateString() : '-',
    },
  ];

  // Search logic: filter type, value, date, dst.
  const filteredDiscounts = discounts.filter((discount) => {
    const q = searchQuery.toLowerCase();
    return (
      discount.type.toLowerCase().includes(q) ||
      String(discount.value).toLowerCase().includes(q) ||
      (discount.startDate && new Date(discount.startDate).toLocaleDateString().includes(q)) ||
      (discount.endDate && new Date(discount.endDate).toLocaleDateString().includes(q))
    );
  });

  return (
    <div className="text-gray-900 space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Discount Management
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage Discounts and other promotions for your store. Create, edit, and delete Discounts as needed.
          </p>
        </div>
        <div className="mt-4 flex md:mt-0">
          <button
            type="button"
            onClick={handleAddDiscount}
            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Add Discount
          </button>
        </div>
      </div>
      {showForm ? (
        <DiscountForm
          onCancel={handleFormCancel}
          isEditing={isEditing}
          editingDiscount={editingDiscount}
        />
      ) : (
        <>
          <div>
            <label htmlFor="search" className="sr-only">
              Search Discounts
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
                className="focus:ring-green-500 focus:border-green-500 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 sm:text-sm"
                placeholder="Search Discounts"
              />
            </div>
          </div>
          <DataTable
            columns={columns}
            data={filteredDiscounts}
            onEdit={handleEditDiscount}
            onDelete={handleDeleteDiscount}
            searchQuery={searchQuery}
            filterFn={() => true} // Sudah filter di atas, jadi no-op di DataTable
          />
        </>
      )}
    </div>
  );
}
