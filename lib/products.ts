export type ProductCategory =
  | "Keyboards"
  | "Keycaps"
  | "Switches"
  | "Plates"
  | "Cases"
  | "Accessories";

export type Product = {
  id: string;
  name: string;
  category: ProductCategory;
  description: string;
  price: number;
  image: string;
  stock: number;
  badge?: string;
  switchType?: "Linear" | "Tactile" | "Clicky";
};

export const products: Product[] = [
  {
    id: "lt65-custom-kit",
    name: "LT65 Custom Kit",
    category: "Keyboards",
    description: "65% hot-swappable keyboard kit",
    price: 129.99,
    image: "/products/lt65.png",
    stock: 18,
    badge: "New",
  },
  {
    id: "lavender-linear",
    name: "Lavender Linear Switches",
    category: "Switches",
    description: "Smooth, quiet, and consistent",
    price: 0.45,
    image: "/products/lavender-switches.png",
    stock: 250,
    badge: "Bestseller",
    switchType: "Linear",
  },
  {
    id: "haze-keycaps",
    name: "Haze Keycap Set",
    category: "Keycaps",
    description: "PBT dye-sub, cherry profile",
    price: 59.99,
    image: "/products/haze-keycaps.png",
    stock: 36,
  },
  {
    id: "aluminum-plate",
    name: "Aluminum Plate",
    category: "Plates",
    description: "Universal 65% plate",
    price: 24.99,
    image: "/products/aluminum-plate.png",
    stock: 12,
  },
  {
    id: "forest-case",
    name: "Forest Case",
    category: "Cases",
    description: "CNC aluminum, 65%",
    price: 89.99,
    image: "/products/forest-case.png",
    stock: 14,
  },
  {
    id: "evergreen-tactile",
    name: "Evergreen Tactile Switches",
    category: "Switches",
    description: "Crisp bump, balanced feel",
    price: 0.5,
    image: "/products/evergreen-switches.png",
    stock: 180,
    switchType: "Tactile",
  },
  {
    id: "moss-keycaps",
    name: "Moss Keycap Set",
    category: "Keycaps",
    description: "PBT dye-sub, cherry profile",
    price: 59.99,
    image: "/products/moss-keycaps.png",
    stock: 28,
  },
  {
    id: "lt75-premium-kit",
    name: "LT75 Premium Kit",
    category: "Keyboards",
    description: "75% hot-swappable keyboard kit",
    price: 149.99,
    image: "/products/lt75.png",
    stock: 8,
    badge: "Limited",
  },
];