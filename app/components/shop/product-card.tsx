"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingBag,
  Keyboard,
  Layers3,
  SlidersHorizontal,
  Box,
  Package,
  Wrench,
  Check,
  ArrowUpRight,
} from "lucide-react";
import dynamic from "next/dynamic";

import type { Product, ProductCategory } from "@/lib/products";
import { useCartStore } from "@/store/cart-store";

type ProductCardProps = {
  product: Product;
  onQuickView?: (product: Product) => void;
  view?: "grid" | "list";
};

const Product3DPreview = dynamic(() => import("./product-3d-preview"), {
  ssr: false,
});

const categoryIcons = {
  Keyboards: Keyboard,
  Keycaps: Layers3,
  Switches: SlidersHorizontal,
  Plates: Box,
  Cases: Package,
  Accessories: Wrench,
} satisfies Record<ProductCategory, typeof Package>;

export default function ProductCard({
  product,
  onQuickView,
  view = "grid",
}: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const inCart =
    useCartStore(
      (state) =>
        state.items.find((item) => item.product.id === product.id)?.quantity,
    ) ?? 0;

  const [imageError, setImageError] = useState(false);
  const [added, setAdded] = useState(false);

  const Icon = categoryIcons[product.category];
  const inStock = product.stock > 0;
  const canAdd = inCart < product.stock;
  const showImage = Boolean(product.image) && !imageError;

  function handleAddToCart() {
    if (!canAdd) return;

    addItem(product, 1);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  }

  return (
    <article
      className={`group relative flex min-w-0 overflow-hidden rounded-2xl border border-[#E4D9CB] bg-[#FBF8F2] transition-all duration-300 hover:border-[#B89B72] hover:shadow-[0_12px_32px_rgba(70,50,30,0.09)] ${
        view === "list" ? "flex-col sm:flex-row" : "flex-col"
      }`}
    >
      {/* Product visual */}
      <div
        className={`relative flex shrink-0 items-center justify-center overflow-hidden bg-[#F0E9DE] ${
          view === "list"
            ? "aspect-[4/3] w-full sm:aspect-auto sm:w-48 lg:w-56"
            : "aspect-[4/3] w-full sm:aspect-square"
        }`}
      >
        <Product3DPreview product={product} />

        {product.badge && (
          <span className="absolute left-3 top-3 rounded-full border border-[#E4D9CB] bg-[#FBF8F2]/95 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#6D5941] sm:left-4 sm:top-4">
            {product.badge}
          </span>
        )}

        {!inStock && (
          <span className="absolute right-3 top-3 rounded-full bg-[#24211D] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-white">
            Sold Out
          </span>
        )}
      </div>

      {/* Product details */}
      <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-5">
        <span className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#A68C6C]">
          {product.category}
        </span>

        <Link
          href={`/shop/${product.id}`}
          className="flex items-start justify-between gap-3"
        >
          <h3 className="min-w-0 text-base font-semibold leading-snug text-[#24211D] transition-colors hover:text-[#8C6C48]">
            {product.name}
          </h3>
          <ArrowUpRight size={17} className="shrink-0 text-[#8C6C48]" />
        </Link>

        <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-[#82776B]">
          {product.description}
        </p>

        <div className="mt-auto pt-5">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
            <span className="text-lg font-semibold tracking-tight text-[#24211D] sm:text-xl">
              ${product.price.toFixed(2)}
            </span>

            <span
              className={`text-[11px] font-medium ${
                inStock ? "text-[#72816A]" : "text-[#A75F53]"
              }`}
            >
              {inStock ? "In Stock" : "Out of Stock"}
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!canAdd}
              className="flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#24211D] px-4 py-3 text-xs font-semibold text-[#F5EFE6] transition-colors hover:bg-[#8C6C48] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {added ? (
                <>
                  <Check size={16} />
                  Added to Cart
                </>
              ) : (
                <>
                  <ShoppingBag size={16} strokeWidth={1.8} />
                  {!inStock
                    ? "Sold Out"
                    : !canAdd
                      ? "Maximum in Cart"
                      : "Add to Cart"}
                </>
              )}
            </button>

            {onQuickView && (
              <button
                type="button"
                onClick={() => onQuickView(product)}
                className="min-h-9 cursor-pointer text-xs font-medium text-[#8C6C48] transition hover:text-[#24211D]"
              >
                Quick View
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
