"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Benefits", href: "#benefits" },
  { label: "Testimonials", href: "#testimonials" },
];

interface HeaderProps {
  onLoginClick?: () => void;
}

export default function Header({ onLoginClick }: HeaderProps) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200/80 bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="group flex items-center gap-3"
          aria-label="TeacherPoa Home"
        >
          <Image
            src="/logo.png"
            alt="TeacherPoa"
            width={42}
            height={42}
            priority
            className="h-10 w-10 object-contain transition-transform duration-300 group-hover:scale-105"
          />

          <div>
            <span className="text-lg font-semibold tracking-tight text-neutral-900">
              Teacher
              <span className="text-[#2563EB]">Poa</span>
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav
          className="hidden items-center gap-2 md:flex"
          aria-label="Main Navigation"
        >
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="group relative px-4 py-2 text-sm font-medium text-neutral-600 transition-all duration-300 hover:text-[#2563EB]"
            >
              {link.label}

              {/* Bottom sliding line */}
              <span className="absolute bottom-0 left-1/2 h-[2px] w-0 -translate-x-1/2 rounded-full bg-[#2563EB] transition-all duration-300 ease-out group-hover:w-[80%]" />

              {/* Top sliding line */}
              <span className="absolute top-0 left-1/2 h-[2px] w-0 -translate-x-1/2 rounded-full bg-[#60A5FA] opacity-0 transition-all duration-300 ease-out group-hover:w-[60%] group-hover:opacity-100" />
            </a>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-2 md:flex">
          <button
            type="button"
            onClick={onLoginClick}
            className="rounded-lg px-4 py-2 text-sm font-medium text-neutral-700 transition-all duration-300 hover:bg-neutral-100 hover:text-neutral-900"
          >
            Login
          </button>

          <Link
            href="/register"
            className="rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-medium text-white shadow-sm transition-all duration-300 hover:scale-[1.03] hover:bg-[#1D4ED8]"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-neutral-900 transition-colors hover:bg-neutral-100 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="border-t border-neutral-200 bg-white md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
              >
                {link.label}
              </a>
            ))}

            <div className="mt-3 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  onLoginClick?.();
                }}
                className="rounded-lg border border-neutral-300 px-4 py-2 text-center text-sm font-medium text-neutral-900"
              >
                Login
              </button>

              <Link
                href="/register"
                onClick={() => setOpen(false)}
                className="rounded-lg bg-[#2563EB] px-4 py-2 text-center text-sm font-medium text-white"
              >
                Get Started
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}