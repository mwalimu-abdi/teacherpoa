"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";

const navLinks = [
  { name: "Home", href: "#" },
  { name: "Features", href: "#services" },
  { name: "Why Us", href: "#why-us" },
  { name: "Demo", href: "#demo" },
  { name: "Pricing", href: "#pricing" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        
        {/* LOGO */}
        <Link href="#" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Teacher Poa Logo"
            width={250}   // 🔥 FIXED (important)
            height={200}  // 🔥 FIXED (important)
            priority
            className="h-14 w-14 object-contain sm:h-16 sm:w-16"
          />
          <p className="text-lg font-bold text-gray-800 sm:text-xl">
            Teacher Poa
          </p>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-gray-700 transition hover:text-blue-600"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Desktop Buttons */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className="rounded-md border border-blue-500 px-4 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="rounded-md bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            Signup
          </Link>
        </div>

        {/* Mobile Menu */}
        <details className="relative md:hidden">
          <summary className="flex cursor-pointer list-none items-center justify-center rounded-md border border-gray-200 p-2 text-gray-700 transition hover:bg-gray-50">
            <Menu className="h-5 w-5" />
          </summary>

          <div className="absolute right-0 top-[calc(100%+12px)] w-72 rounded-xl border border-gray-200 bg-white p-3 shadow-lg">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="rounded-md px-3 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-blue-600"
                >
                  {link.name}
                </a>
              ))}
            </nav>

            <div className="mt-3 flex flex-col gap-3">
              <Link
                href="/login"
                className="inline-flex w-full items-center justify-center rounded-md border border-blue-500 px-4 py-2.5 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="inline-flex w-full items-center justify-center rounded-md bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
              >
                Signup
              </Link>
            </div>
          </div>
        </details>
      </div>
    </header>
  );
}