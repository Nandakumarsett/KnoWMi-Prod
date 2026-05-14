'use client';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export default function SourceDonut({ data }: { data: any[] }) {
  const totals = data.reduce((acc, d) => ({
    qr: acc.qr + (d.qr_views || 0),
    social: acc.social + (d.social_views || 0),
    direct: acc.direct + (d.direct_views || 0),
    other: acc.other + (d.total_views - (d.qr_views || 0) - (d.social_views || 0) - (d.direct_views || 0))
  }), { qr: 0, social: 0, direct: 0, other: 0 });

  const chartData = [
    { name: 'QR Scan', value: totals.qr, color: '#3B82F6' },
    { name: 'Social', value: totals.social, color: '#10B981' },
    { name: 'Direct', value: totals.direct, color: '#F97316' },
    { name: 'Other', value: totals.other, color: '#94A3B8' },
  ].filter(d => d.value > 0);

  const totalValue = chartData.reduce((acc, curr) => acc + curr.value, 0);
  const qrPercent = totalValue ? Math.round((totals.qr / totalValue) * 100) : 0;

  return (
    <div className="h-[250px] w-full relative">
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-3xl font-black text-neutral-900">{qrPercent}%</span>
        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Scan Rate</span>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie 
            data={chartData} 
            innerRadius={75} 
            outerRadius={90} 
            paddingAngle={0} 
            dataKey="value"
            stroke="none"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
