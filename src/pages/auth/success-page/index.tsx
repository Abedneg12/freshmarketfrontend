"use client";

import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch } from "@/lib/redux/hooks";
import { setToken, fetchUserProfile } from "@/lib/redux/slice/authSlice";
import { LoaderIcon } from "lucide-react";

export default function SuccessPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();

  useEffect(() => {
    const tokenFromUrl = searchParams?.get("token");

    if (tokenFromUrl) {
      dispatch(setToken(tokenFromUrl));
      dispatch(fetchUserProfile());
      router.push("/profile");
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
