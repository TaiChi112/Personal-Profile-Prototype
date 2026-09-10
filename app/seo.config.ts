import { Metadata } from "next";

const title = "Anothai(TaiChi) Portfolio";
const description = "Personal Website Portfolio of TaiChi";

export const defaultMetadata: Metadata = {
  title: {
    default: title,
    template: `%s | ${title}`,
  },
  description,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://anothai.com", // Placeholder URL
    title,
    description,
    siteName: title,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  icons: {
    icon: "/favicon.ico",
  },
};
