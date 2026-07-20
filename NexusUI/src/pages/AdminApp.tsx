import { useEffect, useState } from "react";
import {
  Activity,
  LogOut,
  Settings,
  Shield,
  Trash2,
  UserCheck,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthProvider";
import { Badge, Button } from "../components/UI";
import { fetchAdminUsers } from "../services/auth/adminClient";
import type { AppProfile } from "../types/auth";

type AdminView = "overview" | "applications" | "users";

const applications = [
  {
    id: "APP-092",
    name: "David Chen",
    expertise: "Database, AWS",
    status: "pending",
    date: "Oct 24, 2023",
  },
  {
    id: "APP-091",
    name: "Maria Rodriguez",
    expertise: "Frontend, React",
    status: "pending",
    date: "Oct 23, 2023",
  },
  {
    id: "APP-090",
    name: "James Wilson",
    expertise: "DevOps, CI/CD",
    status: "approved",
    date: "Oct 21, 2023",
  },
];

export default function AdminApp() {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [view, setView] = useState<AdminView>("overview");

  const handleLogout = async () => {
    navigate("/", { replace: true });
    await signOut();
  };

  return (
    <div className="flex min-h-screen bg-slate-100 font-sans">
      <aside className="flex w-64 flex-col border-r border-slate-300 bg-slate-900 text-slate-300">
        <div className="flex h-16 items-center border-b border-slate-800 px-6">
          <Settings className="mr-2 h-5 w-5 text-indigo-500" />
          <span className="font-bold tracking-tight text-white">
            Nexus Admin
          </span>
        </div>
        <div className="flex-1 space-y-1 p-4">
          <NavItem
            active={view === "overview"}
            icon={Activity}
            label="System Overview"
            onClick={() => setView("overview")}
          />
          <NavItem
            active={view === "applications"}
            icon={UserCheck}
            label="Resolver Apps"
            onClick={() => setView("applications")}
          />
          <NavItem
            active={view === "users"}
            icon={Users}
            label="User Management"
            onClick={() => setView("users")}
          />
          <NavItem active={false} icon={Shield} label="Resolver Directory" />
        </div>
        <div className="border-t border-slate-800 p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-900/80 text-lg font-semibold text-indigo-200">
                {getAdminInitials(profile?.name)}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">
                  {profile?.name || "Admin Team"}
                </p>
                <p className="truncate text-xs text-slate-400">System Access</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => void handleLogout()}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
              aria-label="Log out"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-auto p-8">
        {view === "overview" ? <OverviewView /> : null}
        {view === "applications" ? <ApplicationsView /> : null}
        {view === "users" ? <UserManagementView /> : null}
      </main>
    </div>
  );
}

function getAdminInitials(name: string | null | undefined) {
  if (!name) {
    return "AD";
  }

  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return "AD";
  }

  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
}

function NavItem({
  active,
  icon: Icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: typeof Activity;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
        active
          ? "bg-indigo-600 text-white"
          : "hover:bg-slate-800 hover:text-white"
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

function OverviewView() {
  return (
    <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
      {[
        { label: "Pending applications", value: "14" },
        { label: "Approved resolvers", value: "86" },
        { label: "Live tickets", value: "12" },
      ].map((item) => (
        <div
          key={item.label}
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <p className="text-sm text-slate-500">{item.label}</p>
          <p className="mt-3 text-3xl font-bold text-slate-950">{item.value}</p>
        </div>
      ))}
    </div>
  );
}

function ApplicationsView() {
  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">
          Resolver Applications
        </h1>
        <p className="mt-1 text-slate-600">
          Review and approve new experts joining the platform.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 font-medium text-slate-600">
            <tr>
              <th className="px-6 py-4">Applicant</th>
              <th className="px-6 py-4">Expertise</th>
              <th className="px-6 py-4">Applied Date</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {applications.map((application) => (
              <tr key={application.id} className="hover:bg-slate-50/50">
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-900">
                    {application.name}
                  </div>
                  <div className="text-xs text-slate-500">{application.id}</div>
                </td>
                <td className="px-6 py-4 text-slate-600">
                  {application.expertise}
                </td>
                <td className="px-6 py-4 text-slate-600">{application.date}</td>
                <td className="px-6 py-4">
                  <Badge
                    variant={
                      application.status === "pending" ? "warning" : "success"
                    }
                  >
                    {application.status.toUpperCase()}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-right">
                  {application.status === "pending" ? (
                    <Button variant="outline" className="h-8 px-3 text-xs">
                      Review
                    </Button>
                  ) : (
                    <span className="text-xs text-slate-400">Reviewed</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function UserManagementView() {
  const { accessToken } = useAuth();
  const [users, setUsers] = useState<AppProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) {
      setUsers([]);
      setIsLoading(false);
      setErrorMessage("Missing admin session token.");
      return;
    }

    let isMounted = true;

    const loadUsers = async () => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const data = await fetchAdminUsers(accessToken);
        if (!isMounted) {
          return;
        }

        setUsers(data);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setErrorMessage(
          error instanceof Error ? error.message : "Unable to load users.",
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadUsers();

    return () => {
      isMounted = false;
    };
  }, [accessToken]);

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
        <p className="mt-1 text-slate-600">
          Manage registered users and their platform access.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 font-medium text-slate-600">
            <tr>
              <th className="px-6 py-4">User Details</th>
              <th className="px-6 py-4">Join Date</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {isLoading ? (
              <tr>
                <td
                  colSpan={3}
                  className="px-6 py-8 text-center text-slate-500"
                >
                  Loading users...
                </td>
              </tr>
            ) : null}
            {!isLoading && errorMessage ? (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-red-600">
                  {errorMessage}
                </td>
              </tr>
            ) : null}
            {!isLoading && !errorMessage && users.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="px-6 py-8 text-center text-slate-500"
                >
                  No users found.
                </td>
              </tr>
            ) : null}
            {!isLoading && !errorMessage
              ? users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">
                        {user.name || "Unnamed user"}
                      </div>
                      <div className="text-xs text-slate-500">
                        {user.email || "No email"} • USR-{user.id}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {formatJoinDate(user.created_at)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                        aria-label={`Delete ${user.name || "user"}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function formatJoinDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(date);
}
