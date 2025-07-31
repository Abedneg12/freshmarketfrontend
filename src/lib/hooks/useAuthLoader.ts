import { useEffect } from "react";
import { useAppDispatch } from "@/lib/redux/hooks";
import { getUserFromToken, getToken } from "@/utils/auth";
import { loginAction } from "@/lib/redux/slice/authSlice";

export function useAuthLoader() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = getToken();
    const user = getUserFromToken();
    if (token && user) {
      dispatch(loginAction({ user, token }));
    }
  }, [dispatch]);
}

