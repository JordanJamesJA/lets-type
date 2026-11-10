"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  Package,
  Keyboard,
  Layers3,
  SlidersHorizontal,
  Box,
  Wrench,
  ShieldCheck,
} from "lucide-react";

import { products, type ProductCategory } from "@/lib/products";
import { useCartStore } from "@/store/cart-store";

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

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  const hydrated = useSyncExternalStore(
    (onStoreChange) => {
      const unsubscribeHydrate = useCartStore.persist.onHydrate(onStoreChange);
      const unsubscribeFinish =
        useCartStore.persist.onFinishHydration(onStoreChange);

      return () => {
        unsubscribeHydrate();
        unsubscribeFinish();
      };
    },
    () => useCartStore.persist.hasHydrated(),
    () => false,
  );

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  if (!hydrated) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#F5EFE6] text-[#75695D]">
        <p className="text-sm tracking-wide">Loading your cart...</p>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100dvh-88px)] bg-[#F5EFE6] text-[#24211D]">
      <div className="mx-auto max-w-360 px-5 py-6 sm:px-8 lg:px-12 lg:py-8">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#776B5D] transition hover:text-[#24211D]"
        >
          <ArrowLeft size={16} />
          Continue Shopping
        </Link>

        <div className="mt-6">
          {items.length === 0 ? (
            <div className="flex min-h-95 flex-col items-center justify-center rounded-3xl border border-[#E3D8CA] bg-[#FBF8F2] px-6 py-16 text-center">
              <div className="mb-7 flex h-24 w-24 items-center justify-center rounded-full bg-[#EEE5D8] text-[#A68C6C]">
                <ShoppingBag size={40} strokeWidth={1.2} />
              </div>

              <h2 className="font-serif text-3xl">Your cart is empty</h2>

              <p className="mt-4 max-w-sm text-sm leading-7 text-[#817568]">
                Your perfect typing experience starts here. Explore our
                keyboards, switches, and accessories to find something you love.
              </p>

              <Link
                href="/shop"
                className="mt-8 inline-flex items-center gap-3 rounded-xl bg-[#24211D] px-7 py-4 text-sm font-semibold text-[#F5EFE6] transition hover:bg-[#8C6C48]"
              >
                Explore the Shop
                <ArrowRight size={17} />
              </Link>
            </div>
          ) : (
            <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_360px] xl:gap-12">
              <section
                aria-label="Cart items"
                className="overflow-hidden rounded-2xl border border-[#E3D8CA] bg-[#FBF8F2]"
              >
                <div className="flex items-center justify-between border-b border-[#E3D8CA] px-5 py-5 sm:px-7">
                  <h2 className="text-sm font-semibold">Your Items</h2>

                  <span className="text-xs text-[#817568]">
                    {items.length} {items.length === 1 ? "product" : "products"}
                  </span>
                </div>

                <div className="divide-y divide-[#E3D8CA]">
                  {items.map((item) => {
                    const product =
                      products.find((entry) => entry.id === item.product.id) ??
                      item.product;

                    const stock = product.stock;
                    const category = product.category;
                    const Icon = categoryIcons[category];
                    const canIncrease = item.quantity < stock;

                    return (
                      <article
                        key={item.product.id}
                        className="flex gap-4 p-5 sm:gap-6 sm:p-7"
                      >
                        <div className="flex h-28 w-24 shrink-0 flex-col items-center justify-center gap-2 rounded-xl bg-[#EEE5D8] text-[#A68C6C] sm:h-36 sm:w-36">
                          <Icon size={42} strokeWidth={1.1} />
                          <span className="text-[9px] font-semibold uppercase tracking-widest">
                            {category}
                          </span>
                        </div>

                        <div className="flex min-w-0 flex-1 flex-col">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#A68C6C]">
                                {category}
                              </p>

                              <h3 className="mt-2 text-base font-semibold sm:text-lg">
                                {item.product.name}
                              </h3>

                              <p className="mt-1 text-xs text-[#817568]">
                                {formatPrice(product?.price ?? 0)} each
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={() => removeItem(item.product.id)}
                              aria-label={`Remove ${item.product.name}`}
                              className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-[#9A8B7B] transition hover:bg-[#F0E7DC] hover:text-[#A84D43]"
                            >
                              <Trash2 size={17} />
                            </button>
                          </div>

                          <div className="mt-auto flex flex-wrap items-end justify-between gap-4 pt-5">
                            <div>
                              <p className="mb-2 text-[11px] text-[#817568]">
                                Quantity
                              </p>

                              <div className="inline-flex items-center overflow-hidden rounded-lg border border-[#D9CEC0]">
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateQuantity(
                                      item.product.id,
                                      item.quantity - 1,
                                    )
                                  }
                                  disabled={item.quantity <= 1}
                                  aria-label={`Decrease ${item.product.name} quantity`}
                                  className="flex h-9 w-9 cursor-pointer items-center justify-center transition hover:bg-[#EEE5D8] disabled:cursor-not-allowed disabled:opacity-30"
                                >
                                  <Minus size={14} />
                                </button>

                                <span className="w-9 text-center text-sm font-semibold">
                                  {item.quantity}
                                </span>

                                <button
                                  type="button"
                                  onClick={() =>
                                    updateQuantity(
                                      item.product.id,
                                      item.quantity + 1,
                                    )
                                  }
                                  disabled={!canIncrease}
                                  aria-label={`Increase ${item.product.name} quantity`}
                                  className="flex h-9 w-9 cursor-pointer items-center justify-center transition hover:bg-[#EEE5D8] disabled:cursor-not-allowed disabled:opacity-30"
                                >
                                  <Plus size={14} />
                                </button>
                              </div>

                              {!canIncrease && (
                                <p className="mt-2 text-[10px] text-[#A68C6C]">
                                  Maximum available quantity
                                </p>
                              )}
                            </div>

                            <p className="text-lg font-semibold">
                              {formatPrice(
                                (product?.price ?? 0) * item.quantity,
                              )}
                            </p>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>

              <aside className="rounded-2xl border border-[#E3D8CA] bg-[#FBF8F2] p-6 sm:p-7 lg:sticky lg:top-28">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#A68C6C]">
                  Your Order
                </p>

                <h2 className="font-serif text-2xl">Order Summary</h2>

                <div className="mt-8 space-y-5 border-b border-[#E3D8CA] pb-7">
                  <div className="flex justify-between gap-4 text-sm">
                    <span className="text-[#817568]">
                      Subtotal ({itemCount} items)
                    </span>
                    <span className="font-medium">{formatPrice(subtotal)}</span>
                  </div>

                  <div className="flex justify-between gap-4 text-sm">
                    <span className="text-[#817568]">Shipping</span>
                    <span className="text-right text-xs text-[#817568]">
                      Calculated at checkout
                    </span>
                  </div>

                  <div className="flex justify-between gap-4 text-sm">
                    <span className="text-[#817568]">Taxes</span>
                    <span className="text-right text-xs text-[#817568]">
                      Calculated at checkout
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 py-7">
                  <div>
                    <p className="text-base font-semibold">Subtotal</p>
                    <p className="mt-1 text-[11px] text-[#817568]">
                      Before shipping and taxes
                    </p>
                  </div>

                  <p className="text-2xl font-semibold">
                    {formatPrice(subtotal)}
                  </p>
                </div>

                <button
                  type="button"
                  disabled
                  title="Checkout will be available after Stripe integration"
                  className="flex w-full cursor-not-allowed items-center justify-center gap-3 rounded-xl bg-[#24211D] px-5 py-4 text-sm font-semibold text-[#F5EFE6] opacity-55"
                >
                  Proceed to Checkout
                  <ArrowRight size={17} />
                </button>

                <p className="mt-3 text-center text-[11px] text-[#817568]">
                  Secure checkout coming next
                </p>

                <div className="mt-7 flex items-start gap-3 border-t border-[#E3D8CA] pt-6">
                  <ShieldCheck size={19} className="shrink-0 text-[#8C795E]" />

                  <p className="text-xs leading-5 text-[#817568]">
                    Your cart is saved on this device. Payment processing will
                    be enabled when checkout is connected.
                  </p>
                </div>

                <Link
                  href="/shop"
                  className="mt-6 flex items-center justify-center gap-2 text-xs font-semibold text-[#76593E] transition hover:text-[#24211D]"
                >
                  <ArrowLeft size={14} />
                  Continue Shopping
                </Link>
              </aside>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
