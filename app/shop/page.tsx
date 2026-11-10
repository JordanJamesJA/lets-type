"use client";

import { useMemo, useState } from "react";
import { Grid2X2, List, RotateCcw, SlidersHorizontal, X } from "lucide-react";
import { products, type Product } from "@/lib/products";
import ProductQuickView from "@/app/components/shop/product-quick-view";
import ProductCard from "@/app/components/shop/product-card";
import ProductFilters, {
  categories,
  type CategoryFilter,
  type SwitchFilter,
  type AvailabilityFilter,
} from "@/app/components/shop/product-filters";

type SortOption = "newest" | "price-low" | "price-high" | "name";
type ViewOption = "grid" | "list";

export default function ShopPage() {
  const [category, setCategory] = useState<CategoryFilter>("All Products");
  const [switchTypes, setSwitchTypes] = useState<SwitchFilter[]>([]);
  const [availability, setAvailability] = useState<AvailabilityFilter[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [view, setView] = useState<ViewOption>("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filteredProducts = useMemo(() => {
    const result = products.filter((product) => {
      if (category !== "All Products" && product.category !== category)
        return false;

      if (
        switchTypes.length > 0 &&
        (product.category !== "Switches" ||
          !product.switchType ||
          !switchTypes.includes(product.switchType))
      )
        return false;

      if (availability.length === 1) {
        const inStock = product.stock > 0;
        if (availability[0] === "in-stock" && !inStock) return false;
        if (availability[0] === "out-of-stock" && inStock) return false;
      }

      return true;
    });

    switch (sortBy) {
      case "price-low":
        return result.sort((a, b) => a.price - b.price);
      case "price-high":
        return result.sort((a, b) => b.price - a.price);
      case "name":
        return result.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return result;
    }
  }, [category, switchTypes, availability, sortBy]);

  const activeFilterCount =
    switchTypes.length +
    availability.length +
    (category === "All Products" ? 0 : 1);

  const resetFilters = () => {
    setCategory("All Products");
    setSwitchTypes([]);
    setAvailability([]);
  };

  return (
    <main className="min-h-screen bg-[#F5EFE6] text-[#24211D]">
      <div className="mx-auto w-full max-w-[1600px] px-5 pb-20 pt-6 sm:px-8 lg:px-12 lg:pt-8">
        <div className="grid gap-7 lg:grid-cols-[220px_minmax(0,1fr)] xl:gap-10">
          <aside className="hidden lg:block">
            <div className="sticky top-6 rounded-2xl border border-[#DDD3C5] bg-[#FBF8F2] p-5 shadow-[0_8px_24px_rgba(49,36,22,0.03)]">
              <div className="mb-6 flex items-center justify-between border-b border-[#E6DCCF] pb-4">
                <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em]">
                  <SlidersHorizontal size={15} /> Filters
                </span>

                {activeFilterCount > 0 && (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="flex cursor-pointer items-center gap-1 text-xs text-[#947854] hover:text-[#24211D]"
                  >
                    <RotateCcw size={12} /> Reset
                  </button>
                )}
              </div>

              <ProductFilters
                products={products}
                category={category}
                onCategoryChange={setCategory}
                switchTypes={switchTypes}
                onSwitchTypesChange={setSwitchTypes}
                availability={availability}
                onAvailabilityChange={setAvailability}
              />
            </div>
          </aside>

          <section className="min-w-0" aria-label="Shop products">
            <div className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-4 border-b border-[#24211D]/10 pb-5">
              <div className="flex w-full min-w-0 items-center gap-2 overflow-x-auto pb-2 sm:flex-1 sm:flex-wrap sm:overflow-visible sm:pb-0">
                {categories.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setCategory(item)}
                    aria-pressed={category === item}
                    className={`cursor-pointer whitespace-nowrap rounded-full border px-3.5 py-2 text-xs font-medium transition-colors sm:text-[13px] ${
                      category === item
                        ? "border-[#24211D] bg-[#24211D] text-[#F5EFE6]"
                        : "border-[#D9CEC0] bg-[#FBF8F2] text-[#70665C] hover:border-[#A68C6C] hover:text-[#24211D]"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>

              <div className="flex w-full flex-wrap items-center justify-between gap-2 sm:w-auto sm:justify-end sm:gap-3">
                <button
                  type="button"
                  onClick={() => setShowFilters((previous) => !previous)}
                  aria-expanded={showFilters}
                  aria-controls="mobile-shop-filters"
                  className="flex cursor-pointer items-center gap-2 rounded-lg border border-[#D9CEC0] bg-[#FBF8F2] px-3 py-2 text-xs lg:hidden"
                >
                  <SlidersHorizontal size={15} />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="rounded-full bg-[#24211D] px-1.5 text-white">
                      {activeFilterCount}
                    </span>
                  )}
                </button>

                <label
                  htmlFor="sort-products"
                  className="hidden text-xs text-[#867B70] xl:block"
                >
                  Sort by
                </label>

                <select
                  id="sort-products"
                  value={sortBy}
                  onChange={(event) =>
                    setSortBy(event.target.value as SortOption)
                  }
                  className="max-w-[155px] cursor-pointer rounded-lg border border-[#D9CEC0] bg-[#FBF8F2] px-2.5 py-2 text-xs text-[#24211D] outline-none focus:border-[#B89B72] sm:max-w-none sm:px-3"
                >
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name: A to Z</option>
                </select>

                <div className="flex rounded-lg border border-[#D9CEC0] bg-[#FBF8F2] p-1">
                  <button
                    type="button"
                    onClick={() => setView("grid")}
                    aria-label="Grid view"
                    aria-pressed={view === "grid"}
                    className={`cursor-pointer rounded-md p-1.5 transition-colors ${
                      view === "grid"
                        ? "bg-[#24211D] text-white"
                        : "text-[#8A7C6C] hover:text-[#24211D]"
                    }`}
                  >
                    <Grid2X2 size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={() => setView("list")}
                    aria-label="List view"
                    aria-pressed={view === "list"}
                    className={`cursor-pointer rounded-md p-1.5 transition-colors ${
                      view === "list"
                        ? "bg-[#24211D] text-white"
                        : "text-[#8A7C6C] hover:text-[#24211D]"
                    }`}
                  >
                    <List size={16} />
                  </button>
                </div>
              </div>
            </div>

            {showFilters && (
              <div
                id="mobile-shop-filters"
                className="mb-6 rounded-2xl border border-[#D9CEC0] bg-[#FBF8F2] p-5 lg:hidden"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm font-semibold">Refine products</span>
                  <button
                    type="button"
                    aria-label="Close filters"
                    onClick={() => setShowFilters(false)}
                    className="cursor-pointer p-1"
                  >
                    <X size={18} />
                  </button>
                </div>

                <ProductFilters
                  products={products}
                  category={category}
                  onCategoryChange={setCategory}
                  switchTypes={switchTypes}
                  onSwitchTypesChange={setSwitchTypes}
                  availability={availability}
                  onAvailabilityChange={setAvailability}
                />

                <div className="mt-5 flex gap-3">
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="flex-1 cursor-pointer rounded-lg border border-[#D9CEC0] px-4 py-2.5 text-sm"
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowFilters(false)}
                    className="flex-1 cursor-pointer rounded-lg bg-[#24211D] px-4 py-2.5 text-sm text-white"
                  >
                    Show {filteredProducts.length} products
                  </button>
                </div>
              </div>
            )}

            {filteredProducts.length > 0 ? (
              <div
                className={
                  view === "grid"
                    ? "grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
                    : "grid grid-cols-1 gap-5"
                }
              >
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onQuickView={setSelectedProduct}
                  />
                ))}
              </div>
            ) : (
              <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-[#DDD3C5] bg-[#FBF8F2] px-5 text-center">
                <SlidersHorizontal size={28} className="mb-4 text-[#B89B72]" />
                <h2 className="font-serif text-2xl">
                  Nothing matches just yet.
                </h2>
                <p className="mt-2 text-sm text-[#867B70]">
                  Try a different category or adjust your filters.
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-6 cursor-pointer rounded-lg bg-[#24211D] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#4B4036]"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </section>
        </div>
      </div>

      <ProductQuickView
        key={selectedProduct?.id ?? "closed"}
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </main>
  );
}
