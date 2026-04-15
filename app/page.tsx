import Header from "@/components/Header";
import Hero from "@/sections/Hero";
import Features from "@/sections/Features";
import Demo from "@/sections/Demo";
import WhyUs from "@/sections/WhyUs";
import Review from "@/sections/Review";
import Pricing from "@/sections/Pricing";
import Footer from "@/sections/Footer";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <Header />
      <Hero />
      <Features />
      <Demo />
      <WhyUs />
      <Review />
      <Pricing />
      <Footer />
    </main>
  );
}