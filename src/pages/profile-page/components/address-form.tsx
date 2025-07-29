"use client";
import React, { useState, useEffect } from "react";
import { IAddress } from "@/lib/interface/address";
import { LoaderIcon } from "lucide-react";

interface AddressFormProps {
  address?: IAddress | null;
  onClose: () => void;
  onSave: (data: Omit<IAddress, 'id' | 'latitude' | 'longitude'>) => void;
  isLoading: boolean;
}

export default function AddressForm({
  address,
  onClose,
  onSave,
  isLoading,
}: AddressFormProps) {
  const [formData, setFormData] = useState({
    label: "",
    recipient: "",
    phone: "",
    addressLine: "",
    city: "",
    province: "",
    postalCode: "",
    isMain: false,
  });

  useEffect(() => {
    if (address) {
      setFormData({
        label: address.label,
        recipient: address.recipient,
        phone: address.phone,
        addressLine: address.addressLine,
        city: address.city,
        province: address.province,
        postalCode: address.postalCode,
        isMain: address.isMain,
      });
    }
  }, [address]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === "checkbox";
    setFormData((prev) => ({
      ...prev,
      [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData); // Kirim formData langsung
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-lg">
        <h2 className="text-x1 font-bold mb-6">
          {address ? "Edit Alamat" : "Tambah Alamat Baru"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Label Alamat
            </label>
            <input
              type="text"
              name="label"
              value={formData.label}
              onChange={handleChange}
              className="mt-1 w-full border p-2 rounded-md text-black"
              placeholder="Contoh: Rumah, Kantor"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nama Penerima
            </label>
            <input
              type="text"
              name="recipient"
              value={formData.recipient}
              onChange={handleChange}
              className="mt-1 w-full border p-2 rounded-md text-black"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nomor Telepon
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="mt-1 w-full border p-2 rounded-md text-black"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Detail Alamat
            </label>
            <textarea
              name="addressLine"
              value={formData.addressLine}
              onChange={handleChange}
              className="mt-1 w-full border p-2 rounded-md text-black"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Kota/Kabupaten
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="mt-1 w-full border p-2 rounded-md text-black"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Provinsi
              </label>
              <input
                type="text"
                name="province"
                value={formData.province}
                onChange={handleChange}
                className="mt-1 w-full border p-2 rounded-md text-black"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Kode Pos
            </label>
            <input
              type="text"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              className="mt-1 w-full border p-2 rounded-md text-black"
              required
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              name="isMain"
              checked={formData.isMain}
              onChange={handleChange}
              className="h-4 w-4 text-green-600"
            />
            <label className="ml-2 text-sm text-gray-900">
              Jadikan alamat utama
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
            >
              Batal
            </button>
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
              disabled={isLoading}
            >
              {isLoading && (
                <LoaderIcon className="animate-spin h-5 w-5 mr-2" />
              )}
              Simpan Alamat
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
