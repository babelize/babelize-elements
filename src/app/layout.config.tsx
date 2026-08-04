import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import Image from "next/image";

const githubUrl = "https://github.com/babelize/babelize-elements";

export const baseOptions: BaseLayoutProps = {
  themeSwitch: {
    enabled: false,
  },
  nav: {
    title: (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontWeight: 600,
          width: "100%",
        }}
      >
        <Image
          src="/light_logo.svg"
          alt="Babelize"
          width={32}
          height={32}
          className="block dark:hidden"
          style={{ objectFit: "contain" }}
        />
        <Image
          src="/dark_logo.svg"
          alt="Babelize"
          width={32}
          height={32}
          className="hidden dark:block"
          style={{ objectFit: "contain" }}
        />
        <span>Elements</span>
      </div>
    ),
  },
  links: [
    {
      text: "Home",
      url: "/",
    },
    {
      text: "GitHub",
      url: githubUrl,
      external: true,
    },
  ],
};
