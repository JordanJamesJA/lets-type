
"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  UserRound,
  ShoppingBag,
  Menu,
  X,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { useTheme } from "./theme-provider";
import { useCartStore } from "@/store/cart-store";

const navigation = [
  { label: "Shop", href: "/shop" },
  { label: "Build", href: "/build" },
  { label: "Collections", href: "/collections" },
  { label: "About", href: "/about" },
  { label: "Support", href: "/support" },
];

const subscribeToHydration = (onChange: () => void) => {
  const unsubscribeStart = useCartStore.persist.onHydrate(onChange);
  const unsubscribeFinish =
    useCartStore.persist.onFinishHydration(onChange);

  return () => {
    unsubscribeStart();
    unsubscribeFinish();
  };
};

const getHydrationSnapshot = () =>
  useCartStore.persist.hasHydrated();

const getServerHydrationSnapshot = () => false;

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();
  const { theme, isLight } = useTheme();

  const [menuOpen, setMenuOpen] = useState(false);

  const isHome = pathname === "/";
  const lightNavbar = !isHome || isLight;

  const textColor = lightNavbar ? "#24211D" : "#FFFFFF";
  const borderColor = lightNavbar
    ? "rgba(36, 33, 29, 0.15)"
    : "rgba(255, 255, 255, 0.2)";

  const itemCount = useCartStore((state) =>
    state.items.reduce(
      (total, item) => total + item.quantity,
      0
    )
  );

  const hydrated = useSyncExternalStore(
    subscribeToHydration,
    getHydrationSnapshot,
    getServerHydrationSnapshot
  );

  const actionClass =
    "relative flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border transition-colors hover:opacity-60 sm:h-10 sm:w-10";

  return (
    <nav
      className="relative z-50 w-full px-4 py-5 transition-colors duration-700 sm:px-6 sm:py-6"
      style={{
        backgroundColor: isHome ? theme.bg : "#F5EFE6",
        color: textColor,
      }}
    >
      <div className="flex w-full items-center justify-between gap-3">
        {/* Logo */}
        <Link
          href="/"
          onClick={() => setMenuOpen(false)}
          className="shrink-0 whitespace-nowrap text-xl font-bold tracking-tight sm:text-2xl"
        >
          Let&apos;s Type.
        </Link>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-5 lg:flex xl:gap-8">
          {navigation.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="text-sm transition-opacity hover:opacity-60 xl:text-base"
              style={{
                color:
                  pathname === href
                    ? theme.accent
                    : textColor,
              }}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3 xl:gap-4">
          {/* Search — desktop only until search is implemented */}
          <button
            type="button"
            aria-label="Search"
            disabled
            title="Search coming soon"
            className={`${actionClass} hidden opacity-50 sm:flex`}
            style={{ borderColor }}
          >
            <Search size={18} />
          </button>

          {/* Account */}
          <Link
            href={isPending ? "#" : session ? "/account" : "/login"}
            aria-label={session ? "My account" : "Sign in"}
            aria-disabled={isPending}
            onClick={(event) => {
              if (isPending) event.preventDefault();
              else setMenuOpen(false);
            }}
            className={actionClass}
            style={{ borderColor }}
          >
            <UserRound size={18} />
          </Link>

          {/* Cart */}
          <Link
            href="/cart"
            aria-label={`Shopping cart, ${
              hydrated ? itemCount : 0
            } items`}
            onClick={() => setMenuOpen(false)}
            className={actionClass}
            style={{ borderColor }}
          >
            <ShoppingBag size={18} />

            {hydrated && itemCount > 0 && (
              <span
                className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#B89B72] px-1 text-[10px] font-bold text-[#24211D] shadow-sm"
                aria-hidden="true"
              >
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </Link>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            className={actionClass + " lg:hidden"}
            style={{ borderColor }}
          >
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>

      {/* Mobile navigation */}
      {menuOpen && (
        <div
          id="mobile-navigation"
          className="absolute left-0 right-0 top-full border-t px-5 py-5 shadow-xl lg:hidden"
          style={{
            backgroundColor: isHome ? theme.bg : "#F5EFE6",
            borderColor,
            color: textColor,
          }}
        >
          <div className="flex flex-col gap-1">
            {navigation.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-4 py-3 text-base font-medium transition hover:opacity-60"
                style={{
                  color:
                    pathname === href
                      ? theme.accent
                      : textColor,
                }}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
