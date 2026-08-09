import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { Community } from "@/components/landing/community";
import { Faq } from "@/components/landing/faq";
import { Footer } from "@/components/landing/footer";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <Navbar />
      <main>
        <Hero />
        <Features />

        <Community />
        <Faq />
      </main>
      <Footer />
    </div>
  );
}
