"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "../../lib/api/admin-client";
import { ORDER_STATUS, readOrderHistory } from "../../lib/orders/order-storage";
import { formatPrice } from "../../lib/products/pricing";
import StatCard from "./StatCard";

const MS_DAY = 1000 * 60 * 60 * 24;

function filterByAge(items, getDate, minDays, maxDays) {
  const now = Date.now();

  return items.filter((item) => {
    const timestamp = new Date(getDate(item)).getTime();
    if (Number.isNaN(timestamp)) return false;

    const ageDays = (now - timestamp) / MS_DAY;
    return ageDays >= minDays && ageDays < maxDays;
  });
}

function sumRevenue(orders) {
  return orders
    .filter((order) => order.status !== ORDER_STATUS.CANCELLED)
    .reduce((total, order) => total + (order.total ?? 0), 0);
}

function countOrders(orders) {
  return orders.filter((order) => order.status !== ORDER_STATUS.CANCELLED).length;
}

function buildPeriodChange(current, previous) {
  if (current === 0 && previous === 0) {
    return null;
  }

  if (previous === 0) {
    return { change: `+${current}`, trend: "up" };
  }

  const percent = ((current - previous) / previous) * 100;
  const rounded = Math.abs(percent) >= 10 ? percent.toFixed(0) : percent.toFixed(1);

  return {
    change: `${percent >= 0 ? "+" : ""}${rounded}%`,
    trend: percent >= 0 ? "up" : "down",
  };
}

function buildDashboardStats(orders, products, users) {
  const recentOrders = filterByAge(orders, (order) => order.createdAt, 0, 30);
  const previousOrders = filterByAge(orders, (order) => order.createdAt, 30, 60);

  const revenueCurrent = sumRevenue(recentOrders);
  const revenuePrevious = sumRevenue(previousOrders);
  const ordersCurrent = countOrders(recentOrders);
  const ordersPrevious = countOrders(previousOrders);

  const publishedProducts = products.filter((product) => product.status === "PUBLISHED");
  const newProducts = filterByAge(products, (product) => product.createdAt, 0, 30).length;

  const recentUsers = filterByAge(users, (user) => user.createdAt, 0, 30);
  const previousUsers = filterByAge(users, (user) => user.createdAt, 30, 60);

  const revenueChange = buildPeriodChange(revenueCurrent, revenuePrevious);
  const ordersChange = buildPeriodChange(ordersCurrent, ordersPrevious);
  const customersChange = buildPeriodChange(recentUsers.length, previousUsers.length);

  return [
    {
      label: "Total Revenue",
      value: formatPrice(sumRevenue(orders)),
      change: revenueChange?.change,
      trend: revenueChange?.trend ?? "up",
      note: "from checkout orders",
    },
    {
      label: "Orders",
      value: String(countOrders(orders)),
      change: ordersChange?.change,
      trend: ordersChange?.trend ?? "up",
      note: "vs previous 30 days",
    },
    {
      label: "Products",
      value: String(publishedProducts.length),
      change: newProducts > 0 ? `+${newProducts}` : null,
      trend: "up",
      note: "published listings",
    },
    {
      label: "Customers",
      value: String(users.length),
      change: customersChange?.change,
      trend: customersChange?.trend ?? "up",
      note: "registered users",
    },
  ];
}

const loadingStats = [
  { label: "Total Revenue", value: "—", note: "Loading..." },
  { label: "Orders", value: "—", note: "Loading..." },
  { label: "Products", value: "—", note: "Loading..." },
  { label: "Customers", value: "—", note: "Loading..." },
];

export default function AdminDashboardStatsSection() {
  const [stats, setStats] = useState(loadingStats);

  useEffect(() => {
    let active = true;

    async function loadStats() {
      const orders = readOrderHistory();

      try {
        const [products, users] = await Promise.all([
          adminFetch("/admin/products"),
          adminFetch("/admin/users"),
        ]);

        if (active) {
          setStats(buildDashboardStats(orders, products, users));
        }
      } catch {
        if (active) {
          setStats(buildDashboardStats(orders, [], []));
        }
      }
    }

    loadStats();

    function handleFocus() {
      loadStats();
    }

    window.addEventListener("focus", handleFocus);

    return () => {
      active = false;
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}
