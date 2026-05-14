import { useMemo } from 'react'
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, BarChart, Bar
} from 'recharts'
import { Users, CreditCard, TrendingUp, Calendar } from 'lucide-react'

export default function AnalyticsAdmin({ users }) {
  // 1. Process data for "Users Over Time"
  const chartData = useMemo(() => {
    const groups = {}
    users.forEach(u => {
      const date = new Date(u.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
      groups[date] = (groups[date] || 0) + 1
    })
    // Sort and convert to array (last 7 days for simplicity)
    return Object.entries(groups)
      .map(([name, value]) => ({ name, value }))
      .reverse()
      .slice(-7)
  }, [users])

  // 2. Process data for Status Distribution
  const pieData = useMemo(() => {
    const paid = users.filter(u => u.status === 'paid').length
    const free = users.filter(u => u.status === 'free').length
    return [
      { name: 'Paid', value: paid, color: '#138808' },
      { name: 'Free', value: free, color: '#E07A00' }
    ]
  }, [users])

  // 3. Stats for header
  const stats = {
    total: users.length,
    paid: users.filter(u => u.status === 'paid').length,
    revenue: users.reduce((acc, u) => acc + (u.amount_paid || 0), 0),
    avgRevenue: users.length ? Math.round(users.reduce((acc, u) => acc + (u.amount_paid || 0), 0) / users.length) : 0
  }

  return (
    <div className="space-y-6">
      {/* Visual Header */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { l: 'Growth', v: `+${stats.total}`, i: Users, c: 'var(--ink)', bg: 'rgba(0,0,0,0.03)' },
          { l: 'Conversion', v: `${Math.round((stats.paid/stats.total)*100 || 0)}%`, i: TrendingUp, c: '#138808', bg: 'rgba(19,136,8,0.05)' },
          { l: 'Total Revenue', v: `₹${stats.revenue.toLocaleString()}`, i: CreditCard, c: 'var(--sf)', bg: 'rgba(255,153,51,0.05)' },
          { l: 'Avg/User', v: `₹${stats.avgRevenue}`, i: Calendar, c: '#7c3aed', bg: 'rgba(124,58,237,0.05)' },
        ].map(s => (
          <div key={s.l} className="p-6 rounded-[24px] border border-[var(--border2)] flex items-center gap-4" style={{ background: 'white' }}>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: s.bg, color: s.c }}>
              <s.i size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest mb-1">{s.l}</p>
              <p className="text-xl font-bold font-display" style={{ color: s.c }}>{s.v}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User Acquisition Chart */}
        <div className="bg-white p-6 rounded-[32px] border border-[var(--border2)] shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-bold text-lg font-display" style={{ color: 'var(--ink)' }}>User Acquisition</h3>
            <span className="text-[10px] font-bold text-[var(--muted)] uppercase bg-[var(--off)] px-2 py-1 rounded">Last 7 Days</span>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--sf)" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="var(--sf)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--muted)', fontSize: 10}} dy={10} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="value" stroke="var(--sf)" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Plan Distribution */}
        <div className="bg-white p-6 rounded-[32px] border border-[var(--border2)] shadow-sm">
          <h3 className="font-bold text-lg font-display mb-8" style={{ color: 'var(--ink)' }}>User Distribution</h3>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="h-[200px] w-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-4 w-full">
              {pieData.map(d => (
                <div key={d.name} className="flex items-center justify-between p-3 rounded-xl bg-[var(--off)]">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ background: d.color }}></div>
                    <span className="text-sm font-semibold">{d.name} Users</span>
                  </div>
                  <span className="font-bold">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
