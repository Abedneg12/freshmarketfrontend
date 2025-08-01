import React, { useEffect, useState } from 'react';
import { DataTable } from '@/components/common/DataTable';
import { apiUrl } from '../config';
import axios from 'axios';
import { useAppSelector } from '@/lib/redux/hooks';
import LoadingSpinner from '@/components/common/LoadingSpinner';

interface InventoryJournal {
  id: number;
  productId: number;
  storeId: number;
  type: 'IN' | 'OUT';
  quantity: number;
  note?: string | null;
  createdAt: string;
  product: {
    name: string;
    images: { imageUrl: string }[];
  };
  store: {
    name: string;
  };
}

export default function InventoryJournalPage() {
  const { token } = useAppSelector((state) => state.auth);
  const [journalEntries, setJournalEntries] = useState<InventoryJournal[]>([]);
  const [isLoading, setLoading] = useState(true);

  const fetchJournal = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${apiUrl}/inventory/journal`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setJournalEntries(res.data as InventoryJournal[]);
    } catch (error: any) {
      console.error('Failed to fetch inventory journal:', error);
      alert('Failed to fetch inventory journal');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchJournal();
    }
  }, [token]);

  const columns = [
    {
      label: 'Date',
      accessor: 'createdAt',
      render: (entry: InventoryJournal) => new Date(entry.createdAt).toLocaleString(),
    },
    {
      label: 'Product',
      accessor: 'product',
      render: (entry: InventoryJournal) => (
        <div className="flex items-center">
          <img
            src={entry.product.images?.[0]?.imageUrl}
            alt={entry.product.name}
            className="h-10 w-10 rounded-full object-cover mr-4"
          />
          <span>{entry.product.name}</span>
        </div>
      ),
    },
    {
      label: 'Store',
      accessor: 'store',
      render: (entry: InventoryJournal) => entry.store.name,
    },
    {
      label: 'Type',
      accessor: 'type',
      render: (entry: InventoryJournal) => (
        <span
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
            entry.type === 'IN'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {entry.type}
        </span>
      ),
    },
    {
      label: 'Quantity',
      accessor: 'quantity',
      render: (entry: InventoryJournal) => (
        <span className={`font-semibold ${entry.type === 'IN' ? 'text-green-600' : 'text-red-600'}`}>
          {entry.type === 'IN' ? '+' : '-'}{entry.quantity}
        </span>
      ),
    },
    {
      label: 'Note',
      accessor: 'note',
      render: (entry: InventoryJournal) => entry.note || '-',
    },
  ];

  return (
    <div className="text-black space-y-6 p-4 md:p-8">
      <div className="md:flex md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Inventory Journal
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            A log of all stock movements across all stores.
          </p>
        </div>
      </div>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <DataTable
          columns={columns}
          data={journalEntries}
        />
      )}
    </div>
  );
}
