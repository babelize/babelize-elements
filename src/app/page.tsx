import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { ComponentShowcase } from "@/components/landing/components";
import { GettingStarted } from "@/components/landing/getting-started";
import { Contribute } from "@/components/landing/contribute";
import { Faq } from "@/components/landing/faq";
import { Footer } from "@/components/landing/footer";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <ComponentShowcase />
        <GettingStarted />
        <Contribute />
        <Faq />
      </main>
      <Footer />
    </div>
  );
}
