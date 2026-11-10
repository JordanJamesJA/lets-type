"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Keyboard,
  Layers3,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";

const Keyboard3D = dynamic(() => import("@/app/components/keyboard-3d"), {
  ssr: false,
  loading: () => (
    <div className="flex h-100 items-center justify-center text-sm text-[#817568]">
      Loading 3D preview...
    </div>
  ),
});

const layouts = [
  { label: "65%", price: 149 },
  { label: "75%", price: 169 },
  { label: "TKL", price: 189 },
] as const;

const colors = [
  { name: "Ivory", hex: "#E5D4BF" },
  { name: "Midnight", hex: "#24211D" },
  { name: "Forest", hex: "#25473A" },
  { name: "Slate", hex: "#66788C" },
] as const;

const switches = [
  { name: "Linear", description: "Smooth and quiet", price: 0 },
  { name: "Tactile", description: "Subtle feedback", price: 15 },
  { name: "Clicky", description: "Crisp and audible", price: 10 },
] as const;

const keycaps = [
  { name: "Classic Ivory", price: 0 },
  { name: "Midnight", price: 20 },
  { name: "Forest", price: 25 },
] as const;

const steps = ["Layout", "Switches", "Keycaps", "Extras"] as const;

export default function BuildPage() {
  const [step, setStep] = useState(0);
  const [layout, setLayout] = useState(0);
  const [color, setColor] = useState(0);
  const [switchType, setSwitchType] = useState(0);
  const [keycap, setKeycap] = useState(0);
  const [foam, setFoam] = useState(false);

  const total = useMemo(
    () =>
      layouts[layout].price +
      switches[switchType].price +
      keycaps[keycap].price +
      (foam ? 15 : 0),
    [layout, switchType, keycap, foam],
  );

  const selectedClass = "border-[#8C6C48] bg-[#EDE2D4] ring-1 ring-[#8C6C48]";
  const normalClass = "border-[#D9CEC0] bg-[#FBF8F2] hover:border-[#B89B72]";

  return (
    <main className="min-h-[calc(100dvh-88px)] bg-[#F5EFE6] text-[#24211D]">
      <div className="mx-auto max-w-375 px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div className="grid items-start gap-8 xl:grid-cols-[minmax(0,1fr)_400px]">
          <div className="min-w-0">
            <header className="max-w-lg">
              <p className="mb-5 text-xs font-semibold uppercase tracking-[0.25em] text-[#8C6C48]">
                Build
              </p>
              <h1 className="font-serif text-5xl leading-[1.05] tracking-tight sm:text-6xl">
                Design Your
                <span className="block">Keyboard.</span>
              </h1>
              <p className="mt-5 max-w-md text-sm leading-7 text-[#817568] sm:text-base">
                Customize your mechanical keyboard to match your style, feel,
                and workflow.
              </p>
            </header>

            <div className="relative mt-4 overflow-hidden rounded-3xl bg-linear-to-br from-[#FBF8F2] via-[#F1E7DA] to-[#E8D8C5]">
              <div className="absolute left-5 top-5 z-10 flex items-center gap-2 rounded-full border border-[#D9CEC0] bg-[#FBF8F2]/85 px-4 py-2 text-xs text-[#76593E] backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-[#8C6C48]" />
                Interactive 3D Preview
              </div>

              <Keyboard3D accent={colors[color].hex} />

              <p className="absolute bottom-4 left-0 right-0 px-5 text-center text-xs text-[#817568]">
                Drag to rotate · Scroll to zoom · Case color updates live
              </p>
            </div>

            <div className="mt-5 flex flex-wrap gap-5 text-xs text-[#817568]">
              <span className="flex items-center gap-2">
                <SlidersHorizontal size={16} />
                Configure your components
              </span>
              <span className="flex items-center gap-2">
                <Layers3 size={16} />
                Explore the keyboard layers
              </span>
              <span className="flex items-center gap-2">
                <Keyboard size={16} />
                Your personalized setup
              </span>
            </div>
          </div>

          <aside className="rounded-2xl border border-[#D9CEC0] bg-[#FBF8F2] p-5 shadow-[0_12px_35px_rgba(75,49,29,0.06)] sm:p-7">
            <div className="grid grid-cols-4 gap-1 border-b border-[#E3D8CA] pb-5">
              {steps.map((label, index) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setStep(index)}
                  className={`flex cursor-pointer flex-col items-center gap-2 rounded-lg py-2 text-[10px] transition sm:text-xs ${
                    index === step
                      ? "bg-[#EDE2D4] font-semibold text-[#76512F]"
                      : "text-[#817568] hover:bg-[#F0E8DD]"
                  }`}
                >
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full ${
                      index === step ? "bg-[#D9C0A5]" : "bg-[#EEE8E2]"
                    }`}
                  >
                    {index + 1}
                  </span>
                  {label}
                </button>
              ))}
            </div>

            <div className="min-h-75 py-7">
              {step === 0 && (
                <>
                  <h2 className="mb-5 text-base font-semibold">
                    Choose a Layout
                  </h2>
                  <div className="grid grid-cols-3 gap-3">
                    {layouts.map((option, index) => (
                      <button
                        key={option.label}
                        type="button"
                        onClick={() => setLayout(index)}
                        className={`flex cursor-pointer flex-col items-center gap-4 rounded-xl border px-2 py-5 transition ${
                          layout === index ? selectedClass : normalClass
                        }`}
                      >
                        <Keyboard size={30} strokeWidth={1.3} />
                        <span className="text-sm font-semibold">
                          {option.label}
                        </span>
                      </button>
                    ))}
                  </div>

                  <h2 className="mb-5 mt-8 text-base font-semibold">
                    Case Color
                  </h2>
                  <div className="flex flex-wrap gap-4">
                    {colors.map((option, index) => (
                      <button
                        key={option.name}
                        type="button"
                        onClick={() => setColor(index)}
                        title={option.name}
                        aria-label={`${option.name} case`}
                        aria-pressed={color === index}
                        className={`flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border-2 transition ${
                          color === index
                            ? "border-[#8C6C48]"
                            : "border-transparent"
                        }`}
                      >
                        <span
                          className="h-8 w-8 rounded-full border border-black/15"
                          style={{ backgroundColor: option.hex }}
                        />
                      </button>
                    ))}
                  </div>
                  <p className="mt-3 text-xs text-[#817568]">
                    Selected: {colors[color].name}
                  </p>
                </>
              )}

              {step === 1 && (
                <>
                  <h2 className="mb-5 text-base font-semibold">
                    Choose Your Switches
                  </h2>
                  <div className="space-y-3">
                    {switches.map((option, index) => (
                      <button
                        key={option.name}
                        type="button"
                        onClick={() => setSwitchType(index)}
                        className={`flex w-full cursor-pointer items-center justify-between rounded-xl border p-4 text-left transition ${
                          switchType === index ? selectedClass : normalClass
                        }`}
                      >
                        <div>
                          <p className="text-sm font-semibold">{option.name}</p>
                          <p className="mt-1 text-xs text-[#817568]">
                            {option.description}
                          </p>
                        </div>
                        <span className="text-xs">
                          {option.price === 0
                            ? "Included"
                            : `+$${option.price}`}
                        </span>
                      </button>
                    ))}
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <h2 className="mb-5 text-base font-semibold">
                    Choose Your Keycaps
                  </h2>
                  <div className="space-y-3">
                    {keycaps.map((option, index) => (
                      <button
                        key={option.name}
                        type="button"
                        onClick={() => setKeycap(index)}
                        className={`flex w-full cursor-pointer items-center justify-between rounded-xl border p-4 text-left transition ${
                          keycap === index ? selectedClass : normalClass
                        }`}
                      >
                        <span className="text-sm font-semibold">
                          {option.name}
                        </span>
                        <span className="text-xs">
                          {option.price === 0
                            ? "Included"
                            : `+$${option.price}`}
                        </span>
                      </button>
                    ))}
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <h2 className="mb-5 text-base font-semibold">
                    Finishing Touches
                  </h2>
                  <button
                    type="button"
                    onClick={() => setFoam(!foam)}
                    className={`flex w-full cursor-pointer items-center justify-between rounded-xl border p-4 text-left ${
                      foam ? selectedClass : normalClass
                    }`}
                  >
                    <div>
                      <p className="text-sm font-semibold">
                        Sound Dampening Foam
                      </p>
                      <p className="mt-1 text-xs text-[#817568]">
                        Softer, more controlled typing sound
                      </p>
                    </div>
                    <span className="text-xs">+$15</span>
                  </button>

                  <div className="mt-6 rounded-xl bg-[#F1E9DE] p-4">
                    <p className="mb-4 flex items-center gap-2 text-sm font-semibold">
                      <Sparkles size={16} />
                      Your Configuration
                    </p>
                    <div className="space-y-2 text-xs text-[#817568]">
                      <p>Layout: {layouts[layout].label}</p>
                      <p>Case: {colors[color].name}</p>
                      <p>Switches: {switches[switchType].name}</p>
                      <p>Keycaps: {keycaps[keycap].name}</p>
                      <p>Foam: {foam ? "Included" : "Not selected"}</p>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="border-t border-[#E3D8CA] pt-6">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">Estimated Total</p>
                  <p className="mt-1 text-[11px] text-[#817568]">
                    USD · Configuration estimate
                  </p>
                </div>
                <p className="font-serif text-3xl">${total.toFixed(2)}</p>
              </div>

              <div className="flex gap-3">
                {step > 0 && (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    aria-label="Previous step"
                    className="flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-[#D9CEC0] transition hover:bg-[#EDE2D4]"
                  >
                    <ArrowLeft size={18} />
                  </button>
                )}

                {step < steps.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep(step + 1)}
                    className="flex h-12 flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#69482C] px-4 text-sm font-semibold text-white transition hover:bg-[#8C6C48]"
                  >
                    Continue to {steps[step + 1]}
                    <ArrowRight size={17} />
                  </button>
                ) : (
                  <div className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[#EDE2D4] px-4 text-center text-xs font-medium text-[#76593E]">
                    <Check size={16} />
                    Configuration Complete
                  </div>
                )}
              </div>
              {step === steps.length - 1 && (
                <p className="mt-3 text-center text-xs text-[#817568]">
                  Preview only — custom-build checkout is not yet enabled.
                </p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
