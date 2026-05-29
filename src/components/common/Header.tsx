"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LogIn, LogOut, Shield, User } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { signInWithGoogle, logOut } from "@/lib/auth";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAdmin } = useAuth();
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/browse", label: "Browse" },
    { href: "/upload", label: "Upload" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#111111] border-b border-[#333333]">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1.5">
            <span className="hand-font text-2xl font-bold tracking-tight text-[#F5F5F5]">
              Prep<span className="text-[#FBBF24]">KLE</span>
            </span>
          </Link>

          {/* Desktop Nav Links — centered */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors relative pb-0.5 ${
                    isActive
                      ? "text-[#FBBF24] border-b-2 border-[#FBBF24]"
                      : "text-[#A0A0A0] hover:text-[#F5F5F5]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            {isAdmin && (
              <Link
                href="/admin"
                className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                  pathname === "/admin"
                    ? "text-[#FBBF24] border-b-2 border-[#FBBF24]"
                    : "text-[#FBBF24] hover:text-[#F59E0B]"
                }`}
              >
                <Shield size={14} />
                Admin
              </Link>
            )}
          </div>

          {/* Right side — auth */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <button
                onClick={() => logOut()}
                className="flex items-center gap-2 text-sm text-[#A0A0A0] hover:text-[#E06B3C] transition-colors"
                title={user.email || ""}
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt=""
                    className="w-8 h-8 rounded-full border-2 border-[#333333]"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#1A1A1A] flex items-center justify-center text-[#FBBF24] text-sm font-bold border border-[#333333]">
                    {user.email?.[0]?.toUpperCase() || "U"}
                  </div>
                )}
              </button>
            ) : (
              <button
                onClick={() => signInWithGoogle()}
                className="flex items-center gap-2 text-sm font-medium text-[#A0A0A0] hover:text-[#F5F5F5] transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-[#1A1A1A] border border-[#333333] flex items-center justify-center">
                  <User size={16} className="text-[#A0A0A0]" />
                </div>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg border border-[#333333] text-[#A0A0A0]"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-[#333333] pt-4 space-y-1 animate-fade-in">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block py-2.5 px-3 rounded-lg text-sm font-medium ${
                    isActive
                      ? "bg-[#1A1A1A] text-[#FBBF24]"
                      : "text-[#A0A0A0] hover:bg-[#1A1A1A]"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}

            {isAdmin && (
              <Link
                href="/admin"
                className="block py-2.5 px-3 rounded-lg text-sm font-medium text-[#FBBF24] hover:bg-[#1A1A1A]"
                onClick={() => setMobileMenuOpen(false)}
              >
                🛡️ Admin Panel
              </Link>
            )}

            <div className="border-t border-[#333333] pt-3 mt-3">
              {user ? (
                <button
                  onClick={() => {
                    logOut();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left py-2.5 px-3 text-sm text-[#E06B3C] hover:bg-[#1A1A1A] rounded-lg"
                >
                  Sign Out ({user.email})
                </button>
              ) : (
                <button
                  onClick={() => {
                    signInWithGoogle();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left py-2.5 px-3 text-sm font-medium text-[#FBBF24] hover:bg-[#1A1A1A] rounded-lg"
                >
                  Sign in with Google
                </button>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
