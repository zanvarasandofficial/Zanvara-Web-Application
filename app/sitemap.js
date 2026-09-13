import { fetchAllProducts } from "../lib/api/products";
import { getProductPath } from "../lib/products/paths";
import { absoluteUrl, getSiteUrl } from "../lib/seo/site";

export default async function sitemap() {
  const staticRoutes = [
    { path: "/", priority: 1, changeFrequency: "daily" },
    { path: "/products", priority: 0.9, changeFrequency: "daily" },
    { path: "/about", priority: 0.7, changeFrequency: "monthly" },
    { path: "/contact", priority: 0.7, changeFrequency: "monthly" },
    { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
    { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
  ];

  const now = new Date();
  const entries = staticRoutes.map((route) => ({
    url: absoluteUrl(route.path),
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  let products = [];
  try {
    products = await fetchAllProducts();
  } catch {
    products = [];
  }

  for (const product of products) {
    if (!product?.id) {
      continue;
    }

    entries.push({
      url: absoluteUrl(getProductPath(product)),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }

  if (!getSiteUrl().includes("localhost")) {
    return entries;
  }

  return entries;
}
