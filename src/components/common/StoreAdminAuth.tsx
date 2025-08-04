"use client";

import { useAppSelector } from "@/lib/redux/hooks";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { LoaderIcon } from "lucide-react";

const withStoreAdminAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  const Wrapper = (props: P) => {
    const { isAuthenticated, user } = useAppSelector((state) => state.auth);
    const router = useRouter();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
      if (typeof isAuthenticated !== "undefined") {
        if (!isAuthenticated) {
          toast.error("You must be logged in to view this page.");
          router.replace("/login");
        } else if (user?.role !== "STORE_ADMIN") {
          toast.error("You are not authorized to view this page.");
          router.replace("/");
        } else {
          setIsChecking(false); // Authentication successful, stop checking
        }
      }
    }, [isAuthenticated, user, router]);

    if (isChecking) {
      return (
        <div className="flex justify-center items-center h-screen">
          <LoaderIcon className="h-8 w-8 animate-spin text-green-600" />
        </div>
      );
    }

    if (isAuthenticated && user?.role === "STORE_ADMIN") {
      return <WrappedComponent {...props} />;
    }

    return null;
  };

  Wrapper.displayName = `withStoreAdminAuth(${(WrappedComponent.displayName || WrappedComponent.name || 'Component')})`;
  return Wrapper;
};

export default withStoreAdminAuth;