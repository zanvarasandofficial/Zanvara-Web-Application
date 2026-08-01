import { getApiUrl } from "./config";
import { DEFAULT_FREE_DELIVERY_MIN_TABLES } from "../content/store-policy";
import { DEFAULT_PKR_TO_USD_RATE } from "../money/constants";

const API_URL = getApiUrl();

export async function fetchStoreSettings() {
  try {
    const response = await fetch(`${API_URL}/settings/store`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return {
        freeDeliveryMinTableQuantity: DEFAULT_FREE_DELIVERY_MIN_TABLES,
        pkrToUsdRate: DEFAULT_PKR_TO_USD_RATE,
      };
    }

    const data = await response.json();
    const min = Number(data.freeDeliveryMinTableQuantity);
    const rate = Number(data.pkrToUsdRate);
    return {
      freeDeliveryMinTableQuantity:
        Number.isFinite(min) && min >= 1 ? min : DEFAULT_FREE_DELIVERY_MIN_TABLES,
      pkrToUsdRate:
        Number.isFinite(rate) && rate > 0 ? rate : DEFAULT_PKR_TO_USD_RATE,
    };
  } catch {
    return {
      freeDeliveryMinTableQuantity: DEFAULT_FREE_DELIVERY_MIN_TABLES,
      pkrToUsdRate: DEFAULT_PKR_TO_USD_RATE,
    };
  }
}
