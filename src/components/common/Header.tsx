"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LogIn, LogOut, Shield, User } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { signInWithGoogle, logOut } from "@/lib/auth";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const { user, isAdmin } = useAuth();
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
          <div className="hidden md:flex items-center gap-3 relative" ref={dropdownRef}>
            <button
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className="flex items-center gap-2 text-sm transition-colors focus:outline-none"
              title={user?.email || "Account"}
            >
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="Profile"
                  className="w-8 h-8 rounded-full border-2 border-[#333333] hover:border-[#FBBF24] transition-colors"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#1A1A1A] flex items-center justify-center border border-[#333333] hover:border-[#FBBF24] transition-colors">
                  {user ? (
                    <span className="text-[#FBBF24] text-sm font-bold">
                      {user.email?.[0]?.toUpperCase() || "U"}
                    </span>
                  ) : (
                    <User size={16} className="text-[#A0A0A0]" />
                  )}
                </div>
              )}
            </button>

            {/* Dropdown Menu */}
            {profileMenuOpen && (
              <div className="absolute right-0 top-12 w-48 bg-[#111111] border border-[#333333] rounded-xl shadow-2xl overflow-hidden z-50 animate-fade-in py-1">
                {user ? (
                  <>
                    <div className="px-4 py-3 border-b border-[#333333] mb-1">
                      <p className="text-sm font-semibold text-[#F5F5F5] truncate">
                        {user.displayName || 'User'}
                      </p>
                      <p className="text-xs text-[#A0A0A0] truncate">
                        {user.email}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        logOut();
                        setProfileMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-[#E06B3C] hover:bg-[#1A1A1A] transition-colors flex items-center gap-2"
                    >
                      <LogOut size={16} />
                      Log out
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={async () => {
                        try {
                          await signInWithGoogle();
                          setProfileMenuOpen(false);
                        } catch (error: any) {
                          if (error.code === 'auth/cancelled-popup-request' || error.code === 'auth/popup-closed-by-user') {
                            // User just closed the popup, completely normal!
                            console.log("Login cancelled by user");
                          } else {
                            console.error("Login failed:", error);
                          }
                        }
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-[#FBBF24] hover:bg-[#1A1A1A] transition-colors flex items-center gap-2"
                    >
                      <User size={16} />
                      Continue with Google
                    </button>
                  </>
                )}
              </div>
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
