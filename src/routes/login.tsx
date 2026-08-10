import { useState } from "react";
import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { HugeiconsIcon } from "@hugeicons/react";
import { Login01Icon, LockPasswordIcon, Mail01Icon } from "@hugeicons/core-free-icons";
import { Logo } from "../components/Logo";
import { getSession, login } from "../server/auth";

export const Route = createFileRoute("/login")({
  beforeLoad: async () => {
    const session = await getSession();
    if (session.authed) throw redirect({ to: "/admin" });
  },
  component: Login,
});

function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await login({ data: { email, password } });
      if (res.ok) {
        await router.navigate({ to: "/admin" });
      } else {
        setError(res.error);
      }
    } catch {
      setError("Something went wrong — try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-5">
      <div
        className="pointer-events-none fixed -top-40 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(closest-side, #4c8dff, transparent)" }}
      />
      <form
        id="admin-login-card"
        onSubmit={submit}
        className="relative w-full max-w-sm rounded-2xl border border-line bg-panel p-8"
      >
        <div className="flex items-center gap-3">
          <Logo size={36} />
          <div>
            <h1 className="text-lg font-semibold leading-tight">OhMyWallpaper</h1>
            <p className="text-xs text-muted">Superadmin console</p>
          </div>
        </div>

        <label className="mt-7 block text-xs font-medium uppercase tracking-wide text-muted">
          Email
        </label>
        <div className="mt-2 flex items-center gap-2 rounded-xl border border-line bg-ink px-3.5 focus-within:border-accent">
          <HugeiconsIcon icon={Mail01Icon} size={16} className="shrink-0 text-faint" />
          <input
            id="input-admin-email"
            type="email"
            autoFocus
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full bg-transparent py-3 text-sm text-fg outline-none placeholder:text-faint"
          />
        </div>

        <label className="mt-4 block text-xs font-medium uppercase tracking-wide text-muted">
          Password
        </label>
        <div className="mt-2 flex items-center gap-2 rounded-xl border border-line bg-ink px-3.5 focus-within:border-accent">
          <HugeiconsIcon icon={LockPasswordIcon} size={16} className="shrink-0 text-faint" />
          <input
            id="input-admin-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full bg-transparent py-3 text-sm text-fg outline-none placeholder:text-faint"
          />
        </div>

        {error && <p className="mt-3 text-sm text-danger">{error}</p>}
        <button
          id="btn-login"
          type="submit"
          disabled={busy || email.trim() === "" || password === ""}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-3 text-sm font-semibold text-white transition-opacity disabled:opacity-50"
        >
          <HugeiconsIcon icon={Login01Icon} size={17} />
          {busy ? "Signing in…" : "Sign in"}
        </button>
        <p className="mt-4 text-center text-xs leading-relaxed text-faint">
          Accounts are managed with <code className="text-muted">bun run create-admin</code>{" "}
          in ohmywallpaper-api.
        </p>
      </form>
    </div>
  );
}
