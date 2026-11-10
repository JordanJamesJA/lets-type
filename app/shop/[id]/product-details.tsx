"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  Keyboard,
  Layers3,
  SlidersHorizontal,
  Box,
  Package,
  Wrench,
  Check,
} from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import type { Product, ProductCategory } from "@/lib/products";
import Product3DPreview from "@/app/components/shop/product-3d-preview";

const categoryIcons = {
  Keyboards: Keyboard,
  Keycaps: Layers3,
  Switches: SlidersHorizontal,
  Plates: Box,
  Cases: Package,
  Accessories: Wrench,
} satisfies Record<ProductCategory, typeof Package>;

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);

export default function ProductDetails({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const addItem = useCartStore((state) => state.addItem);
  const Icon = categoryIcons[product.category];

  function handleAddToCart() {
    const existingQuantity =
      useCartStore
        .getState()
        .items.find((item) => item.product.id === product.id)?.quantity ?? 0;

    const available = Math.max(0, product.stock - existingQuantity);
    const amount = Math.min(quantity, available);

    if (amount <= 0) return;

    addItem(product, amount);
    setAdded(true);
    setQuantity(1);
    window.setTimeout(() => setAdded(false), 2000);
  }

  const inCart =
    useCartStore(
      (state) =>
        state.items.find((item) => item.product.id === product.id)?.quantity,
    ) ?? 0;

  const remaining = Math.max(0, product.stock - inCart);

  return (
    <main className="min-h-[calc(100dvh-88px)] bg-[#F5EFE6] text-[#24211D]">
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-12 lg:py-16">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-sm text-[#817568] transition hover:text-[#24211D]"
        >
          <ArrowLeft size={17} />
          Back to Shop
        </Link>

        <div className="mt-9 grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Product visual */}
          <div className="relative h-[340px] w-full overflow-hidden rounded-2xl border border-[#E3D8CA] bg-[#EEE5D8] sm:h-[500px]">
            <div className="absolute inset-0 h-full w-full">
              <Product3DPreview product={product} />
            </div>

            {product.badge && (
              <span className="pointer-events-none absolute left-6 top-6 z-10 rounded-full bg-[#FBF8F2] px-4 py-2 text-xs font-semibold text-[#8C6C48]">
                {product.badge}
              </span>
            )}
          </div>

          {/* Product information */}
          <div className="flex flex-col justify-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#8C6C48]">
              {product.category}
            </p>

            <h1 className="mt-5 font-serif text-4xl tracking-tight sm:text-5xl">
              {product.name}
            </h1>

            <p className="mt-5 text-3xl font-semibold">
              {formatPrice(product.price)}
            </p>

            <div className="my-8 h-px bg-[#D9CEC0]" />

            <h2 className="text-sm font-semibold">Product Details</h2>

            <p className="mt-4 text-sm leading-7 text-[#817568]">
              {product.description}.
            </p>

            {product.switchType && (
              <p className="mt-3 text-sm text-[#817568]">
                Switch Type: {product.switchType}
              </p>
            )}

            <div className="mt-7 flex items-center gap-2 text-sm">
              <span
                className={`h-2 w-2 rounded-full ${
                  remaining > 0 ? "bg-green-600" : "bg-red-500"
                }`}
              />
              {remaining > 0
                ? `${remaining} available`
                : "Maximum quantity in cart"}
            </div>

            <div className="mt-8">
              <p className="mb-3 text-sm font-semibold">Quantity</p>

              <div className="inline-flex items-center overflow-hidden rounded-lg border border-[#D9CEC0]">
                <button
                  type="button"
                  onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                  className="flex h-11 w-11 cursor-pointer items-center justify-center hover:bg-[#EDE2D4] disabled:opacity-30"
                >
                  <Minus size={16} />
                </button>

                <span className="w-12 text-center text-sm font-semibold">
                  {Math.min(quantity, Math.max(1, remaining))}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setQuantity((value) =>
                      Math.min(Math.max(1, remaining), value + 1),
                    )
                  }
                  disabled={quantity >= remaining}
                  aria-label="Increase quantity"
                  className="flex h-11 w-11 cursor-pointer items-center justify-center hover:bg-[#EDE2D4] disabled:opacity-30"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={remaining === 0}
              className="mt-8 flex h-14 w-full cursor-pointer items-center justify-center gap-3 rounded-xl bg-[#24211D] text-sm font-semibold text-[#F5EFE6] transition hover:bg-[#8C6C48] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {added ? (
                <>
                  <Check size={19} />
                  Added to Cart
                </>
              ) : (
                <>
                  <ShoppingBag size={19} />
                  Add to Cart
                  <ArrowRight size={17} />
                </>
              )}
            </button>

            <Link
              href="/cart"
              className="mt-4 text-center text-sm font-medium text-[#8C6C48] hover:underline"
            >
              View Shopping Cart
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
