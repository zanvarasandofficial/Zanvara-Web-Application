/** In-memory cache of API products for cart validation (not persisted). */
const byId = new Map();

export function registerCatalogProducts(products = []) {
  for (const product of products) {
    if (product?.id) {
      byId.set(product.id, product);
    }
  }
}

export function registerCatalogProduct(product) {
  if (product?.id) {
    byId.set(product.id, product);
  }
}

export function getLiveProductById(id) {
  if (!id) {
    return null;
  }
  return byId.get(id) ?? null;
}

export function resolveCatalogProduct({ productId, cartItem, inlineProduct }) {
  const id = productId ?? inlineProduct?.id ?? cartItem?.productId;
  const live = id ? getLiveProductById(id) : null;

  return {
    ...(cartItem ?? {}),
    ...(inlineProduct ?? {}),
    ...(live ?? {}),
    id,
  };
}
