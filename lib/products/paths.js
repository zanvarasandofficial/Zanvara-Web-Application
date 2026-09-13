export function getProductPath(product) {
  if (!product) {
    return "/products";
  }

  const slug = product.slug?.trim();
  if (slug) {
    return `/products/${slug}`;
  }

  return `/products/${product.id}`;
}
