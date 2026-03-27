"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Link from "next/link";
import { LayoutDashboard, MessageSquare, Briefcase, Star, Settings, LogOut, FileText } from "lucide-react";
import { Toaster } from "react-hot-toast";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      
      if (!currentUser && pathname !== "/admin/login") {
        router.push("/admin/login");
      }
      
      if (currentUser && pathname === "/admin/login") {
        router.push("/admin");
      }
    });

    return () => unsubscribe();
  }, [pathname, router]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-black-100 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  // If it's the login page or user is not authenticated, just render children without sidebar
  if (pathname === "/admin/login" || !user) {
    return (
      <div className="min-h-screen bg-black-100 text-white">
        <Toaster position="top-right" />
        {children}
      </div>
    );
  }

  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/admin" },
    { name: "Messages", icon: <MessageSquare size={20} />, path: "/admin/messages" },
    { name: "Projects", icon: <Briefcase size={20} />, path: "/admin/projects" },
    { name: "Experience", icon: <FileText size={20} />, path: "/admin/experience" },
    { name: "Skills", icon: <Star size={20} />, path: "/admin/skills" },
    { name: "Settings", icon: <Settings size={20} />, path: "/admin/settings" },
  ];

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/admin/login");
  };

  return (
    <div className="flex h-screen bg-black-100 text-white overflow-hidden">
      <Toaster position="top-right" />
      {/* Sidebar */}
      <aside className="w-64 bg-[#0a0e17] border-r border-[#1a2333] flex flex-col">
        <div className="p-6">
          <h2 className="text-2xl font-bold tracking-wider text-[#A07CFE]">Admin Panel</h2>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {menuItems.map((item) => {
            const isActive = pathname === item.path || (pathname.startsWith(item.path) && item.path !== "/admin");
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive ? "bg-[#A07CFE]/10 text-[#A07CFE]" : "text-gray-400 hover:bg-[#1a2333] hover:text-white"
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-[#1a2333]">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8 relative">
        {children}
      </main>
    </div>
  );
}
