"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { readLastOrder } from "../../lib/cart/storage";
import OrderCompleteSuccess from "./OrderCompleteSuccess";

export default function OrderSuccessView() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order");
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const savedOrder = readLastOrder();
    if (savedOrder && (!orderId || savedOrder.id === orderId)) {
      setOrder(savedOrder);
    }
  }, [orderId]);

  return <OrderCompleteSuccess order={order} />;
}
