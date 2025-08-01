"use client";

import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import SuperAdminDashboard from "@/components/layout/SuperAdmin/Layout";
import { useEffect } from "react";
import { fetchProfile } from "@/lib/redux/slice/profileSlice";
import StoreAdminLayout from "./StoreAdmin/Layout";
import { loginAction } from "@/lib/redux/slice/authSlice";
import { getUserFromToken } from "@/utils/auth";
import { useRouter, usePathname } from "next/navigation";

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, token } = useAppSelector(
    (state) => state.auth
  );
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token && !isAuthenticated) {
      const userFromToken = getUserFromToken();

      if (userFromToken) {
        dispatch(loginAction({ user: userFromToken, token }));
      } else {
        localStorage.removeItem("token");
      }
    }

    if (isAuthenticated) {
      dispatch(fetchProfile());
      // if (user) {
      //   if (user.role === "SUPER_ADMIN") {
      //     router.replace("/super-admin/dashboard");
      //   } else if (user.role === "STORE_ADMIN") {
      //     router.replace("/store-admin/dashboard");
      //   }
      // } 
    }
  }, [dispatch, isAuthenticated]);

  if (user?.role == "SUPER_ADMIN") {
    return <SuperAdminDashboard>{children}</SuperAdminDashboard>;
  } else if (isAuthenticated && user?.role === "STORE_ADMIN") {
    return <StoreAdminLayout>{children}</StoreAdminLayout>;
  } else {
    return (
      <>
        <Navbar />
        {children}
        <Footer />
      </>
    );
  }
}
