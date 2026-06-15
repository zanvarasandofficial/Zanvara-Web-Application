import { Geist, Geist_Mono } from "next/font/google";
import ConditionalStoreShell from "../components/layout/ConditionalStoreShell";
import AppProviders from "../components/providers/AppProviders";
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
  applicationName: "Zanvara",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-icon.svg", type: "image/svg+xml" }],
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col overflow-x-hidden bg-background text-foreground">
        <AppProviders>
          <ConditionalStoreShell>{children}</ConditionalStoreShell>
        </AppProviders>
      </body>
    </html>
  );
}
