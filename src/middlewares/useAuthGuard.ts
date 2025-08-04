import { useEffect } from "react";
import { useRouter } from "next/navigation";

export type UserRole = "USER" | "STORE_ADMIN" | "SUPER_ADMIN";

interface AuthGuardOptions {
  requiredRole?: UserRole | UserRole[];
  redirectTo?: string; // Default redirect jika role tidak sesuai
}

export function useAuthGuard(options?: AuthGuardOptions) {
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role") as UserRole | null;

    // Cek apakah sudah login 
    // if (!token) {
    //   router.replace("/login");
    //   return;
    // }

    // Jika butuh cek role
    // if (options?.requiredRole) {
    //   const allowedRoles = Array.isArray(options.requiredRole)
    //     ? options.requiredRole
    //     : [options.requiredRole];

    //   if (!role || !allowedRoles.includes(role)) {
    //     router.replace(options.redirectTo || "/");
    //     return;
    //   }
    // }
  }, [router, options]);
}
