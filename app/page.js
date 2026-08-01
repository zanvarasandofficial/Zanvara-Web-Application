import LandingPageContent from "../components/home/LandingPageContent";
import JsonLd from "../components/seo/JsonLd";
import { faqItems } from "../lib/data/faqs";
import { buildFaqSchema } from "../lib/seo/json-ld";
import { buildPageMetadata } from "../lib/seo/metadata";

export const dynamic = "force-dynamic";

export const metadata = buildPageMetadata({
  title: "Premium kinetic sand tables in Pakistan",
  description:
    "Discover Zanvara kinetic sand tables — sensory calm for home and workspace. Cash on delivery, pre-order options, and curated premium quality across Pakistan.",
  path: "/",
  keywords: [
    "Zanvara",
    "kinetic sand table Pakistan",
    "buy sand table online",
    "sensory furniture",
    "COD tables Pakistan",
  ],
});

export default function Home() {
  const faqSchema = buildFaqSchema(faqItems);

  return (
    <>
      {faqSchema ? <JsonLd data={faqSchema} /> : null}
      <LandingPageContent />
    </>
  );
}
