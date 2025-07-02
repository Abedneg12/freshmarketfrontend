import { jwtDecode } from "jwt-decode";
import { IAuth } from "@/lib/redux/features/authSlices";

export const decodeTokenToAuth = (token: string): IAuth | null => {
  try {
    const decoded: any = jwtDecode(token);

    if (!decoded.email || !decoded.id) {
      console.error("Invalid token: Missing required user information");
      return null;
    }

    return {
      user: {
        email: decoded.email,
        first_name: decoded.first_name,
        last_name: decoded.last_name,
        id: decoded.id,
        status_role: decoded.status_role,
        profile_pict: decoded.profile_pict,
        referal_code: decoded.referal_code,
        point: decoded.point,
      },
      isLogin: true,
      token,
    };
  } catch (e) {
    console.error("Error decoding token:", e);
    return null;
  }
};
