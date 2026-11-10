"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Layers3,
  Sparkles,
  SlidersHorizontal,
} from "lucide-react";
import { useTheme } from "@/app/components/theme-provider";
import Keyboard3D from "./components/keyboard-3d";

const features = [
  { icon: Layers3, label: "Hot-Swappable Switches" },
  { icon: Sparkles, label: "Premium Materials" },
  { icon: SlidersHorizontal, label: "Fully Customizable" },
];

export default function Home() {
  const { active, theme, isLight, nextTheme, previousTheme } = useTheme();

  return (
    <main
      className="flex min-h-[calc(100dvh-88px)] flex-col overflow-x-hidden transition-colors duration-700"
      style={{
        backgroundColor: theme.bg,
        color: isLight ? "#211d1a" : "#FFFFFF",
      }}
    >
      <section className="relative flex w-full flex-1 flex-col items-center gap-8 px-5 pb-12 pt-12 sm:px-8 sm:pt-16 lg:min-h-[700px] lg:flex-row lg:gap-8 lg:px-12 lg:py-16 xl:px-16">
        {/* Background decorations */}
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden"
          aria-hidden="true"
        >
          <div
            className="absolute -right-32 -top-32 h-100 w-100 rounded-full opacity-30 blur-[120px] transition-colors duration-700 sm:h-150 sm:w-150"
            style={{ backgroundColor: theme.accent }}
          />

          <div
            className="absolute -bottom-48 left-1/4 h-100 w-125 rotate-[-25deg] rounded-[50%] opacity-15 blur-[100px] transition-colors duration-700 sm:h-125 sm:w-175"
            style={{ backgroundColor: theme.accent }}
          />

          <div
            className="absolute right-[10%] top-[15%] hidden h-[70%] w-[35%] rotate-45 rounded-[50%] border transition-colors duration-700 lg:block"
            style={{ borderColor: `${theme.accent}25` }}
          />
        </div>

        <div
          className="pointer-events-none absolute right-0 top-1/2 hidden h-175 w-175 -translate-y-1/2 rounded-full opacity-60 blur-[120px] lg:block"
          style={{ backgroundColor: theme.glow }}
        />

        {/* Hero content */}
        <div className="relative z-10 flex w-full min-w-0 flex-col items-start lg:w-[43%] lg:shrink-0">
          <h1 className="text-[clamp(2.6rem,8vw,4rem)] font-bold leading-[1.1] tracking-tight lg:text-[clamp(3.3rem,5vw,5rem)]">
            Build Your
            <br />
            Perfect <span style={{ color: theme.accent }}>Keyboard.</span>
          </h1>

          <p className="mt-6 max-w-120 text-base leading-relaxed opacity-80 sm:text-lg lg:mt-8 lg:text-xl xl:text-2xl">
            Premium, fully customizable keyboards for builders, creators, and
            enthusiasts.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex w-full max-w-md flex-col gap-3 sm:flex-row sm:gap-5 lg:mt-10">
            <Link
              href="/shop"
              className="flex min-h-13 flex-1 items-center justify-center gap-2 rounded-md px-5 py-3 text-base font-semibold text-white transition hover:brightness-110 lg:text-lg"
              style={{ backgroundColor: theme.accent }}
            >
              Shop Now
              <ArrowUpRight size={19} />
            </Link>

            <Link
              href="/build"
              className="flex min-h-13 flex-1 items-center justify-center rounded-md border border-current/30 px-5 py-3 text-base font-semibold transition hover:opacity-70 lg:text-lg"
            >
              Build Yours
            </Link>
          </div>

          {/* Features */}
          <div className="mt-10 grid w-full grid-cols-3 gap-3 border-t border-current/15 pt-6 sm:gap-6 lg:mt-16 lg:pt-8">
            {features.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex min-w-0 flex-col items-start gap-3"
              >
                <Icon
                  size={24}
                  strokeWidth={1.5}
                  style={{ color: theme.accent }}
                />

                <span className="text-[11px] font-medium leading-relaxed opacity-80 sm:text-sm">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 3D Keyboard */}
        <div className="relative z-10 flex w-full min-w-0 flex-col items-center justify-center lg:flex-1">
          <div
            className="pointer-events-none absolute h-[60%] w-[80%] rounded-full blur-[90px]"
            style={{ backgroundColor: theme.glow }}
          />

          <div className="relative w-full min-w-0 [&>div]:!h-[350px] sm:[&>div]:!h-[450px] lg:[&>div]:!h-[560px]">
            <Keyboard3D accent={theme.accent} />
          </div>

          {/* Theme controls */}
          <div className="relative z-20 mt-2 flex w-full items-center justify-end gap-4 sm:gap-5 lg:mt-0">
            <button
              type="button"
              onClick={previousTheme}
              aria-label="Previous theme"
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-current/20 transition hover:opacity-60 sm:h-11 sm:w-11"
            >
              <ArrowLeft size={18} />
            </button>

            <span className="text-xs tracking-widest opacity-60 sm:text-sm">
              {String(active + 1).padStart(2, "0")} / 03
            </span>

            <button
              type="button"
              onClick={nextTheme}
              aria-label="Next theme"
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-current/20 transition hover:opacity-60 sm:h-11 sm:w-11"
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
