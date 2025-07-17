"use client";

import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch } from "@/lib/redux/hooks";
import { loginAction } from "@/lib/redux/slice/authSlice";
import { getUserFromToken } from "@/utils/auth";
import { LoaderIcon } from "lucide-react";

export default function SuccessPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();

  useEffect(() => {
    const tokenFromUrl = searchParams?.get("token");

    if (tokenFromUrl) {
      localStorage.setItem("token", tokenFromUrl);

      const user = getUserFromToken();

      if (user) {
        dispatch(loginAction({ user, token: tokenFromUrl }));
        router.push("/");
      } else {
        router.push("/login?error=oauth_failed");
      }
    } else {
      router.push("/login?error=oauth_failed");
    }
  }, [dispatch, router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center">
        <LoaderIcon className="h-12 w-12 animate-spin text-green-600" />
        <p className="mt-4 text-lg text-gray-700">
          Autentikasi berhasil, mengarahkan...
        </p>
      </div>
    </div>
  );
}
