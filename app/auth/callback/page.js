"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { useCustomerAuth } from "../../../context/CustomerAuthContext";
import {
  clearCustomerSession,
  fetchCustomerProfile,
} from "../../../lib/api/customer-auth";

function readTokenFromCallbackUrl() {
  if (typeof window === "undefined") {
    return null;
  }

  const hash = window.location.hash?.replace(/^#/, "");
  if (hash) {
    const fromHash = new URLSearchParams(hash).get("token");
    if (fromHash) {
      return fromHash;
    }
  }

  return new URLSearchParams(window.location.search).get("token");
}

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { completeSession } = useCustomerAuth();
  const [message, setMessage] = useState("Signing you in...");
  const handledRef = useRef(false);

  useEffect(() => {
    async function finishGoogleLogin() {
      if (handledRef.current) {
        return;
      }
      handledRef.current = true;

      const token = readTokenFromCallbackUrl();
      const redirect = searchParams.get("redirect") || "/checkout";

      if (!token) {
        setMessage("Sign in failed. Missing token.");
        return;
      }

      try {
        localStorage.setItem("zanvara_customer_token", token);
        const user = await fetchCustomerProfile(token);

        if (!user) {
          throw new Error("Could not load your profile.");
        }

        completeSession(token, user);

        if (typeof window !== "undefined") {
          window.history.replaceState({}, "", "/auth/callback");
        }

        router.replace(redirect);
      } catch (error) {
        clearCustomerSession();
        setMessage(
          error?.message?.includes("reach Zanvara API")
            ? error.message
            : "Google sign in failed. Please try again from checkout.",
        );
      }
    }

    finishGoogleLogin();
  }, [searchParams, completeSession, router]);

  return (
    <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center px-4 text-center">
      <p className="text-sm text-zinc-400">{message}</p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-sm text-zinc-400">Loading...</div>}>
      <AuthCallbackContent />
    </Suspense>
  );
}
