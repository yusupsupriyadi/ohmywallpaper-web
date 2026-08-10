import { Link, Outlet, createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  DashboardSquare01Icon,
  Image01Icon,
  LinkSquare01Icon,
  Logout01Icon,
} from "@hugeicons/core-free-icons";
import { Wordmark } from "../../components/Logo";
import { getSession, logout } from "../../server/auth";

export const Route = createFileRoute("/admin")({
  beforeLoad: async () => {
    const session = await getSession();
    if (!session.authed) throw redirect({ to: "/login" });
  },
  component: AdminLayout,
});

const NAV = [
  { to: "/admin", label: "Dashboard", icon: DashboardSquare01Icon, exact: true },
  { to: "/admin/wallpapers", label: "Wallpapers", icon: Image01Icon, exact: false },
] as const;

function AdminLayout() {
  const router = useRouter();

  async function signOut() {
    await logout();
    await router.navigate({ to: "/login" });
  }

  return (
    <div className="flex min-h-screen">
      <aside
        id="admin-sidebar"
        className="fixed inset-y-0 left-0 flex w-60 flex-col border-r border-line bg-panel/60 px-4 py-5 backdrop-blur"
      >
        <Link to="/admin" className="px-2">
          <Wordmark size={26} />
        </Link>
        <nav className="mt-8 flex flex-col gap-1">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.exact }}
              activeProps={{ className: "bg-accent-soft text-accent" }}
              inactiveProps={{ className: "text-muted hover:bg-white/5 hover:text-fg" }}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors"
            >
              <HugeiconsIcon icon={item.icon} size={18} />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto flex flex-col gap-1">
          <Link
            to="/"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-white/5 hover:text-fg"
          >
            <HugeiconsIcon icon={LinkSquare01Icon} size={18} />
            View site
          </Link>
          <button
            id="btn-logout"
            onClick={signOut}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-muted transition-colors hover:bg-white/5 hover:text-danger"
          >
            <HugeiconsIcon icon={Logout01Icon} size={18} />
            Sign out
          </button>
        </div>
      </aside>
      <main className="ml-60 min-h-screen w-[calc(100%-15rem)] px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}
