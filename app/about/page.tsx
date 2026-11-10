import Link from "next/link";
import {
  ArrowRight,
  Keyboard,
  SlidersHorizontal,
  Heart,
  Layers3,
} from "lucide-react";

const values = [
  {
    icon: Keyboard,
    title: "Built Around You",
    description:
      "Your keyboard is part of your everyday experience. It should reflect your needs, preferences, and personality.",
  },
  {
    icon: SlidersHorizontal,
    title: "Freedom to Customize",
    description:
      "From layout and switches to color and feel, we believe personal choice makes the difference.",
  },
  {
    icon: Heart,
    title: "Passion for Detail",
    description:
      "We celebrate thoughtful design, comfortable typing, and the small details that elevate a workspace.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#F5EFE6] text-[#24211D]">
      <section className="mx-auto max-w-7xl px-5 pb-20 pt-20 sm:px-8 lg:px-12 lg:pb-28 lg:pt-28">
        <div className="max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#8C6C48]">
            About Let&apos;s Type
          </p>

          <h1 className="mt-7 font-serif text-5xl leading-[1.1] tracking-tight sm:text-6xl lg:text-7xl">
            Your keyboard.
            <span className="block text-[#8C6C48]">Your experience.</span>
          </h1>

          <p className="mt-8 max-w-2xl text-base leading-8 text-[#817568] sm:text-lg">
            We believe a keyboard should be more than another piece of
            technology. It should be an extension of how you think, work, play,
            and create.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              href="/shop"
              className="inline-flex items-center gap-3 rounded-lg bg-[#24211D] px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-[#8C6C48]"
            >
              Explore the Shop
              <ArrowRight size={17} />
            </Link>

            <Link
              href="/build"
              className="inline-flex items-center gap-3 rounded-lg border border-[#CDB89F] px-7 py-3.5 text-sm font-semibold transition hover:bg-[#EAE0D3]"
            >
              Build Yours
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-[#EAE0D3] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:gap-24">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#8C6C48]">
              Our Philosophy
            </p>
            <h2 className="mt-6 font-serif text-4xl leading-tight sm:text-5xl">
              The details make
              <span className="block">the difference.</span>
            </h2>
          </div>

          <div className="space-y-6 text-sm leading-8 text-[#6F6256] sm:text-base">
            <p>
              Every keystroke is an interaction. The sound, the feel, the
              layout, and the materials all contribute to an experience that&apos;s
              uniquely yours.
            </p>
            <p>
              Let&apos;s Type is a concept built around that idea: bringing
              mechanical keyboard discovery and customization together in one
              thoughtful experience.
            </p>
            <p>
              Whether you prefer a minimalist desk or a bold, expressive setup,
              the goal is simple — to help you discover what feels right.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="mb-12">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#8C6C48]">
            What Matters to Us
          </p>
          <h2 className="mt-5 font-serif text-4xl sm:text-5xl">
            Designed with intention.
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {values.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-2xl border border-[#D9CEC0] p-7 sm:p-9"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EAE0D3] text-[#8C6C48]">
                <Icon size={24} strokeWidth={1.5} />
              </div>

              <h3 className="mt-7 font-serif text-2xl">{title}</h3>
              <p className="mt-4 text-sm leading-7 text-[#817568]">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-[#D9CEC0] px-5 py-20 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div>
            <Layers3
              size={27}
              strokeWidth={1.5}
              className="mb-5 text-[#8C6C48]"
            />
            <h2 className="font-serif text-4xl sm:text-5xl">
              Find your perfect fit.
            </h2>
            <p className="mt-4 text-sm text-[#817568]">
              Discover the possibilities, one keystroke at a time.
            </p>
          </div>

          <Link
            href="/shop"
            className="inline-flex items-center gap-3 rounded-lg bg-[#24211D] px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-[#8C6C48]"
          >
            Discover Keyboards
            <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </main>
  );
}
