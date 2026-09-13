import { CONTACT_EMAIL, CONTACT_PHONE, INSTAGRAM_URL } from "../data/contact";
import { getProductPath } from "../products/paths";
import { resolvePublicAssetUrl } from "./resolve-image-url";
import { SITE_NAME, absoluteUrl, getSiteUrl } from "./site";

export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: getSiteUrl(),
    logo: absoluteUrl("/icon.svg"),
    email: CONTACT_EMAIL,
    telephone: CONTACT_PHONE,
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer service",
        email: CONTACT_EMAIL,
        telephone: CONTACT_PHONE,
        availableLanguage: ["English", "Urdu"],
        areaServed: ["PK", "Worldwide"],
      },
    ],
    sameAs: [INSTAGRAM_URL],
  };
}

export function buildWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: getSiteUrl(),
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${absoluteUrl("/products")}?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function buildProductSchema(product) {
  if (!product?.id) {
    return null;
  }

  const url = absoluteUrl(getProductPath(product));
  const price = Number(product.price);
  const hasValidPrice = Number.isFinite(price) && price > 0;

  const offers = {
    "@type": "Offer",
    url,
    priceCurrency: "PKR",
    availability:
      product.isComingSoon || (product.stock <= 0 && !product.isPreOrder)
        ? "https://schema.org/OutOfStock"
        : "https://schema.org/InStock",
    itemCondition: "https://schema.org/NewCondition",
  };

  if (hasValidPrice) {
    offers.price = price;
  }

  const imageUrl = resolvePublicAssetUrl(product.image);

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description ?? undefined,
    image: imageUrl ? [imageUrl] : undefined,
    sku: product.id,
    brand: {
      "@type": "Brand",
      name: SITE_NAME,
    },
    offers,
  };
}

export function buildBreadcrumbSchema(items) {
  if (!items?.length) {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function buildFaqSchema(faqItems) {
  if (!Array.isArray(faqItems) || faqItems.length === 0) {
    return null;
  }

  const mainEntity = faqItems
    .filter((item) => typeof item?.question === "string" && typeof item?.answer === "string")
    .map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    }));

  if (!mainEntity.length) {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity,
  };
}
