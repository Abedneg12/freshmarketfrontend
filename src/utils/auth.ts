import { jwtDecode } from "jwt-decode";
import { IUser } from "@/lib/interface/auth";

interface DecodedToken extends IUser {
  iat: number;
  exp: number;
}

export const getToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

export const isAuthenticated = (): boolean => {
  const token = getToken();
  if (!token) return false;

  try {
    const decoded: DecodedToken = jwtDecode(token);
    return decoded.exp * 1000 > Date.now();
  } catch (error) {
    return false;
  }
};

export const getUserFromToken = (): IUser | null => {
  const token = getToken();
  if (!token) return null;

  try {
    const decoded: DecodedToken = jwtDecode(token);
    if (decoded.exp * 1000 > Date.now()) {
      return decoded as IUser;
    }
    return null;
  } catch (error) {
    return null;
  }
};

export const logout = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
    window.location.href = "/login";
  }
};
