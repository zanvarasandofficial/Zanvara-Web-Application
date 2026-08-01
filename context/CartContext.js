"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { fetchProductById } from "../lib/api/products";
import { getCartDeliverySummary } from "../lib/products/delivery";
import { isComingSoonPurchaseBlocked } from "../lib/products/availability";
import {
  getCartFulfillmentKind,
  getPurchasableQuantity,
  isPreOrderActive,
} from "../lib/products/fulfillment";
import {
  getLiveProductById,
  registerCatalogProduct,
  resolveCatalogProduct,
} from "../lib/products/live-catalog";
import { useStorePolicy } from "./StorePolicyContext";
import { useToast } from "./ToastContext";
import { readCartFromStorage, writeCartToStorage } from "../lib/cart/storage";

const CartContext = createContext(null);

function normalizeItem(item) {
  return {
    productId: item.productId,
    name: item.name,
    price: item.price,
    originalPrice: item.originalPrice ?? null,
    image: item.image,
    stock: item.stock,
    quantity: item.quantity,
    deliveryType: item.deliveryType ?? "FREE",
    deliveryCharge: item.deliveryCharge ?? null,
    isPreOrder: Boolean(item.isPreOrder),
    fulfillmentType: item.fulfillmentType ?? (item.isPreOrder ? "PRE_ORDER" : "STANDARD"),
    expectedShipAt: item.expectedShipAt ?? null,
    expectedShipNote: item.expectedShipNote ?? null,
  };
}

function buildCartLineFromProduct(catalogProduct, quantity) {
  const preOrder = isPreOrderActive(catalogProduct);
  const maxQty = getPurchasableQuantity(catalogProduct);

  return {
    productId: catalogProduct.id,
    name: catalogProduct.name,
    price: catalogProduct.price,
    originalPrice: catalogProduct.originalPrice ?? null,
    image: catalogProduct.image,
    stock: maxQty,
    quantity,
    deliveryType: catalogProduct.deliveryType ?? "FREE",
    deliveryCharge: catalogProduct.deliveryCharge ?? null,
    isPreOrder: preOrder,
    fulfillmentType: preOrder ? "PRE_ORDER" : "STANDARD",
    expectedShipAt: catalogProduct.expectedShipAt ?? null,
    expectedShipNote: catalogProduct.expectedShipNote ?? null,
  };
}

function reconcileCartItems(current, { notifyRemoved } = {}) {
  let removed = 0;
  const next = [];

  for (const item of current) {
    const catalogProduct = resolveCatalogProduct({
      productId: item.productId,
      cartItem: item,
    });

    if (isComingSoonPurchaseBlocked(catalogProduct)) {
      removed += 1;
      continue;
    }

    const maxQty = getPurchasableQuantity(catalogProduct);
    if (maxQty <= 0) {
      removed += 1;
      continue;
    }

    const qty = Math.min(item.quantity, maxQty);
    next.push(normalizeItem(buildCartLineFromProduct(catalogProduct, qty)));
  }

  if (removed > 0 && notifyRemoved) {
    notifyRemoved(removed);
  }

  const changed =
    removed > 0 ||
    next.length !== current.length ||
    next.some((line, index) => {
      const prev = current[index];
      return (
        !prev ||
        line.productId !== prev.productId ||
        line.quantity !== prev.quantity ||
        line.isPreOrder !== prev.isPreOrder ||
        line.stock !== prev.stock ||
        line.expectedShipAt !== prev.expectedShipAt
      );
    });

  return changed ? next : current;
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isReady, setIsReady] = useState(false);
  const { freeDeliveryMinTableQuantity } = useStorePolicy();
  const { showToast } = useToast();
  const syncedProductIdsRef = useRef("");

  const cartProductIdsKey = useMemo(
    () =>
      items
        .map((item) => item.productId)
        .sort()
        .join("|"),
    [items],
  );

  useEffect(() => {
    setItems(readCartFromStorage());
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) return;
    writeCartToStorage(items);
  }, [items, isReady]);

  useEffect(() => {
    if (!isReady || items.length === 0) return;
    if (syncedProductIdsRef.current === cartProductIdsKey) return;

    let cancelled = false;

    async function syncCartWithCatalog() {
      const ids = [...new Set(items.map((item) => item.productId))];

      await Promise.all(
        ids.map(async (id) => {
          if (getLiveProductById(id)) {
            return;
          }
          const product = await fetchProductById(id);
          if (product) {
            registerCatalogProduct(product);
          }
        }),
      );

      if (cancelled) return;

      setItems((current) => {
        const currentKey = current
          .map((item) => item.productId)
          .sort()
          .join("|");
        if (currentKey !== cartProductIdsKey) {
          return current;
        }

        return reconcileCartItems(current, {
          notifyRemoved: (count) => {
            showToast(
              count === 1
                ? "An item was removed — coming soon or no longer available."
                : `${count} items were removed — coming soon or no longer available.`,
              "error",
            );
          },
        });
      });

      syncedProductIdsRef.current = cartProductIdsKey;
    }

    syncCartWithCatalog();

    return () => {
      cancelled = true;
    };
  }, [isReady, items.length, cartProductIdsKey, showToast]);

  const itemCount = useMemo(() => items.length, [items]);

  const subtotal = useMemo(
    () => items.reduce((total, item) => total + item.price * item.quantity, 0),
    [items],
  );

  const deliverySummary = useMemo(
    () => getCartDeliverySummary(items, freeDeliveryMinTableQuantity),
    [items, freeDeliveryMinTableQuantity],
  );
  const deliveryTotal = deliverySummary.total;
  const deliveryNote = deliverySummary.note;

  const total = useMemo(() => subtotal + deliveryTotal, [subtotal, deliveryTotal]);
  const fulfillmentKind = useMemo(() => getCartFulfillmentKind(items), [items]);

  const addItem = useCallback((product, quantity = 1) => {
    registerCatalogProduct(product);
    syncedProductIdsRef.current = "";

    const catalogProduct = resolveCatalogProduct({
      productId: product.id,
      inlineProduct: product,
    });
    const maxQty = getPurchasableQuantity(catalogProduct);
    const qty = Math.max(1, quantity);

    if (isComingSoonPurchaseBlocked(catalogProduct)) {
      return {
        ok: false,
        message: "This item is coming soon — not available to order yet.",
      };
    }

    if (maxQty <= 0) {
      return {
        ok: false,
        message: isPreOrderActive(catalogProduct)
          ? "Pre-order slots are full for this table."
          : "This item is out of stock.",
      };
    }

    let result = { ok: true, message: "" };

    setItems((current) => {
      const existing = current.find((item) => item.productId === catalogProduct.id);
      const currentQty = existing?.quantity ?? 0;
      const nextQty = currentQty + qty;

      if (nextQty > maxQty) {
        result = {
          ok: false,
          message: isPreOrderActive(catalogProduct)
            ? `Only ${maxQty} pre-order slot(s) left.`
            : `Only ${maxQty} left in stock.`,
        };
        return current;
      }

      if (existing) {
        return current.map((item) =>
          item.productId === catalogProduct.id
            ? normalizeItem({
                ...buildCartLineFromProduct(catalogProduct, nextQty),
              })
            : item,
        );
      }

      return [...current, normalizeItem(buildCartLineFromProduct(catalogProduct, qty))];
    });

    return result;
  }, []);

  const updateQuantity = useCallback((productId, quantity) => {
    let result = { ok: true, message: "" };

    setItems((current) => {
      const item = current.find((entry) => entry.productId === productId);
      if (!item) return current;

      const catalogProduct = resolveCatalogProduct({
        productId,
        cartItem: item,
      });

      if (isComingSoonPurchaseBlocked(catalogProduct)) {
        result = {
          ok: false,
          message: "This item is coming soon — not available to order yet.",
        };
        return current.filter((entry) => entry.productId !== productId);
      }

      const maxQty = getPurchasableQuantity(catalogProduct) || item.stock;
      const nextQty = Math.max(1, Math.min(quantity, maxQty));

      if (quantity > maxQty) {
        result = {
          ok: false,
          message: item.isPreOrder
            ? `Only ${maxQty} pre-order slot(s) available.`
            : `Only ${maxQty} available in stock.`,
        };
      }

      return current.map((entry) =>
        entry.productId === productId
          ? normalizeItem({
              ...buildCartLineFromProduct(catalogProduct, nextQty),
            })
          : entry,
      );
    });

    return result;
  }, []);

  const removeItem = useCallback((productId) => {
    syncedProductIdsRef.current = "";
    setItems((current) => current.filter((item) => item.productId !== productId));
  }, []);

  const clearCart = useCallback(() => {
    syncedProductIdsRef.current = "";
    setItems([]);
  }, []);

  const value = useMemo(
    () => ({
      items,
      itemCount,
      subtotal,
      deliveryTotal,
      deliveryNote,
      fulfillmentKind,
      total,
      isReady,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
    }),
    [
      items,
      itemCount,
      subtotal,
      deliveryTotal,
      deliveryNote,
      fulfillmentKind,
      total,
      isReady,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
