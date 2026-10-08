"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Heart, Luggage, MessageSquare, User as UserIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import LoginModal from "@/components/auth/LoginModal";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const navItems = [
    { label: "Explore", href: "/", icon: Compass },
    { label: "Wishlists", href: "/wishlists", icon: Heart },
    { label: "Trips", href: "/trips", icon: Luggage },
    { label: "Messages", href: "/messages", icon: MessageSquare },
  ];

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-40 block md:hidden border-t border-gray-200 bg-white/95 backdrop-blur-md pb-safe">
        <div className="flex items-center justify-around py-2.5 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex flex-col items-center gap-1 py-1 px-3 transition-colors ${
                  isActive
                    ? "text-[#FF385C] font-bold"
                    : "text-gray-500 hover:text-gray-900 font-medium"
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? "stroke-[2.5]" : "stroke-[1.8]"}`} />
                <span className="text-[10px]">{item.label}</span>
              </Link>
            );
          })}

          {/* Profile / Account button */}
          <button
            onClick={() => setIsLoginOpen(true)}
            className="flex flex-col items-center gap-1 py-1 px-3 text-gray-500 hover:text-gray-900 font-medium transition cursor-pointer"
          >
            <div className="relative">
              <img
                src={user.avatar_url}
                alt={user.name}
                className="h-5 w-5 rounded-full object-cover ring-1 ring-gray-300"
              />
              <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-500 ring-1 ring-white" />
            </div>
            <span className="text-[10px] truncate max-w-[45px]">{user.name.split(" ")[0]}</span>
          </button>
        </div>
      </div>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
}
