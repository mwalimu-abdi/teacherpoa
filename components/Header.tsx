"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";

const navLinks = [
  { name: "Home", href: "#" },
  { name: "Features", href: "#services" },
  { name: "Demo", href: "#demo" },
  { name: "Why Us", href: "#why-us" },
  { name: "Reviews", href: "#reviews" },
  { name: "Pricing", href: "#pricing" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 🔥 Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        
        {/* LOGO */}
        <Link href="#" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Teacher Poa Logo"
            width={250}
            height={200}
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
        <div className="relative md:hidden" ref={menuRef}>
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center justify-center rounded-md border border-gray-200 p-2 text-gray-700 transition hover:bg-gray-50"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* 🔥 Full-width dropdown */}
          {open && (
            <div className="fixed left-0 top-[72px] w-full border-t border-gray-200 bg-white p-4 shadow-lg">
              <nav className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="rounded-md px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-blue-600"
                  >
                    {link.name}
                  </a>
                ))}
              </nav>

              <div className="mt-4 flex flex-col gap-3">
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="inline-flex w-full items-center justify-center rounded-md border border-blue-500 px-4 py-2.5 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  onClick={() => setOpen(false)}
                  className="inline-flex w-full items-center justify-center rounded-md bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
                >
                  Signup
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}