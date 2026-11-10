
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Keyboard, Layers3, Sparkles } from "lucide-react";

const collections = [
  {
    number: "01",
    name: "Midnight",
    tagline: "Designed for the bold.",
    description:
      "Dark finishes, clean silhouettes, and understated details. A collection built for focused workspaces.",
    background: "#17191D",
    foreground: "#F5EFE6",
    accent: "#1558C9",
    label: "THE DARK EDITION",
  },
  {
    number: "02",
    name: "Ivory",
    tagline: "Simplicity, refined.",
    description:
      "Warm neutrals, thoughtful materials, and timeless design. A softer approach to the everyday setup.",
    background: "#E9DFD1",
    foreground: "#33271F",
    accent: "#B89B72",
    label: "THE CLASSIC EDITION",
  },
  {
    number: "03",
    name: "Forest",
    tagline: "Inspired by nature.",
    description:
      "Deep greens, muted tones, and organic textures. Bring a sense of calm to your desk.",
    background: "#10251D",
    foreground: "#F5EFE6",
    accent: "#9DB6A0",
    label: "THE NATURAL EDITION",
  },
];

export default function CollectionsPage() {
  return (
    <main className="min-h-screen bg-[#F5EFE6] text-[#24211D]">
      <div className="mx-auto max-w-7xl px-5 pb-24 pt-16 sm:px-8 lg:px-12 lg:pt-20">
        <header className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#8C6C48]">
            Curated Collections
          </p>
          <h1 className="mt-5 font-serif text-5xl tracking-tight sm:text-6xl">
            Find your aesthetic.
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-7 text-[#817568] sm:text-base">
            Three distinct design directions. One shared philosophy:
            your keyboard should feel as personal as your workspace.
          </p>
        </header>

        <div className="mt-14 space-y-6">
          {collections.map((collection) => (
            <article
              key={collection.name}
              className="relative flex min-h-[310px] flex-col justify-between overflow-hidden rounded-2xl p-7 sm:min-h-[350px] sm:p-10 lg:flex-row lg:items-end lg:p-12"
              style={{
                backgroundColor: collection.background,
                color: collection.foreground,
              }}
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-16 -top-24 h-80 w-80 rounded-full border opacity-20 sm:h-[460px] sm:w-[460px]"
                style={{ borderColor: collection.accent }}
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute right-8 top-8 h-40 w-40 rotate-[-18deg] rounded-[30px] border opacity-30 sm:right-24 sm:top-16 sm:h-56 sm:w-56"
                style={{ borderColor: collection.accent }}
              />

              <div className="relative z-10 max-w-lg">
                <p
                  className="text-xs font-semibold uppercase tracking-[0.25em]"
                  style={{ color: collection.accent }}
                >
                  {collection.number} / {collection.label}
                </p>

                <h2 className="mt-6 font-serif text-5xl sm:text-6xl">
                  {collection.name}.
                </h2>
                <p className="mt-3 text-lg font-medium">
                  {collection.tagline}
                </p>
                <p className="mt-4 max-w-md text-sm leading-7 opacity-75">
                  {collection.description}
                </p>
              </div>

              <Link
                href="/shop"
                className="relative z-10 mt-10 inline-flex w-fit items-center gap-3 rounded-full border border-current px-6 py-3 text-sm font-medium transition hover:opacity-60"
              >
                Explore the Shop
                <ArrowUpRight size={17} />
              </Link>
            </article>
          ))}
        </div>

        <section className="mt-20 border-t border-[#D9CEC0] pt-12">
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: Keyboard,
                title: "Built for You",
                text: "Find a keyboard that complements how you work, play, and create.",
              },
              {
                icon: Layers3,
                title: "Thoughtful Design",
                text: "Explore distinct finishes, materials, and mechanical components.",
              },
              {
                icon: Sparkles,
                title: "Make It Yours",
                text: "Experiment with your own combination in our keyboard builder.",
              },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title}>
                <Icon
                  size={25}
                  strokeWidth={1.5}
                  className="text-[#8C6C48]"
                />
                <h3 className="mt-5 font-serif text-2xl">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#817568]">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-5 rounded-2xl bg-[#EAE0D3] px-7 py-8 sm:px-10">
          <div>
            <h2 className="font-serif text-3xl">
              Something more personal?
            </h2>
            <p className="mt-2 text-sm text-[#817568]">
              Explore our interactive keyboard configurator.
            </p>
          </div>
          <Link
            href="/build"
            className="inline-flex items-center gap-3 rounded-lg bg-[#24211D] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#8C6C48]"
          >
            Build Yours
            <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    </main>
  );
}
