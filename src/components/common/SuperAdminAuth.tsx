"use client";

import { useAppSelector } from "@/lib/redux/hooks";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { LoaderIcon } from "lucide-react";

const withSuperAdminAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  const Wrapper = (props: P) => {
    const { isAuthenticated, user } = useAppSelector((state) => state.auth);
    const router = useRouter();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
      // Menunggu hingga state autentikasi dari Redux selesai dimuat
      if (typeof isAuthenticated !== "undefined") {
        if (!isAuthenticated) {
          toast.error("You must be logged in to view this page.");
          router.replace("/login");
        } else if (user?.role !== "SUPER_ADMIN") {
          toast.error("You are not authorized to view this page.");
          router.replace("/");
        } else {
          setIsChecking(false); // Autentikasi berhasil, berhenti memeriksa
        }
      }
    }, [isAuthenticated, user, router]);

    // Tampilkan loading spinner selama proses pengecekan
    if (isChecking) {
      return (
        <div className="flex justify-center items-center h-screen">
          <LoaderIcon className="h-8 w-8 animate-spin text-green-600" />
        </div>
      );
    }

    // Jika sudah diverifikasi sebagai SUPER_ADMIN, tampilkan komponen halaman
    if (isAuthenticated && user?.role === "SUPER_ADMIN") {
      return <WrappedComponent {...props} />;
    }

    // Fallback jika terjadi kondisi yang tidak terduga
    return null;
  };

  return Wrapper;
};

export default withSuperAdminAuth;
