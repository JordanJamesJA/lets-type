
"use client";

import { useMemo, useState, type SubmitEvent } from "react";
import {
  Search,
  BookOpen,
  MessageCircle,
  Sparkles,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Send,
  X,
} from "lucide-react";

const faqs = [
  {
    question: "How do I create an account?",
    answer:
      "Select the account icon in the navigation bar, choose Create an account, and complete the registration form. You can then sign in to manage your profile.",
  },
  {
    question: "How do I purchase a keyboard?",
    answer:
      "Browse our shop, add a keyboard to your cart, and proceed to checkout. Orders and payments are currently available in our testing environment.",
  },
  {
    question: "Can I customize my keyboard?",
    answer:
      "Visit the Build section to explore keyboard customization. Available configuration options depend on the current build features.",
  },
  {
    question: "Can I change the quantity of items in my cart?",
    answer:
      "Yes. Open your cart and use the quantity controls to increase or decrease items before checkout.",
  },
  {
    question: "Where can I view my orders?",
    answer:
      "Sign in and open your Account dashboard, then select Orders. Completed purchases will appear there once order tracking is enabled.",
  },
  {
    question: "Can I use Let's Type on my phone?",
    answer:
      "Yes. Let's Type is being designed to work across mobile phones, tablets, and desktop devices.",
  },
];

type SupportForm = "contact" | "feedback" | null;

export default function SupportPage() {
  const [query, setQuery] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activeForm, setActiveForm] = useState<SupportForm>(null);
  const [submitted, setSubmitted] = useState(false);

  const filteredFaqs = useMemo(
    () =>
      faqs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(query.toLowerCase()) ||
          faq.answer.toLowerCase().includes(query.toLowerCase())
      ),
    [query]
  );

  function openForm(form: SupportForm) {
    setSubmitted(false);
    setActiveForm(form);
  }

  function handleFormSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    // No message delivery service connected for demo purposes only
    setSubmitted(true);
  }

  return (
    <main className="min-h-[calc(100dvh-88px)] bg-[#F5EFE6] text-[#24211D]">
      <div className="mx-auto max-w-6xl px-5 pb-20 pt-14 sm:px-8 lg:pt-20">
        {/* Header */}
        <header className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#8C6C48]">
            Support
          </p>

          <h1 className="mt-5 font-serif text-4xl tracking-tight sm:text-5xl lg:text-6xl">
            How can we help?
          </h1>

          <p className="mt-5 text-sm text-[#817568] sm:text-base">
            Find answers, get in touch, or share feedback — we&apos;re here to help.
          </p>

          {/* Search */}
          <div className="relative mx-auto mt-9 max-w-2xl">
            <Search
              size={20}
              className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-[#8C6C48]"
            />

            <input
              type="search"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setOpenFaq(null);
              }}
              placeholder="Search for help (e.g. account, cart, orders)"
              aria-label="Search frequently asked questions"
              className="h-14 w-full rounded-full border border-[#CDB89F] bg-[#FBF8F2] pl-14 pr-5 text-sm outline-none transition placeholder:text-[#928476] focus:border-[#8C6C48]"
            />
          </div>
        </header>

        {/* Support cards */}
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          <button
            type="button"
            onClick={() =>
              document
                .getElementById("frequently-asked-questions")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="group flex cursor-pointer flex-col rounded-2xl border border-[#D9CEC0] bg-[#FBF8F2]/50 p-7 text-left transition hover:border-[#B89B72] hover:bg-[#FBF8F2]"
          >
            <BookOpen
              size={29}
              strokeWidth={1.6}
              className="text-[#8C6C48]"
            />
            <div className="mt-5 flex items-center justify-between gap-3">
              <h2 className="font-serif text-2xl">Browse FAQs</h2>
              <ArrowRight
                size={19}
                className="text-[#8C6C48] transition group-hover:translate-x-1"
              />
            </div>
            <p className="mt-2 text-sm leading-relaxed text-[#817568]">
              Find quick answers to common questions.
            </p>
          </button>

          <button
            type="button"
            onClick={() => openForm("contact")}
            className="group flex cursor-pointer flex-col rounded-2xl border border-[#D9CEC0] bg-[#FBF8F2]/50 p-7 text-left transition hover:border-[#B89B72] hover:bg-[#FBF8F2]"
          >
            <MessageCircle
              size={29}
              strokeWidth={1.6}
              className="text-[#8C6C48]"
            />
            <div className="mt-5 flex items-center justify-between gap-3">
              <h2 className="font-serif text-2xl">Contact Us</h2>
              <ArrowRight
                size={19}
                className="text-[#8C6C48] transition group-hover:translate-x-1"
              />
            </div>
            <p className="mt-2 text-sm leading-relaxed text-[#817568]">
              Send us a message about your order or account.
            </p>
          </button>

          <button
            type="button"
            onClick={() => openForm("feedback")}
            className="group flex cursor-pointer flex-col rounded-2xl border border-[#D9CEC0] bg-[#FBF8F2]/50 p-7 text-left transition hover:border-[#B89B72] hover:bg-[#FBF8F2]"
          >
            <Sparkles
              size={29}
              strokeWidth={1.6}
              className="text-[#8C6C48]"
            />
            <div className="mt-5 flex items-center justify-between gap-3">
              <h2 className="font-serif text-2xl">Give Feedback</h2>
              <ArrowRight
                size={19}
                className="text-[#8C6C48] transition group-hover:translate-x-1"
              />
            </div>
            <p className="mt-2 text-sm leading-relaxed text-[#817568]">
              Share ideas, report issues, or suggest features.
            </p>
          </button>
        </div>

        {/* FAQ section */}
        <section
          id="frequently-asked-questions"
          className="mt-20 scroll-mt-24"
        >
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <h2 className="font-serif text-3xl sm:text-4xl">
              Frequently Asked Questions
            </h2>

            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setOpenFaq(0);
                }}
                className="cursor-pointer text-sm font-medium text-[#8C6C48] hover:underline"
              >
                Clear search
              </button>
            )}
          </div>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,0.8fr)]">
            {/* Accordion */}
            <div className="space-y-3">
              {filteredFaqs.length === 0 ? (
                <div className="rounded-xl border border-[#D9CEC0] p-6 text-sm text-[#817568]">
                  No matching questions found. Try another keyword.
                </div>
              ) : (
                filteredFaqs.map((faq) => {
                  const index = faqs.indexOf(faq);
                  const isOpen = openFaq === index;

                  return (
                    <div
                      key={faq.question}
                      className="overflow-hidden rounded-xl border border-[#D9CEC0] bg-[#FBF8F2]/50"
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setOpenFaq(isOpen ? null : index)
                        }
                        aria-expanded={isOpen}
                        className="flex w-full cursor-pointer items-center justify-between gap-4 px-6 py-5 text-left"
                      >
                        <span className="text-sm font-semibold sm:text-base">
                          {faq.question}
                        </span>

                        {isOpen ? (
                          <ChevronUp
                            size={19}
                            className="shrink-0 text-[#8C6C48]"
                          />
                        ) : (
                          <ChevronDown
                            size={19}
                            className="shrink-0 text-[#8C6C48]"
                          />
                        )}
                      </button>

                      {isOpen && (
                        <p className="px-6 pb-5 text-sm leading-7 text-[#817568]">
                          {faq.answer}
                        </p>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Decorative right section */}
            <div className="hidden items-center justify-center lg:flex">
              <div className="flex aspect-square w-full max-w-72.5 flex-col items-center justify-center rounded-full bg-[#EDE2D4]/60 text-[#8C6C48]">
                <BookOpen size={72} strokeWidth={0.9} />
                <p className="mt-6 font-serif text-2xl">Here to help.</p>
                <p className="mt-2 text-xs tracking-wide">
                  Let&apos;s Type Support
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Support modal */}
      {activeForm && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setActiveForm(null);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="support-dialog-title"
            className="w-full max-w-lg rounded-2xl bg-[#F5EFE6] p-6 shadow-2xl sm:p-8"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8C6C48]">
                  Let&apos;s Type
                </p>
                <h2
                  id="support-dialog-title"
                  className="mt-3 font-serif text-3xl"
                >
                  {activeForm === "contact"
                    ? "Contact Us"
                    : "Share Feedback"}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setActiveForm(null)}
                aria-label="Close dialog"
                className="cursor-pointer rounded-full p-2 hover:bg-[#E9DED1]"
              >
                <X size={20} />
              </button>
            </div>

            {submitted ? (
              <div className="py-10 text-center">
                <p className="font-serif text-2xl">
                  Message drafted.
                </p>
                <p className="mt-3 text-sm text-[#817568]">
                  This form is a demonstration. Message delivery
                  isn&apos;t configured yet.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveForm(null)}
                  className="mt-6 cursor-pointer rounded-lg bg-[#8C6C48] px-6 py-3 text-sm text-white"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="mt-7 space-y-5">
                <div>
                  <label
                    htmlFor="support-email"
                    className="mb-2 block text-sm font-medium"
                  >
                    Your email
                  </label>
                  <input
                    id="support-email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-[#D9CEC0] bg-[#FBF8F2] px-4 py-3 text-sm outline-none focus:border-[#8C6C48]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="support-message"
                    className="mb-2 block text-sm font-medium"
                  >
                    Message
                  </label>
                  <textarea
                    id="support-message"
                    required
                    minLength={10}
                    rows={5}
                    placeholder={
                      activeForm === "contact"
                        ? "How can we help you?"
                        : "Tell us what you think..."
                    }
                    className="w-full resize-y rounded-xl border border-[#D9CEC0] bg-[#FBF8F2] px-4 py-3 text-sm outline-none focus:border-[#8C6C48]"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#8C6C48] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#735636]"
                >
                  Continue
                  <Send size={16} />
                </button>
                <p className="text-center text-xs text-[#817568]">
                  Demo only — this does not send a message.
                </p>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
