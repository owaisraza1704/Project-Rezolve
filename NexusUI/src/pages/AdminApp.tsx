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
import {
  approveAdminResolverApplication,
  fetchAdminResolverApplications,
  fetchAdminResolvers,
  fetchAdminUsers,
  rejectAdminResolverApplication,
} from "../services/auth/adminClient";
import type { ResolverApplicationRecord } from "../services/auth/resolverApplications";
import type { AppProfile } from "../types/auth";

type AdminView = "overview" | "applications" | "users" | "resolvers";

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
          <NavItem
            active={view === "resolvers"}
            icon={Shield}
            label="Resolver Directory"
            onClick={() => setView("resolvers")}
          />
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
        {view === "resolvers" ? <ResolversManagementView /> : null}
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
  const { accessToken } = useAuth();
  const [tab, setTab] = useState<"pending" | "history">("pending");
  const [apps, setApps] = useState<ResolverApplicationRecord[]>([]);
  const [profilesById, setProfilesById] = useState<Record<number, AppProfile>>(
    {},
  );
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeActionId, setActiveActionId] = useState<number | null>(null);

  useEffect(() => {
    if (!accessToken) {
      setApps([]);
      setProfilesById({});
      setIsLoading(false);
      setErrorMessage("Missing admin session token.");
      return;
    }

    let isMounted = true;

    const loadApplications = async () => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const [applications, users, resolvers] = await Promise.all([
          fetchAdminResolverApplications(accessToken),
          fetchAdminUsers(accessToken),
          fetchAdminResolvers(accessToken),
        ]);

        if (!isMounted) {
          return;
        }

        const combinedProfiles = [...users, ...resolvers].reduce<
          Record<number, AppProfile>
        >((accumulator, profile) => {
          accumulator[profile.id] = profile;
          return accumulator;
        }, {});

        setApps(applications);
        setProfilesById(combinedProfiles);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to load resolver applications.",
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadApplications();

    return () => {
      isMounted = false;
    };
  }, [accessToken]);

  const filteredApps = apps.filter((app) =>
    tab === "pending" ? app.status === "pending" : app.status !== "pending",
  );

  const handleReviewAction = async (
    applicationId: number,
    action: "approve" | "reject",
  ) => {
    if (!accessToken) {
      setErrorMessage("Missing admin session token.");
      return;
    }

    setActiveActionId(applicationId);
    setErrorMessage(null);

    try {
      const updatedApplication =
        action === "approve"
          ? await approveAdminResolverApplication(accessToken, applicationId)
          : await rejectAdminResolverApplication(accessToken, applicationId);

      setApps((current) =>
        current.map((app) =>
          app.id === applicationId ? updatedApplication : app,
        ),
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : `Unable to ${action} resolver application.`,
      );
    } finally {
      setActiveActionId(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          Resolver Applications
        </h1>
        <p className="text-slate-600 mt-1">
          Review and approve new experts joining the platform.
        </p>
      </div>

      <div className="flex gap-6 border-b border-slate-200 mb-6">
        <button
          onClick={() => setTab("pending")}
          className={`pb-3 text-sm font-medium border-b-2 transition-colors ${tab === "pending" ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-800"}`}
        >
          Pending Review
          <Badge variant="warning" className="ml-2 bg-amber-100 text-amber-700">
            {apps.filter((a) => a.status === "pending").length}
          </Badge>
        </button>
        <button
          onClick={() => setTab("history")}
          className={`pb-3 text-sm font-medium border-b-2 transition-colors ${tab === "history" ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-800"}`}
        >
          Processed History
        </button>
      </div>

      {errorMessage ? (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      ) : null}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
            <tr>
              <th className="px-6 py-4">Applicant</th>
              <th className="px-6 py-4">Expertise</th>
              <th className="px-6 py-4">Applied Date</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {isLoading ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-12 text-center text-slate-500"
                >
                  Loading applications...
                </td>
              </tr>
            ) : null}
            {!isLoading && filteredApps.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-12 text-center text-slate-500"
                >
                  No applications found in this view.
                </td>
              </tr>
            ) : (
              filteredApps.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">
                      {profilesById[app.profile_id]?.name ||
                        "Unknown applicant"}
                    </div>
                    <div className="text-xs text-slate-500">
                      {`APP-${String(app.id).padStart(3, "0")}`}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {app.skills || "Not provided"}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {formatJoinDate(app.created_at)}
                  </td>
                  <td className="px-6 py-4">
                    <Badge
                      variant={
                        app.status === "pending"
                          ? "warning"
                          : app.status === "approved"
                            ? "success"
                            : "neutral"
                      }
                    >
                      {app.status.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {app.status === "pending" ? (
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          disabled={activeActionId === app.id}
                          onClick={() =>
                            void handleReviewAction(app.id, "reject")
                          }
                          className="h-8 px-3 text-xs border-red-200 text-red-600 hover:bg-red-50"
                        >
                          {activeActionId === app.id ? "Working..." : "Reject"}
                        </Button>
                        <Button
                          disabled={activeActionId === app.id}
                          onClick={() =>
                            void handleReviewAction(app.id, "approve")
                          }
                          className="h-8 px-3 text-xs bg-emerald-600 hover:bg-emerald-500 text-white border-0"
                        >
                          {activeActionId === app.id ? "Working..." : "Approve"}
                        </Button>
                      </div>
                    ) : (
                      <span className="text-slate-400 text-xs">Reviewed</span>
                    )}
                  </td>
                </tr>
              ))
            )}
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

function ResolversManagementView() {
  const { accessToken } = useAuth();
  const [resolvers, setResolvers] = useState<AppProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) {
      setResolvers([]);
      setIsLoading(false);
      setErrorMessage("Missing admin session token.");
      return;
    }

    let isMounted = true;

    const loadResolvers = async () => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const data = await fetchAdminResolvers(accessToken);
        if (!isMounted) {
          return;
        }

        setResolvers(data);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setErrorMessage(
          error instanceof Error ? error.message : "Unable to load resolvers.",
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadResolvers();

    return () => {
      isMounted = false;
    };
  }, [accessToken]);

  return (
    <div className="max-w-5xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">
          Resolver Directory
        </h1>
        <p className="text-slate-600 mt-1">
          Manage approved experts on the platform.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
            <tr>
              <th className="px-6 py-4">Resolver Details</th>
              <th className="px-6 py-4">Approval Status</th>
              <th className="px-6 py-4">Joined</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {isLoading ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                  Loading resolvers...
                </td>
              </tr>
            ) : null}
            {!isLoading && errorMessage ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-red-600">
                  {errorMessage}
                </td>
              </tr>
            ) : null}
            {!isLoading && !errorMessage && resolvers.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                  No resolvers found.
                </td>
              </tr>
            ) : null}
            {!isLoading && !errorMessage
              ? resolvers.map((resolver) => (
                  <tr
                    key={resolver.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
                          {getAdminInitials(resolver.name)}
                        </div>
                        <div>
                          <div className="font-medium text-slate-900">
                            {resolver.name || "Unnamed resolver"}
                          </div>
                          <div className="text-xs text-slate-500">
                            {resolver.email || "No email"} • RSL-{resolver.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="success">APPROVED</Badge>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-700">
                      {formatJoinDate(resolver.created_at)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        disabled
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-300"
                        title="Resolver removal is not wired yet"
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
