"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import {
  House,
  Package,
  UserRound,
  LogOut,
  ArrowRight,
  Check,
  X,
} from "lucide-react";

type AccountTab = "overview" | "orders" | "profile";

export default function AccountPage() {
  const router = useRouter();
  const { data: session, isPending, refetch } = authClient.useSession();

  const [activeTab, setActiveTab] = useState<AccountTab>("overview");
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const menu = [
    { id: "overview", label: "Overview", icon: House },
    { id: "orders", label: "Orders", icon: Package },
    { id: "profile", label: "Profile", icon: UserRound },
  ] as const;

  function changeTab(tab: AccountTab) {
    setActiveTab(tab);
    setEditing(false);
    setError("");
    setSuccess("");
  }

  function beginEditing() {
    setName(session?.user.name ?? "");
    setEditing(true);
    setError("");
    setSuccess("");
  }

  async function saveProfile() {
    if (name.trim().length < 2) {
      setError("Please enter a name with at least 2 characters.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const { error: authError } = await authClient.updateUser({
        name: name.trim(),
      });

      if (authError) {
        setError(authError.message || "Could not update profile.");
        return;
      }

      await refetch();
      setEditing(false);
      setSuccess("Profile updated successfully.");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleSignOut() {
    setSigningOut(true);
    setError("");

    try {
      const { error: authError } = await authClient.signOut();

      if (authError) {
        setError(authError.message || "Could not sign out.");
        return;
      }

      router.replace("/login");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSigningOut(false);
    }
  }

  if (isPending) {
    return (
      <main className="flex min-h-[calc(100dvh-88px)] items-center justify-center bg-[#F5EFE6] text-sm text-[#817568]">
        Loading your account...
      </main>
    );
  }

  if (!session) {
    return (
      <main className="flex min-h-[calc(100dvh-88px)] flex-col items-center justify-center bg-[#F5EFE6] px-6 text-center text-[#24211D]">
        <h1 className="font-serif text-4xl">Sign in required.</h1>
        <p className="mt-3 text-sm text-[#817568]">
          Sign in to manage your account.
        </p>
        <Link
          href="/login"
          className="mt-6 rounded-lg bg-[#8C6C48] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#735636]"
        >
          Sign In
        </Link>
      </main>
    );
  }

  const user = session.user;

  const profileSummary = (
    <div className="flex flex-col gap-5 border-t border-[#D9CEC0] pt-7 sm:flex-row sm:items-center">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#EDE2D4]">
        <UserRound size={28} strokeWidth={1.5} />
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="font-serif text-xl">{user.name}</h3>
        <p className="mt-1 break-all text-sm text-[#817568]">{user.email}</p>
      </div>

      <button
        type="button"
        onClick={() => {
          changeTab("profile");
          beginEditing();
        }}
        className="w-fit cursor-pointer rounded-lg border border-[#8C6C48] px-3 py-1.5 text-xs font-medium transition hover:bg-[#EDE2D4]"
      >
        Edit Profile
      </button>
    </div>
  );

  const ordersContent = (
    <div className="flex min-h-56 flex-col items-center justify-center rounded-xl border border-[#D9CEC0] bg-[#FBF8F2]/60 px-5 py-10 text-center">
      <Package size={32} strokeWidth={1.3} className="text-[#8C6C48]" />
      <h3 className="mt-4 font-serif text-2xl">No orders yet.</h3>
      <p className="mt-2 text-sm text-[#817568]">
        Your purchases will appear here after checkout.
      </p>
      <Link
        href="/shop"
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#8C6C48] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#735636]"
      >
        Shop Keyboards
        <ArrowRight size={15} />
      </Link>
    </div>
  );

  return (
    <main className="min-h-[calc(100dvh-88px)] bg-[#F5EFE6] px-5 py-12 text-[#24211D] sm:px-8 lg:py-20">
      <div className="mx-auto grid max-w-6xl gap-9 lg:grid-cols-[230px_minmax(0,1fr)] lg:gap-12">
        {/* Sidebar */}
        <aside className="lg:min-h-[480px] lg:border-r lg:border-[#D9CEC0] lg:pr-8">
          <h2 className="font-serif text-2xl">My Account</h2>

          <nav aria-label="Account navigation" className="mt-7">
            <div className="flex gap-2 overflow-x-auto lg:flex-col lg:gap-1">
              {menu.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => changeTab(id)}
                  aria-current={activeTab === id ? "page" : undefined}
                  className={`flex shrink-0 cursor-pointer items-center gap-3 rounded-lg px-4 py-3 text-sm transition lg:w-full ${
                    activeTab === id
                      ? "bg-[#E9DED1] font-medium text-[#6F4E30]"
                      : "hover:bg-[#EDE5DB]"
                  }`}
                >
                  <Icon size={19} strokeWidth={1.6} />
                  {label}
                </button>
              ))}
            </div>

            <div className="mt-5 border-t border-[#D9CEC0] pt-4">
              <button
                type="button"
                onClick={handleSignOut}
                disabled={signingOut}
                className="flex cursor-pointer items-center gap-3 rounded-lg px-4 py-3 text-sm transition hover:bg-[#EDE5DB] disabled:opacity-50"
              >
                <LogOut size={19} strokeWidth={1.6} />
                {signingOut ? "Signing Out..." : "Sign Out"}
              </button>
            </div>
          </nav>
        </aside>

        {/* Main content */}
        <div className="min-w-0">
          <header className="mb-9">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#8C6C48]">
              Account
            </p>
            <h1 className="font-serif text-4xl tracking-tight sm:text-5xl">
              {activeTab === "overview"
                ? "Overview"
                : activeTab === "orders"
                  ? "Your Orders"
                  : "Your Profile"}
            </h1>
            <p className="mt-3 text-sm text-[#817568]">
              {activeTab === "overview"
                ? "Manage your account and view your orders."
                : activeTab === "orders"
                  ? "View your purchase history."
                  : "View and update your personal information."}
            </p>
          </header>

          {error && (
            <p
              role="alert"
              className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </p>
          )}

          {success && (
            <p
              role="status"
              className="mb-6 rounded-lg border border-[#C8D8C4] bg-[#EFF5ED] px-4 py-3 text-sm text-[#476342]"
            >
              {success}
            </p>
          )}

          {activeTab === "overview" && (
            <div>
              <div className="grid gap-4 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => changeTab("profile")}
                  className="flex cursor-pointer items-center gap-4 rounded-xl border border-[#CDBFB1] p-5 text-left transition hover:bg-[#EDE5DB]"
                >
                  <UserRound size={25} strokeWidth={1.5} />
                  <span className="min-w-0 flex-1">
                    <span className="block font-serif text-xl">Profile</span>
                    <span className="mt-1 block text-sm text-[#817568]">
                      Manage your details.
                    </span>
                  </span>
                  <ArrowRight size={19} />
                </button>

                <button
                  type="button"
                  onClick={() => changeTab("orders")}
                  className="flex cursor-pointer items-center gap-4 rounded-xl border border-[#CDBFB1] p-5 text-left transition hover:bg-[#EDE5DB]"
                >
                  <Package size={25} strokeWidth={1.5} />
                  <span className="min-w-0 flex-1">
                    <span className="block font-serif text-xl">Orders</span>
                    <span className="mt-1 block text-sm text-[#817568]">
                      View your order history.
                    </span>
                  </span>
                  <ArrowRight size={19} />
                </button>
              </div>

              <div className="mt-10">{profileSummary}</div>
            </div>
          )}

          {activeTab === "orders" && ordersContent}

          {activeTab === "profile" && (
            <section className="max-w-2xl">
              <div className="flex items-center gap-4 border-b border-[#D9CEC0] pb-7">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#EDE2D4]">
                  <UserRound size={27} strokeWidth={1.5} />
                </div>
                <div className="min-w-0">
                  <h2 className="font-serif text-xl">{user.name}</h2>
                  <p className="break-all text-sm text-[#817568]">
                    {user.email}
                  </p>
                </div>
              </div>

              <div className="space-y-6 py-7">
                <div>
                  <label
                    htmlFor="account-name"
                    className="mb-2 block text-sm font-medium"
                  >
                    Full name
                  </label>
                  {editing ? (
                    <input
                      id="account-name"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      className="w-full rounded-lg border border-[#D9CEC0] bg-[#FBF8F2] px-4 py-3 text-sm outline-none focus:border-[#8C6C48]"
                    />
                  ) : (
                    <p className="text-sm text-[#817568]">{user.name}</p>
                  )}
                </div>

                <div>
                  <p className="mb-2 text-sm font-medium">Email address</p>
                  <p className="break-all text-sm text-[#817568]">
                    {user.email}
                  </p>
                </div>
              </div>

              {editing ? (
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={saveProfile}
                    disabled={saving}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#8C6C48] px-4 py-2 text-sm text-white transition hover:bg-[#735636] disabled:opacity-50"
                  >
                    <Check size={16} />
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(false);
                      setError("");
                    }}
                    disabled={saving}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[#D9CEC0] px-4 py-2 text-sm transition hover:bg-[#EDE5DB]"
                  >
                    <X size={16} />
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={beginEditing}
                  className="cursor-pointer rounded-lg border border-[#8C6C48] px-3 py-1.5 text-xs font-medium transition hover:bg-[#EDE2D4]"
                >
                  Edit Profile
                </button>
              )}
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
