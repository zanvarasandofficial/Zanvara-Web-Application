export function formatNotificationType(type) {
  if (type === "ORDER") return "Order";
  if (type === "LOGIN") return "Login";
  return type;
}

export function formatNotificationTime(value) {
  return new Date(value).toLocaleString("en-PK", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function getNotificationHref(item) {
  if (item.href) return item.href;
  if (item.type === "ORDER" && item.entityId) {
    return `/dashboard/admin/orders/${item.entityId}`;
  }
  if (item.type === "LOGIN") {
    return "/dashboard/admin/customers";
  }
  return "/dashboard/admin/notifications";
}
