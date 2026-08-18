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

export const metadata = {
  title: "Interactive Mahabharata Map & Family Tree | Aryavarta Exploration",
  description: "Explore the epic world of Aryavarta through an interactive Mahabharata map, regional lore chronicles, and a detailed Kuru dynasty family tree.",
  keywords: ["Mahabharata map", "Aryavarta map", "Mahabharata family tree", "Kuru dynasty", "interactive epic map"],
  openGraph: {
    title: "Interactive Mahabharata Map & Family Tree",
    description: "Explore the epic world of Aryavarta, regional lore, and dynasty lineage.",
    type: "website",
  },
  other: {
    "google-site-verification": "PASTE_YOUR_GOOGLE_CODE_HERE",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}