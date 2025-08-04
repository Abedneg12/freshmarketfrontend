"use client";
import React from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboardIcon,
  StoreIcon,
  UsersIcon,
  BarChart3Icon,
  LogOutIcon,
  PackageIcon,
  PercentCircleIcon,
  Layers,
  User,
  UserIcon,
  NotebookPenIcon,
  PackagePlusIcon,
} from "lucide-react";
import { logoutAction } from "@/lib/redux/slice/authSlice";
import { useAppDispatch } from "@/lib/redux/hooks";

interface SidebarProps {
  showMenu: boolean;
  setShowMenu: (show: boolean) => void;
}

export default function Sidebar({ showMenu, setShowMenu }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  const navigation = [
    {
      name: "Dashboard",
      icon: LayoutDashboardIcon,
      id: "dashboard",
      path: "/super-admin",
    },
    {
      name: "Store Management",
      icon: StoreIcon,
      id: "store",
      path: "/super-admin/market",
    },
    {
      name: "Inventory",
      icon: PackageIcon,
      id: "inventory",
      path: "/super-admin/inventory",
    },
    {
      name: "Inventory Journal",
      icon: PackagePlusIcon,
      id: "inventory",
      path: "/super-admin/inventory-journal",
    },
    {
      name: "Category",
      icon: Layers,
      id: "category",
      path: "/super-admin/category",
    },
    {
      name: "Admin Accounts",
      icon: UsersIcon,
      id: "admins",
      path: "/super-admin/admins",
    },
    {
      name: "Users Accounts",
      icon: UserIcon,
      id: "users",
      path: "/super-admin/users",
    },
    {
      name: "Sales Reports",
      icon: BarChart3Icon,
      id: "sales-reports",
      path: "/super-admin/reports",
    },
    {
      name: "Stock Reports",
      icon: BarChart3Icon,
      id: "stock-reports",
      path: "/super-admin/stock-reports",
    },
  ];

  const handleNavigation = (path: string) => {
    setShowMenu(false); // Hide sidebar on mobile after navigation
    router.push(path);
  };

  const handleLogout = () => {
    dispatch(logoutAction());
    router.push("/");
  };

  return (
    <div
      className={`
        fixed inset-y-0 left-0 z-30 w-64 transition-transform transform bg-green-700 pt-5 pb-4 overflow-y-auto
        ${showMenu ? "translate-x-0" : "-translate-x-full"}
        md:static md:inset-auto md:translate-x-0
      `}
    >
      <div className="flex items-center flex-shrink-0 px-4">
        <h1 className="text-white font-bold text-xl">Freshmart Admin</h1>
        {/* Close button for mobile */}
        <button
          className="md:hidden ml-auto text-white"
          onClick={() => setShowMenu(false)}
        >
          ✕
        </button>
      </div>
      <div className="mt-8 flex-1 flex flex-col">
        <nav className="flex-1 px-2 space-y-1">
          {navigation.map((item) => (
            <button
              key={item.name}
              onClick={() => handleNavigation(item.path)}
              className={`group flex items-center w-full px-2 py-2 text-base md:text-sm font-medium rounded-md cursor-pointer text-left text-white transition-colors duration-150 ${
                pathname === item.path
                  ? "bg-green-800" // Active link style
                  : "hover:bg-green-800" // Inactive link hover style
              }`}
            >
              <item.icon
                className="mr-3 flex-shrink-0 h-6 w-6"
                aria-hidden="true"
              />
              <span className="flex-1">{item.name}</span>
              {pathname === item.path && (
                <span className="h-1.5 w-1.5 rounded-full bg-white" />
              )}
            </button>
          ))}
        </nav>
      </div>
      <div className="px-2 mt-6">
        <button
          onClick={handleLogout}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-full text-sm"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
