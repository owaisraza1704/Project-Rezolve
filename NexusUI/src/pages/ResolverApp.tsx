import type { ReactNode } from "react";
import { useState } from "react";
import {
  AlertTriangle,
  FileText,
  Filter,
  Lock,
  LogOut,
  Mic,
  MonitorUp,
  Paperclip,
  PhoneOff,
  Radio,
  Search,
  ShieldCheck,
  Video,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthProvider";
import { Badge, Button } from "../components/UI";

type ResolverStage = "pending" | "approved";
type ResolverView = "pool" | "active";

const resolverState = {
  stage: "pending" as ResolverStage,
  hasActiveClaim: true,
  liveTickets: [
    {
      id: "TKT-1042",
      title: "Kubernetes pods stuck in crash loop",
      category: "Infrastructure",
      urgency: "Critical",
      wait: "45s",
      reward: "3.5x",
    },
    {
      id: "TKT-1041",
      title: "Redis cache eviction issues",
      category: "Database",
      urgency: "High",
      wait: "2m 10s",
      reward: "2.0x",
    },
    {
      id: "TKT-1039",
      title: "Missing OAuth scopes for new clients",
      category: "Auth",
      urgency: "Medium",
      wait: "5m",
      reward: "1.0x",
    },
  ],
};

export default function ResolverApp() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [stage, setStage] = useState<ResolverStage>(resolverState.stage);
  const [view, setView] = useState<ResolverView>("pool");
  const isPending = stage === "pending";

  const handleLogout = async () => {
    navigate("/", { replace: true });
    await signOut();
  };

  return (
    <div className="flex min-h-screen bg-[#0F172A] font-sans text-slate-200">
      <aside className="flex w-64 shrink-0 flex-col border-r border-slate-800 bg-[#1E293B]">
        <Link
          to="/"
          className="flex h-16 items-center border-b border-slate-800 px-6"
        >
          <ShieldCheck className="mr-2 h-5 w-5 text-indigo-400" />
          <span className="font-bold tracking-tight text-slate-100">
            Nexus Ops
          </span>
        </Link>
        {isPending ? <LockedSidebar onLogout={handleLogout} /> : null}
        {!isPending ? (
          <>
            <div className="flex-1 space-y-1 p-4">
              <NavItem
                active={view === "pool"}
                icon={Radio}
                label="Live Board"
                onClick={() => setView("pool")}
              />
              <NavItem
                active={view === "active"}
                icon={FileText}
                label="Active Session"
                onClick={() => setView("active")}
              />
            </div>
            <div className="border-t border-slate-800 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`h-2 w-2 rounded-full ${stage === "approved" ? "bg-emerald-500 animate-pulse" : "bg-slate-600"}`}
                  />
                  <span className="text-sm font-medium text-slate-300">
                    {stage === "approved"
                      ? "Available (Level 3)"
                      : "Pending approval"}
                  </span>
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
          </>
        ) : null}
      </aside>

      <main className="flex flex-1 flex-col overflow-hidden bg-[#0F172A]">
        {stage === "pending" ? (
          <PendingReviewView onSubmit={() => setStage("approved")} />
        ) : null}
        {stage === "approved" && view === "pool" ? (
          <LivePoolView onOpenSession={() => setView("active")} />
        ) : null}
        {stage === "approved" && view === "active" ? (
          <ResolverSessionView onBack={() => setView("pool")} />
        ) : null}
      </main>
    </div>
  );
}

function LockedSidebar({ onLogout }: { onLogout: () => Promise<void> }) {
  return (
    <>
      <div className="relative flex-1 p-4">
        <div className="space-y-1 opacity-35 blur-[1.5px]">
          <LockedNavItem icon={Radio} label="Live Board" />
          <LockedNavItem icon={FileText} label="My Assignments" />
        </div>

        <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#1E293B]/80 p-4 text-center backdrop-blur-[2px]">
          <Lock className="mb-3 h-8 w-8 text-slate-500" />
          <p className="text-sm font-medium text-slate-400">
            Dashboard locked pending approval.
          </p>
        </div>
      </div>

      <div className="border-t border-slate-800 p-4">
        <div className="flex items-center justify-between gap-3 text-slate-400">
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-slate-600" />
            <span className="text-sm font-medium">Offline</span>
          </div>
          <button
            type="button"
            onClick={() => void onLogout()}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
            aria-label="Log out"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </>
  );
}

function LockedNavItem({
  icon: Icon,
  label,
}: {
  icon: typeof Radio;
  label: string;
}) {
  return (
    <div className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-400">
      <Icon className="h-4 w-4" />
      {label}
    </div>
  );
}

function NavItem({
  active,
  icon: Icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: typeof Radio;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
        active
          ? "bg-indigo-500/20 text-indigo-400"
          : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

function PendingReviewView({ onSubmit }: { onSubmit: () => void }) {
  return (
    <div className="flex flex-1 items-center justify-center p-8">
      <div className="w-full max-w-4xl rounded-2xl border border-slate-700/60 bg-[#1E293B] p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-indigo-500/20 bg-indigo-500/10">
            <FileText className="h-8 w-8 text-indigo-400" />
          </div>
          <h1 className="mb-3 text-2xl font-bold text-white">
            Apply as a Resolver
          </h1>
          <p className="mx-auto max-w-xl text-slate-400">
            Share your experience and areas of expertise. Our team reviews every
            application before unlocking the resolver workspace.
          </p>
        </div>

        <form
          className="space-y-5"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit();
          }}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <ResolverField label="Full name" type="text" />
            <ResolverSelect
              label="Primary expertise"
              options={[
                "Infrastructure & Cloud",
                "Database & Storage",
                "Frontend & UX",
                "Backend & API",
              ]}
            />
          </div>

          <ResolverField label="Professional profile or portfolio" type="url" />

          <ResolverTextarea
            label="Tell us about your experience"
            placeholder="Share the kind of problems you solve best and the environments you work in most often."
          />

          <ResolverTextarea
            label="Why do you want to join Project Nexus?"
            placeholder="Tell us how you like to help users and what kind of support work you enjoy."
          />

          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
            Applications are manually reviewed. Resolver tools stay locked until
            approval.
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              className="bg-indigo-600 px-6 shadow-lg shadow-indigo-500/20 hover:bg-indigo-500"
            >
              Submit application
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ResolverField({ label, type }: { label: string; type: string }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-300">
        {label}
      </label>
      <input
        type={type}
        className="w-full rounded-lg border border-slate-700 bg-[#0F172A] px-4 py-2.5 text-slate-200 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
      />
    </div>
  );
}

function ResolverSelect({
  label,
  options,
}: {
  label: string;
  options: string[];
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-300">
        {label}
      </label>
      <select className="w-full rounded-lg border border-slate-700 bg-[#0F172A] px-4 py-2.5 text-slate-200 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500">
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </div>
  );
}

function ResolverTextarea({
  label,
  placeholder,
}: {
  label: string;
  placeholder: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-300">
        {label}
      </label>
      <textarea
        rows={4}
        placeholder={placeholder}
        className="w-full resize-none rounded-lg border border-slate-700 bg-[#0F172A] px-4 py-2.5 text-slate-200 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
      />
    </div>
  );
}

function LivePoolView({ onOpenSession }: { onOpenSession: () => void }) {
  return (
    <div className="flex flex-1 flex-col overflow-auto p-8">
      {resolverState.hasActiveClaim ? (
        <div className="mb-6 flex items-center justify-between border-b border-indigo-500/20 bg-indigo-500/10 px-6 py-3">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-indigo-400" />
            <div>
              <p className="text-sm font-semibold text-indigo-300">
                You already have an active claimed ticket.
              </p>
              <p className="text-xs text-indigo-400/80">
                Claim actions stay disabled until the active session is
                resolved.
              </p>
            </div>
          </div>
          <Button
            onClick={onOpenSession}
            className="h-8 bg-indigo-600 px-4 text-xs shadow-lg shadow-indigo-500/20 hover:bg-indigo-500"
          >
            Go to Session
          </Button>
        </div>
      ) : null}

      <div className="mx-auto w-full max-w-6xl">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="flex items-center gap-3 text-2xl font-bold text-white">
              Live Routing Pool
              <span className="rounded border border-indigo-500/30 bg-indigo-500/20 px-2 py-0.5 text-xs text-indigo-400">
                12 Active
              </span>
            </h1>
            <p className="mt-1 text-slate-400">
              Real-time incoming requests matching your expertise.
            </p>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search pool..."
                className="rounded-lg border border-slate-700 bg-[#1E293B] py-2 pl-9 pr-4 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <Button
              variant="outline"
              className="border-slate-700 bg-[#1E293B] text-slate-300 hover:bg-slate-800"
            >
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>
        </header>

        <div className="grid gap-4">
          {resolverState.liveTickets.map((ticket) => (
            <article
              key={ticket.id}
              className={`rounded-xl border bg-[#1E293B] p-5 transition-colors ${
                resolverState.hasActiveClaim
                  ? "border-slate-800 opacity-60"
                  : "border-slate-700/60 hover:border-indigo-500/50"
              }`}
            >
              <div className="flex items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg border border-slate-700 bg-slate-800">
                    <span className="text-xs font-bold text-slate-300">
                      {ticket.reward}
                    </span>
                    <span className="text-[10px] uppercase text-slate-500">
                      Multi
                    </span>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-slate-100">
                      {ticket.title}
                    </h3>
                    <div className="mt-1 flex items-center gap-3 text-xs text-slate-400">
                      <span>{ticket.id}</span>
                      <span>•</span>
                      <span className="text-slate-300">{ticket.category}</span>
                      <span>•</span>
                      <span>
                        Waiting:{" "}
                        <span className="font-medium text-amber-400">
                          {ticket.wait}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <Badge
                    variant={
                      ticket.urgency === "Critical" ? "warning" : "neutral"
                    }
                    className={
                      ticket.urgency === "Critical"
                        ? "border-red-500/20 bg-red-500/10 text-red-400"
                        : "border-slate-700 bg-slate-800 text-slate-400"
                    }
                  >
                    {ticket.urgency.toUpperCase()}
                  </Badge>
                  <Button
                    disabled={resolverState.hasActiveClaim}
                    className="min-w-28"
                  >
                    Claim Ticket
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

function ResolverSessionView({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex flex-1 flex-col">
      <header className="flex h-16 items-center justify-between border-b border-slate-800 bg-[#1E293B] px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="text-slate-400 hover:text-slate-200"
          >
            <ArrowLeftIcon />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <Badge
                className="border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                variant="success"
              >
                ACTIVE SESSION
              </Badge>
              <h2 className="text-sm font-bold text-white">
                Kubernetes pods stuck in crash loop
              </h2>
            </div>
            <p className="mt-0.5 text-xs text-slate-400">
              TKT-1042 • Connected to Alex Lee
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center rounded-lg border border-slate-700 bg-[#0F172A] p-1">
            <ResolverToolButton icon={Video} label="Toggle camera" />
            <ResolverToolButton icon={Mic} label="Toggle microphone" />
            <ResolverToolButton icon={MonitorUp} label="Share screen" />
          </div>
          <Button
            variant="outline"
            className="h-9 border-red-500/20 bg-transparent text-red-400 hover:bg-red-500/10 hover:text-red-300"
          >
            <PhoneOff className="mr-2 h-4 w-4" />
            End Session
          </Button>
        </div>
      </header>

      <div className="flex-1 overflow-auto bg-[#0F172A] p-6">
        <div className="mx-auto max-w-4xl space-y-6">
          <div className="mb-8 flex items-center justify-center">
            <Badge
              className="border-slate-700 bg-[#1E293B] text-slate-300"
              variant="neutral"
            >
              Session connected • 11:04 AM
            </Badge>
          </div>
          <ResolverMessage initials="AL" tone="user">
            Our production cluster has been restarting the same pods for the
            last 30 minutes.
          </ResolverMessage>
          <ResolverMessage initials="RJ" tone="resolver">
            Understood. Please send the latest deployment manifest and I will
            compare it with the prior revision.
          </ResolverMessage>
        </div>
      </div>

      <footer className="border-t border-slate-800 bg-[#1E293B] p-4">
        <div className="mx-auto flex max-w-4xl items-end gap-3">
          <button className="rounded-xl border border-slate-700 bg-[#0F172A] p-3 text-slate-400 transition-colors hover:text-indigo-300">
            <Paperclip className="h-4 w-4" />
          </button>
          <textarea
            rows={1}
            placeholder="Reply to the user..."
            className="max-h-40 min-h-[52px] flex-1 resize-y rounded-2xl border border-slate-700 bg-[#0F172A] px-4 py-3 text-sm text-slate-100 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
          />
          <Button className="h-[52px] px-5">Send</Button>
        </div>
      </footer>
    </div>
  );
}

function ResolverToolButton({
  icon: Icon,
  label,
}: {
  icon: typeof Video;
  label: string;
}) {
  return (
    <button
      className="rounded-md p-2 text-slate-400 transition-all hover:bg-[#1E293B] hover:text-slate-100"
      title={label}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}

function ResolverMessage({
  initials,
  tone,
  children,
}: {
  initials: string;
  tone: "resolver" | "user";
  children: ReactNode;
}) {
  const isResolver = tone === "resolver";

  return (
    <div className={`flex gap-4 ${isResolver ? "flex-row-reverse" : ""}`}>
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${isResolver ? "bg-indigo-100 text-indigo-700" : "bg-slate-700 text-slate-200"}`}
      >
        {initials}
      </div>
      <div
        className={`max-w-xl rounded-2xl p-4 text-sm shadow-sm ${
          isResolver
            ? "rounded-tr-none bg-indigo-600 text-white"
            : "rounded-tl-none border border-slate-800 bg-[#1E293B] text-slate-200"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

function ArrowLeftIcon() {
  return <span className="text-lg leading-none">‹</span>;
}
