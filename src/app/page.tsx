import type { Metadata } from "next";
import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { Community } from "@/components/landing/community";
import { Faq } from "@/components/landing/faq";
import { Footer } from "@/components/landing/footer";

import { getGitHubStats } from "@/lib/github";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default async function Home() {
  const stats = await getGitHubStats();

  return (
    <div className="flex flex-1 flex-col">
      <Navbar stats={stats} />
      <main>
        <Hero />
        <Features />

        <Community stats={stats} />
        <Faq />
      </main>
      <Footer />
    </div>
  );
}
