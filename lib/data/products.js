export function formatPrice(amount) {
  return `Rs. ${amount.toLocaleString("en-PK")}`;
}

export const heroProducts = [
  {
    id: "hero-1",
    name: "Aura Wireless Headphones",
    price: 12499,
    originalPrice: 18999,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    tag: "Featured Drop",
    description: "Studio-grade sound with adaptive noise cancellation.",
  },
  {
    id: "hero-2",
    name: "Lumen Smart Watch Pro",
    price: 21999,
    originalPrice: 27999,
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
    tag: "Best Seller",
    description: "Track fitness, calls, and style in one premium device.",
  },
  {
    id: "hero-3",
    name: "Nova Minimal Sneakers",
    price: 8999,
    originalPrice: 11999,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
    tag: "Limited Edition",
    description: "Lightweight comfort built for everyday street style.",
  },
];

export const popularProducts = [
  {
    id: "pop-1",
    name: "Velvet Edge Backpack",
    price: 6499,
    originalPrice: 8999,
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
    hoverImage:
      "https://images.unsplash.com/photo-1622560480605-d83c853bc1c4?auto=format&fit=crop&w=800&q=80",
    badge: "Popular",
  },
  {
    id: "pop-2",
    name: "Crystal Air Earbuds",
    price: 7499,
    originalPrice: 9999,
    image:
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80",
    hoverImage:
      "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=800&q=80",
    badge: "Top Rated",
  },
  {
    id: "pop-3",
    name: "Urban Flex Hoodie",
    price: 4999,
    originalPrice: 6999,
    image:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=80",
    hoverImage:
      "https://images.unsplash.com/photo-1578587018452-892bace96632?auto=format&fit=crop&w=800&q=80",
    badge: "Trending",
  },
  {
    id: "pop-4",
    name: "Pure Brew Coffee Maker",
    price: 15999,
    originalPrice: 19999,
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80",
    hoverImage:
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",
    badge: "Hot",
  },
  {
    id: "pop-5",
    name: "Glow Skin Care Set",
    price: 3499,
    originalPrice: 4999,
    image:
      "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=800&q=80",
    hoverImage:
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80",
    badge: "Popular",
  },
  {
    id: "pop-6",
    name: "Carbon Pro Camera",
    price: 89999,
    originalPrice: 109999,
    image:
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80",
    hoverImage:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80",
    badge: "Pro Pick",
  },
];

export const latestProducts = [
  {
    id: "new-1",
    name: "Orbit Desk Lamp",
    price: 5999,
    originalPrice: null,
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80",
    hoverImage:
      "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?auto=format&fit=crop&w=800&q=80",
    badge: "New",
  },
  {
    id: "new-2",
    name: "Silk Touch Keyboard",
    price: 11499,
    originalPrice: 13999,
    image:
      "https://images.unsplash.com/photo-1511467687856-23d96c93e913?auto=format&fit=crop&w=800&q=80",
    hoverImage:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
    badge: "Just In",
  },
  {
    id: "new-3",
    name: "Pulse Fitness Band",
    price: 3999,
    originalPrice: 5499,
    image:
      "https://images.unsplash.com/photo-1575311373933-040b8e1fd5b6?auto=format&fit=crop&w=800&q=80",
    hoverImage:
      "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?auto=format&fit=crop&w=800&q=80",
    badge: "New",
  },
  {
    id: "new-4",
    name: "Marble Ceramic Mug Set",
    price: 2499,
    originalPrice: null,
    image:
      "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=800&q=80",
    hoverImage:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80",
    badge: "Fresh",
  },
  {
    id: "new-5",
    name: "Aero Running Shoes",
    price: 10999,
    originalPrice: 13999,
    image:
      "https://images.unsplash.com/photo-1606107557195-0a29c9ac7787?auto=format&fit=crop&w=800&q=80",
    hoverImage:
      "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=800&q=80",
    badge: "New",
  },
  {
    id: "new-6",
    name: "Zen Aroma Diffuser",
    price: 4499,
    originalPrice: 5999,
    image:
      "https://images.unsplash.com/photo-1602928321679-5ab447278965?auto=format&fit=crop&w=800&q=80",
    hoverImage:
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80",
    badge: "Just In",
  },
];

export const bestDeals = [
  {
    id: "deal-1",
    name: "Studio Monitor Speakers",
    price: 28999,
    originalPrice: 42999,
    image:
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80",
    hoverImage:
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80",
    badge: "-33%",
  },
  {
    id: "deal-2",
    name: "Luxury Leather Wallet",
    price: 2999,
    originalPrice: 4999,
    image:
      "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80",
    hoverImage:
      "https://images.unsplash.com/photo-1621285480535-3a8a001a3b5a?auto=format&fit=crop&w=800&q=80",
    badge: "-40%",
  },
  {
    id: "deal-3",
    name: "Smart Home Hub",
    price: 17999,
    originalPrice: 24999,
    image:
      "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80",
    hoverImage:
      "https://images.unsplash.com/photo-1558089687-8817039348c35?auto=format&fit=crop&w=800&q=80",
    badge: "-28%",
  },
  {
    id: "deal-4",
    name: "Travel Pro Suitcase",
    price: 12999,
    originalPrice: 18999,
    image:
      "https://images.unsplash.com/photo-1565026056847-096c6971712f?auto=format&fit=crop&w=800&q=80",
    hoverImage:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
    badge: "-31%",
  },
  {
    id: "deal-5",
    name: "Premium Sunglasses",
    price: 5999,
    originalPrice: 8999,
    image:
      "https://images.unsplash.com/photo-1572635196233-14b250f65317?auto=format&fit=crop&w=800&q=80",
    hoverImage:
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80",
    badge: "-33%",
  },
  {
    id: "deal-6",
    name: "Gaming Mouse Elite",
    price: 6999,
    originalPrice: 9999,
    image:
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80",
    hoverImage:
      "https://images.unsplash.com/photo-1615667243544-4de2429b16a9?auto=format&fit=crop&w=800&q=80",
    badge: "-30%",
  },
];

export const categoryHighlights = [
  {
    id: "cat-1",
    name: "Electronics",
    count: "120+ items",
    image:
      "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "cat-2",
    name: "Fashion",
    count: "85+ items",
    image:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "cat-3",
    name: "Home & Living",
    count: "64+ items",
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "cat-4",
    name: "Beauty",
    count: "48+ items",
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "cat-5",
    name: "Sports",
    count: "72+ items",
    image:
      "https://images.unsplash.com/photo-1517649763962-0c62306601b7?auto=format&fit=crop&w=800&q=80",
  },
];
