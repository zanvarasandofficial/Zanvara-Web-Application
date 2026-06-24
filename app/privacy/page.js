import LegalPageLayout from "../../components/legal/LegalPageLayout";
import { CONTACT_EMAIL } from "../../lib/data/contact";

export const metadata = {
  title: "Privacy Policy | Zanvara",
  description: "How Zanvara collects, uses, and protects your personal information.",
};

const sections = [
  {
    title: "1. Overview",
    paragraphs: [
      "At Zanvara, we respect your privacy. This Privacy Policy explains what information we collect when you use our website, create an account, place an order, or contact our team.",
      "By using Zanvara, you agree to the collection and use of information as described here.",
    ],
  },
  {
    title: "2. Information we collect",
    paragraphs: ["We may collect the following types of information:"],
    list: [
      "Account details such as name, email address, and sign-in method (email OTP or Google).",
      "Order and delivery details including phone number, address, city, and order notes.",
      "Communication records when you contact us by email, WhatsApp, or the contact form.",
      "Newsletter email if you subscribe through our footer signup.",
      "Basic technical data such as browser type, device information, and pages visited to improve site performance.",
    ],
  },
  {
    title: "3. How we use your information",
    paragraphs: ["We use your information to operate and improve Zanvara, including:"],
    list: [
      "Processing and delivering your orders.",
      "Sending order updates, OTP codes, and support responses.",
      "Managing your account and order history.",
      "Responding to contact form messages and customer inquiries.",
      "Sending promotional updates if you subscribed to our newsletter.",
      "Preventing fraud, abuse, and unauthorized access.",
    ],
  },
  {
    title: "4. Sharing of information",
    paragraphs: [
      "We do not sell your personal data. We may share limited information only when necessary to provide our services, such as with delivery partners, payment-related processes, email delivery providers, or cloud hosting and media storage services used to run the store.",
      "We may also disclose information if required by law or to protect the rights, safety, and security of Zanvara, our customers, and others.",
    ],
  },
  {
    title: "5. Cookies & local storage",
    paragraphs: [
      "Zanvara uses cookies and browser storage to keep you signed in, remember cart items, and improve your browsing experience.",
      "You can control cookies through your browser settings, but disabling them may affect checkout, login, and cart functionality.",
    ],
  },
  {
    title: "6. Data retention",
    paragraphs: [
      "We retain account and order-related information for as long as needed to provide services, comply with legal obligations, resolve disputes, and enforce our policies.",
      "Newsletter and contact submissions are kept for support and communication purposes unless you request removal where applicable.",
    ],
  },
  {
    title: "7. Your choices",
    paragraphs: ["You can:"],
    list: [
      "Update your profile details from your account page where available.",
      "Contact us to ask about your data or request correction of inaccurate information.",
      "Unsubscribe from promotional emails using instructions in the message or by contacting us.",
      "Sign out of your account on shared devices.",
    ],
  },
  {
    title: "8. Security",
    paragraphs: [
      "We use reasonable technical and organizational measures to protect your information. However, no online platform can guarantee absolute security, so please use strong credentials and protect access to your account.",
    ],
  },
  {
    title: "9. Children’s privacy",
    paragraphs: [
      "Zanvara is not intended for children under 13. We do not knowingly collect personal information from children. If you believe a child has provided us data, please contact us so we can review and remove it where appropriate.",
    ],
  },
  {
    title: "10. Updates & contact",
    paragraphs: [
      "We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated date. hello world",
      `For privacy-related questions, contact us at ${CONTACT_EMAIL} or visit our contact page.`,
    ],
  },
];

export default function PrivacyPage() {
  return (
    <LegalPageLayout
      badge="Legal"
      title="Privacy Policy"
      description="Learn how Zanvara handles your personal information when you shop, sign in, place orders, or contact our team."
      updatedAt="June 13, 2026"
      sections={sections}
      relatedLinks={[
        { href: "/terms", label: "Terms & Conditions" },
        { href: "/contact", label: "Contact Support" },
      ]}
    />
  );
}
