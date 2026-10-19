"use client";

import { useState } from "react";
import { NavBar } from "@/registry/components/navbar";
import { locales, navCopy } from "@/lib/elements-config";

export function NavBarDemo() {
  const [locale, setLocale] = useState("en");

  return (
    <NavBar
      logo={<span className="font-semibold tracking-tight">Acme</span>}
      links={navCopy[locale].links}
      activeHref="/docs"
      locales={locales}
      value={locale}
      onValueChange={setLocale}
      cta={{ label: navCopy[locale].cta, href: "#get-started" }}
      showGitHub
      githubUrl="babelize/babelize-elements" // "owner/repo" or a full URL
      variant="floating" // default, floating
      sticky={false}
    />
  );
}
