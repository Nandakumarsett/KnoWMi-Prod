'use client';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export default function DevicePie({ data }: { data: any }) {
  // If data is passed as a breakdown object {mobile, desktop, tablet}
  const breakdown = data?.mobile !== undefined ? data : { mobile: 0, desktop: 0, tablet: 0 };

  const chartData = [
    { name: 'Mobile', value: breakdown.mobile || 0 },
    { name: 'Desktop', value: breakdown.desktop || 0 },
    { name: 'Tablet', value: breakdown.tablet || 0 },
  ].filter(item => item.value > 0);

  const isEmpty = chartData.length === 0;
  const displayData = isEmpty ? [{ name: 'No Data', value: 1 }] : chartData;
  const COLORS = isEmpty ? ['#F5F5F4'] : ['#F97316', '#3B82F6', '#10B981']; // Orange, Blue, Green

  const dominant = displayData.reduce((acc, curr) => curr.value > acc.value ? curr : acc, displayData[0]);

  return (
    <div className="h-full w-full relative flex items-center justify-center min-h-[220px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie 
            data={displayData} 
            innerRadius={60} 
            outerRadius={80} 
            paddingAngle={isEmpty ? 0 : 8} 
            dataKey="value"
            stroke="none"
          >
            {displayData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cornerRadius={isEmpty ? 0 : 4} />
            ))}
          </Pie>
          {!isEmpty && (
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}
            />
          )}
          {!isEmpty && (
            <Legend 
              verticalAlign="bottom" 
              height={36} 
              iconType="circle"
              wrapperStyle={{ paddingTop: '20px', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}
            />
          )}
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
        <p className="text-2xl font-black text-white">
          {!isEmpty && dominant.name !== 'No Data' ? `${Math.round(dominant.value)}%` : '—'}
        </p>
        <p className="text-[10px] font-black text-neutral-400 font-bold uppercase tracking-widest mt-0.5">
          {!isEmpty && dominant.name !== 'No Data' ? dominant.name : 'Devices'}
        </p>
      </div>
    </div>
  );
}
