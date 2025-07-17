import React, { useState, useEffect } from "react";
import { IAdminStore } from "@/lib/redux/slice/adminStoreSlice";

interface StoreFormProps {
  onSubmit: (data: { name: string; address: string }) => void;
  onCancel: () => void;
  isEditing: boolean;
  editingStore: IAdminStore | null;
}

export default function StoreForm({
  onSubmit,
  onCancel,
  isEditing,
  editingStore,
}: StoreFormProps) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (isEditing && editingStore) {
      setName(editingStore.name);
      setAddress(editingStore.address);
    }
  }, [isEditing, editingStore]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, address });
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        {isEditing ? "Edit Store" : "Add New Store"}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Store Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
          />
        </div>
        <div>
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-700"
          >
            Store Address
          </label>
          <textarea
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
          />
          <p className="mt-1 text-xs text-gray-500">
            Alamat ini akan dikonversi menjadi titik lokasi peta secara
            otomatis.
          </p>
        </div>
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="bg-white py-2 px-4 border border-gray-300 rounded-md"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-green-600 text-white py-2 px-4 border rounded-md"
          >
            {isEditing ? "Update Store" : "Add Store"}
          </button>
        </div>
      </form>
    </div>
  );
}
