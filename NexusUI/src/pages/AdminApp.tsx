import { useState } from 'react'
import { Activity, Settings, UserCheck, Users } from 'lucide-react'

import { Badge, Button } from '../components/UI'

type AdminView = 'overview' | 'applications'

const applications = [
  { id: 'APP-092', name: 'David Chen', expertise: 'Database, AWS', status: 'pending', date: 'Oct 24, 2023' },
  { id: 'APP-091', name: 'Maria Rodriguez', expertise: 'Frontend, React', status: 'pending', date: 'Oct 23, 2023' },
  { id: 'APP-090', name: 'James Wilson', expertise: 'DevOps, CI/CD', status: 'approved', date: 'Oct 21, 2023' },
]

export default function AdminApp() {
  const [view, setView] = useState<AdminView>('applications')

  return (
    <div className="flex min-h-screen bg-slate-100 font-sans">
      <aside className="flex w-64 flex-col border-r border-slate-300 bg-slate-900 text-slate-300">
        <div className="flex h-16 items-center border-b border-slate-800 px-6">
          <Settings className="mr-2 h-5 w-5 text-indigo-500" />
          <span className="font-bold tracking-tight text-white">Nexus Admin</span>
        </div>
        <div className="flex-1 space-y-1 p-4">
          <NavItem active={view === 'overview'} icon={Activity} label="System Overview" onClick={() => setView('overview')} />
          <NavItem active={view === 'applications'} icon={UserCheck} label="Resolver Apps" onClick={() => setView('applications')} />
          <NavItem active={false} icon={Users} label="User Management" />
        </div>
      </aside>

      <main className="flex-1 overflow-auto p-8">
        {view === 'overview' ? <OverviewView /> : <ApplicationsView />}
      </main>
    </div>
  )
}

function NavItem({
  active,
  icon: Icon,
  label,
  onClick,
}: {
  active: boolean
  icon: typeof Activity
  label: string
  onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
        active ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 hover:text-white'
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  )
}

function OverviewView() {
  return (
    <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
      {[
        { label: 'Pending applications', value: '14' },
        { label: 'Approved resolvers', value: '86' },
        { label: 'Live tickets', value: '12' },
      ].map((item) => (
        <div key={item.label} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">{item.label}</p>
          <p className="mt-3 text-3xl font-bold text-slate-950">{item.value}</p>
        </div>
      ))}
    </div>
  )
}

function ApplicationsView() {
  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Resolver Applications</h1>
        <p className="mt-1 text-slate-600">Review and approve new experts joining the platform.</p>
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
                  <div className="font-medium text-slate-900">{application.name}</div>
                  <div className="text-xs text-slate-500">{application.id}</div>
                </td>
                <td className="px-6 py-4 text-slate-600">{application.expertise}</td>
                <td className="px-6 py-4 text-slate-600">{application.date}</td>
                <td className="px-6 py-4">
                  <Badge variant={application.status === 'pending' ? 'warning' : 'success'}>
                    {application.status.toUpperCase()}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-right">
                  {application.status === 'pending' ? (
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
  )
}
