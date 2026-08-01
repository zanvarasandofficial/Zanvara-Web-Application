import ProfileView from "../../../components/account/ProfileView";
import { buildPageMetadata } from "../../../lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "My profile",
  description: "Manage your Zanvara account profile.",
  path: "/account/profile",
  noIndex: true,
});

export default function ProfilePage() {
  return <ProfileView />;
}
