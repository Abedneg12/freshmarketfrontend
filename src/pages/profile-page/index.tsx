"use client";

import React, { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import { LoaderIcon, User, Shield, MapPinIcon } from "lucide-react";
import PersonalInformation from "./components/personal-information";
import Security from "./components/security";
import AddressManagement from "./components/address.management";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/utils/auth"; // 1. Impor utilitas isAuthenticated

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("personal");
  const router = useRouter();

  // PENJELASAN: Kita sekarang mengambil 'user' dan 'isLogin' dari state Redux.
  // 'isLogin' akan menjadi 'true' setelah sesi dipulihkan.
  const { user, isLogin } = useAppSelector((state) => state.auth);

  // PENJELASAN: useEffect ini sekarang bertindak sebagai "penjaga" untuk halaman ini.
  // Ini adalah pengganti dari middleware untuk halaman profil.
  useEffect(() => {
    // Jika setelah pengecekan, pengguna ternyata tidak terautentikasi,
    // arahkan mereka ke halaman login.
    if (!isAuthenticated()) {
      router.replace("/login?redirect_url=/profile");
    }
  }, [router]);

  // PENJELASAN: Tampilkan loading spinner jika state Redux belum siap
  // atau jika pengguna belum terautentikasi. Ini mencegah "kedipan" UI.
  if (!isLogin || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoaderIcon className="h-8 w-8 animate-spin text-green-600" />
        <span className="ml-2">Loading Profile...</span>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">
          Account Settings
        </h1>
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-1/4">
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <nav className="divide-y divide-gray-200">
                <button
                  onClick={() => setActiveTab("personal")}
                  className={`w-full flex items-center px-6 py-4 text-sm font-medium transition-colors ${
                    activeTab === "personal"
                      ? "bg-green-50 text-green-700 border-l-4 border-green-500"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <User className="h-5 w-5 mr-3" />
                  Personal Information
                </button>

                <button
                  onClick={() => setActiveTab("security")}
                  className={`w-full flex items-center px-6 py-4 text-sm font-medium transition-colors ${
                    activeTab === "security"
                      ? "bg-green-50 text-green-700 border-l-4 border-green-500"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Shield className="h-5 w-5 mr-3" />
                  Security
                </button>

                <button
                  onClick={() => setActiveTab("addresses")}
                  className={`w-full flex items-center px-6 py-4 text-sm font-medium transition-colors ${
                    activeTab === "addresses"
                      ? "bg-green-50 text-green-700 border-l-4 border-green-500"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <MapPinIcon className="h-5 w-5 mr-3" />
                  Addresses
                </button>
              </nav>
            </div>
          </aside>

          <main className="lg:w-3/4">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              {activeTab === "personal" && <PersonalInformation user={user} />}
              {activeTab === "security" && <Security user={user} />}
              {activeTab === "addresses" && <AddressManagement />}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
