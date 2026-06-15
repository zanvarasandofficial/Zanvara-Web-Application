import { allProducts, formatPrice, productCategories } from "../data/products";

export const adminStats = [
  {
    label: "Total Revenue",
    value: "Rs. 2.48M",
    change: "+12.4%",
    trend: "up",
    note: "vs last 30 days",
  },
  {
    label: "Orders",
    value: "1,284",
    change: "+8.1%",
    trend: "up",
    note: "vs last 30 days",
  },
  {
    label: "Products",
    value: String(allProducts.length),
    change: "+3",
    trend: "up",
    note: "active listings",
  },
  {
    label: "Customers",
    value: "8,420",
    change: "+5.6%",
    trend: "up",
    note: "registered users",
  },
];

export const adminTopProducts = allProducts.slice(0, 5).map((product, index) => ({
  id: product.id,
  name: product.name,
  sales: 120 - index * 17,
  revenue: product.price * (120 - index * 17),
  stock: product.stock,
}));

export const adminCustomers = [
  {
    id: "cust-1",
    name: "Ali Khan",
    email: "ali.khan@email.com",
    phone: "+92 300 1122334",
    orders: 12,
    spent: 184500,
    status: "Active",
    joined: "2024-08-12",
  },
  {
    id: "cust-2",
    name: "Sara Ahmed",
    email: "sara.ahmed@email.com",
    phone: "+92 321 5566778",
    orders: 8,
    spent: 96200,
    status: "Active",
    joined: "2024-11-03",
  },
  {
    id: "cust-3",
    name: "Usman Malik",
    email: "usman.m@email.com",
    phone: "+92 333 9900112",
    orders: 5,
    spent: 42800,
    status: "Active",
    joined: "2025-01-19",
  },
  {
    id: "cust-4",
    name: "Hina Shah",
    email: "hina.shah@email.com",
    phone: "+92 345 7788990",
    orders: 3,
    spent: 31500,
    status: "Inactive",
    joined: "2025-03-08",
  },
  {
    id: "cust-5",
    name: "Bilal Raza",
    email: "bilal.r@email.com",
    phone: "+92 370 6058213",
    orders: 1,
    spent: 8999,
    status: "Active",
    joined: "2026-06-01",
  },
];

export const adminCategories = productCategories.map((name, index) => ({
  id: `cat-${index + 1}`,
  name,
  products: Math.floor(allProducts.filter((p) => p.category === name).length + index * 4 + 8),
  status: "Active",
}));

export const adminOrderStatuses = [
  "Pending",
  "Confirmed",
  "Shipped",
  "Delivered",
  "Cancelled",
];

export function getAdminProductRows() {
  return allProducts.map((product) => ({
    id: product.id,
    name: product.name,
    category: product.category,
    price: product.price,
    stock: product.stock,
    status: product.stock > 0 ? "Published" : "Out of stock",
    badge: product.badge ?? "—",
    image: product.image,
  }));
}

export { formatPrice };
