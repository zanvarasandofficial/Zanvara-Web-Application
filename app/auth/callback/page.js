"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useCustomerAuth } from "../../../context/CustomerAuthContext";
import { fetchCustomerProfile } from "../../../lib/api/customer-auth";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { completeSession } = useCustomerAuth();
  const [message, setMessage] = useState("Signing you in...");

  useEffect(() => {
    async function finishGoogleLogin() {
      const token = searchParams.get("token");
      const redirect = searchParams.get("redirect") || "/checkout";

      if (!token) {
        setMessage("Sign in failed. Missing token.");
        return;
      }

      try {
        localStorage.setItem("zanvara_customer_token", token);
        const user = await fetchCustomerProfile();

        if (!user) {
          throw new Error("Could not load your profile.");
        }

        completeSession(token, user);
        router.replace(redirect);
      } catch {
        setMessage("Google sign in failed. Please try again from checkout.");
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
