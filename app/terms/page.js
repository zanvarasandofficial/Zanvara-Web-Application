import LegalPageLayout from "../../components/legal/LegalPageLayout";
import { CONTACT_EMAIL } from "../../lib/data/contact";

export const metadata = {
  title: "Terms & Conditions | Zanvara",
  description: "Terms and conditions for shopping on Zanvara — orders, delivery, returns, and payments.",
};

const sections = [
  {
    title: "1. About Zanvara",
    paragraphs: [
      "Zanvara is an online store offering curated products with a premium shopping experience. By browsing our website, creating an account, or placing an order, you agree to these Terms & Conditions.",
      "If you do not agree with any part of these terms, please do not use our website or services.",
    ],
  },
  {
    title: "2. Orders & account",
    paragraphs: [
      "To place an order on Zanvara, you may need to sign in using email verification or Google. You are responsible for keeping your account details accurate and secure.",
      "When you submit an order, you confirm that the delivery information you provide is correct and that you are authorized to use the selected payment method.",
    ],
    list: [
      "Order confirmation appears after successful checkout on our website.",
      "We may contact you by phone, WhatsApp, or email to confirm delivery details.",
      "We reserve the right to cancel or refuse orders in cases of pricing errors, stock issues, or suspected fraud.",
    ],
  },
  {
    title: "3. Pricing & availability",
    paragraphs: [
      "All prices on Zanvara are displayed in Pakistani Rupees (PKR) unless stated otherwise. Product availability, offers, and pricing may change without prior notice.",
      "We try to ensure product descriptions, images, and prices are accurate. If an error occurs, we will notify you and offer a correction, cancellation, or refund where applicable.",
    ],
  },
  {
    title: "4. Payment",
    paragraphs: [
      "Zanvara currently supports Cash on Delivery (COD) for eligible orders. Payment is collected when your order is delivered to your address.",
      "By choosing COD, you agree to pay the full order amount at the time of delivery if you accept the parcel.",
    ],
  },
  {
    title: "5. Delivery",
    paragraphs: [
      "Delivery timelines depend on your city, product availability, and courier operations. Estimated delivery information may appear on product or checkout pages.",
      "Delays caused by weather, holidays, courier issues, or incorrect address details are outside our direct control, but our support team will help wherever possible.",
    ],
    list: [
      "Please provide a complete address, active phone number, and city.",
      "Someone must be available to receive the order at the delivery address.",
      "If delivery fails due to incorrect details or repeated unavailability, the order may be cancelled.",
    ],
  },
  {
    title: "6. Returns, exchanges & refunds",
    id: "returns",
    paragraphs: [
      "We want you to shop with confidence. If you receive a damaged, defective, or incorrect item, contact us within 48 hours of delivery with your order ID and photos of the product.",
      "Approved returns may be replaced, exchanged, or refunded depending on stock and the nature of the issue. Items must be unused and returned in original packaging where possible.",
    ],
    list: [
      "Change-of-mind returns may be accepted only for eligible unused products within the stated return window.",
      "Opened personal care, hygiene, or custom items may not be eligible for return.",
      "Refunds for approved cases are processed after inspection and may take several business days.",
    ],
  },
  {
    title: "7. Product reviews",
    paragraphs: [
      "Customers may leave reviews for products after an order is marked as delivered. Reviews should be honest, respectful, and based on your actual experience.",
      "We may remove reviews that contain abuse, spam, misleading claims, or content that violates our community standards.",
    ],
  },
  {
    title: "8. Acceptable use",
    paragraphs: [
      "You agree not to misuse the Zanvara website, attempt unauthorized access, interfere with checkout or account systems, or use our platform for unlawful activity.",
      "We may suspend or restrict accounts that violate these terms or harm other customers or our business operations.",
    ],
  },
  {
    title: "9. Limitation of liability",
    paragraphs: [
      "Zanvara is not liable for indirect, incidental, or consequential losses arising from website downtime, delivery delays beyond reasonable control, or third-party service failures.",
      "Our total liability for any eligible claim related to a specific order is limited to the amount paid for that order, except where applicable law requires otherwise.",
    ],
  },
  {
    title: "10. Changes & contact",
    paragraphs: [
      "We may update these Terms & Conditions from time to time. Continued use of Zanvara after updates means you accept the revised terms.",
      `For questions about these terms, orders, or returns, contact us at ${CONTACT_EMAIL} or through our contact page.`,
    ],
  },
];

export default function TermsPage() {
  return (
    <LegalPageLayout
      badge="Legal"
      title="Terms & Conditions"
      description="These terms explain how Zanvara works — from placing an order and cash on delivery to delivery, returns, and customer support."
      updatedAt="June 13, 2026"
      sections={sections}
      relatedLinks={[
        { href: "/privacy", label: "Privacy Policy" },
        { href: "/contact", label: "Contact Support" },
      ]}
    />
  );
}
