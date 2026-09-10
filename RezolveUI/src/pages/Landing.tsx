import { Link } from "react-router-dom";
import { Activity, ArrowRight, Clock, Shield, Zap } from "lucide-react";

import { Badge, Button } from "../components/UI";
import { useAuth } from "../context/AuthProvider";

const steps = [
  {
    icon: Zap,
    title: "Create one focused request",
    description:
      "Start a support request in minutes and stay focused on one active issue at a time, so getting help feels simple and clear.",
  },
  {
    icon: Clock,
    title: "Match in real time",
    description:
      "Experienced resolvers can step in quickly and give each request the attention it needs.",
  },
  {
    icon: Shield,
    title: "Continue in a private session",
    description:
      "Once you are matched, you move into a private space for messages, files, and live collaboration.",
  },
];

export default function Landing() {
  const { signOut, status, profile } = useAuth();
  const isSignedInUser = status === "authenticated" && profile?.role === "user";
  const isSignedInResolver =
    status === "authenticated" && profile?.role === "resolver";
  const isAuthenticated = status === "authenticated";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 shadow-sm shadow-indigo-600/20">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-[0.18em] text-indigo-600 uppercase">
                Rezolve
              </p>
              <p className="text-xs text-slate-500">Live support marketplace</p>
            </div>
          </div>

          <nav className="hidden items-center gap-6 md:flex">
            <a
              href="#how-it-works"
              className="text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              How it works
            </a>
            <Link
              to="/trust"
              className="text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              Trust & Safety
            </Link>
            <div className="ml-2 flex items-center gap-3 border-l border-slate-200 pl-4">
              {isAuthenticated ? null : (
                <Link
                  to="/login"
                  className="text-sm font-medium text-slate-600 hover:text-slate-900"
                >
                  Sign in
                </Link>
              )}
              {isAuthenticated ? (
                <Button onClick={() => void signOut()}>Logout</Button>
              ) : (
                <Link to="/signup">
                  <Button>Get started</Button>
                </Link>
              )}
            </div>
          </nav>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.18),_transparent_42%)]" />
          <div className="mx-auto max-w-6xl px-6 pb-24 pt-24">
            <div className="max-w-3xl">
              <Badge variant="brand" className="mb-6">
                Real-time support platform
              </Badge>
              <h1 className="text-5xl font-extrabold tracking-tight text-slate-950 md:text-6xl">
                Resolve urgent issues with vetted experts in one focused
                session.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                Get fast, trusted help from experienced specialists when
                critical problems hit. Start a request, connect with the right
                expert, and work together in a private session to reach
                resolution quickly.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                {isSignedInResolver ? (
                  <>
                    <Link to="/user">
                      <Button className="h-12 px-8 text-base shadow-lg shadow-indigo-600/20">
                        Start a request
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                    <Link to="/resolver">
                      <Button variant="outline" className="h-12 px-8 text-base">
                        Resolve a request
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to={isSignedInUser ? "/user" : "/signup"}>
                      <Button className="h-12 px-8 text-base shadow-lg shadow-indigo-600/20">
                        {isSignedInUser ? "Start a request" : "Create account"}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                    <Link to="/resolver">
                      <Button variant="outline" className="h-12 px-8 text-base">
                        Apply as resolver
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        <section
          id="how-it-works"
          className="border-y border-slate-200/70 bg-white py-24"
        >
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-14 max-w-2xl">
              <h2 className="text-3xl font-bold tracking-tight text-slate-950">
                Built for focused live support
              </h2>
              <p className="mt-3 text-slate-600">
                Fast-moving support feels better when the experience stays
                clear, calm, and easy to trust.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {steps.map((step) => (
                <article
                  key={step.title}
                  className="rounded-2xl border border-slate-200/70 bg-slate-50 p-6"
                >
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-white text-indigo-600">
                    <step.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {step.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          id="experience"
          className="mx-auto grid max-w-6xl gap-6 px-6 py-24 lg:grid-cols-[1.2fr,0.8fr]"
        >
          <div className="rounded-3xl border border-slate-200/70 bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-indigo-600">
              Platform rules
            </p>
            <ul className="mt-6 space-y-4 text-sm leading-6 text-slate-950">
              <li>Only registered users can create tickets.</li>
              <li>Only one active live ticket can exist per user at a time.</li>
              <li>
                Resolvers must apply and be approved before they can enter the
                live pool.
              </li>
              <li>Resolvers can claim only one active ticket at a time.</li>
              <li>
                Every claimed request moves into a private support session.
              </li>
            </ul>
          </div>

          <div className="rounded-3xl border border-slate-200/70 bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-indigo-600">
              What users get
            </p>
            <h3 className="mt-4 text-2xl font-bold text-slate-950">
              Live help, queue fallback, and a clear request history.
            </h3>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              The product supports live matching, offline queue continuation,
              secure session resumption, and a clear request history so nothing
              feels lost or ambiguous.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
