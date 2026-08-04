import Link from "next/link";
import Image from "next/image";

const community = [
  {
    name: "GitHub",
    href: "https://github.com/babelize/babelize-elements",
    description: "View the source code and contribute.",
  },
  {
    name: "X / Twitter",
    href: "https://x.com/Babelize125767",
    description: "Follow for updates and announcements.",
  },
  {
    name: "Discord",
    href: "https://discord.gg/4kMng8XVcm",
    description: "Join the community for support and discussions.",
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/company/babelize",
    description: "Connect with us on LinkedIn.",
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/babelizeapp/",
    description: "Follow us on Instagram.",
  },
];

const resources = [
  { name: "Getting Started", href: "/docs/getting-started" },
  { name: "Contributing Guide", href: "/docs/contributing" },
  { name: "GitHub Issues", href: "https://github.com/babelize/babelize-elements/issues" },
];

const babelize = [
  { name: "Babelize", href: "https://www.babelize.co" },
  { name: "App", href: "https://app.babelize.co" },
  { name: "Docs", href: "https://docs.babelize.co" },
];

export function Footer() {
  return (
    <footer className="relative border-t border-white/[0.06] bg-[#030303] py-16">
      {/* Gradient overlay at top */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-emerald-500/[0.03] to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5">
              <Image
                src="/elements_logo.svg"
                alt="Babelize Elements"
                width={160}
                height={30}
                style={{ objectFit: "contain" }}
              />
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/50">
              Open-source localization UI components for React and Tailwind CSS.
              Built by the community, for every localized app.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">Resources</h3>
            <ul className="mt-4 space-y-3">
              {resources.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/60 transition-colors hover:text-white"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">Babelize</h3>
            <ul className="mt-4 space-y-3">
              {babelize.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-white/60 transition-colors hover:text-white"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-6 border-t border-white/[0.06] pt-8 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} Babelize. Made by developers, for
            developers.
          </p>
          <div className="flex flex-wrap gap-6">
            {community.map((item) => (
              <a
                key={item.name}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-white/40 transition-colors hover:text-white"
              >
                {item.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
