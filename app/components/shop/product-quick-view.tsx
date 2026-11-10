"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Check, Minus, Plus, ShoppingBag, X, ArrowUpRight } from "lucide-react";
import type { Product } from "@/lib/products";
import { useCartStore } from "@/store/cart-store";
import Product3DPreview from "@/app/components/shop/product-3d-preview";

type Props = {
  product: Product | null;
  onClose: () => void;
};

export default function ProductQuickView({ product, onClose }: Props) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const addItem = useCartStore((state) => state.addItem);

  const inCart = useCartStore((state) =>
    product
      ? (state.items.find((item) => item.product.id === product.id)?.quantity ??
        0)
      : 0,
  );

  useEffect(() => {
    if (!product) return;

    const oldOverflow = document.body.style.overflow;
    const previousFocus =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();

      if (event.key !== "Tab" || !dialogRef.current) return;

      const elements = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );

      const first = elements[0];
      const last = elements[elements.length - 1];

      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = oldOverflow;
      document.removeEventListener("keydown", onKeyDown);
      previousFocus?.focus();
    };
  }, [product, onClose]);

  if (!product) return null;

  const remaining = Math.max(0, product.stock - inCart);
  const inStock = remaining > 0;
  const amount = Math.min(Math.max(1, quantity), Math.max(1, remaining));
  const total = product.price * amount;

  function handleAddToCart() {
    if (!product) return;

    const existingQuantity =
      useCartStore
        .getState()
        .items.find((item) => item.product.id === product.id)?.quantity ?? 0;

    const available = Math.max(0, product.stock - existingQuantity);
    const quantityToAdd = Math.min(amount, available);

    if (quantityToAdd <= 0) return;

    addItem(product, quantityToAdd);
    setAdded(true);
    setQuantity(1);
  }

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center overflow-y-auto bg-[#17120F]/70 p-3 backdrop-blur-sm sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="quick-view-title"
        aria-describedby="quick-view-description"
        className="relative my-auto w-full max-w-235 overflow-hidden rounded-2xl border border-[#E0D5C8] bg-[#FFFCF7] text-[#24211D] shadow-[0_30px_90px_rgba(20,12,6,0.3)] sm:rounded-3xl"
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close product details"
          className="absolute right-4 top-4 z-20 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-[#DDD2C4] bg-[#FFFCF7]/95 transition hover:bg-[#EEE6DB]"
        >
          <X size={20} />
        </button>

        <div className="grid max-h-[min(88dvh,800px)] overflow-y-auto md:grid-cols-2">
          <div className="relative min-h-75 overflow-hidden bg-[#EDE5DC] sm:min-h-105">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,#d8c9bd_0%,transparent_70%)]" />

            <div className="absolute inset-0 flex items-center justify-center [&>div]:!h-full [&>div]:!w-full">
              <Product3DPreview product={product} />
            </div>

            {product.badge && (
              <span className="pointer-events-none absolute left-5 top-5 z-10 rounded-full bg-[#FFFCF7] px-3 py-1.5 text-xs font-semibold text-[#76593E]">
                {product.badge}
              </span>
            )}
          </div>

          <div className="flex flex-col p-6 sm:p-9 md:py-12">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#A1815B]">
              Let&apos;s Type / {product.category}
            </p>

            <h2
              id="quick-view-title"
              className="mt-4 font-serif text-3xl leading-tight sm:text-4xl"
            >
              {product.name}
            </h2>

            <p
              id="quick-view-description"
              className="mt-4 text-base leading-relaxed text-[#766A5E]"
            >
              {product.description}
            </p>

            {product.switchType && (
              <p className="mt-3 text-sm text-[#6F6255]">
                Switch feel:{" "}
                <span className="font-semibold text-[#24211D]">
                  {product.switchType}
                </span>
              </p>
            )}

            <p className="mt-7 text-3xl font-semibold tracking-tight">
              ${product.price.toFixed(2)}{" "}
              <span className="text-sm font-normal text-[#8D8074]">USD</span>
            </p>

            <div className="mt-4 flex items-center gap-2 text-sm">
              <span
                className={`h-2 w-2 rounded-full ${
                  inStock ? "bg-[#698467]" : "bg-[#B86A5B]"
                }`}
              />

              <span className={inStock ? "text-[#547153]" : "text-[#A45D52]"}>
                {inStock
                  ? `${remaining} available`
                  : product.stock === 0
                    ? "Out of stock"
                    : "Maximum quantity in cart"}
              </span>
            </div>

            <div className="mt-8 border-t border-[#E5D9CB] pt-7">
              <p className="mb-3 text-sm font-medium">Quantity</p>

              <div className="inline-flex items-center overflow-hidden rounded-lg border border-[#D9CEC0]">
                <button
                  type="button"
                  onClick={() => {
                    setQuantity((q) => Math.max(1, q - 1));
                    setAdded(false);
                  }}
                  disabled={!inStock || amount <= 1}
                  aria-label="Decrease quantity"
                  className="flex h-11 w-11 cursor-pointer items-center justify-center disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <Minus size={16} />
                </button>

                <span
                  className="w-12 text-center text-sm font-semibold"
                  aria-live="polite"
                >
                  {amount}
                </span>

                <button
                  type="button"
                  onClick={() => {
                    setQuantity((q) => Math.min(remaining, q + 1));
                    setAdded(false);
                  }}
                  disabled={!inStock || amount >= remaining}
                  aria-label="Increase quantity"
                  className="flex h-11 w-11 cursor-pointer items-center justify-center disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <button
              type="button"
              disabled={!inStock}
              onClick={handleAddToCart}
              className="mt-6 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#24211D] px-5 py-4 text-sm font-semibold text-[#FFFCF7] transition hover:bg-[#70563D] disabled:cursor-not-allowed disabled:bg-[#CFC6BC]"
            >
              {added ? <Check size={18} /> : <ShoppingBag size={18} />}

              {inStock
                ? added
                  ? "Added to Cart"
                  : `Add to Cart · $${total.toFixed(2)}`
                : "Out of Stock"}
            </button>

            <Link
              href={`/shop/${product.id}`}
              onClick={onClose}
              className="mt-4 flex items-center justify-center gap-2 text-sm font-medium text-[#8C6C48] transition hover:text-[#24211D]"
            >
              View Full Product Details
              <ArrowUpRight size={16} />
            </Link>

            <p className="mt-4 text-center text-xs text-[#9B8D7D]">
              Designed for your perfect typing experience.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
