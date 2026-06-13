"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getProductById } from "../lib/data/products";
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
  };
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setItems(readCartFromStorage());
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) return;
    writeCartToStorage(items);
  }, [items, isReady]);

  const itemCount = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items],
  );

  const subtotal = useMemo(
    () => items.reduce((total, item) => total + item.price * item.quantity, 0),
    [items],
  );

  const addItem = useCallback((product, quantity = 1) => {
    const catalogProduct = getProductById(product.id) ?? product;
    const productStock = catalogProduct.stock ?? 0;
    const qty = Math.max(1, quantity);

    let result = { ok: true, message: "" };

    setItems((current) => {
      const existing = current.find((item) => item.productId === catalogProduct.id);
      const currentQty = existing?.quantity ?? 0;
      const nextQty = currentQty + qty;

      if (nextQty > productStock) {
        result = {
          ok: false,
          message: `Only ${productStock} left in stock.`,
        };
        return current;
      }

      if (existing) {
        return current.map((item) =>
          item.productId === catalogProduct.id
            ? { ...item, quantity: nextQty, stock: productStock }
            : item,
        );
      }

      return [
        ...current,
        normalizeItem({
          productId: catalogProduct.id,
          name: catalogProduct.name,
          price: catalogProduct.price,
          originalPrice: catalogProduct.originalPrice ?? null,
          image: catalogProduct.image,
          stock: productStock,
          quantity: qty,
        }),
      ];
    });

    return result;
  }, []);

  const updateQuantity = useCallback((productId, quantity) => {
    let result = { ok: true, message: "" };

    setItems((current) => {
      const item = current.find((entry) => entry.productId === productId);
      if (!item) return current;

      const product = getProductById(productId);
      const maxStock = product?.stock ?? item.stock;
      const nextQty = Math.max(1, Math.min(quantity, maxStock));

      if (quantity > maxStock) {
        result = {
          ok: false,
          message: `Only ${maxStock} available in stock.`,
        };
      }

      return current.map((entry) =>
        entry.productId === productId
          ? { ...entry, quantity: nextQty, stock: maxStock }
          : entry,
      );
    });

    return result;
  }, []);

  const removeItem = useCallback((productId) => {
    setItems((current) => current.filter((item) => item.productId !== productId));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const value = useMemo(
    () => ({
      items,
      itemCount,
      subtotal,
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
