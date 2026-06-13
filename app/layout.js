import { Geist, Geist_Mono } from "next/font/google";
import FaqSection from "../components/sections/FaqSection";
import Footer from "../components/layout/Footer";
import Header from "../components/layout/Header";
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
  title: "Zanvara | Modern Commerce",
  description: "Zanvara — a modern dark-themed e-commerce experience.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col overflow-x-hidden bg-background text-foreground">
        <Header isLoggedIn={false} />
        <main className="flex-1 overflow-x-hidden">
          {children}
          <FaqSection />
        </main>
        <Footer />
      </body>
    </html>
  );
}
