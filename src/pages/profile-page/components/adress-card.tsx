use client";
import React from "react";
import { IAddress } from "@/lib/interface/address";
import { Edit, Trash2 } from "lucide-react";

interface AddressCardProps {
  address: IAddress;
  onEdit: () => void;
  onDelete: () => void;
  onSetMain: () => void;
}

export default function AddressCard({
  address,
  onEdit,
  onDelete,
  onSetMain,
}: AddressCardProps) {
  return (
    <div
      className={`border rounded-lg p-4 ${
        address.isMain ? "border-green-500 bg-green-50" : "border-gray-200"
      }`}
    >
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center mb-2">
            <span className="font-bold text-gray-900">{address.label}</span>
            {address.isMain && (
              <span className="ml-2 bg-green-200 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full">
                Utama
              </span>
            )}
          </div>
          <p className="text-gray-700 font-semibold">{address.recipient}</p>
          <p className="text-sm text-gray-600">{address.phone}</p>
          <p className="text-sm text-gray-600 mt-1">
            {`${address.addressLine}, ${address.city}, ${address.province}, ${address.postalCode}`}
          </p>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={onEdit}
            className="text-gray-500 hover:text-blue-600 p-1"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={onDelete}
            className="text-gray-500 hover:text-red-600 p-1"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {!address.isMain && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={onSetMain}
            className="text-green-600 hover:text-green-800 text-sm font-semibold"
          >
            Jadikan Alamat Utama
          </button>
        </div>
      )}
    </div>
  );
}