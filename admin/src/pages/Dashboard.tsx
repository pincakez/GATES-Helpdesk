import { PageWrapper } from '../components/layout/PageWrapper';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Ticket, Users, Clock, AlertTriangle } from 'lucide-react';

const data = [
  { name: 'Mon', tickets: 400, resolved: 240 },
  { name: 'Tue', tickets: 300, resolved: 139 },
  { name: 'Wed', tickets: 200, resolved: 980 },
  { name: 'Thu', tickets: 278, resolved: 390 },
  { name: 'Fri', tickets: 189, resolved: 480 },
  { name: 'Sat', tickets: 239, resolved: 380 },
  { name: 'Sun', tickets: 349, resolved: 430 },
];

export default function Dashboard() {
  return (
    <PageWrapper title="Overview" description="Helpdesk metrics and performance over the last 7 days.">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Tickets" value="2,845" trend="+12.5%" icon={Ticket} type="neutral" />
        <StatCard title="Open Urgent" value="14" trend="-2.4%" icon={AlertTriangle} type="danger" />
        <StatCard title="Avg. Resolution Time" value="4h 12m" trend="-18.2%" icon={Clock} type="success" />
        <StatCard title="Active Agents" value="24" trend="0%" icon={Users} type="neutral" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-96">
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 flex flex-col">
          <h3 className="font-medium text-sm text-neutral-300 mb-4">Ticket Volume vs Resolved</h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="name" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }}
                  itemStyle={{ fontSize: '14px' }}
                />
                <Line type="monotone" dataKey="tickets" stroke="#3b82f6" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="resolved" stroke="#10b981" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 flex flex-col">
          <h3 className="font-medium text-sm text-neutral-300 mb-4">Customer Satisfaction</h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="name" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: '#27272a', opacity: 0.4 }}
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }}
                />
                <Bar dataKey="resolved" fill="#1D643B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

function StatCard({ title, value, trend, icon: Icon, type }: { title: string; value: string; trend: string; icon: any; type: 'success' | 'danger' | 'neutral' }) {
  const isPositive = trend.startsWith('+');
  const isZero = trend === '0%';
  
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 flex items-start justify-between group hover:border-neutral-700 transition-colors cursor-default">
      <div>
        <p className="text-xs text-neutral-500 uppercase tracking-wider mb-2">{title}</p>
        <h4 className="text-3xl font-light text-white">{value}</h4>
        <div className="flex items-center gap-1.5 mt-4">
          {!isZero && (
            <span className={clsx(
              "text-[10px] px-1.5 py-0.5 rounded",
              type === 'danger' ? "bg-red-900/30 text-red-500" :
              type === 'success' ? "bg-emerald-900/30 text-emerald-500" :
              isPositive ? "bg-emerald-900/30 text-emerald-500" : "bg-red-900/30 text-red-500"
            )}>
              {trend}
            </span>
          )}
          <span className="text-[10px] text-neutral-500">vs last week</span>
        </div>
      </div>
    </div>
  );
}

// Needed because we use clsx in the same file for simplicity here
import { clsx } from 'clsx';
