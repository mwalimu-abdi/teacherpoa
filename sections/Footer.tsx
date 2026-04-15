"use client";

import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const quickLinks = [
  { name: "Home", href: "#" },
  { name: "Features", href: "#services" },
  { name: "Why Us", href: "#why-us" },
  { name: "Demo", href: "#demo" },
  { name: "Pricing", href: "#pricing" },
];

const resources = [
  { name: "Blog", href: "#" },
  { name: "Support", href: "#" },
];

const socialLinks = [
  { name: "Facebook", href: "#", icon: FaFacebookF },
  { name: "X", href: "#", icon: FaXTwitter },
  { name: "Instagram", href: "#", icon: FaInstagram },
  { name: "YouTube", href: "#", icon: FaYoutube },
];

export default function Footer() {
  return (
    <footer className="bg-[#b97a2b] px-4 py-12 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        
        {/* Top grid */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          
          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold">Quick Links</h3>
            <div className="mt-5 space-y-3">
              {quickLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="block text-sm text-white/90 transition hover:text-white"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-xl font-bold">Resources</h3>
            <div className="mt-5 space-y-3">
              {resources.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="block text-sm text-white/90 transition hover:text-white"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-bold">Contact Us</h3>
            <div className="mt-5 space-y-4">
              
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-5 w-5 text-white" />
                <a
                  href="mailto:info@teacherpoa.co.ke"
                  className="text-sm text-white/90 hover:text-white"
                >
                  info@teacherpoa.co.ke
                </a>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-5 w-5 text-white" />
                <a
                  href="tel:+254712345678"
                  className="text-sm text-white/90 hover:text-white"
                >
                  0712 345 678
                </a>
              </div>

            </div>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-xl font-bold">Follow Us</h3>

            <div className="mt-5 flex gap-3">
              {socialLinks.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex h-11 w-11 items-center justify-center rounded-md bg-white text-[#b97a2b] transition hover:scale-105"
                    aria-label={item.name}
                  >
                    <Icon className="h-5 w-5" />
                  </Link>
                );
              })}
            </div>
          </div>

        </div>

        {/* Bottom */}
        <div className="mt-10 border-t border-white/30 pt-6 text-center">
          <p className="text-sm text-white/90">
            © 2026 Teacher Poa. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}