import { formatMoney } from "../money/format";

export function formatPrice(amount) {
  return formatMoney(amount);
}

export { formatMoney, syncMoneyFormatterState } from "../money/format";

export function getDiscountPercent(originalPrice, priceAfterDiscount) {
  if (
    originalPrice == null ||
    priceAfterDiscount == null ||
    priceAfterDiscount <= 0 ||
    priceAfterDiscount >= originalPrice
  ) {
    return null;
  }

  return Math.round(((originalPrice - priceAfterDiscount) / originalPrice) * 100);
}

export function getSellingPrice(originalPrice, priceAfterDiscount) {
  const discountPercent = getDiscountPercent(originalPrice, priceAfterDiscount);
  return discountPercent != null ? priceAfterDiscount : originalPrice;
}

export { productCategories } from "./categories";

export const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A to Z" },
  { value: "discount", label: "Biggest Discount" },
];
