"use client";

import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  fetchAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setMainAddress,
} from "@/lib/redux/slice/addressSlice";
import { LoaderIcon, PlusIcon } from "lucide-react";
import { IAddress } from "@/lib/interface/address";
import AddressCard from "./address-card";
import AddressForm from "./address-form";

export default function AddressManagement() {
  const dispatch = useAppDispatch();
  const { addresses, loading, error } = useAppSelector(
    (state) => state.address
  );
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<IAddress | null>(null);

  useEffect(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);

  console.log('Addresses:', addresses);
  const handleOpenForm = (address: IAddress | null) => {
    setEditingAddress(address);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingAddress(null);
  };

  const handleSaveAddress = async (data: any) => {
    if (editingAddress) {
      await dispatch(updateAddress({ id: editingAddress.id, ...data }));
    } else {
      await dispatch(createAddress(data));
    }
    handleCloseForm();
    dispatch(fetchAddresses());
  };

  const handleDeleteAddress = async (id: number) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus alamat ini?")) {
      await dispatch(deleteAddress(id));
    }
  };

  const handleSetMainAddress = async (id: number) => {
    await dispatch(setMainAddress(id));
    dispatch(fetchAddresses());
  };

  if (loading && addresses.length === 0) {
    return (
      <div className="flex justify-center items-center h-40">
        <LoaderIcon className="animate-spin h-8 w-8 text-green-600" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <h2 className="text-xl font-bold">Your Addresses</h2>
        <button
          onClick={() => handleOpenForm(null)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-green-700 text-sm font-medium"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add New Address
        </button>
      </div>

      {error && <div className="text-red-500 text-center">{error}</div>}

      {addresses.length > 0 ? (
        <div className="space-y-4">
          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              onEdit={() => handleOpenForm(address)}
              onDelete={() => handleDeleteAddress(address.id)}
              onSetMain={() => handleSetMainAddress(address.id)}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-10">
          You have no saved addresses.
        </p>
      )}

      {isFormOpen && (
        <AddressForm
          address={editingAddress}
          onClose={handleCloseForm}
          onSave={handleSaveAddress}
          isLoading={loading}
        />
      )}
    </div>
  );
}
