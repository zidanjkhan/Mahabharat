import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Recommended Next.js viewport configuration for mobile responsiveness
export const viewport = {
  width: "device-width",
  initialScale: 1.0,
  maximumScale: 1.0,
  userScalable: false,
};

export const metadata = {
  title: "Interactive Mahabharata Map & Dynasty Family Tree | Aryavarta Exploration",
  description: "Explore the epic world of Aryavarta through an interactive Mahabharata map, regional lore chronicles, and a detailed Kuru dynasty family tree.",
  keywords: ["Mahabharata map", "Aryavarta map", "Mahabharata family tree", "Kuru dynasty", "interactive epic map"],
  openGraph: {
    title: "Interactive Mahabharata Map & Family Tree",
    description: "Explore the epic world of Aryavarta, regional lore, and dynasty lineage.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <meta name="google-site-verification" content="1i2CO4sDAgN5dg96uOqOGdskl_fEI-TaUlJbTA9kV_c" />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}