"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useState, type SubmitEvent } from "react";
import Link from "next/link";
import { ArrowRight, Eye, EyeOff } from "lucide-react";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (name.trim().length < 2) {
      setError("Please enter your full name.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      console.log("Starting registration...");

      const { data, error: authError } = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      });

      console.log("Registration result:", {
        success: !!data,
        error: authError,
      });

      if (authError) {
        setError(authError.message || "Unable to create account.");
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  const inputClass =
    "h-13 w-full rounded-xl border border-[#D9CEC0] bg-[#FBF8F2] px-4 text-sm outline-none transition focus:border-[#B89B72]";

  return (
    <main className="flex min-h-[calc(100dvh-88px)] items-center justify-center bg-[#F5EFE6] px-5 py-12 text-[#24211D]">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-[#A68C6C]">
            Join Let&apos;s Type
          </p>
          <h1 className="font-serif text-4xl tracking-tight sm:text-5xl">
            Create account.
          </h1>
          <p className="mt-4 text-sm text-[#817568]">
            Your perfect typing experience starts here.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-medium">
              Full name
            </label>
            <input
              id="name"
              type="text"
              autoComplete="name"
              required
              minLength={2}
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Your full name"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium">
              Email address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                minLength={8}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="At least 8 characters"
                className={`${inputClass} pr-12`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-[#817568] hover:text-[#24211D]"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <p className="mt-2 text-xs text-[#817568]">
              Use at least 8 characters.
            </p>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-2 block text-sm font-medium"
            >
              Confirm password
            </label>
            <input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Re-enter your password"
              className={inputClass}
            />
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="mt-3 flex h-13 w-full cursor-pointer items-center justify-center gap-3 rounded-xl bg-[#24211D] text-sm font-semibold text-[#F5EFE6] transition hover:bg-[#8C6C48] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Creating Account..." : "Create Account"}
            {!isLoading && <ArrowRight size={17} />}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-[#817568]">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-[#8C6C48] hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
