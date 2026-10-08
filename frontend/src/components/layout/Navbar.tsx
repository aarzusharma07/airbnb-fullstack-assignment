"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  Menu,
  Heart,
  Luggage,
  Compass,
  Home,
  PlusCircle,
  MessageSquare,
  ShieldCheck,
  Sun,
  Moon,
  ArrowRightLeft,
  SlidersHorizontal,
  UserCheck,
  LayoutDashboard,
  LogIn,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useSearch } from "@/context/SearchContext";
import SearchModal from "./SearchModal";
import LoginModal from "@/components/auth/LoginModal";
import IdentityVerificationModal from "@/components/auth/IdentityVerificationModal";

export default function Navbar() {
  const pathname = usePathname();
  const { user, isHost, toggleHostMode } = useAuth();
  const { filters, openSearchModal } = useSearch();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isIdentityModalOpen, setIsIdentityModalOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem("airbnb_theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("airbnb_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("airbnb_theme", "light");
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getPillLabels = () => {
    const where = filters.search || filters.city || "Anywhere";
    let when = "Any week";
    if (filters.start_date) {
      const s = filters.start_date.split("-").slice(1).join("/");
      const e = filters.end_date ? filters.end_date.split("-").slice(1).join("/") : "";
      when = e ? `${s} - ${e}` : s;
    }
    const who = filters.guests ? `${filters.guests} guest${filters.guests > 1 ? "s" : ""}` : "Add guests";
    const hasActiveFilters = Boolean(filters.search || filters.city || filters.start_date || filters.guests);

    return { where, when, who, hasActiveFilters };
  };

  const pill = getPillLabels();

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-gray-200/80 bg-white/95 backdrop-blur-md transition-all">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Main Desktop & Tablet Navbar */}
          <div className="flex h-20 items-center justify-between gap-4">
            {/* Brand Logo */}
            <Link href="/" className="flex items-center gap-2.5 group shrink-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#FF385C] shadow-sm shadow-pink-500/30 group-hover:scale-105 transition-transform">
                <svg
                  viewBox="0 0 32 32"
                  aria-hidden="true"
                  focusable="false"
                  className="h-6 w-6 fill-white"
                >
                  <path d="M16 1c2.008 0 3.463.963 4.751 3.269l.533 1.025c1.954 3.83 6.114 12.54 7.1 14.836l.145.353c.667 1.591.91 2.479.96 3.397.086 1.587-.456 3.195-1.503 4.464-1.258 1.524-3.09 2.417-5.068 2.454-2.148.04-4.148-.962-5.419-2.731l-.499-.718-.499.718c-1.271 1.769-3.271 2.771-5.419 2.731-1.978-.037-3.81-.93-5.068-2.454-1.047-1.269-1.589-2.877-1.503-4.464.05-.918.293-1.806.96-3.397l.145-.353c.986-2.296 5.146-11.006 7.1-14.836l.533-1.025C12.537 1.963 13.992 1 16 1zm0 2c-1.241 0-2.28.625-3.391 2.617l-.547 1.053C10.15 10.428 6.046 19.034 5.093 21.258l-.133.326c-.536 1.278-.731 1.98-.769 2.693-.059 1.096.31 2.203 1.033 3.079.88 1.066 2.158 1.688 3.535 1.714 1.65.03 3.23-.748 4.22-2.091l1.02-1.428 1.02 1.428c.99 1.343 2.57 2.121 4.22 2.091 1.377-.026 2.655-.648 3.535-1.714.723-.876 1.092-1.983 1.033-3.079-.038-.713-.233-1.415-.769-2.693l-.133-.326c-.953-2.224-5.057-10.83-6.969-14.588l-.547-1.053C18.28 3.625 17.241 3 16 3zm0 13c2.209 0 4 1.791 4 4 0 1.258-.581 2.38-1.493 3.111l-.229.171-.278.18c-1.205.748-2.795.748-4 0l-.278-.18-.229-.171C12.581 22.38 12 21.258 12 20c0-2.209 1.791-4 4-4zm0 2c-1.105 0-2 .895-2 2 0 .524.202 1.002.535 1.363l.135.132.17.135c.697.492 1.623.492 2.32 0l.17-.135.135-.132C17.798 21.002 18 20.524 18 20c0-1.105-.895-2-2-2z" />
                </svg>
              </div>
              <div className="hidden sm:flex flex-col leading-none">
                <span className="text-xl font-black tracking-tight text-[#FF385C]">
                  airbnb
                </span>
                <span className="text-[10px] font-bold tracking-widest uppercase text-gray-400">
                  By Aarzu
                </span>
              </div>
            </Link>

            {/* Centered Floating Search Pill */}
            <div
              className="flex-1 max-w-md mx-2 hidden sm:flex items-center rounded-full border border-gray-300 py-1.5 pl-4 pr-1.5 shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_14px_rgba(0,0,0,0.12)] transition-shadow cursor-pointer text-xs divide-x divide-gray-200 bg-white"
            >
              {/* Where */}
              <button
                type="button"
                onClick={() => openSearchModal("where")}
                className="flex-1 px-3 py-1 text-left font-bold truncate text-gray-900 hover:text-black transition cursor-pointer"
              >
                {pill.where}
              </button>

              {/* When */}
              <button
                type="button"
                onClick={() => openSearchModal("dates")}
                className="flex-1 px-3 py-1 text-left font-bold text-gray-900 hidden lg:inline-block hover:text-black transition cursor-pointer"
              >
                {pill.when}
              </button>

              {/* Who & Search Trigger */}
              <div
                onClick={() => openSearchModal("who")}
                className="flex items-center gap-2 pl-3 pr-1 py-1 cursor-pointer shrink-0"
              >
                <span className={`hidden md:inline-block text-xs ${filters.guests ? "text-gray-900 font-bold" : "text-gray-500 font-normal"}`}>
                  {pill.who}
                </span>
                <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-[#E61E4D] to-[#FF385C] text-white hover:brightness-105 transition shadow-xs">
                  <Search className="h-3.5 w-3.5 stroke-[2.5]" />
                  {pill.hasActiveFilters && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-black rounded-full ring-2 ring-white" />
                  )}
                </div>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden xl:flex items-center gap-1 font-semibold text-sm text-gray-700">
              <Link
                href="/"
                className={`px-3 py-2 rounded-full transition ${
                  pathname === "/" ? "text-black font-bold bg-gray-100" : "hover:bg-gray-100"
                }`}
              >
                Explore
              </Link>
              <Link
                href="/trips"
                className={`px-3 py-2 rounded-full transition ${
                  pathname === "/trips" ? "text-black font-bold bg-gray-100" : "hover:bg-gray-100"
                }`}
              >
                Trips
              </Link>
              <Link
                href="/wishlists"
                className={`px-3 py-2 rounded-full transition ${
                  pathname === "/wishlists" ? "text-black font-bold bg-gray-100" : "hover:bg-gray-100"
                }`}
              >
                Wishlists
              </Link>
            </nav>

            {/* Right Action & Profile Button */}
            <div className="flex items-center gap-2 relative" ref={menuRef}>
              {/* Switch to Host / Traveling pill */}
              <button
                onClick={toggleHostMode}
                className="hidden lg:flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold text-gray-800 bg-gray-100 hover:bg-gray-200/80 transition cursor-pointer"
              >
                <Home className="w-3.5 h-3.5 text-[#FF385C]" />
                {isHost ? "Switch to Traveling" : "Host a Home"}
              </button>

              {/* Profile Menu Pill Button */}
              <button
                type="button"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-2.5 rounded-full border border-gray-300 py-1 pl-3 pr-1.5 hover:shadow-md transition-shadow bg-white cursor-pointer focus:outline-hidden"
                aria-label="User profile menu"
              >
                <Menu className="h-4 w-4 text-gray-700 stroke-[2.5]" />
                <div className="relative">
                  <img
                    src={user.avatar_url}
                    alt={user.name}
                    className="h-7 w-7 rounded-full object-cover ring-1 ring-gray-200"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                </div>
              </button>

              {/* Side Floating Dropdown Card */}
              {isMenuOpen && (
                <div
                  className="absolute right-0 top-12 z-50 w-72 rounded-3xl border border-gray-200/90 bg-white py-2 shadow-2xl animate-in fade-in zoom-in-95 duration-150 divide-y divide-gray-100"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* User Profile Card */}
                  <div className="px-4 py-3 bg-gray-50/70">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.avatar_url}
                        alt={user.name}
                        className="h-10 w-10 rounded-full object-cover ring-1 ring-gray-200"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <p className="text-sm font-bold text-gray-900 truncate">
                            {user.name}
                          </p>
                          {user.is_superhost ? (
                            <span className="text-[10px] bg-red-100 text-[#FF385C] font-extrabold px-1.5 py-0.2 rounded-full">
                              Superhost
                            </span>
                          ) : (
                            <span className="text-[10px] bg-gray-200 text-gray-800 font-bold px-1.5 py-0.2 rounded-full">
                              Guest
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        toggleHostMode();
                        setIsMenuOpen(false);
                      }}
                      className="mt-3 w-full flex items-center justify-center gap-2 rounded-xl bg-white border border-gray-300 py-1.5 px-3 text-xs font-bold text-gray-800 hover:border-black transition cursor-pointer shadow-2xs"
                    >
                      <ArrowRightLeft className="w-3.5 h-3.5 text-[#FF385C]" />
                      {isHost ? "Switch to Guest view" : "Switch to Host view"}
                    </button>
                  </div>

                  {/* Core Navigation Links */}
                  <div className="py-1.5">
                    <Link
                      href="/trips"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-xs font-bold text-gray-800 hover:bg-gray-50 transition"
                    >
                      <Luggage className="w-4 h-4 text-gray-500" />
                      Trips & Reservations
                    </Link>
                    <Link
                      href="/wishlists"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-xs font-bold text-gray-800 hover:bg-gray-50 transition"
                    >
                      <Heart className="w-4 h-4 text-gray-500" />
                      Saved Wishlists
                    </Link>
                    <Link
                      href="/messages"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-xs font-bold text-gray-800 hover:bg-gray-50 transition"
                    >
                      <MessageSquare className="w-4 h-4 text-gray-500" />
                      Host Messages
                    </Link>
                  </div>

                  {/* Host Workspace */}
                  <div className="py-1.5">
                    <Link
                      href="/host/dashboard"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
                    >
                      <LayoutDashboard className="w-4 h-4 text-gray-500" />
                      Host Dashboard & Analytics
                    </Link>
                    <Link
                      href="/host/create"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
                    >
                      <PlusCircle className="w-4 h-4 text-gray-500" />
                      Create a New Listing
                    </Link>
                    <button
                      onClick={() => {
                        setIsIdentityModalOpen(true);
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left flex items-center gap-3 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition cursor-pointer"
                    >
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      Identity Verification
                    </button>
                  </div>

                  {/* Settings & Profile Switcher */}
                  <div className="py-1.5">
                    <button
                      onClick={toggleDarkMode}
                      className="w-full text-left flex items-center justify-between px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        {isDarkMode ? (
                          <Sun className="w-4 h-4 text-amber-500" />
                        ) : (
                          <Moon className="w-4 h-4 text-gray-600" />
                        )}
                        <span>{isDarkMode ? "Light theme" : "Dark theme"}</span>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setIsLoginModalOpen(true);
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left flex items-center gap-3 px-4 py-2 text-xs font-bold text-[#FF385C] hover:bg-pink-50/50 transition cursor-pointer"
                    >
                      <LogIn className="w-4 h-4 text-[#FF385C]" />
                      Switch Profile / Log In
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Full-Width Search Pill */}
          <div className="block sm:hidden pb-3">
            <button
              onClick={() => openSearchModal("where")}
              className="w-full flex items-center gap-3 rounded-full border border-gray-300 py-2.5 px-4 shadow-[0_2px_8px_rgba(0,0,0,0.06)] bg-white text-left cursor-pointer"
            >
              <Search className="h-4 w-4 text-black shrink-0" />
              <div className="flex-1 truncate">
                <p className="text-xs font-bold text-gray-900 truncate">
                  {pill.where}
                </p>
                <p className="text-[11px] text-gray-500 truncate">
                  {pill.when} · {pill.who}
                </p>
              </div>
              <div className="rounded-full border border-gray-200 p-1.5 text-gray-700">
                <SlidersHorizontal className="h-3.5 w-3.5" />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Interactive Search Modal */}
      <SearchModal />

      {/* Login & Profile Switcher Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />

      {/* Identity Verification Modal */}
      <IdentityVerificationModal
        isOpen={isIdentityModalOpen}
        onClose={() => setIsIdentityModalOpen(false)}
      />
    </>
  );
}