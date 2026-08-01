export const ZANVARA_APP_ANCHOR = "zanvara-app";

export const zanvaraAppFeatureHighlights = [
  "Timer",
  "LED control",
  "Effects",
  "Motion",
  "1000+ patterns",
  "Wi‑Fi setup",
];

export const zanvaraAppShortDescription =
  "Free on iOS and Android. Control timer, LEDs, effects, and motion—and choose from 1000+ patterns right from your phone.";

export const zanvaraAppProductNote =
  "Includes free app access: timer, LED control, effects, motion, and 1000+ patterns.";

export function getZanvaraAppStoreUrls() {
  return {
    ios: process.env.NEXT_PUBLIC_ZANVARA_APP_IOS_URL?.trim() || "",
    android: process.env.NEXT_PUBLIC_ZANVARA_APP_ANDROID_URL?.trim() || "",
  };
}
