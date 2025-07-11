"use client";

import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { fetchAddresses } from "@/lib/redux/slice/addressSlice";
import { IAddress } from "@/lib/interface/address";
import {
  fetchCartDetails,
  selectCartSubtotal,
} from "@/lib/redux/slice/cartSlice";
import { LoaderIcon, AlertCircle, MapPin, CreditCard, Tag } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function CheckoutPage() {
  const dispatc = useAppDispatch();
  const router = useRouter();
  const { addresses, loading: addressLoading } = useAppSelector(
    (state) => state.address
  );
  const {
    cart,
    loading: cartLoading,
    error: cartError,
  } = useAppSelector((state) => state.cart);
  const subtotal = useAppSelector(selectCartSubtotal);

  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null
  );
  const [shippingCost, setShippingCost] = useState<number | null>(null);
  const [shippingError, setShippingError] = useState<string | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);

  useEffect(() => {
    if (addressLoading.length > 0 && !selectedAddressId) {
      const mainAddress = addresses.find((a) => a.isMain) || addresses[0];
      setSelectedAddressId(mainAddress.id);
    }
  }, [addresses, selectedAddressId]);

  useEffect(() => {
    if (selectedAddressId) {
      const calculateCost = async () => {
        setIsCalculating(true);
        setShippingError(null);
        try {
          const token = localStorage.getItem("token");
          const response = await axios.post(
            `${API_URL}/api/shipping/cost`,
            { addressId: selectedAddressId },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setShippingCost(response.data.shippingCost);
        } catch (error: any) {
          setShippingError(
            error.response?.data?.error ||
              "Gagal menghitung ongkos kirim untuk alamat ini."
          );
          setShippingCost(null);
        } finally {
          setIsCalculating(false);
        }
      };
      calculateCost();
    }
  }, [selectedAddressId]);

  const total = subtotal + (shippingCost || 0);

  const handleCreateOrder = async () => {
    if (!selectedAddressId || shippingCost === null) {
      alert("Silakan pilih alamat dan pastikan ongkos kirim sudah terhitung.");
      return;
    }
    setIsProcessingOrder(true);
    console.log("Creating order with:", {
      addressId: selectedAddressId,
      subtotal,
      shippingCost,
      total,
    });
    await new Promise((res) => setTimeout(res, 2000));
    alert("Pesanan berhasil dibuat! (Simulasi");
    router.push("/orders");
    setIsProcessingOrder(false);
  };

  if ((addressLoading || cartLoading) && addresses.length === 0) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-center px-4">
        <h2 className="text-2x1 font-bold text-gray-800 mb-2">
          Keranjang Anda Kosong
        </h2>
        <p className="text-gray-600 mb-6">
          Anda belum memiliki barang di keranjang untuk dicheckout.
        </p>
        <Link
          href="/"
          className="bg-green-600 text-white px-6 py-3 rounded-full font-medium hover:bg-green-700"
        >
          Lanjut Belanja
        </Link>
      </div>
    );
  }
}
