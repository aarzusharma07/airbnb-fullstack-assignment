"use client";

import React, { useState } from "react";
import { X, UserCheck, ShieldCheck, Mail, Smartphone, ArrowRight, Check } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { User } from "@/types";
import toast from "react-hot-toast";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { user, users, switchUser } = useAuth();
  const [activeTab, setActiveTab] = useState<"quick" | "custom">("quick");
  const [customName, setCustomName] = useState("");
  const [customEmail, setCustomEmail] = useState("");

  if (!isOpen) return null;

  const handleSelectUser = (selectedUser: User) => {
    switchUser(selectedUser);
    toast.success(`Logged in as ${selectedUser.name}`);
    onClose();
  };

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim() || !customEmail.trim()) {
      toast.error("Please provide both name and email");
      return;
    }

    const newUser: User = {
      id: Math.floor(Math.random() * 1000) + 10,
      name: customName.trim(),
      email: customEmail.trim(),
      avatar_url: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80`,
      is_host: false,
      is_superhost: false,
      joined_date: "Joined Today",
    };

    switchUser(newUser);
    toast.success(`Welcome to Airbnb, ${newUser.name}!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative flex items-center justify-center border-b border-gray-200 px-6 py-4">
          <button
            onClick={onClose}
            className="absolute left-6 rounded-full p-2 text-gray-500 hover:bg-gray-100 transition cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
          <h3 className="text-base font-bold text-gray-900">Log in or sign up</h3>
        </div>

        {/* Content */}
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-1">
            Welcome to Airbnb
          </h2>
          <p className="text-xs text-gray-500 mb-5">
            Switch demo roles or sign in with your account to experience reservations, wishlists, and hosting.
          </p>

          {/* Tab selector */}
          <div className="flex rounded-xl bg-gray-100 p-1 mb-5">
            <button
              onClick={() => setActiveTab("quick")}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition cursor-pointer ${
                activeTab === "quick"
                  ? "bg-white text-gray-900 shadow-xs"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Demo Profiles
            </button>
            <button
              onClick={() => setActiveTab("custom")}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition cursor-pointer ${
                activeTab === "custom"
                  ? "bg-white text-gray-900 shadow-xs"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Custom Sign In
            </button>
          </div>

          {activeTab === "quick" ? (
            <div className="space-y-3">
              {users.map((u) => {
                const isActive = user.id === u.id;
                return (
                  <div
                    key={u.id}
                    onClick={() => handleSelectUser(u)}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      isActive
                        ? "border-black bg-gray-50/80 shadow-xs ring-1 ring-black"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50/40"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <img
                        src={u.avatar_url}
                        alt={u.name}
                        className="h-11 w-11 rounded-full object-cover ring-1 ring-gray-200"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-gray-900">{u.name}</span>
                          {u.is_superhost ? (
                            <span className="text-[10px] font-extrabold bg-red-100 text-[#FF385C] px-2 py-0.5 rounded-full">
                              Superhost
                            </span>
                          ) : (
                            <span className="text-[10px] font-semibold bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                              Guest
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">{u.email}</p>
                      </div>
                    </div>

                    {isActive ? (
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-black text-white">
                        <Check className="h-4 w-4 stroke-[3]" />
                      </div>
                    ) : (
                      <div className="text-xs font-bold text-gray-400 group-hover:text-gray-900">
                        Select
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <form onSubmit={handleCustomLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Your Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Aarzu"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-black focus:outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="e.g. aarzu@example.com"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-black focus:outline-hidden"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl text-sm font-bold text-white btn-airbnb-primary shadow-md hover:brightness-105 transition cursor-pointer"
              >
                Continue
              </button>
            </form>
          )}

          {/* Social login buttons */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <span className="relative bg-white px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
              or continue with
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleSelectUser(users[0])}
              className="flex items-center justify-center gap-2 rounded-xl border border-gray-300 py-2.5 px-4 text-xs font-bold text-gray-700 hover:border-black transition cursor-pointer"
            >
              <Mail className="h-4 w-4 text-red-500" />
              Google
            </button>
            <button
              onClick={() => handleSelectUser(users[1] || users[0])}
              className="flex items-center justify-center gap-2 rounded-xl border border-gray-300 py-2.5 px-4 text-xs font-bold text-gray-700 hover:border-black transition cursor-pointer"
            >
              <Smartphone className="h-4 w-4 text-gray-900" />
              Apple
            </button>
          </div>

          <p className="text-[11px] text-gray-400 text-center mt-5">
            By logging in, you agree to Airbnb&apos;s Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
