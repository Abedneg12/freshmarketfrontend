"use client";
import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { fetchCartItems } from "@/lib/redux/slice/cartSlice";
import { fetchAddresses } from "@/lib/redux/slice/addressSlice";
import { createOrder, resetOrderStatus } from "@/lib/redux/slice/orderSlice";
import { CreditCardIcon, TruckIcon } from "lucide-react";
import { apiUrl } from "../config";
import axios from "axios";
import { LoaderIcon } from "lucide-react";

interface ShippingOption {
  service: string;
  description: string;
  cost: number;
}

// Menggunakan 'export default function' sesuai standar Next.js App Router
export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  // State lokal untuk pilihan pengguna di halaman ini
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null
  );
  const [paymentMethod, setPaymentMethod] = useState<
    "BANK_TRANSFER" | "MIDTRANS"
  >("BANK_TRANSFER");
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [selectedShipping, setSelectedShipping] =
    useState<ShippingOption | null>(null);
  const [shippingLoading, setShippingLoading] = useState(false);

  // Ambil data yang relevan dari Redux store
  const { carts } = useAppSelector((state) => state.cart);
  const { addresses } = useAppSelector((state) => state.address);
  const { status: orderStatus, error: orderError } = useAppSelector(
    (state) => state.order
  );

  // Ambil data awal (keranjang & alamat) saat komponen dimuat
  useEffect(() => {
    dispatch(fetchCartItems());
    dispatch(fetchAddresses());
    dispatch(resetOrderStatus());
  }, [dispatch]);

  // Secara otomatis pilih alamat utama sebagai default saat data alamat tersedia
  useEffect(() => {
    if (addresses && addresses.length > 0) {
      const mainAddress = addresses.find((addr) => addr.isMain);
      setSelectedAddressId(mainAddress ? mainAddress.id : addresses[0].id);
    }
  }, [addresses]);

  // pemanggilan API ongkir
  useEffect(() => {
    if (selectedAddressId) {
      const fetchShippingCost = async () => {
        setShippingLoading(true);
        setShippingOptions([]);
        setSelectedShipping(null);

        try {
          const token = localStorage.getItem("token");
          const storeId = carts.length > 0 ? carts[0].storeId : null;

          if (!storeId) {
            console.error("Store ID tidak ditemukan untuk menghitung ongkir.");
            setShippingLoading(false);
            return;
          }

          const response = await axios.post(
            `${apiUrl}/api/shipping/cost`,
            { storeId, userAddressId: selectedAddressId },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          const validOptions = (response.data as ShippingOption[]).filter(
            (opt: ShippingOption) => opt.cost !== -1
          );
          setShippingOptions(validOptions);

          if (validOptions.length > 0) {
            setSelectedShipping(validOptions[0]);
          }
        } catch (error) {
          console.error("Gagal mengambil ongkos kirim:", error);
        } finally {
          setShippingLoading(false);
        }
      };
      fetchShippingCost();
    }
  }, [selectedAddressId, carts]);

  // Kalkulasi subtotal dari semua item di keranjang
  const subtotal = useMemo(() => {
    return carts.reduce(
      (total, cart) =>
        total +
        cart.items.reduce(
          (itemSum, item) => itemSum + item.product.basePrice * item.quantity,
          0
        ),
      0
    );
  }, [carts]);

  // Handler utama untuk menempatkan pesanan
  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      alert("Please select a shipping address.");
      return;
    }

    const allCartItemIds = carts.flatMap((cart) =>
      cart.items.map((item) => item.id)
    );

    if (allCartItemIds.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    const resultAction = await dispatch(
      createOrder({
        addressId: selectedAddressId,
        paymentMethod,
        cartItemIds: allCartItemIds,
      })
    );

    // Periksa hasil dari action
    if (createOrder.fulfilled.match(resultAction)) {
      const { midtransRedirectUrl, order } = resultAction.payload;
      if (midtransRedirectUrl) {
        // Jika dapat URL Midtrans, arahkan pengguna ke sana
        window.location.href = midtransRedirectUrl;
      } else {
        // [DIUBAH] Jika transfer manual, arahkan ke halaman instruksi pembayaran
        router.push(`/pembayaran/${order.id}`);
      }
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Pilihan Alamat */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Shipping Address
              </h2>
              <div className="space-y-4">
                {addresses?.map((addr) => (
                  <div
                    key={addr.id}
                    onClick={() => setSelectedAddressId(addr.id)}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedAddressId === addr.id
                        ? "border-green-500 ring-2 ring-green-200"
                        : "border-gray-200"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-gray-800">
                          {addr.label}{" "}
                          {addr.isMain && (
                            <span className="text-xs bg-green-100 text-green-700 font-medium px-2 py-1 rounded-full ml-2">
                              Utama
                            </span>
                          )}
                        </p>
                        <p className="text-sm text-gray-600">
                          {addr.recipient}, {addr.phone}
                        </p>
                        <p className="text-sm text-gray-600">
                          {addr.addressLine}, {addr.city}
                        </p>
                      </div>
                      <div
                        className={`w-5 h-5 mt-1 rounded-full border-2 flex items-center justify-center ${
                          selectedAddressId === addr.id
                            ? "border-green-500 bg-green-500"
                            : "border-gray-300"
                        }`}
                      >
                        {selectedAddressId === addr.id && (
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tampilan Ongkir */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Metode Pengiriman
              </h2>
              {shippingLoading ? (
                <div className="flex items-center gap-2 text-gray-500">
                  <LoaderIcon className="animate-spin h-5 w-5" />
                  <span>Menghitung ongkos kirim...</span>
                </div>
              ) : (
                <div className="space-y-4">
                  {shippingOptions.length > 0 ? (
                    shippingOptions.map((option, index) => (
                      <div
                        key={index}
                        onClick={() => setSelectedShipping(option)}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          selectedShipping?.service === option.service
                            ? "border-green-500 ring-2 ring-green-200"
                            : "border-gray-200"
                        }`}
                      >
                        <p className="font-bold text-gray-800">
                          {option.service} - Rp{" "}
                          {option.cost.toLocaleString("id-ID")}
                        </p>
                        <p className="text-sm text-gray-600">
                          {option.description}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">
                      Pilih alamat untuk melihat opsi pengiriman.
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Pilihan Pembayaran */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Payment Method
              </h2>
              <div className="space-y-4">
                <div
                  onClick={() => setPaymentMethod("BANK_TRANSFER")}
                  className={`p-4 border rounded-lg cursor-pointer transition-all flex items-center ${
                    paymentMethod === "BANK_TRANSFER"
                      ? "border-green-500 ring-2 ring-green-200"
                      : "border-gray-200"
                  }`}
                >
                  <CreditCardIcon className="h-6 w-6 mr-4 text-gray-600" />
                  <div>
                    <p className="font-bold text-gray-800">Bank Transfer</p>
                    <p className="text-sm text-gray-500">
                      Pay via manual bank transfer.
                    </p>
                  </div>
                </div>
                <div
                  onClick={() => setPaymentMethod("MIDTRANS")}
                  className={`p-4 border rounded-lg cursor-pointer transition-all flex items-center ${
                    paymentMethod === "MIDTRANS"
                      ? "border-green-500 ring-2 ring-green-200"
                      : "border-gray-200"
                  }`}
                >
                  <TruckIcon className="h-6 w-6 mr-4 text-gray-600" />
                  <div>
                    <p className="font-bold text-gray-800">Payment Gateway</p>
                    <p className="text-sm text-gray-500">
                      Use credit card, e-wallet, and more via Midtrans.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Ringkasan Pesanan */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-sm sticky top-28">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Order Summary
              </h2>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                {carts
                  .flatMap((cart) => cart.items)
                  .map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center text-sm"
                    >
                      <span className="text-gray-600 truncate pr-2">
                        {item.product.name}{" "}
                        <span className="text-gray-400">x{item.quantity}</span>
                      </span>
                      <span className="text-gray-800 whitespace-nowrap">
                        Rp{" "}
                        {(
                          item.product.basePrice * item.quantity
                        ).toLocaleString("id-ID")}
                      </span>
                    </div>
                  ))}
              </div>
              <div className="border-t my-4"></div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-800">
                    Rp {subtotal.toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-800">Calculated by system</span>
                </div>
              </div>
              <div className="border-t my-4"></div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total (approx.)</span>
                <span>Rp {subtotal.toLocaleString("id-ID")}</span>
              </div>
              <button
                onClick={handlePlaceOrder}
                disabled={orderStatus === "loading" || !selectedAddressId}
                className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {orderStatus === "loading" ? "Processing..." : "Place Order"}
              </button>
              {orderError && (
                <p className="text-red-500 text-sm mt-2 text-center">
                  {orderError}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
