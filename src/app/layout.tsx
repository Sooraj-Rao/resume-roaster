import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Resume Roaster | Honest Feedback for Your CV",
  description:
    "Get brutally honest feedback on your resume. Our AI-powered tool roasts your CV to help you improve and stand out in the job market.",
  keywords: [
    "ai resume feedback",
    "CV review",
    "job application help",
    "career advice",
    "AI resume analysis",
  ],
  authors: [{ name: "Sooraj Rao" }],
  creator: "Sooraj Rao",
  publisher: "Sooraj Rao",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://roast.soorajrao.in/",
    siteName: "AI Resume Roaster",
    title: "AI Resume Roaster | Honest Feedback for Your CV",
    description:
      "Get brutally honest feedback on your resume. Our AI-powered tool roasts your CV to help you improve and stand out in the job market.",
    images: [
      {
        url: "https://roast.soorajrao.in/home.webp",
        width: 1200,
        height: 630,
        alt: "AI Resume Roaster Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Resume Roaster | Honest Feedback for Your CV",
    description:
      "Get brutally honest feedback on your resume. Our AI-powered tool roasts your CV to help you improve and stand out in the job market.",
    images: ["https://roast.soorajrao.in/home.webp"],
    creator: "@SoorajRaoo",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "AI Resume Roaster",
              url: "https://roast.soorajrao.in/",
              description:
                "Get brutally honest feedback on your resume. Our AI-powered tool roasts your CV to help you improve and stand out in the job market.",
            }),
          }}
        />
      </head>
      <body className={GeistSans.className}>{children}</body>
    </html>
  );
}
