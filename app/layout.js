import { cookies } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import ConditionalStoreShell from "../components/layout/ConditionalStoreShell";
import AppProviders from "../components/providers/AppProviders";
import GlobalStructuredData from "../components/seo/GlobalStructuredData";
import { CURRENCY, COUNTRY_COOKIE, CURRENCY_COOKIE } from "../lib/money/constants";
import { rootMetadata } from "../lib/seo/metadata";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = rootMetadata;

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0A0A0A",
};

export default async function RootLayout({ children }) {
  const cookieStore = await cookies();
  const currencyCookie = cookieStore.get(CURRENCY_COOKIE)?.value;
  const initialCurrency = currencyCookie === CURRENCY.USD ? CURRENCY.USD : CURRENCY.PKR;
  const initialCountry = cookieStore.get(COUNTRY_COOKIE)?.value?.toUpperCase() ?? "PK";

  return (
    <html
      lang="en-PK"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col overflow-x-hidden bg-background text-foreground">
        <GlobalStructuredData />
        <AppProviders initialCurrency={initialCurrency} initialCountry={initialCountry}>
          <ConditionalStoreShell>{children}</ConditionalStoreShell>
        </AppProviders>
      </body>
    </html>
  );
}
