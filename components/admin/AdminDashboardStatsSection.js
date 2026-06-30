"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "../../lib/api/admin-client";
import { ORDER_STATUS, isOrderDelivered, normalizeOrderStatus } from "../../lib/orders/order-status";
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

function getDeliveredOrders(orders) {
  return orders.filter((order) => isOrderDelivered(order.status));
}

function sumSubtotalRevenue(orders) {
  return getDeliveredOrders(orders).reduce(
    (total, order) => total + (order.subtotal ?? 0),
    0,
  );
}

function sumDeliveryCharges(orders) {
  return getDeliveredOrders(orders).reduce(
    (total, order) => total + (order.deliveryTotal ?? 0),
    0,
  );
}

function countActiveOrders(orders) {
  return orders.filter(
    (order) => normalizeOrderStatus(order.status) !== ORDER_STATUS.CANCELLED,
  ).length;
}

function countCompletedOrders(orders) {
  return orders.filter((order) => isOrderDelivered(order.status)).length;
}

function countPendingOrders(orders) {
  return orders.filter((order) => {
    const status = normalizeOrderStatus(order.status);
    return status !== ORDER_STATUS.CANCELLED && status !== ORDER_STATUS.DELIVERED;
  }).length;
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

  const revenueCurrent = sumSubtotalRevenue(recentOrders);
  const revenuePrevious = sumSubtotalRevenue(previousOrders);
  const deliveryCurrent = sumDeliveryCharges(recentOrders);
  const deliveryPrevious = sumDeliveryCharges(previousOrders);
  const ordersCurrent = countActiveOrders(recentOrders);
  const ordersPrevious = countActiveOrders(previousOrders);
  const pendingOrders = countPendingOrders(orders);
  const completedOrders = countCompletedOrders(orders);

  const publishedProducts = products.filter((product) => product.status === "PUBLISHED");
  const newProducts = filterByAge(
    products,
    (product) => product.createdAt ?? product.updatedAt,
    0,
    30,
  ).length;

  const recentUsers = filterByAge(
    users,
    (user) => user.createdAt,
    0,
    30,
  );
  const previousUsers = filterByAge(
    users,
    (user) => user.createdAt,
    30,
    60,
  );

  const revenueChange = buildPeriodChange(revenueCurrent, revenuePrevious);
  const deliveryChange = buildPeriodChange(deliveryCurrent, deliveryPrevious);
  const ordersChange = buildPeriodChange(ordersCurrent, ordersPrevious);
  const customersChange = buildPeriodChange(recentUsers.length, previousUsers.length);

  return [
    {
      label: "Total Revenue",
      value: formatPrice(sumSubtotalRevenue(orders)),
      change: revenueChange?.change,
      trend: revenueChange?.trend ?? "up",
      note: "product sales · delivered only",
    },
    {
      label: "Delivery Charges",
      value: formatPrice(sumDeliveryCharges(orders)),
      change: deliveryChange?.change,
      trend: deliveryChange?.trend ?? "up",
      note: "shipping fees · delivered only",
    },
    {
      label: "Orders",
      value: String(countActiveOrders(orders)),
      change: ordersChange?.change,
      trend: ordersChange?.trend ?? "up",
      note: `${pendingOrders} pending · ${completedOrders} completed`,
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
  { label: "Delivery Charges", value: "—", note: "Loading..." },
  { label: "Orders", value: "—", note: "Loading..." },
  { label: "Products", value: "—", note: "Loading..." },
  { label: "Customers", value: "—", note: "Loading..." },
];

export default function AdminDashboardStatsSection() {
  const [stats, setStats] = useState(loadingStats);

  useEffect(() => {
    let active = true;

    async function loadStats() {
      try {
        const [orders, products, users] = await Promise.all([
          adminFetch("/admin/orders"),
          adminFetch("/admin/products"),
          adminFetch("/admin/users"),
        ]);

        if (active) {
          setStats(buildDashboardStats(orders, products, users));
        }
      } catch {
        if (active) {
          setStats(loadingStats.map((stat) => ({ ...stat, note: "Could not load stats." })));
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
    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}
