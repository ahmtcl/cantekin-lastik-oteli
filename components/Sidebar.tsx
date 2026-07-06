"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/config";

const menuItems = [
  { label: "Dashboard", href: "/yonetim" },
  { label: "Randevular", href: "/yonetim/randevular" },
  { label: "Ayarlar", href: "/yonetim/ayarlar" },
];

export const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/giris");
    } catch {
      alert("Çıkış yapılırken bir hata oluştu");
    }
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">Lastik Oteli</h1>
        <p className="text-sm text-gray-500">Yönetim Paneli</p>
      </div>

      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`block px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-600 font-medium"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
        >
          Çıkış Yap
        </button>
      </div>
    </div>
  );
};
