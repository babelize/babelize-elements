import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import Image from "next/image";

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
          src="/elements_logo.svg"
          alt="Babelize Elements"
          width={160}
          height={30}
          style={{ objectFit: "contain" }}
        />
      </div>
    ),
  },
  links: [],
};
