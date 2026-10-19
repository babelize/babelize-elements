"use client";

import { NavBar } from "@/registry/components/navbar";
import { locales, navLinks } from "@/lib/elements-config";

export function NavBarDemo() {
  return (
    <NavBar
      logo={<span className="font-semibold tracking-tight">Acme</span>}
      links={navLinks}
      activeHref="/docs"
      locales={locales}
      defaultValue="en"
      onValueChange={(code) => console.log("Selected locale:", code)}
      cta={{ label: "Get started", href: "#get-started" }}
      showGitHub
      variant="floating" // default, floating
      sticky={false}
    />
  );
}
