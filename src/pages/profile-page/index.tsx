"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import { LoaderIcon, User, Shield, MapPinIcon } from "lucide-react";
import PersonalInformation from "@/components/profile/personal-information";
import Security from "@/components/profile/security";
import { useRouter } from "next/navigation";
import { fetchProfile } from "@/lib/redux/slice/profileSlice";
import { useAuthGuard } from "@/middlewares/useAuthGuard";

// Gunakan Dynamic Import untuk AddressManagement
const AddressManagement = dynamic(
  () => import("@/components/profile/address.management"),
  {
    ssr: false,
    loading: () => (
      <div className="flex justify-center py-10">
        <LoaderIcon className="h-8 w-8 animate-spin text-green-600" />
      </div>
    ),
  }
);

export default function ProfilePage() {
  useAuthGuard();
  const [activeTab, setActiveTab] = useState("personal");
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const profile = useAppSelector((state) => state.profile);

  const userRole = profile?.role || profile?.role || null;

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchProfile());
    }
  }, [isAuthenticated, dispatch]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token && !isAuthenticated) {
      router.replace("/login?redirect_url=/profile");
    }
  }, [isAuthenticated, router]);

  if (profile.loading || !isAuthenticated) {
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
                {userRole !== "STORE_ADMIN" && (
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
                )}
              </nav>
            </div>
          </aside>
          <main className="lg:w-3/4">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              {activeTab === "personal" && (
                <PersonalInformation user={profile} />
              )}
              {activeTab === "security" && <Security user={profile} />}
              {activeTab === "addresses" && userRole !== "STORE_ADMIN" && (
                <AddressManagement />
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
