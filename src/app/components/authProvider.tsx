'use client'

import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { onLogin, onLogout } from "@/lib/redux/features/authSlices";
import { showError } from "@/utils/toast";
import { jwtDecode } from "jwt-decode"; // Assuming jwt-decode is used

interface DecodedToken {
  email: string;
  first_name: string;
  last_name: string;
  id: number;
  profile_pict: string;
  exp?: number;
  iat?: number;
  is_verified?: boolean;
  point?: number;
  referal_code?: string;
  status_role?: 'customer' | 'organiser' | null;
}

export default function Auth({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  interface AuthState {
    token: string | null;
    isLogin: boolean;
  }

  const { token, isLogin }: AuthState = useAppSelector((state: { auth: AuthState }) => state.auth);

  // Function to refresh login status by validating the token
  const refreshLogin = async () => {
    try {
      if (!token || typeof token !== "string") {
        console.warn("No access token found in Redux state.");
        dispatch(onLogout()); // Log the user out if no token exists
        router.push("/login"); // Redirect to login
        return;
      }

      // Decode the JWT token to extract the payload and expiration date
      const decoded = jwtDecode<DecodedToken>(token);
      const currentTime = Date.now() / 1000;

      // Check if the token is expired
      if (!decoded.exp || decoded.exp < currentTime) {
        console.warn("Access token expired.");
        showError("Session expired, please log in again.");
        dispatch(onLogout()); // Clear user state in Redux
        router.push("/login"); // Redirect to login page
        return;
      }

      // Validate the token structure (ensure `user` data is available)
      if (!decoded.email || !decoded.first_name || !decoded.last_name) {
        console.warn("Invalid token payload:", decoded);
        showError("Invalid token, please log in again.");
        dispatch(onLogout()); // Clear user state in Redux
        router.push("/login"); // Redirect to login page
        return;
      }

      // If everything is valid, dispatch the user info to Redux
      dispatch(onLogin({
        user: { 
          email: decoded.email,
          first_name: decoded.first_name,
          last_name: decoded.last_name,
          id: decoded.id,
          profile_pict: decoded.profile_pict,
          is_verified: decoded.is_verified || false,
          point: decoded.point || 0,
          referal_code: decoded.referal_code || '',
          status_role: decoded.status_role || null 
        },
        token: token,
      }));

    } catch (error) {
      console.error("Token verification failed:", error);
      showError("Token verification failed, please log in again.");
      dispatch(onLogout()); // Clear user state in Redux
      router.push("/login"); // Redirect to login page
    }
  };

  useEffect(() => {
    // Refresh the login status if the token is available and the user isn't logged in
    if (token && !isLogin) {
      refreshLogin();
    }
  }, [isLogin, token]); // Dependency array to re-run the effect when `isLogin` or `token` changes

  return <>{children}</>;
}
