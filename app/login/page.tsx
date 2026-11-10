"use client";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useState, type SubmitEvent } from "react";
import Link from "next/link";
import { ArrowRight, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    setIsLoading(true);

    try {
      const { error: authError } = await authClient.signIn.email({
        email: email.trim().toLowerCase(),
        password,
      });

      if (authError) {
        setError(authError.message || "Invalid email or password.");
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

  return (
    <main className="flex min-h-[calc(100dvh-88px)] items-center justify-center bg-[#F5EFE6] px-5 py-12 text-[#24211D]">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-[#A68C6C]">
            Welcome Back
          </p>
          <h1 className="font-serif text-4xl tracking-tight sm:text-5xl">
            Sign in.
          </h1>
          <p className="mt-4 text-sm text-[#817568]">
            Your perfect typing experience awaits.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
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
              className="h-13 w-full rounded-xl border border-[#D9CEC0] bg-[#FBF8F2] px-4 text-sm outline-none transition focus:border-[#B89B72]"
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs font-medium text-[#8C6C48] hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                className="h-13 w-full rounded-xl border border-[#D9CEC0] bg-[#FBF8F2] px-4 pr-12 text-sm outline-none transition focus:border-[#B89B72]"
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
            {isLoading ? "Signing In..." : "Sign In"}
            {!isLoading && <ArrowRight size={17} />}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-[#817568]">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-semibold text-[#8C6C48] hover:underline"
          >
            Create an account
          </Link>
        </p>
      </div>
    </main>
  );
}
