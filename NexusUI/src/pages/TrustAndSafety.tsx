import { Shield, Lock, CheckCircle, FileText, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/UI';

export default function TrustAndSafety() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <header className="px-6 h-16 flex items-center justify-between border-b border-slate-200/60 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-slate-900 text-lg tracking-tight">Project Nexus</span>
        </Link>
        <nav className="flex items-center gap-6">
          <Link to="/" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Home</Link>
          <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
            <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Sign In</Link>
            <Link to="/user">
              <Button>Get Help Now</Button>
            </Link>
          </div>
        </nav>
      </header>

      <main className="flex-1">
        <section className="bg-slate-900 text-white py-24 px-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-900 to-slate-900"></div>
          <div className="max-w-4xl mx-auto relative z-10 text-center">
            <div className="w-16 h-16 bg-indigo-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-indigo-500/30">
              <Shield className="w-8 h-8 text-indigo-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">Trust & Safety at Nexus</h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Our platform operates on speed, expertise, and absolute security. Learn how we protect your data and thoroughly vet our global network of resolvers.
            </p>
          </div>
        </section>

        <section className="py-20 px-6 max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Rigorous Resolver Vetting</h3>
              </div>
              <p className="text-slate-600 leading-relaxed mb-6">
                Every resolver on Project Nexus passes through a strict manual review process by our operations team. We verify professional credentials, conduct technical assessments, and continuously monitor resolution quality ratings.
              </p>
              <ul className="space-y-3">
                {['Identity and background verification', 'Technical portfolio and credential review', 'Mandatory onboarding and code of conduct', 'Continuous quality monitoring'].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-700 font-medium">
                    <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-indigo-100 text-indigo-700 rounded-xl flex items-center justify-center">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Secure Matched Sessions</h3>
              </div>
              <p className="text-slate-600 leading-relaxed mb-6">
                When you connect with a resolver, you enter an isolated, encrypted secure room. Audio, video, and text communications are fully encrypted in transit and at rest.
              </p>
              <ul className="space-y-3">
                {['End-to-end encryption for all sessions', 'No permanent storage of shared screen recordings', 'Strict data access control policies', 'Automated redacting of sensitive credentials'].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-700 font-medium">
                    <CheckCircle className="w-5 h-5 text-indigo-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-white py-20 px-6 border-y border-slate-200">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Platform Guarantees</h2>
            <div className="grid sm:grid-cols-2 gap-8 text-left mt-12">
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <FileText className="w-8 h-8 text-slate-700 mb-4" />
                <h4 className="text-lg font-bold text-slate-900 mb-2">Dispute Resolution</h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  If an issue remains unresolved or you are dissatisfied with a session, our admin oversight team steps in to review the interaction logs and ensure a fair resolution or immediate refund.
                </p>
              </div>
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <Shield className="w-8 h-8 text-slate-700 mb-4" />
                <h4 className="text-lg font-bold text-slate-900 mb-2">Zero Tolerance Policy</h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  We enforce a strict zero-tolerance policy against unprofessional behavior, data mishandling, or harassment. Violations result in immediate, permanent removal from the platform.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
