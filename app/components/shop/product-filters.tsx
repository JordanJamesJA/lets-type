import { type Product, type ProductCategory } from "@/lib/products";

export const categories = [
  "All Products",
  "Keyboards",
  "Keycaps",
  "Switches",
  "Plates",
  "Cases",
  "Accessories",
] as const;

export type CategoryFilter = "All Products" | ProductCategory;
export type SwitchFilter = "Linear" | "Tactile" | "Clicky";
export type AvailabilityFilter = "in-stock" | "out-of-stock";

type ProductFiltersProps = {
  products: Product[];
  category: CategoryFilter;
  onCategoryChange: (category: CategoryFilter) => void;
  switchTypes: SwitchFilter[];
  onSwitchTypesChange: (types: SwitchFilter[]) => void;
  availability: AvailabilityFilter[];
  onAvailabilityChange: (values: AvailabilityFilter[]) => void;
};

export default function ProductFilters({
  products,
  category,
  onCategoryChange,
  switchTypes,
  onSwitchTypesChange,
  availability,
  onAvailabilityChange,
}: ProductFiltersProps) {
  const toggle = <T extends string>(
    value: T,
    selected: T[],
    onChange: (values: T[]) => void,
  ) => {
    onChange(
      selected.includes(value)
        ? selected.filter((item) => item !== value)
        : [...selected, value],
    );
  };

  return (
    <aside className="text-[#29231E]">
      <div className="pb-5">
        <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.17em] text-[#8B7C6D]">
          Categories
        </h3>
        <div className="space-y-0.5">
          {categories.map((item) => {
            const count =
              item === "All Products"
                ? products.length
                : products.filter((product) => product.category === item)
                    .length;
            return (
              <button
                key={item}
                type="button"
                onClick={() => onCategoryChange(item)}
                aria-pressed={category === item}
                className={`flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                  category === item
                    ? "bg-[#E9DFD1] font-semibold text-[#33271C]"
                    : "text-[#71665B] hover:bg-[#F1E9DF] hover:text-[#29231E]"
                }`}
              >
                <span>{item}</span>
                <span className="text-xs opacity-65">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="border-t border-[#E1D7CA] py-5">
        <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.17em] text-[#8B7C6D]">
          Switch Type
        </h3>
        <div className="space-y-3">
          {(["Linear", "Tactile", "Clicky"] as const).map((type) => (
            <label
              key={type}
              className="flex cursor-pointer items-center gap-3 text-sm text-[#665B50]"
            >
              <input
                type="checkbox"
                checked={switchTypes.includes(type)}
                onChange={() => toggle(type, switchTypes, onSwitchTypesChange)}
                className="h-4 w-4 accent-[#806347]"
              />
              {type}
            </label>
          ))}
        </div>
      </div>

      <div className="border-t border-[#E1D7CA] pt-5">
        <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.17em] text-[#8B7C6D]">
          Availability
        </h3>
        <div className="space-y-3">
          {(
            [
              { value: "in-stock", label: "In Stock" },
              { value: "out-of-stock", label: "Out of Stock" },
            ] as const
          ).map((option) => (
            <label
              key={option.value}
              className="flex cursor-pointer items-center gap-3 text-sm text-[#665B50]"
            >
              <input
                type="checkbox"
                checked={availability.includes(option.value)}
                onChange={() =>
                  toggle(option.value, availability, onAvailabilityChange)
                }
                className="h-4 w-4 accent-[#806347]"
              />
              {option.label}
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
}
