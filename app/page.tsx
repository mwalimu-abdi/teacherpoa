"use client";

import { useState } from "react";

import Header from "@/components/Header";

import LoginDrawer from "@/components/LoginDrawer";
import RegisterDrawer from "@/components/RegisterDrawer";
import ForgotPasswordDrawer from "@/components/ForgotPasswordDrawer";

import Hero from "@/sections/Hero";
import Features from "@/sections/Features";
import Stats from "@/sections/Stats";
import HowItWorks from "@/sections/HowItWorks";
import Benefits from "@/sections/Benefits";
import Testimonials from "@/sections/Testimonials";
import CTA from "@/sections/CTA";
import Footer from "@/sections/Footer";

export default function HomePage() {
  const [activeDrawer, setActiveDrawer] = useState<
    "login" | "register" | "forgot" | null
  >(null);

  return (
    <>
      {/* LOGIN DRAWER */}
      <LoginDrawer
        open={activeDrawer === "login"}
        onClose={() => setActiveDrawer(null)}
        onOpenRegister={() => setActiveDrawer("register")}
        onOpenForgot={() => setActiveDrawer("forgot")}
      />

      {/* REGISTER DRAWER */}
      <RegisterDrawer
        open={activeDrawer === "register"}
        onClose={() => setActiveDrawer(null)}
        onOpenLogin={() => setActiveDrawer("login")}
      />

      {/* FORGOT PASSWORD DRAWER */}
      <ForgotPasswordDrawer
        open={activeDrawer === "forgot"}
        onClose={() => setActiveDrawer(null)}
        onOpenLogin={() => setActiveDrawer("login")}
      />

      {/* WEBSITE */}
      <main
        className={`min-h-screen bg-white transition-all duration-700 ease-[cubic-bezier(.22,1,.36,1)] ${
          activeDrawer
            ? "-translate-x-[320px] scale-[0.98] rounded-r-3xl overflow-hidden shadow-2xl"
            : "translate-x-0 scale-100"
        }`}
      >
        <Header
          onLoginClick={() => setActiveDrawer("login")}
        />

        {/* HERO */}
        <Hero
          onOpenRegister={() => setActiveDrawer("register")}
        />

        {/* FEATURES */}
        <Features />

        {/* STATS */}
        <Stats />

        {/* HOW IT WORKS */}
        <HowItWorks />

        {/* BENEFITS */}
        <Benefits />

        {/* TESTIMONIALS */}
        <Testimonials />

        {/* CTA */}
        <CTA
          onOpenRegister={() => setActiveDrawer("register")}
        />

        {/* FOOTER */}
        <Footer />
      </main>
    </>
  );
}