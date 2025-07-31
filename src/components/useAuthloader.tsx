"use client";
import { useAuthLoader } from "@/lib/hooks/useAuthLoader";
export default function AuthLoaderClient() {
  useAuthLoader();
  return null;
}
