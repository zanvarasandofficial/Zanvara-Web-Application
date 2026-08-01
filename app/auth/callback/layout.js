import { buildPageMetadata } from "../../../lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "Signing in",
  description: "Completing your Zanvara sign in.",
  path: "/auth/callback",
  noIndex: true,
});

export default function AuthCallbackLayout({ children }) {
  return children;
}
