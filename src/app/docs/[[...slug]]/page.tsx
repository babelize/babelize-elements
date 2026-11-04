import { DocsBody, DocsDescription, DocsPage, DocsTitle } from "fumadocs-ui/page";
import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";
import defaultMdxComponents from "fumadocs-ui/mdx";
import { source } from "@/lib/source";
import { localizedHref } from "@/lib/localized-href";
import { baseOpenGraph, languageAlternates } from "@/lib/locale-path";
import { locales } from "@/i18n/locales";
import type { ComponentProps } from "react";
import { LanguageSwitcherDemo } from "@/components/docs/language-switcher-demo";
import { Flow, RulebookDownload, Takeaway } from "@/components/docs/rulebook";

const GithubIcon = () => (
  <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

const customComponents = {
  ...defaultMdxComponents,
  LanguageSwitcherDemo,
  GithubIcon,
  Flow,
  Takeaway,
  RulebookDownload,
};

/** Links between docs pages stay in the page's language (/ja/docs/…). */
function localizedComponents(locale: string) {
  const { a: A, Card } = defaultMdxComponents;
  return {
    ...customComponents,
    a: (props: ComponentProps<typeof A>) => (
      <A {...props} href={localizedHref(props.href, locale)} />
    ),
    Card: (props: ComponentProps<typeof Card>) => (
      <Card {...props} href={localizedHref(props.href, locale)} />
    ),
  };
}

export default async function Page(props: { params: Promise<{ slug?: string[] }> }) {
  const params = await props.params;
  // The URL's language (/ja/docs/… is served here by the locale proxy); English without a translation.
  const locale = await getLocale();
  const page = source.getPage(params.slug, locale);

  if (!page) {
    notFound();
  }

  const MDX = page.data.body;

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <MDX components={localizedComponents(locale)} />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.getPages().map((page) => ({ slug: page.slugs }));
}

export async function generateMetadata(props: { params: Promise<{ slug?: string[] }> }) {
  const params = await props.params;
  const locale = await getLocale();
  const page = source.getPage(params.slug, locale);
  if (!page) notFound();

  return {
    openGraph: {
      ...baseOpenGraph(locale),
      url: page.url,
      title: page.data.title,
      description: page.data.description,
    },
    title: page.data.title,
    description: page.data.description,
    // Self-referencing canonical; resolves against metadataBase in the root layout.
    // hreflang only for the languages this page is translated into.
    alternates: {
      canonical: page.url,
      languages: languageAlternates(
        page.url,
        locales.filter((l) => source.getPage(params.slug, l)?.locale === l),
      ),
    },
  };
}
