
"use client";

import React, { useState } from "react";
import Navbar from "@/pages/home-page/components/navbar";
import Sidebar from "@/pages/home-page/components/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="flex h-screen">
      <Sidebar showMenu={showMenu} setShowMenu={setShowMenu} />
      <div className="flex-1 flex flex-col">
        <Navbar showMenu={showMenu} setShowMenu={setShowMenu} />
        <main className="bg-white flex-1 relative overflow-y-auto focus:outline-none p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

