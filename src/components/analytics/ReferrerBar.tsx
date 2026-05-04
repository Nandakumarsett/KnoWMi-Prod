'use client';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function ReferrerBar({ data }: { data: any[] }) {
  const totals = data.reduce((acc, d) => ({
    qr: acc.qr + (d.qr_views || 0),
    social: acc.social + (d.social_views || 0),
    direct: acc.direct + (d.direct_views || 0),
    other: acc.other + (d.total_views - (d.qr_views || 0) - (d.social_views || 0) - (d.direct_views || 0))
  }), { qr: 0, social: 0, direct: 0, other: 0 });

  const chartData = [
    { name: 'QR Scan', value: totals.qr, color: '#F97316' },
    { name: 'Social', value: totals.social, color: '#FB923C' },
    { name: 'Direct', value: totals.direct, color: '#FDBA74' },
    { name: 'Other', value: totals.other, color: '#1C1917' },
  ].sort((a, b) => b.value - a.value);

  return (
    <div className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} layout="vertical" margin={{ left: 0, right: 40 }}>
          <XAxis type="number" hide />
          <YAxis 
            dataKey="name" 
            type="category" 
            axisLine={false} 
            tickLine={false} 
            width={80}
            tick={{ fontSize: 10, fontWeight: '800', fill: '#111' }}
          />
          <Tooltip 
            cursor={{ fill: 'transparent' }}
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
