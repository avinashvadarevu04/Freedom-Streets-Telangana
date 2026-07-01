import type { Metadata } from "next";
import { Inter } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Freedom Streets Telangana 2026 | Connecting Communities, Celebrating Culture",
  description: "Experience the immersive journey of Freedom Streets Telangana 2026. Fostering public health, wellness, culture, and community connection across the 33 districts of Telangana.",
  keywords: ["Freedom Streets", "Telangana 2026", "Public Health", "Community Wellness", "Hyderabad Events", "Telangana Districts", "Yoga", "Zumba", "Sports"],
  openGraph: {
    title: "Freedom Streets Telangana 2026",
    description: "Immersive community public health initiative bringing wellness and culture together.",
    type: "website",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} antialiased`}
      style={{ scrollBehavior: "auto" }}
    >
      <body className="bg-[#FAFAFC] text-[#0F172A] font-sans overflow-x-hidden">
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}

