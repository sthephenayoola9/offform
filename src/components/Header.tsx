"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Search,
  Bookmark,
  Bell,
  MessageSquare,
  Menu,
  X,
  Shield,
  Store,
  User,
  Sparkles,
  ArrowRight,
} from "lucide-react";

interface HeaderProps {
  user: {
    id: string;
    username: string;
    displayName: string;
    avatar: string | null;
    role: string;
    isApprovedSeller: boolean;
  } | null;
}

export function Header({ user }: HeaderProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const navLinks = [
    { label: "Discover", href: "/discover" },
    { label: "Marketplace", href: "/marketplace" },
    { label: "Designers", href: "/designers" },
    { label: "Collaborate", href: "/collaborate" },
    { label: "Events", href: "/events" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#F8F5F0]/95 backdrop-blur-md border-b border-[#E7E1DB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Wordmark */}
          <div className="flex items-center gap-8">
            <Link href="/" className="group flex flex-col">
              <span className="font-editorial text-3xl sm:text-4xl font-bold tracking-tight text-[#252321] group-hover:text-[#A92735] transition-colors leading-none">
                OFFFORM<span className="text-[#A92735]">.</span>
              </span>
              <span className="text-[10px] tracking-[0.2em] uppercase text-[#77716D] font-medium mt-1">
                Outside the ordinary
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all ${
                      isActive
                        ? "bg-[#252321] text-white"
                        : "text-[#252321] hover:text-[#A92735] hover:bg-[#F0EAE1]"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Action Icons & Profile */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Search Bar Button */}
            <Link
              href="/search"
              aria-label="Search"
              className="p-2 text-[#77716D] hover:text-[#252321] hover:bg-[#EFE9E0] rounded-full transition-colors"
            >
              <Search className="w-4 h-4" />
            </Link>

            {user ? (
              <>
                {/* Saved Items */}
                <Link
                  href="/saved"
                  aria-label="Saved items"
                  className="p-2 text-[#77716D] hover:text-[#252321] hover:bg-[#EFE9E0] rounded-full transition-colors relative"
                >
                  <Bookmark className="w-4 h-4" />
                </Link>

                {/* Messages */}
                <Link
                  href="/messages"
                  aria-label="Messages"
                  className="p-2 text-[#77716D] hover:text-[#252321] hover:bg-[#EFE9E0] rounded-full transition-colors relative"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#A92735] rounded-full" />
                </Link>

                {/* Notifications */}
                <Link
                  href="/notifications"
                  aria-label="Notifications"
                  className="p-2 text-[#77716D] hover:text-[#252321] hover:bg-[#EFE9E0] rounded-full transition-colors relative"
                >
                  <Bell className="w-4 h-4" />
                </Link>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full border border-[#E7E1DB] hover:border-[#D1C8BF] bg-white transition-all text-left"
                  >
                    <img
                      src={user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"}
                      alt={user.displayName}
                      className="w-7 h-7 rounded-full object-cover border border-[#E7E1DB]"
                    />
                    <div className="hidden lg:block text-left pr-2">
                      <p className="text-xs font-semibold text-[#252321] leading-none">
                        {user.displayName}
                      </p>
                      <p className="text-[10px] text-[#A92735] font-medium tracking-wider uppercase mt-0.5">
                        {user.role}
                      </p>
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  {profileDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-56 bg-white border border-[#E7E1DB] rounded-xl shadow-editorial py-2 z-50 animate-in fade-in slide-in-from-top-1"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <div className="px-4 py-2 border-b border-[#F4F1EC]">
                        <p className="text-xs font-bold text-[#252321]">{user.displayName}</p>
                        <p className="text-[11px] text-[#77716D]">@{user.username}</p>
                      </div>

                      <Link
                        href="/profile"
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-[#252321] hover:bg-[#F8F5F0] transition-colors"
                      >
                        <User className="w-3.5 h-3.5 text-[#77716D]" /> My Profile & Collections
                      </Link>

                      {user.role === "SELLER" ? (
                        <Link
                          href="/seller"
                          className="flex items-center gap-2.5 px-4 py-2 text-xs text-[#252321] hover:bg-[#F8F5F0] transition-colors"
                        >
                          <Store className="w-3.5 h-3.5 text-[#A92735]" /> Seller Workspace
                        </Link>
                      ) : (
                        <Link
                          href="/seller/apply"
                          className="flex items-center gap-2.5 px-4 py-2 text-xs text-[#252321] hover:bg-[#F8F5F0] transition-colors"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-[#A92735]" /> Apply to Sell
                        </Link>
                      )}

                      {user.role === "ADMIN" && (
                        <Link
                          href="/admin"
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-[#791D29] bg-[#FBECEE] hover:bg-[#F8DDE1] transition-colors"
                        >
                          <Shield className="w-3.5 h-3.5 text-[#791D29]" /> Admin & Moderation
                        </Link>
                      )}

                      <div className="border-t border-[#F4F1EC] my-1" />

                      <Link
                        href="/policies/community"
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-[#77716D] hover:bg-[#F8F5F0] transition-colors"
                      >
                        Community Guidelines
                      </Link>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/auth/login"
                  className="text-xs font-semibold px-4 py-2 text-[#252321] hover:text-[#A92735] transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/register"
                  className="text-xs font-medium px-4 py-2 bg-[#252321] text-white hover:bg-[#A92735] rounded-full transition-all flex items-center gap-1.5"
                >
                  Join Community <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#252321] hover:bg-[#EFE9E0] rounded-full transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E7E1DB] bg-[#F8F5F0] px-4 pt-3 pb-6 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-2.5 rounded-lg text-sm font-medium ${
                pathname === link.href
                  ? "bg-[#252321] text-white"
                  : "text-[#252321] hover:bg-[#EFE9E0]"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="border-t border-[#E7E1DB] pt-3 flex flex-col gap-2">
            <Link
              href="/search"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-4 py-2 text-sm text-[#77716D]"
            >
              <Search className="w-4 h-4" /> Search OFFFORM
            </Link>
            {user?.role === "ADMIN" && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[#791D29] bg-[#FBECEE] rounded-lg"
              >
                <Shield className="w-4 h-4" /> Admin Console
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
