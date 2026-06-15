"use client";

import { usePathname } from "next/navigation";
import FaqSection from "../sections/FaqSection";
import Footer from "./Footer";
import Header from "./Header";
import MainContent from "./MainContent";

export default function ConditionalStoreShell({ children }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/dashboard/admin");

  if (isAdminRoute) {
    return children;
  }

  return (
    <>
      <Header />
      <MainContent>
        {children}
        <FaqSection />
      </MainContent>
      <Footer />
    </>
  );
}
