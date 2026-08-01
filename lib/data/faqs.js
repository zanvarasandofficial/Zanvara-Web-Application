import { FAQ_PLACE_ORDER } from "../content/store-policy";
import { FAQ_PRE_ORDER } from "../content/pre-order";

export const faqItems = [
  {
    id: "faq-1",
    question: "How do I place an order on Zanvara?",
    answer: FAQ_PLACE_ORDER,
  },
  {
    id: "faq-2",
    question: "How do I connect my Zanvara device?",
    steps: [
      "Open the Zanvara App on your smartphone.",
      "Plug in your Zanvara table and wait until the indicator light softly pulses blue.",
      'Tap "Add New Device" at the bottom of the screen.',
      "Confirm that the serial number on screen matches your Zanvara table.",
      'Tap "Set Up".',
      'Select your 2.4GHz Wi-Fi network and tap "Connect".',
      "Enter your Wi-Fi password when prompted.",
      'Once connected, a green confirmation message will appear: "Zanvara device connected successfully."',
      "After a few seconds, the app will refresh and take you to your Table Control Page—ready to select and draw your favorite patterns!",
    ],
  },
  {
    id: "faq-preorder",
    question: "How do pre-orders work?",
    answer: FAQ_PRE_ORDER,
  },
  {
    id: "faq-3",
    question: "How long does delivery take?",
    answerKey: "delivery",
  },
  {
    id: "faq-4",
    question: "Can I return or exchange a product?",
    answer:
      "Yes. Eligible items can be returned or exchanged within 7 days of delivery if unused and in original packaging. Visit our Support section or contact us to start a return request.",
  },
  {
    id: "faq-5",
    question: "Are Zanvara products authentic and quality-checked?",
    answer:
      "Every product listed on Zanvara goes through a quality review before going live. We work with verified suppliers and stand behind the authenticity of items sold on our platform.",
  },
  {
    id: "faq-6",
    question: "How can I track my order after checkout?",
    answer:
      "Once your order ships, you will receive a tracking link by email and SMS. You can also log in to your account and view real-time order status from the My Orders section.",
  },
];
