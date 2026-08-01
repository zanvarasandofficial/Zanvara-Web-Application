import {
  DEFAULT_DESCRIPTION,
  DEFAULT_KEYWORDS,
  SITE_NAME,
  absoluteUrl,
  getSiteUrl,
} from "./site";
import { resolvePublicAssetUrl } from "./resolve-image-url";

const DEFAULT_OG_IMAGE_PATH = "/icon.svg";

export function getDefaultOgImageUrl() {
  return absoluteUrl(DEFAULT_OG_IMAGE_PATH);
}

export function buildPageMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  path = "/",
  keywords = DEFAULT_KEYWORDS,
  image,
  noIndex = false,
  openGraphType = "website",
}) {
  const canonical = absoluteUrl(path);
  const ogImage = image ?? getDefaultOgImageUrl();
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;

  return {
    title: { absolute: fullTitle },
    description,
    keywords: keywords.join(", "),
    alternates: {
      canonical,
    },
    openGraph: {
      type: openGraphType,
      locale: "en_PK",
      url: canonical,
      siteName: SITE_NAME,
      title: fullTitle,
      description,
      images: [
        {
          url: ogImage,
          alt: SITE_NAME,
        },
      ],
    },
    twitter: {
      card: image && image !== getDefaultOgImageUrl() ? "summary_large_image" : "summary",
      title: fullTitle,
      description,
      images: [ogImage],
    },
    robots: noIndex
      ? { index: false, follow: false, googleBot: { index: false, follow: false } }
      : {
          index: true,
          follow: true,
          googleBot: { index: true, follow: true, "max-image-preview": "large" },
        },
  };
}

export function buildProductMetadata(product) {
  if (!product) {
    return buildPageMetadata({
      title: "Product not found",
      description: "This product is no longer available at Zanvara.",
      path: "/products",
      noIndex: true,
    });
  }

  const path = `/products/${product.id}`;
  const description =
    product.description?.trim() ||
    `Buy ${product.name} at Zanvara. Premium kinetic sand tables with cash on delivery in Pakistan.`;

  const image = resolvePublicAssetUrl(product.image) ?? getDefaultOgImageUrl();

  return buildPageMetadata({
    title: product.name,
    description: description.slice(0, 160),
    path,
    image,
    openGraphType: "website",
    keywords: [
      ...DEFAULT_KEYWORDS,
      product.name,
      product.category,
      "buy kinetic sand table",
    ].filter(Boolean),
  });
}

export const rootMetadata = {
  metadataBase: new URL(getSiteUrl()),
  applicationName: SITE_NAME,
  title: {
    default: `${SITE_NAME} | ${DEFAULT_DESCRIPTION.split(".")[0]}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  keywords: DEFAULT_KEYWORDS,
  authors: [{ name: SITE_NAME, url: getSiteUrl() }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_PK",
    url: getSiteUrl(),
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    images: [{ url: getDefaultOgImageUrl(), alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    images: [getDefaultOgImageUrl()],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-icon.svg", type: "image/svg+xml" }],
  },
};

export const privatePageRobots = {
  index: false,
  follow: false,
  googleBot: { index: false, follow: false },
};
