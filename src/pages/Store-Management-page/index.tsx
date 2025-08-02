"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  fetchAllStores,
  createNewStore,
  updateStore,
  deleteStore,
} from "@/lib/redux/slice/adminStoreSlice";
import { PlusIcon, SearchIcon, LoaderIcon } from "lucide-react";
import StoreTable from "@/components/market/StoreTable";
import PaginationControls from "@/components/market/PaginationControls";
import { Store } from "@/lib/interface/store.type";
import { toast } from "sonner";

// Gunakan Dynamic Import untuk StoreForm ---
const StoreForm = dynamic(() => import("@/components/market/StoreForm"), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center py-10">
      <LoaderIcon className="h-8 w-8 animate-spin text-green-600" />
    </div>
  ),
});

export default function StoreManagementPage() {
  const dispatch = useAppDispatch();
  const { stores, loading, error, currentPage, totalPages } = useAppSelector(
    (state) => state.adminStores
  );

  const [showForm, setShowForm] = useState(false);
  const [editingStore, setEditingStore] = useState<Store | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchAllStores({ page: currentPage }));
  }, [dispatch, currentPage]);

  const handlePageChange = (page: number) => {
    dispatch(fetchAllStores({ page }));
  };

  const handleAddClick = () => {
    setEditingStore(null);
    setShowForm(true);
  };

  const handleEditClick = (store: Store) => {
    setEditingStore(store);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingStore(null);
  };

  const handleSave = async (data: Partial<Store>) => {
    setIsSaving(true);
    try {
      if (editingStore) {
        await dispatch(updateStore({ id: editingStore.id, ...data })).unwrap();
        toast.success("Store updated successfully!");
      } else {
        if (data.name && data.address && data.city) {
          await dispatch(createNewStore(data as Omit<Store, "id">)).unwrap();
          toast.success("Store created successfully!");
        } else {
          throw new Error("Data tidak lengkap untuk membuat toko baru");
        }
      }
      setShowForm(false);
      setEditingStore(null);
      dispatch(fetchAllStores({ page: 1 }));
    } catch (err: any) {
      toast.error(err.message || "Failed to save store.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (storeId: number) => {
    setDeleteTarget(storeId);
  };

  const confirmDelete = async () => {
    if (deleteTarget === null) return;
    try {
      await dispatch(deleteStore(deleteTarget)).unwrap();
      toast.success("Store deleted successfully!");
      dispatch(fetchAllStores({ page: currentPage }));
    } catch (err: any) {
      toast.error(err.message || "Failed to delete store.");
    } finally {
      setDeleteTarget(null);
    }
  };

  const cancelDelete = () => setDeleteTarget(null);

  const filteredStores = Array.isArray(stores)
    ? stores.filter(
        (store) =>
          store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          store.address.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

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
        {!showForm && (
          <div className="mt-4 flex md:mt-0">
            <button
              onClick={handleAddClick}
              className="ml-3 inline-flex items-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" /> Add Store
            </button>
          </div>
        )}
      </div>

      {error && !loading && <p className="text-red-500 text-center">{error}</p>}

      {deleteTarget !== null && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-2">Konfirmasi Hapus</h2>
            <p className="mb-4 text-gray-700">
              Apakah Anda yakin ingin menghapus toko ini? Semua data terkait
              akan ikut terhapus.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={cancelDelete}
                className="px-3 py-1 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Batal
              </button>
              <button
                onClick={confirmDelete}
                className="px-3 py-1 rounded-md bg-red-600 text-white hover:bg-red-700"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {showForm ? (
        <StoreForm
          store={editingStore}
          onSave={handleSave}
          onCancel={handleCancel}
          isLoading={isSaving}
        />
      ) : (
        <>
          <div className="bg-white p-4 shadow rounded-lg">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search stores by name or address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="focus:ring-green-500 focus:border-green-500 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-black"
              />
            </div>
          </div>
          {loading ? (
            <div className="flex justify-center py-10">
              <LoaderIcon className="h-8 w-8 animate-spin text-green-600" />
            </div>
          ) : (
            <>
              <StoreTable
                stores={filteredStores}
                onEdit={handleEditClick}
                onDelete={handleDelete}
              />
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </>
      )}
    </div>
  );
}
