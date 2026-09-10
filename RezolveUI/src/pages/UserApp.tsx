import type { ReactNode } from "react";
import { useState } from "react";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  History,
  Lock,
  LogOut,
  MessageSquare,
  Mic,
  MonitorUp,
  Paperclip,
  PhoneOff,
  Plus,
  Shield,
  Video,
  Activity,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthProvider";
import { Badge, Button, Card } from "../components/UI";

type UserView = "dashboard" | "create" | "session";

const userState = {
  hasActiveTicket: true,
  activeTicket: {
    id: "TKT-992",
    title: "Database connection timeout on production",
    resolver: "Sarah J.",
    time: "10m ago",
  },
  history: [
    {
      id: "TKT-841",
      title: "Cannot access billing dashboard",
      status: "queued",
      resolver: null,
      time: "2h ago",
    },
    {
      id: "TKT-750",
      title: "Need help configuring SSO",
      status: "resolved",
      resolver: "Mike T.",
      time: "1d ago",
    },
    {
      id: "TKT-612",
      title: "Route 53 DNS propagation issues",
      status: "closed",
      resolver: "Emma W.",
      time: "5d ago",
    },
  ],
};

export default function UserApp() {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [view, setView] = useState<UserView>("dashboard");

  const handleLogout = async () => {
    navigate("/", { replace: true });
    await signOut();
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <aside className="flex w-64 shrink-0 flex-col border-r border-slate-200/60 bg-white">
        <div className="flex h-16 items-center border-b border-slate-200/60 px-6">
          <Link
            to="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            title="Back to Home"
          >
            <Activity className="w-5 h-5 text-indigo-600" />
            <span className="font-bold text-slate-900 tracking-tight">
              Rezolve User
            </span>
          </Link>
        </div>
        <div className="flex-1 space-y-1 p-4">
          <NavItem
            active={view === "dashboard"}
            icon={History}
            label="Request History"
            onClick={() => setView("dashboard")}
          />
          <NavItem
            active={view === "create"}
            icon={userState.hasActiveTicket ? Lock : Plus}
            label="New Request"
            onClick={() => setView("create")}
          />
        </div>
        <div className="border-t border-slate-200/60 p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
                {getUserInitials(profile?.name)}
              </div>
              <div className="min-w-0 text-sm">
                <p className="truncate font-medium text-slate-900">
                  {profile?.name || "Rezolve User"}
                </p>
                <p className="truncate text-xs text-slate-500">
                  {profile?.email || "Signed-in user"}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => void handleLogout()}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-900"
              aria-label="Log out"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </aside>

      <main className="flex h-screen flex-1 flex-col overflow-hidden">
        {view === "dashboard" && (
          <DashboardView onOpenSession={() => setView("session")} />
        )}
        {view === "create" && (
          <CreateTicketView onBackToSession={() => setView("session")} />
        )}
        {view === "session" && (
          <SessionView onBack={() => setView("dashboard")} />
        )}
      </main>
    </div>
  );
}

function getUserInitials(name: string | null | undefined) {
  if (!name) {
    return "NU";
  }

  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return "NU";
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
  icon: typeof History;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
        active
          ? "bg-indigo-50 text-indigo-700"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

function DashboardView({ onOpenSession }: { onOpenSession: () => void }) {
  return (
    <div className="flex-1 overflow-auto bg-slate-50 p-8">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Request History</h1>
          <p className="mt-1 text-slate-500">
            Manage your active sessions and past resolutions.
          </p>
        </header>

        {userState.hasActiveTicket && (
          <section className="mb-10">
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-900">
              Active Session
            </h2>
            <Card className="cursor-pointer border-indigo-200 ring-1 ring-indigo-500/10 transition-shadow hover:shadow-md">
              <div
                className="flex items-center justify-between bg-indigo-50/30 p-5"
                onClick={onOpenSession}
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="flex items-center gap-2 text-base font-semibold text-slate-900">
                      {userState.activeTicket.title}
                      <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    </h3>
                    <div className="mt-1 flex items-center gap-3 text-sm text-slate-600">
                      <span className="font-medium text-slate-900">
                        {userState.activeTicket.id}
                      </span>
                      <span>•</span>
                      <span>
                        Assigned to{" "}
                        <span className="font-medium text-indigo-700">
                          {userState.activeTicket.resolver}
                        </span>
                      </span>
                      <span>•</span>
                      <span>Started {userState.activeTicket.time}</span>
                    </div>
                  </div>
                </div>
                <Button className="h-9 bg-indigo-600 text-white shadow-sm hover:bg-indigo-700">
                  Resume Session
                </Button>
              </div>
            </Card>
          </section>
        )}

        <section>
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-900">
            Past & Queued
          </h2>
          <div className="space-y-3">
            {userState.history.map((ticket) => (
              <Card
                key={ticket.id}
                className="transition-shadow hover:shadow-sm"
              >
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full ${
                        ticket.status === "queued"
                          ? "bg-amber-100 text-amber-600"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {ticket.status === "queued" ? (
                        <Clock className="h-5 w-5" />
                      ) : (
                        <CheckCircle2 className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">
                        {ticket.title}
                      </h3>
                      <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
                        <span>{ticket.id}</span>
                        <span>•</span>
                        <span>{ticket.time}</span>
                        {ticket.resolver && (
                          <>
                            <span>•</span>
                            <span>Resolved by {ticket.resolver}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge
                      variant={
                        ticket.status === "queued" ? "warning" : "neutral"
                      }
                    >
                      {ticket.status === "queued"
                        ? "OFFLINE QUEUED"
                        : ticket.status.toUpperCase()}
                    </Badge>
                    <ChevronRight className="h-5 w-5 text-slate-300" />
                  </div>
                </div>
                {ticket.status === "queued" && (
                  <div className="flex items-start gap-3 border-t border-amber-100 bg-amber-50/50 px-4 py-3">
                    <Shield className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                    <p className="text-xs leading-relaxed text-amber-800">
                      <strong>Safely queued:</strong> this request missed the
                      live routing window and has moved to the offline queue.
                    </p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function CreateTicketView({
  onBackToSession,
}: {
  onBackToSession: () => void;
}) {
  if (userState.hasActiveTicket) {
    return (
      <div className="flex flex-1 items-center justify-center overflow-auto bg-slate-50 p-8">
        <div className="w-full max-w-md rounded-2xl border border-slate-200/60 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
            <Lock className="h-8 w-8 text-slate-600" />
          </div>
          <h1 className="mb-3 text-2xl font-bold text-slate-900">
            Active Session in Progress
          </h1>
          <p className="mb-8 leading-relaxed text-slate-600">
            Users are limited to one active live ticket at a time. Resolve or
            close the current session before opening another request.
          </p>
          <Button onClick={onBackToSession} className="w-full">
            Return to Active Session
          </Button>
        </div>
      </div>
    );
  }

  return <div className="flex-1 overflow-auto bg-slate-50 p-8" />;
}

function SessionView({ onBack }: { onBack: () => void }) {
  return (
    <div className="relative flex flex-1 flex-col bg-white">
      <header className="z-10 flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="text-slate-400 hover:text-slate-600"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <Badge
                variant="success"
                className="bg-emerald-100 text-emerald-700 border-emerald-200"
              >
                LIVE SESSION
              </Badge>
              <h2 className="text-sm font-bold text-slate-900">
                {userState.activeTicket.title}
              </h2>
            </div>
            <p className="mt-0.5 text-xs text-slate-500">
              {userState.activeTicket.id} • Connected to{" "}
              {userState.activeTicket.resolver}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center rounded-lg border border-slate-200 bg-slate-100 p-1">
            <ToolButton icon={Video} label="Toggle camera" />
            <ToolButton icon={Mic} label="Toggle microphone" />
            <ToolButton icon={MonitorUp} label="Share screen" />
          </div>
          <Button
            variant="outline"
            className="h-9 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <PhoneOff className="mr-2 h-4 w-4" />
            End Session
          </Button>
        </div>
      </header>

      <div className="flex-1 overflow-auto bg-slate-50/50 p-6">
        <div className="mx-auto max-w-4xl space-y-6">
          <div className="mb-8 flex items-center justify-center">
            <Badge variant="neutral" className="bg-white">
              Secure connection established • 10:42 AM
            </Badge>
          </div>

          <MessageBubble initials="SJ" tone="agent">
            Hi Alex, I can see the DB timeout spike. Can you confirm the cluster
            region and recent deploy time?
          </MessageBubble>

          <MessageBubble initials="AL" tone="user">
            We are in us-east-1 and the issue started about 15 minutes after the
            last deploy.
          </MessageBubble>
        </div>
      </div>

      <footer className="border-t border-slate-200 bg-white p-4">
        <div className="mx-auto flex max-w-4xl items-end gap-3">
          <button className="shrink-0 rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-400 transition-colors hover:text-indigo-600">
            <Paperclip className="h-4 w-4" />
          </button>
          <textarea
            rows={1}
            placeholder="Message your resolver..."
            className="max-h-40 min-h-[52px] flex-1 resize-y rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
          />
          <Button className="h-[52px] px-5">Send</Button>
        </div>
      </footer>
    </div>
  );
}

function ToolButton({
  icon: Icon,
  label,
}: {
  icon: typeof Video;
  label: string;
}) {
  return (
    <button
      className="rounded-md p-2 text-slate-500 transition-all hover:bg-white hover:text-slate-900 hover:shadow-sm"
      title={label}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}

function MessageBubble({
  initials,
  tone,
  children,
}: {
  initials: string;
  tone: "agent" | "user";
  children: ReactNode;
}) {
  const isUser = tone === "user";

  return (
    <div className={`flex gap-4 ${isUser ? "flex-row-reverse" : ""}`}>
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
          isUser
            ? "bg-indigo-100 text-indigo-700"
            : "bg-slate-200 text-slate-600"
        }`}
      >
        {initials}
      </div>
      <div
        className={`max-w-xl rounded-2xl p-4 text-sm shadow-sm ${
          isUser
            ? "rounded-tr-none bg-indigo-600 text-white"
            : "rounded-tl-none border border-slate-200 bg-white text-slate-800"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
