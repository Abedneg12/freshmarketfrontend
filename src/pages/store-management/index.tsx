"use client";
import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  fetchAllStores,
  createNewStore,
  updateStore,
  deleteStore,
  IAdminStore,
} from "@/lib/redux/slice/adminStoreSlice";
import { PlusIcon, LoaderIcon } from "lucide-react";
import StoreTable from "./components/StoreTable";
import StoreForm from "./components/StoreForm";

export default function StoreManagementPage() {
  const dispatch = useAppDispatch();
  const { stores, loading, error } = useAppSelector(
    (state) => state.adminStores
  );

  const [showForm, setShowForm] = useState(false);
  const [editingStore, setEditingStore] = useState<IAdminStore | null>(null);

  useEffect(() => {
    dispatch(fetchAllStores());
  }, [dispatch]);

  const handleAddClick = () => {
    setEditingStore(null);
    setShowForm(true);
  };

  const handleEditClick = (store: IAdminStore) => {
    setEditingStore(store);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingStore(null);
  };

  const handleSave = async (data: { name: string; address: string }) => {
    if (editingStore) {
      await dispatch(updateStore({ id: editingStore.id, ...data }));
    } else {
      await dispatch(createNewStore(data));
    }
    setShowForm(false);
  };

  const handleDelete = async (storeId: number) => {
    if (
      window.confirm(
        "Apakah Anda yakin ingin menghapus toko ini? Semua data terkait (stok, admin, dll) akan ikut terhapus."
      )
    ) {
      await dispatch(deleteStore(storeId));
    }
  };

  return (
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Store Management
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage all your grocery stores from one place.
          </p>
        </div>
        <div className="mt-4 flex md:mt-0">
          <button
            onClick={handleAddClick}
            className="ml-3 inline-flex items-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" /> Add Store
          </button>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center py-10">
          <LoaderIcon className="h-8 w-8 animate-spin text-green-600" />
        </div>
      )}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {!loading &&
        !error &&
        (showForm ? (
          <StoreForm
            onSubmit={handleSave}
            onCancel={handleCancel}
            isEditing={!!editingStore}
            editingStore={editingStore}
          />
        ) : (
          <StoreTable
            stores={stores}
            onEdit={handleEditClick}
            onDelete={handleDelete}
          />
        ))}
    </div>
  );
}
