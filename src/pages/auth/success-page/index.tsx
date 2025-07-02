"use client";

import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch } from "@/lib/redux/hooks";
import { setToken, fetchUserProfile } from "@/lib/redux/slice/authSlice";

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
    <div className="min-h-screen flex items-center justify-center">
      <p>Autetinkasi berhasil, mengarahkan...</p>
    </div>
  );
}
