/** In-memory cache of API products for cart validation (not persisted). */
const byId = new Map();
const bySlug = new Map();
const byName = new Map();

export function registerCatalogProducts(products = []) {
  for (const product of products) {
    registerCatalogProduct(product);
  }
}

export function registerCatalogProduct(product) {
  if (!product?.id) {
    return;
  }

  byId.set(product.id, product);

  const slug = product.slug?.trim().toLowerCase();
  if (slug) {
    bySlug.set(slug, product);
  }

  const name = product.name?.trim().toLowerCase();
  if (name) {
    byName.set(name, product);
  }
}

export function getLiveProductById(id) {
  if (!id) {
    return null;
  }

  return byId.get(id) ?? bySlug.get(String(id).trim().toLowerCase()) ?? null;
}

export function findCatalogProduct({ productId, name, slug }) {
  const byKey = productId ? getLiveProductById(productId) : null;
  if (byKey) {
    return byKey;
  }

  const slugKey = slug?.trim().toLowerCase();
  if (slugKey && bySlug.has(slugKey)) {
    return bySlug.get(slugKey);
  }

  const nameKey = name?.trim().toLowerCase();
  if (nameKey && byName.has(nameKey)) {
    return byName.get(nameKey);
  }

  return null;
}

export function resolveCatalogProduct({ productId, cartItem, inlineProduct }) {
  const id = productId ?? inlineProduct?.id ?? cartItem?.productId;
  const live =
    findCatalogProduct({
      productId: id,
      name: inlineProduct?.name ?? cartItem?.name,
      slug: inlineProduct?.slug ?? cartItem?.slug,
    }) ?? null;

  const resolvedId = live?.id ?? id;

  return {
    ...(cartItem ?? {}),
    ...(inlineProduct ?? {}),
    ...(live ?? {}),
    id: resolvedId,
  };
}
