"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  fetchAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
} from "@/lib/redux/slice/addressSlice";
import { LoaderIcon, PlusIcon } from "lucide-react";
import { IAddress } from "@/lib/interface/address";
import AddressCard from "./address-card";

const AddressForm = dynamic(() => import("./address-form"), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center py-10">
      <LoaderIcon className="h-8 w-8 animate-spin text-green-600" />
    </div>
  ),
});

export default function AddressManagement() {
  const dispatch = useAppDispatch();
  const { addresses, loading, error } = useAppSelector(
    (state) => state.address
  );

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<IAddress | null>(null);

  useEffect(() => {
    if (!isFormOpen) {
      dispatch(fetchAddresses());
    }
  }, [dispatch, isFormOpen]);

  const handleAddNew = () => {
    setEditingAddress(null);
    setIsFormOpen(true);
  };

  const handleEdit = (address: IAddress) => {
    setEditingAddress(address);
    setIsFormOpen(true);
  };

  const handleDelete = (addressId: number) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus alamat ini?")) {
      dispatch(deleteAddress(addressId));
    }
  };

  const handleSetMain = (addressId: number) => {
    const mainAddress = addresses.find((a) => a.id === addressId);
    if (mainAddress && !mainAddress.isMain) {
      dispatch(updateAddress({ addressId, addressData: { isMain: true } }));
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingAddress(null);
  };

  const handleSaveAddress = async (addressData: Partial<IAddress>) => {
    try {
      if (editingAddress) {
        await dispatch(
          updateAddress({ addressId: editingAddress.id, addressData })
        );
      } else {
        await dispatch(createAddress(addressData as Omit<IAddress, "id">));
      }
      handleCloseForm();
    } catch (err) {
      console.error("Failed to save address:", err);
    }
  };

  return (
    <div className="space-y-6">
      {isFormOpen ? (
        <AddressForm
          address={editingAddress}
          onClose={handleCloseForm}
          onSave={handleSaveAddress}
          isLoading={loading}
        />
      ) : (
        <>
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">
              Alamat Tersimpan
            </h3>
            <button
              onClick={handleAddNew}
              className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-green-700 flex items-center gap-2"
            >
              <PlusIcon className="h-4 w-4" />
              Tambah Alamat
            </button>
          </div>

          {loading && addresses.length === 0 && (
            <div className="flex justify-center py-10">
              <LoaderIcon className="h-8 w-8 animate-spin text-green-600" />
            </div>
          )}
          {error && <p className="text-red-500">{error}</p>}

          {!loading && (
            <div className="space-y-4">
              {addresses.length > 0 ? (
                addresses.map((address) => (
                  <AddressCard
                    key={address.id}
                    address={address}
                    onEdit={() => handleEdit(address)}
                    onDelete={() => handleDelete(address.id)}
                    onSetMain={() => handleSetMain(address.id)}
                  />
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">
                  Anda belum memiliki alamat tersimpan.
                </p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
