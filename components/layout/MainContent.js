"use client";

import { usePathname } from "next/navigation";

export default function MainContent({ children }) {
  const isHome = usePathname() === "/";

  return (
    <main className={`flex-1 ${isHome ? "" : "pt-[4.5rem]"}`}>{children}</main>
  );
}
